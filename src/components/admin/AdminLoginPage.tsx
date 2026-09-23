import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { AdminForgotPasswordModal } from './AdminForgotPasswordModal';
import type { AdminUser } from '../../types/adminTypes';
import { loginAdminWithSupabase } from '../../lib/supabase';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { user, error: loginErr } = await loginAdminWithSupabase(email, password);
    setIsSubmitting(false);

    if (user) {
      if (rememberMe) {
        localStorage.setItem('atelier_admin_session', JSON.stringify(user));
      }
      onLoginSuccess(user);
    } else {
      setError(loginErr || 'Invalid Master Admin Credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1714] text-[#E9DFD1] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-[#C9A56A]/30">
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A56A]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* Return to Live Site Link & Gateway Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <button
            onClick={onReturnToSite}
            className="text-xs uppercase tracking-widest text-[#8C9A90] hover:text-[#C9A56A] transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
          >
            &larr; Return to Public Website
          </button>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[#C9A56A]/40 bg-[#C9A56A]/10 text-[11px] text-[#C9A56A] font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A56A]" />
            <span>Encrypted Master Gateway</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full border-2 border-[#C9A56A] bg-[#C9A56A]/20 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(201,165,106,0.4)]">
            <span className="font-serif font-bold text-3xl text-[#C9A56A]">A</span>
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-wider">
              ATELIER LIVING
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-[#C9A56A] font-semibold mt-1">
              Master Admin & Curator Portal
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#163129]/95 backdrop-blur-2xl border border-[#C9A56A]/35 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] focus:bg-white/10 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
                  placeholder="admin@atelier-living.com"
                  required
                />
                <Mail className="w-4 h-4 text-[#C9A56A] absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-[#E9DFD1] hover:text-[#C9A56A] underline transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] focus:bg-white/10 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
                  placeholder="••••••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-[#C9A56A] absolute left-3.5 top-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-[#8C9A90] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#C9A56A] focus:ring-[#C9A56A]"
                />
                <span>Remember session on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A56A] via-[#E6C894] to-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest shadow-xl hover:brightness-110 hover:shadow-[#C9A56A]/25 transition-all flex items-center justify-center space-x-2 border border-[#E9DFD1]/50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Authenticate Master Admin'}</span>
              <ArrowRight className="w-4 h-4 text-[#0F1714]" />
            </button>
          </form>
        </div>

        {/* Footer Security Badge */}
        <div className="text-center space-y-1 text-[11px] text-[#8C9A90]">
          <p>Atelier Living • Haute Living Security System</p>
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
