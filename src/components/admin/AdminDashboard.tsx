import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  LogOut,
  ExternalLink,
  Search,
  Plus,
  TrendingUp,
  Shield,
  Settings,
  Building2,
  Trash2,
  Database,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Mail,
  PhoneCall
} from 'lucide-react';
import type { AdminUser, SwatchRequestItem, AuditLogItem, ContactInquiryItem } from '../../types/adminTypes';
import type { Product, CategorySlug } from '../../types';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import { PRODUCTS_DATA } from '../../data/productsData';
import { PROJECTS_DATA } from '../../data/projectsData';
import {
  supabase,
  isSupabaseConfigured,
  testSupabaseConnection,
  fetchProductsFromSupabase,
  createProductInSupabase,
  deleteProductInSupabase,
  fetchAdminAuditLogsFromSupabase,
  logAdminActivityInSupabase,
  fetchAdminUsersFromSupabase,
  fetchContactInquiriesFromSupabase,
  updateContactInquiryStatusInSupabase,
  deleteContactInquiryInSupabase
} from '../../lib/supabase';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onReturnToSite: () => void;
}

// FALLBACK INITIAL DATA
const INITIAL_SWATCH_REQUESTS: SwatchRequestItem[] = [
  {
    id: 'SW-9041',
    clientName: 'Lord Alistair Crawford',
    email: 'a.crawford@mayfair-estates.co.uk',
    phone: '+44 20 7946 0912',
    address: '14 Grosvenor Square, Mayfair, London W1K 6LD',
    categoryTitle: 'Bespoke Fabrics',
    categorySlug: 'fabrics',
    swatchesRequested: ['Como Raw Silk', 'Belgian Flanders Flax Linen'],
    status: 'Pending',
    requestDate: 'Today at 14:32'
  },
  {
    id: 'SW-9040',
    clientName: 'Madame Genevieve Laurent',
    email: 'g.laurent@laurent-interiors.fr',
    phone: '+33 1 42 68 55 00',
    address: '28 Avenue Montaigne, 75008 Paris, France',
    categoryTitle: 'Curtains & Upholstery',
    categorySlug: 'curtains-upholstery',
    swatchesRequested: ['Florentine Mohair Velvet', 'Acoustic Sheer Flax'],
    status: 'Dispatched',
    requestDate: 'Yesterday'
  }
];

const INITIAL_CONTACT_INQUIRIES: ContactInquiryItem[] = [
  {
    id: 'INQ-8021',
    clientName: 'Lady Eleanor Vance',
    email: 'e.vance@mayfair-villas.co.uk',
    phone: '+44 20 7946 0811',
    productInterest: 'Bespoke Fabrics',
    projectScope: 'Full Villa Refurbishment',
    preferredShowroom: 'London Mayfair Showroom (UK)',
    message: 'Requesting initial private consultation for silk drape installation across Mayfair penthouse residence.',
    status: 'New',
    requestDate: 'Today at 11:15'
  },
  {
    id: 'INQ-8020',
    clientName: 'Viscount Harrison Thorne',
    email: 'h.thorne@kensington-residences.com',
    phone: '+44 20 7946 0722',
    productInterest: 'Curtains & Upholstery',
    projectScope: 'Drawing Room Upholstery',
    preferredShowroom: 'Paris Avenue Montaigne Showroom (France)',
    message: 'Interested in velvet upholstery & acoustic sheers for historical drawing room restoration.',
    status: 'Contacted',
    requestDate: 'Yesterday'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onReturnToSite
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'inquiries' | 'products' | 'swatches' | 'audit-logs' | 'projects' | 'settings'
  >('overview');

  const [swatchRequests, setSwatchRequests] = useState<SwatchRequestItem[]>(INITIAL_SWATCH_REQUESTS);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiryItem[]>(INITIAL_CONTACT_INQUIRIES);
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS_DATA);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([
    {
      id: 'adm-001',
      name: 'Lady Vivienne Sterling',
      email: 'admin@maison-drape.com',
      role: 'Master Curator',
      status: 'Active',
      lastLogin: 'Today'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Supabase Database Connection & Ping Metrics
  const [dbMetrics, setDbMetrics] = useState<{
    tested: boolean;
    connected: boolean;
    latencyMs: number;
    message: string;
    isTesting: boolean;
  }>({
    tested: false,
    connected: false,
    latencyMs: 0,
    message: 'Initializing...',
    isTesting: false
  });

  // Add Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    categorySlug: 'fabrics' as CategorySlug,
    materialComposition: '',
    origin: 'Como, Italy',
    priceCategory: 'Bespoke',
    shortDescription: '',
    widthOrDimensions: '140 cm width',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1200'
  });

  // Load all live Supabase data on mount
  useEffect(() => {
    runDatabaseCheck();
    fetchLiveSupabaseData();
  }, []);

  const runDatabaseCheck = async () => {
    setDbMetrics((prev) => ({ ...prev, isTesting: true }));
    const res = await testSupabaseConnection();
    setDbMetrics({
      tested: true,
      connected: res.success,
      latencyMs: res.latencyMs,
      message: res.message,
      isTesting: false
    });
  };

  const fetchLiveSupabaseData = async () => {
    if (!isSupabaseConfigured) return;

    // 1. Fetch Contact Inquiries
    const inqs = await fetchContactInquiriesFromSupabase();
    if (inqs && inqs.length > 0) {
      setContactInquiries(inqs);
    }

    // 2. Fetch Swatch Requests
    fetchSupabaseSwatchRequests();

    // 3. Fetch Products
    const dbProds = await fetchProductsFromSupabase();
    if (dbProds && dbProds.length > 0) {
      setProductsList(dbProds);
    }

    // 4. Fetch Audit Logs
    const logs = await fetchAdminAuditLogsFromSupabase();
    setAuditLogs(logs);

    // 5. Fetch Admin Users
    const admins = await fetchAdminUsersFromSupabase();
    if (admins && admins.length > 0) {
      setAdminUsersList(admins);
    }
  };

  const fetchSupabaseSwatchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('swatch_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted: SwatchRequestItem[] = data.map((item) => ({
          id: item.id.substring(0, 8).toUpperCase(),
          clientName: item.client_name,
          email: item.email,
          phone: item.phone || '',
          address: item.address,
          categoryTitle: item.category_title,
          categorySlug: item.category_slug,
          swatchesRequested: item.swatches_requested || [],
          status: item.status || 'Pending',
          requestDate: new Date(item.created_at).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        setSwatchRequests(formatted);
      }
    } catch (err) {
      console.warn('Supabase swatch fetch exception:', err);
    }
  };

  // Status Change Handler for Contact Inquiries
  const handleUpdateInquiryStatus = async (id: string, newStatus: ContactInquiryItem['status']) => {
    setContactInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    if (isSupabaseConfigured) {
      await updateContactInquiryStatusInSupabase(id, newStatus, user.email);
      const updatedLogs = await fetchAdminAuditLogsFromSupabase();
      setAuditLogs(updatedLogs);
    }
  };

  // Delete Contact Inquiry
  const handleDeleteInquiry = async (id: string, clientName: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from "${clientName}"?`)) return;

    setContactInquiries((prev) => prev.filter((i) => i.id !== id));

    if (isSupabaseConfigured) {
      await deleteContactInquiryInSupabase(id, user.email);
      const updatedLogs = await fetchAdminAuditLogsFromSupabase();
      setAuditLogs(updatedLogs);
    }
  };

  // Status Change Handler for Swatch Requests
  const handleUpdateSwatchStatus = async (id: string, newStatus: SwatchRequestItem['status']) => {
    setSwatchRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('swatch_requests')
          .update({ status: newStatus })
          .eq('id', id);

        await logAdminActivityInSupabase(
          user.email,
          'SWATCH_STATUS_UPDATED',
          `Updated swatch request #${id} status to ${newStatus}`
        );

        const updatedLogs = await fetchAdminAuditLogsFromSupabase();
        setAuditLogs(updatedLogs);
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }
  };

  // Create Product Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.materialComposition) return;

    const catObj = CATEGORIES_DATA[newProductForm.categorySlug] || CATEGORIES_DATA['fabrics'];

    const newProd: Product = {
      id: `PRD-${Date.now().toString().slice(-4)}`,
      name: newProductForm.name,
      categorySlug: newProductForm.categorySlug,
      categoryName: catObj.title,
      shortDescription: newProductForm.shortDescription || `${newProductForm.name} crafted in ${newProductForm.origin}`,
      fullDescription: `${newProductForm.name} represents the pinnacle of luxury furnishing architecture.`,
      materialComposition: newProductForm.materialComposition,
      widthOrDimensions: newProductForm.widthOrDimensions,
      origin: newProductForm.origin,
      priceCategory: newProductForm.priceCategory as any,
      image: newProductForm.image,
      galleryImages: [newProductForm.image],
      swatchColors: [{ name: 'Classic Gold', hex: '#C5A059' }],
      swatchType: newProductForm.categorySlug === 'fabrics' ? 'silk' : 'linen',
      tags: ['Bespoke', 'Atelier']
    };

    setProductsList((prev) => [newProd, ...prev]);
    setShowAddProductModal(false);

    if (isSupabaseConfigured) {
      await createProductInSupabase(newProd, user.email);
      const updatedLogs = await fetchAdminAuditLogsFromSupabase();
      setAuditLogs(updatedLogs);
    }

    setNewProductForm({
      name: '',
      categorySlug: 'fabrics',
      materialComposition: '',
      origin: 'Como, Italy',
      priceCategory: 'Bespoke',
      shortDescription: '',
      widthOrDimensions: '140 cm width',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1200'
    });
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the active catalog?`)) return;

    setProductsList((prev) => prev.filter((p) => p.id !== id));

    if (isSupabaseConfigured) {
      await deleteProductInSupabase(id, user.email);
      const updatedLogs = await fetchAdminAuditLogsFromSupabase();
      setAuditLogs(updatedLogs);
    }
  };

  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.materialComposition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || p.categorySlug === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredInquiries = contactInquiries.filter((inq) => {
    const matchesSearch =
      inq.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0D0C0B] text-[#FDFBF7] flex flex-col font-sans selection:bg-[#C5A059]/30">
      {/* --- MASTER ADMIN HEADER BAR --- */}
      <header className="bg-[#141312] border-b border-[#C5A059]/30 py-3.5 px-4 sm:px-8 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] bg-[#C5A059]/20 flex items-center justify-center shadow-md">
              <span className="font-serif font-bold text-xl text-[#F5D07F]">M</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-lg font-bold tracking-widest text-white uppercase">
                  MAISON & DRAPE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[10px] font-bold text-[#F5D07F] uppercase tracking-wider">
                  Master Control
                </span>
              </div>
              <span className="text-[11px] text-[#D4AF37] font-medium block">
                Atelier Curator Administration & Supabase Sync
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center space-x-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-[#C5A059] text-[#121110] font-bold text-xs flex items-center justify-center">
                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="text-left leading-tight">
                <span className="block text-xs font-bold text-white">{user.name}</span>
                <span className="text-[10px] text-[#C5A059] font-medium">{user.role}</span>
              </div>
            </div>

            <button
              onClick={onReturnToSite}
              className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden md:inline">Live Site</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-200 hover:bg-red-900/60 text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- DASHBOARD NAVIGATION TABS BAR --- */}
      <div className="bg-[#121110] border-b border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-2">
          {[
            { id: 'overview', label: 'Overview & Sync', icon: LayoutDashboard },
            {
              id: 'inquiries',
              label: 'Client Inquiries',
              icon: Mail,
              badge: contactInquiries.filter((i) => i.status === 'New').length
            },
            { id: 'products', label: 'Product Catalog', icon: Package, badge: productsList.length },
            {
              id: 'swatches',
              label: 'Swatch Orders',
              icon: Layers,
              badge: swatchRequests.filter((s) => s.status === 'Pending').length
            },
            { id: 'audit-logs', label: 'Security Audit Logs', icon: ShieldCheck, badge: auditLogs.length },
            { id: 'projects', label: 'Residence Portfolio', icon: Building2 },
            { id: 'settings', label: 'Curator Staff', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#C5A059] text-[#121110] shadow-lg font-bold'
                    : 'text-[#D8C8B8] hover:text-[#F5D07F] hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#121110] text-[#F5D07F]' : 'bg-[#C5A059] text-[#121110]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- MAIN ADMIN CONTENT AREA --- */}
      <main className="grow max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Live Supabase Connection & Latency Banner */}
            <div className="bg-[#141312] border border-[#C5A059]/40 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-2 relative z-10">
                <div className="flex items-center space-x-2.5">
                  <Database className="w-5 h-5 text-[#F5D07F]" />
                  <h3 className="font-serif text-xl font-bold text-white">Supabase Cloud Database Status</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#F5D07F] text-[10px] font-mono font-bold uppercase border border-[#C5A059]/40">
                    ywsmtfhzlhljeqetmvol
                  </span>
                </div>
                <p className="text-xs text-[#D8C8B8]">
                  Real-time database synchronization active for Contact Inquiries, Swatch Requests, Catalog Products, and Security Audit Logs.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8C7A6B] pt-1">
                  <span>SSL Connection: 256-bit TLS</span>
                  <span>•</span>
                  <span>Tables Synced: contact_inquiries, swatch_requests, products, admin_users, admin_audit_logs</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 shrink-0 relative z-10">
                <div className="text-right">
                  <span className="block text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                    Ping Latency
                  </span>
                  <span className="font-mono text-2xl font-bold text-emerald-400">
                    {dbMetrics.latencyMs ? `${dbMetrics.latencyMs} ms` : 'Live'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    runDatabaseCheck();
                    fetchLiveSupabaseData();
                  }}
                  disabled={dbMetrics.isTesting}
                  className="p-3 rounded-xl bg-[#C5A059] text-[#121110] font-bold hover:bg-[#D4AF37] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  title="Re-test Supabase Connection"
                >
                  <RefreshCw className={`w-4 h-4 ${dbMetrics.isTesting ? 'animate-spin' : ''}`} />
                  <span className="text-xs uppercase tracking-wider">Sync Now</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                  <span>Client Inquiries</span>
                  <Mail className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-white">{contactInquiries.length}</span>
                  <span className="text-xs text-amber-400 font-semibold">
                    {contactInquiries.filter((i) => i.status === 'New').length} New Action Required
                  </span>
                </div>
                <span className="text-[11px] text-[#8C7A6B] block">Synced with contact_inquiries</span>
              </div>

              <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                  <span>Swatch Requests</span>
                  <Layers className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-white">{swatchRequests.length}</span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14% this week
                  </span>
                </div>
                <span className="text-[11px] text-[#8C7A6B] block">
                  {swatchRequests.filter((s) => s.status === 'Pending').length} Pending dispatch
                </span>
              </div>

              <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                  <span>Active Catalog Items</span>
                  <Package className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-white">{productsList.length}</span>
                  <span className="text-xs text-emerald-400 font-semibold">8 Categories</span>
                </div>
                <span className="text-[11px] text-[#8C7A6B] block">Synced with products table</span>
              </div>

              <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                  <span>Security Audit Logs</span>
                  <Shield className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-emerald-400">{auditLogs.length}</span>
                  <span className="text-xs text-[#D8C8B8]">Recorded Events</span>
                </div>
                <span className="text-[11px] text-[#8C7A6B] block">Logged to admin_audit_logs</span>
              </div>
            </div>

            {/* Recent Contact Inquiries Preview */}
            <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-serif text-xl text-white font-bold">Recent Client Contact Inquiries</h3>
                  <p className="text-xs text-[#D8C8B8]">
                    Inquiries submitted from the public contact page requiring atelier curator consultation.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs uppercase tracking-widest text-[#F5D07F] hover:underline font-semibold cursor-pointer"
                >
                  View All ({contactInquiries.length}) &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {contactInquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C5A059]/50 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-[#F5D07F] bg-[#C5A059]/20 px-2 py-0.5 rounded border border-[#C5A059]/40">
                          {inq.id}
                        </span>
                        <span className="text-sm font-semibold text-white">{inq.clientName}</span>
                        <span className="text-[11px] text-[#8C7A6B]">({inq.requestDate})</span>
                      </div>
                      <p className="text-xs text-[#D8C8B8] line-clamp-1">{inq.message}</p>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-[#C5A059]">
                        <span>Interest: <strong>{inq.productInterest}</strong></span>
                        <span>•</span>
                        <span>Showroom: <strong>{inq.preferredShowroom}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          inq.status === 'New'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : inq.status === 'Contacted'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : inq.status === 'Scheduled'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        {inq.status}
                      </span>
                      <button
                        onClick={() => handleUpdateInquiryStatus(inq.id, 'Contacted')}
                        className="px-3 py-1.5 rounded-lg bg-[#C5A059] text-[#121110] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all cursor-pointer"
                      >
                        Mark Contacted
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= CLIENT INQUIRIES TAB ================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Contact Form Inquiries Module</h2>
                <p className="text-xs text-[#D8C8B8]">
                  Manage private consultations, trade inquiries, and client quotes submitted from the storefront.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    const inqs = await fetchContactInquiriesFromSupabase();
                    if (inqs) setContactInquiries(inqs);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-semibold flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Refresh Inquiries</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search inquiries by client name, email, or message..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C5A059] focus:outline-none text-xs text-white placeholder-white/40"
                />
                <Search className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-3" />
              </div>

              <div className="md:col-span-4">
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#141312]">All Statuses ({contactInquiries.length})</option>
                  <option value="New" className="bg-[#141312]">New Action Required</option>
                  <option value="Contacted" className="bg-[#141312]">Contacted</option>
                  <option value="Scheduled" className="bg-[#141312]">Scheduled</option>
                  <option value="Archived" className="bg-[#141312]">Archived</option>
                </select>
              </div>
            </div>

            {/* Inquiries Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center bg-[#141312] border border-[#C5A059]/30 rounded-2xl text-[#8C7A6B]">
                  No matching contact form inquiries found.
                </div>
              ) : (
                filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-6 shadow-xl space-y-4 hover:border-[#C5A059]/60 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-bold text-[#F5D07F] bg-[#C5A059]/20 px-2.5 py-1 rounded-md border border-[#C5A059]/40">
                          {inq.id}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-white">{inq.clientName}</h4>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-[#8C7A6B]">Submitted: {inq.requestDate}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            inq.status === 'New'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : inq.status === 'Contacted'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : inq.status === 'Scheduled'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-white/10 text-gray-300 border border-white/20'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                          Client Contact Info
                        </span>
                        <p className="text-white font-medium flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                          <a href={`mailto:${inq.email}`} className="hover:underline">
                            {inq.email}
                          </a>
                        </p>
                        {inq.phone && (
                          <p className="text-[#D8C8B8] flex items-center gap-1.5 mt-0.5">
                            <PhoneCall className="w-3.5 h-3.5 text-[#C5A059]" />
                            <a href={`tel:${inq.phone}`} className="hover:underline">
                              {inq.phone}
                            </a>
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                          Showroom & Category Interest
                        </span>
                        <p className="text-white font-medium">{inq.productInterest}</p>
                        <p className="text-[#D8C8B8]">{inq.preferredShowroom}</p>
                        <span className="text-[10px] text-[#C5A059] block mt-0.5">Scope: {inq.projectScope}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                          Client Inquiry Message
                        </span>
                        <p className="text-[#D8C8B8] leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/10">
                          "{inq.message}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-2 text-xs text-[#8C7A6B]">
                        <span>Action Workflow:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'New')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            inq.status === 'New' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          New
                        </button>
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'Contacted')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            inq.status === 'Contacted' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          Mark Contacted
                        </button>
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'Scheduled')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            inq.status === 'Scheduled' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          Schedule Meeting
                        </button>
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'Archived')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            inq.status === 'Archived' ? 'bg-gray-700 text-white' : 'bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id, inq.clientName)}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 transition-all border border-red-500/30 cursor-pointer ml-2"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Product Catalog Management</h2>
                <p className="text-xs text-[#D8C8B8]">
                  Inspect and curate active luxury furnishing items synced live with Supabase Cloud DB.
                </p>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#C5A059] text-[#121110] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Catalog Product</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by name or material composition..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C5A059] focus:outline-none text-xs text-white placeholder-white/40"
                />
                <Search className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-3" />
              </div>

              <div className="md:col-span-4">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#141312] text-white">
                    All Categories ({productsList.length})
                  </option>
                  {Object.values(CATEGORIES_DATA).map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#141312] text-white">
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-[#D4AF37] uppercase tracking-wider text-[10px] font-bold border-b border-white/10">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Composition</th>
                      <th className="p-4">Origin</th>
                      <th className="p-4">Tier</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#D8C8B8]">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-semibold text-white flex items-center space-x-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border border-white/10"
                          />
                          <div>
                            <span className="block font-serif text-sm text-white">{prod.name}</span>
                            <span className="text-[10px] text-[#8C7A6B]">{prod.id}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-[#C5A059]">{prod.categoryName}</td>
                        <td className="p-4 max-w-xs truncate">{prod.materialComposition}</td>
                        <td className="p-4">{prod.origin}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#C5A059]/20 text-[#F5D07F] font-bold text-[10px] border border-[#C5A059]/30">
                            {prod.priceCategory}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 transition-all border border-red-500/30 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= SWATCHES TAB ================= */}
        {activeTab === 'swatches' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="pb-4 border-b border-white/10">
              <h2 className="font-serif text-2xl font-bold text-white">Client Swatch Sample Orders</h2>
              <p className="text-xs text-[#D8C8B8]">
                Inspect high-net-worth client swatch requests synced live with Supabase `swatch_requests` table.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {swatchRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold text-[#F5D07F] bg-[#C5A059]/20 px-2.5 py-1 rounded-md border border-[#C5A059]/40">
                        {req.id}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white">{req.clientName}</h4>
                    </div>
                    <span className="text-xs text-[#8C7A6B]">Request Date: {req.requestDate}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                        Client Contact
                      </span>
                      <p className="text-white font-medium">{req.email}</p>
                      <p className="text-[#D8C8B8]">{req.phone}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                        Delivery Address
                      </span>
                      <p className="text-[#D8C8B8] leading-relaxed">{req.address}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                        Requested Samples
                      </span>
                      <span className="font-semibold text-white block mb-1">{req.categoryTitle}</span>
                      <div className="flex flex-wrap gap-1">
                        {req.swatchesRequested.map((sw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-[#EBE5D8]">
                            {sw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#8C7A6B]">Current Status:</span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {req.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateSwatchStatus(req.id, 'Pending')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          req.status === 'Pending' ? 'bg-[#C5A059] text-[#121110]' : 'bg-white/5 text-white hover:bg-white/10'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleUpdateSwatchStatus(req.id, 'Dispatched')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          req.status === 'Dispatched' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'
                        }`}
                      >
                        Dispatched
                      </button>
                      <button
                        onClick={() => handleUpdateSwatchStatus(req.id, 'Delivered')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          req.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'
                        }`}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= AUDIT LOGS TAB ================= */}
        {activeTab === 'audit-logs' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Security & Activity Audit Logs</h2>
                <p className="text-xs text-[#D8C8B8]">
                  Real-time security event tracking persisted inside Supabase `admin_audit_logs` table.
                </p>
              </div>
              <button
                onClick={async () => {
                  const logs = await fetchAdminAuditLogsFromSupabase();
                  setAuditLogs(logs);
                }}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-semibold flex items-center gap-2 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
                <span>Recent Admin Activity Records</span>
                <span>{auditLogs.length} Events Logged</span>
              </div>
              <div className="divide-y divide-white/5 text-xs">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-[#8C7A6B]">No security logs recorded yet.</div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#F5D07F] font-mono text-[10px] font-bold border border-[#C5A059]/30">
                            {log.action}
                          </span>
                          <span className="font-semibold text-white">{log.adminEmail}</span>
                        </div>
                        <p className="text-xs text-[#D8C8B8]">{log.details}</p>
                      </div>
                      <span className="text-[11px] font-mono text-[#8C7A6B] shrink-0">{log.createdAt}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= PROJECTS TAB ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="pb-4 border-b border-white/10">
              <h2 className="font-serif text-2xl font-bold text-white">Residence & Yacht Portfolio</h2>
              <p className="text-xs text-[#D8C8B8]">
                Curate featured interior architecture projects displayed on the public portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROJECTS_DATA.map((prj) => (
                <div
                  key={prj.id}
                  className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-xl space-y-3"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={prj.heroImage} alt={prj.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#121110]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#F5D07F] border border-[#C5A059]/30 uppercase">
                      {prj.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] text-[#C5A059] uppercase tracking-wider">
                      {prj.location} ({prj.year})
                    </span>
                    <h4 className="font-serif text-lg text-white font-bold">{prj.title}</h4>
                    <p className="text-xs text-[#D8C8B8] line-clamp-2">{prj.description}</p>
                    <span className="text-[11px] text-[#8C7A6B] block">Designed by {prj.designer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
            <div className="pb-4 border-b border-white/10">
              <h2 className="font-serif text-2xl font-bold text-white">Admin Security & Curator Staff</h2>
              <p className="text-xs text-[#D8C8B8]">
                Manage active master admin profile credentials, session timeouts, and Supabase database access.
              </p>
            </div>

            <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-[#C5A059] text-[#121110] font-bold text-2xl flex items-center justify-center shadow-lg">
                  {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{user.name}</h3>
                  <span className="text-xs text-[#F5D07F] font-bold uppercase tracking-wider">{user.role}</span>
                  <span className="text-xs text-[#8C7A6B] block">{user.email}</span>
                </div>
              </div>

              {/* Team Members List from Supabase */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#D4AF37] uppercase tracking-widest text-xs flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Authorized Master Admin Team</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {adminUsersList.map((admin) => (
                    <div key={admin.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{admin.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {admin.status || 'Active'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#C5A059] block">{admin.role}</span>
                      <span className="text-[11px] text-[#8C7A6B] font-mono block">{admin.email}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-xs pt-4 border-t border-white/10">
                <h4 className="font-semibold text-[#D4AF37] uppercase tracking-widest">Supabase Cloud Database Instance</h4>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono space-y-2">
                  <p>
                    <span className="text-[#8C7A6B]">Project URL:</span>{' '}
                    <strong className="text-white">https://ywsmtfhzlhljeqetmvol.supabase.co</strong>
                  </p>
                  <p>
                    <span className="text-[#8C7A6B]">Admin Auth Email:</span>{' '}
                    <strong className="text-white">{user.email}</strong>
                  </p>
                  <p>
                    <span className="text-[#8C7A6B]">Database RLS Policy:</span>{' '}
                    <strong className="text-emerald-400">Strict Multi-Tenant Row Level Security Active</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- ADD PRODUCT MODAL --- */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141312] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-white shadow-2xl">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Add New Product to Catalog</h3>
              <p className="text-xs text-[#D8C8B8]">
                New products are written directly to your live Supabase `products` catalog table.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="e.g. Florentine Jacquard Damask"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Category</label>
                  <select
                    value={newProductForm.categorySlug}
                    onChange={(e) => setNewProductForm({ ...newProductForm, categorySlug: e.target.value as CategorySlug })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none cursor-pointer"
                  >
                    {Object.values(CATEGORIES_DATA).map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#141312]">
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Price Tier</label>
                  <select
                    value={newProductForm.priceCategory}
                    onChange={(e) => setNewProductForm({ ...newProductForm, priceCategory: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none cursor-pointer"
                  >
                    <option value="Bespoke" className="bg-[#141312]">Bespoke</option>
                    <option value="Haute Couture" className="bg-[#141312]">Haute Couture</option>
                    <option value="Atelier Reserve" className="bg-[#141312]">Atelier Reserve</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Material Composition</label>
                <input
                  type="text"
                  required
                  value={newProductForm.materialComposition}
                  onChange={(e) => setNewProductForm({ ...newProductForm, materialComposition: e.target.value })}
                  placeholder="e.g. 70% Silk, 30% Egyptian Cotton"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Origin</label>
                  <input
                    type="text"
                    value={newProductForm.origin}
                    onChange={(e) => setNewProductForm({ ...newProductForm, origin: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Dimensions / Width</label>
                  <input
                    type="text"
                    value={newProductForm.widthOrDimensions}
                    onChange={(e) => setNewProductForm({ ...newProductForm, widthOrDimensions: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-[#121110] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all shadow-lg cursor-pointer"
                >
                  Save Product to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
