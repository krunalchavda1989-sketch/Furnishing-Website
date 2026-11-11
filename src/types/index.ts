export type CategorySlug =
  | 'drapes-curtains'
  | 'upholstery-fabrics'
  | 'wallpapers-wallcoverings'
  | 'rugs-carpets'
  | 'mattresses-sleep-comfort'
  | 'custom-furnishing-solutions'
  | 'fabrics'
  | 'curtains-upholstery'
  | 'bed'
  | 'blinds'
  | 'rugs'
  | 'carpet'
  | 'wallpaper'
  | 'luxury-collection'
  | (string & {});

export interface CategoryInfo {
  id: CategorySlug;
  number?: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  materialHighlight: string;
  craftOrigin: string;
  tagline: string;
  order?: number;
  isVisible?: boolean;
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

// ==========================================
// SEO & WEB MARKETING SUITE TYPES
// ==========================================

export interface PageSEOConfig {
  pageId: string; // 'home' | 'story' | 'projects' | 'catalogue' | 'brands' | 'contact'
  pageName: string;
  routePath: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  structuredDataJson?: string;
}

export interface WebmasterVerificationSettings {
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  yandexVerification?: string;
  pinterestVerification?: string;
  baiduVerification?: string;
  customVerificationMeta?: string;
  robotsTxtContent?: string;
  sitemapUrl?: string;
}

export interface GoogleAnalyticsSettings {
  enabled: boolean;
  type: 'ga4' | 'gtm';
  measurementId: string; // e.g. G-XXXXXXXXXX or GTM-XXXXXXX
  sendPageViewOnRouteChange: boolean;
  anonymizeIp?: boolean;
}

export interface MetaPixelSettings {
  enabled: boolean;
  pixelId: string;
  trackPageViewOnRouteChange: boolean;
  trackCustomEvents: boolean;
}

export interface CodeInjectionSettings {
  enabled: boolean;
  headerCode: string; // Injected into <head>
  bodyOpenCode: string; // Injected top of <body>
  footerCode: string; // Injected before </body>
}

export interface MarketingSettings {
  id?: string;
  webmaster: WebmasterVerificationSettings;
  pagesSEO: PageSEOConfig[];
  googleAnalytics: GoogleAnalyticsSettings;
  metaPixel: MetaPixelSettings;
  codeInjection: CodeInjectionSettings;
  updatedAt?: string;
}

// ==========================================
// THE ATELIER EXPERIENCE SECTION TYPES
// ==========================================

export interface AtelierExperienceStep {
  id: string;
  number: string;
  title: string;
  description: string;
  isVisible?: boolean;
  order?: number;
}

export interface AtelierExperienceSettings {
  id?: string;
  badge: string;
  headingPrimary: string;
  headingAccent: string;
  introText: string;
  ctaLabel?: string;
  steps: AtelierExperienceStep[];
  isVisible?: boolean;
  updatedAt?: string;
}

// ==========================================
// WHY ATELIER LIVING SECTION TYPES
// ==========================================

export interface WhyAtelierPillar {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageCaption?: string;
  isVisible?: boolean;
  order?: number;
}

export interface WhyAtelierSettings {
  id?: string;
  badge: string;
  headingPrimary: string;
  headingAccent: string;
  subtitle?: string;
  ctaLabel?: string;
  pillars: WhyAtelierPillar[];
  isVisible?: boolean;
  updatedAt?: string;
}

// ==========================================
// FOR DESIGNERS & ARCHITECTS SECTION TYPES
// ==========================================

export interface DesignersArchitectsSettings {
  id?: string;
  badge: string;
  headingPrimary: string;
  headingAccent: string;
  paragraphs: string[];
  highlights?: string[];
  ctaLabel: string;
  heroImage: string;
  imageCaption?: string;
  isVisible?: boolean;
  updatedAt?: string;
}

// ==========================================
// FINAL CALL TO ACTION SECTION TYPES
// ==========================================

export interface FinalCtaSettings {
  id?: string;
  badge: string;
  headingPrimary: string;
  headingAccent: string;
  description: string;
  ctaLabel: string;
  backgroundImage?: string;
  isVisible?: boolean;
  updatedAt?: string;
}

// ==========================================
// HOMEPAGE DYNAMIC SECTION ORDERING TYPES
// ==========================================

export type HomeSectionId =
  | 'hero'
  | 'brand-story'
  | 'collections'
  | 'atelier-experience'
  | 'why-atelier'
  | 'designers-architects'
  | 'final-cta'
  | 'featured-projects'
  | 'brands-marquee'
  | 'testimonials';

export interface HomeSectionLayoutItem {
  id: HomeSectionId;
  isVisible: boolean;
  order: number;
}

export interface HomeSectionLayoutSettings {
  id?: string;
  sections: HomeSectionLayoutItem[];
  updatedAt?: string;
}

// ==========================================
// DYNAMIC FOOTER CMS & LINKS TYPES
// ==========================================

export interface FooterLinkItem {
  id: string;
  label: string;
  target: string;
  categorySlug?: CategorySlug;
  externalUrl?: string;
  isExternal?: boolean;
  isVisible?: boolean;
  order?: number;
}

export interface FooterSettings {
  id?: string;
  newsletterVisible?: boolean;
  newsletterBadge: string;
  newsletterHeading: string;
  newsletterSubtitle: string;
  newsletterPlaceholder: string;
  newsletterButtonLabel: string;
  newsletterSuccessText: string;

  brandLogoImage?: string;
  brandLogoMonogram: string;
  brandLogoTitle: string;
  brandDescription: string;
  showSocialLinks?: boolean;

  collectionsHeading: string;
  collectionLinks: FooterLinkItem[];

  quickLinksHeading: string;
  quickLinks: FooterLinkItem[];

  showroomHeading: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  showEmail?: boolean;
  showCtaButton?: boolean;
  ctaButtonLabel: string;
  ctaButtonTarget: string;
  ctaButtonUrl?: string;

  copyrightText: string;
  bottomLinks: FooterLinkItem[];

  updatedAt?: string;
}



