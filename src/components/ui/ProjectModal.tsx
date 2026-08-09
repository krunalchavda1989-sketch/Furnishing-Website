import React, { useState } from 'react';
import type { Project, CategorySlug } from '../../types';
import { X, MapPin, Calendar, UserCheck, ArrowRight, Layers } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigateToCategory: (categorySlug: CategorySlug) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onNavigateToCategory
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1A1918] border border-[#C5A059]/30 rounded-3xl overflow-y-auto text-[#FDFBF7] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-[#FDFBF7] hover:bg-[#C5A059] hover:text-[#1A1918] transition-all border border-white/20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Gallery Banner */}
        <div className="relative h-[320px] sm:h-[420px] w-full overflow-hidden bg-black">
          <img
            src={project.gallery[activeImageIndex] || project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-transparent to-black/30"></div>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block mb-1">
                {project.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#FDFBF7] font-normal leading-tight">
                {project.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {project.gallery.length > 1 && (
          <div className="px-6 py-3 bg-[#242220] border-b border-[#C5A059]/20 flex items-center space-x-3 overflow-x-auto">
            {project.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  activeImageIndex === idx
                    ? 'border-[#C5A059] scale-105 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Project Meta & Narrative */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-white/10 text-xs text-[#D8C8B8]">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">Location</span>
                <strong className="text-[#FDFBF7]">{project.location}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">Completion</span>
                <strong className="text-[#FDFBF7]">{project.year}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <UserCheck className="w-4 h-4 text-[#C5A059]" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">Interior Designer</span>
                <strong className="text-[#FDFBF7]">{project.designer}</strong>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl text-[#C5A059] mb-3">Architectural Narrative</h3>
            <p className="text-sm text-[#D8C8B8] leading-relaxed font-light font-subserif text-base sm:text-lg">
              {project.description}
            </p>
          </div>

          {/* Products Specified */}
          <div className="bg-[#242220] p-6 rounded-2xl border border-[#C5A059]/20">
            <h4 className="font-serif text-base text-[#FDFBF7] mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              <span>Key Furnishing Products Specified</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.productsUsed.map((prod, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onClose();
                    onNavigateToCategory(prod.categorySlug);
                  }}
                  className="group flex items-center justify-between p-3 rounded-xl bg-[#1A1918] border border-white/10 hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-all text-left"
                >
                  <div>
                    <span className="text-xs font-medium text-[#FDFBF7] group-hover:text-[#C5A059] transition-colors block">
                      {prod.productName}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] block">
                      {prod.categorySlug.replace('-', ' ')}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
