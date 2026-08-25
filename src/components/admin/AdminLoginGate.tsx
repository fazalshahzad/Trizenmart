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
  Mail,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginGate: React.FC = () => {
  const { 
    settings, 
    adminEmailPasswordLogin,
    adminGoogleLogin,
    adminLogin,
    failedLoginAttempts, 
    lockoutRemainingSeconds, 
    adminSecurityConfig,
    setActiveView 
  } = useStore();

  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'pin'>('email');
  
  // Email Form State
  const [emailInput, setEmailInput] = useState('shancompany322@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // PIN Form State
  const [pinInput, setPinInput] = useState('');

  // Google OAuth Popup Simulation State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isLocked = lockoutRemainingSeconds > 0;

  // Handle Email & Password Submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Please enter both your Admin Email and Password');
      return;
    }

    setIsAuthenticating(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = adminEmailPasswordLogin(emailInput, passwordInput);
      setIsAuthenticating(false);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setPasswordInput('');
      }
    }, 300);
  };

  // Handle Quick PIN Submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMsg('Please enter your 4-digit security PIN or Master key');
      return;
    }

    setIsAuthenticating(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = adminLogin(pinInput);
      setIsAuthenticating(false);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setPinInput('');
      }
    }, 250);
  };

  // Handle Google / Gmail Authentication
  const handleGoogleAuth = (selectedEmail: string) => {
    setIsAuthenticating(true);
    setErrorMsg('');
    setIsGoogleModalOpen(false);

    setTimeout(() => {
      const res = adminGoogleLogin(selectedEmail);
      setIsAuthenticating(false);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleFillCredentials = () => {
    setEmailInput('shancompany322@gmail.com');
    setPasswordInput('.Iphone1122@');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12" id="admin-security-gate-container">
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Vault Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 bg-slate-900 text-emerald-400 rounded-3xl shadow-xl border border-slate-800 ring-4 ring-slate-900/10">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Restricted Admin Portal
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

          {/* Authentication Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => { setAuthMethod('email'); setErrorMsg(''); }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'email' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'hover:text-slate-900'
              }`}
              id="admin-auth-tab-email"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('google'); setErrorMsg(''); }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'google' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'hover:text-slate-900'
              }`}
              id="admin-auth-tab-google"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Gmail</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('pin'); setErrorMsg(''); }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'pin' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'hover:text-slate-900'
              }`}
              id="admin-auth-tab-pin"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              <span>PIN Code</span>
            </button>
          </div>

          {/* METHOD 1: EMAIL & PASSWORD (PRIMARY SPECIFIED BY USER) */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block font-extrabold text-slate-700 text-xs flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authorized Administrator Email</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={isLocked || isAuthenticating}
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="shancompany322@gmail.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:opacity-50"
                  id="admin-email-input"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Admin Password</span>
                  </label>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLocked || isAuthenticating}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Enter admin password"
                    autoFocus
                    className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono tracking-wider text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:opacity-50"
                    id="admin-password-input"
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
                id="admin-email-login-btn"
              >
                {isAuthenticating ? (
                  <span>Verifying Credentials...</span>
                ) : isLocked ? (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Locked ({lockoutRemainingSeconds}s)</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Admin Console</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* METHOD 2: LOGIN WITH GMAIL / GOOGLE */}
          {authMethod === 'google' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">Google Workspace OAuth</h3>
                <p className="text-xs text-slate-500">
                  Authenticate directly using your authorized Gmail account:
                  <br />
                  <strong className="text-slate-800 font-mono text-[11px]">{adminSecurityConfig.adminEmail || 'shancompany322@gmail.com'}</strong>
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Google Button */}
              <button
                type="button"
                disabled={isLocked || isAuthenticating}
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-800 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                id="admin-google-login-btn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google (Gmail)</span>
              </button>
            </div>
          )}

          {/* METHOD 3: 4-DIGIT PIN */}
          {authMethod === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-extrabold text-slate-700 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin Security PIN</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Owner: <strong className="text-purple-700">7860</strong>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLocked || isAuthenticating}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Enter 4-digit PIN or Master key"
                    autoFocus
                    className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono tracking-widest text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50"
                    id="admin-pin-only-input"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLocked || isAuthenticating}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer"
                id="admin-pin-login-btn"
              >
                {isAuthenticating ? (
                  <span>Verifying PIN...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Unlock via PIN</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Helper & Storefront return */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={handleFillCredentials}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline text-[11px]"
              id="admin-fill-credentials-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fill Authorized Admin Credentials</span>
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
            <span>Multi-Layer Store Protection</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-400">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Email & Google OAuth verification</span>
            </li>
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
              <span>Restricted administrator access</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Interactive Google Account Chooser Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="font-extrabold text-sm text-slate-900">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select your Google Account to authenticate management access to <strong>{settings.storeName}</strong>:
            </p>

            {/* Account List */}
            <div className="space-y-2">
              {/* Authorized Admin Account */}
              <button
                type="button"
                onClick={() => handleGoogleAuth('shancompany322@gmail.com')}
                className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    S
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>Shan Company</span>
                      <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm">
                        Owner
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      shancompany322@gmail.com
                    </div>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              </button>

              {/* Test unauthorized account option */}
              <button
                type="button"
                onClick={() => handleGoogleAuth('guest.visitor@gmail.com')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-sm">
                    G
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-700">Guest / Other Account</div>
                    <div className="text-[11px] text-slate-400 font-mono">guest.visitor@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">Unauthorized</span>
              </button>
            </div>

            {/* Custom Google Email Entry */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="text-[11px] font-bold text-slate-600 block">
                Or sign in with another Google Email:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGoogleEmail.trim()) {
                      handleGoogleAuth(customGoogleEmail.trim());
                    }
                  }}
                  className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Verify
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
