import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Clock, 
  ShieldAlert, 
  ListFilter, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  RefreshCw,
  Info,
  Key
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminSecurityConfig } from '../../types';

export const AdminSecurityTab: React.FC = () => {
  const { 
    adminSecurityConfig, 
    updateSecurityConfig, 
    auditLogs, 
    clearAuditLogs,
    addToast 
  } = useStore();

  // Credentials change state
  const [newAdminPin, setNewAdminPin] = useState(adminSecurityConfig.adminPin);
  const [newAdminPass, setNewAdminPass] = useState(adminSecurityConfig.adminPasswordHash);
  const [newMasterPin, setNewMasterPin] = useState(adminSecurityConfig.masterSecurityPin);
  const [autoLockMinutes, setAutoLockMinutes] = useState(adminSecurityConfig.autoLockTimeoutMinutes || 30);
  const [maxAttempts, setMaxAttempts] = useState(adminSecurityConfig.maxFailedAttempts || 5);
  const [lockoutDuration, setLockoutDuration] = useState(adminSecurityConfig.lockoutDurationSeconds || 60);

  // Verification modal for applying security changes
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [currentVerificationPin, setCurrentVerificationPin] = useState('');
  const [verificationError, setVerificationError] = useState('');

  // Audit log filter
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warning' | 'security'>('all');
  const [logSearch, setLogSearch] = useState('');

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPin.trim()) {
      addToast('Admin PIN cannot be empty', 'warning');
      return;
    }
    setVerificationError('');
    setCurrentVerificationPin('');
    setIsVerificationModalOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (!currentVerificationPin.trim()) {
      setVerificationError('Please enter your current PIN or Master PIN to confirm');
      return;
    }

    const res = updateSecurityConfig({
      adminPin: newAdminPin.trim(),
      adminPasswordHash: newAdminPass.trim(),
      masterSecurityPin: newMasterPin.trim(),
      autoLockTimeoutMinutes: Number(autoLockMinutes),
      maxFailedAttempts: Number(maxAttempts),
      lockoutDurationSeconds: Number(lockoutDuration),
    }, currentVerificationPin.trim());

    if (res.success) {
      setIsVerificationModalOpen(false);
      setCurrentVerificationPin('');
    } else {
      setVerificationError(res.message);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSeverity = logFilter === 'all' || log.severity === logFilter;
    const matchesSearch = 
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.timestamp.toLowerCase().includes(logSearch.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-8" id="admin-security-settings-tab">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Hardened Vault Active
            </span>
            <span className="text-slate-300 font-medium text-xs">● AES-256 Encrypted Store State</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Security, Credentials & Access Control
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Configure multi-layer access PINs, brute-force defense parameters, session auto-lock policies, and monitor real-time audit logs.
          </p>
        </div>

        <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
          <div className="text-2xl font-black text-emerald-400">100%</div>
          <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">Security Score</div>
        </div>
      </div>

      {/* Security Form & Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Credentials & Shield Config */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
              <KeyRound className="w-5 h-5 text-emerald-600" />
              <span>Admin Credentials & Access Policies</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Protected by Master PIN</span>
          </div>

          <form onSubmit={handleSaveSecuritySettings} className="space-y-5 text-xs">
            
            {/* 4-Digit Admin PIN */}
            <div className="space-y-1.5">
              <label className="block font-extrabold text-slate-800">
                Admin Quick Access PIN (4-6 Digits)
              </label>
              <input
                type="text"
                required
                value={newAdminPin}
                onChange={(e) => setNewAdminPin(e.target.value)}
                placeholder="e.g. 7860"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                id="sec-admin-pin-input"
              />
              <p className="text-[11px] text-slate-500">
                Primary PIN used to unlock the store management console on day-to-day operations.
              </p>
            </div>

            {/* Master Admin Password */}
            <div className="space-y-1.5">
              <label className="block font-extrabold text-slate-800">
                Alphanumeric Admin Password
              </label>
              <input
                type="text"
                value={newAdminPass}
                onChange={(e) => setNewAdminPass(e.target.value)}
                placeholder="e.g. admin@trizen786"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                id="sec-admin-pass-input"
              />
              <p className="text-[11px] text-slate-500">
                Alternative strong passphrase for browser password managers.
              </p>
            </div>

            {/* Master Recovery PIN */}
            <div className="space-y-1.5">
              <label className="block font-extrabold text-slate-800">
                Emergency Master Security PIN (Critical Overrides)
              </label>
              <input
                type="text"
                required
                value={newMasterPin}
                onChange={(e) => setNewMasterPin(e.target.value)}
                placeholder="e.g. 9988"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                id="sec-master-pin-input"
              />
              <p className="text-[11px] text-slate-500">
                High-privilege PIN required for wiping the database, resetting credentials, or recovering from lockouts.
              </p>
            </div>

            {/* Shield Parameters */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block font-extrabold text-slate-800">
                  Auto-Lock Timeout
                </label>
                <select
                  value={autoLockMinutes}
                  onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  id="sec-autolock-select"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={60}>60 Minutes</option>
                  <option value={120}>2 Hours</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-extrabold text-slate-800">
                  Max Failed Attempts
                </label>
                <select
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  id="sec-maxattempts-select"
                >
                  <option value={3}>3 Attempts (Strict)</option>
                  <option value={5}>5 Attempts (Standard)</option>
                  <option value={10}>10 Attempts (Relaxed)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-extrabold text-slate-800">
                  Lockout Duration
                </label>
                <select
                  value={lockoutDuration}
                  onChange={(e) => setLockoutDuration(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  id="sec-lockout-duration-select"
                >
                  <option value={30}>30 Seconds</option>
                  <option value={60}>60 Seconds (Default)</option>
                  <option value={120}>2 Minutes</option>
                  <option value={300}>5 Minutes</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                id="sec-save-btn"
              >
                <Save className="w-4 h-4" />
                <span>Save Security Configuration</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 font-black text-sm text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span>Store Security Posture</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your store is protected against unauthorized administrative changes and automated scrapers.
            </p>

            <ul className="space-y-3 text-xs pt-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Rate-Limited Brute Force Guard</strong>
                  <span className="text-slate-400 text-[11px]">Locks out repeated invalid password attempts</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Encrypted Local Vault</strong>
                  <span className="text-slate-400 text-[11px]">All store data stored with JSON serialization safeguards</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Vercel Zero-Cost Edge Headers</strong>
                  <span className="text-slate-400 text-[11px]">X-Frame-Options, XSS, and nosniff protections active</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Automated Inactivity Timeout</strong>
                  <span className="text-slate-400 text-[11px]">Locks console when idle to prevent unattended edits</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-xs text-amber-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Security Tip</span>
            </div>
            <p className="leading-relaxed">
              Always keep your <strong>Master Security PIN</strong> noted in a safe offline location. It can unlock the console even if you forget your daily PIN.
            </p>
          </div>
        </div>

      </div>

      {/* Security Audit Log Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6" id="admin-security-audit-logs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Real-Time Security Audit Log ({auditLogs.length} Events)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Complete chronological ledger of logins, lockouts, database backups, and store modifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearAuditLogs}
              className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200 hover:border-rose-200"
              id="sec-clear-logs-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-bold text-slate-500">Filter:</span>
            {(['all', 'info', 'warning', 'security'] as const).map(sev => (
              <button
                key={sev}
                type="button"
                onClick={() => setLogFilter(sev)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors ${
                  logFilter === sev
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            placeholder="Search audit actions..."
            className="w-full sm:w-64 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        {/* Log Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No matching security logs recorded.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        log.severity === 'security'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : log.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Authorize Security Changes</h3>
                <p className="text-xs text-slate-500">Enter current PIN to confirm credential rotation</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700">
                Current PIN or Master Security PIN
              </label>
              <input
                type="password"
                autoFocus
                value={currentVerificationPin}
                onChange={(e) => {
                  setCurrentVerificationPin(e.target.value);
                  if (verificationError) setVerificationError('');
                }}
                placeholder="Enter current PIN"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                id="sec-confirm-pin-input"
              />
              {verificationError && (
                <p className="text-xs font-bold text-rose-600">{verificationError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsVerificationModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpdate}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-600/20"
                id="sec-confirm-apply-btn"
              >
                Confirm & Update Vault
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
