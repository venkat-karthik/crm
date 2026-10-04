import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  X as XIcon,
  Shield,
  Zap,
  CreditCard,
  Lock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { RazorpayModal } from '../components/RazorpayModal';
import { AuthModal } from '../components/AuthModal';
import { DemoModal } from '../components/DemoModal';
import { SAAS_PLANS, PlanTier, BillingCycle } from '../services/razorpay';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanTier | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSelectPlan = (tier: PlanTier) => {
    setSelectedPlanForCheckout(tier);
  };

  const faqs = [
    {
      q: 'Which payment methods are accepted through Razorpay?',
      a: 'We accept all major Indian & International debit/credit cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm, BHIM), NetBanking across 50+ banks, and popular mobile wallets.',
    },
    {
      q: 'Can I switch or upgrade my plan at any time?',
      a: 'Yes! You can upgrade anytime. Your new features and seats will be activated immediately, and Razorpay handles prorated billing seamlessly.',
    },
    {
      q: 'Do you provide GST compliant invoices?',
      a: 'Absolutely. Every transaction processed through our Razorpay checkout issues an instant tax invoice with 18% GST breakdown and your company GSTIN.',
    },
    {
      q: 'Is my business and customer data secure?',
      a: 'Yes. All data is isolated per tenant and encrypted in Google Cloud Firestore with strict multi-tenant access controls and TLS 1.3 encryption in transit.',
    },
    {
      q: 'What is the cancellation policy?',
      a: 'You can cancel anytime with a single click in your Settings dashboard. Your plan will remain active until the end of your current billing period.',
    },
  ];

  const comparisonRows = [
    { category: 'CRM & Contacts', name: 'Contact & Lead Limit', starter: '500 Contacts', growth: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'CRM & Contacts', name: 'Team User Seats', starter: '1 Seat', growth: 'Up to 5 Seats', enterprise: 'Unlimited Seats' },
    { category: 'CRM & Contacts', name: 'Task Checklist & Activity Log', starter: true, growth: true, enterprise: true },
    { category: 'Sales Automation', name: 'Visual Deals Pipeline Kanban', starter: false, growth: true, enterprise: true },
    { category: 'Sales Automation', name: 'Drag & Drop Stage Velocity', starter: false, growth: true, enterprise: true },
    { category: 'Sales Automation', name: 'Expected Close Date Forecasts', starter: false, growth: true, enterprise: true },
    { category: 'Communications', name: 'Email & Note Logging', starter: true, growth: true, enterprise: true },
    { category: 'Communications', name: 'VoIP Call Logging & Duration', starter: false, growth: true, enterprise: true },
    { category: 'Communications', name: 'Calendar & Meeting Scheduler', starter: false, growth: true, enterprise: true },
    { category: 'Customer Support', name: 'Helpdesk Tickets Desk', starter: false, growth: true, enterprise: true },
    { category: 'Customer Support', name: 'Ticket SLA & Priority Routing', starter: false, growth: true, enterprise: true },
    { category: 'Analytics & AI', name: 'Real-Time Reports & Metric Cards', starter: 'Basic', growth: 'Full Suite', enterprise: 'Full Suite + Exports' },
    { category: 'Analytics & AI', name: 'Gemini AI Win Likelihood Scoring', starter: false, growth: false, enterprise: true },
    { category: 'Analytics & AI', name: 'Automated Churn Risk Detection', starter: false, growth: false, enterprise: true },
    { category: 'Security & Scale', name: 'Multi-Tenant Firestore Isolation', starter: true, growth: true, enterprise: true },
    { category: 'Security & Scale', name: 'Custom Company Branding', starter: false, growth: false, enterprise: true },
    { category: 'Security & Scale', name: 'Support SLA', starter: 'Email (48h)', growth: 'Priority (12h)', enterprise: 'Dedicated VIP (1h)' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#151A18] font-sans selection:bg-[#0D2218] selection:text-[#FAF6F0] flex flex-col">
      <Navbar
        onOpenLogin={() => { setAuthMode('login'); setAuthModalOpen(true); }}
        onOpenSignup={() => { setAuthMode('signup'); setAuthModalOpen(true); }}
        onOpenDemo={() => setDemoModalOpen(true)}
      />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D2218]/5 border border-[#0D2218]/10 text-xs font-bold text-[#0D2218] uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5 text-[#BA5D38] fill-current" />
              SaaS Pricing & Plans
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0D2218] tracking-tight leading-[1.1]">
              Predictable Pricing. <br />
              <span className="font-serif italic font-normal text-[#BA5D38]">Exponential Business Growth.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#5C6862] max-w-2xl mx-auto">
              Choose the perfect plan for your business. Affordable for your budget, backed by secure Razorpay checkout and instantaneous activation.
            </p>
          </motion.div>

          {/* Billing Cycle Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="bg-white p-1 rounded-2xl border border-[#0D2218]/15 shadow-sm inline-flex items-center">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#0D2218] text-[#FAF6F0] shadow'
                    : 'text-[#5C6862] hover:text-[#0D2218]'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-[#0D2218] text-[#FAF6F0] shadow'
                    : 'text-[#5C6862] hover:text-[#0D2218]'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-[#BA5D38] text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                  Save 17% (2 Mo Free)
                </span>
              </button>
            </div>

            {/* Currency switch */}
            <div className="bg-white px-2 py-1 rounded-xl border border-[#0D2218]/15 text-xs font-bold flex items-center gap-1">
              <span className="text-[#5C6862] text-[10px]">Currency:</span>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-1 rounded-lg ${currency === 'INR' ? 'bg-[#0D2218] text-white' : 'text-[#5C6862]'}`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded-lg ${currency === 'USD' ? 'bg-[#0D2218] text-white' : 'text-[#5C6862]'}`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>

        {/* The 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-20">
          {(['starter', 'growth', 'enterprise'] as PlanTier[]).map((tier, idx) => {
            const plan = SAAS_PLANS[tier];
            const price = currency === 'INR'
              ? (billingCycle === 'annual' ? plan.priceAnnualINR : plan.priceMonthlyINR)
              : (billingCycle === 'annual' ? plan.priceAnnualUSD : plan.priceMonthlyUSD);

            const isCurrent = user?.plan === tier;

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`rounded-3xl p-7 lg:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? 'bg-[#0D2218] text-[#FAF6F0] shadow-2xl ring-4 ring-[#0D2218]/20 md:-translate-y-2'
                    : 'bg-white text-[#151A18] border border-[#0D2218]/12 shadow-md hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#BA5D38] text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${plan.popular ? 'text-[#BA5D38]' : 'text-[#BA5D38]'}`}>
                        {plan.badge}
                      </span>
                      <h3 className="text-2xl font-extrabold tracking-tight mt-1">
                        {plan.name}
                      </h3>
                    </div>
                    {isCurrent && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <p className={`text-xs mt-2 min-h-[36px] ${plan.popular ? 'text-[#FAF6F0]/75' : 'text-[#5C6862]'}`}>
                    {plan.description}
                  </p>

                  {/* Price display */}
                  <div className="mt-6 pb-6 border-b border-current/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                        {currency === 'INR' ? `₹${price.toLocaleString()}` : `$${price}`}
                      </span>
                      <span className={`text-xs font-semibold ${plan.popular ? 'text-[#FAF6F0]/70' : 'text-[#5C6862]'}`}>
                        /{billingCycle === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className={`text-[11px] mt-1 font-medium ${plan.popular ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        Billed annually (includes 2 months free!)
                      </p>
                    )}
                  </div>

                  {/* Highlights */}
                  <div className="py-6 space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-current/80">
                      What's Included:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs font-medium">
                        <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${plan.popular ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className={plan.popular ? 'text-[#FAF6F0]/90' : 'text-[#1F2623]'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upgrade Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(tier)}
                    className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow cursor-pointer active:scale-[0.98] ${
                      plan.popular
                        ? 'bg-[#FAF6F0] text-[#0D2218] hover:bg-white hover:shadow-lg'
                        : 'bg-[#0D2218] text-[#FAF6F0] hover:bg-[#163827]'
                    }`}
                  >
                    <span>{isCurrent ? 'Extend / Manage Plan' : `Get Started with ${plan.name}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className={`text-center text-[10px] mt-2.5 ${plan.popular ? 'text-[#FAF6F0]/60' : 'text-[#5C6862]'}`}>
                    Instant activation via Razorpay · Cancel anytime
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0D2218]/10 shadow-lg mb-20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2218]">
              Comprehensive Feature Comparison
            </h2>
            <p className="text-sm text-[#5C6862] mt-1">
              Compare features side by side to choose what your team requires.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#0D2218]/15">
                  <th className="py-4 px-4 font-extrabold text-[#0D2218] w-2/5 text-sm">Feature</th>
                  <th className="py-4 px-4 font-extrabold text-[#0D2218] w-1/5 text-center text-sm">Starter</th>
                  <th className="py-4 px-4 font-extrabold text-[#BA5D38] w-1/5 text-center text-sm bg-[#0D2218]/5 rounded-t-xl">Growth</th>
                  <th className="py-4 px-4 font-extrabold text-[#0D2218] w-1/5 text-center text-sm">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0D2218]/8">
                {comparisonRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#FAF6F0]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#1F2623]">
                      <span className="text-[10px] uppercase tracking-wider text-[#5C6862] block font-mono">
                        {row.category}
                      </span>
                      {row.name}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[3]" />
                        ) : (
                          <XIcon className="w-4 h-4 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold text-[#0D2218]">{row.starter}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center bg-[#0D2218]/5">
                      {typeof row.growth === 'boolean' ? (
                        row.growth ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[3]" />
                        ) : (
                          <XIcon className="w-4 h-4 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-bold text-[#BA5D38]">{row.growth}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[3]" />
                        ) : (
                          <XIcon className="w-4 h-4 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold text-[#0D2218]">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security & Razorpay Compliance Trust Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-white rounded-2xl p-6 border border-[#0D2218]/10 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#0D2218]/5 text-[#0D2218] rounded-xl shrink-0">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#0D2218]">Multi-Tenant Isolation</h4>
              <p className="text-xs text-[#5C6862] mt-1">
                Your customer data is completely isolated in Firestore with ABAC rules.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#0D2218]/10 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#0D2218]/5 text-[#0D2218] rounded-xl shrink-0">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#0D2218]">Razorpay Level 1 PCI</h4>
              <p className="text-xs text-[#5C6862] mt-1">
                Bank-grade tokenization and zero card data storage on app servers.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#0D2218]/10 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#0D2218]/5 text-[#0D2218] rounded-xl shrink-0">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#0D2218]">Firebase Auth Shield</h4>
              <p className="text-xs text-[#5C6862] mt-1">
                Google OAuth and email verification safeguards against spoofing.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#0D2218]/10 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#0D2218]/5 text-[#0D2218] rounded-xl shrink-0">
              <Building2 className="w-6 h-6 text-[#BA5D38]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#0D2218]">Instant GST Invoicing</h4>
              <p className="text-xs text-[#5C6862] mt-1">
                Automated tax receipt delivered immediately after every checkout.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0D2218]/10 shadow-lg mb-20 max-w-4xl mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2218]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#5C6862] mt-1">
              Everything you need to know about plans, billing, and security.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="border border-[#0D2218]/10 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full py-4 px-5 text-left font-extrabold text-sm text-[#0D2218] flex items-center justify-between hover:bg-[#FAF6F0]/60 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5C6862] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#BA5D38]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-[#5C6862] leading-relaxed border-t border-[#0D2218]/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-[#0D2218] text-[#FAF6F0] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#BA5D38]/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Your Customer Revenue?
          </h2>
          <p className="text-sm sm:text-base text-[#FAF6F0]/80 mt-2 max-w-xl mx-auto">
            Join hundreds of high-growth businesses using Kairoo CRM to organize leads, close deals, and elevate customer relationships.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleSelectPlan('growth')}
              className="px-7 py-3.5 bg-[#BA5D38] hover:bg-[#a34f2d] text-white font-extrabold text-sm rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              Start on Growth Plan Today
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-[#FAF6F0] font-extrabold text-sm rounded-full border border-white/20 transition-all cursor-pointer"
            >
              Explore CRM Workspace
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Razorpay Checkout Modal */}
      {selectedPlanForCheckout && (
        <RazorpayModal
          isOpen={!!selectedPlanForCheckout}
          onClose={() => setSelectedPlanForCheckout(null)}
          defaultPlan={selectedPlanForCheckout}
          defaultBilling={billingCycle}
          onSuccessUpgrade={(upgradedPlan) => {
            console.log('Upgraded to', upgradedPlan);
          }}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Demo Modal */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onOpenSignup={() => {
          setDemoModalOpen(false);
          setAuthMode('signup');
          setAuthModalOpen(true);
        }}
      />
    </div>
  );
};
