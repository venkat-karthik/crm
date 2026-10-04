import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Task } from '../services/db';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  AlertCircle,
  Calendar,
  User,
  X,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(db.getTasks());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const teamUsers = db.getUsers();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState(user?.name || 'Me');
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<Task['status']>('Pending');
  const [relatedCustomer, setRelatedCustomer] = useState('');
  const [relatedLead, setRelatedLead] = useState('');

  const loadData = () => {
    setTasks(db.getTasks());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setAssignedTo(user?.name || 'Me');
    setPriority('Medium');
    setDueDate(new Date().toISOString().split('T')[0]);
    setStatus('Pending');
    setRelatedCustomer('');
    setRelatedLead('');
    setModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.assignedTo);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setRelatedCustomer(task.relatedCustomer || '');
    setRelatedLead(task.relatedLead || '');
    setModalOpen(true);
  };

  const handleDelete = (id: string, taskTitle: string) => {
    if (confirm(`Delete task "${taskTitle}"?`)) {
      db.deleteTask(id);
      loadData();
      showToast(`Task removed.`);
    }
  };

  const handleToggleComplete = (task: Task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    db.saveTask({ ...task, status: nextStatus });
    loadData();
    showToast(nextStatus === 'Completed' ? 'Task marked complete!' : 'Task reopened.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    db.saveTask({
      id: editingTask?.id,
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      status,
      relatedCustomer,
      relatedLead,
    });

    loadData();
    setModalOpen(false);
    showToast(editingTask ? 'Task updated.' : 'New task assigned.');
  };

  const isEmployee = user?.role === 'Employee' || user?.role === 'Sales Employee' || user?.role === 'Support Employee';
  const roleScopedTasks = isEmployee
    ? tasks.filter((t) => !t.assignedTo || t.assignedTo === user?.name || t.assignedTo === 'Me' || t.assignedTo === 'Unassigned')
    : tasks;

  const completedCount = roleScopedTasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = roleScopedTasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = roleScopedTasks.filter((t) => t.status === 'In Progress').length;
  const urgentCount = roleScopedTasks.filter((t) => t.priority === 'Urgent' || t.priority === 'High').length;

  const filtered = roleScopedTasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.relatedCustomer && t.relatedCustomer.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <WorkspaceLayout
      title="Tasks & Action Items"
      subtitle="Organize team follow-ups, deliverables and operational checklists"
      actions={
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Total Tasks</span>
          <span className="font-serif text-2xl font-bold text-[#0D2218]">{tasks.length}</span>
          <span className="text-[10px] text-[#5C6862] block mt-0.5">Assigned across team</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Completed</span>
          <span className="font-serif text-2xl font-bold text-emerald-800">{completedCount}</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">
            {tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}% completion rate
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">In Progress</span>
          <span className="font-serif text-2xl font-bold text-[#BA5D38]">{inProgressCount}</span>
          <span className="text-[10px] text-[#5C6862] block mt-0.5">Active work items</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">High / Urgent</span>
          <span className="font-serif text-2xl font-bold text-red-700">{urgentCount}</span>
          <span className="text-[10px] text-red-600 block mt-0.5">Requires immediate focus</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks by title, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl text-[#0D2218] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2 py-1 text-xs text-[#0D2218]"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2 py-1 text-xs text-[#0D2218]"
            >
              <option value="All">All</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table / Card List */}
      <div className="bg-white rounded-2xl border border-[#0D2218]/10 shadow-xs divide-y divide-[#0D2218]/6 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5C6862]">
            No tasks found. Click "New Task" to create one.
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className={`p-4 flex items-center justify-between transition-colors hover:bg-[#FAF6F0]/60 ${
                t.status === 'Completed' ? 'opacity-60 bg-[#FAF6F0]/30' : ''
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <button
                  onClick={() => handleToggleComplete(t)}
                  className="cursor-pointer shrink-0 transition-transform active:scale-90"
                  title={t.status === 'Completed' ? 'Mark incomplete' : 'Mark complete'}
                >
                  {t.status === 'Completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#5C6862] hover:text-[#0D2218]" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold text-[#0D2218] ${
                        t.status === 'Completed' ? 'line-through text-[#5C6862]' : ''
                      }`}
                    >
                      {t.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        t.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : t.priority === 'High'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : t.priority === 'Medium'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  {t.description && (
                    <p className="text-xs text-[#5C6862] line-clamp-1 mb-1">{t.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5C6862]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{t.assignedTo}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {t.dueDate}</span>
                    </span>
                    {t.relatedCustomer && (
                      <span className="bg-[#FAF6F0] px-1.5 py-0.2 rounded border border-[#0D2218]/8 text-[#0D2218]">
                        Customer: {t.relatedCustomer}
                      </span>
                    )}
                    {t.relatedLead && (
                      <span className="bg-[#FAF6F0] px-1.5 py-0.2 rounded border border-[#0D2218]/8 text-[#BA5D38]">
                        Lead: {t.relatedLead}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-4">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    t.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-800'
                      : t.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {t.status}
                </span>

                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 text-[#5C6862] hover:text-[#0D2218] rounded-lg"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.title)}
                  className="p-1.5 text-[#5C6862] hover:text-red-700 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                {editingTask ? 'Edit Task' : 'Create Task'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#5C6862]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deliver revised MSA contract to customer"
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed notes or instructions..."
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Assigned To</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Related Customer</label>
                  <input
                    type="text"
                    value={relatedCustomer}
                    onChange={(e) => setRelatedCustomer(e.target.value)}
                    placeholder="e.g. TechNova Solutions"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  />
                </div>
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
                  className="px-5 py-2 bg-[#0D2218] text-[#FAF6F0] rounded-xl font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
export default TasksPage;
