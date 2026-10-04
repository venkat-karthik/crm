import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Appointment } from '../services/db';
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  Phone,
  Trash2,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appointment[]>(db.getAppointments());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00 AM');
  const [type, setType] = useState<Appointment['type']>('Meeting');
  const [attendees, setAttendees] = useState(user?.name ? `${user.name}, Client` : 'Team, Client');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    setAppts(db.getAppointments());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setTitle('');
    setDate(selectedDate);
    setTime('02:00 PM');
    setType('Meeting');
    setAttendees(user?.name ? `${user.name}, Client` : 'Team, Client');
    setNotes('');
    setModalOpen(true);
  };

  const handleDelete = (id: string, apptTitle: string) => {
    if (confirm(`Cancel "${apptTitle}"?`)) {
      const updated = appts.filter((a) => a.id !== id);
      setAppts(updated);
      showToast('Appointment removed.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    db.saveAppointment({
      title,
      date,
      time,
      type,
      attendees,
      notes,
    });

    loadData();
    setModalOpen(false);
    showToast('Event scheduled successfully.');
  };

  const filtered = appts.filter((a) => {
    const matchType = typeFilter === 'All' || a.type === typeFilter;
    return matchType;
  });

  const getTypeIcon = (t: Appointment['type']) => {
    switch (t) {
      case 'Meeting':
        return <Video className="w-4 h-4 text-[#BA5D38]" />;
      case 'Call':
        return <Phone className="w-4 h-4 text-emerald-700" />;
      default:
        return <Clock className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <WorkspaceLayout
      title="Calendar & Scheduling"
      subtitle="Coordinate client executive reviews, discovery meetings and demo presentations"
      actions={
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Control Strip */}
      <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#0D2218]" />
          <span className="text-xs font-bold text-[#0D2218]">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl text-xs">
            {['All', 'Meeting', 'Call', 'Follow-up'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  typeFilter === t
                    ? 'bg-[#0D2218] text-[#FAF6F0]'
                    : 'text-[#5C6862] hover:text-[#0D2218]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl px-2.5 py-1 text-[#0D2218]"
          />
        </div>
      </div>

      {/* Events List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C6862] mb-1">
            Confirmed Agenda & Slots ({filtered.length})
          </h3>

          {filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#0D2218]/10 text-center text-xs text-[#5C6862]">
              No scheduled appointments found for this filter. Click "Schedule Meeting" to book a slot.
            </div>
          ) : (
            filtered.map((appt) => (
              <div
                key={appt.id}
                className="bg-white p-4.5 rounded-2xl border border-[#0D2218]/10 shadow-xs hover:border-[#BA5D38]/40 transition-all flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/8 flex items-center justify-center shrink-0">
                    {getTypeIcon(appt.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FAF6F0] text-[#0D2218]">
                        {appt.type}
                      </span>
                      <h4 className="text-sm font-bold text-[#0D2218]">{appt.title}</h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#5C6862] mb-1">
                      <span className="flex items-center gap-1 font-mono font-semibold text-[#0D2218]">
                        <Clock className="w-3.5 h-3.5 text-[#BA5D38]" />
                        <span>{appt.time}</span>
                      </span>
                      <span className="font-mono">({appt.date})</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
                      <Users className="w-3.5 h-3.5" />
                      <span>{appt.attendees}</span>
                    </div>

                    {appt.notes && (
                      <p className="text-xs text-[#2D3632] mt-2 p-2 bg-[#FAF6F0] rounded-xl border border-[#0D2218]/5">
                        {appt.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(appt.id, appt.title)}
                  className="p-1.5 text-[#5C6862] hover:text-red-700 rounded-lg"
                  title="Cancel meeting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Date Snapshot & Working Hours */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs">
            <h4 className="text-xs font-bold text-[#0D2218] uppercase tracking-wider mb-3">
              Standard Operating Hours
            </h4>
            <div className="space-y-2 text-xs text-[#2D3632]">
              <div className="flex justify-between py-1 border-b border-[#0D2218]/6">
                <span>Mon – Fri</span>
                <span className="font-mono font-semibold">09:00 AM – 06:30 PM IST</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#0D2218]/6">
                <span>Saturday</span>
                <span className="font-mono font-semibold">10:00 AM – 02:00 PM IST</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sunday</span>
                <span className="text-[#5C6862]">Closed for Client Support</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0D2218] p-5 rounded-2xl text-[#FAF6F0] shadow-md">
            <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider mb-2">
              Kairoo Smart Schedule
            </h4>
            <p className="text-xs leading-relaxed text-white/80">
              Meetings are automatically synchronized with Google Workspace and Microsoft 365 calendars.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                Schedule New Appointment
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#5C6862]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Meeting / Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Discovery Demo with Sovereign Capital"
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Meeting Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                    <option value="Meeting">Executive Meeting</option>
                    <option value="Call">Product Demo Call</option>
                    <option value="Follow-up">Commercial Follow-up</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Attendees</label>
                  <input
                    type="text"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="e.g. Project Lead, Client Executive"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Meeting Notes / Agenda</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Items to review, required presentation deck..."
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="pt-3 border-t border-[#0D2218]/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D2218] text-[#FAF6F0] rounded-xl font-semibold hover:bg-[#163827]"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
export default CalendarPage;
