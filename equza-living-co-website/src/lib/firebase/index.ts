/**
 * Firebase Utilities Index
 * Central export file for all Firebase-related utilities
 */

// Firebase configuration and services
export {
  app,
  auth,
  db,
  storage,
  functions,
  firebaseConfig,
  isFirebaseConfigured,
  getProjectId,
} from './config';

// Legacy Firestore operations (maintained for compatibility)
export {
  getPage,
  getLookbook,
} from './firestore';

// Collections data layer
export {
  getCollections,
  getCollectionsByType,
  getCollectionById,
  getCollectionBySlug,
  getFeaturedCollections,
  searchCollections,
  getCollectionsCount,
  createCollection,
  updateCollection,
  deleteCollection,
  isCollectionSlugAvailable,
} from './collections';

// Products data layer
export {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getProductsByCollection,
  searchProducts,
  getRelatedProducts,
  getProductsStats,
  getProductFilterOptions,
  createProduct,
  updateProduct,
  deleteProduct,
  isProductSlugAvailable,
} from './products';

// Leads data layer
export {
  getLeads,
  getLeadById,
  getLeadsByStatus,
  getLeadsByType,
  getRecentLeads,
  getLeadsStats,
  createContactLead,
  createCustomizeLead,
  createEnquiryLead,
  createTradeLead,
  updateLeadStatus,
  addLeadNote,
  updateLead,
  deleteLead,
  searchLeads,
} from './leads';

// Settings data layer
export {
  getSiteSettings,
  getSiteSettingsWithDefaults,
  updateSiteSettings,
  initializeSiteSettings,
  getCurrentLookbook,
  updateCurrentLookbook,
  deactivateLookbook,
  getContactInfo,
  getSEODefaults,
  updateSocialLinks,
  updateSEODefaults,
} from './settings';

// Firebase Admin SDK (server-side)
export {
  getAdminApp,
  getAdminAuth,
  getAdminFirestore,
  getAdminStorage,
  verifyAdminCredentials,
  isAdminConfigured,
  createCustomToken,
  verifyIdToken,
  getUserByUid,
  setCustomUserClaims,
} from './server-app';

// Authentication utilities
export {
  type AuthUser,
  type SignInCredentials,
  type SignUpData,
  mapFirebaseUser,
  getCurrentUser,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOutUser,
  sendPasswordReset,
  sendVerificationEmail,
  updateUserProfile,
  onAuthStateChange,
  getUserIdToken,
  checkAdminStatus,
} from './auth';

// Storage utilities
export {
  type UploadProgress,
  type FileUploadOptions,
  type FileInfo,
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  deleteMultipleFiles,
  getFileURL,
  getFileMetadata,
  updateFileMetadata,
  listFiles,
  generateFilePath,
  generatePaths,
} from './storage';

// TODO: Additional Firebase utilities to be implemented
// export { uploadFile, deleteFile } from './storage';
// export { sendNotificationEmail } from './functions'; 