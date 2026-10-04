import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Zap,
  Sparkles,
  ArrowRight,
  Lock,
  Building,
  Check,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAAS_PLANS, PlanTier, BillingCycle, initiateRazorpayPayment } from '../services/razorpay';
import { useAuth } from '../context/AuthContext';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: PlanTier;
  defaultBilling?: BillingCycle;
  onSuccessUpgrade?: (plan: PlanTier) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = 'growth',
  defaultBilling = 'monthly',
  onSuccessUpgrade,
}) => {
  const { user, updateUserPlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(defaultPlan);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(defaultBilling);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlanConfig = SAAS_PLANS[selectedPlan];
  const priceINR = billingCycle === 'annual' ? currentPlanConfig.priceAnnualINR : currentPlanConfig.priceMonthlyINR;
  const priceUSD = billingCycle === 'annual' ? currentPlanConfig.priceAnnualUSD : currentPlanConfig.priceMonthlyUSD;

  const handlePayNow = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      await initiateRazorpayPayment({
        planId: selectedPlan,
        billingCycle,
        user: {
          id: user?.id || 'usr_customer_demo',
          name: user?.name || 'Business Owner',
          email: user?.email || 'owner@business.com',
          company: user?.company || 'My Business Organization',
        },
        onSuccess: (paymentData) => {
          setLoading(false);
          setPaymentSuccess(paymentData);
          updateUserPlan(selectedPlan, billingCycle);

          // Trigger confetti burst
          try {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#0D2218', '#BA5D38', '#C5A059', '#22C55E'],
            });
          } catch (e) {
            // fallback if confetti fails
          }

          if (onSuccessUpgrade) {
            onSuccessUpgrade(selectedPlan);
          }
        },
        onError: (err) => {
          setLoading(false);
          setErrorMsg(err);
        },
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Payment initiation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl border border-[#0D2218]/15 max-w-2xl w-full overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-[#0D2218] text-[#FAF6F0] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-[#BA5D38]/20 rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#FAF6F0]/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#BA5D38] text-white">
              <Zap className="w-3 h-3 fill-current" />
              Razorpay Secured Gateway
            </span>
            <span className="text-xs text-[#FAF6F0]/70 font-mono">100% Tax Compliant</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Upgrade Your Business Plan
          </h2>
          <p className="text-sm text-[#FAF6F0]/80 mt-1 max-w-lg">
            Empower your team with full CRM automation, unlimited customer capacity, and live analytics.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0D2218]">
                Payment Successful & Plan Activated!
              </h3>
              <p className="text-sm text-[#5C6862] max-w-md mx-auto">
                Congratulations! Your business account is now active on the{' '}
                <strong className="text-[#0D2218]">{currentPlanConfig.name} Plan</strong>. All features are instantly unlocked.
              </p>

              <div className="bg-[#FAF6F0] rounded-xl p-4 max-w-sm mx-auto text-left border border-[#0D2218]/10 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-semibold text-gray-800">{paymentSuccess.paymentId || 'pay_demo_success'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan:</span>
                  <span className="font-semibold text-[#BA5D38] uppercase">{selectedPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Billing Cycle:</span>
                  <span className="font-semibold text-gray-800 capitalize">{billingCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-700">₹{priceINR.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#0D2218] text-[#FAF6F0] rounded-xl text-sm font-bold hover:bg-[#163827] shadow-lg transition-transform active:scale-95"
                >
                  Continue to Workspace
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center">
                <div className="bg-[#FAF6F0] p-1 rounded-xl border border-[#0D2218]/15 inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-[#0D2218] text-white shadow-sm'
                        : 'text-[#5C6862] hover:text-[#0D2218]'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-[#0D2218] text-white shadow-sm'
                        : 'text-[#5C6862] hover:text-[#0D2218]'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="bg-[#BA5D38] text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold">
                      Save 17% (2 Mo Free)
                    </span>
                  </button>
                </div>
              </div>

              {/* Plan Cards Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['starter', 'growth', 'enterprise'] as PlanTier[]).map((tier) => {
                  const plan = SAAS_PLANS[tier];
                  const isSelected = selectedPlan === tier;
                  const tierPrice = billingCycle === 'annual' ? plan.priceAnnualINR : plan.priceMonthlyINR;

                  return (
                    <div
                      key={tier}
                      onClick={() => setSelectedPlan(tier)}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0D2218] bg-[#FAF6F0]/80 shadow-md ring-2 ring-[#0D2218]/10'
                          : 'border-[#0D2218]/10 hover:border-[#0D2218]/30 bg-white'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2.5 right-3 bg-[#BA5D38] text-white text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                          Popular
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm text-[#0D2218]">{plan.name}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0D2218] fill-[#FAF6F0]" />}
                        </div>
                        <p className="text-[11px] text-[#5C6862] mt-0.5">{plan.badge}</p>

                        <div className="mt-3">
                          <span className="text-xl font-extrabold text-[#0D2218]">₹{tierPrice.toLocaleString()}</span>
                          <span className="text-[10px] text-[#5C6862]">
                            /{billingCycle === 'annual' ? 'yr' : 'mo'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#0D2218]/10 space-y-1 text-[11px] text-[#5C6862]">
                        <div className="flex items-center gap-1 font-semibold text-[#0D2218]">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{plan.maxSeats === 'Unlimited' ? 'Unlimited Seats' : `${plan.maxSeats} Team Seat`}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{plan.maxContacts === 'Unlimited' ? 'Unlimited Contacts' : `${plan.maxContacts} Contacts`}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary & Security info */}
              <div className="bg-[#FAF6F0] rounded-xl p-4 border border-[#0D2218]/10">
                <div className="flex justify-between items-center text-sm font-bold text-[#0D2218]">
                  <span>Order Total ({currentPlanConfig.name} - {billingCycle}):</span>
                  <span className="text-xl font-extrabold text-[#BA5D38]">
                    ₹{priceINR.toLocaleString()}
                    <span className="text-xs font-normal text-gray-500 ml-1">(approx. ${priceUSD})</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#0D2218]/10 text-xs text-[#5C6862]">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>256-bit Razorpay Encryption</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>UPI, Cards, NetBanking</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Instant SaaS Activation</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Pay Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#0D2218]/15 text-xs font-bold text-[#5C6862] hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={loading}
                  className="w-full sm:flex-1 py-3 px-6 bg-[#0D2218] hover:bg-[#163827] text-[#FAF6F0] font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Opening Razorpay Gateway...</span>
                  ) : (
                    <>
                      <span>Pay ₹{priceINR.toLocaleString()} with Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
