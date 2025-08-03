/**
 * Admin Actions Index
 * Central export file for all admin-related server actions
 */

// Collection Management
export {
  createAdminCollection,
  updateAdminCollection,
  deleteAdminCollection,
  updateCollectionSortOrders,
  toggleCollectionStatus,
  duplicateCollection,
  type AdminCollectionResult,
} from './collections';

// Product Management
export {
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateProductSortOrders,
  toggleProductStatus,
  toggleProductFeatured,
  duplicateProduct,
  bulkUpdateProducts,
  type AdminProductResult,
  type BulkProductResult,
} from './products';

// Lead Management
export {
  updateAdminLeadStatus,
  addAdminLeadNote,
  updateAdminLead,
  deleteAdminLead,
  assignLead,
  bulkUpdateLeadStatus,
  bulkDeleteLeads,
  exportLeads,
  getLeadAnalytics,
  type AdminLeadResult,
  type BulkLeadResult,
} from './leads';

// Content & Settings Management
export {
  updatePageContent,
  updateAdminSiteSettings,
  updateAdminLookbook,
  deactivateAdminLookbook,
  updateSEODefaults,
  updateSocialLinks,
  getAdminSettings,
  type AdminPageResult,
  type AdminSettingsResult,
} from './pages';

// Audit Logging & Tracking
export {
  logAdminAction,
  getAuditLogs,
  getEntityAuditLogs,
  getAdminUserLogs,
  generateAuditReport,
  cleanupAuditLogs,
  createChangeLog,
  type AuditLogEntry,
  type AuditLogResult,
  type AuditLogQuery,
} from './audit';