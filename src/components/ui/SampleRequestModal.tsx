import React, { useState } from 'react';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import type { CategorySlug } from '../../types';
import { X, CheckCircle2, PackageCheck, Send, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useToast } from './ToastNotification';

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
  const { showToast } = useToast();
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
    showToast('Swatch Request Sent', 'Luxury swatch box dispatched to Mayfair team.', 'success');
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#0F1714] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 text-[#E9DFD1] shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-[#E9DFD1] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all border border-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4" /> Maison Sample Atelier
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#E9DFD1] mt-1">
                Order Complimentary Material Swatches
              </h3>
              <p className="text-xs text-[#8C9A90] mt-1 font-light">
                Select up to 4 material categories for express courier delivery in our signature linen presentation box.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Picker */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[#8C9A90] block mb-2 font-medium">
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
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all flex flex-col justify-between h-16 cursor-pointer ${
                          isSelected
                            ? 'bg-[#C9A56A]/20 border-[#C9A56A] text-[#E9DFD1] ring-1 ring-[#C9A56A]'
                            : 'bg-white/5 border-white/10 text-[#8C9A90] hover:border-white/30'
                        }`}
                      >
                        <span className="font-medium text-[11px] leading-tight block">{cat.title}</span>
                        {isSelected && <Sparkles className="w-3 h-3 text-[#C9A56A] self-end" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-[#8C9A90] block font-medium">
                  2. Delivery Address & Project Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#163129] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#E9DFD1] placeholder-[#8C9A90] focus:outline-none focus:border-[#C9A56A]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#163129] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#E9DFD1] placeholder-[#8C9A90] focus:outline-none focus:border-[#C9A56A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Courier Shipping Address *"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#163129] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#E9DFD1] placeholder-[#8C9A90] focus:outline-none focus:border-[#C9A56A]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City / Country *"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#163129] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#E9DFD1] placeholder-[#8C9A90] focus:outline-none focus:border-[#C9A56A]"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Specific colorways, martindale requirements, or interior notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#163129] border border-white/15 rounded-xl p-3 text-xs text-[#E9DFD1] placeholder-[#8C9A90] focus:outline-none focus:border-[#C9A56A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#C9A56A] text-[#0F1714] font-bold uppercase tracking-widest text-xs hover:bg-[#E6C894] transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Dispatching Swatch Box...' : 'Dispatch Swatch Box'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#163129] border border-[#C9A56A] flex items-center justify-center mx-auto text-[#C9A56A]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-3xl text-[#E9DFD1]">Swatch Order Dispatched</h3>
            <p className="text-sm text-[#8C9A90] max-w-md mx-auto font-light leading-relaxed">
              Thank you, <strong className="text-[#E9DFD1]">{formData.fullName}</strong>. Your requested swatch box has been queued for express courier dispatch to {formData.city || 'your address'}. A confirmation tracking email is en route to {formData.email}.
            </p>
            <button
              onClick={() => {
                setStep(1);
                onClose();
              }}
              className="mt-6 px-8 py-3 rounded-full bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-widest hover:bg-[#E6C894] transition-all cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
