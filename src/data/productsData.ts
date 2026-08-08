import type { Product } from '../types';

export const PRODUCTS_DATA: Product[] = [
  // --- FABRICS ---
  {
    id: 'fab-01',
    name: 'Aurelia Raw Silk Jacquard',
    categorySlug: 'fabrics',
    categoryName: 'Bespoke Fabrics',
    shortDescription: 'Luminous raw silk jacquard with subtle metallic thread accents woven on historic loom systems.',
    fullDescription: 'The Aurelia Raw Silk Jacquard captures ambient sunlight through alternating matte silk yarns and spun metallic filaments. Woven in Como, Italy, this fabric possesses a tactile slub texture suited for statement drapery, decorative accent cushions, and light upholstery.',
    materialComposition: '72% Como Silk, 20% Linen, 8% Lurex',
    widthOrDimensions: '140 cm (55 in) width',
    origin: 'Como, Italy',
    martindaleOrDurability: '25,000 Rubs (Medium Domestic / Drapery)',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Champagne Gold', hex: '#D4AF37', roughness: 0.25, metalness: 0.35 },
      { name: 'Oyster Pearl', hex: '#EBE5D8', roughness: 0.3, metalness: 0.15 },
      { name: 'Bronzed Taupe', hex: '#8C7A6B', roughness: 0.4, metalness: 0.25 }
    ],
    swatchType: 'silk',
    priceCategory: 'Haute Couture',
    tags: ['Silk', 'Jacquard', 'Metallic Accent', 'Como Italy'],
    isFeatured: true
  },
  {
    id: 'fab-02',
    name: 'Kortrijk Washed Flax Linen',
    categorySlug: 'fabrics',
    categoryName: 'Bespoke Fabrics',
    shortDescription: 'Heavy-weight enzyme-washed Belgian flax linen with an effortlessly relaxed drape.',
    fullDescription: 'Harvested from Flanders river basins, our Kortrijk washed flax undergoes a organic enzyme treatment that softens the heavy fiber without weakening its tensile resilience. Ideal for floor-to-ceiling unlined curtains and tactile sofa slipcovers.',
    materialComposition: '100% Belgian Flax Linen',
    widthOrDimensions: '300 cm (118 in) double width',
    origin: 'Kortrijk, Belgium',
    martindaleOrDurability: '40,000 Rubs (Heavy Domestic & General Commercial)',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Raw Sand', hex: '#D9CB9E', roughness: 0.7, metalness: 0.05 },
      { name: 'Chalk White', hex: '#F7F5F0', roughness: 0.8, metalness: 0.0 },
      { name: 'Earthy Clay', hex: '#B58A73', roughness: 0.75, metalness: 0.05 }
    ],
    swatchType: 'linen',
    priceCategory: 'Luxury',
    tags: ['Linen', 'Natural Fiber', 'Double Width', 'Belgian'],
    isFeatured: true
  },
  {
    id: 'fab-03',
    name: 'Tuscan Mohair Velvet',
    categorySlug: 'fabrics',
    categoryName: 'Bespoke Fabrics',
    shortDescription: 'Deep-pile Angora goat mohair velvet with rich sheen and legendary durability.',
    fullDescription: 'Renowned for its liquid lustre and indestructible resilience, Tuscan Mohair Velvet is dyed in small artisanal pots in Florence. The dense wool pile springs back effortlessly, creating plush seating that ages with a sophisticated patina.',
    materialComposition: '70% Angora Mohair, 30% Cotton Ground',
    widthOrDimensions: '142 cm (56 in) width',
    origin: 'Florence, Italy',
    martindaleOrDurability: '100,000 Rubs (Heavy Commercial / Executive)',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Deep Emerald', hex: '#1C3026', roughness: 0.2, metalness: 0.1 },
      { name: 'Oxblood Velvet', hex: '#4A1C1C', roughness: 0.2, metalness: 0.1 },
      { name: 'Midnight Charcoal', hex: '#1C1D21', roughness: 0.25, metalness: 0.08 }
    ],
    swatchType: 'velvet',
    priceCategory: 'Bespoke',
    tags: ['Velvet', 'Mohair', 'High Durability', 'Florentine'],
    isFeatured: false
  },

  // --- CURTAINS & UPHOLSTERY ---
  {
    id: 'cur-01',
    name: 'Symphony Acoustic Linen Sheer',
    categorySlug: 'curtains-upholstery',
    categoryName: 'Curtains & Upholstery',
    shortDescription: 'Ultra-wide acoustic sheer fabric that diffuses glare while dampening reverberation.',
    fullDescription: 'Designed for sun-drenched architectural spaces, Symphony merges micro-engineered sound-absorbing yarns with semi-sheer flax threads. It softens harsh daylight into a warm glow while reducing room acoustic reflections by up to 45%.',
    materialComposition: '60% Acoustic Trevira CS, 40% Washed Linen',
    widthOrDimensions: '320 cm (126 in) seamless height',
    origin: 'St. Gallen, Switzerland',
    martindaleOrDurability: 'Flame Retardant M1 / Class 1',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Ivory Mist', hex: '#F4F0E8', roughness: 0.6, metalness: 0.02 },
      { name: 'Warm Taupe', hex: '#C2B4A3', roughness: 0.65, metalness: 0.02 }
    ],
    swatchType: 'linen',
    priceCategory: 'Luxury',
    tags: ['Acoustic', 'Window Drapes', 'Fire Retardant', 'Swiss'],
    isFeatured: true
  },
  {
    id: 'cur-02',
    name: 'Verona Sculpted Bouclé Upholstery',
    categorySlug: 'curtains-upholstery',
    categoryName: 'Curtains & Upholstery',
    shortDescription: 'Tactile nubby wool-blend bouclé crafted for curvilinear seating forms.',
    fullDescription: 'Inspired by mid-century Scandinavian furniture design, Verona Bouclé features looped yarns of varied thickness that create a multi-dimensional pebbled surface. Soft to the touch yet incredibly resilient for everyday lounge chairs and curved sofas.',
    materialComposition: '45% Alpaca Wool, 35% Cotton, 20% Acrylic',
    widthOrDimensions: '140 cm (55 in) width',
    origin: 'Biella, Italy',
    martindaleOrDurability: '60,000 Rubs (Heavy Domestic / Contract)',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Bouclé Oatmeal', hex: '#E5DDCB', roughness: 0.85, metalness: 0.0 },
      { name: 'Desert Pebble', hex: '#ADA293', roughness: 0.85, metalness: 0.0 }
    ],
    swatchType: 'weave',
    priceCategory: 'Bespoke',
    tags: ['Bouclé', 'Alpaca Wool', 'Curved Furniture', 'Italian Weave'],
    isFeatured: true
  },

  // --- BEDDING ---
  {
    id: 'bed-01',
    name: 'Milano Giza 45 Duvet Set',
    categorySlug: 'bed',
    categoryName: 'Bedding & Sanctuaries',
    shortDescription: '1,000-thread-count Egyptian Giza 45 cotton percale finished with double hemstitch.',
    fullDescription: 'Woven from the rarest extra-long staple Giza 45 cotton grown along the Nile delta, this duvet set offers an unmatched crisp yet silky texture that cools in summer and retains warmth in winter.',
    materialComposition: '100% Giza 45 Egyptian Cotton',
    widthOrDimensions: 'Super King (260 x 220 cm) / Emperor Custom',
    origin: 'Milan, Italy',
    martindaleOrDurability: 'Oeko-Tex Standard 100 Certified',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Pure Snow', hex: '#FFFFFF', roughness: 0.3, metalness: 0.0 },
      { name: 'Sand Pearl', hex: '#F0EAD6', roughness: 0.35, metalness: 0.0 }
    ],
    swatchType: 'linen',
    priceCategory: 'Haute Couture',
    tags: ['1000 TC', 'Giza 45 Cotton', 'Hotel Luxury', 'Hemstitch'],
    isFeatured: true
  },
  {
    id: 'bed-02',
    name: 'Palazzo Tufted Cashmere Headboard',
    categorySlug: 'bed',
    categoryName: 'Bedding & Sanctuaries',
    shortDescription: 'Hand-padded wool cashmere headboard structure with hand-bronzed nailhead studs.',
    fullDescription: 'A monumental centerpiece for master suites. The Palazzo headboard combines solid ash wood frames with deep diamond button tufting upholstered in pure Mongolian cashmere wool blend.',
    materialComposition: 'Mongolian Cashmere Wool, Ash Wood, Bronze Detail',
    widthOrDimensions: 'Custom height up to 280 cm',
    origin: 'Brianza, Italy',
    martindaleOrDurability: 'Handcrafted Lifetime Frame Warranty',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Cashmere Heather', hex: '#B8A89A', roughness: 0.6, metalness: 0.05 },
      { name: 'Slate Night', hex: '#2C3038', roughness: 0.5, metalness: 0.05 }
    ],
    swatchType: 'weave',
    priceCategory: 'Bespoke',
    tags: ['Headboard', 'Cashmere', 'Button Tufted', 'Custom Furniture'],
    isFeatured: false
  },

  // --- BLINDS ---
  {
    id: 'bld-01',
    name: 'Kyoto Woven Timber Roman Shade',
    categorySlug: 'blinds',
    categoryName: 'Architectural Blinds',
    shortDescription: 'Precision basswood and linen thread woven Roman blinds with motorized Somfy integration.',
    fullDescription: 'Hand-woven in Kyoto using sustainably sourced Japanese basswood slats bound by natural flax warps. Provides subtle light diffusion while insulating windows against solar heat gain.',
    materialComposition: 'Japanese Basswood, Washed Linen Warp',
    widthOrDimensions: 'Custom width up to 340 cm',
    origin: 'Kyoto, Japan',
    martindaleOrDurability: 'UV-Resistant & Anti-Warp Treated',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Natural Hinoki', hex: '#D2B48C', roughness: 0.65, metalness: 0.1 },
      { name: 'Charcoal Stained Timber', hex: '#2B2B2B', roughness: 0.5, metalness: 0.1 }
    ],
    swatchType: 'wood',
    priceCategory: 'Luxury',
    tags: ['Roman Shades', 'Woven Wood', 'Motorized', 'Japanese Craft'],
    isFeatured: true
  },

  // --- RUGS ---
  {
    id: 'rug-01',
    name: 'Himalayan Eclipse Silk & Wool Rug',
    categorySlug: 'rugs',
    categoryName: 'Hand-Knotted Rugs',
    shortDescription: 'Hand-knotted 150-knot Tibetan wool rug featuring carved botanical silk highlights.',
    fullDescription: 'Crafted over six months by master Nepalese weavers, Himalayan Eclipse features an ombre pattern blending matte hand-carded Tibetan wool with high-sheen raised silk knots that catch light dynamically from different angles.',
    materialComposition: '65% Himalayan Wool, 35% Hand-Spun Mulberry Silk',
    widthOrDimensions: '300 x 400 cm (Custom sizes available)',
    origin: 'Kathmandu, Nepal',
    martindaleOrDurability: 'Hand-Knotted 150 Knots/in²',
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Bronze Shadow', hex: '#635345', roughness: 0.5, metalness: 0.2 },
      { name: 'Silver Slate', hex: '#9AA0A6', roughness: 0.45, metalness: 0.25 }
    ],
    swatchType: 'weave',
    priceCategory: 'Bespoke',
    tags: ['Hand-Knotted', 'Tibetan Wool', 'Silk Accents', '150 Knot'],
    isFeatured: true
  },
  {
    id: 'rug-02',
    name: 'Atlas Sculpted Tufted Runner',
    categorySlug: 'rugs',
    categoryName: 'Hand-Knotted Rugs',
    shortDescription: 'Hand-carved architectural linear runner with hand-stitched leather side binding.',
    fullDescription: 'Engineered for grand corridors and staircases, the Atlas runner showcases high-and-low cut pile geometry that provides underfoot cushioning and subtle shadows.',
    materialComposition: '100% New Zealand Wool, Calfskin Binding',
    widthOrDimensions: '110 x 600 cm (Custom lengths)',
    origin: 'Ouarzazate, Morocco',
    martindaleOrDurability: 'High-Traffic Domestic / Hotel Suite',
    image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Oatmeal Wool', hex: '#DFD7C6', roughness: 0.8, metalness: 0.0 }
    ],
    swatchType: 'weave',
    priceCategory: 'Signature',
    tags: ['Runner', 'Carved Geometry', 'Leather Bound'],
    isFeatured: false
  },

  // --- CARPET ---
  {
    id: 'cpt-01',
    name: 'Axminster Royal Wool Velvet Broadloom',
    categorySlug: 'carpet',
    categoryName: 'Broadloom & Carpeting',
    shortDescription: 'Ultra-dense wall-to-wall wool velvet carpet with seamless plush luxury underfoot.',
    fullDescription: 'Woven on traditional Wilton looms in Wiltshire, England, this broadloom carpet offers an unyielding pile density of 2,400 grams per square meter. Available with bespoke hand-stitched linen border tapes.',
    materialComposition: '80% New Zealand Wool, 20% Nylon 6.6',
    widthOrDimensions: '400 cm & 500 cm roll width',
    origin: 'Wiltshire, United Kingdom',
    martindaleOrDurability: 'Heavy Commercial & Hospitality Rated',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Sahara Sand', hex: '#D6C8B4', roughness: 0.7, metalness: 0.0 },
      { name: 'Muted Moss', hex: '#586353', roughness: 0.7, metalness: 0.0 }
    ],
    swatchType: 'weave',
    priceCategory: 'Luxury',
    tags: ['Broadloom', 'Wool Velvet', 'Wall-to-Wall', 'British Woven'],
    isFeatured: true
  },

  // --- WALLPAPER ---
  {
    id: 'wlp-01',
    name: 'Lyons Hand-Painted Botanical Silk Wallcovering',
    categorySlug: 'wallpaper',
    categoryName: 'Wallcoverings & Murals',
    shortDescription: 'Bespoke hand-painted silk wall panels adorned with gold leaf embellishment.',
    fullDescription: 'Created as individual continuous panels, each mural is hand-painted by French master artists onto slubbed raw silk backings. The metallic leaf accents shimmer softly under evening wall sconces.',
    materialComposition: '100% Natural Silk on Non-Woven Backing',
    widthOrDimensions: '91 cm (36 in) panel width x custom height',
    origin: 'Lyons, France',
    martindaleOrDurability: 'Spongeable & Lightfast (Class A Fire Rated)',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Celadon & Gold', hex: '#8F9E8B', roughness: 0.35, metalness: 0.25 },
      { name: 'Midnight Chinoiserie', hex: '#1C2536', roughness: 0.3, metalness: 0.3 }
    ],
    swatchType: 'silk',
    priceCategory: 'Haute Couture',
    tags: ['Hand-Painted', 'Silk Mural', 'Gold Leaf', 'French Artisanal'],
    isFeatured: true
  },

  // --- LUXURY COLLECTION ---
  {
    id: 'lux-01',
    name: 'Atelier Vicuña & Bronze Fringe Blanket',
    categorySlug: 'luxury-collection',
    categoryName: 'The Atelier Collection',
    shortDescription: 'Numbered edition throw hand-loomed from pure Peruvian vicuña with cast bronze corners.',
    fullDescription: 'The ultimate expression of textile rarity. Harvested sustainably from wild vicuña in the high Andes, this throw possesses an incomparable fiber fineness of 12 microns. Finished with hand-cast antiqued bronze weight fixtures.',
    materialComposition: '100% Wild Peruvian Vicuña, Cast Bronze Weights',
    widthOrDimensions: '150 x 200 cm (Edition of 25)',
    origin: 'Arequipa, Peru & Parisian Atelier',
    martindaleOrDurability: 'Collector Certificate of Authenticity',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85'
    ],
    swatchColors: [
      { name: 'Natural Vicuña Gold', hex: '#B8860B', roughness: 0.4, metalness: 0.2 },
      { name: 'Cast Bronze', hex: '#4A3B32', roughness: 0.3, metalness: 0.5 }
    ],
    swatchType: 'silk',
    priceCategory: 'Haute Couture',
    tags: ['Vicuña', 'Limited Edition', 'Bronze Accent', 'Collector Item'],
    isFeatured: true
  }
];
