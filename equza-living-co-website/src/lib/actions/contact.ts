/**
 * Contact Form Server Actions
 * Server-side actions for handling contact form submissions
 */

'use server';

import { revalidateTag } from 'next/cache';
import { ContactFormData } from '@/types';
import { contactFormSchema } from '@/lib/utils/validation';
import { createContactLead } from '@/lib/firebase/leads';

export interface ContactActionResult {
  success: boolean;
  message: string;
  leadId?: string;
  errors?: Record<string, string>;
}

/**
 * Submit contact form server action
 */
export async function submitContactForm(
  formData: ContactFormData,
  source: string = 'contact-form'
): Promise<ContactActionResult> {
  try {
    // Validate form data
    const validationResult = contactFormSchema.safeParse(formData);
    
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

    // Create lead in Firestore
    const leadId = await createContactLead(validatedData, source);

    // Invalidate cache tags
    revalidateTag('leads');
    revalidateTag('leads-stats');

    // TODO: Send email notifications (Phase 6.2 email integration)
    // await sendContactNotificationEmail(validatedData, leadId);
    // await sendContactAutoReplyEmail(validatedData.email, validatedData.name);

    return {
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      leadId,
    };

  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    return {
      success: false,
      message: error instanceof Error 
        ? error.message 
        : 'Something went wrong. Please try again.',
    };
  }
}

/**
 * Submit contact form from homepage hero
 */
export async function submitHeroContactForm(
  formData: ContactFormData
): Promise<ContactActionResult> {
  return submitContactForm(formData, 'homepage-hero');
}

/**
 * Submit contact form from contact page
 */
export async function submitContactPageForm(
  formData: ContactFormData
): Promise<ContactActionResult> {
  return submitContactForm(formData, 'contact-page');
}

/**
 * Submit contact form from footer
 */
export async function submitFooterContactForm(
  formData: ContactFormData
): Promise<ContactActionResult> {
  return submitContactForm(formData, 'footer-form');
}