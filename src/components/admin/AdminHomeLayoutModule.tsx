import React, { useEffect, useState } from 'react';
import type {
  HomeSectionId,
  HomeSectionLayoutItem,
  HomeSectionLayoutSettings
} from '../../types';
import {
  normalizeHomeSectionLayout,
  restoreDefaultHomeSectionLayoutInSupabase,
  saveHomeSectionLayoutToSupabase
} from '../../lib/supabase';
import { useToast } from '../ui/ToastNotification';
import {
  ArrowDown,
  ArrowUp,
  Award,
  Building2,
  Compass,
  Edit,
  Eye,
  EyeOff,
  Globe,
  GripVertical,
  Image as ImageIcon,
  Layers,
  Layout,
  Quote,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export type AdminTabTarget =
  | 'site-branding'
  | 'atelier-experience'
  | 'why-atelier'
  | 'designers-architects'
  | 'final-cta'
  | 'products'
  | 'projects';

export type SiteBrandingSubtab =
  | 'nav-links'
  | 'header-styling'
  | 'logos'
  | 'hero-slides'
  | 'testimonials'
  | 'brands'
  | 'story-cms'
  | 'socials'
  | 'contact';

interface SectionMeta {
  title: string;
  eyebrow: string;
  description: string;
  surfaceLabel: 'Full-Bleed Dark' | 'Full-Bleed Cream' | 'Light Canvas';
  surfaceTone: 'dark' | 'cream' | 'canvas';
  editTab?: {
    id: AdminTabTarget;
    label: string;
    siteSubtab?: SiteBrandingSubtab;
  };
}

const SECTION_META: Record<HomeSectionId, SectionMeta> = {
  hero: {
    title: 'Hero Showcase',
    eyebrow: 'ATELIER LIVING',
    description: 'Primary editorial intro, Consultation CTAs, stats strip & interactive 3D/slideshow showcase.',
    surfaceLabel: 'Light Canvas',
    surfaceTone: 'canvas',
    editTab: { id: 'site-branding', label: 'Hero Slides', siteSubtab: 'hero-slides' }
  },
  'brand-story': {
    title: 'About Atelier Living',
    eyebrow: 'ABOUT ATELIER LIVING',
    description: 'Ahmedabad bespoke craftsmanship narrative & atelier philosophy block.',
    surfaceLabel: 'Full-Bleed Dark',
    surfaceTone: 'dark',
    editTab: { id: 'site-branding', label: 'Story Settings', siteSubtab: 'story-cms' }
  },
  collections: {
    title: 'Our Collections',
    eyebrow: 'OUR COLLECTIONS',
    description: 'Dynamic furnishing collection grid (Drapes, Upholstery, Wallpapers, Rugs, Mattresses & Bespoke).',
    surfaceLabel: 'Light Canvas',
    surfaceTone: 'canvas',
    editTab: { id: 'products', label: 'Collections & Catalog' }
  },
  'atelier-experience': {
    title: 'The Atelier Experience',
    eyebrow: 'THE ATELIER EXPERIENCE',
    description: 'Your Vision. Our Craftsmanship. 4-step Discover, Curate, Customise & Transform process.',
    surfaceLabel: 'Full-Bleed Dark',
    surfaceTone: 'dark',
    editTab: { id: 'atelier-experience', label: 'Edit Experience' }
  },
  'why-atelier': {
    title: 'Why Atelier Living',
    eyebrow: 'WHY ATELIER LIVING',
    description: 'The Art of Thoughtful Furnishing scroll-driven sticky image pillars showcase.',
    surfaceLabel: 'Full-Bleed Cream',
    surfaceTone: 'cream',
    editTab: { id: 'why-atelier', label: 'Edit Why Atelier' }
  },
  'designers-architects': {
    title: 'For Designers & Architects',
    eyebrow: 'FOR DESIGNERS & ARCHITECTS',
    description: 'A Creative Partner for Inspired Interiors architectural & trade collaboration split section.',
    surfaceLabel: 'Full-Bleed Dark',
    surfaceTone: 'dark',
    editTab: { id: 'designers-architects', label: 'Edit Designers' }
  },
  'final-cta': {
    title: 'Final Call To Action',
    eyebrow: 'FINAL CALL TO ACTION',
    description: "Let's Create Something Beautiful. Champagne-gold framed private consultation invitation banner.",
    surfaceLabel: 'Light Canvas',
    surfaceTone: 'canvas',
    editTab: { id: 'final-cta', label: 'Edit Final CTA' }
  },
  'featured-projects': {
    title: 'Featured Interior Projects',
    eyebrow: 'CURATED RESIDENCES & SUPERYACHTS',
    description: 'Three-column showcase of curated residences, villas & commercial commissions.',
    surfaceLabel: 'Light Canvas',
    surfaceTone: 'canvas',
    editTab: { id: 'projects', label: 'Manage Projects' }
  },
  'brands-marquee': {
    title: 'Global Partners & Mill Houses',
    eyebrow: 'GLOBAL PARTNERS & MILL HOUSES',
    description: 'Continuous animated marquee highlighting international textile houses & origins.',
    surfaceLabel: 'Full-Bleed Dark',
    surfaceTone: 'dark',
    editTab: { id: 'site-branding', label: 'Manage Brands', siteSubtab: 'brands' }
  },
  testimonials: {
    title: 'Client Testimonials Carousel',
    eyebrow: 'CLIENT ACCLAIM',
    description: 'Interactive rotating client & architect review quote spotlight card.',
    surfaceLabel: 'Light Canvas',
    surfaceTone: 'canvas',
    editTab: { id: 'site-branding', label: 'Manage Reviews', siteSubtab: 'testimonials' }
  }
};

const renderSectionIcon = (id: HomeSectionId) => {
  switch (id) {
    case 'hero':
      return <Sparkles className="w-4 h-4 text-[#C9A56A]" />;
    case 'brand-story':
      return <Award className="w-4 h-4 text-[#C9A56A]" />;
    case 'collections':
      return <Layers className="w-4 h-4 text-[#C9A56A]" />;
    case 'atelier-experience':
      return <Compass className="w-4 h-4 text-[#C9A56A]" />;
    case 'why-atelier':
      return <ImageIcon className="w-4 h-4 text-[#C9A56A]" />;
    case 'designers-architects':
      return <Building2 className="w-4 h-4 text-[#C9A56A]" />;
    case 'final-cta':
      return <Layout className="w-4 h-4 text-[#C9A56A]" />;
    case 'featured-projects':
      return <Building2 className="w-4 h-4 text-[#C9A56A]" />;
    case 'brands-marquee':
      return <Globe className="w-4 h-4 text-[#C9A56A]" />;
    case 'testimonials':
      return <Quote className="w-4 h-4 text-[#C9A56A]" />;
  }
};

interface AdminHomeLayoutModuleProps {
  layout: HomeSectionLayoutSettings;
  adminEmail: string;
  sectionStatuses?: Partial<Record<HomeSectionId, { moduleHidden?: boolean; detailText?: string }>>;
  onUpdate: (updated: HomeSectionLayoutSettings) => void;
  onAuditLogRefresh: () => Promise<void>;
  onNavigateTab?: (tab: AdminTabTarget, siteSubtab?: SiteBrandingSubtab) => void;
}

/**
 * Master Admin drag-and-drop Homepage Layout Orchestrator.
 * Lets admins dynamically reorder all homepage sections via HTML5 Drag & Drop or arrow controls,
 * toggle per-section visibility, inspect surface transitions, and sync live to storefront + Supabase.
 */
export const AdminHomeLayoutModule: React.FC<AdminHomeLayoutModuleProps> = ({
  layout,
  adminEmail,
  sectionStatuses = {},
  onUpdate,
  onAuditLogRefresh,
  onNavigateTab
}) => {
  const { showToast } = useToast();
  const [sections, setSections] = useState<HomeSectionLayoutItem[]>(
    () => normalizeHomeSectionLayout(layout).sections
  );
  const [draggedId, setDraggedId] = useState<HomeSectionId | null>(null);
  const [dragOverId, setDragOverId] = useState<HomeSectionId | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSections(normalizeHomeSectionLayout(layout).sections);
  }, [layout]);

  const persistSections = async (
    nextSections: HomeSectionLayoutItem[],
    action: string,
    details: string,
    toastTitle: string,
    toastMessage: string,
    toastType: 'success' | 'add' | 'delete' | 'info' = 'success'
  ) => {
    const indexed = nextSections.map((item, idx) => ({
      ...item,
      order: idx
    }));
    const payload: HomeSectionLayoutSettings = {
      id: 'default',
      sections: indexed,
      updatedAt: new Date().toISOString()
    };

    setSections(indexed);
    onUpdate(payload);
    setIsSaving(true);
    try {
      await saveHomeSectionLayoutToSupabase(payload, adminEmail, action, details);
      await onAuditLogRefresh();
      showToast(toastTitle, toastMessage, toastType);
    } catch {
      showToast('Sync Error', 'Unable to persist homepage layout changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const reorderAndSave = async (
    fromIndex: number,
    toIndex: number,
    movedId: HomeSectionId
  ) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= sections.length ||
      toIndex >= sections.length
    ) {
      return;
    }

    const updated = [...sections];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);

    const meta = SECTION_META[movedId];
    await persistSections(
      updated,
      'HOME_SECTION_MOVED',
      `Moved "${meta.title}" from position #${fromIndex + 1} to #${toIndex + 1}.`,
      'Homepage Order Updated',
      `Moved "${meta.title}" to position #${toIndex + 1} live.`
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: HomeSectionId) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetId: HomeSectionId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== targetId) {
      setDragOverId(targetId);
    }
  };

  const handleDragLeave = (targetId: HomeSectionId) => {
    if (dragOverId === targetId) {
      setDragOverId(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetId: HomeSectionId) => {
    e.preventDefault();
    const sourceId = (draggedId || e.dataTransfer.getData('text/plain')) as HomeSectionId;
    setDraggedId(null);
    setDragOverId(null);

    if (!sourceId || sourceId === targetId) return;

    const fromIndex = sections.findIndex((s) => s.id === sourceId);
    const toIndex = sections.findIndex((s) => s.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    await reorderAndSave(fromIndex, toIndex, sourceId);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleMoveStep = async (index: number, delta: -1 | 1) => {
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    await reorderAndSave(index, targetIndex, sections[index].id);
  };

  const handleToggleVisibility = async (index: number) => {
    const target = sections[index];
    const nextVisible = target.isVisible === false;
    const updated = sections.map((s, idx) =>
      idx === index ? { ...s, isVisible: nextVisible } : s
    );
    const meta = SECTION_META[target.id];

    await persistSections(
      updated,
      nextVisible ? 'HOME_SECTION_SHOWN' : 'HOME_SECTION_HIDDEN',
      `${nextVisible ? 'Enabled' : 'Hidden'} "${meta.title}" on the homepage layout.`,
      nextVisible ? 'Section Shown' : 'Section Hidden',
      `"${meta.title}" is now ${nextVisible ? 'visible' : 'hidden'} on the homepage.`,
      'info'
    );
  };

  const handleRestoreDefaultOrder = async () => {
    setIsSaving(true);
    try {
      const restored = await restoreDefaultHomeSectionLayoutInSupabase(adminEmail);
      setSections(restored.sections);
      onUpdate(restored);
      await onAuditLogRefresh();
      showToast(
        'Default Sequence Restored',
        'All 10 homepage sections returned to their default architectural order.',
        'success'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const visibleCount = sections.filter(
    (s) => s.isVisible !== false && !sectionStatuses[s.id]?.moduleHidden
  ).length;

  let activeOrderCounter = 0;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Control Strip */}
      <div className="bg-[#163129] border border-[#C9A56A]/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#C9A56A] font-semibold">
            <Layout className="w-4 h-4" />
            <span>Dynamic Homepage Architect</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            Homepage Section Drag &amp; Drop Order
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9A90] max-w-2xl font-light">
            Drag any card by its grip handle to dynamically rearrange the live homepage vertical sequence. Full-bleed transitions and spacing automatically adapt when you drop.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-[#0F1714] border border-[#C9A56A]/35 text-xs font-mono text-[#E9DFD1] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {visibleCount} / {sections.length} Active on Home
            </span>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleRestoreDefaultOrder}
            className="px-4 py-2.5 rounded-full border border-white/20 hover:border-[#C9A56A] text-xs font-bold uppercase tracking-wider text-white/85 hover:text-[#C9A56A] flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Default Order</span>
          </button>
        </div>
      </div>

      {/* Interactive Live Vertical Flow Strip */}
      <div className="bg-[#163129]/80 border border-[#C9A56A]/25 rounded-2xl p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#C9A56A] font-semibold">
          <span>Resulting Live Storefront Sequence</span>
          <span className="text-[#8C9A90] font-normal">Top of page &rarr; Footer</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {sections
            .filter((s) => s.isVisible !== false && !sectionStatuses[s.id]?.moduleHidden)
            .map((item, idx) => {
              const meta = SECTION_META[item.id];
              return (
                <div
                  key={item.id}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] border ${
                    meta.surfaceTone === 'dark'
                      ? 'bg-[#0F1714] text-[#E9DFD1] border-[#C9A56A]/45'
                      : meta.surfaceTone === 'cream'
                        ? 'bg-[#F5EFE6] text-[#0F1714] border-[#C9A56A]/55'
                        : 'bg-white/10 text-white border-white/20'
                  }`}
                >
                  <span className="font-mono font-bold text-[#C9A56A]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-medium truncate max-w-[160px]">{meta.title}</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Draggable Section Rows */}
      <div className="space-y-3">
        {sections.map((item, index) => {
          const meta = SECTION_META[item.id];
          const status = sectionStatuses[item.id];
          const isModuleHidden = Boolean(status?.moduleHidden);
          const isEffectivelyVisible = item.isVisible !== false && !isModuleHidden;
          if (isEffectivelyVisible) {
            activeOrderCounter += 1;
          }

          const isDragged = draggedId === item.id;
          const isDropTarget = dragOverId === item.id && draggedId !== item.id;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={() => handleDragLeave(item.id)}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              className={`group rounded-2xl p-4 sm:p-5 border transition-all duration-200 select-none flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-grab active:cursor-grabbing ${
                isDragged
                  ? 'opacity-45 border-dashed border-[#C9A56A] bg-[#0F1714]/70 scale-[0.99]'
                  : isDropTarget
                    ? 'border-[#C9A56A] bg-[#C9A56A]/15 ring-2 ring-[#C9A56A]/60 shadow-2xl scale-[1.01]'
                    : isEffectivelyVisible
                      ? 'bg-[#163129] border-white/10 hover:border-[#C9A56A]/55 shadow-lg'
                      : 'bg-[#0F1714]/65 border-white/5 opacity-70 hover:opacity-95'
              }`}
            >
              {/* Left Grip + Index + Section Info */}
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                <div
                  className="p-2 rounded-xl bg-[#0F1714] border border-white/10 text-[#C9A56A]/80 group-hover:text-[#C9A56A] group-hover:border-[#C9A56A]/45 shrink-0 transition-colors"
                  title="Drag to reorder section"
                >
                  <GripVertical className="w-5 h-5" />
                </div>

                <div
                  className={`w-10 h-10 rounded-full font-serif font-bold text-sm flex items-center justify-center border shrink-0 ${
                    isEffectivelyVisible
                      ? 'bg-[#C9A56A]/15 border-[#C9A56A]/60 text-[#C9A56A]'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {isEffectivelyVisible ? String(activeOrderCounter).padStart(2, '0') : '--'}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center space-x-1.5 text-white font-serif text-lg sm:text-xl font-normal">
                      {renderSectionIcon(item.id)}
                      <span>{meta.title}</span>
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        meta.surfaceTone === 'dark'
                          ? 'bg-[#0F1714] text-[#C9A56A] border-[#C9A56A]/35'
                          : meta.surfaceTone === 'cream'
                            ? 'bg-[#F5EFE6]/15 text-[#F5EFE6] border-[#F5EFE6]/30'
                            : 'bg-white/5 text-[#D4DDD8] border-white/15'
                      }`}
                    >
                      {meta.surfaceLabel}
                    </span>

                    {status?.detailText && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                        {status.detailText}
                      </span>
                    )}

                    {isModuleHidden && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/35">
                        Disabled in Module
                      </span>
                    )}

                    {item.isVisible === false && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-300 border border-red-500/30">
                        Hidden on Home
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#8C9A90] font-light leading-relaxed truncate sm:whitespace-normal">
                    <span className="text-[#C9A56A]/80 font-mono text-[10px] uppercase tracking-wider mr-2">
                      [{meta.eyebrow}]
                    </span>
                    {meta.description}
                  </p>
                </div>
              </div>

              {/* Right Quick Actions (prevent drag interference via stopPropagation) */}
              <div
                className="flex flex-wrap items-center gap-2 shrink-0 pl-12 md:pl-0"
                onMouseDown={(e) => e.stopPropagation()}
                onDragStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <button
                  type="button"
                  disabled={index === 0 || isSaving}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveStep(index, -1);
                  }}
                  title="Move Up"
                  className="p-2 rounded-xl bg-[#0F1714] border border-white/10 hover:border-[#C9A56A] text-[#E9DFD1] hover:text-[#C9A56A] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={index === sections.length - 1 || isSaving}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveStep(index, 1);
                  }}
                  title="Move Down"
                  className="p-2 rounded-xl bg-[#0F1714] border border-white/10 hover:border-[#C9A56A] text-[#E9DFD1] hover:text-[#C9A56A] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleVisibility(index);
                  }}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                    item.isVisible !== false
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-white/5 border-white/15 text-white/60 hover:text-white'
                  }`}
                >
                  {item.isVisible !== false ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Shown</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                {meta.editTab && onNavigateTab && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab(meta.editTab!.id, meta.editTab!.siteSubtab);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#0F1714] border border-[#C9A56A]/35 hover:bg-[#C9A56A] text-[#C9A56A] hover:text-[#0F1714] text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{meta.editTab.label}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
