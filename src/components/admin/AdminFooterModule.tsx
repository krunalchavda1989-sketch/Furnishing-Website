import React, { useEffect, useState } from 'react';
import type { CategoryInfo, FooterLinkItem, FooterSettings } from '../../types';
import {
  restoreDefaultFooterSettingsInSupabase,
  saveFooterSettingsToSupabase
} from '../../lib/supabase';
import { useToast } from '../ui/ToastNotification';
import { ImageUploader } from '../ui/ImageUploader';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Link2,
  Mail,
  MapPin,
  Plus,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  Trash2
} from 'lucide-react';

type FooterLinkGroupKey = 'collectionLinks' | 'quickLinks' | 'bottomLinks';

interface AdminFooterModuleProps {
  data: FooterSettings;
  collections: CategoryInfo[];
  adminEmail: string;
  onUpdate: (updated: FooterSettings) => void;
  onAuditLogRefresh: () => Promise<void>;
  onRequestDelete: (opts: {
    title: string;
    itemName: string;
    itemType: string;
    onConfirm: () => void | Promise<void>;
  }) => void;
  onOpenSocialSettings?: () => void;
}

const DESTINATION_OPTIONS = [
  { value: 'category', label: 'Collection Category Page' },
  { value: 'home', label: 'Home Page (/)' },
  { value: 'story', label: 'Our Story Page (/story)' },
  { value: 'projects', label: 'Projects Showcase (/projects)' },
  { value: 'brands', label: 'Global Partners (/brands)' },
  { value: 'contact', label: 'Contact & Consultation (/contact)' },
  { value: 'section:curated-collections', label: 'Home -> Our Collections Section' },
  { value: 'section:atelier-experience', label: 'Home -> Atelier Experience Section' },
  { value: 'section:why-atelier-living', label: 'Home -> Why Atelier Living Section' },
  { value: 'section:designers-architects', label: 'Home -> For Professionals / Architects Section' },
  { value: 'section:final-call-to-action', label: 'Home -> Final Call To Action Section' },
  { value: 'swatches', label: 'Open Material Swatch Modal' },
  { value: 'admin', label: 'Master Admin Portal (/admin)' },
  { value: 'external', label: 'External / Custom URL' }
];

const CTA_TARGET_OPTIONS = [
  { value: 'swatches', label: 'Open Material Swatch Modal' },
  { value: 'contact', label: 'Contact & Consultation Page' },
  { value: 'projects', label: 'Projects Showcase Page' },
  { value: 'story', label: 'Our Story Page' },
  { value: 'section:designers-architects', label: 'Scroll to Designers & Architects' },
  { value: 'external', label: 'External / Custom URL' }
];

/**
 * Dedicated Master Admin CMS module for updating all Footer details & links dynamically:
 * OUR COLLECTIONS links, Quick Links, Gazette Newsletter banner, Brand bio & logo,
 * Showroom contact coordinates, Swatch CTA button, and bottom bar links.
 */
export const AdminFooterModule: React.FC<AdminFooterModuleProps> = ({
  data,
  collections,
  adminEmail,
  onUpdate,
  onAuditLogRefresh,
  onRequestDelete,
  onOpenSocialSettings
}) => {
  const { showToast } = useToast();
  const [formState, setFormState] = useState<FooterSettings>(data);
  const [activeSubtab, setActiveSubtab] = useState<'links' | 'brand-newsletter' | 'showroom-bottom'>(
    'links'
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormState(data);
  }, [data]);

  const hasUnsavedChanges = JSON.stringify(formState) !== JSON.stringify(data);

  const persistFooter = async (
    next: FooterSettings,
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
      await saveFooterSettingsToSupabase(next, adminEmail, action, details);
      await onAuditLogRefresh();
      showToast(toastTitle, toastMessage, toastType);
    } catch {
      showToast('Save Error', 'Unable to persist Footer settings changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanedLinks = (items: FooterLinkItem[]) =>
      items
        .map((item, idx) => ({
          ...item,
          label: item.label.trim(),
          externalUrl: (item.externalUrl || '').trim(),
          order: idx
        }))
        .filter((item) => item.label.length > 0);

    const next: FooterSettings = {
      ...formState,
      newsletterBadge: formState.newsletterBadge.trim(),
      newsletterHeading: formState.newsletterHeading.trim(),
      newsletterSubtitle: formState.newsletterSubtitle.trim(),
      newsletterPlaceholder: formState.newsletterPlaceholder.trim(),
      newsletterButtonLabel: formState.newsletterButtonLabel.trim(),
      newsletterSuccessText: formState.newsletterSuccessText.trim(),
      brandLogoMonogram: formState.brandLogoMonogram.trim(),
      brandLogoTitle: formState.brandLogoTitle.trim(),
      brandDescription: formState.brandDescription.trim(),
      collectionsHeading: formState.collectionsHeading.trim() || 'OUR COLLECTIONS',
      collectionLinks: cleanedLinks(formState.collectionLinks),
      quickLinksHeading: formState.quickLinksHeading.trim() || 'Quick Links',
      quickLinks: cleanedLinks(formState.quickLinks),
      showroomHeading: formState.showroomHeading.trim(),
      address: formState.address.trim(),
      phone: formState.phone.trim(),
      mobile: formState.mobile.trim(),
      email: formState.email.trim(),
      ctaButtonLabel: formState.ctaButtonLabel.trim(),
      ctaButtonUrl: (formState.ctaButtonUrl || '').trim(),
      copyrightText: formState.copyrightText.trim(),
      bottomLinks: cleanedLinks(formState.bottomLinks)
    };

    await persistFooter(
      next,
      'FOOTER_SETTINGS_UPDATED',
      `Updated dynamic footer (${next.collectionLinks.length} collection links, ${next.quickLinks.length} quick links).`,
      'Footer Saved',
      'All footer links and details synced live across website.'
    );
  };

  const handleRestoreDefaults = () => {
    onRequestDelete({
      title: 'Restore Default Footer Configuration',
      itemName: 'OUR COLLECTIONS, Quick Links & Footer Details',
      itemType: 'default footer configuration',
      onConfirm: async () => {
        setIsSaving(true);
        try {
          const restored = await restoreDefaultFooterSettingsInSupabase(adminEmail);
          setFormState(restored);
          onUpdate(restored);
          await onAuditLogRefresh();
          showToast(
            'Footer Restored',
            'Restored default OUR COLLECTIONS links, Quick Links, and footer details.',
            'success'
          );
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const updateLinkGroup = (
    groupKey: FooterLinkGroupKey,
    updater: (items: FooterLinkItem[]) => FooterLinkItem[]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [groupKey]: updater(prev[groupKey] || [])
    }));
  };

  const handleAddLink = (groupKey: FooterLinkGroupKey) => {
    const defaultCategory = collections[0]?.id || 'drapes-curtains';
    const newItem: FooterLinkItem =
      groupKey === 'collectionLinks'
        ? {
            id: `fc-${Date.now()}`,
            label: 'New Collection Link',
            target: 'category',
            categorySlug: defaultCategory,
            isExternal: false,
            isVisible: true,
            order: formState[groupKey].length
          }
        : {
            id: `${groupKey === 'quickLinks' ? 'fq' : 'fb'}-${Date.now()}`,
            label: 'New Footer Link',
            target: 'home',
            isExternal: false,
            isVisible: true,
            order: formState[groupKey].length
          };

    updateLinkGroup(groupKey, (items) => [...items, newItem]);
  };

  const handleMoveLink = (groupKey: FooterLinkGroupKey, index: number, delta: -1 | 1) => {
    const targetIdx = index + delta;
    updateLinkGroup(groupKey, (items) => {
      if (targetIdx < 0 || targetIdx >= items.length) return items;
      const copy = [...items];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIdx, 0, moved);
      return copy.map((el, i) => ({ ...el, order: i }));
    });
  };

  const handleDeleteLink = (groupKey: FooterLinkGroupKey, index: number) => {
    const item = formState[groupKey][index];
    onRequestDelete({
      title: 'Delete Footer Link',
      itemName: item?.label || 'Footer Link',
      itemType: 'footer navigation link',
      onConfirm: async () => {
        const nextList = formState[groupKey]
          .filter((_, i) => i !== index)
          .map((el, idx) => ({ ...el, order: idx }));
        const next: FooterSettings = {
          ...formState,
          [groupKey]: nextList
        };
        await persistFooter(
          next,
          'FOOTER_LINK_DELETED',
          `Removed footer link "${item?.label || ''}" from ${groupKey}.`,
          'Footer Link Removed',
          `"${item?.label || 'Link'}" deleted from live footer.`,
          'delete'
        );
      }
    });
  };

  const renderLinkEditorCard = (
    groupKey: FooterLinkGroupKey,
    sectionTitle: string,
    headingField: 'collectionsHeading' | 'quickLinksHeading' | null,
    badgeLabel: string
  ) => {
    const items = formState[groupKey] || [];
    return (
      <div className="bg-[#163129] border border-[#C9A56A]/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A56A] font-bold block">
              {badgeLabel}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
              {sectionTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => handleAddLink(groupKey)}
            className="px-4 py-2 rounded-full bg-[#C9A56A]/15 hover:bg-[#C9A56A] text-[#C9A56A] hover:text-[#0F1714] border border-[#C9A56A]/45 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>

        {headingField && (
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#C9A56A] block mb-1.5">
              Column Heading Title
            </label>
            <input
              type="text"
              value={formState[headingField]}
              onChange={(e) => setFormState({ ...formState, [headingField]: e.target.value })}
              placeholder={headingField === 'collectionsHeading' ? 'OUR COLLECTIONS' : 'Quick Links'}
              className="w-full sm:max-w-md px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
            />
          </div>
        )}

        {items.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#0F1714]/60 border border-dashed border-white/15 text-center text-xs text-[#8C9A90]">
            No links in this footer group yet. Click <strong>Add Link</strong> above to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((link, idx) => (
              <div
                key={link.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  link.isVisible !== false
                    ? 'bg-[#0F1714]/80 border-white/10 hover:border-[#C9A56A]/40'
                    : 'bg-[#0F1714]/40 border-white/5 opacity-65'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-4">
                    <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                      Link Label ({String(idx + 1).padStart(2, '0')})
                    </label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        updateLinkGroup(groupKey, (prev) =>
                          prev.map((row, i) => (i === idx ? { ...row, label: e.target.value } : row))
                        )
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#163129] border border-white/15 text-xs sm:text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                      Destination Route
                    </label>
                    <select
                      value={link.isExternal ? 'external' : link.target}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateLinkGroup(groupKey, (prev) =>
                          prev.map((row, i) =>
                            i === idx
                              ? {
                                  ...row,
                                  target: val,
                                  isExternal: val === 'external',
                                  categorySlug:
                                    val === 'category'
                                      ? row.categorySlug || collections[0]?.id || 'drapes-curtains'
                                      : row.categorySlug
                                }
                              : row
                          )
                        );
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#163129] border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                    >
                      {DESTINATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {link.target === 'category' && !link.isExternal && (
                    <div className="md:col-span-4">
                      <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                        Target Collection
                      </label>
                      <select
                        value={link.categorySlug || collections[0]?.id || 'drapes-curtains'}
                        onChange={(e) =>
                          updateLinkGroup(groupKey, (prev) =>
                            prev.map((row, i) =>
                              i === idx ? { ...row, categorySlug: e.target.value } : row
                            )
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#163129] border border-[#C9A56A]/35 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      >
                        {collections.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.title} ({col.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(link.isExternal || link.target === 'external') && (
                    <div className="md:col-span-4">
                      <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                        External / Custom URL
                      </label>
                      <input
                        type="text"
                        value={link.externalUrl || ''}
                        placeholder="https://... or mailto:..."
                        onChange={(e) =>
                          updateLinkGroup(groupKey, (prev) =>
                            prev.map((row, i) =>
                              i === idx
                                ? { ...row, externalUrl: e.target.value, isExternal: true }
                                : row
                            )
                          )
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#163129] border border-[#C9A56A]/35 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Action controls per link */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-[#8C9A90]">
                    Target:{' '}
                    <span className="text-[#C9A56A]">
                      {link.isExternal || link.target === 'external'
                        ? link.externalUrl || 'https://...'
                        : link.target === 'category'
                          ? `/category/${link.categorySlug || 'drapes-curtains'}`
                          : link.target}
                    </span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLink(groupKey, idx, -1)}
                      title="Move Up"
                      className="p-1.5 rounded-lg bg-[#163129] border border-white/10 hover:border-[#C9A56A] text-white/80 hover:text-[#C9A56A] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMoveLink(groupKey, idx, 1)}
                      title="Move Down"
                      className="p-1.5 rounded-lg bg-[#163129] border border-white/10 hover:border-[#C9A56A] text-white/80 hover:text-[#C9A56A] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateLinkGroup(groupKey, (prev) =>
                          prev.map((row, i) =>
                            i === idx ? { ...row, isVisible: row.isVisible === false } : row
                          )
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer ${
                        link.isVisible !== false
                          ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                          : 'bg-white/5 border-white/15 text-white/55'
                      }`}
                    >
                      {link.isVisible !== false ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Shown</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(groupKey, idx)}
                      title="Delete Link"
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6 animate-in fade-in">
      {/* Header Control Bar */}
      <div className="bg-[#163129] border border-[#C9A56A]/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#C9A56A] font-semibold">
            <Globe className="w-4 h-4" />
            <span>Global Footer Architecture</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            Footer Links &amp; Details Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9A90] max-w-2xl font-light">
            Dynamically manage OUR COLLECTIONS links, Quick Links, Atelier brand bio &amp; logo, newsletter banner, showroom contact info, and bottom bar links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasUnsavedChanges && (
            <span className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-[11px] font-bold text-amber-300">
              Unsaved Edits
            </span>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={handleRestoreDefaults}
            className="px-4 py-2.5 rounded-full border border-white/20 hover:border-[#C9A56A] text-xs font-bold uppercase tracking-wider text-white/85 hover:text-[#C9A56A] flex items-center space-x-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full bg-[#C9A56A] hover:bg-[#E6C894] text-[#0F1714] text-xs font-bold uppercase tracking-widest flex items-center space-x-2 shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish Footer'}</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#163129]/80 p-2 rounded-2xl border border-[#C9A56A]/25">
        <button
          type="button"
          onClick={() => setActiveSubtab('links')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
            activeSubtab === 'links'
              ? 'bg-[#C9A56A] text-[#0F1714] shadow-lg'
              : 'text-[#8C9A90] hover:text-white hover:bg-white/5'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>Collections &amp; Quick Links ({formState.collectionLinks.length + formState.quickLinks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubtab('brand-newsletter')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
            activeSubtab === 'brand-newsletter'
              ? 'bg-[#C9A56A] text-[#0F1714] shadow-lg'
              : 'text-[#8C9A90] hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Brand Bio, Logo &amp; Newsletter</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubtab('showroom-bottom')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
            activeSubtab === 'showroom-bottom'
              ? 'bg-[#C9A56A] text-[#0F1714] shadow-lg'
              : 'text-[#8C9A90] hover:text-white hover:bg-white/5'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Showroom Details, CTA &amp; Copyright</span>
        </button>
      </div>

      {/* TAB 1: OUR COLLECTIONS & QUICK LINKS */}
      {activeSubtab === 'links' && (
        <div className="space-y-6">
          {renderLinkEditorCard(
            'collectionLinks',
            'Our Collections Navigation Column',
            'collectionsHeading',
            'Footer Column 2 • Collection Archives'
          )}

          {renderLinkEditorCard(
            'quickLinks',
            'Quick Links Navigation Column',
            'quickLinksHeading',
            'Footer Column 3 • Primary Navigation'
          )}
        </div>
      )}

      {/* TAB 2: BRAND BIO, LOGO & NEWSLETTER */}
      {activeSubtab === 'brand-newsletter' && (
        <div className="space-y-6">
          {/* Footer Brand Column */}
          <div className="bg-[#163129] border border-[#C9A56A]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C9A56A] font-bold block">
                  Footer Column 1 • Signature
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                  Brand Logo, Title &amp; Biography
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormState({ ...formState, showSocialLinks: formState.showSocialLinks === false })
                  }
                  className={`px-3.5 py-2 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer ${
                    formState.showSocialLinks !== false
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/15 text-white/60'
                  }`}
                >
                  {formState.showSocialLinks !== false ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  <span>Social Icons: {formState.showSocialLinks !== false ? 'Shown' : 'Hidden'}</span>
                </button>

                {onOpenSocialSettings && (
                  <button
                    type="button"
                    onClick={onOpenSocialSettings}
                    className="px-3.5 py-2 rounded-full bg-[#0F1714] border border-[#C9A56A]/40 text-xs font-bold uppercase tracking-wider text-[#C9A56A] hover:bg-[#C9A56A] hover:text-[#0F1714] flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Edit Social URLs</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <ImageUploader
                  value={formState.brandLogoImage || ''}
                  onChange={(url) => setFormState({ ...formState, brandLogoImage: url })}
                  label="Upload Dedicated Footer Logo (Optional)"
                />
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                      Monogram
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={formState.brandLogoMonogram}
                      onChange={(e) =>
                        setFormState({ ...formState, brandLogoMonogram: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white text-center font-serif focus:border-[#C9A56A] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                      Footer Brand Title
                    </label>
                    <input
                      type="text"
                      value={formState.brandLogoTitle}
                      onChange={(e) =>
                        setFormState({ ...formState, brandLogoTitle: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1.5">
                    Footer Atelier Bio / Description
                  </label>
                  <textarea
                    rows={4}
                    value={formState.brandDescription}
                    onChange={(e) =>
                      setFormState({ ...formState, brandDescription: e.target.value })
                    }
                    className="w-full p-4 rounded-xl bg-[#0F1714] border border-white/15 text-xs sm:text-sm text-white leading-relaxed focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gazette Newsletter Banner */}
          <div className="bg-[#163129] border border-[#C9A56A]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C9A56A] font-bold block">
                  Footer Top Card • Newsletter Capture
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-[#C9A56A]" />
                  <span>The Atelier Gazette Banner</span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormState({
                    ...formState,
                    newsletterVisible: formState.newsletterVisible === false
                  })
                }
                className={`px-3.5 py-2 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer ${
                  formState.newsletterVisible !== false
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/5 border-white/15 text-white/60'
                }`}
              >
                {formState.newsletterVisible !== false ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
                <span>Banner: {formState.newsletterVisible !== false ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={formState.newsletterBadge}
                  onChange={(e) =>
                    setFormState({ ...formState, newsletterBadge: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-xs sm:text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={formState.newsletterButtonLabel}
                  onChange={(e) =>
                    setFormState({ ...formState, newsletterButtonLabel: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-xs sm:text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Newsletter Heading
                </label>
                <input
                  type="text"
                  value={formState.newsletterHeading}
                  onChange={(e) =>
                    setFormState({ ...formState, newsletterHeading: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Newsletter Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formState.newsletterSubtitle}
                  onChange={(e) =>
                    setFormState({ ...formState, newsletterSubtitle: e.target.value })
                  }
                  className="w-full p-3.5 rounded-xl bg-[#0F1714] border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Input Placeholder Text
                </label>
                <input
                  type="text"
                  value={formState.newsletterPlaceholder}
                  onChange={(e) =>
                    setFormState({ ...formState, newsletterPlaceholder: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Success Confirmation Copy
                </label>
                <input
                  type="text"
                  value={formState.newsletterSuccessText}
                  onChange={(e) =>
                    setFormState({ ...formState, newsletterSuccessText: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHOWROOM DETAILS, CTA & COPYRIGHT */}
      {activeSubtab === 'showroom-bottom' && (
        <div className="space-y-6">
          {/* Showroom & Contact Column */}
          <div className="bg-[#163129] border border-[#C9A56A]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C9A56A] font-bold block">
                  Footer Column 4 • Location &amp; Inquiries
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                  Showroom Coordinates &amp; Action Button
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormState({ ...formState, showEmail: formState.showEmail === false })
                  }
                  className={`px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer ${
                    formState.showEmail !== false
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/15 text-white/60'
                  }`}
                >
                  <span>Email Row: {formState.showEmail !== false ? 'On' : 'Off'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormState({ ...formState, showCtaButton: formState.showCtaButton === false })
                  }
                  className={`px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer ${
                    formState.showCtaButton !== false
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/15 text-white/60'
                  }`}
                >
                  <span>CTA Button: {formState.showCtaButton !== false ? 'On' : 'Off'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Showroom Column Heading
                </label>
                <input
                  type="text"
                  value={formState.showroomHeading}
                  placeholder="Ahmedabad Atelier"
                  onChange={(e) =>
                    setFormState({ ...formState, showroomHeading: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Studio / Flagship Address
                </label>
                <input
                  type="text"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Landline / Showroom Phone
                </label>
                <input
                  type="text"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Mobile / Direct Line
                </label>
                <input
                  type="text"
                  value={formState.mobile}
                  onChange={(e) => setFormState({ ...formState, mobile: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Concierge Email
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                  Showroom CTA Button Label
                </label>
                <input
                  type="text"
                  value={formState.ctaButtonLabel}
                  onChange={(e) =>
                    setFormState({ ...formState, ctaButtonLabel: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1">
                  Showroom CTA Action
                </label>
                <select
                  value={formState.ctaButtonTarget}
                  onChange={(e) =>
                    setFormState({ ...formState, ctaButtonTarget: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                >
                  {CTA_TARGET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {formState.ctaButtonTarget === 'external' && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C9A56A] block mb-1">
                    CTA External URL
                  </label>
                  <input
                    type="text"
                    value={formState.ctaButtonUrl || ''}
                    placeholder="https://..."
                    onChange={(e) =>
                      setFormState({ ...formState, ctaButtonUrl: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F1714] border border-[#C9A56A]/40 text-xs text-white focus:border-[#C9A56A] focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="bg-[#163129] border border-[#C9A56A]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
              <Layers className="w-4 h-4 text-[#C9A56A]" />
              <h3 className="font-serif text-xl text-white font-normal">Copyright Statement</h3>
            </div>
            <input
              type="text"
              value={formState.copyrightText}
              onChange={(e) => setFormState({ ...formState, copyrightText: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0F1714] border border-white/15 text-sm text-white focus:border-[#C9A56A] focus:outline-none"
            />
          </div>

          {/* Bottom Bar Utility Links */}
          {renderLinkEditorCard(
            'bottomLinks',
            'Bottom Utility & Portal Links',
            null,
            'Footer Bottom Bar • Right Side'
          )}
        </div>
      )}
    </form>
  );
};
