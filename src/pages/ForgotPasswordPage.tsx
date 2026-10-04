import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { KairooLogo } from '../components/KairooLogo';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between font-sans selection:bg-[#0D2218] selection:text-[#FAF6F0]">
      <header className="px-6 py-5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <KairooLogo size="md" variant="dark" />
        </NavLink>
        <NavLink
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C6862] hover:text-[#0D2218] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </NavLink>
      </header>

      <div className="w-full max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 border border-[#0D2218]/12 shadow-[0_20px_50px_-15px_rgba(13,34,24,0.12)]">
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl font-bold text-[#0D2218] tracking-tight mb-2">
              Reset Password
            </h1>
            <p className="text-xs text-[#5C6862]">
              Enter your work email and we'll send you recovery instructions
            </p>
          </div>

          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#0D2218]">Reset Instructions Sent</h3>
              <p className="text-xs text-[#5C6862] leading-relaxed">
                If an account exists for <span className="font-semibold text-[#0D2218]">{email}</span>, you will receive an authentication link within 2 minutes.
              </p>
              <NavLink
                to="/login"
                className="inline-block px-5 py-2.5 bg-[#0D2218] text-[#FAF6F0] text-xs font-semibold rounded-xl"
              >
                Return to Login
              </NavLink>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0D2218] mb-1.5">
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
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0D2218] hover:bg-[#163827] text-[#FAF6F0] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                Send Password Reset Link
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-[#5C6862]">
            Remember your credentials?{' '}
            <NavLink to="/login" className="font-semibold text-[#0D2218] hover:text-[#BA5D38] underline">
              Sign In
            </NavLink>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-[#5C6862]">
        © 2026 Kairoo Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
};
export default ForgotPasswordPage;
