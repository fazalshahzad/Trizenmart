import { AdminSecurityConfig, SecurityAuditLog } from '../types';
import { APP_CONFIG } from '../config/constants';
import { StorageService } from './storage.service';

export interface AuthenticationResult {
  success: boolean;
  message: string;
  remainingAttempts?: number;
  lockoutRemainingSeconds?: number;
}

export class SecurityService {
  /**
   * Validates PIN against stored admin and master PINs with brute-force rate-limiting
   */
  public static authenticate(
    input: string,
    config: AdminSecurityConfig,
    failedAttempts: number,
    lockoutUntil: number
  ): AuthenticationResult {
    const trimmed = input.trim();
    const now = Date.now();

    // Check active lockout
    if (lockoutUntil > now) {
      const remaining = Math.ceil((lockoutUntil - now) / 1000);
      return {
        success: false,
        message: `Security lockdown active. Try again in ${remaining}s.`,
        lockoutRemainingSeconds: remaining,
      };
    }

    const isPinMatch = trimmed === config.adminPin;
    const isPassMatch = trimmed === config.adminPasswordHash;
    const isMasterMatch = trimmed === config.masterSecurityPin;

    if (isPinMatch || isPassMatch || isMasterMatch) {
      return {
        success: true,
        message: isMasterMatch ? 'Authorized with Master Recovery PIN' : 'Authorized successfully',
      };
    }

    // Failed attempt
    const newFailCount = failedAttempts + 1;
    const maxAttempts = config.maxFailedAttempts || APP_CONFIG.SECURITY.MAX_FAILED_ATTEMPTS;

    if (newFailCount >= maxAttempts) {
      const lockSeconds = config.lockoutDurationSeconds || APP_CONFIG.SECURITY.LOCKOUT_DURATION_SECONDS;
      return {
        success: false,
        message: `Too many invalid attempts. Admin console locked for ${lockSeconds}s.`,
        remainingAttempts: 0,
        lockoutRemainingSeconds: lockSeconds,
      };
    }

    const remaining = maxAttempts - newFailCount;
    return {
      success: false,
      message: `Invalid PIN or Password. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`,
      remainingAttempts: remaining,
    };
  }

  /**
   * Formats a new audit event
   */
  public static createAuditEntry(
    action: string,
    details: string,
    severity: 'info' | 'warning' | 'security' = 'info'
  ): SecurityAuditLog {
    return {
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toLocaleString(),
      action,
      details,
      severity,
    };
  }
}
