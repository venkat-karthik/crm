/**
 * Firebase Firestore Multi-Tenant CRM Database Service
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { firestoreDb, handleFirestoreError, OperationType } from './firebase';
import {
  Customer,
  Lead,
  Deal,
  Task,
  Call,
  Communication,
  Appointment,
  Ticket,
  TicketMessage,
  Notification,
  ActivityLog,
} from './db';

export const firebaseDb = {
  // --- CUSTOMERS ---
  async getCustomers(tenantId: string): Promise<Customer[]> {
    const colPath = 'customers';
    try {
      const q = query(collection(firestoreDb, colPath), where('tenantId', '==', tenantId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Customer));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
      return [];
    }
  },

  async saveCustomer(customer: Partial<Customer> & { tenantId: string }): Promise<Customer> {
    const colPath = 'customers';
    const now = new Date().toISOString();
    const id = customer.id || `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullCustomer: Customer = {
      id,
      tenantId: customer.tenantId,
      name: customer.name || 'Unnamed Client',
      email: customer.email || '',
      phone: customer.phone || '',
      company: customer.company || '',
      source: customer.source || 'Direct',
      status: customer.status || 'Active',
      assignedEmployee: customer.assignedEmployee || 'Lead Rep',
      notes: customer.notes || '',
      createdAt: customer.createdAt || now,
      updatedAt: now,
    } as Customer;

    try {
      await setDoc(doc(firestoreDb, colPath, id), fullCustomer);
      return fullCustomer;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${colPath}/${id}`);
      return fullCustomer;
    }
  },

  // --- LEADS ---
  async getLeads(tenantId: string): Promise<Lead[]> {
    const colPath = 'leads';
    try {
      const q = query(collection(firestoreDb, colPath), where('tenantId', '==', tenantId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Lead));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
      return [];
    }
  },

  async saveLead(lead: Partial<Lead> & { tenantId: string }): Promise<Lead> {
    const colPath = 'leads';
    const now = new Date().toISOString();
    const id = lead.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullLead: Lead = {
      id,
      tenantId: lead.tenantId,
      name: lead.name || 'Inbound Lead',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      source: lead.source || 'Website',
      interest: lead.interest || 'CRM Platform',
      assignedTo: lead.assignedTo || 'Unassigned',
      status: lead.status || 'New Lead',
      notes: lead.notes || '',
      createdAt: lead.createdAt || now,
      updatedAt: now,
    } as Lead;

    try {
      await setDoc(doc(firestoreDb, colPath, id), fullLead);
      return fullLead;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${colPath}/${id}`);
      return fullLead;
    }
  },

  // --- DEALS ---
  async getDeals(tenantId: string): Promise<Deal[]> {
    const colPath = 'deals';
    try {
      const q = query(collection(firestoreDb, colPath), where('tenantId', '==', tenantId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Deal));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
      return [];
    }
  },

  async saveDeal(deal: Partial<Deal> & { tenantId: string }): Promise<Deal> {
    const colPath = 'deals';
    const now = new Date().toISOString();
    const id = deal.id || `deal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullDeal: Deal = {
      id,
      tenantId: deal.tenantId,
      name: deal.name || 'Enterprise Deal',
      company: deal.company || '',
      contact: deal.contact || '',
      value: Number(deal.value) || 0,
      stage: deal.stage || 'Proposal',
      assignedTo: deal.assignedTo || 'Lead Rep',
      expectedCloseDate: deal.expectedCloseDate || now,
      tag: deal.tag || 'Standard',
      notes: deal.notes || '',
      createdAt: deal.createdAt || now,
      updatedAt: now,
    } as Deal;

    try {
      await setDoc(doc(firestoreDb, colPath, id), fullDeal);
      return fullDeal;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${colPath}/${id}`);
      return fullDeal;
    }
  },

  // --- TASKS ---
  async getTasks(tenantId: string): Promise<Task[]> {
    const colPath = 'tasks';
    try {
      const q = query(collection(firestoreDb, colPath), where('tenantId', '==', tenantId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Task));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
      return [];
    }
  },

  async saveTask(task: Partial<Task> & { tenantId: string }): Promise<Task> {
    const colPath = 'tasks';
    const now = new Date().toISOString();
    const id = task.id || `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullTask: Task = {
      id,
      tenantId: task.tenantId,
      title: task.title || 'Follow up with lead',
      description: task.description || '',
      assignedTo: task.assignedTo || 'Me',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || now,
      status: task.status || 'Pending',
      relatedCustomer: task.relatedCustomer || '',
      relatedLead: task.relatedLead || '',
      createdAt: task.createdAt || now,
      updatedAt: now,
    } as Task;

    try {
      await setDoc(doc(firestoreDb, colPath, id), fullTask);
      return fullTask;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${colPath}/${id}`);
      return fullTask;
    }
  },

  // --- TICKETS ---
  async getTickets(tenantId: string): Promise<Ticket[]> {
    const colPath = 'tickets';
    try {
      const q = query(collection(firestoreDb, colPath), where('tenantId', '==', tenantId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Ticket));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
      return [];
    }
  },

  async saveTicket(ticket: Partial<Ticket> & { tenantId: string }): Promise<Ticket> {
    const colPath = 'tickets';
    const now = new Date().toISOString();
    const id = ticket.id || `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullTicket: Ticket = {
      id,
      tenantId: ticket.tenantId,
      customerId: ticket.customerId || 'cust_general',
      customerName: ticket.customerName || 'Direct Client',
      subject: ticket.subject || 'Support Ticket',
      description: ticket.description || '',
      category: ticket.category || 'General',
      priority: ticket.priority || 'Medium',
      assignedTo: ticket.assignedTo || 'Support Desk',
      status: ticket.status || 'Open',
      createdAt: ticket.createdAt || now,
      updatedAt: now,
    } as Ticket;

    try {
      await setDoc(doc(firestoreDb, colPath, id), fullTicket);
      return fullTicket;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${colPath}/${id}`);
      return fullTicket;
    }
  },
};
