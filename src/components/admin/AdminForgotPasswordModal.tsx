import React, { useState } from 'react';
import { X, Mail, KeyRound, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';

interface AdminForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPassword: string) => void;
}

export const AdminForgotPasswordModal: React.FC<AdminForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [email, setEmail] = useState('admin@maison-drape.com');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid admin email address.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('code');
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 4) {
      setError('Please enter the security verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      onSuccess(newPassword);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#141312] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#FDFBF7]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#D8C8B8] hover:text-[#F5D07F] hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full border border-[#C5A059] bg-[#C5A059]/15 flex items-center justify-center mx-auto text-[#F5D07F]">
            <KeyRound className="w-6 h-6 text-[#F5D07F]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">Reset Admin Password</h3>
          <p className="text-xs text-[#D8C8B8]">
            {step === 'email' && 'Enter your registered Master Curator email address.'}
            {step === 'code' && 'Enter verification code & create your new master password.'}
            {step === 'success' && 'Your password has been successfully updated.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C5A059] focus:outline-none text-sm text-white placeholder-white/40"
                  placeholder="admin@maison-drape.com"
                  required
                />
                <Mail className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2C37E] to-[#C5A059] text-[#121110] font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Sending Security Code...' : 'Send Verification Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Verification Code & New Password */}
        {step === 'code' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1.5">
                Security Verification Code (e.g. 123456)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C5A059] focus:outline-none text-sm text-white placeholder-white/40 tracking-widest font-mono text-center"
                placeholder="123456"
                required
              />
              <span className="text-[10px] text-[#C5A059] mt-1 block">
                * Demo Code: Type <strong>123456</strong> or any code
              </span>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1.5">
                New Master Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C5A059] focus:outline-none text-sm text-white"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C5A059] focus:outline-none text-sm text-white"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2C37E] to-[#C5A059] text-[#121110] font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Updating Password...' : 'Update Password & Access Admin'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 'success' && (
          <div className="text-center space-y-4 pt-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-sm text-emerald-200">
              Your password has been successfully reset! You can now log in with your updated credentials.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-[#C5A059] text-[#121110] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
            >
              Return to Admin Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
