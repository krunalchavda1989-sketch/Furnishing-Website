import React, { useEffect, useState } from 'react';
import type { FinalCtaSettings } from '../../types';
import {
  restoreDefaultFinalCtaInSupabase,
  saveFinalCtaToSupabase
} from '../../lib/supabase';
import { useToast } from '../ui/ToastNotification';
import { ImageUploader } from '../ui/ImageUploader';
import { Eye, EyeOff, RotateCcw, Save, Sparkles, Trash2 } from 'lucide-react';

interface AdminFinalCtaModuleProps {
  data: FinalCtaSettings;
  adminEmail: string;
  onUpdate: (updated: FinalCtaSettings) => void;
  onAuditLogRefresh: () => Promise<void>;
  onRequestDelete: (opts: {
    title: string;
    itemName: string;
    itemType: string;
    onConfirm: () => void | Promise<void>;
  }) => void;
}

const PRESET_CTA_BACKDROPS = [
  {
    label: 'Luminous Salon',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85'
  },
  {
    label: 'Architectural Villa',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85'
  }
];

/**
 * Master Admin CMS module for the homepage "FINAL CALL TO ACTION" invitation card.
 */
export const AdminFinalCtaModule: React.FC<AdminFinalCtaModuleProps> = ({
  data,
  adminEmail,
  onUpdate,
  onAuditLogRefresh,
  onRequestDelete
}) => {
  const { showToast } = useToast();
  const [formState, setFormState] = useState<FinalCtaSettings>(data);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormState(data);
  }, [data]);

  const hasUnsavedChanges = JSON.stringify(formState) !== JSON.stringify(data);

  const persist = async (
    next: FinalCtaSettings,
    action: string,
    details: string,
    toastTitle: string,
    toastMessage: string,
    toastType: 'success' | 'delete' | 'info' = 'success'
  ) => {
    setIsSaving(true);
    try {
      setFormState(next);
      onUpdate(next);
      await saveFinalCtaToSupabase(next, adminEmail, action, details);
      await onAuditLogRefresh();
      showToast(toastTitle, toastMessage, toastType);
    } catch {
      showToast('Save Error', 'Unable to save Final Call To Action updates.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned: FinalCtaSettings = {
      ...formState,
      badge: formState.badge.trim(),
      headingPrimary: formState.headingPrimary.trim(),
      headingAccent: formState.headingAccent.trim(),
      description: formState.description.trim(),
      ctaLabel: formState.ctaLabel.trim(),
      backgroundImage: (formState.backgroundImage || '').trim()
    };

    await persist(
      cleaned,
      'FINAL_CTA_UPDATED',
      `Updated Final Call To Action ("${cleaned.headingPrimary} ${cleaned.headingAccent}")`,
      'CTA Section Saved',
      '"Final Call To Action" updated live on the homepage.'
    );
  };

  const handleToggleVisibility = async () => {
    const nextVisible = formState.isVisible === false;
    const next: FinalCtaSettings = { ...formState, isVisible: nextVisible };
    await persist(
      next,
      nextVisible ? 'FINAL_CTA_SHOWN' : 'FINAL_CTA_HIDDEN',
      nextVisible
        ? 'Shown Final Call To Action section on homepage.'
        : 'Hidden Final Call To Action section from homepage.',
      nextVisible ? 'Section Visible' : 'Section Hidden',
      nextVisible
        ? '"Final Call To Action" is now visible on the homepage.'
        : '"Final Call To Action" is hidden from the homepage.',
      'info'
    );
  };

  const handleDeleteSection = () => {
    onRequestDelete({
      title: 'Delete Final Call To Action Section',
      itemName: formState.badge || 'FINAL CALL TO ACTION',
      itemType: 'homepage call-to-action section',
      onConfirm: async () => {
        const cleared: FinalCtaSettings = {
          ...formState,
          badge: '',
          headingPrimary: '',
          headingAccent: '',
          description: '',
          ctaLabel: '',
          backgroundImage: '',
          isVisible: false
        };
        await persist(
          cleared,
          'FINAL_CTA_DELETED',
          'Deleted Final Call To Action section details from homepage.',
          'Section Deleted',
          'Final Call To Action section removed from the homepage.',
          'delete'
        );
      }
    });
  };

  const handleRestoreDefaults = async () => {
    setIsSaving(true);
    try {
      const restored = await restoreDefaultFinalCtaInSupabase(adminEmail);
      setFormState(restored);
      onUpdate(restored);
      await onAuditLogRefresh();
      showToast(
        'Defaults Restored',
        'Restored "Final Call To Action" default invitation content.',
        'success'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <form
        onSubmit={handleSave}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#163129] via-[#0F1714] to-[#163129] border border-[#C9A56A]/30 shadow-2xl space-y-6"
      >
        {/* Top Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-[#C9A56A]/20">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A56A]/15 border border-[#C9A56A]/40 text-[#C9A56A] text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FINAL CALL TO ACTION • SALON INVITATION CMS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Final Call To Action Control Center
            </h2>
            <p className="text-xs sm:text-sm text-[#A6B5AD] max-w-3xl font-light leading-relaxed">
              Update headlines, invitation copy, CTA button text, and optional subtle backdrop texture, or hide or delete the section from the homepage.
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

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-white">Invitation Content &amp; Action Button</h3>
            {hasUnsavedChanges && (
              <span className="text-[11px] font-mono text-amber-300 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30">
                Unsaved changes
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={formState.badge}
                onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
                placeholder="FINAL CALL TO ACTION"
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
                placeholder="Let's Create"
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
                placeholder="Something Beautiful."
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
                placeholder="Book Your Furnishing Consultation"
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold text-[#C9A56A]">
                  Invitation Description
                </label>
                {formState.description && (
                  <button
                    type="button"
                    onClick={() => setFormState({ ...formState, description: '' })}
                    className="text-[11px] text-red-300 hover:text-red-200 inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Text</span>
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                placeholder="Whether you have a complete vision or are just beginning to explore ideas, we're here to help you find the perfect furnishings for your space."
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="lg:col-span-5">
              <ImageUploader
                label="Optional Soft Backdrop Image"
                helpText="Optional subtle texture rendered at low opacity behind the cream CTA frame"
                value={formState.backgroundImage || ''}
                onChange={(img) => setFormState({ ...formState, backgroundImage: img })}
                aspectRatio="video"
                presetSuggestions={PRESET_CTA_BACKDROPS}
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
            <span>{isSaving ? 'Saving...' : 'Save & Publish Final CTA'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

