import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  Sparkles,
  LogIn,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  KeyRound,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasonMessage?: string;
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'signup' | 'verify_otp' | 'forgot_password' | 'reset_password';

export default function AuthModal({ isOpen, onClose, reasonMessage, onSuccess }: AuthModalProps) {
  const {
    login,
    signup,
    verifyOtp,
    resendOtp,
    requestPasswordReset,
    confirmPasswordReset,
    loading
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [otpCodeInput, setOtpCodeInput] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setOtpCodeInput('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email address and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      setSuccessMessage('Logged in successfully! Loading your saved profile...');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 600);
    } else {
      setErrorMessage(res.error || 'Login failed. Please verify your credentials.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide an email address and password.');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const res = await signup(email, password, name, phone, address);
    if (res.success) {
      setMode('verify_otp');
      setSuccessMessage(`📩 Security verification code sent to ${email.trim()}`);
    } else {
      setErrorMessage(res.error || 'Failed to initialize account registration.');
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!otpCodeInput.trim()) {
      setErrorMessage('Please enter the 6-digit code received on your email.');
      return;
    }

    const res = await verifyOtp(email, otpCodeInput.trim());
    if (res.success) {
      setSuccessMessage('✓ Email Verified! Account & cart profile synced to Supabase.');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Invalid code. Check your email inbox or spam folder.');
    }
  };

  const handleResendCode = async () => {
    resetFormState();
    const res = await resendOtp(email);
    if (res.success) {
      setSuccessMessage(`📩 A fresh verification code was sent to ${email.trim()}`);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim()) {
      setErrorMessage('Please enter your registered business email address.');
      return;
    }

    const res = await requestPasswordReset(email);
    if (res.success) {
      setMode('reset_password');
      setSuccessMessage(`📩 Password reset code sent to ${email.trim()}`);
    } else {
      setErrorMessage(res.error || 'Unable to send password reset email.');
    }
  };

  const handleConfirmResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!otpCodeInput.trim() || !newPassword.trim()) {
      setErrorMessage('Please enter both the 6-digit code and your new password.');
      return;
    }

    if (newPassword.trim().length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    const res = await confirmPasswordReset(email, otpCodeInput.trim(), newPassword.trim());
    if (res.success) {
      setSuccessMessage('✓ Password updated successfully! Please log in with your new password.');
      setPassword(newPassword.trim());
      setTimeout(() => {
        setMode('login');
        resetFormState();
      }, 1200);
    } else {
      setErrorMessage(res.error || 'Failed to reset password. Check the code and try again.');
    }
  };

  const fillDemoAccount = () => {
    setEmail('priya.sharma@gmail.com');
    setPassword('flower123');
    setName('Priya Sharma');
    setPhone('+91 98230 11223');
    setAddress('102, Garden Residency, Senapati Bapat Road, Pune, MH - 411016');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="bg-white border border-rose-100/80 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl space-y-5"
          id="auth-modal-container"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            id="auth-modal-close-btn"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1 rounded-full text-[11px] font-semibold font-sans">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Rutuja's Art • Cloud Authentication</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
              {mode === 'verify_otp'
                ? 'Email Verification'
                : mode === 'forgot_password'
                ? 'Reset Password'
                : mode === 'reset_password'
                ? 'Set New Password'
                : mode === 'login'
                ? 'Welcome Back'
                : 'Customer Registration'}
            </h2>
            <p className="font-sans text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
              {mode === 'verify_otp'
                ? `Enter the 6-digit confirmation code sent to ${email}`
                : mode === 'forgot_password'
                ? 'Enter your business email to receive a secure password reset code.'
                : mode === 'reset_password'
                ? 'Enter the 6-digit email code along with your new password.'
                : mode === 'login'
                ? 'Sign in to access saved orders, addresses & cart synced on cloud.'
                : 'Create an account to keep your customized orders saved in Supabase.'}
            </p>
          </div>

          {/* Reason Notification Banner if triggered by Checkout */}
          {reasonMessage && (mode === 'login' || mode === 'signup') && (
            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 font-sans">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-snug">{reasonMessage}</p>
            </div>
          )}

          {/* Navigation Tabs (Only in Login/Signup) */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl text-xs font-semibold font-sans">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetFormState();
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                id="auth-tab-login"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  resetFormState();
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                id="auth-tab-signup"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* System Feedback Alert Boxes */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-sans leading-snug">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-sans flex items-start gap-2 leading-snug">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ----------------- MODE: LOGIN ----------------- */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-mono"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-700 font-medium">Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      resetFormState();
                    }}
                    className="text-rose-600 hover:text-rose-700 font-semibold text-[11px] underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-rose-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
                id="auth-login-submit-btn"
              >
                {loading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ----------------- MODE: SIGNUP ----------------- */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all"
                  />
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-mono"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Phone Number (For Delivery Confirmation)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-mono"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Default Delivery Address</label>
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="House No, Street, Landmark, City & Pincode"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all resize-none"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-rose-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
                id="auth-signup-submit-btn"
              >
                {loading ? (
                  <span>Sending Verification Code...</span>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Verification Code & Register</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ----------------- MODE: VERIFY EMAIL OTP ----------------- */}
          {mode === 'verify_otp' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs font-sans">
              {/* Notice Box */}
              <div className="p-3.5 bg-rose-50/80 border border-rose-200/90 rounded-2xl flex items-start gap-2.5 text-rose-950 leading-relaxed">
                <Mail className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  A 6-digit verification code has been dispatched to <strong>{email}</strong>. Please check your email inbox or spam folder and enter the code below.
                </p>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1.5 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpCodeInput}
                    onChange={(e) => setOtpCodeInput(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-center text-xl font-mono tracking-widest px-4 py-3 rounded-2xl focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-emerald-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
                id="verify-otp-submit-btn"
              >
                {loading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Email & Save Account</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    resetFormState();
                  }}
                  className="text-stone-500 hover:text-stone-800 text-[11px] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to details</span>
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-rose-600 hover:text-rose-700 font-semibold text-[11px] flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
              </div>
            </form>
          )}

          {/* ----------------- MODE: FORGOT PASSWORD ----------------- */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Your Registered Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none font-mono"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-rose-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
                id="forgot-password-submit-btn"
              >
                {loading ? (
                  <span>Sending Reset Code...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Password Reset Code</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetFormState();
                  }}
                  className="text-stone-500 hover:text-stone-800 text-[11px] flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          )}

          {/* ----------------- MODE: RESET PASSWORD ----------------- */}
          {mode === 'reset_password' && (
            <form onSubmit={handleConfirmResetSubmit} className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-[11px] text-stone-600">
                A password reset code has been sent to <strong className="text-stone-900 font-mono">{email}</strong>. Please check your email inbox.
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">6-Digit Reset Code *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpCodeInput}
                    onChange={(e) => setOtpCodeInput(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-center font-mono text-base tracking-widest py-2.5 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none"
                  />
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">New Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-emerald-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
                id="reset-password-submit-btn"
              >
                {loading ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reset & Update Password</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetFormState();
                  }}
                  className="text-stone-500 hover:text-stone-800 text-[11px] flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Autofill Helper */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-sans text-stone-500">
              <span>Testing out the store?</span>
              <button
                type="button"
                onClick={fillDemoAccount}
                className="text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
              >
                Auto-fill Demo Customer
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


