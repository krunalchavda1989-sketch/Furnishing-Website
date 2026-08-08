export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Master Curator' | 'Super Admin' | 'Catalog Editor';
  avatar?: string;
  lastLogin: string;
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

export interface SystemStat {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}
