import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePlanAccess, FEATURE_REQUIREMENTS } from '../hooks/usePlanAccess';
import { RazorpayModal } from './RazorpayModal';
import { KairooLogo } from './KairooLogo';
import { Lock, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { SAAS_PLANS, PlanTier } from '../services/razorpay';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { currentPlan, checkAccess } = usePlanAccess();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-4">
        <div className="animate-bounce mb-4">
          <KairooLogo size="lg" variant="dark" />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#0D2218]">
          <span className="w-2 h-2 rounded-full bg-[#BA5D38] animate-ping" />
          <span>Verifying Secure Workspace Access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if current route requires a higher plan
  const access = checkAccess(location.pathname);
  if (!access.allowed && access.requirement) {
    const requiredPlanInfo = SAAS_PLANS[access.requirement.minPlan];

    return (
      <div className="min-h-screen bg-[#FAF6F0] p-4 sm:p-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-[#0D2218]/15 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#BA5D38]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 bg-[#BA5D38]/10 text-[#BA5D38] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#BA5D38]/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0D2218]/5 text-[#0D2218] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#BA5D38]" />
            Feature Locked: {requiredPlanInfo.name} Plan Required
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2218] tracking-tight">
            Unlock {access.requirement.name}
          </h2>

          <p className="text-sm text-[#5C6862] mt-2 max-w-md mx-auto">
            {access.requirement.description}
          </p>

          <div className="mt-6 p-4 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/10 text-left space-y-2">
            <div className="text-xs font-extrabold text-[#0D2218] uppercase tracking-wider">
              Upgrade to {requiredPlanInfo.name} to receive:
            </div>
            {requiredPlanInfo.features.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#1F2623]">
                <Zap className="w-3.5 h-3.5 text-[#BA5D38] shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-[#0D2218] hover:bg-[#163827] text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Upgrade with Razorpay (₹{requiredPlanInfo.priceMonthlyINR}/mo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="/dashboard"
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#0D2218]/15 text-xs font-bold text-[#5C6862] hover:bg-gray-50 text-center"
            >
              Back to Dashboard
            </a>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[#5C6862]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Secured by Razorpay
            </span>
            <span>·</span>
            <span>Instant Unlocking</span>
          </div>

          <RazorpayModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            defaultPlan={access.requirement.minPlan}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
