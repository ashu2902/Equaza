/**
 * Admin Lead Management Actions
 * Server-side actions for admin lead CRUD operations
 */

'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Lead, LeadStatus, LeadNote } from '@/types';
import { 
  updateLead,
  deleteLead,
  updateLeadStatus,
  addLeadNote,
  getLeadById 
} from '@/lib/firebase/leads';
import { checkAdminStatus } from '@/lib/firebase/auth';

export interface AdminLeadResult {
  success: boolean;
  message: string;
  leadId?: string;
  errors?: Record<string, string>;
}

export interface BulkLeadResult {
  success: boolean;
  message: string;
  processed: number;
  errors: number;
  results: Array<{ id?: string; error?: string; name: string }>;
}

/**
 * Verify admin authentication
 */
async function verifyAdminAuth(): Promise<{ isAdmin: boolean; userId?: string }> {
  try {
    const adminStatus = await checkAdminStatus();
    return {
      isAdmin: adminStatus.isAdmin,
      userId: adminStatus.userId,
    };
  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return { isAdmin: false };
  }
}

/**
 * Update lead status (admin only)
 */
export async function updateAdminLeadStatus(
  leadId: string,
  status: LeadStatus,
  assignedTo?: string
): Promise<AdminLeadResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Get current lead for logging
    const currentLead = await getLeadById(leadId);
    if (!currentLead) {
      return {
        success: false,
        message: 'Lead not found',
      };
    }

    // Update lead status
    await updateLeadStatus(leadId, status, assignedTo);

    // Invalidate cache
    revalidateTag('leads');
    revalidateTag('leads-stats');

    // Log admin action
    console.log('Admin lead status updated:', {
      leadId,
      adminId: auth.userId,
      oldStatus: currentLead.status,
      newStatus: status,
      assignedTo,
    });

    return {
      success: true,
      message: `Lead status updated to ${status}`,
      leadId,
    };

  } catch (error) {
    console.error('Error updating lead status:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update lead status',
    };
  }
}

/**
 * Add note to lead (admin only)
 */
export async function addAdminLeadNote(
  leadId: string,
  noteContent: string
): Promise<AdminLeadResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.userId) {
      redirect('/admin/login');
    }

    if (!noteContent.trim()) {
      return {
        success: false,
        message: 'Note content is required',
        errors: { note: 'Note content cannot be empty' },
      };
    }

    // Add note to lead
    await addLeadNote(leadId, noteContent.trim(), auth.userId);

    // Invalidate cache
    revalidateTag('leads');

    // Log admin action
    console.log('Admin lead note added:', {
      leadId,
      adminId: auth.userId,
      noteLength: noteContent.length,
    });

    return {
      success: true,
      message: 'Note added successfully',
      leadId,
    };

  } catch (error) {
    console.error('Error adding lead note:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add note',
    };
  }
}

/**
 * Update lead information (admin only)
 */
export async function updateAdminLead(
  leadId: string,
  updates: Partial<Omit<Lead, 'id' | 'createdAt' | 'notes'>>
): Promise<AdminLeadResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Validate updates
    const errors: Record<string, string> = {};

    if (updates.name !== undefined && (!updates.name || updates.name.trim().length < 1)) {
      errors.name = 'Name is required';
    }

    if (updates.email !== undefined && (!updates.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email))) {
      errors.email = 'Valid email is required';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    // Get current lead for logging
    const currentLead = await getLeadById(leadId);
    if (!currentLead) {
      return {
        success: false,
        message: 'Lead not found',
      };
    }

    // Update lead
    await updateLead(leadId, updates);

    // Invalidate cache
    revalidateTag('leads');

    // Log admin action
    console.log('Admin lead updated:', {
      leadId,
      adminId: auth.userId,
      updates: Object.keys(updates),
    });

    return {
      success: true,
      message: 'Lead updated successfully',
      leadId,
    };

  } catch (error) {
    console.error('Error updating lead:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
}

/**
 * Delete lead (admin only)
 */
export async function deleteAdminLead(
  leadId: string
): Promise<AdminLeadResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Get lead for logging
    const lead = await getLeadById(leadId);
    if (!lead) {
      return {
        success: false,
        message: 'Lead not found',
      };
    }

    // Delete lead
    await deleteLead(leadId);

    // Invalidate cache
    revalidateTag('leads');
    revalidateTag('leads-stats');

    // Log admin action
    console.log('Admin lead deleted:', {
      leadId,
      adminId: auth.userId,
      leadType: lead.type,
      leadName: lead.name,
    });

    return {
      success: true,
      message: 'Lead deleted successfully',
      leadId,
    };

  } catch (error) {
    console.error('Error deleting lead:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete lead',
    };
  }
}

/**
 * Assign lead to admin user
 */
export async function assignLead(
  leadId: string,
  assignToUserId: string
): Promise<AdminLeadResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Update lead assignment
    await updateLead(leadId, { assignedTo: assignToUserId });

    // Invalidate cache
    revalidateTag('leads');

    // Log admin action
    console.log('Admin lead assigned:', {
      leadId,
      adminId: auth.userId,
      assignedTo: assignToUserId,
    });

    return {
      success: true,
      message: 'Lead assigned successfully',
      leadId,
    };

  } catch (error) {
    console.error('Error assigning lead:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to assign lead',
    };
  }
}

/**
 * Bulk update lead status
 */
export async function bulkUpdateLeadStatus(
  leadIds: string[],
  status: LeadStatus,
  assignedTo?: string
): Promise<BulkLeadResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    const results: Array<{ id?: string; error?: string; name: string }> = [];
    let processed = 0;
    let errors = 0;

    // Process each lead
    for (const leadId of leadIds) {
      try {
        const lead = await getLeadById(leadId);
        if (!lead) {
          results.push({
            error: 'Lead not found',
            name: `Lead ${leadId}`,
          });
          errors++;
          continue;
        }

        await updateLeadStatus(leadId, status, assignedTo);
        results.push({
          id: leadId,
          name: lead.name,
        });
        processed++;

      } catch (error) {
        console.error(`Error updating lead ${leadId}:`, error);
        results.push({
          error: error instanceof Error ? error.message : 'Update failed',
          name: `Lead ${leadId}`,
        });
        errors++;
      }
    }

    // Invalidate cache
    revalidateTag('leads');
    revalidateTag('leads-stats');

    // Log admin action
    console.log('Admin bulk lead status update:', {
      adminId: auth.userId,
      processed,
      errors,
      status,
      assignedTo,
    });

    return {
      success: processed > 0,
      message: `Updated ${processed} leads to ${status}${errors > 0 ? `, ${errors} errors` : ''}`,
      processed,
      errors,
      results,
    };

  } catch (error) {
    console.error('Error bulk updating lead status:', error);
    
    return {
      success: false,
      message: 'Failed to process bulk update',
      processed: 0,
      errors: leadIds.length,
      results: [],
    };
  }
}

/**
 * Bulk delete leads
 */
export async function bulkDeleteLeads(
  leadIds: string[]
): Promise<BulkLeadResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    const results: Array<{ id?: string; error?: string; name: string }> = [];
    let processed = 0;
    let errors = 0;

    // Process each lead
    for (const leadId of leadIds) {
      try {
        const lead = await getLeadById(leadId);
        if (!lead) {
          results.push({
            error: 'Lead not found',
            name: `Lead ${leadId}`,
          });
          errors++;
          continue;
        }

        await deleteLead(leadId);
        results.push({
          id: leadId,
          name: lead.name,
        });
        processed++;

      } catch (error) {
        console.error(`Error deleting lead ${leadId}:`, error);
        results.push({
          error: error instanceof Error ? error.message : 'Delete failed',
          name: `Lead ${leadId}`,
        });
        errors++;
      }
    }

    // Invalidate cache
    revalidateTag('leads');
    revalidateTag('leads-stats');

    // Log admin action
    console.log('Admin bulk lead delete:', {
      adminId: auth.userId,
      processed,
      errors,
    });

    return {
      success: processed > 0,
      message: `Deleted ${processed} leads${errors > 0 ? `, ${errors} errors` : ''}`,
      processed,
      errors,
      results,
    };

  } catch (error) {
    console.error('Error bulk deleting leads:', error);
    
    return {
      success: false,
      message: 'Failed to process bulk delete',
      processed: 0,
      errors: leadIds.length,
      results: [],
    };
  }
}

/**
 * Export leads data (admin only)
 */
export async function exportLeads(
  filters?: {
    type?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }
): Promise<{
  success: boolean;
  message: string;
  data?: Array<{
    id: string;
    type: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    status: string;
    assignedTo?: string;
    createdAt: string;
    source: string;
  }>;
}> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // TODO: Implement lead export with filters
    // This would fetch leads based on filters and return formatted data
    // const leads = await getLeads(filters);
    
    // Log admin action
    console.log('Admin leads exported:', {
      adminId: auth.userId,
      filters,
    });

    return {
      success: true,
      message: 'Leads exported successfully',
      data: [], // Placeholder
    };

  } catch (error) {
    console.error('Error exporting leads:', error);
    
    return {
      success: false,
      message: 'Failed to export leads',
    };
  }
}

/**
 * Get lead analytics (admin only)
 */
export async function getLeadAnalytics(
  dateRange?: { from: Date; to: Date }
): Promise<{
  success: boolean;
  data?: {
    totalLeads: number;
    leadsByType: Record<string, number>;
    leadsByStatus: Record<string, number>;
    leadsBySource: Record<string, number>;
    conversionRate: number;
    averageResponseTime: number;
  };
}> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // TODO: Implement lead analytics
    // This would calculate various metrics from lead data
    
    return {
      success: true,
      data: {
        totalLeads: 0,
        leadsByType: {},
        leadsByStatus: {},
        leadsBySource: {},
        conversionRate: 0,
        averageResponseTime: 0,
      },
    };

  } catch (error) {
    console.error('Error getting lead analytics:', error);
    
    return {
      success: false,
    };
  }
}