import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KairooLogo } from '../components/KairooLogo';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, AlertCircle, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const destination = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your registered email address and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(destination);
      } else {
        setError('Invalid email or password. Please verify credentials or register.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const u = await signInWithGoogle();
      if (u) {
        navigate(destination);
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between font-sans selection:bg-[#0D2218] selection:text-[#FAF6F0]">
      {/* Top Bar */}
      <header className="px-6 py-5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <KairooLogo size="md" variant="dark" />
        </NavLink>
        <div className="flex items-center gap-4">
          <NavLink
            to="/pricing"
            className="text-xs font-extrabold text-[#0D2218] hover:text-[#BA5D38] transition-colors"
          >
            Plans & Pricing
          </NavLink>
          <NavLink
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C6862] hover:text-[#0D2218] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </NavLink>
        </div>
      </header>

      {/* Center Auth Card */}
      <div className="w-full max-w-md mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-3xl p-8 border border-[#0D2218]/12 shadow-[0_20px_50px_-15px_rgba(13,34,24,0.12)]"
        >
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#0D2218]/5 text-[#0D2218] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Firebase Secured Auth
            </span>
            <h1 className="text-3xl font-extrabold text-[#0D2218] tracking-tight mb-1">
              Sign In to Workspace
            </h1>
            <p className="text-xs font-medium text-[#5C6862]">
              Access your business organization, team progress, or client portal
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
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 mb-4 bg-white border border-[#0D2218]/15 hover:bg-[#FAF6F0] rounded-xl text-xs font-extrabold text-[#0D2218] flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
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
            <div className="relative flex justify-center text-[10px] uppercase font-extrabold tracking-wider text-[#5C6862]">
              <span className="bg-white px-3">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-extrabold text-[#0D2218] mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-extrabold text-[#0D2218]">
                  Password
                </label>
                <NavLink
                  to="/forgot-password"
                  className="text-[11px] font-bold text-[#BA5D38] hover:underline"
                >
                  Forgot password?
                </NavLink>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0D2218] hover:bg-[#163827] text-[#FAF6F0] rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Join with Invite Code Callout */}
          <div className="mt-6 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/10 text-center">
            <span className="text-[11px] text-[#5C6862] block mb-1">
              Joining an agency or company with an Invite Code?
            </span>
            <NavLink
              to="/signup?track=join"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0D2218] hover:text-[#BA5D38]"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#BA5D38]" />
              <span>Enter Code & Join Workspace →</span>
            </NavLink>
          </div>

          <div className="mt-6 text-center text-xs text-[#5C6862]">
            Don't have an organization yet?{' '}
            <NavLink to="/signup" className="font-extrabold text-[#0D2218] hover:text-[#BA5D38] underline">
              Register as Founder
            </NavLink>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-semibold text-[#5C6862]">
        © 2026 Kairoo Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
