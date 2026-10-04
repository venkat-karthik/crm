import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Target,
  GitBranch,
  CheckSquare,
  MessageSquare,
  PhoneCall,
  Calendar as CalendarIcon,
  LifeBuoy,
  BarChart3,
  Sparkles,
  Bell,
  UserCheck,
  Settings as SettingsIcon,
  Search,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Lock,
  Zap,
  CreditCard,
  ShieldCheck,
  KeyRound,
  UserPlus,
  Briefcase,
  Layers,
  Cloud,
} from 'lucide-react';
import { KairooLogo } from './KairooLogo';
import { useAuth } from '../context/AuthContext';
import { db, isMasterFounder, MASTER_FOUNDER_EMAIL } from '../services/db';
import { usePlanAccess } from '../hooks/usePlanAccess';
import { RazorpayModal } from './RazorpayModal';
import { InviteManagerModal } from './InviteManagerModal';
import { CloudinaryMediaManager } from './CloudinaryMediaManager';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPlan, planInfo, checkAccess } = usePlanAccess();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCloudinaryModal, setShowCloudinaryModal] = useState(false);

  // User role category - Only karthikvenkat316@gmail.com is Master Founder with full feature access
  const isMaster = isMasterFounder(user);
  const isFounder = isMaster || user?.role === 'Founder';
  const isFounderOrManager = isFounder || user?.role === 'Manager' || user?.role === 'Admin' || user?.role === 'Owner';
  const isClient = user?.role === 'Client';
  const isEmployee = !isClient && !isFounder && !isFounderOrManager;

  // Dynamic terminology & adaptive CRM mode from organization onboarding survey
  const clientsLabel = user?.crmCustomization?.clientsLabel || 'Clients';
  const dealsLabel = user?.crmCustomization?.dealsLabel || 'Projects';
  const crmType = user?.crmCustomization?.crmType || 'hybrid';
  const crmModeLabel =
    crmType === 'agency'
      ? 'Agency Delivery'
      : crmType === 'sales_b2b'
      ? 'B2B Sales'
      : crmType === 'services'
      ? 'Consulting Hub'
      : 'Enterprise CRM';

  // Unread notifications count
  const unreadNotifs = db.getNotifications().filter((n) => !n.isRead).length;

  // Master Navigation Items
  const allNavItems = [
    { name: isClient ? 'Client Portal Overview' : 'Dashboard', path: '/dashboard', icon: LayoutDashboard, visibleFor: ['founder', 'employee', 'client'] },
    { name: `${clientsLabel} Directory`, path: '/customers', icon: Users, visibleFor: ['founder', 'employee', 'client'] },
    { name: 'Leads', path: '/leads', icon: Target, visibleFor: ['founder', 'employee'] },
    { name: `${dealsLabel} Pipeline`, path: '/pipeline', icon: GitBranch, visibleFor: ['founder', 'employee'] },
    { name: 'Tasks & Checklist', path: '/tasks', icon: CheckSquare, visibleFor: ['founder', 'employee'] },
    { name: 'Communication', path: '/communication', icon: MessageSquare, visibleFor: ['founder', 'employee', 'client'] },
    { name: 'Calls Log', path: '/calls', icon: PhoneCall, visibleFor: ['founder', 'employee'] },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon, visibleFor: ['founder', 'employee'] },
    { name: 'Support Tickets', path: '/tickets', icon: LifeBuoy, visibleFor: ['founder', 'employee', 'client'] },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3, visibleFor: ['founder'] },
    { name: 'AI Insights', path: '/ai-insights', icon: Sparkles, badge: 'AI', visibleFor: ['founder'] },
    { name: 'Notifications', path: '/notifications', icon: Bell, count: unreadNotifs, visibleFor: ['founder', 'employee', 'client'] },
    { name: 'Team & Invites', path: '/users', icon: UserCheck, visibleFor: ['founder'] },
    { name: 'Settings', path: '/settings', icon: SettingsIcon, visibleFor: ['founder', 'employee', 'client'] },
  ];

  const currentRoleCategory = isClient ? 'client' : (isEmployee ? 'employee' : (isFounder ? 'founder' : 'employee'));
  const navItems = allNavItems.filter((item) => item.visibleFor.includes(currentRoleCategory));

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) {
      const results = db.globalSearch(q);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(result.route);
  };

  const planBadgeColors = {
    starter: 'bg-amber-100 text-amber-900 border-amber-300',
    growth: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    enterprise: 'bg-[#0D2218] text-[#C5A059] border-[#C5A059]/40',
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#151A18] flex flex-col font-sans selection:bg-[#0D2218] selection:text-[#FAF6F0]">
      {/* Top Application Bar */}
      <header className="h-16 bg-[#FAF6F0] border-b border-[#0D2218]/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 text-[#0D2218] hover:bg-[#0D2218]/5 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <NavLink to="/dashboard" className="flex items-center gap-2">
            <KairooLogo size="sm" variant="dark" />
          </NavLink>

          <div className="hidden lg:flex items-center text-xs text-[#5C6862] gap-2 pl-3 border-l border-[#0D2218]/10">
            <span className="font-bold text-[#0D2218]">{user?.company || 'Workspace'}</span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#BA5D38]/10 text-[#BA5D38] border border-[#BA5D38]/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#BA5D38]" />
              <span>{crmModeLabel}</span>
            </span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-extrabold text-[#0D2218]">{title}</span>
          </div>
        </div>

        {/* Global Search Bar (for non-clients) */}
        {!isClient && (
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search ${clientsLabel.toLowerCase()}, leads, tickets... (⌘K)`}
                value={searchQuery}
                onFocus={() => setShowSearchModal(true)}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-12 py-1.5 bg-white border border-[#0D2218]/12 rounded-xl text-xs font-medium text-[#0D2218] placeholder-[#5C6862]/70 focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
              />
              <kbd className="absolute right-2.5 top-2 text-[10px] font-mono bg-[#FAF6F0] border border-[#0D2218]/10 px-1.5 py-0.5 rounded text-[#5C6862]">
                ⌘K
              </kbd>
            </div>
          </div>
        )}

        {/* User Badge, Invite Code Trigger & Plan Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloudinary CDN Media Manager Trigger Button */}
          <button
            type="button"
            onClick={() => setShowCloudinaryModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#0D2218] hover:text-white text-[#0D2218] border border-[#0D2218]/15 text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Open Cloudinary Media & Photos CDN"
          >
            <Cloud className="w-3.5 h-3.5 text-[#3448C5]" />
            <span className="hidden md:inline">Cloudinary CDN</span>
          </button>

          {/* Founder Invite Codes Trigger Button */}
          {isFounderOrManager && (
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Invite Codes</span>
            </button>
          )}

          {/* SaaS Plan Badge (for Founder) */}
          {isFounderOrManager && (
            <div className="flex items-center gap-1.5">
              <div
                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border flex items-center gap-1 shadow-xs ${
                  planBadgeColors[currentPlan] || planBadgeColors.growth
                }`}
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>{planInfo.name}</span>
              </div>

              {currentPlan !== 'enterprise' && (
                <button
                  type="button"
                  onClick={() => setShowRazorpayModal(true)}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-[#BA5D38] hover:bg-[#a34f2d] text-white text-[11px] font-extrabold rounded-full shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Upgrade</span>
                </button>
              )}
            </div>
          )}

          {/* Client or Employee Badge */}
          {isClient && (
            <div className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              Client Portal
            </div>
          )}
          {isEmployee && (
            <div className="px-3 py-1 bg-blue-100 border border-blue-300 text-blue-900 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              Employee Team
            </div>
          )}

          <NavLink
            to="/notifications"
            className="relative p-2 rounded-xl text-[#0D2218] hover:bg-[#0D2218]/5 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#BA5D38] animate-pulse" />
            )}
          </NavLink>

          <div className="flex items-center gap-2 pl-2 border-l border-[#0D2218]/10">
            <div className="w-8 h-8 rounded-full bg-[#0D2218] text-[#FAF6F0] flex items-center justify-center text-xs font-extrabold shadow-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-extrabold text-[#0D2218] leading-tight">
                {user?.name || 'Authorized User'}
              </span>
              <span className="text-[10px] font-bold text-[#BA5D38]">
                {user?.role || 'Founder'} · {user?.company || 'Organization'}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="p-1.5 text-[#5C6862] hover:text-red-700 hover:bg-red-50 rounded-lg ml-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Framework: Sidebar + Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Sidebar (Desktop) */}
        <aside className="w-64 bg-[#F4EFE6] border-r border-[#0D2218]/10 p-3 hidden md:flex flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            <div className="px-3 py-2 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C6862]">
                {isClient ? 'Client Hub' : isEmployee ? 'Employee Workspace' : 'Enterprise Suite'}
              </span>
              <span className="text-[9px] font-extrabold bg-[#0D2218] text-[#FAF6F0] px-2 py-0.5 rounded tracking-wider uppercase">
                {user?.role || 'Founder'}
              </span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const access = checkAccess(item.path);
                const isLocked = !access.allowed;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#0D2218] text-[#FAF6F0] shadow-sm'
                        : isLocked
                        ? 'text-[#5C6862]/70 hover:bg-[#0D2218]/4 opacity-80'
                        : 'text-[#2D3632] hover:bg-[#0D2218]/6'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C5A059]' : 'text-[#5C6862]'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isLocked && (
                        <span title={`Requires ${access.requirement?.minPlan} plan`}>
                          <Lock className="w-3.5 h-3.5 text-amber-700/80" />
                        </span>
                      )}

                      {item.badge ? (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                            isActive ? 'bg-[#FAF6F0]/20 text-[#FAF6F0]' : 'bg-[#BA5D38]/15 text-[#BA5D38]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : item.count && item.count > 0 ? (
                        <span className="text-[9px] font-extrabold bg-[#BA5D38] text-white px-1.5 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      ) : null}
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Hub */}
          <div className="pt-3 border-t border-[#0D2218]/10 space-y-2.5">
            {/* Cloudinary CDN Media Access */}
            <button
              type="button"
              onClick={() => {
                setShowCloudinaryModal(true);
                setMobileSidebarOpen(false);
              }}
              className="w-full p-2.5 bg-white border border-[#0D2218]/12 rounded-xl hover:border-[#0D2218]/30 flex items-center justify-between text-left text-xs font-extrabold text-[#0D2218] shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#3448C5]" />
                <span>Cloudinary CDN Assets</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#5C6862]" />
            </button>

            {/* Founder Invite Codes Quick Access */}
            {isFounderOrManager && (
              <button
                type="button"
                onClick={() => {
                  setShowInviteModal(true);
                  setMobileSidebarOpen(false);
                }}
                className="w-full p-2.5 bg-white border border-[#0D2218]/12 rounded-xl hover:border-[#0D2218]/30 flex items-center justify-between text-left text-xs font-extrabold text-[#0D2218] shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#BA5D38]" />
                  <span>Team & Client Codes</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#5C6862]" />
              </button>
            )}

            {/* Plan Card for Founder */}
            {isFounderOrManager && (
              <div className="bg-white/80 rounded-2xl p-3 border border-[#0D2218]/10 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#5C6862]">Billing Tier</span>
                  <span className="text-[10px] font-extrabold text-[#BA5D38] capitalize">{currentPlan} Plan</span>
                </div>
                <p className="text-[11px] text-[#2D3632] font-medium leading-snug">
                  {planInfo.tagline}
                </p>

                <button
                  type="button"
                  onClick={() => setShowRazorpayModal(true)}
                  className="w-full mt-2 py-1.5 px-3 bg-[#0D2218] hover:bg-[#163827] text-white text-[11px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-[#C5A059] fill-current" />
                  <span>{currentPlan === 'enterprise' ? 'Billing & Invoices' : 'Upgrade Plan'}</span>
                </button>
              </div>
            )}

            <div className="px-1 flex items-center justify-between text-[11px] text-[#5C6862] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Firebase Live
              </span>
              <NavLink to="/" className="text-[#BA5D38] hover:underline font-bold text-[10px]">
                Website
              </NavLink>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 max-w-[80%] bg-[#F4EFE6] h-full p-4 flex flex-col justify-between z-50 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#0D2218]/10">
                  <KairooLogo size="sm" variant="dark" />
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-[#0D2218]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    const access = checkAccess(item.path);
                    const isLocked = !access.allowed;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold ${
                          isActive
                            ? 'bg-[#0D2218] text-[#FAF6F0]'
                            : isLocked
                            ? 'text-[#5C6862]/70 opacity-75'
                            : 'text-[#2D3632]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {isLocked && <Lock className="w-3.5 h-3.5 text-amber-700" />}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              {isFounderOrManager && (
                <div className="pt-4 border-t border-[#0D2218]/10 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileSidebarOpen(false);
                      setShowInviteModal(true);
                    }}
                    className="w-full py-2 bg-[#0D2218] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Invite Codes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Primary Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#FAF6F0] p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#0D2218]/8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0D2218]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-[#5C6862] font-medium mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-2.5 flex-wrap">
                  {actions}
                </div>
              )}
            </div>

            {/* Page Children */}
            {children}
          </motion.div>
        </main>
      </div>

      {/* Global Search Modal */}
      {showSearchModal && !isClient && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#0D2218]/15 max-w-lg w-full overflow-hidden">
            <div className="p-3 border-b border-[#0D2218]/10 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#5C6862]" />
              <input
                type="text"
                autoFocus
                placeholder={`Search records across your organization...`}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full text-xs font-semibold text-[#0D2218] focus:outline-none placeholder-[#5C6862]/60"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-[#5C6862] hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchResults.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#5C6862]">
                  {searchQuery ? 'No matching records found' : 'Type to search records across your organization'}
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSearchResult(res)}
                      className="p-2.5 rounded-xl hover:bg-[#FAF6F0] cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-[#0D2218] block">{res.title}</span>
                        <span className="text-[11px] text-[#5C6862]">{res.subtitle}</span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#0D2218]/8 text-[#0D2218]">
                        {res.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Founder & Manager Invite Codes Modal */}
      {isFounderOrManager && (
        <InviteManagerModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {/* Razorpay Subscription Checkout Modal */}
      {isFounderOrManager && (
        <RazorpayModal
          isOpen={showRazorpayModal}
          onClose={() => setShowRazorpayModal(false)}
          defaultPlan={currentPlan === 'starter' ? 'growth' : 'enterprise'}
        />
      )}

      {/* Cloudinary CDN Media & Photos Modal */}
      <CloudinaryMediaManager
        isOpen={showCloudinaryModal}
        onClose={() => setShowCloudinaryModal(false)}
      />
    </div>
  );
};
