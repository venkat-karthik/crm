import { useAuth } from '../context/AuthContext';
import { SAAS_PLANS, PlanTier } from '../services/razorpay';

export interface PlanFeatureRequirement {
  id: string;
  name: string;
  minPlan: PlanTier;
  description: string;
}

export const FEATURE_REQUIREMENTS: Record<string, PlanFeatureRequirement> = {
  '/pipeline': {
    id: '/pipeline',
    name: 'Sales Deals Pipeline Kanban',
    minPlan: 'growth',
    description: 'Visual drag-and-drop pipeline stages, deal probabilities, and revenue forecasting.',
  },
  '/calls': {
    id: '/calls',
    name: 'VoIP Call Logging & Call Tracking',
    minPlan: 'growth',
    description: 'Log inbound/outbound calls, call duration logs, and follow-up reminders.',
  },
  '/calendar': {
    id: '/calendar',
    name: 'Calendar & Meeting Scheduler',
    minPlan: 'growth',
    description: 'Schedule appointments, client demos, and integrate client follow-up timings.',
  },
  '/tickets': {
    id: '/tickets',
    name: 'Multi-Agent Support Tickets Desk',
    minPlan: 'growth',
    description: 'Customer service helpdesk with ticket priorities, categories, and SLA workflows.',
  },
  '/reports': {
    id: '/reports',
    name: 'Advanced Reports & Conversion Analytics',
    minPlan: 'growth',
    description: 'Deep funnel analysis, revenue pipeline charts, win/loss rates, and CSV exports.',
  },
  '/ai-insights': {
    id: '/ai-insights',
    name: 'Gemini AI Deal Forecasting & Strategic Insights',
    minPlan: 'enterprise',
    description: 'Gemini AI predictive win likelihood scoring, customer churn warnings, and strategic action plans.',
  },
  '/users': {
    id: '/users',
    name: 'Multi-User Team Management & RBAC',
    minPlan: 'growth',
    description: 'Invite sales reps, support agents, and managers with granular role permissions.',
  },
};

export function usePlanAccess() {
  const { user } = useAuth();
  const currentPlan: PlanTier = user?.plan || 'starter';

  const checkAccess = (routeOrFeatureKey: string): {
    allowed: boolean;
    requirement?: PlanFeatureRequirement;
    currentPlan: PlanTier;
  } => {
    // If not in requirements, allowed by default
    const req = FEATURE_REQUIREMENTS[routeOrFeatureKey];
    if (!req) {
      return { allowed: true, currentPlan };
    }

    if (req.minPlan === 'growth') {
      const allowed = currentPlan === 'growth' || currentPlan === 'enterprise';
      return { allowed, requirement: req, currentPlan };
    }

    if (req.minPlan === 'enterprise') {
      const allowed = currentPlan === 'enterprise';
      return { allowed, requirement: req, currentPlan };
    }

    return { allowed: true, requirement: req, currentPlan };
  };

  const getPlanInfo = (tier: PlanTier = currentPlan) => {
    return SAAS_PLANS[tier] || SAAS_PLANS.starter;
  };

  return {
    currentPlan,
    planInfo: getPlanInfo(currentPlan),
    checkAccess,
    getPlanInfo,
  };
}
