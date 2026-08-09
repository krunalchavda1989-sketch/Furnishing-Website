import React, { useState } from 'react';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import type { CategorySlug } from '../../types';
import { X, CheckCircle2, PackageCheck, Send, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface SampleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: CategorySlug;
}

export const SampleRequestModal: React.FC<SampleRequestModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'fabrics'
}) => {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([defaultCategory]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United Kingdom',
    projectType: 'Residential Master Residence',
    notes: ''
  });

  if (!isOpen) return null;

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catId));
      }
    } else {
      if (selectedCategories.length < 4) {
        setSelectedCategories([...selectedCategories, catId]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isSupabaseConfigured) {
      try {
        const catTitles = selectedCategories.map((c) => CATEGORIES_DATA[c]?.title || c);
        await supabase.from('swatch_requests').insert({
          client_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          address: `${formData.address}, ${formData.city}, ${formData.country}`,
          category_title: catTitles.join(', '),
          category_slug: selectedCategories[0] || 'fabrics',
          swatches_requested: catTitles,
          status: 'Pending'
        });
      } catch (err) {
        console.warn('Supabase swatch request submit error:', err);
      }
    }

    setIsSubmitting(false);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#1A1918] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 text-[#FDFBF7] shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-[#EBE5D8] hover:bg-[#C5A059] hover:text-[#1A1918] transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4" /> Maison Sample Atelier
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FDFBF7] mt-1">
                Order Complimentary Material Swatches
              </h3>
              <p className="text-xs text-[#D8C8B8] mt-1 font-light">
                Select up to 4 material categories for express courier delivery in our signature linen presentation box.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Picker */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[#D8C8B8] block mb-2 font-medium">
                  1. Select Categories (Up to 4)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.values(CATEGORIES_DATA).map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all flex flex-col justify-between h-16 ${
                          isSelected
                            ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#FDFBF7] ring-1 ring-[#C5A059]'
                            : 'bg-white/5 border-white/10 text-[#D8C8B8] hover:border-white/30'
                        }`}
                      >
                        <span className="font-medium text-[11px] leading-tight block">{cat.title}</span>
                        {isSelected && <Sparkles className="w-3 h-3 text-[#C5A059] self-end" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-[#D8C8B8] block font-medium">
                  2. Delivery Address & Project Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#242220] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#FDFBF7] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C5A059]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#242220] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#FDFBF7] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Courier Shipping Address *"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#242220] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#FDFBF7] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C5A059]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City / Country *"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#242220] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#FDFBF7] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Specific colorways, martindale requirements, or interior notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#242220] border border-white/15 rounded-xl p-3 text-xs text-[#FDFBF7] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#C5A059] text-[#1A1918] font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Dispatching Swatch Box...' : 'Dispatch Swatch Box'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1C3026] border border-[#C5A059] flex items-center justify-center mx-auto text-[#C5A059]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-3xl text-[#FDFBF7]">Swatch Order Dispatched</h3>
            <p className="text-sm text-[#D8C8B8] max-w-md mx-auto font-light leading-relaxed">
              Thank you, <strong className="text-[#FDFBF7]">{formData.fullName}</strong>. Your requested swatch box has been queued for express courier dispatch to {formData.city || 'your address'}. A confirmation tracking email is en route to {formData.email}.
            </p>
            <button
              onClick={() => {
                setStep(1);
                onClose();
              }}
              className="mt-6 px-8 py-3 rounded-full bg-[#C5A059] text-[#1A1918] text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
            >
              Return to Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
