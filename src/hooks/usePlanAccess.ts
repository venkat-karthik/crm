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
    minPlan: 'basic',
    description: 'Visual drag-and-drop pipeline stages, deal probabilities, and revenue forecasting.',
  },
  '/tickets': {
    id: '/tickets',
    name: 'Support Tickets Desk',
    minPlan: 'basic',
    description: 'Customer service helpdesk with ticket priorities, categories, and resolution tracking.',
  },
  '/calls': {
    id: '/calls',
    name: 'VoIP Call Logging & Call Tracking',
    minPlan: 'standard',
    description: 'Log inbound/outbound calls, call duration logs, and follow-up reminders.',
  },
  '/calendar': {
    id: '/calendar',
    name: 'Calendar & Meeting Scheduler',
    minPlan: 'standard',
    description: 'Schedule appointments, client demos, and integrate client follow-up timings.',
  },
  '/reports': {
    id: '/reports',
    name: 'Advanced Reports & Conversion Analytics',
    minPlan: 'standard',
    description: 'Deep funnel analysis, revenue pipeline charts, win/loss rates, and CSV exports.',
  },
  '/users': {
    id: '/users',
    name: 'Multi-User Team Management & RBAC',
    minPlan: 'standard',
    description: 'Invite sales reps, support agents, and managers with granular role permissions.',
  },
  '/ai-insights': {
    id: '/ai-insights',
    name: 'Gemini AI Deal Forecasting & Strategic Insights',
    minPlan: 'premium',
    description: 'Gemini AI predictive win likelihood scoring, customer churn warnings, and strategic action plans.',
  },
};

const PLAN_RANKS: Record<string, number> = {
  free: 0,
  starter: 1,
  basic: 1,
  growth: 2,
  standard: 2,
  enterprise: 3,
  premium: 3,
};

export function usePlanAccess() {
  const { user } = useAuth();
  const currentPlan: PlanTier = user?.plan || 'basic';

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

    const userRank = PLAN_RANKS[currentPlan] ?? 1;
    const requiredRank = PLAN_RANKS[req.minPlan] ?? 1;

    const allowed = userRank >= requiredRank;
    return { allowed, requirement: req, currentPlan };
  };

  const getPlanInfo = (tier: PlanTier = currentPlan) => {
    return SAAS_PLANS[tier] || SAAS_PLANS.basic;
  };

  return {
    currentPlan,
    planInfo: getPlanInfo(currentPlan),
    checkAccess,
    getPlanInfo,
  };
}
