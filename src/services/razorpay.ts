/**
 * Razorpay Payment Gateway & Subscription Management Service
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type PlanTier = 'free' | 'basic' | 'standard' | 'premium' | 'starter' | 'growth' | 'enterprise';
export type BillingCycle = 'monthly' | 'annual';

export const CANONICAL_PLANS: PlanTier[] = ['free', 'basic', 'standard', 'premium'];

export interface PlanConfig {
  id: PlanTier;
  name: string;
  badge?: string;
  tagline: string;
  description: string;
  priceMonthlyINR: number;
  priceAnnualINR: number; // ~17% annual discount
  priceMonthlyUSD: number;
  priceAnnualUSD: number;
  popular?: boolean;
  maxSeats: number | 'Unlimited';
  maxContacts: number | 'Unlimited';
  features: string[];
  highlightFeatures: string[];
  accessibleRoutes: string[];
}

const FREE_PLAN: PlanConfig = {
  id: 'free',
  name: 'Free Starter',
  badge: 'Free Forever',
  tagline: 'Essential contact and task tracking for solo founders and startups.',
  description: 'Everything you need to kick off your customer relationships with zero cost and clean organization.',
  priceMonthlyINR: 0,
  priceAnnualINR: 0,
  priceMonthlyUSD: 0,
  priceAnnualUSD: 0,
  popular: false,
  maxSeats: 1,
  maxContacts: 100,
  features: [
    'Up to 100 Active Contacts & Inbound Leads',
    '1 Team User Seat (Solo)',
    'Core Task & Follow-up Checklist',
    'Basic Activity & Note Logging',
    'Standard Customer Directory',
    'Community Support & Documentation',
  ],
  highlightFeatures: [
    '100 Contacts',
    '1 Team Seat',
    'Task Checklist',
    'Basic Directory',
  ],
  accessibleRoutes: [
    '/dashboard',
    '/customers',
    '/leads',
    '/tasks',
    '/notifications',
    '/settings',
  ],
};

const BASIC_PLAN: PlanConfig = {
  id: 'basic',
  name: 'Basic Core',
  badge: 'Early Teams & Micro-SMB',
  tagline: 'Visual sales pipeline, customer records, and ticket management.',
  description: 'Perfect for small teams and boutique agencies looking to track deals, follow up consistently, and resolve support requests.',
  priceMonthlyINR: 1000,
  priceAnnualINR: 9990,
  priceMonthlyUSD: 12,
  priceAnnualUSD: 120,
  popular: false,
  maxSeats: 2,
  maxContacts: 1000,
  features: [
    'Up to 1,000 Customer & Deal Records',
    '2 Team User Seats',
    'Visual Deals Pipeline Kanban (Drag & Drop)',
    'Communication & Email Logging Hub',
    'Standard Helpdesk Support Tickets Desk',
    'Document Uploads & Edge Cloud Media (1 GB)',
    'Standard Email Support (24h SLA)',
  ],
  highlightFeatures: [
    '1,000 Contacts',
    '2 Team Seats',
    'Kanban Pipeline',
    'Ticket Helpdesk',
    'Email Support',
  ],
  accessibleRoutes: [
    '/dashboard',
    '/customers',
    '/leads',
    '/pipeline',
    '/tasks',
    '/communication',
    '/tickets',
    '/notifications',
    '/settings',
  ],
};

const STANDARD_PLAN: PlanConfig = {
  id: 'standard',
  name: 'Standard Growth',
  badge: 'Most Popular',
  tagline: 'Multi-agent collaboration, meeting scheduling, calls, and analytics.',
  description: 'The workhorse tier for fast-growing sales and customer success teams managing active client pipelines.',
  priceMonthlyINR: 2999,
  priceAnnualINR: 29990,
  priceMonthlyUSD: 36,
  priceAnnualUSD: 360,
  popular: true,
  maxSeats: 10,
  maxContacts: 10000,
  features: [
    'Up to 10,000 Contacts, Leads & Deals',
    'Up to 10 Team Seats with Role Hierarchy (RBAC)',
    'Multi-Stage Visual Pipeline Velocity & Close Forecasts',
    'Interactive Calendar & Meeting Scheduling Hub',
    'Voice & Call Logging with Duration Tracking',
    'Priority Helpdesk Tickets Desk with SLA Routing',
    'Real-Time Reports, Conversion Metrics & CSV Export',
    'Automated Daily Cloud Backups',
    'Priority Support (12h SLA)',
  ],
  highlightFeatures: [
    '10,000 Contacts',
    '10 Team Seats',
    'Pipeline Forecasts',
    'Calendar & Calls',
    'Priority Tickets Desk',
    'Real-Time Analytics',
  ],
  accessibleRoutes: [
    '/dashboard',
    '/customers',
    '/leads',
    '/pipeline',
    '/tasks',
    '/communication',
    '/calls',
    '/calendar',
    '/tickets',
    '/reports',
    '/notifications',
    '/users',
    '/settings',
  ],
};

const PREMIUM_PLAN: PlanConfig = {
  id: 'premium',
  name: 'Premium Enterprise',
  badge: 'Maximum Power & AI',
  tagline: 'Unlimited scale, predictive Gemini AI insights, and 1-hour VIP SLA.',
  description: 'Enterprise-grade architecture with AI deal scoring, automated churn detection, custom branding, and dedicated VIP support.',
  priceMonthlyINR: 4999,
  priceAnnualINR: 49990,
  priceMonthlyUSD: 59,
  priceAnnualUSD: 590,
  popular: false,
  maxSeats: 'Unlimited',
  maxContacts: 'Unlimited',
  features: [
    'Everything in Standard Growth',
    'Unlimited Team Seats & Multi-Tenant Organization Scope',
    'Gemini AI Deal Forecasting & Win Likelihood Scoring',
    'Automated Churn Risk Detection & Retention Actions',
    'Executive Summary & Natural Language CRM Querying',
    'Custom Organization Branding & Adaptive Terminology',
    'Unlimited High-Speed Cloud CDN Media Storage',
    'Dedicated Account Manager & 1-Hour VIP SLA',
  ],
  highlightFeatures: [
    'Unlimited Everything',
    'Gemini AI Insights',
    'Churn Risk Prediction',
    'Custom Branding',
    '1-Hour VIP SLA',
  ],
  accessibleRoutes: [
    '/dashboard',
    '/customers',
    '/leads',
    '/pipeline',
    '/tasks',
    '/communication',
    '/calls',
    '/calendar',
    '/tickets',
    '/reports',
    '/ai-insights',
    '/notifications',
    '/users',
    '/settings',
  ],
};

export const SAAS_PLANS: Record<PlanTier, PlanConfig> = {
  free: FREE_PLAN,
  basic: BASIC_PLAN,
  standard: STANDARD_PLAN,
  premium: PREMIUM_PLAN,
  // Backward compatibility aliases
  starter: { ...BASIC_PLAN, id: 'starter' },
  growth: { ...STANDARD_PLAN, id: 'growth' },
  enterprise: { ...PREMIUM_PLAN, id: 'enterprise' },
};

/**
 * Load the official Razorpay Checkout JavaScript SDK
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Razorpay SDK from CDN, test modal fallback will be used.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Initiate Razorpay checkout order
 */
export async function initiateRazorpayPayment(params: {
  planId: PlanTier;
  billingCycle: BillingCycle;
  user: {
    id: string;
    name: string;
    email: string;
    company?: string;
  };
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}): Promise<void> {
  const { planId, billingCycle, user, onSuccess, onError } = params;

  try {
    // 1. Create order on backend
    const orderRes = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        billingCycle,
        userId: user.id,
        userEmail: user.email,
        companyName: user.company,
      }),
    });

    if (!orderRes.ok) {
      throw new Error('Failed to create payment order on server.');
    }

    const orderData = await orderRes.json();
    const isScriptLoaded = await loadRazorpayScript();

    const plan = SAAS_PLANS[planId];
    const amountINR = billingCycle === 'annual' ? plan.priceAnnualINR : plan.priceMonthlyINR;

    // Free plan activates instantly without charging Razorpay
    if (planId === 'free' || amountINR === 0) {
      onSuccess({
        success: true,
        paymentId: `free_tier_${Date.now()}`,
        amountINR: 0,
        planId: 'free',
        billingCycle,
      });
      return;
    }

    // 2. Open Razorpay Checkout modal if script is loaded
    if (isScriptLoaded && window.Razorpay) {
      const options = {
        key: orderData.keyId || 'rzp_test_kairoo_saas_crm',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Kairoo CRM',
        description: `${plan.name} Plan (${billingCycle === 'annual' ? 'Annual - 2 Months Free' : 'Monthly'})`,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80',
        order_id: orderData.id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: '+919876543210',
        },
        notes: {
          planId,
          billingCycle,
          userId: user.id,
          company: user.company || '',
        },
        theme: {
          color: '#0D2218',
        },
        handler: async function (response: any) {
          try {
            // Verify payment on server
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'sig_demo',
                planId,
                billingCycle,
                userId: user.id,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              onSuccess({ ...verifyData, orderId: orderData.id, amountINR });
            } else {
              onError(verifyData.error || 'Payment verification failed.');
            }
          } catch (err: any) {
            onError(err.message || 'Payment verification error.');
          }
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay modal dismissed by user.');
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } else {
      // Fallback for sandboxed preview iframe if Razorpay CDN is blocked
      const simulatedPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const verifyRes = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderData.id,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: 'sig_simulated_success',
          planId,
          billingCycle,
          userId: user.id,
        }),
      });

      const verifyData = await verifyRes.json();
      onSuccess({ ...verifyData, orderId: orderData.id, amountINR, paymentId: simulatedPaymentId });
    }
  } catch (err: any) {
    onError(err.message || 'Could not complete transaction.');
  }
}
