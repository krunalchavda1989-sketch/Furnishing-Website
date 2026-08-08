import type { Project } from '../types';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'prj-01',
    title: 'The Belgravia Townhouse',
    category: 'Private Residence',
    location: 'Belgravia, London',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A Grade II listed Georgian townhouse restored with tactile warmth. Double-height windows feature automated acoustic linen sheers that cascade onto polished oak floorboards, complemented by hand-knotted Himalayan silk rugs and custom mohair upholstered sofas.',
    designer: 'Studio Harrison & Co.',
    productsUsed: [
      { productName: 'Kortrijk Washed Flax Linen', categorySlug: 'fabrics' },
      { productName: 'Symphony Acoustic Linen Sheer', categorySlug: 'curtains-upholstery' },
      { productName: 'Himalayan Eclipse Silk & Wool Rug', categorySlug: 'rugs' }
    ]
  },
  {
    id: 'prj-02',
    title: 'Villa Alang-Alang',
    category: 'Coastal Estate',
    location: 'Cap d’Antibes, France',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Mediterranean light sculpted through woven timber Roman shades and sheer silk drapes. Neutral linen upholstery and outdoor-treated velvet loungers connect interior salons with sweeping sea terraces.',
    designer: 'Atelier Jean-Luc',
    productsUsed: [
      { productName: 'Kyoto Woven Timber Roman Shade', categorySlug: 'blinds' },
      { productName: 'Aurelia Raw Silk Jacquard', categorySlug: 'fabrics' }
    ]
  },
  {
    id: 'prj-03',
    title: 'The Hudson River Penthouse',
    category: 'Penthouse Sanctuary',
    location: 'Tribeca, New York',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A 6,000-sq-ft loft transformed with hand-painted botanical silk wall panels, acoustic sheers framing skyline vistas, and deep wool-velvet broadloom carpets anchoring private quarters.',
    designer: 'Meyer Davis Studio',
    productsUsed: [
      { productName: 'Lyons Hand-Painted Silk Wallcovering', categorySlug: 'wallpaper' },
      { productName: 'Axminster Royal Wool Velvet Broadloom', categorySlug: 'carpet' },
      { productName: 'Milano Giza 45 Duvet Set', categorySlug: 'bed' }
    ]
  },
  {
    id: 'prj-04',
    title: 'M/Y Horizon 75m Superyacht',
    category: 'Bespoke Yacht',
    location: 'Monaco Harbor',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Couture maritime interiors featuring flame-retardant mohair velvets, woven leather ceiling trim, and vicuña throws for stateroom lounges.',
    designer: 'Winch Design',
    productsUsed: [
      { productName: 'Tuscan Mohair Velvet', categorySlug: 'fabrics' },
      { productName: 'Atelier Vicuña & Bronze Fringe Blanket', categorySlug: 'luxury-collection' }
    ]
  }
];
