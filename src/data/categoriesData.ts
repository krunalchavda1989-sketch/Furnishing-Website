import type { CategoryInfo } from '../types';

export const CORE_COLLECTIONS: CategoryInfo[] = [
  {
    id: 'drapes-curtains',
    number: '01',
    title: 'Drapes & Curtains',
    subtitle: 'Architectural Window Treatments & Sheers',
    description: 'Beautifully tailored window treatments that create the perfect balance of privacy, light and elegance. Explore sheer curtains, statement drapes, layered treatments and bespoke designs.',
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85',
    materialHighlight: 'Acoustic Sheers, Belgian Linen & Pure Silk Drapes',
    craftOrigin: 'Ahmedabad & Como, Italy',
    tagline: 'Tailored window architecture balancing privacy and light.',
    order: 1,
    isVisible: true
  },
  {
    id: 'upholstery-fabrics',
    number: '02',
    title: 'Upholstery & Fabrics',
    subtitle: 'Textured Bouclés, Mohair Velvets & Fine Weaves',
    description: 'Discover an inspiring selection of textures, colours and fabrics designed to bring comfort, sophistication and personality to your furniture and interiors.',
    heroImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1800&q=85',
    materialHighlight: 'Flanders Flax Linen, Mohair Velvet & Bouclé',
    craftOrigin: 'Ahmedabad & Flanders, Belgium',
    tagline: 'Artisanal weaves that respond to touch and comfort.',
    order: 2,
    isVisible: true
  },
  {
    id: 'wallpapers-wallcoverings',
    number: '03',
    title: 'Wallpapers & Wallcoverings',
    subtitle: 'Curated Wallcoverings & Textured Reliefs',
    description: 'Create distinctive spaces with curated wallcoverings, from subtle textures and timeless patterns to expressive statement designs.',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
    materialHighlight: 'Hand-Painted Silk, Grasscloth & Metallic Reliefs',
    craftOrigin: 'Ahmedabad & Lyons, France',
    tagline: 'Transforming vertical surfaces into tactile canvases.',
    order: 3,
    isVisible: true
  },
  {
    id: 'rugs-carpets',
    number: '04',
    title: 'Rugs & Carpets',
    subtitle: 'Hand-Knotted Floor Coverings & Broadloom',
    description: 'Add warmth, texture and character to your interiors with rugs that complement your aesthetic and bring the entire space together.',
    heroImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1800&q=85',
    materialHighlight: 'Himalayan Wool, Botanical Silk & Wilton Broadloom',
    craftOrigin: 'Ahmedabad & Kathmandu, Nepal',
    tagline: 'Underfoot warmth and spatial cohesion.',
    order: 4,
    isVisible: true
  },
  {
    id: 'mattresses-sleep-comfort',
    number: '05',
    title: 'Mattresses & Sleep Comfort',
    subtitle: 'Ergonomic Support & Restorative Craftsmanship',
    description: 'Experience comfort designed around the way you rest. Explore our mattress solutions, bringing together everyday support and thoughtful craftsmanship.',
    heroImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=85',
    materialHighlight: 'Natural Latex, Pocket Springs & Pure Wool Quilting',
    craftOrigin: 'Ahmedabad & Milan, Italy',
    tagline: 'Restorative stillness designed around the way you rest.',
    order: 5,
    isVisible: true
  },
  {
    id: 'custom-furnishing-solutions',
    number: '06',
    title: 'Custom Furnishing Solutions',
    subtitle: 'Concept-to-Finish Bespoke Design & Curation',
    description: 'From concept to finishing touches, discover personalised furnishing solutions thoughtfully developed to suit your space, preferences and lifestyle.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    materialHighlight: 'Personalised Selections & Master Finishing Touches',
    craftOrigin: 'Ahmedabad Atelier',
    tagline: 'Personalised interior solutions tailored to your lifestyle.',
    order: 6,
    isVisible: true
  }
];

const RAW_CATEGORIES: Record<string, CategoryInfo> = {
  'drapes-curtains': CORE_COLLECTIONS[0],
  'upholstery-fabrics': CORE_COLLECTIONS[1],
  'wallpapers-wallcoverings': CORE_COLLECTIONS[2],
  'rugs-carpets': CORE_COLLECTIONS[3],
  'mattresses-sleep-comfort': CORE_COLLECTIONS[4],
  'custom-furnishing-solutions': CORE_COLLECTIONS[5]
};

const ALIASES: Record<string, string> = {
  'fabrics': 'upholstery-fabrics',
  'curtains-upholstery': 'drapes-curtains',
  'bed': 'mattresses-sleep-comfort',
  'blinds': 'drapes-curtains',
  'rugs': 'rugs-carpets',
  'carpet': 'rugs-carpets',
  'wallpaper': 'wallpapers-wallcoverings',
  'luxury-collection': 'custom-furnishing-solutions'
};

export const CATEGORIES_DATA: Record<string, CategoryInfo> = new Proxy(RAW_CATEGORIES, {
  get(target, prop: string) {
    if (typeof prop === 'string') {
      if (prop in target) return target[prop];
      if (prop in ALIASES) return target[ALIASES[prop]];
    }
    return (target as any)[prop];
  }
});
