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
}
