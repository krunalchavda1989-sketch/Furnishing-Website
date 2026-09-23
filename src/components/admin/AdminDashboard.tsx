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
  Settings,
  Building2,
  Trash2,
  Database,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Mail,
  PhoneCall,
  Phone,
  Smartphone,
  MapPin,
  Clock,
  Share2,
  Edit,
  Save,
  Menu,
  X,
  ChevronRight,
  Send,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Globe,
  Image as ImageIcon,
  Type,
  Sliders,
  PackageCheck,
  Layout,
  Star,
  Quote,
  Compass,
  Award,
  History,
  User
} from 'lucide-react';
import {
  InstagramIcon,
  PinterestIcon,
  LinkedInIcon,
  YouTubeIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsAppIcon
} from '../ui/SocialIcons';
import type { AdminUser, SwatchRequestItem, AuditLogItem, ContactInquiryItem, NewsletterSubscriberItem } from '../../types/adminTypes';
import type {
  Product,
  CategorySlug,
  Showroom,
  Project,
  SiteSettings,
  HeaderNavLink,
  Testimonial,
  BrandPartner,
  StorySettings,
  StoryMilestone,
  StoryGalleryItem,
  FurnishingScene,
  HeroHotspot
} from '../../types';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import { PRODUCTS_DATA } from '../../data/productsData';
import { PROJECTS_DATA } from '../../data/projectsData';
import { SHOWROOMS_DATA } from '../../data/brandsData';
import {
  supabase,
  isSupabaseConfigured,
  testSupabaseConnection,
  fetchProductsFromSupabase,
  createProductInSupabase,
  deleteProductInSupabase,
  fetchProjectsFromSupabase,
  createOrUpdateProjectInSupabase,
  deleteProjectInSupabase,
  fetchAdminAuditLogsFromSupabase,
  logAdminActivityInSupabase,
  fetchAdminUsersFromSupabase,
  fetchContactInquiriesFromSupabase,
  updateContactInquiryStatusInSupabase,
  deleteContactInquiryInSupabase,
  deleteSwatchRequestInSupabase,
  fetchNewsletterSubscribersFromSupabase,
  subscribeNewsletterInSupabase,
  updateNewsletterSubscriberStatusInSupabase,
  deleteNewsletterSubscriberInSupabase,
  deleteAdminAuditLogInSupabase,
  clearAllAdminAuditLogsInSupabase,
  fetchShowroomsFromSupabase,
  createOrUpdateShowroomInSupabase,
  deleteShowroomInSupabase,
  fetchSiteSettingsFromSupabase,
  updateSiteSettingsInSupabase,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_BRANDS_DATA,
  DEFAULT_STORY_SETTINGS,
  DEFAULT_HERO_SLIDES,
  fetchTestimonialsFromSupabase,
  saveTestimonialInSupabase,
  deleteTestimonialInSupabase,
  fetchBrandsFromSupabase,
  saveBrandInSupabase,
  deleteBrandInSupabase,
  fetchStorySettingsFromSupabase,
  updateStorySettingsInSupabase,
  fetchHeroSlidesFromSupabase,
  saveHeroSlideInSupabase,
  deleteHeroSlideInSupabase
} from '../../lib/supabase';
import { useToast } from '../ui/ToastNotification';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';
import { ImageUploader } from '../ui/ImageUploader';

// Persistent LocalStorage Deleted Keys Tracking Helpers
const getDeletedKeys = (key: string): string[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const recordDeletedKey = (key: string, val: string) => {
  try {
    const list = getDeletedKeys(key);
    if (val && !list.includes(val)) {
      list.push(val);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (e) {
    console.warn(e);
  }
};

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

const INITIAL_NEWSLETTER_SUBSCRIBERS: NewsletterSubscriberItem[] = [
  {
    id: 'sub-001',
    email: 'crawford.estates@mayfair-estates.co.uk',
    source: 'Footer Gazette',
    status: 'VIP Privé',
    createdAt: 'Today at 09:14'
  },
  {
    id: 'sub-002',
    email: 'g.laurent@laurent-interiors.fr',
    source: 'Exhibition Banner',
    status: 'Subscribed',
    createdAt: 'Yesterday'
  },
  {
    id: 'sub-003',
    email: 'harrison.thorne@kensington-residences.com',
    source: 'Footer Gazette',
    status: 'Subscribed',
    createdAt: '3 days ago'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onReturnToSite
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'inquiries' | 'products' | 'swatches' | 'audit-logs' | 'projects' | 'settings' | 'newsletter' | 'site-branding'
  >('overview');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Site Branding & Navigation State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('atelier_site_settings');
      if (saved) return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SITE_SETTINGS;
  });

  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('atelier_site_settings');
      if (saved) return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SITE_SETTINGS;
  });

  const [siteSettingsSubtab, setSiteSettingsSubtab] = useState<
    'nav-links' | 'header-styling' | 'logos' | 'hero-slides' | 'testimonials' | 'brands' | 'story-cms' | 'socials' | 'contact'
  >('nav-links');
  const [isSavingSiteSettings, setIsSavingSiteSettings] = useState(false);

  // Homepage Hero Showcase Slider State
  const [heroSlidesList, setHeroSlidesList] = useState<FurnishingScene[]>(() => {
    const deleted = getDeletedKeys('atelier_deleted_hero_slides');
    try {
      const saved = localStorage.getItem('atelier_hero_slides');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((s: FurnishingScene) => !deleted.includes(s.id));
        }
      }
    } catch {}
    return DEFAULT_HERO_SLIDES.filter((s) => !deleted.includes(s.id));
  });
  const [showHeroSlideModal, setShowHeroSlideModal] = useState(false);
  const [editingHeroSlideId, setEditingHeroSlideId] = useState<string | null>(null);
  const [selectedHotspotIdx, setSelectedHotspotIdx] = useState<number | null>(0);
  const [heroSlideForm, setHeroSlideForm] = useState<FurnishingScene>({
    id: `scene-${Date.now()}`,
    title: '',
    location: '',
    image: '',
    tagline: '',
    order: 1,
    isVisible: true,
    hotspots: []
  });

  // Testimonials State
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_testimonials');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TESTIMONIALS;
  });
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Testimonial>({
    id: `tst-${Date.now()}`,
    clientName: '',
    clientRole: '',
    location: '',
    quote: '',
    rating: 5,
    avatar: '',
    projectOrProduct: '',
    isFeatured: true,
    isVisible: true,
    order: 1
  });

  // Brands / Mill Partners State
  const [brandsList, setBrandsList] = useState<BrandPartner[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_brands_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BRANDS_DATA;
  });
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [brandForm, setBrandForm] = useState<BrandPartner>({
    id: `bnd-${Date.now()}`,
    name: '',
    country: '',
    established: '',
    tagline: '',
    description: '',
    logoText: '',
    image: '',
    specialty: '',
    featuredProducts: [],
    websiteUrl: '',
    isVisible: true,
    order: 1
  });

  // Our Story CMS State
  const [storySettingsForm, setStorySettingsForm] = useState<StorySettings>(() => {
    try {
      const saved = localStorage.getItem('atelier_story_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STORY_SETTINGS;
  });
  const [isSavingStorySettings, setIsSavingStorySettings] = useState(false);
  const [storyCmsSection, setStoryCmsSection] = useState<'hero' | 'founder' | 'pillars' | 'timeline' | 'gallery' | 'stats'>('hero');

  // Add / Edit Header Menu Link Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState<HeaderNavLink>({
    id: 'custom-link',
    label: '',
    target: 'home',
    hasMegaMenu: false,
    isExternal: false,
    isVisible: true,
    order: 1
  });


  const [swatchRequests, setSwatchRequests] = useState<SwatchRequestItem[]>(() => {
    const deleted = getDeletedKeys('atelier_deleted_swatches').concat(getDeletedKeys('maison_deleted_swatches'));
    return INITIAL_SWATCH_REQUESTS.filter((s) => !deleted.includes(s.id) && !deleted.includes(s.email));
  });

  const [contactInquiries, setContactInquiries] = useState<ContactInquiryItem[]>(() => {
    const deleted = getDeletedKeys('atelier_deleted_inquiries').concat(getDeletedKeys('maison_deleted_inquiries'));
    return INITIAL_CONTACT_INQUIRIES.filter((i) => !deleted.includes(i.id) && !deleted.includes(i.email));
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriberItem[]>(() => {
    const deleted = getDeletedKeys('atelier_deleted_subscribers').concat(getDeletedKeys('maison_deleted_subscribers'));
    return INITIAL_NEWSLETTER_SUBSCRIBERS.filter((s) => !deleted.includes(s.id) && !deleted.includes(s.email));
  });

  const [productsList, setProductsList] = useState<Product[]>(() => {
    const deleted = getDeletedKeys('atelier_deleted_products').concat(getDeletedKeys('maison_deleted_products'));
    return PRODUCTS_DATA.filter((p) => !deleted.includes(p.id));
  });

  const [showroomsList, setShowroomsList] = useState<Showroom[]>(() => {
    const deleted = getDeletedKeys('atelier_deleted_showrooms').concat(getDeletedKeys('maison_deleted_showrooms'));
    try {
      const custom = localStorage.getItem('atelier_custom_showrooms');
      if (custom) {
        const parsed: Showroom[] = JSON.parse(custom);
        const map = new Map<string, Showroom>();
        SHOWROOMS_DATA.forEach((s) => map.set(s.id, s));
        parsed.forEach((s) => map.set(s.id, s));
        return Array.from(map.values()).filter((s) => !deleted.includes(s.id));
      }
    } catch {
      // fallback to SHOWROOMS_DATA
    }
    return SHOWROOMS_DATA.filter((s) => !deleted.includes(s.id));
  });

  // Showroom modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [locationForm, setLocationForm] = useState<{
    id: string;
    city: string;
    country: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    image: string;
    lat: number;
    lng: number;
    isFlagship: boolean;
    notes: string;
  }>({
    id: '',
    city: '',
    country: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    image: '',
    lat: 0,
    lng: 0,
    isFlagship: false,
    notes: ''
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([
    {
      id: 'adm-001',
      name: 'Lady Vivienne Sterling',
      email: 'admin@atelier-living.com',
      role: 'Master Curator',
      status: 'Active',
      lastLogin: 'Today'
    }
  ]);

  const { showToast } = useToast();

  // Delete Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    itemType: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    itemType: 'record',
    onConfirm: () => {}
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All');
  const [newsletterStatusFilter, setNewsletterStatusFilter] = useState('All');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
  const [newSubscriberSource, setNewSubscriberSource] = useState('Master Admin');

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

  // Projects State & Modal
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const deleted = getDeletedKeys('atelier_deleted_projects').concat(getDeletedKeys('maison_deleted_projects'));
    try {
      const custom = localStorage.getItem('atelier_custom_projects');
      if (custom) {
        const parsed: Project[] = JSON.parse(custom);
        const map = new Map<string, Project>();
        PROJECTS_DATA.forEach((p) => map.set(p.id, p));
        parsed.forEach((p) => map.set(p.id, p));
        return Array.from(map.values()).filter((p) => !deleted.includes(p.id));
      }
    } catch {
      // fallback
    }
    return PROJECTS_DATA.filter((p) => !deleted.includes(p.id));
  });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<{
    id: string;
    title: string;
    category: string;
    location: string;
    year: string;
    designer: string;
    description: string;
    heroImage: string;
    gallery: string[];
    productsUsed: { productName: string; categorySlug: CategorySlug }[];
  }>({
    id: '',
    title: '',
    category: 'Private Residence',
    location: '',
    year: '2026',
    designer: 'Studio Harrison & Co.',
    description: '',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    gallery: [],
    productsUsed: []
  });

  const [newProjectProdName, setNewProjectProdName] = useState('');
  const [newProjectProdCategory, setNewProjectProdCategory] = useState<CategorySlug>('fabrics');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [previewProject, setPreviewProject] = useState<Project | null>(null);


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
    if (res.message) {
      showToast(res.success ? 'Supabase Connected' : 'Cloud Sync Offline', res.message, res.success ? 'success' : 'error');
    }
  };

  const fetchLiveSupabaseData = async () => {
    // 1. Fetch Contact Inquiries
    const inqs = await fetchContactInquiriesFromSupabase();
    const deletedInqs = getDeletedKeys('maison_deleted_inquiries');
    if (inqs && inqs.length > 0) {
      setContactInquiries(inqs.filter((i) => !deletedInqs.includes(i.id) && !deletedInqs.includes(i.email)));
    } else {
      setContactInquiries((prev) => prev.filter((i) => !deletedInqs.includes(i.id) && !deletedInqs.includes(i.email)));
    }

    // 2. Fetch Swatch Requests
    fetchSupabaseSwatchRequests();

    // 3. Fetch Products
    const dbProds = await fetchProductsFromSupabase();
    const deletedProds = getDeletedKeys('maison_deleted_products');
    if (dbProds && dbProds.length > 0) {
      setProductsList(dbProds.filter((p) => !deletedProds.includes(p.id)));
    } else {
      setProductsList((prev) => prev.filter((p) => !deletedProds.includes(p.id)));
    }

    // 4. Fetch Audit Logs
    const logs = await fetchAdminAuditLogsFromSupabase();
    const deletedLogs = getDeletedKeys('maison_deleted_audit_logs');
    setAuditLogs(logs.filter((l) => !deletedLogs.includes(l.id)));

    // 5. Fetch Admin Users
    const admins = await fetchAdminUsersFromSupabase();
    if (admins && admins.length > 0) {
      setAdminUsersList(admins);
    }

    // 6. Fetch Newsletter Subscribers
    const subs = await fetchNewsletterSubscribersFromSupabase();
    const deletedSubs = getDeletedKeys('maison_deleted_subscribers');
    if (subs && subs.length > 0) {
      setNewsletterSubscribers(subs.filter((s) => !deletedSubs.includes(s.id) && !deletedSubs.includes(s.email)));
    } else {
      setNewsletterSubscribers((prev) => prev.filter((s) => !deletedSubs.includes(s.id) && !deletedSubs.includes(s.email)));
    }

    // 7. Fetch Showrooms
    const shws = await fetchShowroomsFromSupabase();
    if (shws && shws.length > 0) {
      setShowroomsList(shws);
    }


    // 9. Fetch Projects
    const dbProjects = await fetchProjectsFromSupabase();
    if (dbProjects && dbProjects.length > 0) {
      setProjectsList(dbProjects);
    }

    // 10. Fetch Site Branding, Logos, Navigation & Socials Settings
    const sSettings = await fetchSiteSettingsFromSupabase();
    if (sSettings) {
      setSiteSettings(sSettings);
      setSiteSettingsForm(sSettings);
    }

    // 11. Fetch Testimonials
    const tList = await fetchTestimonialsFromSupabase();
    if (tList && tList.length > 0) {
      setTestimonialsList(tList);
    }

    // 12. Fetch Brands
    const bList = await fetchBrandsFromSupabase();
    if (bList && bList.length > 0) {
      setBrandsList(bList);
    }

    // 13. Fetch Story Settings
    const story = await fetchStorySettingsFromSupabase();
    if (story) {
      setStorySettingsForm(story);
    }

    // 14. Fetch Homepage Hero Slides
    const slides = await fetchHeroSlidesFromSupabase();
    if (slides && slides.length > 0) {
      setHeroSlidesList(slides);
    }
  };

  // Delete Single Security Audit Log Entry with Confirmation
  const handleDeleteAuditLog = (id: string, action: string) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Remove Security Audit Log Entry',
      itemName: `Event: ${action} (${id.substring(0, 8)})`,
      itemType: 'security log',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        recordDeletedKey('maison_deleted_audit_logs', id);
        setAuditLogs((prev) => prev.filter((l) => l.id !== id));

        if (isSupabaseConfigured) {
          await deleteAdminAuditLogInSupabase(id, user.email);
        }
        showToast('Audit Log Entry Removed', `Security event ${action} deleted.`, 'delete');
      }
    });
  };

  // Clear All Security Audit Logs with Confirmation
  const handleClearAllAuditLogs = () => {
    if (auditLogs.length === 0) {
      showToast('No Audit Logs', 'There are no security activity records to clear.', 'info');
      return;
    }

    setDeleteModalState({
      isOpen: true,
      title: 'Clear All Security Audit Logs',
      itemName: `All ${auditLogs.length} Security Activity Records`,
      itemType: 'all audit logs',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        auditLogs.forEach((log) => recordDeletedKey('maison_deleted_audit_logs', log.id));
        setAuditLogs([]);

        if (isSupabaseConfigured) {
          await clearAllAdminAuditLogsInSupabase(user.email);
        }
        showToast('Audit Log History Cleared', 'All security log history has been deleted.', 'delete');
      }
    });
  };

  // Status Change Handler for Newsletter Subscribers
  const handleUpdateNewsletterStatus = async (id: string, newStatus: NewsletterSubscriberItem['status']) => {
    setNewsletterSubscribers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    showToast('Status Updated', `Subscriber tier updated to "${newStatus}"`, 'success');

    if (isSupabaseConfigured) {
      await updateNewsletterSubscriberStatusInSupabase(id, newStatus, user.email);
      const updatedLogs = await fetchAdminAuditLogsFromSupabase();
      setAuditLogs(updatedLogs);
    }
  };

  // Delete Newsletter Subscriber with Custom Alert Dialog
  const handleDeleteSubscriber = (id: string, email: string) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Remove Newsletter Subscriber',
      itemName: email,
      itemType: 'subscriber email',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        recordDeletedKey('maison_deleted_subscribers', id);
        recordDeletedKey('maison_deleted_subscribers', email);
        setNewsletterSubscribers((prev) => prev.filter((s) => s.id !== id && s.email !== email));

        if (isSupabaseConfigured) {
          await deleteNewsletterSubscriberInSupabase(id, user.email, email);
          const updatedLogs = await fetchAdminAuditLogsFromSupabase();
          setAuditLogs(updatedLogs);
        }
        showToast('Subscriber Deleted', `"${email}" removed from newsletter database.`, 'delete');
      }
    });
  };

  // Manual Subscribe Handler
  const handleCreateSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubscriberEmail) return;

    const emailClean = newSubscriberEmail.trim().toLowerCase();
    const newSub: NewsletterSubscriberItem = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      email: emailClean,
      source: newSubscriberSource || 'Master Admin',
      status: 'Subscribed',
      createdAt: 'Just now'
    };

    setNewsletterSubscribers((prev) => [newSub, ...prev]);
    setShowAddSubscriberModal(false);
    showToast('Subscriber Added', `${emailClean} added to newsletter database.`, 'add');

    if (isSupabaseConfigured) {
      await subscribeNewsletterInSupabase(emailClean, newSubscriberSource || 'Master Admin');
      const updatedLogs = await fetchAdminAuditLogsFromSupabase();
      setAuditLogs(updatedLogs);
    }

    setNewSubscriberEmail('');
  };

  // Export Subscribers CSV Handler
  const handleExportSubscribersCSV = () => {
    const headers = ['ID', 'Email', 'Source', 'Status', 'Date Subscribed'];
    const rows = newsletterSubscribers.map((s) => [s.id, s.email, s.source, s.status, s.createdAt]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maison_newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Complete', 'Newsletter subscribers CSV downloaded.', 'info');
  };

  const fetchSupabaseSwatchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('swatch_requests')
        .select('*')
        .order('created_at', { ascending: false });

      const deletedSwatches = getDeletedKeys('maison_deleted_swatches');
      if (!error && data && data.length > 0) {
        const formatted: SwatchRequestItem[] = data
          .map((item) => ({
            id: item.id,
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
          }))
          .filter((s) => !deletedSwatches.includes(s.id) && !deletedSwatches.includes(s.email));
        setSwatchRequests(formatted);
      } else {
        setSwatchRequests((prev) => prev.filter((s) => !deletedSwatches.includes(s.id) && !deletedSwatches.includes(s.email)));
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
    showToast('Status Updated', `Inquiry status changed to "${newStatus}"`, 'success');

    if (isSupabaseConfigured) {
      await updateContactInquiryStatusInSupabase(id, newStatus, user.email);
      const updatedLogs = await fetchAdminAuditLogsFromSupabase();
      setAuditLogs(updatedLogs);
    }
  };

  // Delete Contact Inquiry with Custom Alert Dialog
  const handleDeleteInquiry = (id: string, clientName: string, email?: string) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Contact Inquiry',
      itemName: `${clientName} (${email || 'Inquiry'})`,
      itemType: 'client inquiry',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        recordDeletedKey('maison_deleted_inquiries', id);
        if (email) recordDeletedKey('maison_deleted_inquiries', email);
        setContactInquiries((prev) => prev.filter((i) => i.id !== id));

        if (isSupabaseConfigured) {
          await deleteContactInquiryInSupabase(id, user.email, email);
          const updatedLogs = await fetchAdminAuditLogsFromSupabase();
          setAuditLogs(updatedLogs);
        }
        showToast('Inquiry Deleted', `Consultation request for "${clientName}" deleted.`, 'delete');
      }
    });
  };

  // Delete Swatch Request with Custom Alert Dialog
  const handleDeleteSwatch = (id: string, clientName: string, email?: string) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Swatch Request',
      itemName: `${clientName} (${id.substring(0, 8).toUpperCase()})`,
      itemType: 'swatch request',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        recordDeletedKey('maison_deleted_swatches', id);
        if (email) recordDeletedKey('maison_deleted_swatches', email);
        setSwatchRequests((prev) => prev.filter((s) => s.id !== id));

        if (isSupabaseConfigured) {
          await deleteSwatchRequestInSupabase(id, user.email, email);
          const updatedLogs = await fetchAdminAuditLogsFromSupabase();
          setAuditLogs(updatedLogs);
        }
        showToast('Swatch Order Deleted', `Swatch request for "${clientName}" deleted.`, 'delete');
      }
    });
  };

  // Status Change Handler for Swatch Requests
  const handleUpdateSwatchStatus = async (id: string, newStatus: SwatchRequestItem['status']) => {
    setSwatchRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    showToast('Status Updated', `Swatch request status updated to "${newStatus}"`, 'success');

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('swatch_requests')
          .update({ status: newStatus })
          .eq('id', id);

        await logAdminActivityInSupabase(
          user.email,
          'SWATCH_STATUS_UPDATED',
          `Updated swatch request #${id.substring(0, 8).toUpperCase()} status to ${newStatus}`
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
    showToast('Product Created', `"${newProd.name}" added to catalog archives.`, 'add');

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

  // Delete Product Handler with Custom Alert Dialog
  const handleDeleteProduct = (id: string, name: string) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Remove Product from Catalog',
      itemName: name,
      itemType: 'catalog product',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        recordDeletedKey('maison_deleted_products', id);
        setProductsList((prev) => prev.filter((p) => p.id !== id));

        if (isSupabaseConfigured) {
          await deleteProductInSupabase(id, user.email);
          const updatedLogs = await fetchAdminAuditLogsFromSupabase();
          setAuditLogs(updatedLogs);
        }
        showToast('Product Removed', `"${name}" removed from public catalog.`, 'delete');
      }
    });
  };

  // Open Add Showroom Modal
  const handleOpenAddLocation = () => {
    setEditingLocationId(null);
    setLocationForm({
      id: `shw-${Date.now().toString().slice(-4)}`,
      city: '',
      country: '',
      address: '',
      phone: '',
      email: '',
      hours: 'Mon - Sat: 10:00 - 18:30 | Sun: By Private Appointment',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
      lat: 0,
      lng: 0,
      isFlagship: false,
      notes: ''
    });
    setShowLocationModal(true);
  };

  // Open Edit Showroom Modal
  const handleOpenEditLocation = (shw: Showroom) => {
    setEditingLocationId(shw.id);
    setLocationForm({
      id: shw.id,
      city: shw.city,
      country: shw.country,
      address: shw.address,
      phone: shw.phone,
      email: shw.email,
      hours: shw.hours,
      image: shw.image,
      lat: shw.coordinates?.lat || 0,
      lng: shw.coordinates?.lng || 0,
      isFlagship: Boolean(shw.isFlagship),
      notes: shw.notes || ''
    });
    setShowLocationModal(true);
  };

  // Save / Update Showroom Location Handler
  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationForm.city || !locationForm.address) return;

    const newShowroom: Showroom = {
      id: locationForm.id || `shw-${Date.now().toString().slice(-4)}`,
      city: locationForm.city,
      country: locationForm.country,
      address: locationForm.address,
      phone: locationForm.phone,
      email: locationForm.email,
      hours: locationForm.hours,
      image: locationForm.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
      coordinates: {
        lat: Number(locationForm.lat) || 0,
        lng: Number(locationForm.lng) || 0
      },
      isFlagship: locationForm.isFlagship,
      notes: locationForm.notes
    };

    setShowroomsList((prev) => {
      const idx = prev.findIndex((s) => s.id === newShowroom.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newShowroom;
        return next;
      }
      return [...prev, newShowroom];
    });

    await createOrUpdateShowroomInSupabase(newShowroom, user.email);
    window.dispatchEvent(new Event('storage'));
    setShowLocationModal(false);
    showToast(
      editingLocationId ? 'Location Updated' : 'New Location Added',
      `${newShowroom.city} Showroom (${newShowroom.country}) saved successfully.`,
      'success'
    );

    if (isSupabaseConfigured) {
      const updatedLogs = await fetchAdminAuditLogsFromSupabase();
      setAuditLogs(updatedLogs);
    }
  };

  // Delete Showroom Location Handler
  const handleDeleteLocation = (shw: Showroom) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Showroom Location',
      itemName: `${shw.city} Showroom (${shw.country})`,
      itemType: 'showroom location',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        recordDeletedKey('atelier_deleted_showrooms', shw.id);
        setShowroomsList((prev) => prev.filter((s) => s.id !== shw.id));

        await deleteShowroomInSupabase(shw.id, user.email);
        window.dispatchEvent(new Event('storage'));
        if (isSupabaseConfigured) {
          const updatedLogs = await fetchAdminAuditLogsFromSupabase();
          setAuditLogs(updatedLogs);
        }
        showToast('Showroom Deleted', `Showroom "${shw.city}" removed from public display.`, 'delete');
      }
    });
  };

  // Open Add Project Modal
  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      id: `prj-${Date.now().toString().slice(-4)}`,
      title: '',
      category: 'Private Residence',
      location: '',
      year: '2026',
      designer: 'Studio Harrison & Co.',
      description: '',
      heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
      ],
      productsUsed: [
        { productName: 'Kortrijk Washed Flax Linen', categorySlug: 'fabrics' },
        { productName: 'Symphony Acoustic Linen Sheer', categorySlug: 'curtains-upholstery' }
      ]
    });
    setNewProjectProdName('');
    setNewGalleryUrl('');
    setShowProjectModal(true);
  };

  // Open Edit Project Modal
  const handleOpenEditProject = (prj: Project) => {
    setEditingProjectId(prj.id);
    setProjectForm({
      id: prj.id,
      title: prj.title,
      category: prj.category,
      location: prj.location,
      year: prj.year,
      designer: prj.designer,
      description: prj.description,
      heroImage: prj.heroImage,
      gallery: prj.gallery && prj.gallery.length > 0 ? [...prj.gallery] : [prj.heroImage],
      productsUsed: prj.productsUsed ? [...prj.productsUsed] : []
    });
    setNewProjectProdName('');
    setNewGalleryUrl('');
    setShowProjectModal(true);
  };

  // Save / Update Project Handler
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.location || !projectForm.description) {
      showToast('Missing Details', 'Please enter a project title, location, and description.', 'error');
      return;
    }

    const newProject: Project = {
      id: projectForm.id || `prj-${Date.now().toString().slice(-4)}`,
      title: projectForm.title,
      category: projectForm.category || 'Private Residence',
      location: projectForm.location,
      year: projectForm.year || '2026',
      designer: projectForm.designer || 'Studio Harrison & Co.',
      description: projectForm.description,
      heroImage: projectForm.heroImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      gallery: projectForm.gallery && projectForm.gallery.length > 0 ? projectForm.gallery : [projectForm.heroImage],
      productsUsed: projectForm.productsUsed || []
    };

    setProjectsList((prev) => {
      const idx = prev.findIndex((p) => p.id === newProject.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newProject;
        return next;
      }
      return [newProject, ...prev];
    });

    await createOrUpdateProjectInSupabase(newProject, user.email);
    setShowProjectModal(false);
    showToast(
      editingProjectId ? 'Project Updated' : 'Project Created',
      `"${newProject.title}" (${newProject.location}) synced with portfolio.`,
      'success'
    );

    if (isSupabaseConfigured) {
      const updatedLogs = await fetchAdminAuditLogsFromSupabase();
      setAuditLogs(updatedLogs);
    }
  };

  // Delete Project Handler
  const handleDeleteProject = (prj: Project) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Portfolio Commission',
      itemName: `${prj.title} (${prj.location})`,
      itemType: 'portfolio project',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        recordDeletedKey('atelier_deleted_projects', prj.id);
        setProjectsList((prev) => prev.filter((p) => p.id !== prj.id));

        await deleteProjectInSupabase(prj.id, user.email);
        if (isSupabaseConfigured) {
          const updatedLogs = await fetchAdminAuditLogsFromSupabase();
          setAuditLogs(updatedLogs);
        }
        showToast('Project Removed', `"${prj.title}" removed from public portfolio.`, 'delete');
      }
    });
  };

  const handleAddProductToProject = () => {
    if (!newProjectProdName.trim()) return;
    setProjectForm((prev) => ({
      ...prev,
      productsUsed: [
        ...prev.productsUsed,
        { productName: newProjectProdName.trim(), categorySlug: newProjectProdCategory }
      ]
    }));
    setNewProjectProdName('');
  };

  const handleRemoveProductFromProject = (index: number) => {
    setProjectForm((prev) => ({
      ...prev,
      productsUsed: prev.productsUsed.filter((_, i) => i !== index)
    }));
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setProjectForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryUrl.trim()]
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setProjectForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const filteredProjects = projectsList.filter((prj) => {
    const matchesSearch =
      prj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prj.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prj.designer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prj.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = projectCategoryFilter === 'All' || prj.category.toLowerCase() === projectCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

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

  const filteredSubscribers = newsletterSubscribers.filter((sub) => {
    const matchesSearch =
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = newsletterStatusFilter === 'All' || sub.status === newsletterStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- SITE BRANDING & HEADER NAVIGATION HANDLERS ---
  const handleMoveLinkUp = (index: number) => {
    if (index <= 0) return;
    setSiteSettingsForm((prev) => {
      const newLinks = [...prev.navLinks];
      const temp = newLinks[index - 1];
      newLinks[index - 1] = newLinks[index];
      newLinks[index] = temp;
      newLinks.forEach((l, i) => {
        l.order = i + 1;
      });
      return { ...prev, navLinks: newLinks };
    });
  };

  const handleMoveLinkDown = (index: number) => {
    if (index >= siteSettingsForm.navLinks.length - 1) return;
    setSiteSettingsForm((prev) => {
      const newLinks = [...prev.navLinks];
      const temp = newLinks[index + 1];
      newLinks[index + 1] = newLinks[index];
      newLinks[index] = temp;
      newLinks.forEach((l, i) => {
        l.order = i + 1;
      });
      return { ...prev, navLinks: newLinks };
    });
  };

  const handleToggleLinkVisibility = (id: string) => {
    setSiteSettingsForm((prev) => ({
      ...prev,
      navLinks: prev.navLinks.map((link) =>
        link.id === id ? { ...link, isVisible: !link.isVisible } : link
      )
    }));
  };

  const handleDeleteLink = (id: string, label: string) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Remove Header Menu Link',
      itemName: `Menu item: "${label}"`,
      itemType: 'navigation link',
      onConfirm: () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        setSiteSettingsForm((prev) => {
          const filtered = prev.navLinks.filter((l) => l.id !== id);
          filtered.forEach((l, idx) => {
            l.order = idx + 1;
          });
          return { ...prev, navLinks: filtered };
        });
        showToast('Link Removed', `"${label}" removed from header menu. Click Save to publish.`, 'info');
      }
    });
  };

  const handleOpenAddLink = () => {
    setEditingLinkId(null);
    setLinkForm({
      id: `nav-${Date.now()}`,
      label: '',
      target: 'home',
      hasMegaMenu: false,
      isExternal: false,
      isVisible: true,
      order: siteSettingsForm.navLinks.length + 1
    });
    setShowLinkModal(true);
  };

  const handleOpenEditLink = (link: HeaderNavLink) => {
    setEditingLinkId(link.id);
    setLinkForm({ ...link });
    setShowLinkModal(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.label.trim()) {
      showToast('Validation Error', 'Please enter a navigation link label.', 'error');
      return;
    }

    setSiteSettingsForm((prev) => {
      let updatedLinks = [...prev.navLinks];
      if (editingLinkId) {
        updatedLinks = updatedLinks.map((l) => (l.id === editingLinkId ? linkForm : l));
      } else {
        updatedLinks.push({ ...linkForm, id: linkForm.id || `nav-${Date.now()}` });
      }
      return { ...prev, navLinks: updatedLinks };
    });

    setShowLinkModal(false);
    showToast(
      editingLinkId ? 'Link Updated' : 'Link Added',
      `Header menu link "${linkForm.label}" saved. Click "Save & Sync All Branding" to publish live.`,
      'success'
    );
  };

  const handleSaveSiteSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSiteSettings(true);
    try {
      const ok = await updateSiteSettingsInSupabase(siteSettingsForm, user.email);
      if (ok) {
        setSiteSettings(siteSettingsForm);
        window.dispatchEvent(new Event('storage'));
        showToast('Branding & Navigation Saved', 'Site logos, header links, socials, and contact details synced live.', 'success');
      } else {
        showToast('Sync Notice', 'Settings saved locally. Cloud sync pending.', 'info');
      }
    } catch (err) {
      console.warn('Error saving site settings:', err);
      showToast('Error', 'Failed to save site settings.', 'error');
    } finally {
      setIsSavingSiteSettings(false);
    }
  };

  const handleResetSiteSettings = () => {
    setDeleteModalState({
      isOpen: true,
      title: 'Reset Site Branding & Navigation',
      itemName: 'All Header Links, Logos, Socials & Contact Coordinates',
      itemType: 'site settings reset',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        setSiteSettingsForm(DEFAULT_SITE_SETTINGS);
        setSiteSettings(DEFAULT_SITE_SETTINGS);
        await updateSiteSettingsInSupabase(DEFAULT_SITE_SETTINGS, user.email);
        window.dispatchEvent(new Event('storage'));
        showToast('Reset Completed', 'Site branding and navigation restored to luxury defaults.', 'info');
      }
    });
  };

  // --- TESTIMONIALS HANDLERS ---
  const handleOpenAddTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      id: `tst-${Date.now()}`,
      clientName: '',
      clientRole: '',
      location: '',
      quote: '',
      rating: 5,
      avatar: '',
      projectOrProduct: '',
      isFeatured: true,
      isVisible: true,
      order: testimonialsList.length + 1
    });
    setShowTestimonialModal(true);
  };

  const handleOpenEditTestimonial = (t: Testimonial) => {
    setEditingTestimonialId(t.id);
    setTestimonialForm({ ...t });
    setShowTestimonialModal(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.clientName.trim() || !testimonialForm.quote.trim()) {
      showToast('Validation Error', 'Please enter client name and quote text.', 'error');
      return;
    }

    const itemToSave: Testimonial = {
      ...testimonialForm,
      id: editingTestimonialId || testimonialForm.id || `tst-${Date.now()}`
    };

    setTestimonialsList((prev) => {
      const idx = prev.findIndex((t) => t.id === itemToSave.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = itemToSave;
        return next;
      }
      return [itemToSave, ...prev];
    });

    await saveTestimonialInSupabase(itemToSave, user.email);
    setShowTestimonialModal(false);
    showToast(
      editingTestimonialId ? 'Review Updated' : 'Review Added',
      `Testimonial from ${itemToSave.clientName} has been saved live.`,
      'success'
    );
  };

  const handleDeleteTestimonial = (id: string, name: string) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Client Review',
      itemName: `Testimonial from ${name}`,
      itemType: 'testimonial review',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
        await deleteTestimonialInSupabase(id, user.email);
        showToast('Review Deleted', `Testimonial from ${name} removed.`, 'delete');
      }
    });
  };

  const handleToggleTestimonialVisibility = async (id: string) => {
    const target = testimonialsList.find((t) => t.id === id);
    if (!target) return;
    const updated = { ...target, isVisible: !target.isVisible };
    setTestimonialsList((prev) => prev.map((t) => (t.id === id ? updated : t)));
    await saveTestimonialInSupabase(updated, user.email);
    showToast(
      updated.isVisible ? 'Review Published' : 'Review Hidden',
      `Testimonial is now ${updated.isVisible ? 'visible' : 'hidden'} on the landing page.`,
      'info'
    );
  };

  const handleToggleTestimonialFeatured = async (id: string) => {
    const target = testimonialsList.find((t) => t.id === id);
    if (!target) return;
    const updated = { ...target, isFeatured: !target.isFeatured };
    setTestimonialsList((prev) => prev.map((t) => (t.id === id ? updated : t)));
    await saveTestimonialInSupabase(updated, user.email);
    showToast('Featured Status Updated', `Review set to ${updated.isFeatured ? 'Featured' : 'Standard'}.`, 'success');
  };

  // --- BRAND PARTNERS & MARQUEE HANDLERS ---
  const handleOpenAddBrand = () => {
    setEditingBrandId(null);
    setBrandForm({
      id: `bnd-${Date.now()}`,
      name: '',
      country: '',
      established: '',
      tagline: '',
      description: '',
      logoText: '',
      image: '',
      specialty: '',
      featuredProducts: [],
      websiteUrl: '',
      isVisible: true,
      order: brandsList.length + 1
    });
    setShowBrandModal(true);
  };

  const handleOpenEditBrand = (b: BrandPartner) => {
    setEditingBrandId(b.id);
    setBrandForm({ ...b });
    setShowBrandModal(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name.trim() || !brandForm.logoText.trim()) {
      showToast('Validation Error', 'Please enter brand house name and logo typography text.', 'error');
      return;
    }

    const itemToSave: BrandPartner = {
      ...brandForm,
      id: editingBrandId || brandForm.id || `bnd-${Date.now()}`
    };

    setBrandsList((prev) => {
      const idx = prev.findIndex((b) => b.id === itemToSave.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = itemToSave;
        return next;
      }
      return [...prev, itemToSave];
    });

    await saveBrandInSupabase(itemToSave, user.email);
    setShowBrandModal(false);
    showToast(
      editingBrandId ? 'Brand Updated' : 'Brand Added',
      `Brand partner ${itemToSave.name} saved and synced to marquee ticker.`,
      'success'
    );
  };

  const handleDeleteBrand = (id: string, name: string) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Remove Brand Partner',
      itemName: `Brand: ${name}`,
      itemType: 'brand partner',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        setBrandsList((prev) => prev.filter((b) => b.id !== id));
        await deleteBrandInSupabase(id, user.email);
        showToast('Brand Partner Removed', `${name} removed from global mill partners.`, 'delete');
      }
    });
  };

  const handleToggleBrandVisibility = async (id: string) => {
    const target = brandsList.find((b) => b.id === id);
    if (!target) return;
    const updated = { ...target, isVisible: !target.isVisible };
    setBrandsList((prev) => prev.map((b) => (b.id === id ? updated : b)));
    await saveBrandInSupabase(updated, user.email);
    showToast(
      updated.isVisible ? 'Brand Active' : 'Brand Hidden',
      `${target.name} is now ${updated.isVisible ? 'visible in' : 'hidden from'} marquee and brands page.`,
      'info'
    );
  };

  const handleMoveBrandUp = async (index: number) => {
    if (index <= 0) return;
    const updated = [...brandsList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    updated.forEach((b, i) => {
      b.order = i + 1;
    });
    setBrandsList(updated);
    localStorage.setItem('atelier_brands_data', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleMoveBrandDown = async (index: number) => {
    if (index >= brandsList.length - 1) return;
    const updated = [...brandsList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updated.forEach((b, i) => {
      b.order = i + 1;
    });
    setBrandsList(updated);
    localStorage.setItem('atelier_brands_data', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // --- HOMEPAGE HERO SHOWCASE SLIDER HANDLERS ---
  const handleOpenAddHeroSlide = () => {
    setEditingHeroSlideId(null);
    setSelectedHotspotIdx(0);
    setHeroSlideForm({
      id: `scene-${Date.now()}`,
      title: '',
      location: '',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
      tagline: '',
      order: heroSlidesList.length + 1,
      isVisible: true,
      hotspots: [
        {
          id: `hs-${Date.now()}-1`,
          x: 35,
          y: 45,
          label: 'Bespoke Craft Detail',
          detail: 'Master weaver artisanal detail handcrafted to order.',
          origin: 'London, UK'
        }
      ]
    });
    setShowHeroSlideModal(true);
  };

  const handleOpenEditHeroSlide = (slide: FurnishingScene) => {
    setEditingHeroSlideId(slide.id);
    setSelectedHotspotIdx(slide.hotspots && slide.hotspots.length > 0 ? 0 : null);
    setHeroSlideForm({
      ...slide,
      hotspots: slide.hotspots ? [...slide.hotspots] : []
    });
    setShowHeroSlideModal(true);
  };

  const handleSaveHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSlideForm.title.trim() || !heroSlideForm.image.trim()) {
      showToast('Validation Error', 'Please enter a slide title and background image URL.', 'error');
      return;
    }

    const itemToSave: FurnishingScene = {
      ...heroSlideForm,
      id: editingHeroSlideId || heroSlideForm.id || `scene-${Date.now()}`
    };

    setHeroSlidesList((prev) => {
      const idx = prev.findIndex((s) => s.id === itemToSave.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = itemToSave;
        return next;
      }
      return [...prev, itemToSave];
    });

    await saveHeroSlideInSupabase(itemToSave, user.email);
    setShowHeroSlideModal(false);
    showToast(
      editingHeroSlideId ? 'Hero Scene Updated' : 'Hero Scene Added',
      `Homepage showcase scene "${itemToSave.title}" has been saved live.`,
      'success'
    );
  };

  const handleDeleteHeroSlide = (id: string, title: string) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Hero Slider Scene',
      itemName: `Showcase Scene: "${title}"`,
      itemType: 'hero slider scene',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        setHeroSlidesList((prev) => prev.filter((s) => s.id !== id));
        await deleteHeroSlideInSupabase(id, user.email);
        showToast('Scene Deleted', `Hero scene "${title}" removed from homepage slider.`, 'delete');
      }
    });
  };

  const handleToggleHeroSlideVisibility = async (id: string) => {
    const target = heroSlidesList.find((s) => s.id === id);
    if (!target) return;
    const updated = { ...target, isVisible: !target.isVisible };
    setHeroSlidesList((prev) => prev.map((s) => (s.id === id ? updated : s)));
    await saveHeroSlideInSupabase(updated, user.email);
    showToast(
      updated.isVisible ? 'Scene Active' : 'Scene Hidden',
      `"${target.title}" is now ${updated.isVisible ? 'visible on' : 'hidden from'} the homepage slider.`,
      'info'
    );
  };

  const handleMoveHeroSlideUp = async (index: number) => {
    if (index <= 0) return;
    const updated = [...heroSlidesList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    updated.forEach((s, i) => {
      s.order = i + 1;
    });
    setHeroSlidesList(updated);
    localStorage.setItem('atelier_hero_slides', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleMoveHeroSlideDown = async (index: number) => {
    if (index >= heroSlidesList.length - 1) return;
    const updated = [...heroSlidesList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updated.forEach((s, i) => {
      s.order = i + 1;
    });
    setHeroSlidesList(updated);
    localStorage.setItem('atelier_hero_slides', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddHotspotToSlide = () => {
    const newHotspot: HeroHotspot = {
      id: `hs-${Date.now()}`,
      x: 50,
      y: 50,
      label: 'New Material Specification',
      detail: 'Architectural textile precision engineered with master craftsmen.',
      origin: 'Milan, Italy'
    };
    setHeroSlideForm((prev) => ({
      ...prev,
      hotspots: [...prev.hotspots, newHotspot]
    }));
    setSelectedHotspotIdx(heroSlideForm.hotspots.length);
  };

  const handleRemoveHotspotFromSlide = (index: number) => {
    setHeroSlideForm((prev) => ({
      ...prev,
      hotspots: prev.hotspots.filter((_, i) => i !== index)
    }));
    if (selectedHotspotIdx === index) {
      setSelectedHotspotIdx(null);
    } else if (selectedHotspotIdx !== null && selectedHotspotIdx > index) {
      setSelectedHotspotIdx(selectedHotspotIdx - 1);
    }
  };

  const handleUpdateHotspotInSlide = (index: number, field: keyof HeroHotspot, val: any) => {
    setHeroSlideForm((prev) => {
      const nextHotspots = [...prev.hotspots];
      nextHotspots[index] = { ...nextHotspots[index], [field]: val };
      return { ...prev, hotspots: nextHotspots };
    });
  };

  // --- OUR STORY CMS HANDLERS ---
  const handleSaveStorySettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingStorySettings(true);
    try {
      const ok = await updateStorySettingsInSupabase(storySettingsForm, user.email);
      if (ok) {
        showToast('Our Story Saved', 'Heritage narrative, pillars, milestones, and gallery synced live.', 'success');
      }
    } catch (err) {
      console.warn('Error saving story settings:', err);
      showToast('Error', 'Failed to save story settings.', 'error');
    } finally {
      setIsSavingStorySettings(false);
    }
  };

  const handleResetStorySettings = () => {
    setDeleteModalState({
      isOpen: true,
      title: 'Reset Our Story & Heritage Page',
      itemName: 'All story copy, pillars, milestones, and gallery content',
      itemType: 'story settings reset',
      onConfirm: async () => {
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        setStorySettingsForm(DEFAULT_STORY_SETTINGS);
        await updateStorySettingsInSupabase(DEFAULT_STORY_SETTINGS, user.email);
        showToast('Story Reset', 'Our Story page restored to luxury default content.', 'info');
      }
    });
  };

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
  }

  interface NavGroup {
    category: string;
    items: NavItem[];
  }

  const navigationItems: NavGroup[] = [
    {
      category: 'MAIN NAVIGATION',
      items: [
        { id: 'overview', label: 'Overview & Sync', icon: LayoutDashboard },
        {
          id: 'inquiries',
          label: 'Client Inquiries',
          icon: Mail,
          badge: contactInquiries.filter((i) => i.status === 'New').length,
          badgeColor: 'bg-amber-500 text-black'
        },
        {
          id: 'newsletter',
          label: 'Newsletter Gazette',
          icon: Send,
          badge: newsletterSubscribers.length,
          badgeColor: 'bg-emerald-500 text-black'
        }
      ]
    },
    {
      category: 'SITE IDENTITY & BRANDING',
      items: [
        {
          id: 'site-branding',
          label: 'Site Branding & Nav',
          icon: SlidersHorizontal
        }
      ]
    },
    {
      category: 'ATELIER CATALOG & ORDERS',
      items: [
        {
          id: 'products',
          label: 'Product Catalog',
          icon: Package,
          badge: productsList.length,
          badgeColor: 'bg-[#C9A56A] text-[#0F1714]'
        },
        {
          id: 'swatches',
          label: 'Swatch Orders',
          icon: Layers,
          badge: swatchRequests.filter((s) => s.status === 'Pending').length,
          badgeColor: 'bg-[#C9A56A] text-[#0F1714]'
        },
        {
          id: 'projects',
          label: 'Residence Portfolio',
          icon: Building2,
          badge: projectsList.length,
          badgeColor: 'bg-[#C9A56A] text-[#0F1714]'
        }
      ]
    },
    {
      category: 'SECURITY & STAFF',
      items: [
        {
          id: 'audit-logs',
          label: 'Security Audit Logs',
          icon: ShieldCheck,
          badge: auditLogs.length,
          badgeColor: 'bg-white/10 text-white'
        },
        { id: 'settings', label: 'Curator Staff', icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F1714] text-[#E9DFD1] flex flex-col lg:flex-row font-sans selection:bg-[#C9A56A]/30">
      {/* --- DESKTOP FIXED SIDEBAR MENU --- */}
      <aside className="hidden lg:flex lg:w-72 bg-[#163129] border-r border-[#C9A56A]/30 flex-col justify-between sticky top-0 h-screen z-40 shrink-0 select-none">
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center space-x-3.5 pb-4 border-b border-white/10">
            <div className="w-11 h-11 rounded-2xl border-2 border-[#C9A56A] bg-[#C9A56A]/20 flex items-center justify-center shadow-lg shrink-0">
              <span className="font-serif font-bold text-2xl text-[#C9A56A]">A</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-base font-bold tracking-widest text-white uppercase">
                  ATELIER LIVING
                </span>
              </div>
              <span className="text-[10px] text-[#C9A56A] font-semibold uppercase tracking-wider block">
                Master Curator Control
              </span>
            </div>
          </div>

          {/* Compact Supabase Cloud Pill */}
          <div className="p-3 rounded-xl bg-white/5 border border-[#C9A56A]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#C9A56A]" />
              <span className="font-mono text-[11px] text-[#8C9A90]">ywsmtfhzlhljeqetmvol</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {dbMetrics.latencyMs ? `${dbMetrics.latencyMs}ms` : 'Live'}
            </span>
          </div>

          {/* Navigation Menu Groups */}
          <nav className="space-y-6">
            {navigationItems.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A6B] block px-3">
                  {group.category}
                </span>
                <div className="space-y-1">
                  {group.items.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/40 font-bold shadow-md'
                            : 'text-[#8C9A90] hover:text-[#C9A56A] hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A56A]' : 'text-[#C9A56A]/70'}`} />
                          <span>{tab.label}</span>
                        </div>
                        {tab.badge !== undefined && tab.badge > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-[#0F1714] text-[#C9A56A] border border-[#C9A56A]/30'
                                : tab.badgeColor || 'bg-white/10 text-white'
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
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-4 border-t border-[#C9A56A]/25 bg-[#0F1714]/90 backdrop-blur-xl space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#C9A56A]/20 border border-[#C9A56A]/50 text-[#C9A56A] font-bold text-xs flex items-center justify-center shadow-md">
                  {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F1714]" />
              </div>
              <div className="text-left leading-tight min-w-0">
                <span className="block text-xs font-serif font-bold text-white tracking-wide truncate max-w-[130px]" title={user.name}>
                  {user.name}
                </span>
                <span className="text-[10px] text-[#C9A56A] font-semibold uppercase tracking-widest block mt-0.5">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              onClick={onReturnToSite}
              className="px-2.5 py-2 rounded-xl border border-[#C9A56A]/30 bg-[#163129] text-white hover:bg-[#C9A56A] hover:text-[#0F1714] text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md group"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
              <span>Live Site</span>
            </button>
            <button
              onClick={onLogout}
              className="px-2.5 py-2 rounded-xl border border-red-500/30 bg-[#163129] text-red-300 hover:bg-red-950/60 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MOBILE TOP NAVIGATION BAR --- */}
      <header className="lg:hidden bg-[#141312] border-b border-[#C5A059]/30 py-3.5 px-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#F5D07F]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg border border-[#C9A56A] bg-[#C9A56A]/20 flex items-center justify-center">
              <span className="font-serif font-bold text-lg text-[#C9A56A]">A</span>
            </div>
            <span className="font-serif text-sm font-bold tracking-widest text-white uppercase">
              ATELIER LIVING
            </span>
          </div>
        </div>

        <button
          onClick={onReturnToSite}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4 text-[#C9A56A]" />
        </button>
      </header>

      {/* --- MOBILE SIDEBAR DRAWER OVERLAY --- */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden flex">
          <div className="w-80 bg-[#163129] border-r border-[#C9A56A]/30 h-full flex flex-col justify-between p-6 space-y-6 animate-in slide-in-from-left duration-300">
            <div className="space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl border border-[#C9A56A] bg-[#C9A56A]/20 flex items-center justify-center">
                    <span className="font-serif font-bold text-xl text-[#C9A56A]">A</span>
                  </div>
                  <span className="font-serif text-base font-bold text-white">ATELIER LIVING</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-full bg-white/5 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-6">
                {navigationItems.map((group, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A6B] block">
                      {group.category}
                    </span>
                    <div className="space-y-1">
                      {group.items.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id as any);
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                              isActive
                                ? 'bg-[#C5A059] text-[#121110] font-bold'
                                : 'text-[#D8C8B8] hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-4 h-4" />
                              <span>{tab.label}</span>
                            </div>
                            {tab.badge !== undefined && tab.badge > 0 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#121110] text-[#F5D07F]">
                                {tab.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#C9A56A]/25 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C9A56A]/20 border border-[#C9A56A]/50 text-[#C9A56A] font-bold text-xs flex items-center justify-center">
                  {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <span className="text-xs font-serif font-bold text-white block">{user.name}</span>
                  <span className="text-[10px] text-[#C9A56A] font-medium block">{user.role}</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-[#163129] text-red-300 hover:bg-red-950/60 text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- RIGHT MAIN CONTENT AREA (FULL-WIDTH WORKSPACE) --- */}
      <main className="grow w-full p-4 sm:p-8 space-y-8 min-w-0">
        {/* Top Header Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
              <span>Master Admin Panel</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white capitalize">{activeTab.replace('-', ' ')}</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white capitalize mt-1">
              {activeTab.replace('-', ' ')} Control Center
            </h1>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => {
                runDatabaseCheck();
                fetchLiveSupabaseData();
              }}
              disabled={dbMetrics.isTesting}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-semibold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C5A059] ${dbMetrics.isTesting ? 'animate-spin' : ''}`} />
              <span>Sync Supabase Cloud</span>
            </button>
          </div>
        </div>

        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Live Supabase Connection & Latency Banner */}
            <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A56A]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-2 relative z-10">
                <div className="flex items-center space-x-2.5">
                  <Database className="w-5 h-5 text-[#C9A56A]" />
                  <h3 className="font-serif text-xl font-bold text-white">Supabase Cloud Database Status</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C9A56A]/20 text-[#C9A56A] text-[10px] font-mono font-bold uppercase border border-[#C9A56A]/40">
                    ywsmtfhzlhljeqetmvol
                  </span>
                </div>
                <p className="text-xs text-[#E9DFD1]">
                  Real-time database synchronization active for Contact Inquiries, Swatch Requests, Catalog Products, and Security Audit Logs.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8C9A90] pt-1">
                  <span>SSL Connection: 256-bit TLS</span>
                  <span>•</span>
                  <span>Tables Synced: contact_inquiries, swatch_requests, products, admin_users, admin_audit_logs</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 shrink-0 relative z-10">
                <div className="text-right">
                  <span className="block text-[11px] uppercase tracking-wider text-[#C9A56A] font-semibold">
                    Ping Latency
                  </span>
                  <span className="font-mono text-2xl font-bold text-emerald-400">
                    {dbMetrics.latencyMs ? `${dbMetrics.latencyMs} ms` : 'Live'}
                  </span>
                </div>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#C9A56A] uppercase tracking-wider font-semibold">
                  <span>Client Inquiries</span>
                  <Mail className="w-4 h-4 text-[#C9A56A]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-white">{contactInquiries.length}</span>
                  <span className="text-xs text-amber-400 font-semibold">
                    {contactInquiries.filter((i) => i.status === 'New').length} New Action Required
                  </span>
                </div>
                <span className="text-[11px] text-[#8C9A90] block">Synced with contact_inquiries</span>
              </div>

              <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#C9A56A] uppercase tracking-wider font-semibold">
                  <span>Swatch Requests</span>
                  <Layers className="w-4 h-4 text-[#C9A56A]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-white">{swatchRequests.length}</span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14% this week
                  </span>
                </div>
                <span className="text-[11px] text-[#8C9A90] block">
                  {swatchRequests.filter((s) => s.status === 'Pending').length} Pending dispatch
                </span>
              </div>

              <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#C9A56A] uppercase tracking-wider font-semibold">
                  <span>Active Catalog Items</span>
                  <Package className="w-4 h-4 text-[#C9A56A]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-white">{productsList.length}</span>
                  <span className="text-xs text-emerald-400 font-semibold">8 Categories</span>
                </div>
                <span className="text-[11px] text-[#8C9A90] block">Synced with products table</span>
              </div>

              <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-[#C9A56A] uppercase tracking-wider font-semibold">
                  <span>Gazette Subscribers</span>
                  <Send className="w-4 h-4 text-[#C9A56A]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-[#C9A56A]">{newsletterSubscribers.length}</span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    {newsletterSubscribers.filter((s) => s.status === 'VIP Privé').length} VIP Privé
                  </span>
                </div>
                <span className="text-[11px] text-[#8C9A90] block">Synced with newsletter_subscribers</span>
              </div>
            </div>

            {/* Recent Contact Inquiries Preview */}
            <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 shadow-xl space-y-4">
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
                          {inq.id.substring(0, 8).toUpperCase()}
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

        {/* ================= NEWSLETTER TAB ================= */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Atelier Gazette & Newsletter Subscribers</h2>
                <p className="text-xs text-[#D8C8B8]">
                  Manage private lookbook subscribers, trade exhibition invitees, and VIP Privé clients.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportSubscribersCSV}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setShowAddSubscriberModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#C5A059] text-[#121110] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subscriber</span>
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
                  placeholder="Search subscribers by email address or acquisition source..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C5A059] focus:outline-none text-xs text-white placeholder-white/40"
                />
                <Search className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-3" />
              </div>

              <div className="md:col-span-4">
                <select
                  value={newsletterStatusFilter}
                  onChange={(e) => setNewsletterStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#163129]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#163129] text-white">All Statuses ({newsletterSubscribers.length})</option>
                  <option value="Subscribed" className="bg-[#163129] text-white">Subscribed</option>
                  <option value="VIP Privé" className="bg-[#163129] text-white">VIP Privé</option>
                  <option value="Unsubscribed" className="bg-[#163129] text-white">Unsubscribed</option>
                </select>
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F1714]/80 text-[#C9A56A] uppercase tracking-wider text-[10px] font-bold border-b border-white/10">
                    <tr>
                      <th className="p-4">Subscriber Email</th>
                      <th className="p-4">Acquisition Source</th>
                      <th className="p-4">Status Tier</th>
                      <th className="p-4">Date Joined</th>
                      <th className="p-4 text-right">Status Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#E9DFD1]">
                    {filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#8C9A90]">
                          No matching subscribers found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-semibold text-white flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-[#C9A56A]/20 border border-[#C9A56A]/40 flex items-center justify-center text-[#C9A56A] font-bold">
                              {sub.email[0].toUpperCase()}
                            </div>
                            <div>
                              <span className="block font-medium text-white">{sub.email}</span>
                              <span className="text-[10px] font-mono text-[#8C9A90]">ID: {sub.id.substring(0, 8)}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-[#C9A56A]">{sub.source}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-[10px] border uppercase ${
                                sub.status === 'VIP Privé'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : sub.status === 'Subscribed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-white/10 text-gray-400 border-white/20'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-[#8C9A90]">{sub.createdAt}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleUpdateNewsletterStatus(sub.id, 'Subscribed')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                sub.status === 'Subscribed' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'
                              }`}
                            >
                              Subscribed
                            </button>
                            <button
                              onClick={() => handleUpdateNewsletterStatus(sub.id, 'VIP Privé')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                sub.status === 'VIP Privé' ? 'bg-[#C9A56A] text-[#0F1714]' : 'bg-white/5 text-white hover:bg-white/10'
                              }`}
                            >
                              VIP Privé
                            </button>
                            <button
                              onClick={() => handleUpdateNewsletterStatus(sub.id, 'Unsubscribed')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                sub.status === 'Unsubscribed' ? 'bg-gray-700 text-white' : 'bg-white/5 text-white hover:bg-white/10'
                              }`}
                            >
                              Unsubscribe
                            </button>
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 transition-all border border-red-500/30 cursor-pointer ml-1"
                              title="Delete Subscriber"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
                <p className="text-xs text-[#E9DFD1]">
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
                  <RefreshCw className="w-3.5 h-3.5 text-[#C9A56A]" />
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] focus:outline-none text-xs text-white placeholder-white/40"
                />
                <Search className="w-4 h-4 text-[#C9A56A] absolute left-3.5 top-3" />
              </div>

              <div className="md:col-span-4">
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#163129]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#163129] text-white">All Statuses ({contactInquiries.length})</option>
                  <option value="New" className="bg-[#163129] text-white">New Action Required</option>
                  <option value="Contacted" className="bg-[#163129] text-white">Contacted</option>
                  <option value="Scheduled" className="bg-[#163129] text-white">Scheduled</option>
                  <option value="Archived" className="bg-[#163129] text-white">Archived</option>
                </select>
              </div>
            </div>

            {/* Inquiries Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl text-[#8C9A90]">
                  No matching contact form inquiries found.
                </div>
              ) : (
                filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 shadow-xl space-y-4 hover:border-[#C9A56A]/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-bold text-[#F5D07F] bg-[#C5A059]/20 px-2.5 py-1 rounded-md border border-[#C5A059]/40">
                          {inq.id.substring(0, 8).toUpperCase()}
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
                          onClick={() => handleDeleteInquiry(inq.id, inq.clientName, inq.email)}
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
                  className="w-full px-3 py-2.5 rounded-xl bg-[#163129]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#163129] text-white">
                    All Categories ({productsList.length})
                  </option>
                  {Object.values(CATEGORIES_DATA).map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#163129] text-white">
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F1714]/80 text-[#C9A56A] uppercase tracking-wider text-[10px] font-bold border-b border-white/10">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Composition</th>
                      <th className="p-4">Origin</th>
                      <th className="p-4">Tier</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#E9DFD1]">
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
                            <span className="text-[10px] text-[#8C9A90]">{prod.id}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-[#C9A56A]">{prod.categoryName}</td>
                        <td className="p-4 max-w-xs truncate">{prod.materialComposition}</td>
                        <td className="p-4">{prod.origin}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#C9A56A]/20 text-[#C9A56A] font-bold text-[10px] border border-[#C9A56A]/30">
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
              <p className="text-xs text-[#E9DFD1]">
                Inspect high-net-worth client swatch requests synced live with Supabase `swatch_requests` table.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {swatchRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold text-[#F5D07F] bg-[#C5A059]/20 px-2.5 py-1 rounded-md border border-[#C5A059]/40">
                        {req.id.substring(0, 8).toUpperCase()}
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
                      <button
                        onClick={() => handleDeleteSwatch(req.id, req.clientName, req.email)}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 transition-all border border-red-500/30 cursor-pointer ml-1"
                        title="Delete Swatch Request"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={async () => {
                    const logs = await fetchAdminAuditLogsFromSupabase();
                    const deletedLogs = getDeletedKeys('maison_deleted_audit_logs');
                    setAuditLogs(logs.filter((l) => !deletedLogs.includes(l.id)));
                    showToast('Logs Refreshed', 'Latest security audit entries loaded.', 'info');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-semibold flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Refresh Logs</span>
                </button>

                <button
                  onClick={handleClearAllAuditLogs}
                  className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Logs</span>
                </button>
              </div>
            </div>

            <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/10 bg-[#0F1714]/80 flex items-center justify-between text-xs text-[#C9A56A] font-bold uppercase tracking-wider">
                <span>Recent Admin Activity Records</span>
                <span>{auditLogs.length} Events Logged</span>
              </div>
              <div className="divide-y divide-white/5 text-xs">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-[#8C9A90]">No security logs recorded.</div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-[#C9A56A]/20 text-[#C9A56A] font-mono text-[10px] font-bold border border-[#C9A56A]/30">
                            {log.action}
                          </span>
                          <span className="font-semibold text-white">{log.adminEmail}</span>
                        </div>
                        <p className="text-xs text-[#E9DFD1]">{log.details}</p>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 self-end sm:self-auto">
                        <span className="text-[11px] font-mono text-[#8C9A90]">{log.createdAt}</span>
                        <button
                          onClick={() => handleDeleteAuditLog(log.id, log.action)}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 transition-all border border-red-500/30 cursor-pointer"
                          title="Remove Audit Log Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= PROJECTS TAB ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header & Quick Summary */}
            <div className="pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
                  <Building2 className="w-6 h-6 text-[#C9A56A]" />
                  <span>Residence & Superyacht Portfolio Control Center</span>
                </h2>
                <p className="text-xs text-[#E9DFD1] mt-1">
                  Curate, edit, and sync bespoke luxury residential, penthouse, coastal villa, and yacht architecture commissions with Supabase Cloud DB.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={async () => {
                    const dbProjects = await fetchProjectsFromSupabase();
                    if (dbProjects && dbProjects.length > 0) setProjectsList(dbProjects);
                    showToast('Portfolio Synced', 'Latest projects loaded from cloud repository.', 'info');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-semibold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C9A56A]" />
                  <span>Sync Cloud</span>
                </button>

                <button
                  onClick={handleOpenAddProject}
                  className="px-4 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:bg-[#E6C894] transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project Commission</span>
                </button>
              </div>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] text-[#C9A56A] uppercase tracking-wider font-semibold block">
                  Total Commissions
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl font-bold text-white">{projectsList.length} Projects</span>
                  <span className="text-[10px] text-emerald-400 font-semibold font-mono">Live</span>
                </div>
                <span className="text-[10px] text-[#8C9A90] block">Publicly Visible Showcase</span>
              </div>

              <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] text-[#C9A56A] uppercase tracking-wider font-semibold block">
                  Categories Active
                </span>
                <span className="font-serif text-2xl font-bold text-[#C9A56A]">
                  {new Set(projectsList.map((p) => p.category)).size} Tiers
                </span>
                <span className="text-[10px] text-[#8C9A90] block">Residences, Yachts & Estates</span>
              </div>

              <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] text-[#C9A56A] uppercase tracking-wider font-semibold block">
                  Specified Products
                </span>
                <span className="font-serif text-2xl font-bold text-emerald-400">
                  {projectsList.reduce((acc, p) => acc + (p.productsUsed?.length || 0), 0)} Items
                </span>
                <span className="text-[10px] text-[#8C9A90] block">Cross-linked to Catalog</span>
              </div>

              <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] text-[#C9A56A] uppercase tracking-wider font-semibold block">
                  Global Locations
                </span>
                <span className="font-serif text-2xl font-bold text-white">
                  {new Set(projectsList.map((p) => p.location.split(',')[1]?.trim() || p.location)).size} Regions
                </span>
                <span className="text-[10px] text-[#8C9A90] block">International Commissions</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search projects by title, designer studio, location, or description..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] focus:outline-none text-xs text-white placeholder-white/40"
                />
                <Search className="w-4 h-4 text-[#C9A56A] absolute left-3.5 top-3" />
              </div>

              <div className="md:col-span-4">
                <select
                  value={projectCategoryFilter}
                  onChange={(e) => setProjectCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#163129]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#163129] text-white">
                    All Categories ({projectsList.length})
                  </option>
                  {Array.from(new Set(projectsList.map((p) => p.category))).map((cat) => (
                    <option key={cat} value={cat} className="bg-[#163129] text-white">
                      {cat}
                    </option>
                  ))}
                  <option value="Private Residence" className="bg-[#163129] text-white">Private Residence</option>
                  <option value="Coastal Estate" className="bg-[#163129] text-white">Coastal Estate</option>
                  <option value="Penthouse Sanctuary" className="bg-[#163129] text-white">Penthouse Sanctuary</option>
                  <option value="Bespoke Yacht" className="bg-[#163129] text-white">Bespoke Yacht</option>
                  <option value="Historic Restoration" className="bg-[#163129] text-white">Historic Restoration</option>
                  <option value="Hospitality & Hotel" className="bg-[#163129] text-white">Hospitality & Hotel</option>
                </select>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl text-[#8C9A90]">
                  No portfolio projects found matching your search.
                </div>
              ) : (
                filteredProjects.map((prj) => (
                  <div
                    key={prj.id}
                    className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-[#C9A56A]/50 transition-all group"
                  >
                    <div>
                      {/* Hero Image & Overlays */}
                      <div className="relative h-48 overflow-hidden bg-black/40">
                        <img
                          src={prj.heroImage}
                          alt={prj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-3.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#0F1714]/85 backdrop-blur-md text-[10px] font-mono font-bold text-[#C9A56A] border border-[#C9A56A]/30 uppercase">
                              {prj.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#C9A56A] text-[#0F1714] text-[10px] font-bold uppercase tracking-widest shadow-md">
                              {prj.category}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#C9A56A]">
                              <MapPin className="w-3 h-3 text-[#C9A56A]" />
                              <span>{prj.location} • {prj.year}</span>
                            </div>
                            <h4 className="font-serif text-xl font-bold text-white line-clamp-1">{prj.title}</h4>
                          </div>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-4 space-y-3 text-xs text-[#E9DFD1]">
                        <p className="text-xs text-[#8C9A90] line-clamp-2 leading-relaxed font-light">
                          {prj.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-[#C9A56A] pt-1 border-t border-white/5">
                          <span>Lead Designer:</span>
                          <strong className="text-white font-medium">{prj.designer}</strong>
                        </div>

                        {/* Specified Products Tags */}
                        {prj.productsUsed && prj.productsUsed.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] uppercase font-bold text-[#8C9A90] block">
                              Specified Archives ({prj.productsUsed.length}):
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {prj.productsUsed.map((prod, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-[#E9DFD1] font-light flex items-center gap-1"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A56A]"></span>
                                  <span>{prod.productName}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Gallery Count */}
                        {prj.gallery && prj.gallery.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#8C9A90]">
                            <Sparkles className="w-3 h-3 text-[#C9A56A]" />
                            <span>{prj.gallery.length} High-Res Portfolio Images Attached</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-3.5 pt-0 border-t border-white/10 bg-[#0F1714]/30 flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => handleOpenEditProject(prj)}
                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C9A56A] hover:text-white border border-[#C9A56A]/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Project</span>
                      </button>

                      <button
                        onClick={() => setPreviewProject(prj)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-all cursor-pointer"
                        title="Quick Preview"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C9A56A]" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(prj)}
                        className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 transition-all cursor-pointer"
                        title="Delete Portfolio Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
            <div className="pb-4 border-b border-white/10">
              <h2 className="font-serif text-2xl font-bold text-white">Admin Security & Curator Staff</h2>
              <p className="text-xs text-[#E9DFD1]">
                Manage active master admin profile credentials, session timeouts, and Supabase database access.
              </p>
            </div>

            <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-[#C9A56A] text-[#0F1714] font-bold text-2xl flex items-center justify-center shadow-lg">
                  {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{user.name}</h3>
                  <span className="text-xs text-[#C9A56A] font-bold uppercase tracking-wider">{user.role}</span>
                  <span className="text-xs text-[#8C9A90] block">{user.email}</span>
                </div>
              </div>

              {/* Team Members List from Supabase */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#C9A56A] uppercase tracking-widest text-xs flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#C9A56A]" />
                  <span>Authorized Master Admin Team</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {adminUsersList.map((admin) => (
                    <div key={admin.id} className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{admin.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {admin.status || 'Active'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#C9A56A] block">{admin.role}</span>
                      <span className="text-[11px] text-[#8C9A90] font-mono block">{admin.email}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-xs pt-4 border-t border-white/10">
                <h4 className="font-semibold text-[#C9A56A] uppercase tracking-widest">Supabase Cloud Database Instance</h4>
                <div className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 font-mono space-y-2">
                  <p>
                    <span className="text-[#8C9A90]">Project URL:</span>{' '}
                    <strong className="text-white">https://ywsmtfhzlhljeqetmvol.supabase.co</strong>
                  </p>
                  <p>
                    <span className="text-[#8C9A90]">Admin Auth Email:</span>{' '}
                    <strong className="text-white">{user.email}</strong>
                  </p>
                  <p>
                    <span className="text-[#8C9A90]">Database RLS Policy:</span>{' '}
                    <strong className="text-emerald-400">Strict Multi-Tenant Row Level Security Active</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SITE BRANDING, LOGOS, NAVIGATION & SOCIALS CONTROL CENTER ================= */}
        {activeTab === 'site-branding' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Module Header */}
            <div className="pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
                  <SlidersHorizontal className="w-6 h-6 text-[#C9A56A]" />
                  <span>Site Identity, Header Navigation & Socials Control Center</span>
                </h2>
                <p className="text-xs text-[#E9DFD1] mt-1">
                  Upload and customize Header & Footer logos (with text fallback), edit header menu links & order, and manage dynamic social media icons and contact coordinates.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleResetSiteSettings}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#8C9A90] hover:text-white font-semibold flex items-center gap-2 cursor-pointer transition-all"
                  title="Reset all branding & navigation to Atelier default values"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveSiteSettings()}
                  disabled={isSavingSiteSettings}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer ${
                    JSON.stringify(siteSettings) !== JSON.stringify(siteSettingsForm)
                      ? 'bg-amber-400 text-black animate-pulse shadow-amber-400/30'
                      : 'bg-gradient-to-r from-[#C9A56A] via-[#E6C894] to-[#C9A56A] text-[#0F1714] hover:brightness-110 shadow-[#C9A56A]/20'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isSavingSiteSettings
                      ? 'Saving...'
                      : JSON.stringify(siteSettings) !== JSON.stringify(siteSettingsForm)
                      ? 'Save Unsaved Changes'
                      : 'Save & Publish Live'}
                  </span>
                </button>
              </div>
            </div>

            {/* --- 2-COLUMN WORKSPACE: INNER SIDEBAR + FULL-WIDTH EXPANDED CONTENT --- */}
            <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
              {/* --- LEFT: INNER SIDEBAR MENU --- */}
              <aside className="w-full lg:w-72 shrink-0 space-y-4">
                <div className="bg-[#163129]/80 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 shadow-xl space-y-2">
                  <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-[#C9A56A] flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A56A]" />
                      <span>Site & CMS Modules</span>
                    </span>
                    <span className="text-[10px] text-[#8C9A90] font-mono">9 Active</span>
                  </div>

                  <nav className="space-y-1.5 pt-1">
                    {[
                      {
                        id: 'nav-links',
                        label: 'Header Menu Links',
                        icon: Menu,
                        desc: 'Items, order & routes',
                        count: siteSettingsForm.navLinks.length
                      },
                      {
                        id: 'header-styling',
                        label: 'Header Styling & Layout',
                        icon: SlidersHorizontal,
                        desc: 'Typography, gap & themes'
                      },
                      {
                        id: 'logos',
                        label: 'Logos & Brand Identity',
                        icon: ImageIcon,
                        desc: 'Header/Footer logo & mark'
                      },
                      {
                        id: 'hero-slides',
                        label: 'Homepage Hero Slider',
                        icon: Sliders,
                        desc: 'Scenes, images & hotspots',
                        count: heroSlidesList.length
                      },
                      {
                        id: 'testimonials',
                        label: 'Client Testimonials',
                        icon: Star,
                        desc: 'Quotes, stars & reviews',
                        count: testimonialsList.length
                      },
                      {
                        id: 'brands',
                        label: 'Brand Partners & Marquee',
                        icon: Sparkles,
                        desc: 'Mill houses & live ticker',
                        count: brandsList.length
                      },
                      {
                        id: 'story-cms',
                        label: 'Our Story & Heritage CMS',
                        icon: Compass,
                        desc: 'Hero, ethos & milestones'
                      },
                      {
                        id: 'socials',
                        label: 'Social Media Channels',
                        icon: Share2,
                        desc: 'Instagram, LinkedIn, X...'
                      },
                      {
                        id: 'contact',
                        label: 'Contact Details & Hours',
                        icon: Phone,
                        desc: 'Showrooms, inboxes & hours',
                        count: showroomsList.length
                      }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = siteSettingsSubtab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSiteSettingsSubtab(item.id as any)}
                          className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                            isActive
                              ? 'bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold border-[#E9DFD1]/60 shadow-lg shadow-[#C9A56A]/20'
                              : 'bg-black/30 hover:bg-white/5 border-white/5 text-[#8C9A90] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div
                              className={`p-2 rounded-lg shrink-0 ${
                                isActive
                                  ? 'bg-[#0F1714] text-[#C9A56A]'
                                  : 'bg-white/5 text-[#C9A56A] group-hover:bg-[#C9A56A]/20'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs truncate leading-tight font-semibold">
                                {item.label}
                              </span>
                              <span
                                className={`block text-[10px] truncate mt-0.5 ${
                                  isActive ? 'text-[#0F1714]/80 font-medium' : 'text-[#8C9A90]'
                                }`}
                              >
                                {item.desc}
                              </span>
                            </div>
                          </div>

                          {item.count !== undefined && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                                isActive ? 'bg-[#0F1714] text-[#C9A56A]' : 'bg-white/10 text-white/80'
                              }`}
                            >
                              {item.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Quick Action Box */}
                <div className="bg-[#163129]/60 border border-[#C9A56A]/20 rounded-2xl p-4 shadow-lg space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8C9A90] uppercase tracking-wider font-semibold text-[10px]">
                      Sync Engine
                    </span>
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Ready
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSiteSettings()}
                    disabled={isSavingSiteSettings}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingSiteSettings ? 'Publishing...' : 'Save & Publish Live'}</span>
                  </button>
                </div>
              </aside>

              {/* --- RIGHT: EXPANDED FULL-WIDTH CONTENT PANEL --- */}
              <div className="grow min-w-0 space-y-6 w-full">

            {/* --- PERSISTENT LIVE HEADER SIMULATION PREVIEW (For Nav Links, Styling & Logos) --- */}
            {['nav-links', 'header-styling', 'logos'].includes(siteSettingsSubtab) && (
              <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 sm:p-6 shadow-xl space-y-3 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#C9A56A] uppercase tracking-wider font-bold gap-2">
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#C9A56A]" />
                    <span>Live Header Simulation Preview</span>
                  </span>
                  <span className="text-[10px] text-[#8C9A90] font-mono">
                    Font: {siteSettingsForm.headerFontSize || '13px'} &bull; Gap: {siteSettingsForm.headerItemSpacing || '24px'} &bull; Height: {siteSettingsForm.headerHeight || 'standard'} &bull; Theme: {siteSettingsForm.headerBackgroundStyle || 'emerald'}
                  </span>
                </div>

                <div className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                  siteSettingsForm.headerBorderBottom === 'subtle'
                    ? 'border-white/15'
                    : siteSettingsForm.headerBorderBottom === 'glow'
                    ? 'border-[#C9A56A] shadow-[0_0_20px_rgba(201,165,106,0.3)]'
                    : siteSettingsForm.headerBorderBottom === 'none'
                    ? 'border-transparent'
                    : 'border-[#C9A56A]/40'
                } ${
                  siteSettingsForm.headerBackgroundStyle === 'obsidian'
                    ? 'bg-[#0F1714]'
                    : siteSettingsForm.headerBackgroundStyle === 'glass'
                    ? 'bg-black/70 backdrop-blur-xl'
                    : siteSettingsForm.headerBackgroundStyle === 'solid'
                    ? 'bg-[#0F1714]'
                    : 'bg-[#163129]'
                }`}>
                  {siteSettingsForm.headerTopBarEnabled && siteSettingsForm.headerTopBarText && (
                    <div className={`py-1 px-3 text-center text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 ${
                      siteSettingsForm.headerTopBarBg === 'gold'
                        ? 'bg-[#C9A56A] text-[#0F1714]'
                        : siteSettingsForm.headerTopBarBg === 'obsidian'
                        ? 'bg-[#0F1714] text-[#C9A56A] border-b border-[#C9A56A]/30'
                        : 'bg-[#163129] text-white border-b border-white/10'
                    }`}>
                      <Sparkles className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{siteSettingsForm.headerTopBarText}</span>
                    </div>
                  )}

                  <div className={`p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    siteSettingsForm.headerHeight === 'compact'
                      ? 'py-2'
                      : siteSettingsForm.headerHeight === 'luxury'
                      ? 'py-5'
                      : 'py-3.5'
                  }`}>
                    <div className="flex items-center space-x-3 shrink-0">
                      {siteSettingsForm.headerLogoImage ? (
                        <img
                          src={siteSettingsForm.headerLogoImage}
                          alt="Logo Preview"
                          style={{ maxHeight: `${siteSettingsForm.headerLogoHeight || 40}px` }}
                          className="w-auto object-contain"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div
                            style={{
                              width: `${Math.max(30, siteSettingsForm.headerLogoHeight || 36)}px`,
                              height: `${Math.max(30, siteSettingsForm.headerLogoHeight || 36)}px`
                            }}
                            className="rounded-full border border-[#C9A56A] bg-[#C9A56A]/20 flex items-center justify-center text-[#C9A56A] font-serif font-bold text-xs"
                          >
                            {siteSettingsForm.headerLogoMonogram || 'A'}
                          </div>
                          <div>
                            <span className="font-serif text-xs font-bold tracking-wider text-white uppercase block">
                              {siteSettingsForm.headerLogoTitle || 'Atelier Living'}
                            </span>
                            <span className="text-[7px] tracking-widest text-[#C9A56A] uppercase block">
                              {siteSettingsForm.headerLogoSubtitle || 'Designed For Inspired Living'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      style={{ gap: siteSettingsForm.headerItemSpacing || '24px' }}
                      className={`flex flex-wrap items-center ${
                        siteSettingsForm.headerAlignment === 'left'
                          ? 'justify-start'
                          : siteSettingsForm.headerAlignment === 'right'
                          ? 'justify-end'
                          : 'justify-center'
                      }`}
                    >
                      {siteSettingsForm.navLinks
                        .filter((l) => l.isVisible !== false)
                        .map((l) => (
                          <span
                            key={l.id}
                            style={{
                              fontSize: siteSettingsForm.headerFontSize || '13px',
                              fontWeight: Number(siteSettingsForm.headerFontWeight || 600),
                              letterSpacing:
                                siteSettingsForm.headerLetterSpacing === 'tight'
                                  ? '0.025em'
                                  : siteSettingsForm.headerLetterSpacing === 'normal'
                                  ? '0.05em'
                                  : siteSettingsForm.headerLetterSpacing === 'wide'
                                  ? '0.1em'
                                  : siteSettingsForm.headerLetterSpacing === 'wider'
                                  ? '0.15em'
                                  : '0.2em',
                              textTransform:
                                siteSettingsForm.headerTextTransform === 'capitalize'
                                  ? 'capitalize'
                                  : siteSettingsForm.headerTextTransform === 'normal-case'
                                  ? 'none'
                                  : 'uppercase'
                            }}
                            className="text-white font-medium hover:text-[#C9A56A] transition-colors flex items-center gap-1 cursor-default"
                          >
                            <span>{l.label}</span>
                            {l.hasMegaMenu && <Sparkles className="w-2.5 h-2.5 text-[#C9A56A]" />}
                            {l.isExternal && <ExternalLink className="w-2.5 h-2.5 text-[#8C9A90]" />}
                          </span>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {siteSettingsForm.headerShowSearch && (
                        <div className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/80">
                          <Search className="w-3 h-3" />
                        </div>
                      )}
                      {siteSettingsForm.headerShowConcierge !== false && (
                        <div className="p-1.5 rounded-full bg-white/5 border border-white/10 text-[#C9A56A]">
                          <Phone className="w-3 h-3" />
                        </div>
                      )}
                      {siteSettingsForm.headerShowSwatchesBtn !== false && (
                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] text-[10px] font-bold uppercase tracking-wider">
                          Swatches
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SUBTAB 1: HEADER MENU LINKS --- */}
            {siteSettingsSubtab === 'nav-links' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Header Menu Items Manager */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">Header Menu Navigation Items</h3>
                      <p className="text-xs text-[#8C9A90]">
                        Reorder items, edit labels, set destination routes, toggle MegaMenu dropdown, or add custom links.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddLink}
                      className="px-4 py-2 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:bg-[#E6C894] transition-all flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Menu Link</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {siteSettingsForm.navLinks.map((link, idx) => (
                      <div
                        key={link.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                          link.isVisible
                            ? 'bg-white/5 border-white/10 hover:border-[#C9A56A]/40'
                            : 'bg-black/40 border-dashed border-white/10 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Order number & Move Buttons */}
                          <div className="flex items-center space-x-1">
                            <span className="w-6 h-6 rounded-md bg-[#0F1714] border border-white/15 text-[10px] font-mono font-bold text-[#C9A56A] flex items-center justify-center">
                              {link.order || idx + 1}
                            </span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleMoveLinkUp(idx)}
                                disabled={idx === 0}
                                className="p-0.5 text-[#8C9A90] hover:text-[#C9A56A] disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveLinkDown(idx)}
                                disabled={idx === siteSettingsForm.navLinks.length - 1}
                                className="p-0.5 text-[#8C9A90] hover:text-[#C9A56A] disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-sm">{link.label}</span>
                              {link.hasMegaMenu && (
                                <span className="px-2 py-0.5 rounded-full bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/40 text-[9px] font-bold uppercase tracking-widest">
                                  MegaMenu Dropdown
                                </span>
                              )}
                              {link.isExternal && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-bold uppercase tracking-widest">
                                  External Link
                                </span>
                              )}
                              {!link.isVisible && (
                                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-bold uppercase tracking-widest">
                                  Hidden from Header
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#8C9A90] font-mono block">
                              Target: <strong className="text-[#E9DFD1]">{link.target}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Item Actions */}
                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                          <button
                            onClick={() => handleToggleLinkVisibility(link.id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              link.isVisible
                                ? 'bg-white/5 border-white/15 text-emerald-400 hover:bg-white/10'
                                : 'bg-red-950/40 border-red-500/30 text-red-400 hover:bg-red-900/60'
                            }`}
                            title={link.isVisible ? 'Hide Link from Navbar' : 'Show Link in Navbar'}
                          >
                            {link.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleOpenEditLink(link)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C9A56A] border border-[#C9A56A]/30 transition-all cursor-pointer"
                            title="Edit Link Configuration"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteLink(link.id, link.label)}
                            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 transition-all cursor-pointer"
                            title="Delete Menu Link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- SUBTAB 2: HEADER STYLING & LAYOUT OPTIONS --- */}
            {siteSettingsSubtab === 'header-styling' && (
              <div className="space-y-8 animate-in fade-in">
                {/* 1. Header Typography & Link Styling */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <Type className="w-5 h-5 text-[#C9A56A]" />
                        <span>Header Typography & Navigation Links</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Fine-tune font sizing, item spacing / gap between links, font weight, letter spacing, and casing.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Font Size */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Font Size: <span className="text-white font-mono">{siteSettingsForm.headerFontSize || '13px'}</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['11px', '12px', '13px', '14px', '15px', '16px'] as const).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSiteSettingsForm((prev) => ({ ...prev, headerFontSize: size }))}
                            className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                              (siteSettingsForm.headerFontSize || '13px') === size
                                ? 'bg-[#C9A56A] text-[#0F1714] shadow-md'
                                : 'bg-black/40 text-[#8C9A90] border border-white/10 hover:border-[#C9A56A]/40 hover:text-white'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Between Space (Item Gap) */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Between Space / Gap: <span className="text-white font-mono">{siteSettingsForm.headerItemSpacing || '24px'}</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['12px', '18px', '24px', '32px', '40px', '48px'] as const).map((gap) => (
                          <button
                            key={gap}
                            type="button"
                            onClick={() => setSiteSettingsForm((prev) => ({ ...prev, headerItemSpacing: gap }))}
                            className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                              (siteSettingsForm.headerItemSpacing || '24px') === gap
                                ? 'bg-[#C9A56A] text-[#0F1714] shadow-md'
                                : 'bg-black/40 text-[#8C9A90] border border-white/10 hover:border-[#C9A56A]/40 hover:text-white'
                            }`}
                          >
                            {gap}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Weight */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Font Weight
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { val: '300', label: '300 Light' },
                          { val: '400', label: '400 Regular' },
                          { val: '500', label: '500 Medium' },
                          { val: '600', label: '600 SemiBold' },
                          { val: '700', label: '700 Bold' }
                        ].map((w) => (
                          <button
                            key={w.val}
                            type="button"
                            onClick={() => setSiteSettingsForm((prev) => ({ ...prev, headerFontWeight: w.val as any }))}
                            className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              (siteSettingsForm.headerFontWeight || '600') === w.val
                                ? 'bg-[#C9A56A] text-[#0F1714] font-bold shadow-md'
                                : 'bg-black/40 text-[#8C9A90] border border-white/10 hover:border-[#C9A56A]/40 hover:text-white'
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Letter Spacing (Kerning) */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Letter Spacing (Kerning)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 'tight', label: 'Tight' },
                          { val: 'normal', label: 'Normal' },
                          { val: 'wide', label: 'Wide' },
                          { val: 'wider', label: 'Wider' },
                          { val: 'widest', label: 'Widest' }
                        ].map((s) => (
                          <button
                            key={s.val}
                            type="button"
                            onClick={() => setSiteSettingsForm((prev) => ({ ...prev, headerLetterSpacing: s.val as any }))}
                            className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              (siteSettingsForm.headerLetterSpacing || 'widest') === s.val
                                ? 'bg-[#C9A56A] text-[#0F1714] font-bold shadow-md'
                                : 'bg-black/40 text-[#8C9A90] border border-white/10 hover:border-[#C9A56A]/40 hover:text-white'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Transform / Case */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Text Transformation
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 'uppercase', label: 'UPPERCASE' },
                          { val: 'capitalize', label: 'Capitalize' },
                          { val: 'normal-case', label: 'Sentence' }
                        ].map((c) => (
                          <button
                            key={c.val}
                            type="button"
                            onClick={() => setSiteSettingsForm((prev) => ({ ...prev, headerTextTransform: c.val as any }))}
                            className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              (siteSettingsForm.headerTextTransform || 'uppercase') === c.val
                                ? 'bg-[#C9A56A] text-[#0F1714] font-bold shadow-md'
                                : 'bg-black/40 text-[#8C9A90] border border-white/10 hover:border-[#C9A56A]/40 hover:text-white'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Menu Alignment */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Menu Positioning / Alignment
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 'left', label: 'Left' },
                          { val: 'center', label: 'Center' },
                          { val: 'right', label: 'Right' }
                        ].map((a) => (
                          <button
                            key={a.val}
                            type="button"
                            onClick={() => setSiteSettingsForm((prev) => ({ ...prev, headerAlignment: a.val as any }))}
                            className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              (siteSettingsForm.headerAlignment || 'center') === a.val
                                ? 'bg-[#C9A56A] text-[#0F1714] font-bold shadow-md'
                                : 'bg-black/40 text-[#8C9A90] border border-white/10 hover:border-[#C9A56A]/40 hover:text-white'
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Dimensions, Logo Sizing & Behavior */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-[#C9A56A]" />
                        <span>Header Dimensions & Logo Sizing</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Control navbar vertical height, max logo height, and sticky navigation behavior.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Header Height */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Navbar Vertical Height
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 'compact', label: 'Compact', desc: '60px' },
                          { val: 'standard', label: 'Standard', desc: '76px' },
                          { val: 'luxury', label: 'Luxury', desc: '92px' }
                        ].map((h) => (
                          <button
                            key={h.val}
                            type="button"
                            onClick={() => setSiteSettingsForm((prev) => ({ ...prev, headerHeight: h.val as any }))}
                            className={`py-2 px-2.5 rounded-xl text-center transition-all cursor-pointer ${
                              (siteSettingsForm.headerHeight || 'standard') === h.val
                                ? 'bg-[#C9A56A] text-[#0F1714] shadow-md'
                                : 'bg-black/40 text-[#8C9A90] border border-white/10 hover:border-[#C9A56A]/40 hover:text-white'
                            }`}
                          >
                            <span className="block text-xs font-bold">{h.label}</span>
                            <span className="block text-[10px] opacity-75 font-mono">{h.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Logo Max Height Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                          Logo Max Height
                        </label>
                        <span className="text-xs font-mono font-bold text-white bg-black/40 px-2.5 py-0.5 rounded-md border border-white/10">
                          {siteSettingsForm.headerLogoHeight || 40}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="28"
                        max="64"
                        step="2"
                        value={siteSettingsForm.headerLogoHeight || 40}
                        onChange={(e) =>
                          setSiteSettingsForm((prev) => ({
                            ...prev,
                            headerLogoHeight: parseInt(e.target.value)
                          }))
                        }
                        className="w-full accent-[#C9A56A] cursor-pointer mt-2"
                      />
                      <div className="flex justify-between text-[10px] text-[#8C9A90] font-mono">
                        <span>28px (Sleek)</span>
                        <span>40px (Default)</span>
                        <span>64px (Prominent)</span>
                      </div>
                    </div>

                    {/* Sticky Header Toggle */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Sticky Navbar on Scroll
                      </label>
                      <div
                        onClick={() =>
                          setSiteSettingsForm((prev) => ({
                            ...prev,
                            headerSticky: prev.headerSticky === false ? true : false
                          }))
                        }
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          siteSettingsForm.headerSticky !== false
                            ? 'bg-[#C9A56A]/15 border-[#C9A56A]/40 text-white'
                            : 'bg-black/40 border-white/10 text-[#8C9A90]'
                        }`}
                      >
                        <span className="text-xs font-bold">
                          {siteSettingsForm.headerSticky !== false ? 'Sticky Header Enabled' : 'Static Header (No Sticky)'}
                        </span>
                        <div
                          className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                            siteSettingsForm.headerSticky !== false ? 'bg-[#C9A56A]' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              siteSettingsForm.headerSticky !== false ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Aesthetic Theme, Glassmorphism & Bottom Border */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <Layout className="w-5 h-5 text-[#C9A56A]" />
                        <span>Background Aesthetic & Bottom Border</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Choose background blur styling and luxury trim accents.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Background Aesthetic */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Background Color & Glass Aesthetic
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { val: 'emerald', label: 'Emerald Deep', desc: '#163129 Atelier Signature' },
                          { val: 'obsidian', label: 'Obsidian Midnight', desc: '#0F1714 Pure Noir' },
                          { val: 'glass', label: 'Frosted Glass', desc: 'Ultra Blur & Transparency' },
                          { val: 'solid', label: 'Solid Black Matte', desc: 'Opaque Minimalist' }
                        ].map((b) => (
                          <button
                            key={b.val}
                            type="button"
                            onClick={() => setSiteSettingsForm((prev) => ({ ...prev, headerBackgroundStyle: b.val as any }))}
                            className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                              (siteSettingsForm.headerBackgroundStyle || 'emerald') === b.val
                                ? 'bg-[#C9A56A]/20 border-[#C9A56A] text-white shadow-md'
                                : 'bg-black/40 border-white/10 text-[#8C9A90] hover:border-white/30 hover:text-white'
                            }`}
                          >
                            <span className="block text-xs font-bold">{b.label}</span>
                            <span className="block text-[10px] opacity-70 mt-0.5">{b.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Border Accent */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Bottom Border Accent
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { val: 'gold', label: 'Gold Trim Border', desc: 'Refined 1px #C9A56A' },
                          { val: 'glow', label: 'Gold Ambient Glow', desc: 'Warm Radiant Aura' },
                          { val: 'subtle', label: 'Subtle Slate', desc: 'Soft White/15 Line' },
                          { val: 'none', label: 'Seamless (None)', desc: 'Borderless Edge' }
                        ].map((border) => (
                          <button
                            key={border.val}
                            type="button"
                            onClick={() => setSiteSettingsForm((prev) => ({ ...prev, headerBorderBottom: border.val as any }))}
                            className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                              (siteSettingsForm.headerBorderBottom || 'gold') === border.val
                                ? 'bg-[#C9A56A]/20 border-[#C9A56A] text-white shadow-md'
                                : 'bg-black/40 border-white/10 text-[#8C9A90] hover:border-white/30 hover:text-white'
                            }`}
                          >
                            <span className="block text-xs font-bold">{border.label}</span>
                            <span className="block text-[10px] opacity-70 mt-0.5">{border.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Top Announcement / Promotion Bar */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#C9A56A]" />
                        <span>Top Announcement / Promo Bar</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Display an announcement banner above the navigation bar for high-priority offers or notices.
                      </p>
                    </div>

                    {/* Announcement Bar Toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setSiteSettingsForm((prev) => ({
                          ...prev,
                          headerTopBarEnabled: !prev.headerTopBarEnabled
                        }))
                      }
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                        siteSettingsForm.headerTopBarEnabled
                          ? 'bg-[#C9A56A] text-[#0F1714] shadow-md'
                          : 'bg-black/40 text-[#8C9A90] border border-white/10 hover:text-white'
                      }`}
                    >
                      {siteSettingsForm.headerTopBarEnabled ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Announcement Bar Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Announcement Bar Disabled</span>
                        </>
                      )}
                    </button>
                  </div>

                  {siteSettingsForm.headerTopBarEnabled && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-8 space-y-1.5">
                          <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                            Announcement Message
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.headerTopBarText || ''}
                            onChange={(e) =>
                              setSiteSettingsForm((prev) => ({
                                ...prev,
                                headerTopBarText: e.target.value
                              }))
                            }
                            placeholder="e.g. Complimentary White-Glove Delivery Across India on Orders Above ₹5,00,000"
                            className="w-full bg-[#0F1714] border border-[#C9A56A]/30 rounded-xl px-4 py-2.5 text-white text-xs placeholder:text-[#8C9A90]/50 focus:outline-none focus:border-[#C9A56A]"
                          />
                        </div>

                        <div className="md:col-span-4 space-y-1.5">
                          <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                            Link Destination (Optional)
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.headerTopBarLink || ''}
                            onChange={(e) =>
                              setSiteSettingsForm((prev) => ({
                                ...prev,
                                headerTopBarLink: e.target.value
                              }))
                            }
                            placeholder="e.g. /contact or /showrooms"
                            className="w-full bg-[#0F1714] border border-[#C9A56A]/30 rounded-xl px-4 py-2.5 text-white text-xs placeholder:text-[#8C9A90]/50 focus:outline-none focus:border-[#C9A56A]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                          Banner Background Color Theme
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { val: 'gold', label: 'Radiant Gold', desc: 'High visibility #C9A56A' },
                            { val: 'emerald', label: 'Deep Emerald', desc: 'Subtle luxury #163129' },
                            { val: 'obsidian', label: 'Obsidian Black', desc: 'Minimalist #0F1714' }
                          ].map((theme) => (
                            <button
                              key={theme.val}
                              type="button"
                              onClick={() =>
                                setSiteSettingsForm((prev) => ({
                                  ...prev,
                                  headerTopBarBg: theme.val as any
                                }))
                              }
                              className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                                (siteSettingsForm.headerTopBarBg || 'gold') === theme.val
                                  ? 'bg-[#C9A56A]/20 border-[#C9A56A] text-white shadow-md'
                                  : 'bg-black/40 border-white/10 text-[#8C9A90] hover:border-white/30 hover:text-white'
                              }`}
                            >
                              <span className="block text-xs font-bold">{theme.label}</span>
                              <span className="block text-[10px] opacity-70 mt-0.5">{theme.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Header Action Buttons & Utility Icons */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <PackageCheck className="w-5 h-5 text-[#C9A56A]" />
                        <span>Header Action Buttons & CTA Toggles</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Toggle visibility for header utility controls (Search, Order Swatches, Concierge Dial, Bag).
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Swatches Button */}
                    <div
                      onClick={() =>
                        setSiteSettingsForm((prev) => ({
                          ...prev,
                          headerShowSwatchesBtn: prev.headerShowSwatchesBtn === false ? true : false
                        }))
                      }
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                        siteSettingsForm.headerShowSwatchesBtn !== false
                          ? 'bg-[#C9A56A]/15 border-[#C9A56A]/50 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-[#8C9A90]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#C9A56A]" />
                          <span>Swatches CTA Button</span>
                        </span>
                        <div
                          className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                            siteSettingsForm.headerShowSwatchesBtn !== false ? 'bg-[#C9A56A]' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                              siteSettingsForm.headerShowSwatchesBtn !== false ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] opacity-80">
                        {siteSettingsForm.headerShowSwatchesBtn !== false ? 'Visible (Gold Swatches Pill)' : 'Hidden from Header'}
                      </p>
                    </div>

                    {/* Search Icon */}
                    <div
                      onClick={() =>
                        setSiteSettingsForm((prev) => ({
                          ...prev,
                          headerShowSearch: !prev.headerShowSearch
                        }))
                      }
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                        siteSettingsForm.headerShowSearch
                          ? 'bg-[#C9A56A]/15 border-[#C9A56A]/50 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-[#8C9A90]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <Search className="w-4 h-4 text-[#C9A56A]" />
                          <span>Search Modal Trigger</span>
                        </span>
                        <div
                          className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                            siteSettingsForm.headerShowSearch ? 'bg-[#C9A56A]' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                              siteSettingsForm.headerShowSearch ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] opacity-80">
                        {siteSettingsForm.headerShowSearch ? 'Visible in Header' : 'Hidden from Header'}
                      </p>
                    </div>

                    {/* Concierge Dial */}
                    <div
                      onClick={() =>
                        setSiteSettingsForm((prev) => ({
                          ...prev,
                          headerShowConcierge: prev.headerShowConcierge === false ? true : false
                        }))
                      }
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                        siteSettingsForm.headerShowConcierge !== false
                          ? 'bg-[#C9A56A]/15 border-[#C9A56A]/50 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-[#8C9A90]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-[#C9A56A]" />
                          <span>Concierge Phone Icon</span>
                        </span>
                        <div
                          className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                            siteSettingsForm.headerShowConcierge !== false ? 'bg-[#C9A56A]' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                              siteSettingsForm.headerShowConcierge !== false ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] opacity-80">
                        {siteSettingsForm.headerShowConcierge !== false ? 'Visible in Header' : 'Hidden from Header'}
                      </p>
                    </div>

                    {/* Inquiry Cart */}
                    <div
                      onClick={() =>
                        setSiteSettingsForm((prev) => ({
                          ...prev,
                          headerShowCart: !prev.headerShowCart
                        }))
                      }
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                        siteSettingsForm.headerShowCart
                          ? 'bg-[#C9A56A]/15 border-[#C9A56A]/50 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-[#8C9A90]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <PackageCheck className="w-4 h-4 text-[#C9A56A]" />
                          <span>Inquiry Bag Counter</span>
                        </span>
                        <div
                          className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                            siteSettingsForm.headerShowCart ? 'bg-[#C9A56A]' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                              siteSettingsForm.headerShowCart ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] opacity-80">
                        {siteSettingsForm.headerShowCart ? 'Visible in Header' : 'Hidden from Header'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SUBTAB 3: LOGOS & BRAND IDENTITY --- */}
            {siteSettingsSubtab === 'logos' && (
              <div className="space-y-8 animate-in fade-in">
                {/* 1. Header Logo Management */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#C9A56A]" />
                        <span>Header Logo & Text Fallback</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Upload an image logo. If no image logo is uploaded, the website automatically renders the customized monogram letter and brand typography.
                      </p>
                    </div>
                  </div>

                  {/* Header Logo Image Mode */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 space-y-3">
                      <label className="text-[10px] uppercase font-bold text-[#C9A56A] block">
                        Header Logo Preview
                      </label>
                      <div className="h-32 rounded-2xl bg-[#0F1714] border-2 border-dashed border-[#C9A56A]/40 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                        {siteSettingsForm.headerLogoImage ? (
                          <>
                            <img
                              src={siteSettingsForm.headerLogoImage}
                              alt="Header Logo"
                              className="max-h-full max-w-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => setSiteSettingsForm({ ...siteSettingsForm, headerLogoImage: '' })}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 text-red-300 border border-red-500/40 hover:bg-red-900 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                              title="Remove Header Logo Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center space-y-1">
                            <div className="w-10 h-10 rounded-full border border-[#C9A56A] bg-[#C9A56A]/20 flex items-center justify-center mx-auto text-[#C9A56A] font-serif font-bold text-lg">
                              {siteSettingsForm.headerLogoMonogram || 'A'}
                            </div>
                            <span className="text-[11px] font-serif font-bold text-white uppercase block">
                              {siteSettingsForm.headerLogoTitle || 'Atelier Living'}
                            </span>
                            <span className="text-[9px] text-[#C9A56A] block">
                              Text Fallback Active
                            </span>
                          </div>
                        )}
                      </div>

                      {siteSettingsForm.headerLogoImage && (
                        <button
                          type="button"
                          onClick={() => setSiteSettingsForm({ ...siteSettingsForm, headerLogoImage: '' })}
                          className="w-full py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold hover:bg-red-900/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear Logo Image (Use Text Fallback)</span>
                        </button>
                      )}
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Header Logo Image URL
                        </label>
                        <input
                          type="url"
                          value={siteSettingsForm.headerLogoImage}
                          onChange={(e) =>
                            setSiteSettingsForm({ ...siteSettingsForm, headerLogoImage: e.target.value })
                          }
                          placeholder="https://... or upload image below"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                        />
                      </div>

                      <ImageUploader
                        value={siteSettingsForm.headerLogoImage}
                        onChange={(url: string) =>
                          setSiteSettingsForm({ ...siteSettingsForm, headerLogoImage: url })
                        }
                        label="Upload Header Logo File (PNG, SVG, Transparent)"
                      />
                    </div>
                  </div>

                  {/* Header Logo Text Fallback Form */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base text-[#C9A56A] font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Header Logo Text Fallback (When Image is Not Uploaded)</span>
                      </h4>
                      <span className="text-[10px] font-mono text-[#8C9A90]">Custom Typography</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Monogram / Lettermark *
                        </label>
                        <input
                          type="text"
                          maxLength={3}
                          value={siteSettingsForm.headerLogoMonogram}
                          onChange={(e) =>
                            setSiteSettingsForm({ ...siteSettingsForm, headerLogoMonogram: e.target.value })
                          }
                          placeholder="A"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white font-serif font-bold text-center uppercase focus:border-[#C9A56A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Brand Title / Name *
                        </label>
                        <input
                          type="text"
                          value={siteSettingsForm.headerLogoTitle}
                          onChange={(e) =>
                            setSiteSettingsForm({ ...siteSettingsForm, headerLogoTitle: e.target.value })
                          }
                          placeholder="Atelier Living"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Tagline / Subtitle
                        </label>
                        <input
                          type="text"
                          value={siteSettingsForm.headerLogoSubtitle}
                          onChange={(e) =>
                            setSiteSettingsForm({ ...siteSettingsForm, headerLogoSubtitle: e.target.value })
                          }
                          placeholder="Designed For Inspired Living"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Footer Logo, Bio & Copyright Management */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-3 border-b border-white/10">
                    <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#C9A56A]" />
                      <span>Footer Logo, Brand Story & Copyright Notice</span>
                    </h3>
                    <p className="text-xs text-[#8C9A90]">
                      Configure the footer brand signature, company biography, and legal copyright line.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 space-y-3">
                      <label className="text-[10px] uppercase font-bold text-[#C9A56A] block">
                        Footer Logo Preview
                      </label>
                      <div className="h-32 rounded-2xl bg-[#0F1714] border-2 border-dashed border-[#C9A56A]/40 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                        {siteSettingsForm.footerLogoImage || siteSettingsForm.headerLogoImage ? (
                          <img
                            src={siteSettingsForm.footerLogoImage || siteSettingsForm.headerLogoImage}
                            alt="Footer Logo"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full border border-[#C9A56A] bg-[#C9A56A]/20 flex items-center justify-center text-[#C9A56A] font-serif font-bold text-sm">
                              {siteSettingsForm.footerLogoMonogram || 'A'}
                            </div>
                            <span className="font-serif text-sm font-bold tracking-wider text-white uppercase">
                              {siteSettingsForm.footerLogoTitle || 'Atelier Living'}
                            </span>
                          </div>
                        )}
                      </div>

                      <ImageUploader
                        value={siteSettingsForm.footerLogoImage}
                        onChange={(url: string) =>
                          setSiteSettingsForm({ ...siteSettingsForm, footerLogoImage: url })
                        }
                        label="Upload Dedicated Footer Logo (Optional)"
                      />
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Company Description & Atelier Bio (Footer Column 1)
                        </label>
                        <textarea
                          rows={3}
                          value={siteSettingsForm.footerDescription}
                          onChange={(e) =>
                            setSiteSettingsForm({ ...siteSettingsForm, footerDescription: e.target.value })
                          }
                          placeholder="Atelier Living is an international interior design house crafting bespoke textiles..."
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Footer Copyright Text
                        </label>
                        <input
                          type="text"
                          value={siteSettingsForm.footerCopyright}
                          onChange={(e) =>
                            setSiteSettingsForm({ ...siteSettingsForm, footerCopyright: e.target.value })
                          }
                          placeholder="© 2026 Atelier Living Ltd. All rights reserved."
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SUBTAB: HOMEPAGE HERO SHOWCASE SLIDER --- */}
            {siteSettingsSubtab === 'hero-slides' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-[#C9A56A]" />
                        <span>Homepage Hero Showcase Slider & Hotspot Pins</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Manage 3D-feel scene imagery, titles, location tags, architectural descriptions, and interactive pinpointed material specifications.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddHeroSlide}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Showcase Scene</span>
                    </button>
                  </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="text-xs text-[#8C9A90]">Total Scenes</span>
                      <span className="font-mono text-sm font-bold text-white">{heroSlidesList.length}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="text-xs text-[#8C9A90]">Active in Carousel</span>
                      <span className="font-mono text-sm font-bold text-emerald-400">
                        {heroSlidesList.filter((s) => s.isVisible !== false).length}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="text-xs text-[#8C9A90]">Total Hotspots Pinpointed</span>
                      <span className="font-mono text-sm font-bold text-[#C9A56A]">
                        {heroSlidesList.reduce((acc, s) => acc + (s.hotspots?.length || 0), 0)}
                      </span>
                    </div>
                  </div>

                  {/* Slides List */}
                  <div className="space-y-4">
                    {heroSlidesList.length === 0 ? (
                      <div className="p-8 text-center text-[#8C9A90] bg-black/30 rounded-2xl border border-white/5">
                        <Sliders className="w-8 h-8 text-[#C9A56A]/40 mx-auto mb-2" />
                        <p className="text-sm">No hero scenes configured.</p>
                        <button
                          type="button"
                          onClick={handleOpenAddHeroSlide}
                          className="mt-3 px-4 py-2 rounded-xl bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/40 text-xs font-semibold hover:bg-[#C9A56A]/30 cursor-pointer"
                        >
                          Create First Hero Scene
                        </button>
                      </div>
                    ) : (
                      heroSlidesList.map((slide, idx) => (
                        <div
                          key={slide.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            slide.isVisible !== false
                              ? 'bg-[#0F1714]/70 border-white/10 hover:border-[#C9A56A]/40'
                              : 'bg-black/40 border-dashed border-white/10 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Left Scene Thumbnail + Info */}
                            <div className="flex items-start sm:items-center space-x-4 min-w-0">
                              <div className="w-24 sm:w-32 h-20 sm:h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-[#C9A56A]/30 shadow-md relative group">
                                <img
                                  src={slide.image}
                                  alt={slide.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-[#C9A56A] font-bold">
                                  #{idx + 1}
                                </div>
                              </div>

                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-serif text-base sm:text-lg font-bold text-white truncate">
                                    {slide.title}
                                  </h4>
                                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/30 flex items-center gap-1">
                                    <MapPin className="w-2.5 h-2.5" /> {slide.location}
                                  </span>
                                  {slide.isVisible === false && (
                                    <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-500/30 font-semibold">
                                      Hidden
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-[#8C9A90] line-clamp-2 leading-relaxed font-light">
                                  {slide.tagline}
                                </p>

                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                  <span className="text-[10px] text-[#C9A56A] font-mono font-medium flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded">
                                    <Eye className="w-3 h-3" /> {slide.hotspots?.length || 0} Pinpointed Hotspots
                                  </span>
                                  {slide.hotspots &&
                                    slide.hotspots.slice(0, 2).map((spot, sIdx) => (
                                      <span
                                        key={spot.id || sIdx}
                                        className="text-[9px] text-[#8C9A90] bg-white/5 px-2 py-0.5 rounded border border-white/5 truncate max-w-[140px]"
                                      >
                                        &bull; {spot.label}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                              {/* Order Up / Down */}
                              <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-white/5">
                                <button
                                  type="button"
                                  onClick={() => handleMoveHeroSlideUp(idx)}
                                  disabled={idx === 0}
                                  className="p-1.5 rounded-lg text-[#8C9A90] hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                  title="Move Slide Earlier in Carousel"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveHeroSlideDown(idx)}
                                  disabled={idx === heroSlidesList.length - 1}
                                  className="p-1.5 rounded-lg text-[#8C9A90] hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                  title="Move Slide Later in Carousel"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Visibility Toggle */}
                              <button
                                type="button"
                                onClick={() => handleToggleHeroSlideVisibility(slide.id)}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  slide.isVisible !== false
                                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40'
                                    : 'bg-white/5 border-white/10 text-[#8C9A90] hover:text-white'
                                }`}
                                title={slide.isVisible !== false ? 'Hide from homepage slider' : 'Show on homepage slider'}
                              >
                                {slide.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>

                              {/* Edit Slide */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditHeroSlide(slide)}
                                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5 text-[#C9A56A]" />
                                <span>Edit & Hotspots</span>
                              </button>

                              {/* Delete Slide */}
                              <button
                                type="button"
                                onClick={() => handleDeleteHeroSlide(slide.id, slide.title)}
                                className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-500/20 text-red-300 transition-all cursor-pointer"
                                title="Delete scene from slider"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- SUBTAB 4: CLIENT TESTIMONIALS & REVIEWS --- */}
            {siteSettingsSubtab === 'testimonials' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#C9A56A]" />
                        <span>Client Testimonials & Curated Reviews</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Manage client endorsements, 5-star ratings, quotes, and project titles displayed on the landing page review carousel.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddTestimonial}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Review</span>
                    </button>
                  </div>

                  {/* Testimonials List */}
                  <div className="space-y-3">
                    {testimonialsList.length === 0 ? (
                      <div className="p-8 text-center text-[#8C9A90] bg-black/30 rounded-2xl border border-white/5">
                        <Quote className="w-8 h-8 text-[#C9A56A]/40 mx-auto mb-2" />
                        <p className="text-sm">No client testimonials added yet.</p>
                        <button
                          type="button"
                          onClick={handleOpenAddTestimonial}
                          className="mt-3 px-4 py-2 rounded-xl bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/40 text-xs font-semibold hover:bg-[#C9A56A]/30 cursor-pointer"
                        >
                          Add Your First Testimonial
                        </button>
                      </div>
                    ) : (
                      testimonialsList.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            item.isVisible !== false
                              ? 'bg-[#0F1714]/60 border-white/10 hover:border-[#C9A56A]/40'
                              : 'bg-black/40 border-dashed border-white/10 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex items-start space-x-3.5 min-w-0">
                              {/* Avatar / Monogram */}
                              <div className="w-11 h-11 rounded-full border border-[#C9A56A]/50 bg-[#C9A56A]/20 overflow-hidden shrink-0 flex items-center justify-center text-[#C9A56A] font-serif font-bold text-sm">
                                {item.avatar ? (
                                  <img src={item.avatar} alt={item.clientName} className="w-full h-full object-cover" />
                                ) : (
                                  item.clientName.split(' ').map((n) => n[0]).join('').slice(0, 2)
                                )}
                              </div>

                              <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-serif font-bold text-white text-base">{item.clientName}</span>
                                  {item.clientRole && (
                                    <span className="text-[11px] text-[#C9A56A] font-medium">
                                      &bull; {item.clientRole}
                                    </span>
                                  )}
                                  {item.location && (
                                    <span className="text-[10px] text-[#8C9A90] font-mono flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-[#C9A56A]" /> {item.location}
                                    </span>
                                  )}
                                  {item.isFeatured && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/40 text-[9px] font-bold uppercase tracking-wider">
                                      Featured
                                    </span>
                                  )}
                                  {item.isVisible === false && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-bold uppercase tracking-wider">
                                      Hidden
                                    </span>
                                  )}
                                </div>

                                {/* Star Rating */}
                                <div className="flex items-center space-x-1 py-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3.5 h-3.5 ${
                                        s <= (item.rating || 5)
                                          ? 'text-[#C9A56A] fill-[#C9A56A]'
                                          : 'text-white/20'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-[11px] font-mono text-[#8C9A90] ml-1.5 font-bold">
                                    {item.rating || 5}.0 / 5.0
                                  </span>
                                </div>

                                {/* Quote */}
                                <p className="text-xs text-[#E9DFD1] font-light italic leading-relaxed pt-1">
                                  &ldquo;{item.quote}&rdquo;
                                </p>

                                {item.projectOrProduct && (
                                  <span className="text-[11px] text-[#8C9A90] block pt-1 font-mono">
                                    Commission: <strong className="text-[#C9A56A]">{item.projectOrProduct}</strong>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-start">
                              <button
                                type="button"
                                onClick={() => handleToggleTestimonialFeatured(item.id)}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  item.isFeatured
                                    ? 'bg-[#C9A56A]/20 border-[#C9A56A] text-[#C9A56A]'
                                    : 'bg-white/5 border-white/10 text-[#8C9A90] hover:text-white'
                                }`}
                                title={item.isFeatured ? 'Featured on Top' : 'Mark as Featured'}
                              >
                                <Sparkles className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleTestimonialVisibility(item.id)}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  item.isVisible !== false
                                    ? 'bg-white/5 border-white/15 text-emerald-400 hover:bg-white/10'
                                    : 'bg-red-950/40 border-red-500/30 text-red-400 hover:bg-red-900/60'
                                }`}
                                title={item.isVisible !== false ? 'Hide Review from Public Site' : 'Show Review'}
                              >
                                {item.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditTestimonial(item)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C9A56A] border border-[#C9A56A]/30 transition-all cursor-pointer"
                                title="Edit Review"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteTestimonial(item.id, item.clientName)}
                                className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 transition-all cursor-pointer"
                                title="Delete Review"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- SUBTAB 5: BRAND PARTNERS & MARQUEE TICKER --- */}
            {siteSettingsSubtab === 'brands' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#C9A56A]" />
                        <span>Brand Partners & Infinite Marquee Ticker</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Manage international mill partners, heritage textile houses, and their marquee typography ticker shown across the landing page and brands showcase.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddBrand}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Brand Partner</span>
                    </button>
                  </div>

                  {/* Brands List */}
                  <div className="space-y-3">
                    {brandsList.map((brand, idx) => (
                      <div
                        key={brand.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          brand.isVisible !== false
                            ? 'bg-[#0F1714]/60 border-white/10 hover:border-[#C9A56A]/40'
                            : 'bg-black/40 border-dashed border-white/10 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4 min-w-0">
                            {/* Order & Reorder arrows */}
                            <div className="flex items-center space-x-1 shrink-0">
                              <span className="w-6 h-6 rounded-md bg-black/40 border border-white/15 text-[10px] font-mono font-bold text-[#C9A56A] flex items-center justify-center">
                                {brand.order || idx + 1}
                              </span>
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  onClick={() => handleMoveBrandUp(idx)}
                                  disabled={idx === 0}
                                  className="p-0.5 text-[#8C9A90] hover:text-[#C9A56A] disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveBrandDown(idx)}
                                  disabled={idx === brandsList.length - 1}
                                  className="p-0.5 text-[#8C9A90] hover:text-[#C9A56A] disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Brand Image Preview */}
                            <div className="w-16 h-12 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0">
                              <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-serif font-bold text-white text-base">{brand.name}</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/40 text-[9px] font-mono font-bold uppercase">
                                  {brand.logoText}
                                </span>
                                {brand.isVisible === false && (
                                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-bold uppercase">
                                    Hidden
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[#8C9A90] block">
                                {brand.country} &bull; Est. {brand.established} &bull; <span className="text-[#E9DFD1]">{brand.specialty}</span>
                              </span>
                              <p className="text-[11px] text-[#8C9A90] truncate max-w-xl">
                                {brand.tagline || brand.description}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleToggleBrandVisibility(brand.id)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                brand.isVisible !== false
                                  ? 'bg-white/5 border-white/15 text-emerald-400 hover:bg-white/10'
                                  : 'bg-red-950/40 border-red-500/30 text-red-400 hover:bg-red-900/60'
                              }`}
                              title={brand.isVisible !== false ? 'Hide from Marquee & Brands Page' : 'Show Brand'}
                            >
                              {brand.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditBrand(brand)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C9A56A] border border-[#C9A56A]/30 transition-all cursor-pointer"
                              title="Edit Brand Partner"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteBrand(brand.id, brand.name)}
                              className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 transition-all cursor-pointer"
                              title="Delete Brand Partner"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- SUBTAB 6: OUR STORY & HERITAGE CMS --- */}
            {siteSettingsSubtab === 'story-cms' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Story CMS Sub-navigation Tabs */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <Compass className="w-5 h-5 text-[#C9A56A]" />
                        <span>Our Story & Heritage Page Content Manager</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Customize Hero introduction, Founder ethos & philosophy, 4 Craft Pillars, Historical Milestones, Workshop Gallery, and Global Statistics.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleResetStorySettings}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#8C9A90] hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Story</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveStorySettings()}
                        disabled={isSavingStorySettings}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingStorySettings ? 'Saving...' : 'Save Story Page'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Switcher Pills */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'hero', label: '1. Hero & Header', icon: Sparkles },
                      { id: 'founder', label: '2. Founder Ethos', icon: User },
                      { id: 'pillars', label: '3. Craft Pillars (4)', icon: Award },
                      { id: 'timeline', label: '4. Heritage Milestones', icon: History },
                      { id: 'gallery', label: '5. Atelier Gallery', icon: ImageIcon },
                      { id: 'stats', label: '6. Heritage Statistics', icon: TrendingUp }
                    ].map((sec) => {
                      const SecIcon = sec.icon;
                      const isActive = storyCmsSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setStoryCmsSection(sec.id as any)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            isActive
                              ? 'bg-[#C9A56A] text-[#0F1714] font-bold border-[#C9A56A] shadow-md'
                              : 'bg-black/30 border-white/10 text-[#8C9A90] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <SecIcon className="w-3.5 h-3.5" />
                          <span>{sec.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 1: Hero */}
                {storyCmsSection === 'hero' && (
                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
                    <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                      <Sparkles className="w-4 h-4 text-[#C9A56A]" />
                      <span>Hero Section Copy & Imagery</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Hero Badge / Pill
                        </label>
                        <input
                          type="text"
                          value={storySettingsForm.heroBadge}
                          onChange={(e) =>
                            setStorySettingsForm({ ...storySettingsForm, heroBadge: e.target.value })
                          }
                          placeholder="OUR STORY &amp; HERITAGE"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Heritage Year Badge
                        </label>
                        <input
                          type="text"
                          value={storySettingsForm.heroYear}
                          onChange={(e) =>
                            setStorySettingsForm({ ...storySettingsForm, heroYear: e.target.value })
                          }
                          placeholder="EST. 1989"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                        Hero Main Headline *
                      </label>
                      <input
                        type="text"
                        value={storySettingsForm.heroHeading}
                        onChange={(e) =>
                          setStorySettingsForm({ ...storySettingsForm, heroHeading: e.target.value })
                        }
                        placeholder="Crafting Timeless Architecture Through Haute Living Textiles"
                        className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-serif font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                        Hero Subheading Narrative
                      </label>
                      <textarea
                        rows={3}
                        value={storySettingsForm.heroSubheading}
                        onChange={(e) =>
                          setStorySettingsForm({ ...storySettingsForm, heroSubheading: e.target.value })
                        }
                        placeholder="For nearly four decades, Atelier Living has partnered with the world's most distinguished weaving mills..."
                        className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                      />
                    </div>

                    <ImageUploader
                      label="Hero Background / Banner Photography"
                      value={storySettingsForm.heroImage || ''}
                      onChange={(img) => setStorySettingsForm({ ...storySettingsForm, heroImage: img })}
                      aspectRatio="video"
                    />
                  </div>
                )}

                {/* Section 2: Founder Ethos */}
                {storyCmsSection === 'founder' && (
                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
                    <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                      <User className="w-4 h-4 text-[#C9A56A]" />
                      <span>Founder Ethos & Craft Philosophy</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Section Pill Badge
                        </label>
                        <input
                          type="text"
                          value={storySettingsForm.ethosBadge}
                          onChange={(e) =>
                            setStorySettingsForm({ ...storySettingsForm, ethosBadge: e.target.value })
                          }
                          placeholder="FOUNDER'S ETHOS"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Founder Name
                        </label>
                        <input
                          type="text"
                          value={storySettingsForm.ethosAuthor}
                          onChange={(e) =>
                            setStorySettingsForm({ ...storySettingsForm, ethosAuthor: e.target.value })
                          }
                          placeholder="Lady Vivienne Sterling"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-serif font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Founder Title / Role
                        </label>
                        <input
                          type="text"
                          value={storySettingsForm.ethosRole}
                          onChange={(e) =>
                            setStorySettingsForm({ ...storySettingsForm, ethosRole: e.target.value })
                          }
                          placeholder="Founder &amp; Principal Creative Director"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                        Founder Philosophical Quote *
                      </label>
                      <textarea
                        rows={2}
                        value={storySettingsForm.ethosQuote}
                        onChange={(e) =>
                          setStorySettingsForm({ ...storySettingsForm, ethosQuote: e.target.value })
                        }
                        placeholder="True luxury is not loud. It is the silent dialogue between raw organic fibers and architectural light."
                        className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none italic"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Ethos Paragraph 1
                        </label>
                        <textarea
                          rows={4}
                          value={storySettingsForm.ethosDescription1}
                          onChange={(e) =>
                            setStorySettingsForm({ ...storySettingsForm, ethosDescription1: e.target.value })
                          }
                          placeholder="Founded in 1989 in the heart of Mayfair, Atelier Living began with a singular vision..."
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Ethos Paragraph 2
                        </label>
                        <textarea
                          rows={4}
                          value={storySettingsForm.ethosDescription2}
                          onChange={(e) =>
                            setStorySettingsForm({ ...storySettingsForm, ethosDescription2: e.target.value })
                          }
                          placeholder="Over three decades, our collections have graced private embassies, Michelin-starred sanctuaries..."
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>

                    <ImageUploader
                      label="Founder Portrait / Atelier Studio Photography"
                      value={storySettingsForm.ethosImage}
                      onChange={(img) => setStorySettingsForm({ ...storySettingsForm, ethosImage: img })}
                      aspectRatio="video"
                    />
                  </div>
                )}

                {/* Section 3: Craft Pillars */}
                {storyCmsSection === 'pillars' && (
                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
                    <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                      <Award className="w-4 h-4 text-[#C9A56A]" />
                      <span>The 4 Craft Pillars</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Pillars Section Title
                        </label>
                        <input
                          type="text"
                          value={storySettingsForm.pillarsTitle}
                          onChange={(e) =>
                            setStorySettingsForm({ ...storySettingsForm, pillarsTitle: e.target.value })
                          }
                          placeholder="Our Four Guiding Pillars"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                          Pillars Subtitle
                        </label>
                        <input
                          type="text"
                          value={storySettingsForm.pillarsSubtitle}
                          onChange={(e) =>
                            setStorySettingsForm({ ...storySettingsForm, pillarsSubtitle: e.target.value })
                          }
                          placeholder="Uncompromising dedication to heritage standards"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {storySettingsForm.pillars.map((pillar, idx) => (
                        <div key={pillar.id || idx} className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#C9A56A]">Pillar {idx + 1}</span>
                            <span className="text-[10px] font-mono text-[#8C9A90]">Icon: {pillar.icon}</span>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">Title</label>
                            <input
                              type="text"
                              value={pillar.title}
                              onChange={(e) => {
                                const updated = [...storySettingsForm.pillars];
                                updated[idx] = { ...pillar, title: e.target.value };
                                setStorySettingsForm({ ...storySettingsForm, pillars: updated });
                              }}
                              className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-bold focus:border-[#C9A56A] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">Description</label>
                            <textarea
                              rows={3}
                              value={pillar.description}
                              onChange={(e) => {
                                const updated = [...storySettingsForm.pillars];
                                updated[idx] = { ...pillar, description: e.target.value };
                                setStorySettingsForm({ ...storySettingsForm, pillars: updated });
                              }}
                              className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 4: Heritage Milestones */}
                {storyCmsSection === 'timeline' && (
                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-[#C9A56A]" />
                        <span>Chronological Heritage Milestones</span>
                      </h4>

                      <button
                        type="button"
                        onClick={() => {
                          const newM: StoryMilestone = {
                            year: '2027',
                            title: 'New Chapter',
                            description: 'Expanding our atelier presence...',
                            location: 'Global'
                          };
                          setStorySettingsForm({
                            ...storySettingsForm,
                            milestones: [...storySettingsForm.milestones, newM]
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/40 text-xs font-bold hover:bg-[#C9A56A]/30 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Milestone</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {storySettingsForm.milestones.map((m, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={m.year}
                                onChange={(e) => {
                                  const updated = [...storySettingsForm.milestones];
                                  updated[idx] = { ...m, year: e.target.value };
                                  setStorySettingsForm({ ...storySettingsForm, milestones: updated });
                                }}
                                placeholder="1989"
                                className="w-20 p-2 rounded-lg bg-black/40 border border-white/15 text-xs text-[#C9A56A] font-serif font-bold text-center"
                              />
                              <input
                                type="text"
                                value={m.title}
                                onChange={(e) => {
                                  const updated = [...storySettingsForm.milestones];
                                  updated[idx] = { ...m, title: e.target.value };
                                  setStorySettingsForm({ ...storySettingsForm, milestones: updated });
                                }}
                                placeholder="Milestone Title"
                                className="w-64 p-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white font-bold"
                              />
                              <input
                                type="text"
                                value={m.location}
                                onChange={(e) => {
                                  const updated = [...storySettingsForm.milestones];
                                  updated[idx] = { ...m, location: e.target.value };
                                  setStorySettingsForm({ ...storySettingsForm, milestones: updated });
                                }}
                                placeholder="Location"
                                className="w-40 p-2 rounded-lg bg-black/40 border border-white/15 text-xs text-[#8C9A90]"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setStorySettingsForm({
                                  ...storySettingsForm,
                                  milestones: storySettingsForm.milestones.filter((_, i) => i !== idx)
                                });
                              }}
                              className="p-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900 cursor-pointer"
                              title="Delete Milestone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={m.description}
                            onChange={(e) => {
                              const updated = [...storySettingsForm.milestones];
                              updated[idx] = { ...m, description: e.target.value };
                              setStorySettingsForm({ ...storySettingsForm, milestones: updated });
                            }}
                            placeholder="Milestone narrative..."
                            className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#E9DFD1] focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 5: Atelier Workshop Gallery */}
                {storyCmsSection === 'gallery' && (
                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#C9A56A]" />
                        <span>Workshop & Loom Craft Gallery</span>
                      </h4>

                      <button
                        type="button"
                        onClick={() => {
                          const newG: StoryGalleryItem = {
                            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
                            caption: 'Master Craftsman at Work',
                            category: 'Atelier'
                          };
                          setStorySettingsForm({
                            ...storySettingsForm,
                            gallery: [...storySettingsForm.gallery, newG]
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/40 text-xs font-bold hover:bg-[#C9A56A]/30 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Gallery Photo</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {storySettingsForm.gallery.map((g, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-3">
                          <div className="h-40 rounded-lg overflow-hidden bg-black relative group">
                            <img src={g.image} alt={g.caption} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setStorySettingsForm({
                                  ...storySettingsForm,
                                  gallery: storySettingsForm.gallery.filter((_, i) => i !== idx)
                                });
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 text-red-200 border border-red-500/40 hover:bg-red-900 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <input
                              type="text"
                              value={g.caption}
                              onChange={(e) => {
                                const updated = [...storySettingsForm.gallery];
                                updated[idx] = { ...g, caption: e.target.value };
                                setStorySettingsForm({ ...storySettingsForm, gallery: updated });
                              }}
                              placeholder="Photo Caption"
                              className="p-2 rounded-lg bg-black/40 border border-white/10 text-white"
                            />
                            <input
                              type="text"
                              value={g.category}
                              onChange={(e) => {
                                const updated = [...storySettingsForm.gallery];
                                updated[idx] = { ...g, category: e.target.value };
                                setStorySettingsForm({ ...storySettingsForm, gallery: updated });
                              }}
                              placeholder="Category (e.g. Mill, Loom, Dyeing)"
                              className="p-2 rounded-lg bg-black/40 border border-white/10 text-[#C9A56A]"
                            />
                          </div>

                          <input
                            type="url"
                            value={g.image}
                            onChange={(e) => {
                              const updated = [...storySettingsForm.gallery];
                              updated[idx] = { ...g, image: e.target.value };
                              setStorySettingsForm({ ...storySettingsForm, gallery: updated });
                            }}
                            placeholder="Image URL"
                            className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-xs text-[#8C9A90] font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 6: Heritage Statistics */}
                {storyCmsSection === 'stats' && (
                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
                    <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                      <TrendingUp className="w-4 h-4 text-[#C9A56A]" />
                      <span>Heritage Numerical Statistics</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {storySettingsForm.stats.map((st, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-2 text-xs">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                              Value / Number *
                            </label>
                            <input
                              type="text"
                              value={st.value}
                              onChange={(e) => {
                                const updated = [...storySettingsForm.stats];
                                updated[idx] = { ...st, value: e.target.value };
                                setStorySettingsForm({ ...storySettingsForm, stats: updated });
                              }}
                              placeholder="38+"
                              className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono font-bold text-center text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                              Label / Metric *
                            </label>
                            <input
                              type="text"
                              value={st.label}
                              onChange={(e) => {
                                const updated = [...storySettingsForm.stats];
                                updated[idx] = { ...st, label: e.target.value };
                                setStorySettingsForm({ ...storySettingsForm, stats: updated });
                              }}
                              placeholder="Years of Craft"
                              className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                              Description Subtext
                            </label>
                            <input
                              type="text"
                              value={st.description}
                              onChange={(e) => {
                                const updated = [...storySettingsForm.stats];
                                updated[idx] = { ...st, description: e.target.value };
                                setStorySettingsForm({ ...storySettingsForm, stats: updated });
                              }}
                              placeholder="Continuous family stewardship"
                              className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-[#8C9A90] text-[11px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- SUBTAB 7: SOCIAL MEDIA CHANNELS --- */}
            {siteSettingsSubtab === 'socials' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-[#C9A56A]" />
                        <span>Social Media Channels (Contact Page & Footer)</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Enable or disable social media channels and customize direct links. Changes update both the Contact Page social card and the Footer icon bar instantly.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Instagram */}
                    <div className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
                            <InstagramIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">Instagram Profile</span>
                            <span className="text-[10px] text-[#8C9A90]">Photo archives & installations</span>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siteSettingsForm.socialLinks.instagram?.enabled ?? true}
                            onChange={(e) =>
                              setSiteSettingsForm({
                                ...siteSettingsForm,
                                socialLinks: {
                                  ...siteSettingsForm.socialLinks,
                                  instagram: {
                                    ...siteSettingsForm.socialLinks.instagram,
                                    enabled: e.target.checked
                                  }
                                }
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A56A]"></div>
                        </label>
                      </div>

                      <input
                        type="url"
                        value={siteSettingsForm.socialLinks.instagram?.url || ''}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            socialLinks: {
                              ...siteSettingsForm.socialLinks,
                              instagram: {
                                ...siteSettingsForm.socialLinks.instagram,
                                url: e.target.value
                              }
                            }
                          })
                        }
                        placeholder="https://instagram.com/atelierliving"
                        className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                    </div>

                    {/* Pinterest */}
                    <div className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                            <PinterestIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">Pinterest Moodboards</span>
                            <span className="text-[10px] text-[#8C9A90]">Textile palettes & lookbooks</span>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siteSettingsForm.socialLinks.pinterest?.enabled ?? true}
                            onChange={(e) =>
                              setSiteSettingsForm({
                                ...siteSettingsForm,
                                socialLinks: {
                                  ...siteSettingsForm.socialLinks,
                                  pinterest: {
                                    ...siteSettingsForm.socialLinks.pinterest,
                                    enabled: e.target.checked
                                  }
                                }
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A56A]"></div>
                        </label>
                      </div>

                      <input
                        type="url"
                        value={siteSettingsForm.socialLinks.pinterest?.url || ''}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            socialLinks: {
                              ...siteSettingsForm.socialLinks,
                              pinterest: {
                                ...siteSettingsForm.socialLinks.pinterest,
                                url: e.target.value
                              }
                            }
                          })
                        }
                        placeholder="https://pinterest.com/atelierliving"
                        className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-600/30 flex items-center justify-center">
                            <LinkedInIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">LinkedIn Company</span>
                            <span className="text-[10px] text-[#8C9A90]">Architect & designer network</span>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siteSettingsForm.socialLinks.linkedin?.enabled ?? true}
                            onChange={(e) =>
                              setSiteSettingsForm({
                                ...siteSettingsForm,
                                socialLinks: {
                                  ...siteSettingsForm.socialLinks,
                                  linkedin: {
                                    ...siteSettingsForm.socialLinks.linkedin,
                                    enabled: e.target.checked
                                  }
                                }
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A56A]"></div>
                        </label>
                      </div>

                      <input
                        type="url"
                        value={siteSettingsForm.socialLinks.linkedin?.url || ''}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            socialLinks: {
                              ...siteSettingsForm.socialLinks,
                              linkedin: {
                                ...siteSettingsForm.socialLinks.linkedin,
                                url: e.target.value
                              }
                            }
                          })
                        }
                        placeholder="https://linkedin.com/company/atelier-living"
                        className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                    </div>

                    {/* YouTube */}
                    <div className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 flex items-center justify-center">
                            <YouTubeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">YouTube Channel</span>
                            <span className="text-[10px] text-[#8C9A90]">Documentaries & weaving craft</span>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siteSettingsForm.socialLinks.youtube?.enabled ?? true}
                            onChange={(e) =>
                              setSiteSettingsForm({
                                ...siteSettingsForm,
                                socialLinks: {
                                  ...siteSettingsForm.socialLinks,
                                  youtube: {
                                    ...siteSettingsForm.socialLinks.youtube,
                                    enabled: e.target.checked
                                  }
                                }
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A56A]"></div>
                        </label>
                      </div>

                      <input
                        type="url"
                        value={siteSettingsForm.socialLinks.youtube?.url || ''}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            socialLinks: {
                              ...siteSettingsForm.socialLinks,
                              youtube: {
                                ...siteSettingsForm.socialLinks.youtube,
                                url: e.target.value
                              }
                            }
                          })
                        }
                        placeholder="https://youtube.com/@atelierliving"
                        className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                    </div>

                    {/* Facebook */}
                    <div className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                            <FacebookIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">Facebook Page</span>
                            <span className="text-[10px] text-[#8C9A90]">Global announcements</span>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siteSettingsForm.socialLinks.facebook?.enabled ?? true}
                            onChange={(e) =>
                              setSiteSettingsForm({
                                ...siteSettingsForm,
                                socialLinks: {
                                  ...siteSettingsForm.socialLinks,
                                  facebook: {
                                    ...siteSettingsForm.socialLinks.facebook,
                                    enabled: e.target.checked
                                  }
                                }
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A56A]"></div>
                        </label>
                      </div>

                      <input
                        type="url"
                        value={siteSettingsForm.socialLinks.facebook?.url || ''}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            socialLinks: {
                              ...siteSettingsForm.socialLinks,
                              facebook: {
                                ...siteSettingsForm.socialLinks.facebook,
                                url: e.target.value
                              }
                            }
                          })
                        }
                        placeholder="https://facebook.com/atelierliving"
                        className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                    </div>

                    {/* Twitter / X */}
                    <div className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gray-500/20 text-gray-300 border border-gray-500/30 flex items-center justify-center">
                            <TwitterIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">X / Twitter</span>
                            <span className="text-[10px] text-[#8C9A90]">Industry news & press</span>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siteSettingsForm.socialLinks.twitter?.enabled ?? false}
                            onChange={(e) =>
                              setSiteSettingsForm({
                                ...siteSettingsForm,
                                socialLinks: {
                                  ...siteSettingsForm.socialLinks,
                                  twitter: {
                                    ...siteSettingsForm.socialLinks.twitter,
                                    enabled: e.target.checked
                                  }
                                }
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A56A]"></div>
                        </label>
                      </div>

                      <input
                        type="url"
                        value={siteSettingsForm.socialLinks.twitter?.url || ''}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            socialLinks: {
                              ...siteSettingsForm.socialLinks,
                              twitter: {
                                ...siteSettingsForm.socialLinks.twitter,
                                url: e.target.value
                              }
                            }
                          })
                        }
                        placeholder="https://twitter.com/atelierliving"
                        className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="p-4 rounded-xl bg-[#0F1714]/60 border border-white/10 space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                            <WhatsAppIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">WhatsApp VIP Concierge</span>
                            <span className="text-[10px] text-[#8C9A90]">Direct instant chat for architects & clients</span>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siteSettingsForm.socialLinks.whatsapp?.enabled ?? true}
                            onChange={(e) =>
                              setSiteSettingsForm({
                                ...siteSettingsForm,
                                socialLinks: {
                                  ...siteSettingsForm.socialLinks,
                                  whatsapp: {
                                    ...siteSettingsForm.socialLinks.whatsapp,
                                    enabled: e.target.checked
                                  }
                                }
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A56A]"></div>
                        </label>
                      </div>

                      <input
                        type="url"
                        value={siteSettingsForm.socialLinks.whatsapp?.url || ''}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            socialLinks: {
                              ...siteSettingsForm.socialLinks,
                              whatsapp: {
                                ...siteSettingsForm.socialLinks.whatsapp,
                                url: e.target.value
                              }
                            }
                          })
                        }
                        placeholder="https://wa.me/447911123456"
                        className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* --- FLOATING WHATSAPP CONCIERGE BUTTON SETTINGS --- */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
                        <span>Global Floating WhatsApp Concierge Button</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90]">
                        Control the sticky floating WhatsApp button across all website pages. Configure screen positioning (Bottom-Right or Bottom-Left), direct contact phone number, and default opening greeting message.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#8C9A90] font-semibold">
                        {siteSettingsForm.whatsappFloatingEnabled !== false ? 'Widget Active' : 'Widget Disabled'}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={siteSettingsForm.whatsappFloatingEnabled !== false}
                          onChange={(e) =>
                            setSiteSettingsForm({
                              ...siteSettingsForm,
                              whatsappFloatingEnabled: e.target.checked
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Position Selector */}
                    <div className="space-y-3">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Screen Float Position
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSiteSettingsForm({
                              ...siteSettingsForm,
                              whatsappFloatingPosition: 'bottom-right'
                            })
                          }
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            (siteSettingsForm.whatsappFloatingPosition || 'bottom-right') === 'bottom-right'
                              ? 'bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold border-[#E9DFD1]/60 shadow-lg'
                              : 'bg-[#0F1714]/60 border-white/10 text-[#8C9A90] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold block">Bottom-Right</span>
                            <span className="text-[10px] font-mono">Standard</span>
                          </div>
                          <span className="text-[10px] opacity-80 block">
                            Floating on bottom-right corner. ScrollToTop neatly stacks above it.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSiteSettingsForm({
                              ...siteSettingsForm,
                              whatsappFloatingPosition: 'bottom-left'
                            })
                          }
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            siteSettingsForm.whatsappFloatingPosition === 'bottom-left'
                              ? 'bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold border-[#E9DFD1]/60 shadow-lg'
                              : 'bg-[#0F1714]/60 border-white/10 text-[#8C9A90] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold block">Bottom-Left</span>
                            <span className="text-[10px] font-mono">Alternate</span>
                          </div>
                          <span className="text-[10px] opacity-80 block">
                            Floating on bottom-left corner opposite to ScrollToTop button.
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Dedicated WhatsApp Phone Number */}
                    <div className="space-y-3">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        WhatsApp Contact Number (With Country Code)
                      </label>
                      <input
                        type="text"
                        value={siteSettingsForm.whatsappFloatingNumber ?? siteSettingsForm.whatsappNumber}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            whatsappFloatingNumber: e.target.value
                          })
                        }
                        placeholder="+44 7911 123456"
                        className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-[#8C9A90] block">
                        Clients will be directed to <code className="text-emerald-400">https://wa.me/&lt;number&gt;</code> on click.
                      </span>
                    </div>

                    {/* Default Chat Greeting Message */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Pre-filled WhatsApp Greeting Inquiry Text
                      </label>
                      <input
                        type="text"
                        value={siteSettingsForm.whatsappFloatingMessage || ''}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            whatsappFloatingMessage: e.target.value
                          })
                        }
                        placeholder="Hello Atelier Living Concierge, I would like to inquire about bespoke furnishings."
                        className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                      <span className="text-[10px] text-[#8C9A90] block">
                        Automatically populated in WhatsApp chat box when client clicks the floating button.
                      </span>
                    </div>

                    {/* Tooltip Badge Text */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-xs uppercase font-bold text-[#C9A56A] block">
                        Hover Tooltip / Badge Title
                      </label>
                      <input
                        type="text"
                        value={siteSettingsForm.whatsappFloatingTooltip || ''}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            whatsappFloatingTooltip: e.target.value
                          })
                        }
                        placeholder="Chat with Concierge"
                        className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SUBTAB 8: SHOWROOM LOCATIONS, CONTACT COORDINATES & OPERATING TIMETABLE --- */}
            {siteSettingsSubtab === 'contact' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Metric Summary Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] text-[#C9A56A] uppercase tracking-wider font-semibold block">
                      Active Showrooms
                    </span>
                    <span className="font-serif text-2xl font-bold text-white">{showroomsList.length} Hubs</span>
                    <span className="text-[10px] text-[#8C9A90] block">Global Atelier Footprint</span>
                  </div>

                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] text-[#C9A56A] uppercase tracking-wider font-semibold block">
                      Flagship Ateliers
                    </span>
                    <span className="font-serif text-2xl font-bold text-emerald-400">
                      {showroomsList.filter((s) => s.isFlagship).length || 1} Flagships
                    </span>
                    <span className="text-[10px] text-[#8C9A90] block">Premier Showcase Locations</span>
                  </div>

                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] text-[#C9A56A] uppercase tracking-wider font-semibold block">
                      Direct Mobile
                    </span>
                    <span className="font-mono text-sm font-bold text-[#E9DFD1] truncate block">
                      {siteSettingsForm.mobileNumber || '+44 7911 123456'}
                    </span>
                    <span className="text-[10px] text-[#8C9A90] block">WhatsApp / Concierge</span>
                  </div>

                  <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] text-[#C9A56A] uppercase tracking-wider font-semibold block">
                      Store Hours (Mon-Fri)
                    </span>
                    <span className="font-mono text-sm font-bold text-[#C9A56A] truncate block">
                      {siteSettingsForm.scheduleMonFri || '09:30 - 18:30'}
                    </span>
                    <span className="text-[10px] text-[#8C9A90] block">Public Atelier Schedule</span>
                  </div>
                </div>

                {/* SECTION 1: GLOBAL SHOWROOM LOCATIONS */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-[#C9A56A]" />
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                          Global Showroom Locations ({showroomsList.length})
                        </h3>
                      </div>
                      <p className="text-xs text-[#8C9A90] mt-1">
                        Manage multiple international showrooms/ateliers. Publicly displayed on Contact page showroom switcher and site footer.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddLocation}
                      className="px-4 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:bg-[#E6C894] transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Showroom Location</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {showroomsList.map((shw) => (
                      <div
                        key={shw.id}
                        className="bg-[#0F1714]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-[#C9A56A]/50 transition-all group"
                      >
                        <div>
                          {/* Image header */}
                          <div className="relative h-44 overflow-hidden bg-black/40">
                            <img
                              src={shw.image}
                              alt={shw.city}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3.5">
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#0F1714]/80 backdrop-blur-md text-[10px] font-mono font-bold text-[#C9A56A] border border-[#C9A56A]/30 uppercase">
                                  {shw.id}
                                </span>
                                {shw.isFlagship && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#C9A56A] text-[#0F1714] text-[10px] font-bold uppercase tracking-widest shadow-md">
                                    Flagship
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A56A]">
                                  {shw.country}
                                </span>
                                <h4 className="font-serif text-xl font-bold text-white">{shw.city} Showroom</h4>
                              </div>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="p-4 space-y-2.5 text-xs text-[#E9DFD1]">
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 text-[#C9A56A] shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{shw.address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-[#C9A56A] shrink-0" />
                              <span className="font-mono">{shw.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-[#C9A56A] shrink-0" />
                              <span className="truncate">{shw.email}</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Clock className="w-4 h-4 text-[#C9A56A] shrink-0 mt-0.5" />
                              <span className="text-[11px] text-[#8C9A90]">{shw.hours}</span>
                            </div>
                            {shw.notes && (
                              <div className="p-2 rounded-lg bg-white/5 text-[11px] text-[#C9A56A] italic border border-white/5">
                                "{shw.notes}"
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-3.5 pt-0 border-t border-white/10 bg-[#0F1714]/30 flex items-center justify-between gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditLocation(shw)}
                            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C9A56A] hover:text-white border border-[#C9A56A]/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Location</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteLocation(shw)}
                            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 transition-all cursor-pointer"
                            title="Delete Showroom Location"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 2: GLOBAL CONTACT NUMBERS, EMAILS & STORE OPERATING SCHEDULE */}
                <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[#C9A56A]" />
                        <span>Global Contact Numbers, Emails & Store Schedule</span>
                      </h3>
                      <p className="text-xs text-[#8C9A90] mt-1">
                        Configure official contact details, telephony, departmental routing inboxes, and operating hours. Synchronized in real time across the Contact page and Footer.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-[#C9A56A] bg-[#C9A56A]/10 px-3 py-1 rounded-full border border-[#C9A56A]/20 self-start sm:self-auto">
                      Live Synced
                    </span>
                  </div>

                  <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                    {/* 1. Phones */}
                    <div className="space-y-3">
                      <h4 className="font-serif text-base text-[#C9A56A] font-bold flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <span>1. Telephony, Mobile Hotline & WhatsApp Channels</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            Primary Landline / Switchboard
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.primaryPhone}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, primaryPhone: e.target.value })
                            }
                            placeholder="+44 (0)20 7946 0188"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            Direct Mobile Hotline *
                          </label>
                          <input
                            type="text"
                            required
                            value={siteSettingsForm.mobileNumber}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, mobileNumber: e.target.value })
                            }
                            placeholder="+44 7911 123456"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            WhatsApp Concierge Number
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.whatsappNumber}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, whatsappNumber: e.target.value })
                            }
                            placeholder="+44 7911 123456"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Departmental Emails */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h4 className="font-serif text-base text-[#C9A56A] font-bold flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>2. Departmental Email Addresses</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            General Inquiries Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={siteSettingsForm.generalEmail}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, generalEmail: e.target.value })
                            }
                            placeholder="concierge@atelier-living.com"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            VIP Client Services Email
                          </label>
                          <input
                            type="email"
                            value={siteSettingsForm.vipEmail}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, vipEmail: e.target.value })
                            }
                            placeholder="vip@atelier-living.com"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            Press & Media Email
                          </label>
                          <input
                            type="email"
                            value={siteSettingsForm.pressEmail}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, pressEmail: e.target.value })
                            }
                            placeholder="press@atelier-living.com"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            Trade & Architecture Email
                          </label>
                          <input
                            type="email"
                            value={siteSettingsForm.tradeEmail}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, tradeEmail: e.target.value })
                            }
                            placeholder="trade@atelier-living.com"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Flagship Address */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h4 className="font-serif text-base text-[#C9A56A] font-bold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>3. Flagship Head Atelier Address</span>
                      </h4>
                      <div>
                        <input
                          type="text"
                          value={siteSettingsForm.flagshipAddress}
                          onChange={(e) =>
                            setSiteSettingsForm({ ...siteSettingsForm, flagshipAddress: e.target.value })
                          }
                          placeholder="48 Berkeley Square, Mayfair, London W1J 5AW"
                          className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 4. Store Operating Schedule */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h4 className="font-serif text-base text-[#C9A56A] font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>4. Store Open / Close Timetable & Operating Schedule</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            Monday – Friday Schedule *
                          </label>
                          <input
                            type="text"
                            required
                            value={siteSettingsForm.scheduleMonFri}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, scheduleMonFri: e.target.value })
                            }
                            placeholder="09:30 - 18:30"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            Saturday Schedule *
                          </label>
                          <input
                            type="text"
                            required
                            value={siteSettingsForm.scheduleSat}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, scheduleSat: e.target.value })
                            }
                            placeholder="10:00 - 17:00"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            Sunday Schedule *
                          </label>
                          <input
                            type="text"
                            required
                            value={siteSettingsForm.scheduleSun}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, scheduleSun: e.target.value })
                            }
                            placeholder="By Private Appointment Only"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            Bank Holidays & Special Closures
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.scheduleHolidays}
                            onChange={(e) =>
                              setSiteSettingsForm({ ...siteSettingsForm, scheduleHolidays: e.target.value })
                            }
                            placeholder="Closed on UK & EU Bank Holidays"
                            className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Save Button */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs text-[#8C9A90]">
                        All contact details sync across the live Contact page, showroom inquiry portal, and site footer.
                      </p>
                      <button
                        type="submit"
                        disabled={isSavingSiteSettings}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A56A] via-[#E6C894] to-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center space-x-2 shadow-xl disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingSiteSettings ? 'Saving Settings...' : 'Save & Sync Contact Settings'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- ADD / EDIT TESTIMONIAL MODAL --- */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {editingTestimonialId ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
                </h3>
                <p className="text-xs text-[#E9DFD1]">
                  Review will display on the landing page testimonial section and client showcases.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTestimonialModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.clientName}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                    placeholder="e.g. Lady Vivienne Sterling"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.clientRole}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, clientRole: e.target.value })}
                    placeholder="e.g. Principal Architect, Private Client"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.location}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                    placeholder="e.g. Mayfair, London"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Commission / Project Name
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.projectOrProduct || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, projectOrProduct: e.target.value })}
                    placeholder="e.g. The Belgravia Penthouse"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Star Rating (1 - 5 Stars) *
                </label>
                <div className="flex items-center space-x-2 p-2 rounded-xl bg-[#0F1714]/60 border border-white/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= (testimonialForm.rating || 5)
                            ? 'text-[#C9A56A] fill-[#C9A56A]'
                            : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-[#C9A56A] ml-2">
                    {testimonialForm.rating || 5} Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Testimonial Quote Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={testimonialForm.quote}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                  placeholder="The silk velvet drapes and acoustic sheers brought an undeniable timeless elegance to our drawing room..."
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                />
              </div>

              <ImageUploader
                label="Client Avatar / Photo (Optional)"
                helpText="Square portrait photo (JPG, PNG, WEBP). If left blank, elegant monogram letters will be generated automatically."
                value={testimonialForm.avatar || ''}
                onChange={(img) => setTestimonialForm({ ...testimonialForm, avatar: img })}
                aspectRatio="square"
              />

              <div className="p-3.5 rounded-xl bg-[#0F1714]/50 border border-white/10 space-y-2.5">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testimonialForm.isFeatured ?? true}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, isFeatured: e.target.checked })}
                    className="rounded border-white/20 text-[#C9A56A] focus:ring-[#C9A56A]"
                  />
                  <div>
                    <span className="font-semibold text-white block">Featured Review</span>
                    <span className="text-[10px] text-[#8C9A90]">Prioritizes this review at the front of the carousel</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testimonialForm.isVisible ?? true}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, isVisible: e.target.checked })}
                    className="rounded border-white/20 text-[#C9A56A] focus:ring-[#C9A56A]"
                  />
                  <div>
                    <span className="font-semibold text-white block">Visible on Website</span>
                    <span className="text-[10px] text-[#8C9A90]">Uncheck to hide review without deleting it</span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg"
                >
                  {editingTestimonialId ? 'Update Review' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT BRAND PARTNER MODAL --- */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {editingBrandId ? 'Edit Brand Partner' : 'Add Brand Partner'}
                </h3>
                <p className="text-xs text-[#E9DFD1]">
                  Partner will appear in the scrolling marquee ticker and the dedicated Brands page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBrandModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Brand / Mill Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    placeholder="e.g. Tessitura D'Oro"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Marquee Logo Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.logoText}
                    onChange={(e) => setBrandForm({ ...brandForm, logoText: e.target.value })}
                    placeholder="e.g. TESSITURA D'ORO COMO"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Country of Origin *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.country}
                    onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                    placeholder="e.g. Italy, Belgium, France"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Established Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.established}
                    onChange={(e) => setBrandForm({ ...brandForm, established: e.target.value })}
                    placeholder="e.g. 1892"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Craft Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.specialty}
                    onChange={(e) => setBrandForm({ ...brandForm, specialty: e.target.value })}
                    placeholder="e.g. Como Silk Damask"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  value={brandForm.tagline}
                  onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                  placeholder="e.g. Master Silk Weavers of Lake Como Since 1892"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Brand Heritage Description
                </label>
                <textarea
                  rows={3}
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  placeholder="Nestled in the historic textile quarter along Lake Como, Tessitura D'Oro combines ancestral jacquard loom craft..."
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Official Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={brandForm.websiteUrl || ''}
                  onChange={(e) => setBrandForm({ ...brandForm, websiteUrl: e.target.value })}
                  placeholder="https://tessituradoro.it"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                />
              </div>

              <ImageUploader
                label="Brand Showcase Photography *"
                helpText="Upload mill weaving workshop, loom, or textile archive photography (JPG, PNG, WEBP)"
                value={brandForm.image}
                onChange={(img) => setBrandForm({ ...brandForm, image: img })}
                aspectRatio="video"
                presetSuggestions={[
                  { label: 'Como Silk Loom', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80' },
                  { label: 'Belgian Linen Flax', url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80' },
                  { label: 'Florentine Velvet', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
                  { label: 'Alpaca Weavery', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80' }
                ]}
                required
              />

              <div className="p-3.5 rounded-xl bg-[#0F1714]/50 border border-white/10">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={brandForm.isVisible ?? true}
                    onChange={(e) => setBrandForm({ ...brandForm, isVisible: e.target.checked })}
                    className="rounded border-white/20 text-[#C9A56A] focus:ring-[#C9A56A]"
                  />
                  <div>
                    <span className="font-semibold text-white block">Active in Marquee Ticker &amp; Brands Page</span>
                    <span className="text-[10px] text-[#8C9A90]">Uncheck to hide brand without removing historical archives</span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg"
                >
                  {editingBrandId ? 'Update Brand' : 'Add Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT HEADER MENU LINK MODAL --- */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {editingLinkId ? 'Edit Header Menu Link' : 'Add Header Navigation Link'}
                </h3>
                <p className="text-xs text-[#E9DFD1]">
                  Configure navigation label, destination tab or URL, and special features.
                </p>
              </div>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Menu Label / Title *
                </label>
                <input
                  type="text"
                  required
                  value={linkForm.label}
                  onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                  placeholder="e.g. Product Catalogue, Private Projects, Lookbook"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Destination Tab or URL Route *
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    { id: 'home', label: 'Home Page' },
                    { id: 'story', label: 'Our Story' },
                    { id: 'catalogue', label: 'Product Catalogue' },
                    { id: 'projects', label: 'Our Projects' },
                    { id: 'brands', label: 'Brands With Us' },
                    { id: 'contact', label: 'Contact Us' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setLinkForm({ ...linkForm, target: preset.id })}
                      className={`p-2 rounded-lg text-left text-[11px] border transition-all cursor-pointer ${
                        linkForm.target === preset.id
                          ? 'bg-[#C9A56A] text-[#0F1714] font-bold border-[#C9A56A]'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={linkForm.target}
                  onChange={(e) => setLinkForm({ ...linkForm, target: e.target.value })}
                  placeholder="e.g. home, story, catalogue, projects, or https://..."
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F1714]/50 border border-white/10 space-y-3">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.hasMegaMenu}
                    onChange={(e) => setLinkForm({ ...linkForm, hasMegaMenu: e.target.checked })}
                    className="rounded border-white/20 text-[#C9A56A] focus:ring-[#C9A56A]"
                  />
                  <div>
                    <span className="font-semibold text-white block">Attach MegaMenu Dropdown</span>
                    <span className="text-[10px] text-[#8C9A90]">Displays the 8-category archives panel on hover</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.isExternal}
                    onChange={(e) => setLinkForm({ ...linkForm, isExternal: e.target.checked })}
                    className="rounded border-white/20 text-[#C9A56A] focus:ring-[#C9A56A]"
                  />
                  <div>
                    <span className="font-semibold text-white block">External Link Target</span>
                    <span className="text-[10px] text-[#8C9A90]">Opens destination in a new browser tab</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.isVisible}
                    onChange={(e) => setLinkForm({ ...linkForm, isVisible: e.target.checked })}
                    className="rounded border-white/20 text-[#C9A56A] focus:ring-[#C9A56A]"
                  />
                  <div>
                    <span className="font-semibold text-white block">Visible in Website Header</span>
                    <span className="text-[10px] text-[#8C9A90]">Uncheck to hide link without deleting it</span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold uppercase tracking-wider hover:bg-[#E6C894] transition-all cursor-pointer shadow-lg"
                >
                  {editingLinkId ? 'Update Link' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT HERO SHOWCASE SLIDE MODAL --- */}
      {showHeroSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 text-white shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#C9A56A]" />
                  <span>{editingHeroSlideId ? 'Edit Hero Showcase Scene' : 'Add New Hero Showcase Scene'}</span>
                </h3>
                <p className="text-xs text-[#E9DFD1]">
                  Configure slide background photo, mill location, architecture tagline, and pinpointed material hotspots.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHeroSlideModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeroSlide} className="space-y-6 text-xs">
              {/* Basic Scene Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Scene Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroSlideForm.title}
                    onChange={(e) => setHeroSlideForm({ ...heroSlideForm, title: e.target.value })}
                    placeholder="e.g. Belgravia Grand Salon"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Location Badge *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroSlideForm.location}
                    onChange={(e) => setHeroSlideForm({ ...heroSlideForm, location: e.target.value })}
                    placeholder="e.g. London, UK"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Scene Description / Architecture Tagline *
                </label>
                <textarea
                  rows={2}
                  required
                  value={heroSlideForm.tagline}
                  onChange={(e) => setHeroSlideForm({ ...heroSlideForm, tagline: e.target.value })}
                  placeholder="e.g. Floor-to-ceiling acoustic linen drapes paired with hand-knotted silk rugs."
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Background Image */}
              <div className="space-y-3">
                <ImageUploader
                  label="Showcase High-Resolution Scene Image *"
                  helpText="Upload a luxury wide architectural interior photograph (1800x900 recommended)"
                  value={heroSlideForm.image}
                  onChange={(img) => setHeroSlideForm({ ...heroSlideForm, image: img })}
                  aspectRatio="video"
                  presetSuggestions={[
                    {
                      label: 'Belgravia Salon',
                      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85'
                    },
                    {
                      label: 'Como Villa',
                      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85'
                    },
                    {
                      label: 'Mayfair Penthouse',
                      url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=85'
                    },
                    {
                      label: 'Kensington Drawing Room',
                      url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85'
                    }
                  ]}
                  required
                />
              </div>

              {/* --- INTERACTIVE HOTSPOTS PINPOINT MANAGER --- */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-base text-[#C9A56A] font-bold flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>Interactive Material Hotspot Pinpoints ({heroSlideForm.hotspots.length})</span>
                    </h4>
                    <p className="text-[11px] text-[#8C9A90]">
                      Click on the preview image below to position the selected pin, or manually edit X% and Y% coordinates.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddHotspotToSlide}
                    className="px-3.5 py-2 rounded-xl bg-[#C9A56A]/20 text-[#C9A56A] hover:bg-[#C9A56A]/30 border border-[#C9A56A]/40 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Hotspot Pin</span>
                  </button>
                </div>

                {/* Interactive Visual Coordinate Picker Box */}
                {heroSlideForm.image && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#8C9A90]">
                      <span>Click image to position selected pin:</span>
                      {selectedHotspotIdx !== null && heroSlideForm.hotspots[selectedHotspotIdx] && (
                        <span className="text-[#C9A56A] font-mono font-bold">
                          Selected Pin #{selectedHotspotIdx + 1}: ({heroSlideForm.hotspots[selectedHotspotIdx].x}%, {heroSlideForm.hotspots[selectedHotspotIdx].y}%)
                        </span>
                      )}
                    </div>

                    <div
                      onClick={(e) => {
                        if (selectedHotspotIdx === null || !heroSlideForm.hotspots[selectedHotspotIdx]) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                        handleUpdateHotspotInSlide(selectedHotspotIdx, 'x', Math.max(0, Math.min(100, x)));
                        handleUpdateHotspotInSlide(selectedHotspotIdx, 'y', Math.max(0, Math.min(100, y)));
                      }}
                      className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-black border border-[#C9A56A]/40 cursor-crosshair shadow-inner select-none"
                    >
                      <img
                        src={heroSlideForm.image}
                        alt="Pin Placement Preview"
                        className="w-full h-full object-cover filter brightness-90 pointer-events-none"
                      />

                      {/* Overlaid Pinpoints */}
                      {heroSlideForm.hotspots.map((spot, idx) => {
                        const isSelected = selectedHotspotIdx === idx;
                        return (
                          <div
                            key={spot.id || idx}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setSelectedHotspotIdx(idx);
                            }}
                            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-all ${
                              isSelected ? 'scale-125' : 'hover:scale-110'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold font-mono text-[10px] shadow-2xl ${
                                isSelected
                                  ? 'bg-[#C9A56A] text-[#0F1714] border-white ring-4 ring-[#C9A56A]/40'
                                  : 'bg-[#0F1714]/80 text-[#C9A56A] border-[#C9A56A]'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Hotspot Form Items */}
                <div className="space-y-3">
                  {heroSlideForm.hotspots.map((spot, idx) => {
                    const isSelected = selectedHotspotIdx === idx;
                    return (
                      <div
                        key={spot.id || idx}
                        onClick={() => setSelectedHotspotIdx(idx)}
                        className={`p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-[#0F1714]/90 border-[#C9A56A] shadow-md ring-1 ring-[#C9A56A]/30'
                            : 'bg-[#0F1714]/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-[#C9A56A] text-[#0F1714] font-mono font-bold text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-serif font-bold text-white text-xs">
                              Hotspot Specification #{idx + 1}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#C9A56A]/20 text-[#C9A56A] font-bold">
                                Selected For Positioning
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              handleRemoveHotspotFromSlide(idx);
                            }}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                            title="Remove Hotspot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                              Material / Product Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={spot.label}
                              onChange={(e) => handleUpdateHotspotInSlide(idx, 'label', e.target.value)}
                              placeholder="e.g. Acoustic Sheer Drapes"
                              className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-white focus:border-[#C9A56A] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                              Mill Origin *
                            </label>
                            <input
                              type="text"
                              required
                              value={spot.origin}
                              onChange={(e) => handleUpdateHotspotInSlide(idx, 'origin', e.target.value)}
                              placeholder="e.g. Kortrijk, Belgium"
                              className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-[#C9A56A] focus:border-[#C9A56A] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                            Specification Detail & Durability *
                          </label>
                          <input
                            type="text"
                            required
                            value={spot.detail}
                            onChange={(e) => handleUpdateHotspotInSlide(idx, 'detail', e.target.value)}
                            placeholder="e.g. Fluid Belgian flax with 82% ambient sound attenuation."
                            className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-white focus:border-[#C9A56A] focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                              X Coordinate (Horizontal: 0-100%)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={spot.x}
                              onChange={(e) => handleUpdateHotspotInSlide(idx, 'x', Number(e.target.value))}
                              className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                              Y Coordinate (Vertical: 0-100%)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={spot.y}
                              onChange={(e) => handleUpdateHotspotInSlide(idx, 'y', Number(e.target.value))}
                              className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visibility Toggle & Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heroSlideForm.isVisible !== false}
                    onChange={(e) => setHeroSlideForm({ ...heroSlideForm, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C9A56A] focus:ring-[#C9A56A] bg-[#0F1714] border-white/20 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-white block">Active in Homepage Hero Carousel</span>
                    <span className="text-[10px] text-[#8C9A90]">Uncheck to hide without deleting</span>
                  </div>
                </label>

                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowHeroSlideModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg"
                  >
                    {editingHeroSlideId ? 'Update Hero Scene' : 'Publish Hero Scene'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT LOCATION MODAL --- */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {editingLocationId ? 'Edit Showroom Location' : 'Add New Showroom Location'}
                </h3>
                <p className="text-xs text-[#E9DFD1]">
                  Location will appear dynamically in the public Contact showroom switcher and directory.
                </p>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    City / Atelier Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    placeholder="e.g. Tokyo Ginza"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={locationForm.country}
                    onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                    placeholder="e.g. Japan"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                  placeholder="e.g. 6-10-1 Ginza, Chuo-ku, Tokyo 104-0061"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Direct Phone *</label>
                  <input
                    type="text"
                    required
                    value={locationForm.phone}
                    onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
                    placeholder="+81 3 5555 0199"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Direct Email *</label>
                  <input
                    type="email"
                    required
                    value={locationForm.email}
                    onChange={(e) => setLocationForm({ ...locationForm, email: e.target.value })}
                    placeholder="ginza@atelier-living.com"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Operating Hours / Timetable *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.hours}
                  onChange={(e) => setLocationForm({ ...locationForm, hours: e.target.value })}
                  placeholder="Mon - Sat: 10:00 - 19:00 | Sun: By Private Appointment"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Showroom Atelier Photography *"
                helpText="Upload storefront facade, private salon, or architectural interior photo (JPG, PNG, WEBP)"
                value={locationForm.image}
                onChange={(img) => setLocationForm({ ...locationForm, image: img })}
                aspectRatio="video"
                presetSuggestions={[
                  { label: 'Mayfair Townhouse', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85' },
                  { label: 'Parisian Haussmann', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85' },
                  { label: 'Milanese Palazzo', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85' },
                  { label: 'Madison Gallery', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=85' }
                ]}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={locationForm.lat}
                    onChange={(e) => setLocationForm({ ...locationForm, lat: parseFloat(e.target.value) || 0 })}
                    placeholder="35.6719"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={locationForm.lng}
                    onChange={(e) => setLocationForm({ ...locationForm, lng: parseFloat(e.target.value) || 0 })}
                    placeholder="139.765"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="flagshipCheckbox"
                  checked={locationForm.isFlagship}
                  onChange={(e) => setLocationForm({ ...locationForm, isFlagship: e.target.checked })}
                  className="w-4 h-4 rounded text-[#C9A56A] focus:ring-[#C9A56A] bg-[#0F1714] border-white/20 cursor-pointer"
                />
                <label htmlFor="flagshipCheckbox" className="text-xs text-white font-medium cursor-pointer">
                  Mark as Primary Flagship Atelier
                </label>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Internal Notes / Highlights
                </label>
                <input
                  type="text"
                  value={locationForm.notes}
                  onChange={(e) => setLocationForm({ ...locationForm, notes: e.target.value })}
                  placeholder="e.g. Dedicated private VIP salon with material library"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all shadow-lg cursor-pointer"
                >
                  {editingLocationId ? 'Update Showroom Location' : 'Save Showroom Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-white shadow-2xl">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Add New Product to Catalog</h3>
              <p className="text-xs text-[#E9DFD1]">
                New products are written directly to your live Supabase `products` catalog table.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="e.g. Florentine Jacquard Damask"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Category</label>
                  <select
                    value={newProductForm.categorySlug}
                    onChange={(e) => setNewProductForm({ ...newProductForm, categorySlug: e.target.value as CategorySlug })}
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none cursor-pointer"
                  >
                    {Object.values(CATEGORIES_DATA).map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#163129]">
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Price Tier</label>
                  <select
                    value={newProductForm.priceCategory}
                    onChange={(e) => setNewProductForm({ ...newProductForm, priceCategory: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none cursor-pointer"
                  >
                    <option value="Bespoke" className="bg-[#163129]">Bespoke</option>
                    <option value="Haute Couture" className="bg-[#163129]">Haute Couture</option>
                    <option value="Atelier Reserve" className="bg-[#163129]">Atelier Reserve</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Material Composition</label>
                <input
                  type="text"
                  required
                  value={newProductForm.materialComposition}
                  onChange={(e) => setNewProductForm({ ...newProductForm, materialComposition: e.target.value })}
                  placeholder="e.g. 70% Silk, 30% Egyptian Cotton"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Origin</label>
                  <input
                    type="text"
                    value={newProductForm.origin}
                    onChange={(e) => setNewProductForm({ ...newProductForm, origin: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Dimensions / Width</label>
                  <input
                    type="text"
                    value={newProductForm.widthOrDimensions}
                    onChange={(e) => setNewProductForm({ ...newProductForm, widthOrDimensions: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <ImageUploader
                label="Product Photography / Material Image *"
                helpText="Upload luxury textile swatch or furniture photography (JPG, PNG, WEBP)"
                value={newProductForm.image}
                onChange={(img) => setNewProductForm({ ...newProductForm, image: img })}
                aspectRatio="video"
                presetSuggestions={[
                  { label: 'Raw Silk Jacquard', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1200' },
                  { label: 'Florentine Velvet', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200' },
                  { label: 'Sculpted Bouclé', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200' },
                  { label: 'Cashmere Throw', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=1200' }
                ]}
                required
              />

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
                  className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all shadow-lg cursor-pointer"
                >
                  Save Product to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD SUBSCRIBER MODAL --- */}
      {showAddSubscriberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-white shadow-2xl">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Add Newsletter Subscriber</h3>
              <p className="text-xs text-[#E9DFD1]">
                Manually add a VIP client or trade email to the Atelier Gazette distribution list.
              </p>
            </div>

            <form onSubmit={handleCreateSubscriber} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Subscriber Email</label>
                <input
                  type="email"
                  required
                  value={newSubscriberEmail}
                  onChange={(e) => setNewSubscriberEmail(e.target.value)}
                  placeholder="e.g. client@mayfair-estates.co.uk"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Acquisition Source</label>
                <input
                  type="text"
                  value={newSubscriberSource}
                  onChange={(e) => setNewSubscriberSource(e.target.value)}
                  placeholder="e.g. Master Admin, Showroom Invitation, Trade Event"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddSubscriberModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all shadow-lg cursor-pointer"
                >
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT PROJECT MODAL --- */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {editingProjectId ? 'Edit Project Commission' : 'Add New Project Commission'}
                </h3>
                <p className="text-xs text-[#E9DFD1]">
                  Commission will appear live on the public Residence & Yacht Portfolio and featured showcases.
                </p>
              </div>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. The Belgravia Townhouse"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Project Category *
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none cursor-pointer"
                  >
                    <option value="Private Residence" className="bg-[#163129]">Private Residence</option>
                    <option value="Coastal Estate" className="bg-[#163129]">Coastal Estate</option>
                    <option value="Penthouse Sanctuary" className="bg-[#163129]">Penthouse Sanctuary</option>
                    <option value="Bespoke Yacht" className="bg-[#163129]">Bespoke Yacht</option>
                    <option value="Historic Restoration" className="bg-[#163129]">Historic Restoration</option>
                    <option value="Luxury Villa" className="bg-[#163129]">Luxury Villa</option>
                    <option value="Hospitality & Hotel" className="bg-[#163129]">Hospitality & Hotel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="e.g. Belgravia, London"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Completion Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    placeholder="e.g. 2026"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Interior Designer / Studio *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.designer}
                    onChange={(e) => setProjectForm({ ...projectForm, designer: e.target.value })}
                    placeholder="e.g. Studio Harrison & Co."
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Architectural Narrative & Scope *
                </label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Describe the architectural concept, tactile drape installations, upholstery, and custom rugs specified..."
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              {/* Hero Image Uploader */}
              <ImageUploader
                label="Primary Hero Project Photography *"
                helpText="Upload luxury architectural photoshoot image (JPG, PNG, WEBP)"
                value={projectForm.heroImage}
                onChange={(img) => setProjectForm({ ...projectForm, heroImage: img })}
                aspectRatio="video"
                presetSuggestions={[
                  { label: 'Belgravia Townhouse', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85' },
                  { label: 'French Riviera Villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85' },
                  { label: 'Tribeca Penthouse', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85' },
                  { label: 'Monaco Superyacht', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=85' },
                  { label: 'Milanese Palazzo', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85' }
                ]}
                required
              />

              {/* Multi-Image Gallery Manager */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block">
                  Gallery Photos ({projectForm.gallery.length} Images)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Paste additional gallery image URL (https://...)"
                    className="w-full p-2.5 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#C9A56A] hover:text-[#0F1714] text-xs font-bold uppercase transition-all shrink-0 cursor-pointer"
                  >
                    Add Image
                  </button>
                </div>

                {projectForm.gallery.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {projectForm.gallery.map((img, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 group h-20 bg-black">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Products Specified Tag Builder */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block">
                  Key Furnishing Products Specified
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={newProjectProdName}
                      onChange={(e) => setNewProjectProdName(e.target.value)}
                      placeholder="Product Name (e.g. Symphony Acoustic Linen)"
                      className="w-full p-2.5 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <select
                      value={newProjectProdCategory}
                      onChange={(e) => setNewProjectProdCategory(e.target.value as CategorySlug)}
                      className="w-full p-2.5 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none cursor-pointer"
                    >
                      {Object.values(CATEGORIES_DATA).map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-[#163129]">
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddProductToProject}
                      className="w-full py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-wider hover:bg-[#E6C894] transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {projectForm.productsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {projectForm.productsUsed.map((prod, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white flex items-center gap-2"
                      >
                        <span className="text-[#C9A56A] font-medium">{prod.productName}</span>
                        <span className="text-[10px] text-[#8C9A90]">({prod.categorySlug})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProductFromProject(idx)}
                          className="text-red-400 hover:text-red-200 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all shadow-lg cursor-pointer"
                >
                  {editingProjectId ? 'Update Project Commission' : 'Save Project to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PROJECT PREVIEW MODAL --- */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0F1714] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C9A56A] font-bold block">
                  {previewProject.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">{previewProject.title}</h3>
                <span className="text-xs text-[#8C9A90]">{previewProject.location} • {previewProject.year}</span>
              </div>
              <button
                onClick={() => setPreviewProject(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden bg-black">
              <img src={previewProject.heroImage} alt={previewProject.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3 text-xs text-[#E9DFD1]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">Architectural Narrative</span>
                <p className="text-[#8C9A90] leading-relaxed font-light">{previewProject.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Lead Designer:</span>
                <strong className="text-white">{previewProject.designer}</strong>
              </div>

              {previewProject.productsUsed && previewProject.productsUsed.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#C9A56A] block">Products Specified:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewProject.productsUsed.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white">
                        {p.productName} ({p.categorySlug})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setPreviewProject(null)}
                className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE ALERT DIALOG --- */}
      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        itemName={deleteModalState.itemName}
        itemType={deleteModalState.itemType}
        onConfirm={deleteModalState.onConfirm}
        onCancel={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
