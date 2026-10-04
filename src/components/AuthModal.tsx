import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, ShieldCheck, Lock, Mail, User, Building, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KairooLogo } from './KairooLogo';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
}) => {
  const navigate = useNavigate();
  const { login, signup, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signup(
          fullName || 'Business Owner',
          email,
          password || 'secret123',
          company || 'Kairoo Tenant',
          'Admin',
          'growth'
        );
      } else {
        const ok = await login(email, password || 'admin123');
        if (!ok) {
          setError('Could not sign in with these credentials.');
          setLoading(false);
          return;
        }
      }
      setLoading(false);
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Authentication error.');
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const u = await signInWithGoogle();
      if (u) {
        onClose();
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication error.');
    } finally {
      setGoogleLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#07150E]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#FAF6F0] rounded-3xl border border-[#0D2218]/15 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#5C6862] hover:text-[#0D2218] hover:bg-[#0D2218]/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            {/* Logo & Headline */}
            <div className="mb-6 text-center">
              <KairooLogo size="md" variant="dark" className="justify-center mb-3" />
              <h3 className="text-2xl font-extrabold text-[#0D2218] tracking-tight">
                {mode === 'signup'
                  ? 'Start Your Growth Workspace'
                  : 'Log in to Your Kairoo Workspace'}
              </h3>
              <p className="text-xs font-medium text-[#5C6862] mt-1">
                {mode === 'signup'
                  ? 'Real-time multi-tenant CRM · Firebase Auth & Firestore'
                  : 'Access your team pipeline, deals, and reports'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full py-2.5 px-4 mb-4 bg-white border border-[#0D2218]/15 hover:bg-gray-50 rounded-xl text-xs font-extrabold text-[#0D2218] flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#0D2218]/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-[#5C6862]">
                <span className="bg-[#FAF6F0] px-3">or continue with email</span>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-[#EAE1D3] p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-[#0D2218] shadow-xs'
                    : 'text-[#5C6862] hover:text-[#0D2218]'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#0D2218] shadow-xs'
                    : 'text-[#5C6862] hover:text-[#0D2218]'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#151A18] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-xs font-medium text-[#0D2218] placeholder-[#5C6862]/60 focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#151A18] mb-1">
                      Company / Organization
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. TechNova Solutions"
                        className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-xs font-medium text-[#0D2218] placeholder-[#5C6862]/60 focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-[#151A18] mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-xs font-medium text-[#0D2218] placeholder-[#5C6862]/60 focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151A18] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-xs font-medium text-[#0D2218] placeholder-[#5C6862]/60 focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-[#0D2218] text-[#FAF6F0] rounded-xl text-xs sm:text-sm font-extrabold hover:bg-[#163827] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Processing...' : (mode === 'signup' ? 'Launch Workspace' : 'Sign In to Workspace')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Security trust footnote */}
            <div className="mt-5 pt-4 border-t border-[#0D2218]/10 flex items-center justify-center gap-2 text-[11px] text-[#5C6862] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Firebase Auth & Firestore 256-bit encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
