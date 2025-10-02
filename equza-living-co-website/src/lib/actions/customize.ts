/**
 * Customize Form Server Actions
 * Server-side actions for handling custom rug requests
 */

'use server';

import { CustomizeFormData } from '@/types';
import { customizeFormSchema } from '@/lib/utils/validation';
import { createCustomizeLead } from '@/lib/firebase/leads';
import { uploadMultipleFiles } from '@/lib/firebase/storage';

export interface CustomizeActionResult {
  success: boolean;
  message: string;
  leadId?: string;
  errors?: Record<string, string>;
  uploadedFiles?: string[];
}

/**
 * Process file uploads for customize form
 */
async function processFileUploads(
  files: File[],
  leadId: string
): Promise<{ urls: string[], errors: string[] }> {
  const urls: string[] = [];
  const errors: string[] = [];

  if (files.length === 0) {
    return { urls, errors };
  }

  try {
    // Generate file paths for customize requests
    const filePaths = files.map((file, index) => 
      `customize-requests/${leadId}/moodboard-${index + 1}-${Date.now()}`
    );

    const uploadResults = await uploadMultipleFiles(
      files,
      (file, index) => filePaths[index] || `customize-requests/${leadId}/moodboard-${index + 1}-${Date.now()}`
    );

    // Process upload results
    uploadResults.forEach((url, index) => {
      if (url) {
        urls.push(url);
      } else {
        errors.push(`Failed to upload ${files[index]?.name}: Unknown error`);
      }
    });

  } catch (error) {
    console.error('Error processing file uploads:', error);
    errors.push('Failed to upload files. Please try again.');
  }

  return { urls, errors };
}

/**
 * Submit customize form server action
 */
export async function submitCustomizeForm(
  formData: CustomizeFormData,
  source: string = 'customize-form'
): Promise<CustomizeActionResult> {
  try {
    // Validate form data (excluding files for now)
    const dataToValidate = {
      ...formData,
      moodboardFiles: formData.moodboardFiles || [],
    };

    const validationResult = customizeFormSchema.safeParse(dataToValidate);
    
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((error) => {
        const field = error.path[0] as string;
        errors[field] = error.message;
      });
      
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    const validatedData = validationResult.data;

    // Create lead in Firestore first
    const leadId = await createCustomizeLead(validatedData, source);

    // Process file uploads if any
    let uploadedFiles: string[] = [];
    let uploadErrors: string[] = [];

    if (formData.moodboardFiles && formData.moodboardFiles.length > 0) {
      const uploadResult = await processFileUploads(formData.moodboardFiles, leadId);
      uploadedFiles = uploadResult.urls;
      uploadErrors = uploadResult.errors;

      // TODO: Update lead with uploaded file URLs
      // await updateLead(leadId, {
      //   customizationDetails: {
      //     ...validatedData.customizationDetails,
      //     moodboardFiles: uploadedFiles.map(url => ({
      //       filename: 'moodboard-image',
      //       url,
      //       storageRef: url
      //     }))
      //   }
      // });
    }


    // TODO: Send email notifications (Phase 6.2 email integration)
    // await sendCustomizeNotificationEmail(validatedData, leadId, uploadedFiles);
    // await sendCustomizeAutoReplyEmail(validatedData.email, validatedData.name);

    let message = 'Thank you for your custom rug request! Our design team will review your requirements and get back to you within 2 business days.';
    
    if (uploadErrors.length > 0) {
      message += ` Note: Some files couldn't be uploaded: ${uploadErrors.join(', ')}`;
    }

    return {
      success: true,
      message,
      leadId,
      uploadedFiles,
    };

  } catch (error) {
    console.error('Error submitting customize form:', error);
    
    return {
      success: false,
      message: error instanceof Error 
        ? error.message 
        : 'Something went wrong. Please try again.',
    };
  }
}

/**
 * Submit customize form from homepage
 */
export async function submitHomepageCustomizeForm(
  formData: CustomizeFormData
): Promise<CustomizeActionResult> {
  return submitCustomizeForm(formData, 'homepage-customize');
}

/**
 * Submit customize form from dedicated page
 */
export async function submitCustomizePageForm(
  formData: CustomizeFormData
): Promise<CustomizeActionResult> {
  return submitCustomizeForm(formData, 'customize-page');
}

/**
 * Get customize form progress (for multi-step forms)
 */
export async function getCustomizeFormProgress(
  leadId: string
): Promise<{
  step: number;
  completed: boolean;
  data?: Partial<CustomizeFormData>;
}> {
  try {
    // TODO: Implement form progress tracking
    // This would store partial form data and allow users to resume
    return {
      step: 1,
      completed: false,
    };
  } catch (error) {
    console.error('Error getting customize form progress:', error);
    return {
      step: 1,
      completed: false,
    };
  }
}