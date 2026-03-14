
export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost'
}

export enum DealStage {
  PROSPECTING = 'Prospecting',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export interface User {
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string; // Will store "Product Category" for display compatibility
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  lastContact: string;
  avatar: string;
  
  // New detailed fields
  dialingCode?: string;
  mobile?: string;
  metalGroup?: string;
  productCategory?: string;
  description?: string;
  budget?: string;
  weight?: string;
  leadGeneration?: string;
}

export interface Deal {
  id: string;
  title: string;
  amount: number;
  stage: DealStage;
  closingDate: string;
  contactName: string;
  probability: number;
}

export interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Task';
  subject: string;
  dueDate: string;
  completed: boolean;
}

export type ViewState = 'dashboard' | 'leads' | 'deals' | 'contacts' | 'reports' | 'public-form' | 'add-lead';
