import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, KeyRound, ArrowRight, Info } from 'lucide-react';
import { AdminForgotPasswordModal } from './AdminForgotPasswordModal';
import type { AdminUser } from '../../types/adminTypes';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onReturnToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onReturnToSite
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // DEMO CREDENTIALS CONSTANTS
  const DEMO_EMAIL = 'admin@maison-drape.com';
  const DEMO_PASSWORD = 'MaisonAdmin2026!';

  const handleAutoFillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Validate credentials (accepts demo or any valid admin email)
      if (
        (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) ||
        (email.includes('@') && password.length >= 6)
      ) {
        const adminUser: AdminUser = {
          id: 'adm-001',
          name: 'Lady Vivienne Sterling',
          email: email.trim().toLowerCase(),
          role: 'Master Curator',
          lastLogin: new Date().toLocaleString()
        };
        if (rememberMe) {
          localStorage.setItem('maison_admin_session', JSON.stringify(adminUser));
        }
        onLoginSuccess(adminUser);
      } else {
        setError('Invalid Admin Email or Password. Click "Use Demo Credentials" below to auto-fill.');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0D0C0B] text-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-[#C5A059]/30">
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* Return to Live Site Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={onReturnToSite}
            className="text-xs uppercase tracking-widest text-[#D8C8B8] hover:text-[#F5D07F] transition-colors flex items-center gap-1.5 font-semibold"
          >
            &larr; Return to Public Website
          </button>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[11px] text-[#F5D07F] font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F5D07F]" />
            <span>Encrypted Master Gateway</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full border-2 border-[#C5A059] bg-[#C5A059]/20 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(197,160,89,0.4)]">
            <span className="font-serif font-bold text-3xl text-[#F5D07F]">M</span>
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-wider">
              MAISON & DRAPE
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mt-1">
              Master Admin & Curator Portal
            </p>
          </div>
        </div>

        {/* Demo Credentials Alert Pill */}
        <div className="p-4 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#F5D07F]">
            <Info className="w-4 h-4 shrink-0" />
            <div>
              <strong className="block text-white">Demo Credentials Ready:</strong>
              <span className="font-mono text-[11px] text-[#EBE5D8]">
                admin@maison-drape.com • MaisonAdmin2026!
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoFillDemo}
            className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] text-[#121110] font-bold text-[11px] uppercase tracking-wider hover:bg-[#D4AF37] transition-all shrink-0 shadow-md"
          >
            Auto-Fill Demo
          </button>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#141312]/95 backdrop-blur-2xl border border-[#C5A059]/35 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C5A059] focus:bg-white/10 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
                  placeholder="admin@maison-drape.com"
                  required
                />
                <Mail className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-[#EBE5D8] hover:text-[#F5D07F] underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C5A059] focus:bg-white/10 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
                  placeholder="••••••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-white/50 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-[#D8C8B8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#C5A059] focus:ring-[#C5A059]"
                />
                <span>Remember session on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2C37E] to-[#C5A059] text-[#121110] font-bold text-xs uppercase tracking-widest shadow-xl hover:brightness-110 hover:shadow-[#C5A059]/25 transition-all flex items-center justify-center space-x-2 border border-[#FFF0C2]/50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating Gateway...' : 'Authenticate Master Admin'}</span>
              <ArrowRight className="w-4 h-4 text-[#121110]" />
            </button>
          </form>
        </div>

        {/* Footer Security Badge */}
        <div className="text-center space-y-1 text-[11px] text-[#8C7A6B]">
          <p>Maison & Drape • Atelier Haute Living Security System v3.6</p>
          <p>Restricted to authorized atelier curators and executive staff.</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AdminForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSuccess={(updatedPassword) => {
          setPassword(updatedPassword);
          setIsForgotModalOpen(false);
        }}
      />
    </div>
  );
};
