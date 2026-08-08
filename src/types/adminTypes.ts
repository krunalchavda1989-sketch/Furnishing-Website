export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Master Curator' | 'Super Admin' | 'Catalog Editor';
  avatar?: string;
  lastLogin: string;
  status?: 'Active' | 'Suspended';
}

export interface SwatchRequestItem {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  categoryTitle: string;
  categorySlug: string;
  swatchesRequested: string[];
  status: 'Pending' | 'Dispatched' | 'Delivered' | 'Archived';
  requestDate: string;
}

export interface ContactInquiryItem {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  productInterest: string;
  projectScope: string;
  preferredShowroom: string;
  message: string;
  status: 'New' | 'Contacted' | 'Scheduled' | 'Archived';
  requestDate: string;
}

export interface AuditLogItem {
  id: string;
  adminEmail: string;
  action: string;
  details?: string;
  createdAt: string;
}

export interface SystemStat {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}
