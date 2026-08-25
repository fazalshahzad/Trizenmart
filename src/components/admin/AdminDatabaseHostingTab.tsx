import React, { useState, useRef } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Server, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  HardDrive, 
  Cloud, 
  RefreshCw, 
  FileJson, 
  ExternalLink,
  ShieldAlert,
  Info,
  Terminal,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/helpers';

export const AdminDatabaseHostingTab: React.FC = () => {
  const { 
    settings, 
    products, 
    orders, 
    categories, 
    promoCodes, 
    exportDatabaseBackup, 
    importDatabaseBackup, 
    resetStoreDatabase,
    addToast 
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Restore Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [jsonTextImport, setJsonTextImport] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Reset Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [masterPinConfirm, setMasterPinConfirm] = useState('');
  const [resetError, setResetError] = useState('');

  // Copy state
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedVercelJson, setCopiedVercelJson] = useState(false);

  // Approximate database size in memory
  const approxDbSizeKb = Math.round(
    (JSON.stringify({ settings, products, orders, categories, promoCodes }).length * 2) / 1024
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonTextImport(content);
        setIsImportModalOpen(true);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!jsonTextImport.trim()) {
      setImportStatus('Please paste or upload valid JSON database content.');
      return;
    }

    const res = importDatabaseBackup(jsonTextImport);
    if (res.success) {
      setIsImportModalOpen(false);
      setJsonTextImport('');
      setImportStatus(null);
    } else {
      setImportStatus(res.message);
    }
  };

  const handleExecuteFactoryReset = () => {
    if (!masterPinConfirm.trim()) {
      setResetError('Master Security PIN is required');
      return;
    }

    const res = resetStoreDatabase(masterPinConfirm.trim());
    if (res.success) {
      setIsResetModalOpen(false);
      setMasterPinConfirm('');
      setResetError('');
    } else {
      setResetError(res.message);
    }
  };

  const handleCopyCliCommand = () => {
    navigator.clipboard.writeText('npm run build && npx vercel --prod').then(() => {
      setCopiedCli(true);
      addToast('Deployment command copied to clipboard!', 'success');
      setTimeout(() => setCopiedCli(false), 2000);
    });
  };

  return (
    <div className="space-y-8" id="admin-database-hosting-tab">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Zero Monthly Hosting Cost
            </span>
            <span className="text-emerald-400 font-bold text-xs">● 100% Free Tier Supported</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Free Database Storage & Free Vercel Hosting
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Manage your store's persistent database with instant offline backups and learn how to deploy live to Vercel for free in under 2 minutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={exportDatabaseBackup}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            id="db-export-top-btn"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (JSON)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: FREE DATABASE MANAGEMENT */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                100% Free Persistent Database Engine
              </h3>
              <p className="text-xs text-slate-500">
                Synchronized locally with dual localStorage & JSON snapshot capabilities. Zero database hosting bills.
              </p>
            </div>
          </div>

          {/* Database Health Badge */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono font-bold">Storage: ~{approxDbSizeKb} KB</span>
          </div>
        </div>

        {/* Database Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Products Stored</span>
            <p className="text-xl font-black text-slate-900">{products.length}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Customer Orders</span>
            <p className="text-xl font-black text-slate-900">{orders.length}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Categories</span>
            <p className="text-xl font-black text-slate-900">{categories.length}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Promo Coupons</span>
            <p className="text-xl font-black text-slate-900">{promoCodes.length}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* 1. Export JSON */}
          <button
            type="button"
            onClick={exportDatabaseBackup}
            className="p-4 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 rounded-2xl flex items-center gap-3 text-left transition-all group cursor-pointer"
            id="db-export-action-card"
          >
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs">Export Full Database</p>
              <p className="text-[11px] text-emerald-700 font-medium">Download JSON snapshot</p>
            </div>
          </button>

          {/* 2. Import JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="w-full p-4 bg-blue-50 hover:bg-blue-100/80 text-blue-900 border border-blue-200 rounded-2xl flex items-center gap-3 text-left transition-all group cursor-pointer"
              id="db-import-action-card"
            >
              <div className="p-2.5 bg-blue-600 text-white rounded-xl group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-xs">Restore / Import Data</p>
                <p className="text-[11px] text-blue-700 font-medium">Restore from JSON backup</p>
              </div>
            </button>
          </div>

          {/* 3. Factory Reset */}
          <button
            type="button"
            onClick={() => {
              setResetError('');
              setMasterPinConfirm('');
              setIsResetModalOpen(true);
            }}
            className="p-4 bg-rose-50 hover:bg-rose-100/80 text-rose-900 border border-rose-200 rounded-2xl flex items-center gap-3 text-left transition-all group cursor-pointer"
            id="db-reset-action-card"
          >
            <div className="p-2.5 bg-rose-600 text-white rounded-xl group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs">Factory Reset Store</p>
              <p className="text-[11px] text-rose-700 font-medium">Requires Master PIN (9988)</p>
            </div>
          </button>

        </div>

        {/* Free Cloud Database (Firebase Firestore) Info Callout */}
        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <Cloud className="w-4 h-4 text-amber-700" />
            <span>Optional Free Cloud Database (Google Firebase Firestore)</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            By default, your store operates with 100% free local client-side persistence and JSON export capabilities. If you also want live multi-device synchronization across different computers, Google Firebase offers a generous <strong>Spark Free Plan</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-amber-900 font-semibold">
            <span className="p-2 bg-white/80 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              50,000 Free Reads / Day
            </span>
            <span className="p-2 bg-white/80 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              20,000 Free Writes / Day
            </span>
            <span className="p-2 bg-white/80 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              $0.00 / month forever
            </span>
          </div>
        </div>

      </div>

      {/* SECTION 2: FREE VERCEL HOSTING HUB */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6" id="admin-vercel-hosting-hub">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Deploy & Host on Vercel (100% Free Forever)
              </h3>
              <p className="text-xs text-slate-500">
                Vercel provides free global edge hosting, instant automatic HTTPS SSL certificates, and lightning-fast speeds for your store.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-extrabold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>vercel.json Configured</span>
          </span>
        </div>

        {/* 3 Step Deployment Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 relative">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
              1
            </span>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
              Push to GitHub or Export ZIP
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export your project ZIP from AI Studio settings or push this repository directly to your personal GitHub account.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 relative">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
              2
            </span>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
              Connect to Vercel (Free Hobby Plan)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline">vercel.com/new</a>, select your repository, and select <strong>Vite</strong> as the framework preset.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 relative">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
              3
            </span>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
              Click Deploy & Go Live!
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vercel builds your site in ~25 seconds and assigns a free <code>.vercel.app</code> domain with custom domain support.
            </p>
          </div>

        </div>

        {/* CLI Command & Configuration Snippet */}
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 space-y-3 font-mono text-xs border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>One-Line Vercel CLI Deployment Command:</span>
            </span>
            <button
              type="button"
              onClick={handleCopyCliCommand}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCli ? 'Copied!' : 'Copy Command'}</span>
            </button>
          </div>

          <div className="p-3 bg-black/60 rounded-xl text-emerald-400 overflow-x-auto select-all">
            npm run build && npx vercel --prod
          </div>

          <p className="text-[11px] text-slate-400 font-sans">
            Our repository contains an optimized <strong className="text-white">vercel.json</strong> with SPA routing rewrites and hardened HTTP response headers.
          </p>
        </div>

        {/* Features Matrix of Free Vercel Hosting */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Global Edge CDN
            </span>
            <p className="text-[11px] text-emerald-700">Sub-50ms latency across Pakistan & global nodes</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Free SSL Certificate
            </span>
            <p className="text-[11px] text-emerald-700">Automatic green lock HTTPS with auto-renewal</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Custom Domain Free
            </span>
            <p className="text-[11px] text-emerald-700">Link your .pk or .com domain without extra charge</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100 GB Bandwidth
            </span>
            <p className="text-[11px] text-emerald-700">Supports over 100,000 store visitors monthly</p>
          </div>
        </div>

      </div>

      {/* IMPORT / RESTORE MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <Upload className="w-5 h-5 text-blue-600" />
                <span>Restore Database from JSON Snapshot</span>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800">Paste JSON content or select backup file:</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                >
                  Browse File (.json)
                </button>
              </div>

              <textarea
                rows={7}
                value={jsonTextImport}
                onChange={(e) => {
                  setJsonTextImport(e.target.value);
                  if (importStatus) setImportStatus(null);
                }}
                placeholder='Paste raw JSON here: { "trizenmart_version": "2.0.0", "products": [...], ... }'
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:bg-white"
              />

              {importStatus && (
                <p className="text-xs font-bold text-rose-600">{importStatus}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                id="db-confirm-restore-btn"
              >
                Execute Database Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FACTORY RESET MODAL */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Confirm Factory Reset</h3>
                <p className="text-xs text-slate-500">This will reset all orders, products, and store data.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-extrabold text-slate-800">
                Enter Master Security PIN to confirm (Default: <strong className="text-emerald-700">9988</strong>)
              </label>
              <input
                type="password"
                autoFocus
                value={masterPinConfirm}
                onChange={(e) => {
                  setMasterPinConfirm(e.target.value);
                  if (resetError) setResetError('');
                }}
                placeholder="Enter master PIN"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
                id="db-master-pin-reset-input"
              />
              {resetError && (
                <p className="text-xs font-bold text-rose-600">{resetError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteFactoryReset}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-600/20 cursor-pointer"
                id="db-confirm-wipe-btn"
              >
                Wipe & Factory Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
