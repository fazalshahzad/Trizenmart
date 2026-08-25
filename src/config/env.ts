/**
 * Safe Environment Variable Provider
 * Gracefully extracts environment variables without crashing in browser or preview sandboxes
 */

export interface AppEnv {
  isProduction: boolean;
  appUrl: string;
  enableAnalytics: boolean;
}

export function getAppEnv(): AppEnv {
  const metaEnv = (import.meta as any)?.env || {};
  const isProd = Boolean(metaEnv.PROD);
  const appUrl = (metaEnv.VITE_APP_URL as string) || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  return {
    isProduction: isProd,
    appUrl,
    enableAnalytics: false,
  };
}
