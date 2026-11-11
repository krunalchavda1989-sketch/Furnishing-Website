import React, { useState, useEffect } from 'react';
import type { WhyAtelierPillar, WhyAtelierSettings } from '../../types';
import {
  deleteWhyAtelierPillarInSupabase,
  restoreDefaultWhyAtelierInSupabase,
  saveWhyAtelierToSupabase
} from '../../lib/supabase';
import { useToast } from '../ui/ToastNotification';
import { ImageUploader } from '../ui/ImageUploader';
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';

interface AdminWhyAtelierModuleProps {
  whyData: WhyAtelierSettings;
  adminEmail: string;
  onUpdateWhyData: (updated: WhyAtelierSettings) => void;
  onAuditLogRefresh: () => Promise<void>;
  onRequestDelete: (opts: {
    title: string;
    itemName: string;
    itemType: string;
    onConfirm: () => void | Promise<void>;
  }) => void;
}

const PRESET_PILLAR_IMAGES = [
  {
    label: 'Bespoke Space',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85'
  },
  {
    label: 'Fabric & Upholstery',
    url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1400&q=85'
  },
  {
    label: 'Tailored Drapery',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85'
  },
  {
    label: 'Layered Interior',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85'
  }
];

/**
 * Master Admin CMS module for "WHY ATELIER LIVING — The Art of Thoughtful Furnishing".
 * Supports updating section copy, uploading pillar photography via ImageUploader,
 * reordering, adding, hiding, and deleting individual pillars or the full section.
 */
export const AdminWhyAtelierModule: React.FC<AdminWhyAtelierModuleProps> = ({
  whyData,
  adminEmail,
  onUpdateWhyData,
  onAuditLogRefresh,
  onRequestDelete
}) => {
  const { showToast } = useToast();
  const [formState, setFormState] = useState<WhyAtelierSettings>(whyData);
  const [isSaving, setIsSaving] = useState(false);

  // Add / Edit Pillar modal state
  const [showPillarModal, setShowPillarModal] = useState(false);
  const [editingPillarId, setEditingPillarId] = useState<string | null>(null);
  const [pillarForm, setPillarForm] = useState<WhyAtelierPillar>({
    id: '',
    number: '',
    title: '',
    description: '',
    image: '',
    imageCaption: '',
    isVisible: true,
    order: 1
  });

  useEffect(() => {
    setFormState(whyData);
  }, [whyData]);

  const hasUnsavedHeaderChanges =
    formState.badge !== whyData.badge ||
    formState.headingPrimary !== whyData.headingPrimary ||
    formState.headingAccent !== whyData.headingAccent ||
    (formState.ctaLabel || '') !== (whyData.ctaLabel || '') ||
    formState.isVisible !== whyData.isVisible;

  const persistSettings = async (
    next: WhyAtelierSettings,
    action: string,
    details: string,
    toastTitle: string,
    toastMessage: string,
    toastType: 'success' | 'add' | 'delete' | 'info' = 'success'
  ) => {
    setIsSaving(true);
    try {
      setFormState(next);
      onUpdateWhyData(next);
      await saveWhyAtelierToSupabase(next, adminEmail, action, details);
      await onAuditLogRefresh();
      showToast(toastTitle, toastMessage, toastType);
    } catch {
      showToast('Save Error', 'Unable to save Why Atelier Living updates.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHeaderSection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned: WhyAtelierSettings = {
      ...formState,
      badge: formState.badge.trim(),
      headingPrimary: formState.headingPrimary.trim(),
      headingAccent: formState.headingAccent.trim(),
      ctaLabel: (formState.ctaLabel || '').trim()
    };

    await persistSettings(
      cleaned,
      'WHY_ATELIER_HEADER_UPDATED',
      `Updated Why Atelier Living header: "${cleaned.headingPrimary} ${cleaned.headingAccent}"`,
      'Section Saved',
      'Homepage "Why Atelier Living" header copy updated cleanly.'
    );
  };

  const handleToggleSectionVisibility = async () => {
    const nextVisible = formState.isVisible === false;
    const next: WhyAtelierSettings = { ...formState, isVisible: nextVisible };
    await persistSettings(
      next,
      nextVisible ? 'WHY_ATELIER_SHOWN' : 'WHY_ATELIER_HIDDEN',
      nextVisible
        ? 'Enabled visibility of Why Atelier Living section on homepage.'
        : 'Hidden Why Atelier Living section from homepage.',
      nextVisible ? 'Section Visible' : 'Section Hidden',
      nextVisible
        ? 'Why Atelier Living scrolling showcase is now visible on the homepage.'
        : 'Why Atelier Living scrolling showcase is hidden from the homepage.',
      'info'
    );
  };

  const handleDeleteSectionContent = () => {
    onRequestDelete({
      title: 'Delete Why Atelier Living Section',
      itemName: formState.badge || 'WHY ATELIER LIVING',
      itemType: 'homepage scrolling showcase section',
      onConfirm: async () => {
        const cleared: WhyAtelierSettings = {
          ...formState,
          badge: '',
          headingPrimary: '',
          headingAccent: '',
          subtitle: '',
          ctaLabel: '',
          isVisible: false,
          pillars: []
        };
        await persistSettings(
          cleared,
          'WHY_ATELIER_SECTION_DELETED',
          'Deleted Why Atelier Living section details and all pillars from homepage.',
          'Section Deleted',
          'Why Atelier Living section has been removed from the homepage.',
          'delete'
        );
      }
    });
  };

  const handleRestoreDefaults = async () => {
    setIsSaving(true);
    try {
      const restored = await restoreDefaultWhyAtelierInSupabase(adminEmail);
      setFormState(restored);
      onUpdateWhyData(restored);
      await onAuditLogRefresh();
      showToast(
        'Defaults Restored',
        'Restored "Why Atelier Living" and all 5 bespoke scrolling image pillars.',
        'success'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAddPillar = () => {
    const nextNum = String(formState.pillars.length + 1).padStart(2, '0');
    setEditingPillarId(null);
    setPillarForm({
      id: `why-${Date.now()}`,
      number: nextNum,
      title: '',
      description: '',
      image: '',
      imageCaption: '',
      isVisible: true,
      order: formState.pillars.length + 1
    });
    setShowPillarModal(true);
  };

  const handleOpenEditPillar = (pillar: WhyAtelierPillar, idx: number) => {
    setEditingPillarId(pillar.id);
    setPillarForm({
      ...pillar,
      number: pillar.number?.trim() || String(idx + 1).padStart(2, '0'),
      imageCaption: pillar.imageCaption || '',
      isVisible: pillar.isVisible !== false
    });
    setShowPillarModal(true);
  };

  const handleSavePillar = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = pillarForm.title.trim();
    const description = pillarForm.description.trim();
    if (!title || !description) {
      showToast('Missing Fields', 'Please enter both pillar title and description.', 'error');
      return;
    }
    if (!pillarForm.image) {
      showToast('Image Required', 'Please upload an image or provide an image URL for this pillar.', 'error');
      return;
    }

    const isEditing = Boolean(editingPillarId);
    const fallbackNum = isEditing
      ? formState.pillars.findIndex((p) => p.id === editingPillarId) + 1
      : formState.pillars.length + 1;

    const cleanedPillar: WhyAtelierPillar = {
      ...pillarForm,
      number: pillarForm.number.trim() || String(fallbackNum).padStart(2, '0'),
      title,
      description,
      imageCaption: pillarForm.imageCaption?.trim() || title,
      isVisible: pillarForm.isVisible !== false
    };

    const nextPillars = isEditing
      ? formState.pillars.map((p) => (p.id === editingPillarId ? cleanedPillar : p))
      : [...formState.pillars, cleanedPillar];

    const nextSettings: WhyAtelierSettings = {
      ...formState,
      isVisible: true,
      pillars: nextPillars
    };

    setShowPillarModal(false);
    await persistSettings(
      nextSettings,
      isEditing ? 'WHY_ATELIER_PILLAR_UPDATED' : 'WHY_ATELIER_PILLAR_ADDED',
      `${isEditing ? 'Updated' : 'Added'} Why Atelier Living pillar "${cleanedPillar.title}"`,
      isEditing ? 'Pillar Updated' : 'Pillar Added',
      `"${cleanedPillar.title}" saved to scrolling showcase.`,
      isEditing ? 'success' : 'add'
    );
  };

  const handleDeletePillar = (pillar: WhyAtelierPillar) => {
    onRequestDelete({
      title: 'Delete Feature Pillar',
      itemName: pillar.title,
      itemType: 'Why Atelier Living pillar',
      onConfirm: async () => {
        setIsSaving(true);
        try {
          const updated = await deleteWhyAtelierPillarInSupabase(
            pillar.id,
            pillar.title,
            formState,
            adminEmail
          );
          setFormState(updated);
          onUpdateWhyData(updated);
          await onAuditLogRefresh();
          showToast('Pillar Deleted', `Removed "${pillar.title}" cleanly.`, 'delete');
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleTogglePillarVisibility = async (pillarId: string) => {
    const nextPillars = formState.pillars.map((p) =>
      p.id === pillarId ? { ...p, isVisible: p.isVisible === false } : p
    );
    const next: WhyAtelierSettings = { ...formState, pillars: nextPillars };
    await persistSettings(
      next,
      'WHY_ATELIER_PILLAR_VISIBILITY',
      `Toggled homepage visibility for Why Atelier pillar (${pillarId}).`,
      'Visibility Updated',
      'Pillar visibility updated on homepage.',
      'info'
    );
  };

  const handleMovePillar = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= formState.pillars.length) return;
    const reordered = [...formState.pillars];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    const normalized = reordered.map((p, idx) => ({ ...p, order: idx + 1 }));
    const next: WhyAtelierSettings = { ...formState, pillars: normalized };
    await persistSettings(
      next,
      'WHY_ATELIER_REORDERED',
      `Moved Why Atelier pillar "${moved.title}" to position ${targetIdx + 1}.`,
      'Order Updated',
      `Moved "${moved.title}" to position ${targetIdx + 1}.`,
      'info'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Toolbar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#163129] via-[#0F1714] to-[#163129] border border-[#C9A56A]/30 shadow-2xl space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-[#C9A56A]/20">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A56A]/15 border border-[#C9A56A]/40 text-[#C9A56A] text-[10px] font-bold uppercase tracking-widest">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>WHY ATELIER LIVING • SCROLLING GALLERY CMS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Why Atelier Living Control Center
            </h2>
            <p className="text-xs sm:text-sm text-[#A6B5AD] max-w-3xl font-light leading-relaxed">
              Manage headlines, pillar copy, and sticky scroll-synced photography below &ldquo;Your Vision. Our Craftsmanship.&rdquo; on the homepage. Upload new photography or delete individual pillars anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleSectionVisibility}
              disabled={isSaving}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50 ${
                formState.isVisible !== false
                  ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 border-amber-400/50 text-amber-300 hover:bg-amber-500/25'
              }`}
            >
              {formState.isVisible !== false ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Visible on Home</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hidden on Home</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRestoreDefaults}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#E9DFD1] font-semibold flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C9A56A]" />
              <span>Restore Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteSectionContent}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/35 text-xs text-red-300 font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Section</span>
            </button>
          </div>
        </div>

        {/* Section Header Copy Form */}
        <form onSubmit={handleSaveHeaderSection} className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A56A]" />
              <span>Section Title &amp; CTA Details</span>
            </h3>
            {hasUnsavedHeaderChanges && (
              <span className="text-[11px] font-mono text-amber-300 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30">
                Unsaved edits
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                Section Eyebrow Badge
              </label>
              <input
                type="text"
                value={formState.badge}
                onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
                placeholder="WHY ATELIER LIVING"
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                Heading Primary
              </label>
              <input
                type="text"
                value={formState.headingPrimary}
                onChange={(e) => setFormState({ ...formState, headingPrimary: e.target.value })}
                placeholder="The Art of Thoughtful"
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                Heading Italic Gold Accent
              </label>
              <input
                type="text"
                value={formState.headingAccent}
                onChange={(e) => setFormState({ ...formState, headingAccent: e.target.value })}
                placeholder="Furnishing"
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                Consultation CTA Label
              </label>
              <input
                type="text"
                value={formState.ctaLabel || ''}
                onChange={(e) => setFormState({ ...formState, ctaLabel: e.target.value })}
                placeholder="Schedule a Bespoke Consultation"
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A56A] via-[#E6C894] to-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all inline-flex items-center space-x-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save & Publish Header Details'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Scrolling Image Pillars Grid */}
      <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="font-serif text-2xl text-white">
              Scrolling Image Pillars ({formState.pillars.length})
            </h3>
            <p className="text-xs text-[#8C9A90] mt-0.5">
              Each pillar drives a dedicated photograph in the sticky scroll gallery on the homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddPillar}
            className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all inline-flex items-center space-x-2 shadow-lg cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Pillar Block</span>
          </button>
        </div>

        {formState.pillars.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0F1714]/60 border border-dashed border-[#C9A56A]/40 text-center space-y-4">
            <p className="text-sm text-[#E9DFD1]">
              No feature pillars configured for Why Atelier Living.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenAddPillar}
                className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all inline-flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Pillar</span>
              </button>
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center space-x-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#C9A56A]" />
                <span>Restore Default 5 Pillars</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {formState.pillars.map((pillar, idx) => {
              const displayNum = pillar.number?.trim() || String(idx + 1).padStart(2, '0');
              const isHidden = pillar.isVisible === false;

              return (
                <div
                  key={pillar.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isHidden
                      ? 'bg-black/40 border-dashed border-white/15 opacity-70'
                      : 'bg-[#0F1714]/75 border-white/10 hover:border-[#C9A56A]/60 shadow-lg'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-20 h-24 rounded-xl object-cover border border-white/15 shrink-0 shadow"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="w-7 h-7 rounded-full bg-[#C9A56A] text-[#0F1714] font-serif font-bold text-[11px] flex items-center justify-center shrink-0">
                            {displayNum}
                          </span>
                          <h4 className="font-serif text-lg text-white truncate">{pillar.title}</h4>
                        </div>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${
                            isHidden
                              ? 'bg-red-500/15 text-red-300 border-red-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {isHidden ? 'Hidden' : 'Live'}
                        </span>
                      </div>

                      {pillar.imageCaption && (
                        <span className="block text-[10px] uppercase tracking-wider text-[#C9A56A] font-semibold">
                          Caption: {pillar.imageCaption}
                        </span>
                      )}

                      <p className="text-xs text-[#B3C0B8] font-light leading-relaxed line-clamp-3">
                        {pillar.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleMovePillar(idx, -1)}
                        disabled={idx === 0 || isSaving}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMovePillar(idx, 1)}
                        disabled={idx === formState.pillars.length - 1 || isSaving}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePillarVisibility(pillar.id)}
                        disabled={isSaving}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#E9DFD1] border border-white/10 inline-flex items-center space-x-1 cursor-pointer"
                      >
                        {isHidden ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-amber-300" />
                        )}
                        <span>{isHidden ? 'Show' : 'Hide'}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPillar(pillar, idx)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 inline-flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#C9A56A]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePillar(pillar)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-semibold border border-red-500/30 inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Pillar Modal */}
      {showPillarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {editingPillarId ? `Edit Pillar ${pillarForm.number || ''}` : 'Add Feature Pillar'}
                </h3>
                <p className="text-xs text-[#E9DFD1]/80">
                  Update pillar copy and upload showcase photography for the scrolling section.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPillarModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePillar} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Pillar Number
                  </label>
                  <input
                    type="text"
                    value={pillarForm.number}
                    onChange={(e) => setPillarForm({ ...pillarForm, number: e.target.value })}
                    placeholder="e.g. 01"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Pillar Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={pillarForm.title}
                    onChange={(e) => setPillarForm({ ...pillarForm, title: e.target.value })}
                    placeholder="e.g. Bespoke by Nature"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Image Caption / Badge Tag
                </label>
                <input
                  type="text"
                  value={pillarForm.imageCaption || ''}
                  onChange={(e) => setPillarForm({ ...pillarForm, imageCaption: e.target.value })}
                  placeholder="e.g. Tailored Spatial Proportion"
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Showcase Image *"
                helpText="Upload a local photo (JPG, PNG, WEBP) or choose Web URL / Presets"
                value={pillarForm.image}
                onChange={(img) => setPillarForm({ ...pillarForm, image: img })}
                aspectRatio="video"
                presetSuggestions={PRESET_PILLAR_IMAGES}
                required
              />

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={pillarForm.description}
                  onChange={(e) => setPillarForm({ ...pillarForm, description: e.target.value })}
                  placeholder="Solutions personalised to the dimensions, style and character of your space."
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                />
              </div>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#0F1714]/50 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pillarForm.isVisible !== false}
                  onChange={(e) => setPillarForm({ ...pillarForm, isVisible: e.target.checked })}
                  className="accent-[#C9A56A] w-4 h-4 rounded"
                />
                <span className="text-xs text-[#E9DFD1]">Display this pillar on the live homepage</span>
              </label>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPillarModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-xs text-white hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] cursor-pointer shadow-lg"
                >
                  {editingPillarId ? 'Save Pillar' : 'Create Pillar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

