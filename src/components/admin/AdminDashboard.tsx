import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  LogOut,
  ExternalLink,
  Search,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  Truck,
  Filter,
  Shield,
  User,
  Settings,
  Mail,
  Phone,
  MapPin,
  Building2,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import type { AdminUser, SwatchRequestItem } from '../../types/adminTypes';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import { PRODUCTS_DATA } from '../../data/productsData';
import { PROJECTS_DATA } from '../../data/projectsData';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onReturnToSite: () => void;
}

// MOCK SWATCH REQUESTS FOR DEMO
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
  },
  {
    id: 'SW-9039',
    clientName: 'Sebastian Vance',
    email: 'svance@vancedesign.com',
    phone: '+1 212 555 0198',
    address: '740 Park Avenue, Penthouse B, New York, NY 10021',
    categoryTitle: 'Hand-Knotted Rugs',
    categorySlug: 'rugs',
    swatchesRequested: ['Himalayan Wool & Botanical Silk', 'Tibetan Cut-Loop Weave'],
    status: 'Delivered',
    requestDate: '3 days ago'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onReturnToSite
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'swatches' | 'projects' | 'settings'>('overview');
  const [swatchRequests, setSwatchRequests] = useState<SwatchRequestItem[]>(INITIAL_SWATCH_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Status Change Handler for Swatch Requests
  const handleUpdateSwatchStatus = (id: string, newStatus: SwatchRequestItem['status']) => {
    setSwatchRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.materialComposition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || p.categorySlug === selectedCategoryFilter;
    return matchesSearch && matchesCat;
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
                Atelier Curator Administration
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center space-x-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-[#C5A059] text-[#121110] font-bold text-xs flex items-center justify-center">
                VS
              </div>
              <div className="text-left leading-tight">
                <span className="block text-xs font-bold text-white">{user.name}</span>
                <span className="text-[10px] text-[#C5A059] font-medium">{user.role}</span>
              </div>
            </div>

            <button
              onClick={onReturnToSite}
              className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden md:inline">Live Site</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-200 hover:bg-red-900/60 text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- DASHBOARD NAVIGATION TABS BAR --- */}
      <div className="bg-[#121110] border-b border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 sm:space-x-6 overflow-x-auto py-2">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard },
            { id: 'products', label: 'Product Catalog', icon: Package },
            { id: 'swatches', label: 'Swatch Orders', icon: Layers, badge: swatchRequests.filter(s => s.status === 'Pending').length },
            { id: 'projects', label: 'Residence Portfolio', icon: Building2 },
            { id: 'settings', label: 'Admin Security', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#C5A059] text-[#121110] shadow-lg font-bold'
                    : 'text-[#D8C8B8] hover:text-[#F5D07F] hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-[#121110] text-[#F5D07F]' : 'bg-[#C5A059] text-[#121110]'}`}>
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
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                  <span>Swatch Requests</span>
                  <Layers className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-white">48</span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14% this week
                  </span>
                </div>
                <span className="text-[11px] text-[#8C7A6B] block">3 Pending dispatch</span>
              </div>

              <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                  <span>Active Catalog Items</span>
                  <Package className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-white">
                    {PRODUCTS_DATA.length}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">8 Categories</span>
                </div>
                <span className="text-[11px] text-[#8C7A6B] block">100% Bespoke Sourced</span>
              </div>

              <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                  <span>Residence Portfolio</span>
                  <Building2 className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-white">
                    {PROJECTS_DATA.length}
                  </span>
                  <span className="text-xs text-[#F5D07F] font-semibold">Superyachts & Villas</span>
                </div>
                <span className="text-[11px] text-[#8C7A6B] block">Mayfair, Como & NYC</span>
              </div>

              <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                  <span>Curator Security</span>
                  <Shield className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl font-bold text-emerald-400">Active</span>
                  <span className="text-xs text-[#D8C8B8]">Session SSL</span>
                </div>
                <span className="text-[11px] text-[#8C7A6B] block">Logged in as Master</span>
              </div>
            </div>

            {/* Recent Swatch Requests Feed */}
            <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-serif text-xl text-white font-bold">
                    Recent Client Swatch Requests
                  </h3>
                  <p className="text-xs text-[#D8C8B8]">
                    Manage complimentary swatch box dispatches for high-net-worth clients.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('swatches')}
                  className="text-xs uppercase tracking-widest text-[#F5D07F] hover:underline font-semibold"
                >
                  View All ({swatchRequests.length}) &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {swatchRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C5A059]/50 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-[#F5D07F]">
                          {req.id}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {req.clientName}
                        </span>
                        <span className="text-[11px] text-[#8C7A6B]">({req.requestDate})</span>
                      </div>
                      <p className="text-xs text-[#D8C8B8]">{req.address}</p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-[#C5A059]">
                          {req.categoryTitle}:
                        </span>
                        {req.swatchesRequested.map((sw, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white"
                          >
                            {sw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          req.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : req.status === 'Dispatched'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {req.status}
                      </span>

                      {req.status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateSwatchStatus(req.id, 'Dispatched')}
                          className="px-3 py-1 rounded-lg bg-[#C5A059] text-[#121110] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch</span>
                        </button>
                      )}
                      {req.status === 'Dispatched' && (
                        <button
                          onClick={() => handleUpdateSwatchStatus(req.id, 'Delivered')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                  Inspect and curate active items across all 8 atelier archive categories.
                </p>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#C5A059] text-[#121110] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center justify-center space-x-2 shadow-lg"
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
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="All" className="bg-[#141312] text-white">All Categories ({PRODUCTS_DATA.length})</option>
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
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-all" title="Edit Product">
                            <Edit className="w-3.5 h-3.5" />
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
                Inspect high-net-worth client swatch requests and manage dispatch fulfillment.
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${req.status === 'Pending' ? 'bg-[#C5A059] text-[#121110]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleUpdateSwatchStatus(req.id, 'Dispatched')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${req.status === 'Dispatched' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}
                      >
                        Dispatched
                      </button>
                      <button
                        onClick={() => handleUpdateSwatchStatus(req.id, 'Delivered')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${req.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}
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
                <div key={prj.id} className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-xl space-y-3">
                  <div className="relative h-44 overflow-hidden">
                    <img src={prj.heroImage} alt={prj.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#121110]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#F5D07F] border border-[#C5A059]/30 uppercase">
                      {prj.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] text-[#C5A059] uppercase tracking-wider">{prj.location} ({prj.year})</span>
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
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
            <div className="pb-4 border-b border-white/10">
              <h2 className="font-serif text-2xl font-bold text-white">Admin Security & Curator Settings</h2>
              <p className="text-xs text-[#D8C8B8]">
                Manage active master admin profile credentials, session timeouts, and system access.
              </p>
            </div>

            <div className="bg-[#141312] border border-[#C5A059]/30 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-[#C5A059] text-[#121110] font-bold text-2xl flex items-center justify-center shadow-lg">
                  VS
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{user.name}</h3>
                  <span className="text-xs text-[#F5D07F] font-bold uppercase tracking-wider">{user.role}</span>
                  <span className="text-xs text-[#8C7A6B] block">{user.email}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-semibold text-[#D4AF37] uppercase tracking-widest">Demo Master Credentials Recap</h4>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono space-y-1">
                  <p><span className="text-[#8C7A6B]">Admin Email:</span> <strong className="text-white">admin@maison-drape.com</strong></p>
                  <p><span className="text-[#8C7A6B]">Master Password:</span> <strong className="text-[#F5D07F]">MaisonAdmin2026!</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- ADD PRODUCT MOCKUP MODAL --- */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141312] border border-[#C5A059]/40 rounded-3xl p-6 max-w-lg w-full space-y-4 text-white">
            <h3 className="font-serif text-xl font-bold">Add New Product to Catalog</h3>
            <p className="text-xs text-[#D8C8B8]">Simulate adding a new luxury textile or curtain product to the active atelier archive.</p>
            <input type="text" placeholder="Product Name (e.g. Como Raw Silk Voile)" className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white" />
            <input type="text" placeholder="Material Composition (e.g. 100% Silk)" className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white" />
            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setShowAddProductModal(false)} className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold">Cancel</button>
              <button onClick={() => setShowAddProductModal(false)} className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#121110] text-xs font-bold">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
