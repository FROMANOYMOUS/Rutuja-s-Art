import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, Sparkles, LogIn, UserPlus, CheckCircle2, ShieldCheck, RefreshCw, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasonMessage?: string;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, reasonMessage, onSuccess }: AuthModalProps) {
  const { login, signup, verifyOtp, resendOtp, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'verify_otp'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email address and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }

      // Step 1: Send/Generate Email Verification Code
      const res = await signup(email, password, name, phone, address);
      if (res.success) {
        setGeneratedCode(res.otpCode || '123456');
        setMode('verify_otp');
        setSuccessMessage(`📩 Verification code sent to ${email.trim()}`);
      } else {
        setErrorMessage(res.error || 'Failed to initialize email verification.');
      }
      return;
    }

    if (mode === 'login') {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMessage('Logged in successfully! Customer profile loaded.');
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 600);
      } else {
        setErrorMessage(res.error || 'Login failed. Please check your credentials.');
      }
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otpCodeInput.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    const res = await verifyOtp(email, otpCodeInput.trim());
    if (res.success) {
      setSuccessMessage('✓ Email Verified! Customer account & cart saved in Supabase.');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Invalid code. Try again or enter 123456.');
    }
  };

  const handleResendCode = async () => {
    setErrorMessage('');
    const res = await resendOtp(email);
    if (res.success) {
      setGeneratedCode(res.otpCode);
      setSuccessMessage(`New code generated: ${res.otpCode}`);
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
          className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl space-y-6"
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

          {/* Modal Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold font-sans">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Rutuja's Art Collection • Supabase Cloud Account</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-800">
              {mode === 'verify_otp'
                ? 'Verify Your Email'
                : mode === 'login'
                ? 'Welcome Back!'
                : 'Create Customer Account'}
            </h2>
            <p className="font-sans text-xs text-stone-500">
              {mode === 'verify_otp'
                ? `Enter the 6-digit email confirmation code sent to ${email}`
                : mode === 'login'
                ? 'Sign in with your email to access saved orders and cart in Supabase.'
                : 'Sign up to keep your cart and shipping details saved in Supabase cloud.'}
            </p>
          </div>

          {/* Reason Notification Banner if triggered by Checkout */}
          {reasonMessage && mode !== 'verify_otp' && (
            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800 font-sans">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-snug">{reasonMessage}</p>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          {mode !== 'verify_otp' && (
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl text-xs font-semibold font-sans">
              <button
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-white text-stone-800 shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                id="auth-tab-login"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-white text-stone-800 shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                id="auth-tab-signup"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-sans">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Mode: Verify OTP Screen */}
          {mode === 'verify_otp' ? (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs font-sans">
              {/* Generated Code Notification Box for quick testing */}
              <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                  <KeyRound className="w-4 h-4 text-rose-600" />
                  <span>Email Verification Code Sent</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Your verification code is: <strong className="font-mono text-stone-900 text-sm bg-white px-2 py-0.5 rounded border border-rose-200">{generatedCode}</strong> (or use demo code <strong className="font-mono text-stone-900">123456</strong>)
                </p>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Enter 6-Digit Code *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 849201"
                    value={otpCodeInput}
                    onChange={(e) => setOtpCodeInput(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-center text-lg font-mono tracking-widest pl-3 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-emerald-200 cursor-pointer flex items-center justify-center gap-2"
                id="verify-otp-submit-btn"
              >
                {loading ? (
                  <span>Verifying code...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Email & Save to Supabase</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-stone-500 hover:text-stone-800 underline text-[11px]"
                >
                  ← Back to details
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
          ) : (
            /* Login & Signup Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {mode === 'signup' && (
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-800 pl-9 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:outline-none"
                    />
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-stone-700 font-medium mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-800 pl-9 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:outline-none font-mono"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
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
                    className="w-full bg-stone-50 border border-stone-200 text-stone-800 pl-9 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Phone Number (For Delivery Confirmation)</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 text-stone-800 pl-9 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:outline-none font-mono"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
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
                        className="w-full bg-stone-50 border border-stone-200 text-stone-800 pl-9 pr-3 py-2.5 rounded-xl focus:border-rose-400 focus:outline-none resize-none"
                      />
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-rose-200 cursor-pointer flex items-center justify-center gap-2"
                id="auth-submit-btn"
              >
                {loading ? (
                  <span>Please wait...</span>
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Account</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Verification Code & Register</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Autofill Helper */}
          {mode !== 'verify_otp' && (
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

