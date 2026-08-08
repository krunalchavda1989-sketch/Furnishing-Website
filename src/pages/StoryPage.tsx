import React, { useState } from 'react';
import { Compass, Feather, HeartHandshake, Sparkles } from 'lucide-react';

export const StoryPage: React.FC = () => {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const timelineMilestones = [
    {
      year: '1898',
      title: 'Foundation in Mayfair',
      description: 'Master weaver Henri Drape established a small silk drapery atelier servicing London and Parisian aristocracy.'
    },
    {
      year: '1948',
      title: 'Expansion into Como Silk Looms',
      description: 'Acquired exclusive historical jacquard weaving looms along Lake Como, establishing custom silk pattern archives.'
    },
    {
      year: '1985',
      title: 'Flax & Mohair Sourcing Alliance',
      description: 'Pioneered direct organic flax farming partnerships with Kortrijk farmers in Belgium and Angora mohair mills in Florence.'
    },
    {
      year: '2012',
      title: 'Acoustic Sheer Innovation',
      description: 'Engineered micro-flax acoustic sheer weaves in St. Gallen, combining sound absorption with transparent light diffusion.'
    },
    {
      year: '2026',
      title: 'The 3D Atelier Digital Studio',
      description: 'Launched real-time material simulation enabling interior architects to inspect drape physics and custom colorways remotely.'
    }
  ];

  const craftPillars = [
    {
      icon: Feather,
      title: 'Flanders Organic Flax',
      origin: 'Kortrijk, Belgium',
      description: 'Grown without pesticides in rich river silt, our flax is enzyme-washed to achieve a fluid architectural drape.'
    },
    {
      icon: Sparkles,
      title: 'Como Raw Silk Jacquard',
      origin: 'Lake Como, Italy',
      description: 'Woven on slow shuttle looms that preserve yarn elasticity, resulting in luminous depth under changing daylight.'
    },
    {
      icon: Compass,
      title: 'Florentine Mohair Velvet',
      origin: 'Florence, Italy',
      description: 'Dyed in small artisan kettles using natural pigments, producing a dense pile that ages with an extraordinary patina.'
    },
    {
      icon: HeartHandshake,
      title: 'Himalayan Hand-Knotted Silk',
      origin: 'Kathmandu, Nepal',
      description: 'Crafted at 150 knots per square inch using hand-carded high-altitude wool and wild mulberry silk.'
    }
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85',
      caption: 'Artisanal Jacquard Shuttle Loom in Como, Italy'
    },
    {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      caption: 'Hand-sorting Flanders Flax Fibers in Kortrijk'
    },
    {
      url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
      caption: 'Kettle-Dyeing Mohair Velvet in Florence'
    },
    {
      url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=85',
      caption: 'Master Weaver Hand-Carving Relief Rug Contours in Nepal'
    }
  ];

  return (
    <div className="pt-28 sm:pt-36 pb-24 space-y-24">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block">
          Our Heritage & Craftsmanship
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1918] font-normal leading-tight">
          A Century of <span className="italic font-subserif gold-gradient-text">Tactile Mastery</span> & Spatial Poetry
        </h1>
        <p className="text-base text-[#4A4844] font-light leading-relaxed max-w-2xl mx-auto font-subserif text-lg">
          For over 120 years, Maison & Drape has stood at the intersection of artisanal weaving traditions and modern architectural living. We believe that true interior luxury is defined by materials that honor the senses and endure across generations.
        </p>
      </section>

      {/* Main Narrative Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#F5EFE6] rounded-3xl p-8 lg:p-12 border border-[#C5A059]/20 shadow-xl">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
              The Founder’s Ethos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1918] font-normal">
              "We do not decorate rooms. We curate light, acoustic serenity, and human touch."
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4844] leading-relaxed font-light">
              Founded in Mayfair in 1898, our atelier began as a private commission house for discerning collectors seeking unyielding textile perfection. Today, under the creative direction of Julian & Beatrice Drape, we continue to preserve centuries-old European weaving techniques while engineering modern sustainable textiles.
            </p>
            <div className="pt-4 border-t border-[#D8C8B8]">
              <strong className="block font-serif text-base text-[#1A1918]">Beatrice & Julian Drape</strong>
              <span className="text-xs text-[#8C7A6B]">Fourth-Generation Managing Directors</span>
            </div>
          </div>

          <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
              alt="Atelier Directors"
              className="w-full h-full object-cover filter brightness-95"
            />
          </div>
        </div>
      </section>

      {/* Craft Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium">
            Material Integrity
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1918]">
            Four Cornerstones of Our Sourcing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {craftPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#1A1918] text-[#FDFBF7] p-6 rounded-3xl border border-[#C5A059]/30 shadow-xl space-y-4 hover:border-[#C5A059] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold block">
                  {pillar.origin}
                </span>
                <h3 className="font-serif text-xl text-[#FDFBF7]">{pillar.title}</h3>
                <p className="text-xs text-[#D8C8B8] font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium">
            Chronology of Excellence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1918] mt-1">
            Our Historic Milestones
          </h2>
        </div>

        <div className="relative border-l border-[#C5A059]/40 ml-4 sm:ml-32 space-y-12">
          {timelineMilestones.map((m, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-10">
              {/* Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#1A1918] border-2 border-[#C5A059]" />

              {/* Year label for desktop */}
              <div className="hidden sm:block absolute -left-32 top-1 w-24 text-right">
                <span className="font-serif text-2xl text-[#C5A059] font-bold">{m.year}</span>
              </div>

              <div className="bg-[#F5EFE6] p-6 rounded-2xl border border-[#C5A059]/20 shadow-md">
                <span className="sm:hidden font-serif text-xl text-[#C5A059] font-bold block mb-1">
                  {m.year}
                </span>
                <h3 className="font-serif text-xl text-[#1A1918]">{m.title}</h3>
                <p className="text-xs text-[#4A4844] mt-2 font-light leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workshop Gallery Lightbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium">
            Inside The Atelier
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1918]">
            Workshop & Mill Imagery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedGalleryImage(img.url)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-[#C5A059]/30 shadow-lg"
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-[#FDFBF7]">
                <p className="text-[11px] font-medium text-[#EBE5D8] group-hover:text-[#C5A059] transition-colors">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox for Gallery */}
        {selectedGalleryImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <div className="relative max-w-4xl w-full">
              <img
                src={selectedGalleryImage}
                alt="Workshop View"
                className="w-full max-h-[85vh] object-contain rounded-2xl border border-[#C5A059]/40"
              />
              <p className="text-center text-xs text-[#C5A059] mt-3 font-medium tracking-widest uppercase">
                Click anywhere to close preview
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
