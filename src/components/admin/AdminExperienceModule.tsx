import React, { useState, useEffect } from 'react';
import type { AtelierExperienceSettings, AtelierExperienceStep } from '../../types';
import {
  deleteAtelierExperienceStepInSupabase,
  restoreDefaultAtelierExperienceInSupabase,
  saveAtelierExperienceToSupabase
} from '../../lib/supabase';
import { useToast } from '../ui/ToastNotification';
import {
  ArrowDown,
  ArrowUp,
  Compass,
  Edit,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';

interface AdminExperienceModuleProps {
  experience: AtelierExperienceSettings;
  adminEmail: string;
  onUpdateExperience: (updated: AtelierExperienceSettings) => void;
  onAuditLogRefresh: () => Promise<void>;
  onRequestDelete: (opts: {
    title: string;
    itemName: string;
    itemType: string;
    onConfirm: () => void | Promise<void>;
  }) => void;
}

/**
 * Master Admin CMS module to edit section header copy, manage process stages,
 * and delete individual steps or remove the section from the homepage.
 */
export const AdminExperienceModule: React.FC<AdminExperienceModuleProps> = ({
  experience,
  adminEmail,
  onUpdateExperience,
  onAuditLogRefresh,
  onRequestDelete
}) => {
  const { showToast } = useToast();
  const [formState, setFormState] = useState<AtelierExperienceSettings>(experience);
  const [isSaving, setIsSaving] = useState(false);

  // Add / Edit step modal state
  const [showStepModal, setShowStepModal] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [stepForm, setStepForm] = useState<AtelierExperienceStep>({
    id: '',
    number: '',
    title: '',
    description: '',
    isVisible: true,
    order: 1
  });

  useEffect(() => {
    setFormState(experience);
  }, [experience]);

  const hasUnsavedHeaderChanges =
    formState.badge !== experience.badge ||
    formState.headingPrimary !== experience.headingPrimary ||
    formState.headingAccent !== experience.headingAccent ||
    formState.introText !== experience.introText ||
    formState.ctaLabel !== experience.ctaLabel ||
    formState.isVisible !== experience.isVisible;

  const persistExperience = async (
    next: AtelierExperienceSettings,
    action: string,
    details: string,
    toastTitle: string,
    toastMessage: string,
    toastType: 'success' | 'add' | 'delete' | 'info' = 'success'
  ) => {
    setIsSaving(true);
    try {
      setFormState(next);
      onUpdateExperience(next);
      await saveAtelierExperienceToSupabase(next, adminEmail, action, details);
      await onAuditLogRefresh();
      showToast(toastTitle, toastMessage, toastType);
    } catch {
      showToast('Save Error', 'Unable to save Atelier Experience updates.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHeaderSection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned: AtelierExperienceSettings = {
      ...formState,
      badge: formState.badge.trim(),
      headingPrimary: formState.headingPrimary.trim(),
      headingAccent: formState.headingAccent.trim(),
      introText: formState.introText.trim(),
      ctaLabel: (formState.ctaLabel || '').trim()
    };

    await persistExperience(
      cleaned,
      'EXPERIENCE_HEADER_UPDATED',
      `Updated Atelier Experience section copy: "${cleaned.headingPrimary} ${cleaned.headingAccent}"`,
      'Experience Section Saved',
      'Homepage "The Atelier Experience" section updated cleanly.'
    );
  };

  const handleToggleSectionVisibility = async () => {
    const nextVisible = formState.isVisible === false;
    const next: AtelierExperienceSettings = { ...formState, isVisible: nextVisible };
    await persistExperience(
      next,
      nextVisible ? 'EXPERIENCE_SECTION_SHOWN' : 'EXPERIENCE_SECTION_HIDDEN',
      nextVisible
        ? 'Restored visibility of The Atelier Experience section on homepage.'
        : 'Hidden The Atelier Experience section from homepage.',
      nextVisible ? 'Section Visible' : 'Section Hidden',
      nextVisible
        ? 'The Atelier Experience section is now live on the homepage.'
        : 'The Atelier Experience section is hidden from the homepage.',
      'info'
    );
  };

  const handleDeleteSectionContent = () => {
    onRequestDelete({
      title: 'Delete The Atelier Experience Section',
      itemName: formState.badge || 'THE ATELIER EXPERIENCE',
      itemType: 'homepage section',
      onConfirm: async () => {
        const cleared: AtelierExperienceSettings = {
          ...formState,
          badge: '',
          headingPrimary: '',
          headingAccent: '',
          introText: '',
          ctaLabel: '',
          isVisible: false,
          steps: []
        };
        await persistExperience(
          cleared,
          'EXPERIENCE_SECTION_DELETED',
          'Deleted Atelier Experience section details and all stages from homepage.',
          'Section Deleted',
          'The Atelier Experience section has been removed from the homepage.',
          'delete'
        );
      }
    });
  };

  const handleRestoreDefaults = async () => {
    setIsSaving(true);
    try {
      const restored = await restoreDefaultAtelierExperienceInSupabase(adminEmail);
      setFormState(restored);
      onUpdateExperience(restored);
      await onAuditLogRefresh();
      showToast(
        'Defaults Restored',
        'Restored "The Atelier Experience" section and its 4 core stages.',
        'success'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAddStep = () => {
    const nextNum = String(formState.steps.length + 1).padStart(2, '0');
    setEditingStepId(null);
    setStepForm({
      id: `step-${Date.now()}`,
      number: nextNum,
      title: '',
      description: '',
      isVisible: true,
      order: formState.steps.length + 1
    });
    setShowStepModal(true);
  };

  const handleOpenEditStep = (step: AtelierExperienceStep, idx: number) => {
    setEditingStepId(step.id);
    setStepForm({
      ...step,
      number: step.number?.trim() || String(idx + 1).padStart(2, '0'),
      isVisible: step.isVisible !== false
    });
    setShowStepModal(true);
  };

  const handleSaveStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = stepForm.title.trim();
    const description = stepForm.description.trim();
    if (!title || !description) {
      showToast('Missing Fields', 'Please enter both step title and description.', 'error');
      return;
    }

    const isEditing = Boolean(editingStepId);
    const cleanedStep: AtelierExperienceStep = {
      ...stepForm,
      number:
        stepForm.number.trim() ||
        String(isEditing ? formState.steps.findIndex((s) => s.id === editingStepId) + 1 : formState.steps.length + 1).padStart(2, '0'),
      title,
      description,
      isVisible: stepForm.isVisible !== false
    };

    const nextSteps = isEditing
      ? formState.steps.map((s) => (s.id === editingStepId ? cleanedStep : s))
      : [...formState.steps, cleanedStep];

    const nextSettings: AtelierExperienceSettings = {
      ...formState,
      isVisible: true,
      steps: nextSteps
    };

    setShowStepModal(false);
    await persistExperience(
      nextSettings,
      isEditing ? 'EXPERIENCE_STEP_UPDATED' : 'EXPERIENCE_STEP_ADDED',
      `${isEditing ? 'Updated' : 'Added'} Atelier Experience stage "${cleanedStep.number} — ${cleanedStep.title}"`,
      isEditing ? 'Stage Updated' : 'Stage Added',
      `"${cleanedStep.number} — ${cleanedStep.title}" saved successfully.`,
      isEditing ? 'success' : 'add'
    );
  };

  const handleDeleteStep = (step: AtelierExperienceStep, idx: number) => {
    const label = `${step.number || String(idx + 1).padStart(2, '0')} — ${step.title}`;
    onRequestDelete({
      title: 'Delete Experience Stage',
      itemName: label,
      itemType: 'atelier experience stage',
      onConfirm: async () => {
        setIsSaving(true);
        try {
          const updated = await deleteAtelierExperienceStepInSupabase(
            step.id,
            label,
            formState,
            adminEmail
          );
          setFormState(updated);
          onUpdateExperience(updated);
          await onAuditLogRefresh();
          showToast('Stage Deleted', `Removed "${label}" cleanly.`, 'delete');
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleToggleStepVisibility = async (stepId: string) => {
    const nextSteps = formState.steps.map((s) =>
      s.id === stepId ? { ...s, isVisible: s.isVisible === false } : s
    );
    const next: AtelierExperienceSettings = { ...formState, steps: nextSteps };
    await persistExperience(
      next,
      'EXPERIENCE_STEP_VISIBILITY_TOGGLED',
      `Toggled visibility for Atelier Experience stage (${stepId}).`,
      'Visibility Updated',
      'Process stage visibility synced with homepage.',
      'info'
    );
  };

  const handleMoveStep = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= formState.steps.length) return;
    const reordered = [...formState.steps];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    const normalized = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    const next: AtelierExperienceSettings = { ...formState, steps: normalized };
    await persistExperience(
      next,
      'EXPERIENCE_STEPS_REORDERED',
      `Reordered Atelier Experience stage "${moved.title}" to position ${targetIdx + 1}.`,
      'Stage Order Updated',
      `Moved "${moved.title}" to position ${targetIdx + 1}.`,
      'info'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Toolbar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#163129] via-[#0F1714] to-[#163129] border border-[#C9A56A]/30 shadow-2xl space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-[#C9A56A]/20">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A56A]/15 border border-[#C9A56A]/40 text-[#C9A56A] text-[10px] font-bold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              <span>THE ATELIER EXPERIENCE • HOMEPAGE PROCESS CMS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Atelier Experience Control Center
            </h2>
            <p className="text-xs sm:text-sm text-[#A6B5AD] max-w-3xl font-light leading-relaxed">
              Update section headlines, intro quote copy, individual process stages (Discover, Curate, Customise, Transform), or delete stages or the entire section block from the homepage.
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

        {/* Section Header & Manifesto Copy Form */}
        <form onSubmit={handleSaveHeaderSection} className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A56A]" />
              <span>Section Header &amp; Editorial Copy</span>
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
                placeholder="THE ATELIER EXPERIENCE"
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
                placeholder="Your Vision."
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
                placeholder="Our Craftsmanship."
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                Consultation Button Label
              </label>
              <input
                type="text"
                value={formState.ctaLabel || ''}
                onChange={(e) => setFormState({ ...formState, ctaLabel: e.target.value })}
                placeholder="Begin Your Private Consultation"
                className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
              Philosophy / Intro Statement
            </label>
            <textarea
              rows={2}
              value={formState.introText}
              onChange={(e) => setFormState({ ...formState, introText: e.target.value })}
              placeholder="We believe a beautifully furnished space begins with understanding you."
              className="w-full p-3 rounded-xl bg-[#0F1714]/70 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
            />
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

      {/* Process Steps Editor Grid */}
      <div className="bg-[#163129]/60 backdrop-blur-xl border border-[#C9A56A]/25 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="font-serif text-2xl text-white">
              Experience Process Stages ({formState.steps.length})
            </h3>
            <p className="text-xs text-[#8C9A90] mt-0.5">
              Edit, reorder, hide, add, or permanently delete individual stage blocks rendered under THE ATELIER EXPERIENCE.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddStep}
            className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all inline-flex items-center space-x-2 shadow-lg cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Process Stage</span>
          </button>
        </div>

        {formState.steps.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0F1714]/60 border border-dashed border-[#C9A56A]/40 text-center space-y-4">
            <p className="text-sm text-[#E9DFD1]">
              All process stages have been removed or the section was cleared.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenAddStep}
                className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all inline-flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Stage</span>
              </button>
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center space-x-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#C9A56A]" />
                <span>Restore Default 4 Stages</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {formState.steps.map((step, idx) => {
              const displayNum = step.number?.trim() || String(idx + 1).padStart(2, '0');
              const isHidden = step.isVisible === false;

              return (
                <div
                  key={step.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isHidden
                      ? 'bg-black/40 border-dashed border-white/15 opacity-70'
                      : 'bg-[#0F1714]/75 border-white/10 hover:border-[#C9A56A]/60 shadow-lg'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-8 h-8 rounded-full bg-[#C9A56A] text-[#0F1714] font-serif font-bold text-xs flex items-center justify-center shadow">
                          {displayNum}
                        </span>
                        <h4 className="font-serif text-xl text-white">
                          <span className="text-[#C9A56A] mr-1">{displayNum} —</span>
                          {step.title}
                        </h4>
                      </div>

                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                          isHidden
                            ? 'bg-red-500/15 text-red-300 border-red-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isHidden ? 'Hidden' : 'Live'}
                      </span>
                    </div>

                    <p className="text-xs text-[#B3C0B8] font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveStep(idx, -1)}
                        disabled={idx === 0 || isSaving}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveStep(idx, 1)}
                        disabled={idx === formState.steps.length - 1 || isSaving}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStepVisibility(step.id)}
                        disabled={isSaving}
                        title={isHidden ? 'Show Stage' : 'Hide Stage'}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#E9DFD1] border border-white/10 inline-flex items-center space-x-1 cursor-pointer"
                      >
                        {isHidden ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-300" />}
                        <span>{isHidden ? 'Show' : 'Hide'}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditStep(step, idx)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 inline-flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#C9A56A]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStep(step, idx)}
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

      {/* Add / Edit Stage Modal */}
      {showStepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#163129] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {editingStepId ? `Edit Stage ${stepForm.number || ''}` : 'Add Process Stage'}
                </h3>
                <p className="text-xs text-[#E9DFD1]/80">
                  Update number, title, and narrative displayed under THE ATELIER EXPERIENCE.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStepModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Step Number
                  </label>
                  <input
                    type="text"
                    value={stepForm.number}
                    onChange={(e) => setStepForm({ ...stepForm, number: e.target.value })}
                    placeholder="e.g. 01"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    Stage Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={stepForm.title}
                    onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                    placeholder="e.g. Discover"
                    className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={stepForm.description}
                  onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                  placeholder="Describe what happens during this bespoke furnishing stage..."
                  className="w-full p-3 rounded-xl bg-[#0F1714]/60 border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none leading-relaxed"
                />
              </div>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#0F1714]/50 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stepForm.isVisible !== false}
                  onChange={(e) => setStepForm({ ...stepForm, isVisible: e.target.checked })}
                  className="accent-[#C9A56A] w-4 h-4 rounded"
                />
                <span className="text-xs text-[#E9DFD1]">Display this stage on the live homepage</span>
              </label>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowStepModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-xs text-white hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] cursor-pointer shadow-lg"
                >
                  {editingStepId ? 'Save Stage' : 'Create Stage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
