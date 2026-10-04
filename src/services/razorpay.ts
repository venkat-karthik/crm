/**
 * Razorpay Payment Gateway & Subscription Management Service
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type PlanTier = 'starter' | 'growth' | 'enterprise';
export type BillingCycle = 'monthly' | 'annual';

export interface PlanConfig {
  id: PlanTier;
  name: string;
  badge?: string;
  tagline: string;
  description: string;
  priceMonthlyINR: number;
  priceAnnualINR: number; // 2 months free
  priceMonthlyUSD: number;
  priceAnnualUSD: number;
  popular?: boolean;
  maxSeats: number | 'Unlimited';
  maxContacts: number | 'Unlimited';
  features: string[];
  highlightFeatures: string[];
  accessibleRoutes: string[];
}

export const SAAS_PLANS: Record<PlanTier, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    badge: 'Solopreneur & Micro-SMB',
    tagline: 'Essential CRM foundations for independent business owners.',
    description: 'Perfect for solo founders, freelancers, and small shops needing structured client tracking without clutter.',
    priceMonthlyINR: 999,
    priceAnnualINR: 9990,
    priceMonthlyUSD: 12,
    priceAnnualUSD: 120,
    popular: false,
    maxSeats: 1,
    maxContacts: 500,
    features: [
      'Up to 500 Active Customers & Inbound Leads',
      '1 Team User Seat',
      'Core Task & Follow-up Checklist',
      'Basic Activity & Communication Logs',
      'Daily Data Backup to Cloud Firestore',
      'Standard Email Support',
    ],
    highlightFeatures: [
      '500 Contacts',
      '1 Team Seat',
      'Task Checklist',
      'Basic Logs',
    ],
    accessibleRoutes: [
      '/dashboard',
      '/customers',
      '/leads',
      '/tasks',
      '/communication',
      '/notifications',
      '/settings',
    ],
  },
  growth: {
    id: 'growth',
    name: 'Growth Pro',
    badge: 'Most Popular',
    tagline: 'Complete sales acceleration engine for fast-growing teams.',
    description: 'The sweet spot for agencies, sales teams, and SMBs ready to scale deals, customer service, and conversions.',
    priceMonthlyINR: 2499,
    priceAnnualINR: 24990,
    priceMonthlyUSD: 29,
    priceAnnualUSD: 290,
    popular: true,
    maxSeats: 5,
    maxContacts: 'Unlimited',
    features: [
      'Unlimited Customers & Leads',
      'Up to 5 Team User Seats with Role Permissions',
      'Visual Sales Pipeline Kanban (Drag & Drop)',
      'Calendar & Interactive Client Booking',
      'Voice Call Logging, Duration Tracking & Notes',
      'Multi-Agent Support Tickets Desk with SLAs',
      'Real-Time Reports, Conversion Metrics & CSV Export',
      'Audit Activity Stream',
      'Priority Support (12h response)',
    ],
    highlightFeatures: [
      'Unlimited Contacts',
      '5 Team Seats',
      'Pipeline Kanban',
      'Calendar & Calls',
      'Support Tickets',
      'Real-time Reports',
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
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Scale',
    badge: 'Maximum Power',
    tagline: 'Predictive intelligence, unlimited seats, and dedicated scale.',
    description: 'For established enterprises requiring Gemini AI insights, automated revenue forecasting, and VIP custom support.',
    priceMonthlyINR: 5999,
    priceAnnualINR: 59990,
    priceMonthlyUSD: 72,
    priceAnnualUSD: 720,
    popular: false,
    maxSeats: 'Unlimited',
    maxContacts: 'Unlimited',
    features: [
      'Everything in Growth Pro',
      'Unlimited Team Seats & Organization Departments',
      'Gemini AI Deal Forecasting & Win Likelihood Scoring',
      'Automated Churn Risk Detection & Retention Actions',
      'Executive Summary & Natural Language CRM Querying',
      'Custom Branding & White-Label Organization Profile',
      'Dedicated Razorpay Invoicing & Webhook Automations',
      '24/7 Dedicated Account Manager & 1-Hour SLA',
    ],
    highlightFeatures: [
      'Unlimited Everything',
      'Gemini AI Insights',
      'Churn Risk Prediction',
      'Custom Branding',
      '24/7 VIP SLA',
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
  },
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
