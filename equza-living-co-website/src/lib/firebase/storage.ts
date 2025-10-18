/**
 * Firebase Storage Utilities
 * File upload, download, and management functions
 */

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
  UploadTask,
  StorageReference,
  UploadResult,
  FullMetadata,
} from 'firebase/storage';

import { storage } from './config';
import { validateFile } from '@/lib/utils/validation';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
}

export interface FileUploadOptions {
  path: string;
  file: File;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (downloadURL: string) => void;
  onError?: (error: Error) => void;
  metadata?: {
    contentType?: string;
    cacheControl?: string;
    customMetadata?: Record<string, string>;
  };
}

export interface FileInfo {
  name: string;
  fullPath: string;
  downloadURL: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  customMetadata?: Record<string, string>;
}

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(options: FileUploadOptions): Promise<string> {
  const { path, file, onProgress, onComplete, onError, metadata } = options;

  try {
    // Check if storage is available
    if (!storage) {
      throw new Error(
        'Firebase Storage is not initialized. Please check your configuration.'
      );
    }

    // Check authentication status
    const { auth } = await import('./config');
    const currentUser = auth?.currentUser;
    console.log('🔐 Firebase Storage: Auth status:', {
      hasAuth: !!auth,
      hasCurrentUser: !!currentUser,
      userEmail: currentUser?.email,
      userUID: currentUser?.uid,
    });

    // Validate file before upload
    const isValid = validateFile(file);
    if (!isValid) {
      throw new Error('Invalid file format or size');
    }

    console.log('📤 Firebase Storage: Uploading file', {
      path,
      fileName: file.name,
      fileSize: file.size,
    });
    console.log('📤 Firebase Storage: Storage object:', {
      storage,
      isNull: storage === null,
    });

    // Test storage bucket access first
    try {
      const storageRef = ref(storage, path);
      console.log('📤 Firebase Storage: Storage ref created successfully:', {
        bucket: storageRef.bucket,
        fullPath: storageRef.fullPath,
      });
    } catch (refError) {
      console.error(
        '❌ Firebase Storage: Failed to create storage reference:',
        refError
      );
      throw refError;
    }

    const storageRef = ref(storage, path);

    if (onProgress) {
      // Use resumable upload for progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress: UploadProgress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              percentage:
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              state: snapshot.state as UploadProgress['state'],
            };
            onProgress(progress);
          },
          (error) => {
            console.error('❌ Firebase Storage: Upload error details:', {
              code: error.code,
              message: error.message,
              serverResponse: error.serverResponse,
              fullPath: storageRef.fullPath,
            });
            const errorMessage = getStorageErrorMessage(error.code);
            const uploadError = new Error(`${errorMessage} (${error.code})`);
            onError?.(uploadError);
            reject(uploadError);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              onComplete?.(downloadURL);
              resolve(downloadURL);
            } catch (error) {
              const downloadError = new Error('Failed to get download URL');
              onError?.(downloadError);
              reject(downloadError);
            }
          }
        );
      });
    } else {
      // Simple upload without progress tracking
      console.log(
        '📤 Firebase Storage: Starting simple upload (no progress tracking)'
      );
      const result = await uploadBytes(storageRef, file, metadata);
      console.log(
        '📤 Firebase Storage: Upload successful, getting download URL'
      );
      const downloadURL = await getDownloadURL(result.ref);
      console.log('📤 Firebase Storage: Download URL obtained:', downloadURL);
      onComplete?.(downloadURL);
      return downloadURL;
    }
  } catch (error) {
    console.error('❌ Firebase Storage: Upload failed with error:', {
      error,
      errorCode: (error as any)?.code,
      errorMessage: (error as any)?.message,
      serverResponse: (error as any)?.serverResponse,
      path,
      fileName: file.name,
    });
    const uploadError =
      error instanceof Error ? error : new Error('Upload failed');
    onError?.(uploadError);
    throw uploadError;
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  getPath: (file: File, index: number) => string,
  onProgress?: (fileIndex: number, progress: UploadProgress) => void,
  onFileComplete?: (fileIndex: number, downloadURL: string) => void,
  onError?: (fileIndex: number, error: Error) => void
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const uploadOptions: FileUploadOptions = {
      path: getPath(file, index),
      file,
    };

    if (onProgress) {
      uploadOptions.onProgress = (progress) => onProgress(index, progress);
    }
    if (onFileComplete) {
      uploadOptions.onComplete = (url) => onFileComplete(index, url);
    }
    if (onError) {
      uploadOptions.onError = (error) => onError(index, error);
    }

    return uploadFile(uploadOptions);
  });

  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Delete multiple files
 */
export async function deleteMultipleFiles(paths: string[]): Promise<void> {
  const deletePromises = paths.map((path) => deleteFile(path));
  await Promise.all(deletePromises);
}

/**
 * Get file download URL
 */
export async function getFileURL(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw new Error('Failed to get file URL');
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(path: string): Promise<FullMetadata> {
  try {
    const storageRef = ref(storage, path);
    return await getMetadata(storageRef);
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw new Error('Failed to get file metadata');
  }
}

/**
 * Update file metadata
 */
export async function updateFileMetadata(
  path: string,
  metadata: {
    cacheControl?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    contentLanguage?: string;
    contentType?: string;
    customMetadata?: Record<string, string>;
  }
): Promise<FullMetadata> {
  try {
    const storageRef = ref(storage, path);
    return await updateMetadata(storageRef, metadata);
  } catch (error) {
    console.error('Error updating file metadata:', error);
    throw new Error('Failed to update file metadata');
  }
}

/**
 * List files in a directory
 */
export async function listFiles(path: string): Promise<FileInfo[]> {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);

    const fileInfoPromises = result.items.map(async (itemRef) => {
      const [downloadURL, metadata] = await Promise.all([
        getDownloadURL(itemRef),
        getMetadata(itemRef),
      ]);

      const fileInfo: FileInfo = {
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        downloadURL,
        size: metadata.size,
        contentType: metadata.contentType || 'unknown',
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
      };

      if (metadata.customMetadata) {
        fileInfo.customMetadata = metadata.customMetadata;
      }

      return fileInfo;
    });

    return Promise.all(fileInfoPromises);
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error('Failed to list files');
  }
}

/**
 * Generate a unique file path
 */
export function generateFilePath(
  directory: string,
  filename: string,
  addTimestamp = true
): string {
  const timestamp = addTimestamp ? Date.now() : '';
  const extension = filename.split('.').pop();
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
  const sanitizedName = nameWithoutExtension.replace(/[^a-zA-Z0-9-_]/g, '_');

  const finalName = addTimestamp
    ? `${sanitizedName}_${timestamp}.${extension}`
    : `${sanitizedName}.${extension}`;

  return `${directory.replace(/\/$/, '')}/${finalName}`;
}

/**
 * Generate paths for different file types
 */
export const generatePaths = {
  productImage: (filename: string, productId?: string) =>
    generateFilePath(`images/products/${productId || 'general'}`, filename),

  collectionImage: (filename: string, collectionId?: string) =>
    generateFilePath(
      `images/collections/${collectionId || 'general'}`,
      filename
    ),

  weaveTypeImage: (filename: string, weaveTypeId?: string) =>
    generateFilePath(
      `images/weave-types/${weaveTypeId || 'general'}`,
      filename
    ),

  tempUpload: (filename: string, sessionId: string) =>
    generateFilePath(`uploads/temp/${sessionId}`, filename),

  adminUpload: (filename: string, folder = 'general') =>
    generateFilePath(`uploads/admin/${folder}`, filename),

  lookbook: (filename: string) => generateFilePath('lookbook', filename, false),
};

/**
 * Get storage error message
 */
function getStorageErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'storage/object-not-found':
      return 'File not found.';
    case 'storage/unauthorized':
      return 'Not authorized to access this file.';
    case 'storage/canceled':
      return 'Upload was canceled.';
    case 'storage/quota-exceeded':
      return 'Storage quota exceeded.';
    case 'storage/invalid-format':
      return 'Invalid file format.';
    case 'storage/invalid-event-name':
      return 'Invalid upload event.';
    case 'storage/invalid-url':
      return 'Invalid file URL.';
    case 'storage/invalid-argument':
      return 'Invalid upload argument.';
    case 'storage/no-default-bucket':
      return 'No storage bucket configured.';
    case 'storage/retry-limit-exceeded':
      return 'Upload retry limit exceeded.';
    default:
      return 'An error occurred during file operation.';
  }
}

// Export types
export type { UploadTask, StorageReference, UploadResult, FullMetadata };
