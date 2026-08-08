import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/projectsData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import type { Project, CategorySlug } from '../types';
import { MapPin, ArrowUpRight, Compass, Filter } from 'lucide-react';

interface ProjectsPageProps {
  onOpenProject: (project: Project) => void;
  onNavigateToCategory: (categorySlug: CategorySlug) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onOpenProject,
  onNavigateToCategory
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const tags = ['All', 'Private Residence', 'Coastal Estate', 'Penthouse Sanctuary', 'Bespoke Yacht'];

  const filteredProjects =
    selectedTag === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category.toLowerCase().includes(selectedTag.toLowerCase()));

  return (
    <div className="pt-28 sm:pt-36 pb-24 space-y-16">
      {/* Intro Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block">
          Interior Architecture Portfolio
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1918] font-normal">
          Curated <span className="italic font-subserif gold-gradient-text">Residences & Sanctuaries</span>
        </h1>
        <p className="text-sm sm:text-base text-[#4A4844] font-light leading-relaxed max-w-2xl mx-auto font-subserif text-lg">
          Explore completed international commissions featuring bespoke acoustic drapery, hand-knotted Tibetan silk floor coverings, and tailored upholstery.
        </p>
      </section>

      {/* Persistent Category Hub Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1918] text-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/30 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C5A059]/20">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold flex items-center gap-2">
              <Compass className="w-4 h-4" /> Category Hub — Direct Access to All 8 Product Archives
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Object.values(CATEGORIES_DATA).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigateToCategory(cat.id as CategorySlug)}
                className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#C5A059] hover:bg-[#C5A059]/15 transition-all text-left flex flex-col justify-between h-24"
              >
                <span className="text-xs font-serif text-[#FDFBF7] group-hover:text-[#C5A059] transition-colors leading-snug">
                  {cat.title}
                </span>
                <span className="text-[10px] uppercase text-[#C5A059] font-medium tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#D8C8B8]">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs uppercase tracking-widest text-[#1A1918] font-bold">
              Filter Portfolio:
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
                  selectedTag === tag
                    ? 'bg-[#1A1918] text-[#C5A059]'
                    : 'bg-[#F5EFE6] text-[#4A4844] hover:bg-[#D8C8B8]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project)}
              className="group cursor-pointer bg-[#F5EFE6] rounded-3xl overflow-hidden border border-[#C5A059]/20 shadow-xl hover:border-[#C5A059] transition-all duration-500 flex flex-col justify-between"
            >
              <div className="relative h-[400px] w-full overflow-hidden">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 glass-panel-dark px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-[#C5A059]">
                  {project.category}
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-[#FDFBF7]">
                  <span className="text-xs text-[#D8C8B8] font-light block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> {project.location} • {project.year}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#FDFBF7] font-normal group-hover:text-[#C5A059] transition-colors mt-1">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-[#4A4844] line-clamp-2 leading-relaxed font-light">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#D8C8B8]">
                  <span className="text-xs text-[#8C7A6B]">
                    Designer: <strong className="text-[#1A1918]">{project.designer}</strong>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inspect Commission <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
