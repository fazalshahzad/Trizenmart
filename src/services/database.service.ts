import { Product, Order, StoreSettings, Category, PromoCode, SecurityAuditLog } from '../types';
import { generateChecksum } from '../lib/crypto';
import { APP_CONFIG } from '../config/constants';

export interface DatabaseSnapshot {
  trizenmart_version: string;
  exportedAt: string;
  checksum?: string;
  storeName: string;
  settings: StoreSettings;
  products: Product[];
  orders: Order[];
  categories?: Category[];
  promoCodes?: PromoCode[];
  auditLogs?: SecurityAuditLog[];
}

export class DatabaseService {
  /**
   * Generates and downloads a standardized full JSON database snapshot
   */
  public static async exportSnapshot(payload: {
    settings: StoreSettings;
    products: Product[];
    orders: Order[];
    categories: Category[];
    promoCodes: PromoCode[];
    auditLogs: SecurityAuditLog[];
  }): Promise<boolean> {
    try {
      const rawSnapshot: DatabaseSnapshot = {
        trizenmart_version: APP_CONFIG.VERSION,
        exportedAt: new Date().toISOString(),
        storeName: payload.settings.storeName,
        settings: payload.settings,
        products: payload.products,
        orders: payload.orders,
        categories: payload.categories,
        promoCodes: payload.promoCodes,
        auditLogs: payload.auditLogs,
      };

      // Compute verification checksum
      const rawJson = JSON.stringify(rawSnapshot);
      rawSnapshot.checksum = await generateChecksum(rawJson);

      const formattedJson = JSON.stringify(rawSnapshot, null, 2);
      const dataUri = 'data:text/json;charset=utf-8,' + encodeURIComponent(formattedJson);
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataUri);
      const safeName = (payload.settings.storeName || 'trizenmart').toLowerCase().replace(/[^a-z0-9]/g, '_');
      const dateTag = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('download', `${safeName}_backup_${dateTag}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      return true;
    } catch (error) {
      console.error('[DatabaseService] Export failed:', error);
      return false;
    }
  }

  /**
   * Validates and imports a JSON database snapshot
   */
  public static parseAndValidateSnapshot(jsonString: string): {
    valid: boolean;
    data?: DatabaseSnapshot;
    error?: string;
  } {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        return { valid: false, error: 'Empty or invalid JSON payload.' };
      }

      const parsed = JSON.parse(jsonString.trim()) as DatabaseSnapshot;
      if (!parsed || typeof parsed !== 'object') {
        return { valid: false, error: 'Payload is not a valid JSON object.' };
      }

      if (!Array.isArray(parsed.products) && !Array.isArray(parsed.orders) && !parsed.settings) {
        return { valid: false, error: 'JSON does not contain recognizeable TRIZENMART schema elements.' };
      }

      return { valid: true, data: parsed };
    } catch (err: any) {
      return { valid: false, error: 'JSON Parse Error: ' + err.message };
    }
  }
}
