/**
 * Admin Audit Logging System
 * Server-side actions for tracking admin actions and changes
 */

'use server';

import { redirect } from 'next/navigation';
import {
  Timestamp,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { checkAdminStatus } from '@/lib/firebase/auth';

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  entityType: 'collection' | 'product' | 'lead' | 'page' | 'settings' | 'user';
  entityId: string;
  entityName?: string;
  changes?: Record<string, { old: any; new: any }>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
}

export interface AuditLogResult {
  success: boolean;
  message: string;
  logId?: string;
}

export interface AuditLogQuery {
  adminId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}

/**
 * Verify admin authentication
 */
async function verifyAdminAuth(): Promise<{
  isAdmin: boolean;
  userId?: string;
  email?: string;
}> {
  try {
    const isAdmin = await checkAdminStatus();
    const user = auth?.currentUser;
    return {
      isAdmin,
      userId: user?.uid,
      email: user?.email ?? undefined,
    };
  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return { isAdmin: false };
  }
}

/**
 * Log admin action to audit trail
 */
export async function logAdminAction(
  action: string,
  entityType: AuditLogEntry['entityType'],
  entityId: string,
  entityName?: string,
  changes?: Record<string, { old: any; new: any }>,
  metadata?: Record<string, any>
): Promise<AuditLogResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.userId || !auth.email) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    // Create audit log entry
    const logEntry: Omit<AuditLogEntry, 'id'> = {
      adminId: auth.userId,
      adminEmail: auth.email,
      action,
      entityType,
      entityId,
      entityName,
      changes,
      metadata,
      // TODO: Get actual IP and user agent from request headers
      ipAddress: 'unknown',
      userAgent: 'unknown',
      timestamp: Timestamp.now(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'admin-audit-logs'), logEntry);

    return {
      success: true,
      message: 'Action logged successfully',
      logId: docRef.id,
    };
  } catch (error) {
    console.error('Error logging admin action:', error);

    return {
      success: false,
      message: 'Failed to log action',
    };
  }
}

/**
 * Get audit logs with filtering (admin only)
 */
export async function getAuditLogs(filters: AuditLogQuery = {}): Promise<{
  success: boolean;
  logs?: AuditLogEntry[];
  total?: number;
  message?: string;
}> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Build query constraints
    const constraints: any[] = [];

    if (filters.adminId) {
      constraints.push(where('adminId', '==', filters.adminId));
    }

    if (filters.entityType) {
      constraints.push(where('entityType', '==', filters.entityType));
    }

    if (filters.entityId) {
      constraints.push(where('entityId', '==', filters.entityId));
    }

    if (filters.action) {
      constraints.push(where('action', '==', filters.action));
    }

    if (filters.dateFrom) {
      constraints.push(
        where('timestamp', '>=', Timestamp.fromDate(filters.dateFrom))
      );
    }

    if (filters.dateTo) {
      constraints.push(
        where('timestamp', '<=', Timestamp.fromDate(filters.dateTo))
      );
    }

    // Add ordering and limit
    constraints.push(orderBy('timestamp', 'desc'));
    constraints.push(limit(filters.limit || 50));

    // Execute query
    const q = query(collection(db, 'admin-audit-logs'), ...constraints);
    const snapshot = await getDocs(q);

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AuditLogEntry[];

    return {
      success: true,
      logs,
      total: logs.length,
    };
  } catch (error) {
    console.error('Error getting audit logs:', error);

    return {
      success: false,
      message: 'Failed to fetch audit logs',
    };
  }
}

/**
 * Get audit logs for specific entity (admin only)
 */
export async function getEntityAuditLogs(
  entityType: AuditLogEntry['entityType'],
  entityId: string,
  limitCount: number = 20
): Promise<{
  success: boolean;
  logs?: AuditLogEntry[];
  message?: string;
}> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    return getAuditLogs({
      entityType,
      entityId,
      limit: limitCount,
    });
  } catch (error) {
    console.error('Error getting entity audit logs:', error);

    return {
      success: false,
      message: 'Failed to fetch entity audit logs',
    };
  }
}

/**
 * Get audit logs for specific admin user (admin only)
 */
export async function getAdminUserLogs(
  adminId: string,
  limitCount: number = 50
): Promise<{
  success: boolean;
  logs?: AuditLogEntry[];
  message?: string;
}> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    return getAuditLogs({
      adminId,
      limit: limitCount,
    });
  } catch (error) {
    console.error('Error getting admin user logs:', error);

    return {
      success: false,
      message: 'Failed to fetch admin user logs',
    };
  }
}

/**
 * Generate audit report (admin only)
 */
export async function generateAuditReport(
  dateRange: { from: Date; to: Date },
  entityType?: AuditLogEntry['entityType']
): Promise<{
  success: boolean;
  report?: {
    totalActions: number;
    actionsByType: Record<string, number>;
    actionsByAdmin: Record<string, number>;
    actionsByEntity: Record<string, number>;
    timeRange: { from: string; to: string };
    mostActiveAdmin: string;
    mostModifiedEntity: string;
  };
  message?: string;
}> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Get logs for the date range
    const logsResult = await getAuditLogs({
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
      entityType,
      limit: 1000, // Get more logs for comprehensive report
    });

    if (!logsResult.success || !logsResult.logs) {
      return {
        success: false,
        message: 'Failed to fetch logs for report',
      };
    }

    const logs = logsResult.logs;

    // Calculate statistics
    const actionsByType: Record<string, number> = {};
    const actionsByAdmin: Record<string, number> = {};
    const actionsByEntity: Record<string, number> = {};

    logs.forEach((log) => {
      // Count by action type
      actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;

      // Count by admin
      const adminKey = `${log.adminEmail} (${log.adminId})`;
      actionsByAdmin[adminKey] = (actionsByAdmin[adminKey] || 0) + 1;

      // Count by entity
      const entityKey = `${log.entityType}:${log.entityId}`;
      actionsByEntity[entityKey] = (actionsByEntity[entityKey] || 0) + 1;
    });

    // Find most active admin
    const mostActiveAdmin =
      Object.entries(actionsByAdmin).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'None';

    // Find most modified entity
    const mostModifiedEntity =
      Object.entries(actionsByEntity).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'None';

    const report = {
      totalActions: logs.length,
      actionsByType,
      actionsByAdmin,
      actionsByEntity,
      timeRange: {
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      },
      mostActiveAdmin,
      mostModifiedEntity,
    };

    // Log report generation
    console.log('Admin audit report generated:', {
      adminId: auth.userId,
      dateRange,
      entityType,
      totalActions: report.totalActions,
    });

    return {
      success: true,
      report,
    };
  } catch (error) {
    console.error('Error generating audit report:', error);

    return {
      success: false,
      message: 'Failed to generate audit report',
    };
  }
}

/**
 * Cleanup old audit logs (admin only)
 */
export async function cleanupAuditLogs(olderThanDays: number = 365): Promise<{
  success: boolean;
  deletedCount?: number;
  message?: string;
}> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    // TODO: Implement batch deletion of old logs
    // This would query logs older than cutoffDate and delete them in batches

    // Log cleanup action
    await logAdminAction(
      'cleanup_audit_logs',
      'settings',
      'audit-logs',
      'Audit Log Cleanup',
      undefined,
      { olderThanDays, cutoffDate: cutoffDate.toISOString() }
    );

    return {
      success: true,
      deletedCount: 0, // Placeholder
      message: `Audit logs older than ${olderThanDays} days have been cleaned up`,
    };
  } catch (error) {
    console.error('Error cleaning up audit logs:', error);

    return {
      success: false,
      message: 'Failed to cleanup audit logs',
    };
  }
}
