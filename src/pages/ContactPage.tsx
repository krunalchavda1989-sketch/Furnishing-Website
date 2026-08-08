import React, { useState } from 'react';
import { SHOWROOMS_DATA } from '../data/brandsData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Sparkles, Calendar } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [selectedShowroomIndex, setSelectedShowroomIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    productInterest: 'fabrics',
    projectScope: 'Full Residence Refurbishment',
    message: ''
  });

  const activeShowroom = SHOWROOMS_DATA[selectedShowroomIndex] || SHOWROOMS_DATA[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 space-y-20">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block">
          Private Atelier Consultations
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1918] font-normal">
          Connect With Our <span className="italic font-subserif gold-gradient-text">Design Specialists</span>
        </h1>
        <p className="text-sm sm:text-base text-[#4A4844] font-light leading-relaxed max-w-2xl mx-auto font-subserif text-lg">
          Whether commissioning bespoke drapes for a historic manor or selecting acoustic sheers for a commercial penthouse, our Mayfair, Paris, and Milan specialists are at your service.
        </p>
      </section>

      {/* Main Grid: Form + Showroom Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#1A1918] rounded-3xl p-8 sm:p-12 border border-[#C5A059]/30 text-[#FDFBF7] shadow-2xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Bespoke Inquiry & Trade Registration
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FDFBF7] mt-1">
                Schedule a Consultation or Request Quote
              </h2>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 bg-[#242220] rounded-2xl border border-[#C5A059]/40 p-6">
                <div className="w-16 h-16 rounded-full bg-[#1C3026] border border-[#C5A059] flex items-center justify-center mx-auto text-[#C5A059]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#FDFBF7]">Inquiry Received</h3>
                <p className="text-xs text-[#D8C8B8] max-w-md mx-auto font-light leading-relaxed">
                  Thank you, <strong className="text-[#FDFBF7]">{formState.fullName}</strong>. A senior textile consultant from our {activeShowroom.city} team will contact you within 24 hours to review your project scope.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#C5A059] text-[#1A1918] text-xs font-bold uppercase tracking-widest"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8C7A6B] block mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Alistair Vance"
                      value={formState.fullName}
                      onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                      className="w-full bg-[#242220] border border-white/15 rounded-xl px-4 py-3 text-xs text-[#FDFBF7] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8C7A6B] block mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alistair@vanceholdings.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-[#242220] border border-white/15 rounded-xl px-4 py-3 text-xs text-[#FDFBF7] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8C7A6B] block mb-1 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+44 7911 123456"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full bg-[#242220] border border-white/15 rounded-xl px-4 py-3 text-xs text-[#FDFBF7] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8C7A6B] block mb-1 font-medium">
                      Product Interest Category
                    </label>
                    <select
                      value={formState.productInterest}
                      onChange={(e) => setFormState({ ...formState, productInterest: e.target.value })}
                      className="w-full bg-[#242220] border border-white/15 rounded-xl px-4 py-3 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A059]"
                    >
                      {Object.values(CATEGORIES_DATA).map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#1A1918]">
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-[#8C7A6B] block mb-1 font-medium">
                    Project Scope / Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your residence, timeline, dimensions, or design vision..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-[#242220] border border-white/15 rounded-xl p-4 text-xs text-[#FDFBF7] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#C5A059] text-[#1A1918] font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] transition-all flex items-center justify-center space-x-2 shadow-xl"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Private Consultation</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Showrooms Switcher */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
                Global Flagships & Design Hubs
              </span>
              <h3 className="font-serif text-2xl text-[#1A1918]">Our International Showrooms</h3>
            </div>

            {/* Showroom Selector Tabs */}
            <div className="grid grid-cols-2 gap-2">
              {SHOWROOMS_DATA.map((shw, idx) => (
                <button
                  key={shw.id}
                  onClick={() => setSelectedShowroomIndex(idx)}
                  className={`p-3 rounded-xl border text-xs text-left transition-all ${
                    selectedShowroomIndex === idx
                      ? 'bg-[#1A1918] text-[#C5A059] border-[#C5A059] font-semibold'
                      : 'bg-[#F5EFE6] text-[#4A4844] border-[#D8C8B8] hover:border-[#C5A059]'
                  }`}
                >
                  {shw.city}
                </button>
              ))}
            </div>

            {/* Selected Showroom Details Card */}
            <div className="bg-[#F5EFE6] rounded-3xl p-6 border border-[#C5A059]/30 shadow-xl space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <img src={activeShowroom.image} alt={activeShowroom.city} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-[#FDFBF7]">
                  <h4 className="font-serif text-xl text-[#FDFBF7]">{activeShowroom.city}</h4>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">{activeShowroom.country}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#1A1918]">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{activeShowroom.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{activeShowroom.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{activeShowroom.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{activeShowroom.hours}</span>
                </div>
              </div>

              {/* Mock Map View */}
              <div className="p-4 bg-[#1A1918] text-[#D8C8B8] rounded-xl border border-[#C5A059]/20 text-[11px] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>Private Appointments Available Today</span>
                </div>
                <span className="text-[#C5A059] font-bold">Book Visit</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
