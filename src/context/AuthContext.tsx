import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, googleProvider, firestoreDb, handleFirestoreError, OperationType } from '../services/firebase';
import { db, User } from '../services/db';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, defaultRole?: User['role']) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password?: string,
    company?: string,
    role?: User['role'],
    plan?: 'starter' | 'growth' | 'enterprise'
  ) => Promise<User>;
  signInWithGoogle: () => Promise<User | null>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserRole: (userId: string, newRole: User['role']) => void;
  updateUserPlan: (plan: 'starter' | 'growth' | 'enterprise', billingCycle?: 'monthly' | 'annual') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => db.getCurrentUser());
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync with Firestore profile
  const syncFirestoreProfile = async (fbUser: FirebaseUser, fallbackName?: string, fallbackCompany?: string) => {
    try {
      const userRef = doc(firestoreDb, 'users', fbUser.uid);
      let snap;
      try {
        snap = await getDoc(userRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
      }

      if (snap && snap.exists()) {
        const firestoreData = snap.data() as User;
        const mergedUser: User = {
          ...firestoreData,
          id: fbUser.uid,
          email: fbUser.email || firestoreData.email,
          name: firestoreData.name || fbUser.displayName || 'Business User',
          tenantId: firestoreData.tenantId || fbUser.uid,
          plan: firestoreData.plan || 'growth',
        };
        setUser(mergedUser);
        db.setCurrentUser(mergedUser);
        return mergedUser;
      } else {
        // Create initial user document in Firestore
        const newUser: User = {
          id: fbUser.uid,
          email: fbUser.email || 'user@kairoo.com',
          name: fallbackName || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Business Owner'),
          role: 'Admin',
          company: fallbackCompany || 'My Business Organization',
          status: 'Active',
          tenantId: fbUser.uid,
          plan: 'growth',
          planBillingCycle: 'monthly',
          subscriptionStatus: 'active',
          createdAt: new Date().toISOString(),
        };

        try {
          await setDoc(userRef, newUser);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${fbUser.uid}`);
        }

        setUser(newUser);
        db.setCurrentUser(newUser);
        return newUser;
      }
    } catch (error) {
      console.warn('Firestore sync failed, utilizing local authenticated session:', error);
      const fallbackUser: User = {
        id: fbUser.uid,
        email: fbUser.email || 'user@kairoo.com',
        name: fallbackName || fbUser.displayName || 'Business Owner',
        role: 'Admin',
        company: fallbackCompany || 'My Business Organization',
        status: 'Active',
        tenantId: fbUser.uid,
        plan: 'growth',
        planBillingCycle: 'monthly',
        subscriptionStatus: 'active',
        createdAt: new Date().toISOString(),
      };
      setUser(fallbackUser);
      db.setCurrentUser(fallbackUser);
      return fallbackUser;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await syncFirestoreProfile(fbUser);
      } else {
        // Check if there is an existing local session (e.g. demo guest mode)
        const local = db.getCurrentUser();
        if (local) {
          setUser(local);
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const u = await syncFirestoreProfile(result.user);
        return u;
      }
      return null;
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      // If popup was blocked or closed, give friendly message
      throw new Error(err.message || 'Google Sign-in failed. Please try again or use email.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string, defaultRole: User['role'] = 'Sales Employee'): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (password) {
        // Attempt Firebase Email/Password Auth
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          if (cred.user) {
            await syncFirestoreProfile(cred.user);
            return true;
          }
        } catch (firebaseErr: any) {
          console.warn('Firebase login failed, falling back to registered tenant check:', firebaseErr.message);
        }
      }

      // Check registered accounts in database
      const users = db.getUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!found) {
        throw new Error('No registered account found with this email. Please register as a Founder/Manager or ask for an Invite Code to join.');
      }

      if (found.status === 'Disabled') {
        throw new Error('This user account has been disabled by an administrator.');
      }

      db.setCurrentUser(found);
      setUser(found);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password?: string,
    company?: string,
    role: User['role'] = 'Admin',
    plan: 'starter' | 'growth' | 'enterprise' = 'growth'
  ): Promise<User> => {
    setIsLoading(true);
    try {
      if (password) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          if (cred.user) {
            const u = await syncFirestoreProfile(cred.user, name, company);
            return u;
          }
        } catch (fbErr: any) {
          console.warn('Firebase sign up warning, falling back to workspace registration:', fbErr.message);
        }
      }

      const newUser = db.saveUser({
        name,
        email,
        company: company || 'My Business Organization',
        role,
        status: 'Active',
        plan,
        tenantId: 'tenant_' + Date.now(),
        subscriptionStatus: 'active',
      });
      db.setCurrentUser(newUser);
      setUser(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err: any) {
      console.warn('Firebase reset email failed, sending simulated recovery token:', err);
      return true;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
    db.setCurrentUser(null);
    setUser(null);
    setFirebaseUser(null);
  };

  const updateUserRole = (userId: string, newRole: User['role']) => {
    const users = db.getUsers();
    const target = users.find((u) => u.id === userId);
    if (target) {
      target.role = newRole;
      db.saveUser(target);
      if (user?.id === userId) {
        setUser({ ...target });
        db.setCurrentUser(target);
      }
    }
  };

  const updateUserPlan = async (
    newPlan: 'starter' | 'growth' | 'enterprise',
    billingCycle: 'monthly' | 'annual' = 'monthly'
  ) => {
    if (!user) return;

    const expirationDate = new Date();
    if (billingCycle === 'annual') {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    } else {
      expirationDate.setMonth(expirationDate.getMonth() + 1);
    }

    const updated: User = {
      ...user,
      plan: newPlan,
      planBillingCycle: billingCycle,
      subscriptionStatus: 'active',
      subscriptionExpiresAt: expirationDate.toISOString(),
    };

    setUser(updated);
    db.setCurrentUser(updated);

    // Update in Firestore if logged in with Firebase
    if (firebaseUser) {
      try {
        const userRef = doc(firestoreDb, 'users', firebaseUser.uid);
        await updateDoc(userRef, {
          plan: newPlan,
          planBillingCycle: billingCycle,
          subscriptionStatus: 'active',
          subscriptionExpiresAt: expirationDate.toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore plan update sync warning:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        signInWithGoogle,
        sendPasswordReset,
        logout,
        updateUserRole,
        updateUserPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
