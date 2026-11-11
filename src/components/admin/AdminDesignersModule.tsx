import React, { useEffect, useState } from 'react';
import type { DesignersArchitectsSettings } from '../../types';
import {
  restoreDefaultDesignersArchitectsInSupabase,
  saveDesignersArchitectsToSupabase
} from '../../lib/supabase';
import { useToast } from '../ui/ToastNotification';
import { ImageUploader } from '../ui/ImageUploader';
import {
  Compass,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2
} from 'lucide-react';

interface AdminDesignersModuleProps {
  data: DesignersArchitectsSettings;
  adminEmail: string;
  onUpdate: (updated: DesignersArchitectsSettings) => void;
  onAuditLogRefresh: () => Promise<void>;
  onRequestDelete: (opts: {
    title: string;
    itemName: string;
    itemType: string;
    onConfirm: () => void | Promise<void>;
  }) => void;
}

const PRESET_TRADE_IMAGES = [
  {
    label: 'Architectural Interior',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85'
  },
  {
    label: 'Material Consultation',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85'
  },
  {
    label: 'Drapery Studio',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85'
  },
  {
    label: 'Textiles Archive',
    url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1400&q=85'
  }
];

/**
 * Master Admin CMS module for the "FOR DESIGNERS & ARCHITECTS" homepage trade collaboration section.
 * Allows editing headlines, CTA copy, uploaded photography, adding/editing/deleting individual
 * paragraphs & highlight tags, toggling homepage visibility, or deleting the entire section.
 */
export const AdminDesignersModule: React.FC<AdminDesignersModuleProps> = ({
  data,
  adminEmail,
  onUpdate,
  onAuditLogRefresh,
  onRequestDelete
}) => {
  const { showToast } = useToast();
  const [formState, setFormState] = useState<DesignersArchitectsSettings>(data);
  const [newHighlight, setNewHighlight] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormState(data);
  }, [data]);

  const hasUnsavedChanges = JSON.stringify(formState) !== JSON.stringify(data);

  const persist = async (
    next: DesignersArchitectsSettings,
    action: string,
    details: string,
    toastTitle: string,
    toastMessage: string,
    toastType: 'success' | 'add' | 'delete' | 'info' = 'success'
  ) => {
    setIsSaving(true);
    try {
      setFormState(next);
      onUpdate(next);
      await saveDesignersArchitectsToSupabase(next, adminEmail, action, details);
      await onAuditLogRefresh();
      showToast(toastTitle, toastMessage, toastType);
    } catch {
      showToast('Save Error', 'Unable to save For Designers & Architects updates.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned: DesignersArchitectsSettings = {
      ...formState,
      badge: formState.badge.trim(),
      headingPrimary: formState.headingPrimary.trim(),
      headingAccent: formState.headingAccent.trim(),
      paragraphs: formState.paragraphs.map((p) => p.trim()).filter((p) => p.length > 0),
      highlights: (formState.highlights || []).map((h) => h.trim()).filter((h) => h.length > 0),
      ctaLabel: formState.ctaLabel.trim(),
      imageCaption: (formState.imageCaption || '').trim()
    };

    await persist(
      cleaned,
      'DESIGNERS_SECTION_UPDATED',
      `Updated For Designers & Architects ("${cleaned.headingPrimary} ${cleaned.headingAccent}")`,
      'Section Saved',
      '"For Designers & Architects" updated live on the homepage.'
    );
  };

  const handleToggleVisibility = async () => {
    const nextVisible = formState.isVisible === false;
    const next: DesignersArchitectsSettings = { ...formState, isVisible: nextVisible };
    await persist(
      next,
      nextVisible ? 'DESIGNERS_SECTION_SHOWN' : 'DESIGNERS_SECTION_HIDDEN',
      nextVisible
        ? 'Shown For Designers & Architects section on homepage.'
        : 'Hidden For Designers & Architects section from homepage.',
      nextVisible ? 'Section Visible' : 'Section Hidden',
      nextVisible
        ? '"For Designers & Architects" is now displayed on the homepage.'
        : '"For Designers & Architects" is hidden from the homepage.',
      'info'
    );
  };

  const handleDeleteSection = () => {
    onRequestDelete({
      title: 'Delete For Designers & Architects Section',
      itemName: formState.badge || 'FOR DESIGNERS & ARCHITECTS',
      itemType: 'homepage trade section',
      onConfirm: async () => {
        const cleared: DesignersArchitectsSettings = {
          ...formState,
          badge: '',
          headingPrimary: '',
          headingAccent: '',
          paragraphs: [],
          highlights: [],
          ctaLabel: '',
          imageCaption: '',
          isVisible: false
        };
        await persist(
          cleared,
          'DESIGNERS_SECTION_DELETED',
          'Deleted For Designers & Architects section details from homepage.',
          'Section Deleted',
          'For Designers & Architects section removed from the homepage.',
          'delete'
        );
      }
    });
  };

  const handleRestoreDefaults = async () => {
    setIsSaving(true);
    try {
      const restored = await restoreDefaultDesignersArchitectsInSupabase(adminEmail);
      setFormState(restored);
      onUpdate(restored);
      await onAuditLogRefresh();
      showToast(
        'Defaults Restored',
        'Restored "For Designers & Architects" trade collaboration content.',
        'success'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleParagraphChange = (idx: number, val: string) => {
    const updated = [...formState.paragraphs];
    updated[idx] = val;
    setFormState({ ...formState, paragraphs: updated });
  };

  const handleAddParagraph = () => {
    setFormState({ ...formState, paragraphs: [...formState.paragraphs, ''] });
  };

  const handleDeleteParagraph = (idx: number) => {
    onRequestDelete({
      title: 'Delete Narrative Paragraph',
      itemName: `Paragraph ${idx + 1}`,
      itemType: 'narrative paragraph',
      onConfirm: async () => {
        const nextParagraphs = formState.paragraphs.filter((_, i) => i !== idx);
        const next: DesignersArchitectsSettings = { ...formState, paragraphs: nextParagraphs };
        await persist(
          next,
          'DESIGNERS_PARAGRAPH_DELETED',
          `Deleted paragraph ${idx + 1} from For Designers & Architects.`,
          'Paragraph Deleted',
          `Removed Paragraph ${idx + 1}.`,
          'delete'
        );
      }
    });
  };

  const handleAddHighlight = () => {
    const trimmed = newHighlight.trim();
    if (!trimmed) return;
    setFormState({
      ...formState,
      highlights: [...(formState.highlights || []), trimmed]
    });
    setNewHighlight('');
  };

  const handleDeleteHighlight = (idx: number) => {
    const label = (formState.highlights || [])[idx] || `Tag ${idx + 1}`;
    onRequestDelete({
      title: 'Delete Trade Highlight Tag',
      itemName: label,
      itemType: 'trade highlight',
      onConfirm: async () => {
        const nextHighlights = (formState.highlights || []).filter((_, i) => i !== idx);
        const next: DesignersArchitectsSettings = { ...formState, highlights: nextHighlights };
        await persist(
          next,
          'DESIGNERS_HIGHLIGHT_DELETED',
          `Removed trade highlight tag "${label}".`,
          'Highlight Deleted',
          `Removed "${label}".`,
          'delete'
        );
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <form
        onSubmit={handleSaveAll}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#163129] via-[#0F1714] to-[#163129] border border-[#C9A56A]/30 shadow-2xl space-y-6"
      >
        {/* Top Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-[#C9A56A]/20">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A56A]/15 border border-[#C9A56A]/40 text-[#C9A56A] text-[10px] font-bold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              <span>FOR DESIGNERS &amp; ARCHITECTS • TRADE COLLABORATION CMS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Designers &amp; Architects Control Center
            </h2>
            <p className="text-xs sm:text-sm text-[#A6B5AD] max-w-3xl font-light leading-relaxed">
              Update headings, trade collaboration paragraphs, highlight chips, and showcase photography, or delete individual blocks or the full homepage section.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleVisibility}
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
              onClick={handleDeleteSection}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/35 text-xs text-red-300 font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Section</span>
            </button>
          </div>
        </div>

        {/* Headings & Button Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A56A]" />
              <span>Section Identity &amp; CTA Details</span>
            </h3>
            {hasUnsavedChanges && (
              <span className="text-[11px] font-mono text-amber-300 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30">
                Unsaved changes
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
                placeholder="FOR DESIGNERS & ARCHITECTS"
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
                placeholder="A Creative Partner for"
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
                placeholder="Inspired Interiors"
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                Button Text
              </label>
              <input
                type="text"
                value={formState.ctaLabel}
                onChange={(e) => setFormState({ ...formState, ctaLabel: e.target.value })}
                placeholder="Collaborate With Us"
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2-Col Split: Narrative Paragraphs & Showcase Photo Uploader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Paragraphs + Highlights */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#C9A56A]">
                Trade Collaboration Paragraphs ({formState.paragraphs.length})
              </label>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="px-3 py-1.5 rounded-lg bg-[#C9A56A]/15 border border-[#C9A56A]/40 text-[#C9A56A] hover:bg-[#C9A56A] hover:text-[#0F1714] text-xs font-bold inline-flex items-center space-x-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paragraph</span>
              </button>
            </div>

            {formState.paragraphs.length === 0 ? (
              <div className="p-5 rounded-2xl bg-[#0F1714]/60 border border-dashed border-white/15 text-xs text-[#8C9A90] text-center">
                No narrative paragraphs configured. Click &ldquo;Add Paragraph&rdquo; to add trade copy.
              </div>
            ) : (
              <div className="space-y-3">
                {formState.paragraphs.map((para, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0F1714]/70 border border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A56A]">
                        Paragraph {String(idx + 1).padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteParagraph(idx)}
                        className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-[11px] font-semibold border border-red-500/30 inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={para}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/35 border border-white/10 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Highlight Chips */}
            <div className="space-y-3 pt-2">
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#C9A56A] block">
                Specification Highlight Chips
              </label>
              <div className="flex flex-wrap gap-2">
                {(formState.highlights || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-[#0F1714] border border-[#C9A56A]/35 text-xs text-[#E9DFD1] inline-flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(idx)}
                      title={`Delete "${tag}"`}
                      className="text-red-300 hover:text-red-200 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                  placeholder="Add highlight e.g. Hospitality Suites"
                  className="flex-1 p-2.5 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#C9A56A] hover:text-[#0F1714] text-xs font-bold text-white border border-white/15 cursor-pointer transition-all"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Right Image Uploader & Caption */}
          <div className="lg:col-span-5 space-y-4">
            <ImageUploader
              label="Trade Studio Photography"
              helpText="Upload architectural interior image or choose URL / presets"
              value={formState.heroImage}
              onChange={(img) => setFormState({ ...formState, heroImage: img })}
              aspectRatio="video"
              presetSuggestions={PRESET_TRADE_IMAGES}
            />

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                Image Overlay Caption
              </label>
              <input
                type="text"
                value={formState.imageCaption || ''}
                onChange={(e) => setFormState({ ...formState, imageCaption: e.target.value })}
                placeholder="Residential & Commercial Trade Collaborations"
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#C9A56A] via-[#E6C894] to-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all inline-flex items-center space-x-2 shadow-xl cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish Trade Section'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

