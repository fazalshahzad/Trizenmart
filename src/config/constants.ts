/**
 * Centralized Store Constants & Security Defaults
 */

export const APP_CONFIG = {
  APP_NAME: 'TRIZENMART',
  VERSION: '2.0.0',
  DEFAULT_CURRENCY: 'Rs.',
  DEFAULT_WHATSAPP_NUMBER: '+92 300 1234567',
  DEFAULT_ADMIN_PIN: '7860',
  DEFAULT_MASTER_PIN: '9988',
  STORAGE_KEYS: {
    PRODUCTS: 'trizenmart_products',
    ORDERS: 'trizenmart_orders',
    SETTINGS: 'trizenmart_settings',
    CATEGORIES: 'trizenmart_categories',
    WISHLIST: 'trizenmart_wishlist',
    COMPARE: 'trizenmart_compare',
    CART: 'trizenmart_cart',
    SECURITY_CONFIG: 'trizenmart_security_config',
    SECURITY_LOGS: 'trizenmart_security_logs',
    PROMO_CODES: 'trizenmart_promos',
  },
  SECURITY: {
    MAX_FAILED_ATTEMPTS: 5,
    LOCKOUT_DURATION_SECONDS: 60,
    AUTO_LOCK_MINUTES: 30,
    MAX_AUDIT_LOGS: 150,
  },
  HOSTING: {
    PROVIDER: 'Vercel (Zero Monthly Cost)',
    BUILD_COMMAND: 'npm run build',
    OUTPUT_DIR: 'dist',
    FRAMEWORK: 'Vite',
  }
};
