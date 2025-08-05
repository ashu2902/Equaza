/**
 * File Handling Server Actions
 * Server-side actions for file uploads and processing
 */

'use server';

import { revalidateTag } from 'next/cache';
import { uploadFile, uploadMultipleFiles, deleteFile } from '@/lib/firebase/storage';
import { FILE_UPLOAD } from '@/lib/utils/constants';

export interface FileUploadResult {
  success: boolean;
  message: string;
  url?: string;
  filename?: string;
  error?: string;
}

export interface MultipleFileUploadResult {
  success: boolean;
  message: string;
  results: FileUploadResult[];
  successCount: number;
  errorCount: number;
}

/**
 * Validate file type and size
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_UPLOAD.maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(FILE_UPLOAD.maxSize / 1024 / 1024)}MB`
    };
  }

  // Check file type
  if (!FILE_UPLOAD.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not supported. Allowed types: ${FILE_UPLOAD.allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Generate file path based on context
 */
function generateFilePath(
  filename: string,
  context: 'moodboard' | 'product' | 'collection' | 'admin' | 'temp',
  userId?: string,
  additionalPath?: string
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  switch (context) {
    case 'moodboard':
      return `uploads/temp/${userId || 'anonymous'}/${timestamp}-${sanitizedFilename}`;
    
    case 'product':
      return `images/products/${additionalPath || 'general'}/${timestamp}-${sanitizedFilename}`;
    
    case 'collection':
      return `images/collections/${additionalPath || 'general'}/${timestamp}-${sanitizedFilename}`;
    
    case 'admin':
      return `uploads/admin/${additionalPath || 'uploads'}/${timestamp}-${sanitizedFilename}`;
    
    case 'temp':
      return `uploads/temp/${timestamp}-${sanitizedFilename}`;
    
    default:
      return `uploads/general/${timestamp}-${sanitizedFilename}`;
  }
}

/**
 * Upload single file server action
 */
export async function uploadSingleFile(
  file: File,
  context: 'moodboard' | 'product' | 'collection' | 'admin' | 'temp' = 'temp',
  userId?: string,
  additionalPath?: string
): Promise<FileUploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.error || 'File validation failed',
        error: validation.error,
      };
    }

    // Generate file path
    const filePath = generateFilePath(file.name, context, userId, additionalPath);

    // Upload file
    const url = await uploadFile({
      path: filePath,
      file,
      metadata: {
        contentType: file.type,
        customMetadata: {
          originalName: file.name,
          uploadedBy: userId || 'anonymous',
          context,
        },
      },
    });

    return {
      success: true,
      message: 'File uploaded successfully',
      url: url || undefined,
      filename: file.name,
    };

  } catch (error) {
    console.error('Error uploading file:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload multiple files server action
 */
export async function uploadMultipleFileAction(
  files: File[],
  context: 'moodboard' | 'product' | 'collection' | 'admin' | 'temp' = 'temp',
  userId?: string,
  additionalPath?: string
): Promise<MultipleFileUploadResult> {
  try {
    if (files.length === 0) {
      return {
        success: false,
        message: 'No files to upload',
        results: [],
        successCount: 0,
        errorCount: 0,
      };
    }

    // Validate all files first
    const validationErrors: string[] = [];
    files.forEach((file, index) => {
      const validation = validateFile(file);
      if (!validation.valid) {
        validationErrors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
      }
    });

    if (validationErrors.length > 0) {
      return {
        success: false,
        message: 'Some files failed validation',
        results: validationErrors.map(error => ({
          success: false,
          message: error,
          error,
        })),
        successCount: 0,
        errorCount: validationErrors.length,
      };
    }

    // Generate file paths
    const filePaths = files.map(file => 
      generateFilePath(file.name, context, userId, additionalPath)
    );

    // Upload files
    const uploadResults = await uploadMultipleFiles(
      files,
      (file, index) => filePaths[index] || `uploads/temp/${Date.now()}-${file.name}`
    );

    // Process results
    const results: FileUploadResult[] = uploadResults.map((url, index) => ({
      success: !!url,
      message: url ? 'Upload successful' : 'Upload failed',
      url: url,
      filename: files[index]?.name,
      error: url ? undefined : 'Upload failed',
    }));

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return {
      success: successCount > 0,
      message: successCount === files.length 
        ? 'All files uploaded successfully'
        : `${successCount} of ${files.length} files uploaded successfully`,
      results,
      successCount,
      errorCount,
    };

  } catch (error) {
    console.error('Error uploading multiple files:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed',
      results: [],
      successCount: 0,
      errorCount: files.length,
    };
  }
}

/**
 * Upload moodboard files (specific for customize form)
 */
export async function uploadMoodboardFiles(
  files: File[],
  userId?: string,
  leadId?: string
): Promise<MultipleFileUploadResult> {
  return uploadMultipleFileAction(
    files,
    'moodboard',
    userId,
    leadId ? `lead-${leadId}` : undefined
  );
}

/**
 * Upload product images (admin only)
 */
export async function uploadProductImages(
  files: File[],
  productId: string,
  userId: string
): Promise<MultipleFileUploadResult> {
  return uploadMultipleFileAction(files, 'product', userId, productId);
}

/**
 * Upload collection images (admin only)
 */
export async function uploadCollectionImages(
  files: File[],
  collectionId: string,
  userId: string
): Promise<MultipleFileUploadResult> {
  return uploadMultipleFileAction(files, 'collection', userId, collectionId);
}

/**
 * Delete file server action
 */
export async function deleteFileAction(
  fileUrl: string,
  context?: string
): Promise<{ success: boolean; message: string }> {
  try {
    await deleteFile(fileUrl);
    
    // Invalidate relevant cache tags
    if (context) {
      revalidateTag(`files-${context}`);
    }
    
    return {
      success: true,
      message: 'File deleted successfully',
    };

  } catch (error) {
    console.error('Error deleting file:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
}

/**
 * Get upload progress (placeholder for future implementation)
 */
export async function getUploadProgress(
  uploadId: string
): Promise<{
  progress: number;
  completed: boolean;
  error?: string;
}> {
  try {
    // TODO: Implement upload progress tracking
    // This could track long-running uploads and provide real-time progress
    
    return {
      progress: 100,
      completed: true,
    };
  } catch (error) {
    console.error('Error getting upload progress:', error);
    
    return {
      progress: 0,
      completed: false,
      error: 'Failed to get upload progress',
    };
  }
}

/**
 * Process image optimization (placeholder for future implementation)
 */
export async function processImageOptimization(
  imageUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): Promise<{
  success: boolean;
  optimizedUrl?: string;
  originalSize?: number;
  optimizedSize?: number;
  error?: string;
}> {
  try {
    // TODO: Implement image optimization
    // This could use a service like Cloudinary or implement custom optimization
    
    return {
      success: true,
      optimizedUrl: imageUrl,
      originalSize: 1000000,
      optimizedSize: 500000,
    };
  } catch (error) {
    console.error('Error processing image optimization:', error);
    
    return {
      success: false,
      error: 'Failed to optimize image',
    };
  }
}