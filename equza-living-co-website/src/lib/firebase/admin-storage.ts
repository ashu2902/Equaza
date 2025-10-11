/**
 * Firebase Admin Storage Utilities
 * Server-side file operations using Firebase Admin SDK
 */

import { getAdminStorage } from './server-app';

/**
 * Delete a file from Firebase Storage (Admin SDK)
 */
export async function deleteFileAdmin(path: string): Promise<void> {
  try {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const file = bucket.file(path);
    
    await file.delete();
    console.log(`✅ Admin Storage: Successfully deleted file: ${path}`);
  } catch (error) {
    console.error(`❌ Admin Storage: Failed to delete file ${path}:`, error);
    throw error;
  }
}

/**
 * Delete multiple files from Firebase Storage (Admin SDK)
 */
export async function deleteMultipleFilesAdmin(paths: string[]): Promise<void> {
  try {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    
    const deletePromises = paths.map(async (path) => {
      const file = bucket.file(path);
      await file.delete();
      console.log(`✅ Admin Storage: Successfully deleted file: ${path}`);
    });
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('❌ Admin Storage: Failed to delete multiple files:', error);
    throw error;
  }
}

/**
 * Get file download URL (Admin SDK)
 */
export async function getFileURLAdmin(path: string): Promise<string> {
  try {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const file = bucket.file(path);
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });
    
    return url;
  } catch (error) {
    console.error(`❌ Admin Storage: Failed to get file URL for ${path}:`, error);
    throw new Error('Failed to get file URL');
  }
}

/**
 * Check if file exists (Admin SDK)
 */
export async function fileExistsAdmin(path: string): Promise<boolean> {
  try {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const file = bucket.file(path);
    
    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    console.error(`❌ Admin Storage: Failed to check if file exists ${path}:`, error);
    return false;
  }
}

/**
 * Get file metadata (Admin SDK)
 */
export async function getFileMetadataAdmin(path: string): Promise<any> {
  try {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const file = bucket.file(path);
    
    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error(`❌ Admin Storage: Failed to get file metadata for ${path}:`, error);
    throw new Error('Failed to get file metadata');
  }
}

/**
 * List files in a directory (Admin SDK)
 */
export async function listFilesAdmin(path: string): Promise<string[]> {
  try {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    
    const [files] = await bucket.getFiles({
      prefix: path,
    });
    
    return files.map(file => file.name);
  } catch (error) {
    console.error(`❌ Admin Storage: Failed to list files in ${path}:`, error);
    throw new Error('Failed to list files');
  }
}

/**
 * Upload file from buffer (Admin SDK)
 */
export async function uploadFileFromBufferAdmin(
  path: string,
  buffer: Buffer,
  metadata?: {
    contentType?: string;
    cacheControl?: string;
    customMetadata?: Record<string, string>;
  }
): Promise<string> {
  try {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const file = bucket.file(path);
    
    await file.save(buffer, {
      metadata: {
        contentType: metadata?.contentType,
        cacheControl: metadata?.cacheControl,
        metadata: metadata?.customMetadata,
      },
    });
    
    // Get download URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });
    
    console.log(`✅ Admin Storage: Successfully uploaded file: ${path}`);
    return url;
  } catch (error) {
    console.error(`❌ Admin Storage: Failed to upload file ${path}:`, error);
    throw new Error('Failed to upload file');
  }
}
