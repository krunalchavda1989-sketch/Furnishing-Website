export type CategorySlug =
  | 'fabrics'
  | 'curtains-upholstery'
  | 'bed'
  | 'blinds'
  | 'rugs'
  | 'carpet'
  | 'wallpaper'
  | 'luxury-collection';

export interface CategoryInfo {
  id: CategorySlug;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  materialHighlight: string;
  craftOrigin: string;
  tagline: string;
}

export interface HeroHotspot {
  id?: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  label: string;
  detail: string;
  origin: string;
}

export interface FurnishingScene {
  id: string;
  title: string;
  location: string;
  image: string;
  tagline: string;
  hotspots: HeroHotspot[];
  order?: number;
  isVisible?: boolean;
}

export interface SwatchColor {
  name: string;
  hex: string;
  roughness?: number;
  metalness?: number;
}

export interface Product {
  id: string;
  name: string;
  categorySlug: CategorySlug;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  materialComposition: string;
  widthOrDimensions: string;
  origin: string;
  martindaleOrDurability?: string;
  image: string;
  galleryImages: string[];
  swatchColors: SwatchColor[];
  swatchType: 'linen' | 'velvet' | 'leather' | 'silk' | 'weave' | 'marble' | 'wood';
  priceCategory: 'Bespoke' | 'Luxury' | 'Haute Couture' | 'Signature';
  tags: string[];
  isFeatured?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  heroImage: string;
  gallery: string[];
  description: string;
  designer: string;
  productsUsed: {
    productName: string;
    categorySlug: CategorySlug;
  }[];
}

export interface BrandPartner {
  id: string;
  name: string;
  country: string;
  established: string;
  tagline: string;
  description: string;
  logoText: string;
  image: string;
  specialty: string;
  featuredProducts: string[];
  websiteUrl?: string;
  isVisible?: boolean;
  order?: number;
}

export interface Showroom {
  id: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  image: string;
  coordinates: { lat: number; lng: number };
  isFlagship?: boolean;
  notes?: string;
}

export interface HeaderNavLink {
  id: string;
  label: string;
  target: string;
  hasMegaMenu?: boolean;
  isExternal?: boolean;
  isVisible: boolean;
  order: number;
}

export interface SocialMediaChannel {
  enabled: boolean;
  url: string;
  label: string;
}

export interface SiteSettings {
  id: string;
  // Header Branding
  headerLogoImage: string;
  headerLogoMonogram: string;
  headerLogoTitle: string;
  headerLogoSubtitle: string;

  // Header Styling & Layout Options
  headerFontSize?: '11px' | '12px' | '13px' | '14px' | '15px' | '16px';
  headerItemSpacing?: '12px' | '18px' | '24px' | '32px' | '40px' | '48px';
  headerFontWeight?: '300' | '400' | '500' | '600' | '700';
  headerLetterSpacing?: 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  headerTextTransform?: 'uppercase' | 'capitalize' | 'normal-case';
  headerHeight?: 'compact' | 'standard' | 'luxury';
  headerAlignment?: 'center' | 'left' | 'right';
  headerLogoHeight?: number;
  headerSticky?: boolean;
  headerBackgroundStyle?: 'emerald' | 'obsidian' | 'glass' | 'solid';
  headerBorderBottom?: 'gold' | 'subtle' | 'glow' | 'none';

  // Top Announcement / Utility Bar
  headerTopBarEnabled?: boolean;
  headerTopBarText?: string;
  headerTopBarLink?: string;
  headerTopBarBg?: 'gold' | 'emerald' | 'obsidian';

  // Header Action Buttons
  headerShowSwatchesBtn?: boolean;
  headerShowSearch?: boolean;
  headerShowConcierge?: boolean;
  headerShowCart?: boolean;

  // Footer Branding
  footerLogoImage: string;
  footerLogoMonogram: string;
  footerLogoTitle: string;
  footerDescription: string;
  footerCopyright: string;

  // Header Menu Links
  navLinks: HeaderNavLink[];

  // Social Media Channels
  socialLinks: {
    instagram: SocialMediaChannel;
    pinterest: SocialMediaChannel;
    linkedin: SocialMediaChannel;
    youtube: SocialMediaChannel;
    facebook: SocialMediaChannel;
    twitter: SocialMediaChannel;
    whatsapp: SocialMediaChannel;
  };

  // Contact Details
  companyName: string;
  primaryPhone: string;
  mobileNumber: string;
  whatsappNumber: string;
  generalEmail: string;
  vipEmail: string;
  pressEmail: string;
  tradeEmail: string;
  flagshipAddress: string;

  // Store Hours / Schedule
  scheduleMonFri: string;
  scheduleSat: string;
  scheduleSun: string;
  scheduleHolidays: string;

  // Floating WhatsApp Concierge Widget
  whatsappFloatingEnabled?: boolean;
  whatsappFloatingPosition?: 'bottom-right' | 'bottom-left';
  whatsappFloatingNumber?: string;
  whatsappFloatingMessage?: string;
  whatsappFloatingTooltip?: string;

  updatedAt?: string;
}

export interface ContactSettings {
  id?: string;
  companyName: string;
  primaryPhone: string;
  mobileNumber: string;
  whatsappNumber?: string;
  generalEmail: string;
  vipEmail: string;
  pressEmail?: string;
  tradeEmail?: string;
  scheduleMonFri: string;
  scheduleSat: string;
  scheduleSun: string;
  scheduleHolidays: string;
  instagramUrl?: string;
  pinterestUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  location: string;
  quote: string;
  rating: number; // 1-5
  avatar?: string;
  projectOrProduct?: string;
  order?: number;
  isFeatured?: boolean;
  isVisible?: boolean;
  createdAt?: string;
}

export interface StoryMilestone {
  id?: string;
  year: string;
  title: string;
  description: string;
  location?: string;
  order?: number;
}

export interface StoryCraftPillar {
  id?: string;
  title: string;
  origin?: string;
  description: string;
  icon?: string;
  iconName?: string;
  order?: number;
}

export interface StoryGalleryItem {
  id?: string;
  image?: string;
  url?: string;
  caption: string;
  category?: string;
  order?: number;
}

export interface StoryStatItem {
  label: string;
  value: string;
  description: string;
}

export interface StorySettings {
  id?: string;
  heroBadge: string;
  heroHeading: string;
  heroTitle?: string;
  heroSubheading: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroYear?: string;
  heroImage?: string;

  ethosBadge: string;
  founderBadge?: string;
  ethosQuote: string;
  founderHeadline?: string;
  founderQuote?: string;
  ethosAuthor: string;
  founderSignatory?: string;
  ethosRole: string;
  founderRole?: string;
  ethosDescription1: string;
  ethosDescription2?: string;
  founderDescription?: string;
  ethosImage: string;
  founderImage?: string;

  pillarsBadge?: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillars: StoryCraftPillar[];

  timelineBadge?: string;
  timelineTitle: string;
  timelineSubtitle?: string;
  milestones: StoryMilestone[];
  timelineMilestones?: StoryMilestone[];

  galleryBadge?: string;
  galleryTitle: string;
  gallerySubtitle: string;
  gallery: StoryGalleryItem[];
  galleryImages?: StoryGalleryItem[];

  stats: StoryStatItem[];
  statsLegacy?: string;
  statsArchives?: string;
  statsSwatches?: string;
  statsResidences?: string;

  updatedAt?: string;
}


