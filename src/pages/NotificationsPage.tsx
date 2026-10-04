import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Notification } from '../services/db';
import {
  Bell,
  CheckCheck,
  Trash2,
  Clock,
  Sparkles,
  Target,
  LifeBuoy,
  GitBranch,
  X,
  Plus,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(db.getNotifications());
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');
  const [toast, setToast] = useState<string | null>(null);

  const loadData = () => {
    setNotifications(db.getNotifications());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleMarkAllRead = () => {
    db.markAllNotificationsRead();
    loadData();
    showToast('All notifications marked as read.');
  };

  const handleMarkRead = (id: string) => {
    db.markNotificationRead(id);
    loadData();
  };

  const handleAddSampleNotification = () => {
    db.createNotification({
      type: 'Deal Won',
      title: 'Deal Won Milestone',
      message: 'Nexus Mobility signed annual fleet agreement (+₹8.5L ARR).',
    });
    loadData();
    showToast('New notification triggered!');
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'Unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'New Lead':
        return <Target className="w-4 h-4 text-emerald-700" />;
      case 'Support Ticket':
      case 'New Ticket':
        return <LifeBuoy className="w-4 h-4 text-[#BA5D38]" />;
      case 'Deal Won':
      case 'Deal Updated':
        return <GitBranch className="w-4 h-4 text-[#C5A059]" />;
      case 'AI Insight':
        return <Sparkles className="w-4 h-4 text-[#5F58B0]" />;
      default:
        return <Bell className="w-4 h-4 text-[#0D2218]" />;
    }
  };

  return (
    <WorkspaceLayout
      title="Notifications & Alerts"
      subtitle="Stay up to date on new inbound leads, closed deals, and customer support tickets"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSampleNotification}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0D2218] bg-white border border-[#0D2218]/15 rounded-xl hover:border-[#0D2218]/30 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Trigger Test Alert</span>
          </button>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs disabled:opacity-40 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        </div>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'All'
                ? 'bg-[#0D2218] text-[#FAF6F0]'
                : 'text-[#5C6862] hover:text-[#0D2218]'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('Unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'Unread'
                ? 'bg-[#0D2218] text-[#FAF6F0]'
                : 'text-[#5C6862] hover:text-[#0D2218]'
            }`}
          >
            Unread Only ({unreadCount})
          </button>
        </div>

        <span className="text-xs text-[#5C6862]">
          {unreadCount > 0 ? `${unreadCount} unread items` : 'All caught up!'}
        </span>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-[#0D2218]/10 shadow-xs divide-y divide-[#0D2218]/6 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5C6862]">
            {filter === 'Unread'
              ? 'No unread notifications right now.'
              : 'Notification center is currently clear.'}
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-[#FAF6F0]/80' : 'hover:bg-[#FAF6F0]/30'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#0D2218]/10 flex items-center justify-center shrink-0 shadow-xs">
                  {getIcon(n.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0D2218]">{n.title}</span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#BA5D38] inline-block" />
                    )}
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-white border border-[#0D2218]/8 text-[#5C6862]">
                      {n.type}
                    </span>
                  </div>

                  <p className="text-xs text-[#2D3632] leading-relaxed mb-1.5">{n.message}</p>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#5C6862]">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="px-2.5 py-1 bg-white border border-[#0D2218]/12 hover:border-[#0D2218]/25 rounded-lg text-[11px] font-semibold text-[#0D2218] shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </WorkspaceLayout>
  );
};
export default NotificationsPage;
