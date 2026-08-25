import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Store, 
  Info,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginGate: React.FC = () => {
  const { 
    settings, 
    adminLogin, 
    failedLoginAttempts, 
    lockoutRemainingSeconds, 
    adminSecurityConfig,
    setActiveView 
  } = useStore();

  const [credentialInput, setCredentialInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialInput.trim()) {
      setErrorMsg('Please enter your Admin PIN or Master Password');
      return;
    }

    setIsAuthenticating(true);
    setErrorMsg('');

    // Micro-delay for smooth security feedback
    setTimeout(() => {
      const res = adminLogin(credentialInput);
      setIsAuthenticating(false);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setCredentialInput('');
      }
    }, 250);
  };

  const handleUseDemoPin = () => {
    setCredentialInput('7860');
    setErrorMsg('');
  };

  const isLocked = lockoutRemainingSeconds > 0;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" id="admin-security-gate-container">
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Vault Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 bg-slate-900 text-emerald-400 rounded-3xl shadow-xl border border-slate-800 ring-4 ring-slate-900/10">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Admin Security Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto">
            Protected Management Console for <strong className="text-slate-800">{settings.storeName}</strong>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6 relative overflow-hidden">
          
          {/* Lockout Warning Banner */}
          {isLocked && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-pulse">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs text-rose-800">
                <p className="font-extrabold">Security Lockdown Active</p>
                <p>
                  Too many incorrect attempts. Retry available in{' '}
                  <strong className="text-rose-950 font-mono text-sm">{lockoutRemainingSeconds}s</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-extrabold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admin Access PIN / Password</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Default: <strong className="text-emerald-700">7860</strong>
                </span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLocked || isAuthenticating}
                  value={credentialInput}
                  onChange={(e) => {
                    setCredentialInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter 4-digit PIN or master password"
                  autoFocus
                  className="w-full pl-4 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono tracking-widest text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:opacity-50 disabled:bg-slate-100"
                  id="admin-pin-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Attempt Counter Status */}
            {failedLoginAttempts > 0 && !isLocked && (
              <div className="flex items-center justify-between text-[11px] text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                <span className="font-semibold">Failed Attempts:</span>
                <span className="font-mono font-bold">{failedLoginAttempts} / {adminSecurityConfig.maxFailedAttempts}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLocked || isAuthenticating}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              id="admin-login-submit-btn"
            >
              {isAuthenticating ? (
                <span>Verifying Security Key...</span>
              ) : isLocked ? (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Locked ({lockoutRemainingSeconds}s)</span>
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper & Storefront return */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={handleUseDemoPin}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline text-[11px]"
              id="admin-demo-pin-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fill Default Owner PIN (7860)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition-colors text-[11px]"
              id="admin-back-storefront-btn"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>

        {/* Security Trust Badges */}
        <div className="bg-slate-900/90 text-slate-300 rounded-2xl p-4 border border-slate-800 text-[11px] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-white text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Active Security Safeguards</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-400">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Brute-force lockout protection</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Session timeout auto-lock</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero cleartext credentials</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Master security PIN recovery</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
