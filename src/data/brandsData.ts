import type { BrandPartner, Showroom } from '../types';

export const BRANDS_DATA: BrandPartner[] = [
  {
    id: 'bnd-01',
    name: 'Rubelli Venezia',
    country: 'Italy',
    established: '1858',
    tagline: 'The Venetian Art of Woven Silk & Gold Thread',
    description: 'Renowned for weaving Venetian history into modern textile art, Rubelli produces intricate damasks, brocades, and technical outdoor velvets favored by royal residences and opera houses globally.',
    logoText: 'RUBELLI',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85',
    specialty: 'Venetian Silk Damasks & Jacquards',
    featuredProducts: ['Aurelia Raw Silk Jacquard', 'Tuscan Mohair Velvet']
  },
  {
    id: 'bnd-02',
    name: 'Loro Piana Interiors',
    country: 'Italy',
    established: '1924',
    tagline: 'Supreme Cashmere, Vicuña & Fine Wool Craft',
    description: 'Loro Piana Interiors translates the legendary Italian house’s obsession with noble natural fibers into world-class residential drapery, upholstery wools, and ultra-luxurious cashmere blankets.',
    logoText: 'LORO PIANA',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=85',
    specialty: 'Un-dyed Vicuña & Pure Cashmere',
    featuredProducts: ['Atelier Vicuña & Bronze Fringe Blanket', 'Palazzo Tufted Cashmere Headboard']
  },
  {
    id: 'bnd-03',
    name: 'Pierre Frey',
    country: 'France',
    established: '1935',
    tagline: 'Eclectic Parisian Elegance & Heritage Weaves',
    description: 'A French family dynasty celebrating eclecticism, Pierre Frey creates daring archives of printed linens, structural cotton velvets, and hand-embroidered wallcoverings.',
    logoText: 'PIERRE FREY',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
    specialty: 'Historic French Wallcoverings & Prints',
    featuredProducts: ['Lyons Hand-Painted Botanical Silk Wallcovering']
  },
  {
    id: 'bnd-04',
    name: 'Dedar Milano',
    country: 'Italy',
    established: '1976',
    tagline: 'Contemporary Textile Alchemy & Expressive Color',
    description: 'Located near Milan, Dedar combines avant-garde textile technology with traditional Italian weaving mastery, producing high-impact geometric bouclés and fire-retardant sheer curtains.',
    logoText: 'DEDAR',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85',
    specialty: 'Architectural Bouclé & Statement Textiles',
    featuredProducts: ['Verona Sculpted Bouclé Upholstery']
  },
  {
    id: 'bnd-05',
    name: 'Kvadrat',
    country: 'Denmark',
    established: '1968',
    tagline: 'Scandinavian Textile Modernism & Acoustic Engineering',
    description: 'The world leader in design innovation, Kvadrat produces Scandinavian minimalist upholstery wools and acoustic panel systems used by premier architects worldwide.',
    logoText: 'KVADRAT',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85',
    specialty: 'Architectural Wool & Acoustic Sheers',
    featuredProducts: ['Symphony Acoustic Linen Sheer']
  },
  {
    id: 'bnd-06',
    name: 'De Gournay',
    country: 'United Kingdom',
    established: '1986',
    tagline: 'Hand-Painted Chinoiserie & Gold-Leaf Wallpapers',
    description: 'Masters of hand-painted wallcoverings, De Gournay craftsmen gild pure silk paper with 22-carat gold leaf and intricate botanical watercolours.',
    logoText: 'DE GOURNAY',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85',
    specialty: 'Custom Gilded Wall Panels',
    featuredProducts: ['Lyons Hand-Painted Botanical Silk Wallcovering']
  }
];

export const SHOWROOMS_DATA: Showroom[] = [
  {
    id: 'shw-01',
    city: 'London Flagship',
    country: 'United Kingdom',
    address: '42 Mayfair Square, London W1K 2PB',
    phone: '+44 (0)20 7946 0188',
    email: 'mayfair@atelier-living.com',
    hours: 'Mon - Sat: 10:00 - 18:30 | Sun: By Private Appointment',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    coordinates: { lat: 51.509865, lng: -0.118092 }
  },
  {
    id: 'shw-02',
    city: 'Paris Atelier',
    country: 'France',
    address: '18 Rue du Faubourg Saint-Honoré, 75008 Paris',
    phone: '+33 1 42 68 55 00',
    email: 'paris@atelier-living.com',
    hours: 'Mon - Fri: 09:30 - 18:00 | Sat: 10:00 - 17:00',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
    coordinates: { lat: 48.866667, lng: 2.333333 }
  },
  {
    id: 'shw-03',
    city: 'Milan Design Studio',
    country: 'Italy',
    address: 'Via Montenapoleone 12, 20121 Milano',
    phone: '+39 02 7600 4411',
    email: 'milano@atelier-living.com',
    hours: 'Mon - Sat: 10:00 - 19:00',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
    coordinates: { lat: 45.464204, lng: 9.190032 }
  },
  {
    id: 'shw-04',
    city: 'New York Gallery',
    country: 'United States',
    address: '884 Madison Avenue, New York, NY 10021',
    phone: '+1 212 555 0192',
    email: 'madison@atelier-living.com',
    hours: 'Mon - Sat: 10:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=85',
    coordinates: { lat: 40.7736, lng: -73.964 }
  }
];
