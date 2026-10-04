import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Customer, Deal, Task, Ticket, Organization, isMasterFounder, MASTER_FOUNDER_EMAIL } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { InviteManagerModal } from '../components/InviteManagerModal';
import {
  Users,
  Target,
  GitBranch,
  TrendingUp,
  LifeBuoy,
  CheckSquare,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  KeyRound,
  Briefcase,
  Layers,
  ArrowRight,
  Check,
  Send,
  MessageSquare,
  FileCheck,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState(db.getReportSummary());
  const [activityLogs, setActivityLogs] = useState(db.getActivityLogs().slice(0, 5));
  const [tasks, setTasks] = useState(db.getTasks());
  const [deals, setDeals] = useState(db.getDeals());
  const [customers, setCustomers] = useState(db.getCustomers());
  const [tickets, setTickets] = useState(db.getTickets());
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Role detection - Only karthikvenkat316@gmail.com is Master Founder with all executive features
  const isMaster = isMasterFounder(user);
  const isClient = user?.role === 'Client';
  const isFounder = isMaster || user?.role === 'Founder';
  const isEmployee = !isClient && !isFounder;

  // Custom terminology
  const clientsLabel = user?.crmCustomization?.clientsLabel || 'Customers';
  const dealsLabel = user?.crmCustomization?.dealsLabel || 'Deals';

  // Current organization
  const org = user?.organizationId ? db.getOrganization(user.organizationId) : null;

  const refreshData = () => {
    setMetrics(db.getReportSummary());
    setActivityLogs(db.getActivityLogs().slice(0, 5));
    setTasks(db.getTasks());
    setDeals(db.getDeals());
    setCustomers(db.getCustomers());
    setTickets(db.getTickets());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleToggleTask = (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    db.saveTask({ ...task, status: newStatus });
    refreshData();
  };

  // CLIENT PORTAL VIEW
  if (isClient) {
    const clientTickets = tickets.filter((t) => t.customerId === user?.id || t.customerName === user?.name);

    return (
      <WorkspaceLayout
        title="Client Progress & Milestone Portal"
        subtitle={`Welcome, ${user?.name || 'Client'}. Track your active project deliverables and request support.`}
        actions={
          <NavLink
            to="/tickets"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Request</span>
          </NavLink>
        }
      >
        {/* Welcome Client Banner */}
        <div className="bg-[#0D2218] text-[#FAF6F0] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                Active Client Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                {user?.company || 'Project Engagement Hub'}
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-1 max-w-xl">
                Your dedicated workspace with our team. Review real-time work completion, submit support requests, and view deliverables.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 text-center shrink-0">
              <span className="text-[11px] font-bold text-[#FAF6F0]/70 uppercase block">Overall Progress</span>
              <span className="text-3xl font-extrabold text-emerald-400">75%</span>
              <span className="text-[10px] text-[#FAF6F0]/60 block mt-0.5">Sprint In Progress</span>
            </div>
          </div>
        </div>

        {/* Project Deliverables & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#0D2218]/8">
              <div>
                <h3 className="text-base font-extrabold text-[#0D2218] flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#BA5D38]" />
                  <span>Project Deliverables Timeline</span>
                </h3>
                <p className="text-xs text-[#5C6862]">Live status of your scope milestones</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Phase 3 Active
              </span>
            </div>

            {/* Milestones Steps */}
            <div className="space-y-3 pt-2">
              {[
                { title: 'Project Kickoff & Scope Validation', status: 'Completed', date: 'Phase 1' },
                { title: 'Architecture, Wireframes & Strategy Approval', status: 'Completed', date: 'Phase 2' },
                { title: 'Full Build Implementation & QA Testing', status: 'In Progress', date: 'Phase 3 (Active)' },
                { title: 'Final Handover, Deployment & Warranty SLA', status: 'Scheduled', date: 'Phase 4' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/8 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        m.status === 'Completed'
                          ? 'bg-emerald-600 text-white'
                          : m.status === 'In Progress'
                          ? 'bg-[#BA5D38] text-white animate-pulse'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {m.status === 'Completed' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <div>
                      <span className="font-extrabold text-[#0D2218] block">{m.title}</span>
                      <span className="text-[11px] text-[#5C6862]">{m.date}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      m.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Manager Contact Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#0D2218] mb-1">
                Your Dedicated Agency Lead
              </h3>
              <p className="text-xs text-[#5C6862] mb-4">Direct contact for questions and deliverables</p>

              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/10 text-xs space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0D2218] text-white flex items-center justify-center font-extrabold text-sm">
                    {org?.founderName ? org.founderName.slice(0, 2).toUpperCase() : 'AM'}
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-[#0D2218] block">
                      {org?.founderName || 'Founder & Account Lead'}
                    </span>
                    <span className="text-[11px] text-[#BA5D38] font-semibold">Senior Account Lead</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#0D2218]/8 text-[11px] space-y-1">
                  <div className="text-[#5C6862]">
                    Organization: <strong className="text-[#0D2218]">{org?.name || user?.company}</strong>
                  </div>
                  <div className="text-[#5C6862]">
                    Email: <strong className="text-[#0D2218]">{org?.founderEmail || 'manager@agency.com'}</strong>
                  </div>
                </div>
              </div>
            </div>

            <NavLink
              to="/communication"
              className="w-full mt-4 py-2.5 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Message to Team</span>
            </NavLink>
          </div>
        </div>

        {/* Client Support Tickets */}
        <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-[#0D2218]">Your Support Tickets & Requests</h3>
              <p className="text-xs text-[#5C6862]">Recent items submitted to the team</p>
            </div>
            <NavLink to="/tickets" className="text-xs font-bold text-[#BA5D38] hover:underline">
              View All Tickets →
            </NavLink>
          </div>

          {clientTickets.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#5C6862] bg-[#FAF6F0] rounded-2xl border border-dashed border-[#0D2218]/15">
              No tickets currently open. Click "Submit Request" whenever you need assistance.
            </div>
          ) : (
            <div className="divide-y divide-[#0D2218]/8">
              {clientTickets.map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-[#0D2218] block">{t.subject}</span>
                    <span className="text-[11px] text-[#5C6862]">{t.id} · Priority: {t.priority}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0D2218]/5 text-[#0D2218]">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </WorkspaceLayout>
    );
  }

  // EMPLOYEE VIEW
  if (isEmployee) {
    const myTasks = tasks.filter((t) => !t.assignedTo || t.assignedTo === user?.name || t.assignedTo === 'Me');
    const myDeals = deals.filter((d) => !d.assignedTo || d.assignedTo === user?.name);

    return (
      <WorkspaceLayout
        title="Employee Progress & Productivity"
        subtitle={`Welcome, ${user?.name}. Your assigned tasks, active deals, and daily workflow.`}
        actions={
          <NavLink
            to="/tasks"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </NavLink>
        }
      >
        {/* Employee Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-white border border-[#0D2218]/10 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase text-[#5C6862]">My Pending Tasks</span>
            <div className="text-3xl font-extrabold text-[#0D2218] mt-1">
              {myTasks.filter((t) => t.status !== 'Completed').length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0D2218]/10 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase text-[#5C6862]">Completed Tasks</span>
            <div className="text-3xl font-extrabold text-emerald-700 mt-1">
              {myTasks.filter((t) => t.status === 'Completed').length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0D2218]/10 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase text-[#5C6862]">Assigned {dealsLabel}</span>
            <div className="text-3xl font-extrabold text-[#BA5D38] mt-1">
              {myDeals.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0D2218]/10 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase text-[#5C6862]">Organization</span>
            <div className="text-base font-extrabold text-[#0D2218] mt-1 truncate">
              {user?.company || 'Team'}
            </div>
          </div>
        </div>

        {/* Tasks Checklist */}
        <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-[#0D2218]">My Daily Tasks & Action Items</h3>
              <p className="text-xs text-[#5C6862]">Click checkmark to toggle task completion</p>
            </div>
            <NavLink to="/tasks" className="text-xs font-bold text-[#BA5D38] hover:underline">
              View Task Board →
            </NavLink>
          </div>

          {myTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5C6862] bg-[#FAF6F0] rounded-2xl border border-dashed border-[#0D2218]/15">
              No tasks assigned yet. Click "Create Task" above to add your first work item!
            </div>
          ) : (
            <div className="space-y-2">
              {myTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleTask(t)}
                  className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#F2ECE0] border border-[#0D2218]/8 flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        t.status === 'Completed'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-[#0D2218]/30 bg-white'
                      }`}
                    >
                      {t.status === 'Completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`font-bold ${t.status === 'Completed' ? 'line-through text-[#5C6862]' : 'text-[#0D2218]'}`}>
                      {t.title}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-[#5C6862]">
                    Due: {t.dueDate}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </WorkspaceLayout>
    );
  }

  // FOUNDER / MANAGER EXECUTIVE VIEW
  const kpis = [
    { title: clientsLabel, value: metrics.totalCustomers.toString(), subtext: 'managed accounts', link: '/customers', icon: Users },
    { title: 'Active Leads', value: metrics.activeLeads.toString(), subtext: 'inbound prospects', link: '/leads', icon: Target },
    { title: `Open ${dealsLabel}`, value: metrics.openDeals.toString(), subtext: `₹${(metrics.pipelineValue / 100000).toFixed(1)}L active`, link: '/pipeline', icon: GitBranch },
    { title: 'Closed Revenue', value: `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`, subtext: `${metrics.wonDealsCount} closed`, link: '/reports', icon: TrendingUp },
    { title: 'Support Tickets', value: metrics.openTickets.toString(), subtext: 'helpdesk queue', link: '/tickets', icon: LifeBuoy },
    { title: 'Pending Tasks', value: metrics.pendingTasks.toString(), subtext: 'team follow-ups', link: '/tasks', icon: CheckSquare },
  ];

  return (
    <WorkspaceLayout
      title="Executive Overview"
      subtitle={`Welcome, Founder ${user?.name ? user.name.split(' ')[0] : ''}. Real-time business management for ${user?.company || 'your organization'}.`}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-[#0D2218] bg-white border border-[#0D2218]/15 hover:border-[#0D2218]/30 rounded-xl shadow-xs cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#BA5D38]" />
            <span>Invite Team / Clients</span>
          </button>
          <NavLink
            to="/customers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add {clientsLabel.slice(0, -1) || 'Client'}</span>
          </NavLink>
        </div>
      }
    >
      {/* Founder Onboarding Quick Start Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0D2218] to-[#173829] text-[#FAF6F0] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#BA5D38] text-white mb-1.5">
            <Sparkles className="w-3 h-3" />
            Organization Ready
          </div>
          <h2 className="text-xl font-extrabold">
            {user?.company || 'Your Organization'} is Live on {user?.plan ? user.plan.toUpperCase() : 'GROWTH'} Plan
          </h2>
          <p className="text-xs text-[#FAF6F0]/80 mt-1 max-w-lg">
            Share your secure Invite Codes with your team members or clients to begin active collaboration and live progress tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="px-5 py-2.5 bg-[#FAF6F0] hover:bg-white text-[#0D2218] text-xs font-extrabold rounded-xl shadow-sm transition-transform active:scale-95 shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <KeyRound className="w-3.5 h-3.5 text-[#BA5D38]" />
          <span>Get Invite Codes</span>
        </button>
      </div>

      {/* 6 Real Database KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <NavLink
              key={kpi.title}
              to={kpi.link}
              className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 hover:border-[#BA5D38]/40 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-[#5C6862] truncate">
                    {kpi.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#5C6862]/40 group-hover:text-[#BA5D38] transition-colors" />
                </div>
                <div className="text-2xl font-extrabold text-[#0D2218] tabular-nums tracking-tight">
                  {kpi.value}
                </div>
              </div>
              <p className="text-[10px] text-[#5C6862] mt-1 font-semibold truncate">
                {kpi.subtext}
              </p>
            </NavLink>
          );
        })}
      </div>

      {/* Middle Grid: Pipeline & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Pipeline Preview */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-[#0D2218]">Active {dealsLabel} Pipeline</h3>
              <p className="text-xs text-[#5C6862]">High-priority opportunities currently in progress</p>
            </div>
            <NavLink
              to="/pipeline"
              className="text-xs font-bold text-[#BA5D38] hover:underline flex items-center gap-1"
            >
              <span>View Board</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="space-y-2.5">
            {deals.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#5C6862] bg-[#FAF6F0] rounded-2xl border border-dashed border-[#0D2218]/15">
                <GitBranch className="w-8 h-8 text-[#5C6862]/40 mx-auto mb-2" />
                <span className="block font-bold text-[#0D2218]">No {dealsLabel.toLowerCase()} added yet.</span>
                <span>Click below to add your first client opportunity or project contract.</span>
                <div className="mt-3">
                  <NavLink
                    to="/pipeline"
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#BA5D38] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New {dealsLabel.slice(0, -1) || 'Deal'}</span>
                  </NavLink>
                </div>
              </div>
            ) : (
              deals.slice(0, 4).map((deal) => (
                <NavLink
                  key={deal.id}
                  to="/pipeline"
                  className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#F2ECE0] border border-[#0D2218]/6 flex items-center justify-between transition-colors block"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-extrabold text-[#0D2218] truncate block">
                      {deal.name}
                    </span>
                    <span className="text-[11px] text-[#5C6862]">
                      {deal.company} · {deal.contact}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-[#0D2218] tabular-nums block">
                      ₹{deal.value.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#0D2218]/10 text-[#0D2218]">
                      {deal.stage}
                    </span>
                  </div>
                </NavLink>
              ))
            )}
          </div>
        </div>

        {/* Immediate Tasks */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-[#0D2218] flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#0D2218]" />
                <span>Action Items & Tasks</span>
              </span>
              <NavLink to="/tasks" className="text-xs text-[#BA5D38] font-bold hover:underline">
                View all →
              </NavLink>
            </div>

            <div className="space-y-2 mt-4">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5C6862] bg-[#FAF6F0] rounded-2xl border border-dashed border-[#0D2218]/15">
                  No tasks scheduled. Assign follow-ups to your team in the Tasks module.
                </div>
              ) : (
                tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/6 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          task.status === 'Completed' ? 'text-emerald-600' : 'text-[#5C6862]'
                        }`}
                      />
                      <span className="truncate font-bold text-[#151A18]">{task.title}</span>
                    </div>
                    <span className="text-[10px] text-[#5C6862] shrink-0 font-mono ml-2">
                      {task.dueDate}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Stream */}
      <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0D2218]" />
            <h3 className="text-sm font-extrabold text-[#0D2218]">Recent Database Activity Stream</h3>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
            Real-Time Cloud Audit
          </span>
        </div>

        <div className="divide-y divide-[#0D2218]/6">
          {activityLogs.length === 0 ? (
            <p className="text-xs text-[#5C6862] py-4 text-center">
              Your workspace is freshly provisioned. Actions taken across customers, tasks, and deals will stream live here.
            </p>
          ) : (
            activityLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#BA5D38]" />
                  <span className="font-extrabold text-[#0D2218]">{log.entityType}</span>
                  <span className="text-[#5C6862]">{log.description}</span>
                </div>
                <span className="text-[11px] font-mono text-[#5C6862]">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <InviteManagerModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </WorkspaceLayout>
  );
};

export default DashboardPage;
