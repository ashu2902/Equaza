/**
 * Server Actions Index
 * Central export file for all server actions
 */

// Contact form actions
export {
  submitContactForm,
  submitHeroContactForm,
  submitContactPageForm,
  submitFooterContactForm,
  type ContactActionResult,
} from './contact';

// Customize form actions
export {
  submitCustomizeForm,
  submitHomepageCustomizeForm,
  submitCustomizePageForm,
  getCustomizeFormProgress,
  type CustomizeActionResult,
} from './customize';

// Product enquiry actions
export {
  submitEnquiryForm,
  submitProductPageEnquiry,
  submitProductCardEnquiry,
  submitCollectionPageEnquiry,
  submitQuickEnquiry,
  getProductForEnquiry,
  trackEnquiryAnalytics,
  type EnquiryActionResult,
} from './enquiry';

// Trade partnership actions
export {
  submitTradeForm,
  submitTradePageForm,
  submitFooterTradeForm,
  submitQuickTradeEnquiry,
  checkApplicationStatus,
  getTradeRequirements,
  subscribeToTradeUpdates,
  type TradeActionResult,
} from './trade';

// File handling actions
export {
  uploadSingleFile,
  uploadMultipleFileAction,
  uploadMoodboardFiles,
  uploadProductImages,
  uploadCollectionImages,
  deleteFileAction,
  getUploadProgress,
  processImageOptimization,
  type FileUploadResult,
  type MultipleFileUploadResult,
} from './files';

// Email integration actions
export {
  sendContactNotificationEmail,
  sendContactAutoReplyEmail,
  sendCustomizeNotificationEmail,
  sendEnquiryNotificationEmail,
  sendTradeNotificationEmail,
  sendBulkNotificationEmail,
  type EmailResult,
} from './email';

// Admin CRUD operations and management
export * from './admin';
