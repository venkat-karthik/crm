// Client-side persistent storage and API service
// Fresh & Ready Enterprise Range CRM with Multi-Tenant Organization and Invite Code Architecture

export interface Organization {
  id: string;
  name: string;
  founderId: string;
  founderName: string;
  founderEmail: string;
  crmType: 'agency' | 'sales_b2b' | 'services' | 'hybrid' | 'custom';
  industry: string;
  collaborationMode: 'both' | 'employees_only' | 'clients_only';
  employeeInviteCode: string;
  clientInviteCode: string;
  customTerminology?: {
    clientsLabel: string;
    dealsLabel: string;
  };
  plan: 'starter' | 'growth' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Founder' | 'Manager' | 'Admin' | 'Sales Employee' | 'Support Employee' | 'Employee' | 'Client' | 'Owner';
  department?: string;
  status: 'Active' | 'Disabled';
  company?: string;
  tenantId?: string;
  organizationId?: string;
  inviteCodeUsed?: string;
  plan?: 'starter' | 'growth' | 'enterprise';
  planBillingCycle?: 'monthly' | 'annual';
  subscriptionStatus?: 'active' | 'trial' | 'cancelled' | 'expired';
  subscriptionExpiresAt?: string;
  razorpayPaymentId?: string;
  crmCustomization?: {
    crmType: 'agency' | 'sales_b2b' | 'services' | 'hybrid' | 'custom';
    collaborationMode: 'both' | 'employees_only' | 'clients_only';
    clientsLabel: string;
    dealsLabel: string;
  };
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'Active' | 'Lead' | 'Churned' | 'VIP';
  assignedEmployee: string;
  notes: string;
  tenantId?: string;
  // Client portal milestone & deliverables tracking for agencies
  projectTitle?: string;
  projectProgress?: number; // 0 - 100%
  projectMilestones?: { id: string; title: string; completed: boolean; dueDate?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  interest: string;
  assignedTo: string;
  status: 'New Lead' | 'Contacted' | 'Interested' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  notes: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  name: string;
  company: string;
  contact: string;
  value: number;
  stage: 'New Lead' | 'Contacted' | 'Interested' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  assignedTo: string;
  expectedCloseDate: string;
  tag?: string;
  notes?: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  relatedCustomer?: string;
  relatedLead?: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Call {
  id: string;
  contactName: string;
  phone: string;
  type: 'Inbound' | 'Outbound';
  status: 'Scheduled' | 'Completed' | 'Missed';
  callDate: string;
  durationMinutes?: number;
  assignedEmployee: string;
  notes: string;
  relatedCustomer?: string;
  relatedLead?: string;
  tenantId?: string;
  createdAt: string;
}

export interface Communication {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  subject: string;
  content: string;
  relatedCustomer?: string;
  relatedLead?: string;
  author: string;
  tenantId?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Meeting' | 'Call' | 'Task' | 'Follow-up';
  attendees: string;
  notes: string;
  tenantId?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName?: string;
  subject: string;
  description: string;
  category: 'Technical' | 'Billing' | 'Feature Request' | 'General';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  status: 'Open' | 'Assigned' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed';
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorName: string;
  authorRole: string;
  message: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId?: string;
  tenantId?: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  tenantId?: string;
  createdAt: string;
}

// STORAGE KEYS
const STORAGE_PREFIX = 'kairoo_crm_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to set localStorage', err);
  }
}

// MASTER FOUNDER EMAIL - Holds ultimate administrative ownership and access across all features
export const MASTER_FOUNDER_EMAIL = 'karthikvenkat316@gmail.com';

// FRESH INITIAL STATE (Zero Dummy Data - Clean Slate for Master Founder)
function initializeData() {
  const CURRENT_DB_VERSION = 'kairoo_master_v7_karthik_clean';
  const hasInitialized = localStorage.getItem('kairoo_db_version');
  if (hasInitialized !== CURRENT_DB_VERSION) {
    // Purge all legacy sessions, users, and data for completely fresh start
    localStorage.removeItem('kairoo_current_user');
    localStorage.removeItem('kairoo_crm_users');
    localStorage.removeItem('kairoo_crm_organizations');
    localStorage.removeItem('kairoo_crm_customers');
    localStorage.removeItem('kairoo_crm_leads');
    localStorage.removeItem('kairoo_crm_deals');
    localStorage.removeItem('kairoo_crm_tasks');
    localStorage.removeItem('kairoo_crm_calls');
    localStorage.removeItem('kairoo_crm_communications');
    localStorage.removeItem('kairoo_crm_appointments');
    localStorage.removeItem('kairoo_crm_tickets');
    localStorage.removeItem('kairoo_crm_ticket_messages');
    localStorage.removeItem('kairoo_crm_activity_logs');
    localStorage.removeItem('kairoo_crm_notifications');
    localStorage.setItem('kairoo_db_version', CURRENT_DB_VERSION);
  }
}
initializeData();

export function isMasterFounder(userOrEmail?: User | string | null): boolean {
  if (!userOrEmail) return false;
  const email = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail.email;
  return !!email && email.trim().toLowerCase() === MASTER_FOUNDER_EMAIL.toLowerCase();
}

function generateCode(prefix: string, name: string): string {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'KAI';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${cleanName}-${rand}`;
}

// DATA API REPOSITORIES
export const db = {
  // Current logged in user state
  getCurrentUser(): User | null {
    const raw = localStorage.getItem('kairoo_current_user');
    if (raw) {
      try {
        const u = JSON.parse(raw) as User;
        // If master founder, enforce enterprise tier and full executive permissions
        if (u.email && u.email.toLowerCase() === MASTER_FOUNDER_EMAIL.toLowerCase()) {
          u.role = 'Founder';
          u.plan = 'enterprise';
          u.subscriptionStatus = 'active';
        }
        return u;
      } catch {
        return null;
      }
    }
    return null;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      if (user.email && user.email.toLowerCase() === MASTER_FOUNDER_EMAIL.toLowerCase()) {
        user.role = 'Founder';
        user.plan = 'enterprise';
        user.subscriptionStatus = 'active';
        user.company = user.company || 'Kairoo Technologies Global';
      }
      localStorage.setItem('kairoo_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kairoo_current_user');
    }
  },

  // ORGANIZATIONS & INVITE CODES
  getOrganizations(): Organization[] {
    return getStored<Organization[]>('organizations', []);
  },

  getOrganization(orgId: string): Organization | null {
    const orgs = this.getOrganizations();
    return orgs.find((o) => o.id === orgId) || null;
  },

  saveOrganization(org: Organization): Organization {
    const orgs = this.getOrganizations();
    const idx = orgs.findIndex((o) => o.id === org.id);
    if (idx !== -1) {
      orgs[idx] = { ...org, updatedAt: new Date().toISOString() };
    } else {
      orgs.push(org);
    }
    setStored('organizations', orgs);
    return org;
  },

  createOrganizationWithCodes(data: {
    name: string;
    founderId: string;
    founderName: string;
    founderEmail: string;
    crmType?: Organization['crmType'];
    industry?: string;
    collaborationMode?: Organization['collaborationMode'];
    clientsLabel?: string;
    dealsLabel?: string;
    plan?: Organization['plan'];
  }): Organization {
    const orgId = `org_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newOrg: Organization = {
      id: orgId,
      name: data.name,
      founderId: data.founderId,
      founderName: data.founderName,
      founderEmail: data.founderEmail,
      crmType: data.crmType || 'hybrid',
      industry: data.industry || 'Technology & Services',
      collaborationMode: data.collaborationMode || 'both',
      employeeInviteCode: generateCode('EMP', data.name),
      clientInviteCode: generateCode('CLT', data.name),
      customTerminology: {
        clientsLabel: data.clientsLabel || (data.crmType === 'agency' ? 'Clients' : 'Customers'),
        dealsLabel: data.dealsLabel || (data.crmType === 'agency' ? 'Projects' : 'Deals'),
      },
      plan: data.plan || 'growth',
      createdAt: now,
      updatedAt: now,
    };

    this.saveOrganization(newOrg);
    return newOrg;
  },

  findOrganizationByInviteCode(code: string): { org: Organization; role: 'Employee' | 'Client' } | null {
    const cleanCode = code.trim().toUpperCase();
    const orgs = this.getOrganizations();

    for (const org of orgs) {
      if (org.employeeInviteCode.toUpperCase() === cleanCode) {
        return { org, role: 'Employee' };
      }
      if (org.clientInviteCode.toUpperCase() === cleanCode) {
        return { org, role: 'Client' };
      }
    }
    return null;
  },

  regenerateInviteCode(orgId: string, type: 'employee' | 'client'): Organization | null {
    const org = this.getOrganization(orgId);
    if (!org) return null;

    if (type === 'employee') {
      org.employeeInviteCode = generateCode('EMP', org.name);
    } else {
      org.clientInviteCode = generateCode('CLT', org.name);
    }
    org.updatedAt = new Date().toISOString();
    this.saveOrganization(org);
    return org;
  },

  // USERS
  getUsers(): User[] {
    return getStored<User[]>('users', []);
  },

  saveUser(user: Partial<User> & { name: string; email: string }): User {
    const list = getStored<User[]>('users', []);
    const isMaster = isMasterFounder(user.email);
    const assignedRole: User['role'] = isMaster
      ? 'Founder'
      : user.role === 'Founder'
      ? 'Manager'
      : user.role || 'Sales Employee';
    const assignedPlan = isMaster ? 'enterprise' : user.plan || 'growth';

    if (user.id) {
      const idx = list.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...user,
          role: assignedRole,
          plan: assignedPlan,
          subscriptionStatus: isMaster ? 'active' : (user.subscriptionStatus || list[idx].subscriptionStatus || 'active'),
        };
        setStored('users', list);
        return list[idx];
      }
    }
    const newUser: User = {
      id: user.id || `usr_${Date.now()}`,
      name: user.name,
      email: user.email,
      role: assignedRole,
      department: user.department || (isMaster ? 'Executive' : 'Operations'),
      status: user.status || 'Active',
      company: user.company || (isMaster ? 'Kairoo Technologies Global' : 'My Organization'),
      tenantId: user.tenantId || user.id || `usr_${Date.now()}`,
      organizationId: user.organizationId,
      inviteCodeUsed: user.inviteCodeUsed,
      plan: assignedPlan,
      planBillingCycle: user.planBillingCycle || 'monthly',
      subscriptionStatus: isMaster ? 'active' : (user.subscriptionStatus || 'active'),
      crmCustomization: user.crmCustomization,
      createdAt: user.createdAt || new Date().toISOString(),
    };
    list.unshift(newUser);
    setStored('users', list);
    return newUser;
  },

  deleteUser(id: string) {
    const list = getStored<User[]>('users', []).filter((u) => u.id !== id);
    setStored('users', list);
  },

  // CUSTOMERS
  getCustomers(): Customer[] {
    return getStored<Customer[]>('customers', []);
  },

  saveCustomer(customer: Partial<Customer> & { name: string; email: string }): Customer {
    const list = getStored<Customer[]>('customers', []);
    const now = new Date().toISOString();
    if (customer.id) {
      const idx = list.findIndex((c) => c.id === customer.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...customer, updatedAt: now };
        setStored('customers', list);
        this.logActivity('Customer', list[idx].id, 'Updated', `Updated customer ${list[idx].name}`);
        return list[idx];
      }
    }
    const newCustomer: Customer = {
      id: customer.id || `cust_${Date.now()}`,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      company: customer.company || customer.name,
      source: customer.source || 'Direct',
      status: customer.status || 'Active',
      assignedEmployee: customer.assignedEmployee || 'Unassigned',
      notes: customer.notes || '',
      tenantId: customer.tenantId,
      projectTitle: customer.projectTitle || `${customer.name} Engagement`,
      projectProgress: customer.projectProgress || 25,
      projectMilestones: customer.projectMilestones || [
        { id: 'm1', title: 'Onboarding & Requirements Review', completed: true },
        { id: 'm2', title: 'Strategy & Proposal Architecture', completed: true },
        { id: 'm3', title: 'Implementation & Work Sprint', completed: false },
        { id: 'm4', title: 'Final Handover & Launch', completed: false },
      ],
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(newCustomer);
    setStored('customers', list);
    this.logActivity('Customer', newCustomer.id, 'Created', `Added new customer ${newCustomer.name}`);
    return newCustomer;
  },

  deleteCustomer(id: string) {
    const list = getStored<Customer[]>('customers', []);
    const removed = list.find((c) => c.id === id);
    const updated = list.filter((c) => c.id !== id);
    setStored('customers', updated);
    if (removed) {
      this.logActivity('Customer', id, 'Deleted', `Deleted customer ${removed.name}`);
    }
  },

  // LEADS
  getLeads(): Lead[] {
    return getStored<Lead[]>('leads', []);
  },

  saveLead(lead: Partial<Lead> & { name: string; email: string }): Lead {
    const list = getStored<Lead[]>('leads', []);
    const now = new Date().toISOString();
    if (lead.id) {
      const idx = list.findIndex((l) => l.id === lead.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...lead, updatedAt: now };
        setStored('leads', list);
        this.logActivity('Lead', list[idx].id, 'Updated', `Updated lead ${list[idx].name}`);
        return list[idx];
      }
    }
    const newLead: Lead = {
      id: lead.id || `lead_${Date.now()}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || '',
      source: lead.source || 'Website Inbound',
      interest: lead.interest || 'Standard Engagement',
      assignedTo: lead.assignedTo || 'Unassigned',
      status: lead.status || 'New Lead',
      notes: lead.notes || '',
      tenantId: lead.tenantId,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(newLead);
    setStored('leads', list);
    this.logActivity('Lead', newLead.id, 'Created', `Captured new lead ${newLead.name}`);
    return newLead;
  },

  deleteLead(id: string) {
    const list = getStored<Lead[]>('leads', []);
    const removed = list.find((l) => l.id === id);
    const updated = list.filter((l) => l.id !== id);
    setStored('leads', updated);
    if (removed) {
      this.logActivity('Lead', id, 'Deleted', `Deleted lead ${removed.name}`);
    }
  },

  // DEALS (PIPELINE)
  getDeals(): Deal[] {
    return getStored<Deal[]>('deals', []);
  },

  saveDeal(deal: Partial<Deal> & { name: string; value: number }): Deal {
    const list = getStored<Deal[]>('deals', []);
    const now = new Date().toISOString();
    if (deal.id) {
      const idx = list.findIndex((d) => d.id === deal.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...deal, updatedAt: now };
        setStored('deals', list);
        this.logActivity('Deal', list[idx].id, 'Updated', `Updated deal ${list[idx].name}`);
        return list[idx];
      }
    }
    const newDeal: Deal = {
      id: deal.id || `deal_${Date.now()}`,
      name: deal.name,
      company: deal.company || '',
      contact: deal.contact || '',
      value: deal.value,
      stage: deal.stage || 'Proposal',
      assignedTo: deal.assignedTo || 'Unassigned',
      expectedCloseDate: deal.expectedCloseDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      tag: deal.tag || 'Standard',
      notes: deal.notes || '',
      tenantId: deal.tenantId,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(newDeal);
    setStored('deals', list);
    this.logActivity('Deal', newDeal.id, 'Created', `Created new deal ${newDeal.name} (₹${newDeal.value.toLocaleString()})`);
    return newDeal;
  },

  deleteDeal(id: string) {
    const list = getStored<Deal[]>('deals', []);
    const removed = list.find((d) => d.id === id);
    const updated = list.filter((d) => d.id !== id);
    setStored('deals', updated);
    if (removed) {
      this.logActivity('Deal', id, 'Deleted', `Deleted deal ${removed.name}`);
    }
  },

  // TASKS
  getTasks(): Task[] {
    return getStored<Task[]>('tasks', []);
  },

  saveTask(task: Partial<Task> & { title: string }): Task {
    const list = getStored<Task[]>('tasks', []);
    const now = new Date().toISOString();
    if (task.id) {
      const idx = list.findIndex((t) => t.id === task.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...task, updatedAt: now };
        setStored('tasks', list);
        return list[idx];
      }
    }
    const newTask: Task = {
      id: task.id || `task_${Date.now()}`,
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo || 'Unassigned',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: task.status || 'Pending',
      relatedCustomer: task.relatedCustomer || '',
      relatedLead: task.relatedLead || '',
      tenantId: task.tenantId,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(newTask);
    setStored('tasks', list);
    return newTask;
  },

  deleteTask(id: string) {
    const list = getStored<Task[]>('tasks', []).filter((t) => t.id !== id);
    setStored('tasks', list);
  },

  // CALLS
  getCalls(): Call[] {
    return getStored<Call[]>('calls', []);
  },

  saveCall(call: Partial<Call> & { contactName: string; phone: string }): Call {
    const list = getStored<Call[]>('calls', []);
    const newCall: Call = {
      id: call.id || `call_${Date.now()}`,
      contactName: call.contactName,
      phone: call.phone,
      type: call.type || 'Outbound',
      status: call.status || 'Scheduled',
      callDate: call.callDate || new Date().toISOString(),
      durationMinutes: call.durationMinutes || 0,
      assignedEmployee: call.assignedEmployee || 'Unassigned',
      notes: call.notes || '',
      relatedCustomer: call.relatedCustomer || '',
      relatedLead: call.relatedLead || '',
      tenantId: call.tenantId,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newCall);
    setStored('calls', list);
    return newCall;
  },

  deleteCall(id: string) {
    const list = getStored<Call[]>('calls', []).filter((c) => c.id !== id);
    setStored('calls', list);
  },

  // COMMUNICATIONS
  getCommunications(): Communication[] {
    return getStored<Communication[]>('communications', []);
  },

  saveCommunication(comm: Partial<Communication> & { subject: string }): Communication {
    const list = getStored<Communication[]>('communications', []);
    const newComm: Communication = {
      id: comm.id || `comm_${Date.now()}`,
      type: comm.type || 'Email',
      subject: comm.subject,
      content: comm.content || '',
      relatedCustomer: comm.relatedCustomer || '',
      relatedLead: comm.relatedLead || '',
      author: comm.author || 'Account Lead',
      tenantId: comm.tenantId,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newComm);
    setStored('communications', list);
    return newComm;
  },

  // APPOINTMENTS
  getAppointments(): Appointment[] {
    return getStored<Appointment[]>('appointments', []);
  },

  saveAppointment(appt: Partial<Appointment> & { title: string }): Appointment {
    const list = getStored<Appointment[]>('appointments', []);
    const newAppt: Appointment = {
      id: appt.id || `apt_${Date.now()}`,
      title: appt.title,
      date: appt.date || new Date().toISOString().split('T')[0],
      time: appt.time || '10:00 AM',
      type: appt.type || 'Meeting',
      attendees: appt.attendees || 'Lead Contact',
      notes: appt.notes || '',
      tenantId: appt.tenantId,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newAppt);
    setStored('appointments', list);
    return newAppt;
  },

  deleteAppointment(id: string) {
    const list = getStored<Appointment[]>('appointments', []).filter((a) => a.id !== id);
    setStored('appointments', list);
  },

  // TICKETS
  getTickets(): Ticket[] {
    return getStored<Ticket[]>('tickets', []);
  },

  saveTicket(ticket: Partial<Ticket> & { subject: string; customerId: string }): Ticket {
    const list = getStored<Ticket[]>('tickets', []);
    const now = new Date().toISOString();
    if (ticket.id) {
      const idx = list.findIndex((t) => t.id === ticket.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...ticket, updatedAt: now };
        setStored('tickets', list);
        return list[idx];
      }
    }
    const newTicket: Ticket = {
      id: ticket.id || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: ticket.customerId,
      customerName: ticket.customerName || 'Direct Client',
      subject: ticket.subject,
      description: ticket.description || '',
      category: ticket.category || 'General',
      priority: ticket.priority || 'Medium',
      assignedTo: ticket.assignedTo || 'Support Desk',
      status: ticket.status || 'Open',
      tenantId: ticket.tenantId,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(newTicket);
    setStored('tickets', list);
    return newTicket;
  },

  deleteTicket(id: string) {
    const list = getStored<Ticket[]>('tickets', []).filter((t) => t.id !== id);
    setStored('tickets', list);
  },

  // TICKET MESSAGES
  getTicketMessages(ticketId?: string): TicketMessage[] {
    const list = getStored<TicketMessage[]>('ticket_messages', []);
    if (ticketId) {
      return list.filter((m) => m.ticketId === ticketId);
    }
    return list;
  },

  saveTicketMessage(msg: { ticketId: string; authorName: string; authorRole: string; message: string }): TicketMessage {
    const list = getStored<TicketMessage[]>('ticket_messages', []);
    const newMsg: TicketMessage = {
      id: `tmsg_${Date.now()}`,
      ticketId: msg.ticketId,
      authorName: msg.authorName,
      authorRole: msg.authorRole,
      message: msg.message,
      createdAt: new Date().toISOString(),
    };
    list.push(newMsg);
    setStored('ticket_messages', list);
    return newMsg;
  },

  addTicketMessage(ticketId: string, message: string, authorName: string, authorRole: string): TicketMessage {
    return this.saveTicketMessage({ ticketId, message, authorName, authorRole });
  },

  // NOTIFICATIONS
  getNotifications(): Notification[] {
    return getStored<Notification[]>('notifications', []);
  },

  addNotification(notif: { title: string; message: string; type?: string; userId?: string; tenantId?: string }): Notification {
    const list = getStored<Notification[]>('notifications', []);
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      title: notif.title,
      message: notif.message,
      type: notif.type || 'System',
      userId: notif.userId,
      tenantId: notif.tenantId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newNotif);
    setStored('notifications', list);
    return newNotif;
  },

  createNotification(notif: { title: string; message: string; type?: string; userId?: string; tenantId?: string }): Notification {
    return this.addNotification(notif);
  },

  markNotificationRead(id: string) {
    const list = getStored<Notification[]>('notifications', []);
    const found = list.find((n) => n.id === id);
    if (found) {
      found.isRead = true;
      setStored('notifications', list);
    }
  },

  markNotificationsRead() {
    const list = getStored<Notification[]>('notifications', []);
    list.forEach((n) => (n.isRead = true));
    setStored('notifications', list);
  },

  markAllNotificationsRead() {
    this.markNotificationsRead();
  },

  // ACTIVITY LOGS
  getActivityLogs(): ActivityLog[] {
    return getStored<ActivityLog[]>('activity_logs', []);
  },

  logActivity(entityType: string, entityId: string, action: string, description: string, tenantId?: string) {
    const list = getStored<ActivityLog[]>('activity_logs', []);
    const newLog: ActivityLog = {
      id: `act_${Date.now()}`,
      entityType,
      entityId,
      action,
      description,
      tenantId,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newLog);
    setStored('activity_logs', list.slice(0, 50));
  },

  // METRICS & REPORT SUMMARY
  getReportSummary() {
    const customers = this.getCustomers();
    const leads = this.getLeads();
    const deals = this.getDeals();
    const tickets = this.getTickets();
    const tasks = this.getTasks();

    const wonDeals = deals.filter((d) => d.stage === 'Won');
    const lostDeals = deals.filter((d) => d.stage === 'Lost');
    const openDeals = deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost');

    const totalRevenue = wonDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const pipelineValue = openDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const conversionRate = leads.length > 0 ? ((wonDeals.length / leads.length) * 100).toFixed(1) : '0';

    const openTickets = tickets.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;

    return {
      totalCustomers: customers.length,
      activeLeads: leads.filter((l) => l.status !== 'Won' && l.status !== 'Lost').length,
      totalLeads: leads.length,
      openDeals: openDeals.length,
      wonDealsCount: wonDeals.length,
      lostDealsCount: lostDeals.length,
      totalRevenue,
      pipelineValue,
      conversionRate: Number(conversionRate),
      openTickets,
      pendingTasks,
    };
  },

  // GLOBAL SEARCH
  globalSearch(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: Array<{
      type: string;
      id: string;
      title: string;
      subtitle: string;
      route: string;
    }> = [];

    this.getCustomers().forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)) {
        results.push({ type: 'Customer', id: c.id, title: c.name, subtitle: `${c.company} · ${c.status}`, route: '/customers' });
      }
    });

    this.getLeads().forEach((l) => {
      if (l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)) {
        results.push({ type: 'Lead', id: l.id, title: l.name, subtitle: `${l.status} · ${l.company}`, route: '/leads' });
      }
    });

    this.getDeals().forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.company.toLowerCase().includes(q)) {
        results.push({ type: 'Deal', id: d.id, title: d.name, subtitle: `${d.stage} · ₹${d.value.toLocaleString()}`, route: '/pipeline' });
      }
    });

    this.getTickets().forEach((t) => {
      if (t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) {
        results.push({ type: 'Ticket', id: t.id, title: t.subject, subtitle: `${t.id} · ${t.priority} Priority`, route: '/tickets' });
      }
    });

    this.getTasks().forEach((tsk) => {
      if (tsk.title.toLowerCase().includes(q)) {
        results.push({ type: 'Task', id: tsk.id, title: tsk.title, subtitle: `${tsk.priority} Priority · ${tsk.status}`, route: '/tasks' });
      }
    });

    return results.slice(0, 15);
  },
};
