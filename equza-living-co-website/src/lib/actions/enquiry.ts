/**
 * Product Enquiry Server Actions
 * Server-side actions for handling product enquiry submissions
 */

'use server';

import { EnquiryFormData } from '@/types';
import { enquiryFormSchema } from '@/lib/utils/validation';
import { createEnquiryLead } from '@/lib/firebase/leads';
import { getProductById } from '@/lib/firebase/products';

export interface EnquiryActionResult {
  success: boolean;
  message: string;
  leadId?: string;
  errors?: Record<string, string>;
  productName?: string;
}

/**
 * Submit product enquiry form server action
 */
export async function submitEnquiryForm(
  formData: EnquiryFormData,
  source: string = 'product-enquiry'
): Promise<EnquiryActionResult> {
  try {
    // Validate form data
    const validationResult = enquiryFormSchema.safeParse(formData);
    
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

    // Verify product exists
    const product = await getProductById(validatedData.productId);
    if (!product) {
      return {
        success: false,
        message: 'Product not found. Please try again.',
        errors: { productId: 'Product not found' },
      };
    }

    // Create lead in Firestore
    const leadId = await createEnquiryLead(validatedData, source);


    // TODO: Send email notifications (Phase 6.2 email integration)
    // await sendEnquiryNotificationEmail(validatedData, leadId, product);
    // await sendEnquiryAutoReplyEmail(validatedData.email, validatedData.name, product.name);

    return {
      success: true,
      message: `Thank you for your enquiry about ${product.name}! We'll get back to you within 24 hours.`,
      leadId,
      productName: product.name,
    };

  } catch (error) {
    console.error('Error submitting enquiry form:', error);
    
    return {
      success: false,
      message: error instanceof Error 
        ? error.message 
        : 'Something went wrong. Please try again.',
    };
  }
}

/**
 * Submit enquiry from product detail page
 */
export async function submitProductPageEnquiry(
  formData: EnquiryFormData
): Promise<EnquiryActionResult> {
  return submitEnquiryForm(formData, 'product-detail-page');
}

/**
 * Submit enquiry from product card
 */
export async function submitProductCardEnquiry(
  formData: EnquiryFormData
): Promise<EnquiryActionResult> {
  return submitEnquiryForm(formData, 'product-card');
}

/**
 * Submit enquiry from collection page
 */
export async function submitCollectionPageEnquiry(
  formData: EnquiryFormData
): Promise<EnquiryActionResult> {
  return submitEnquiryForm(formData, 'collection-page');
}

/**
 * Submit quick enquiry (minimal form)
 */
export async function submitQuickEnquiry(
  productId: string,
  email: string,
  name: string,
  message?: string
): Promise<EnquiryActionResult> {
  const formData: EnquiryFormData = {
    productId,
    email,
    name,
    message: message || `I'm interested in learning more about this product.`,
  };

  return submitEnquiryForm(formData, 'quick-enquiry');
}

/**
 * Get product information for enquiry
 */
export async function getProductForEnquiry(productId: string): Promise<{
  success: boolean;
  product?: {
    id: string;
    name: string;
    description: string;
    images: Array<{ url: string; alt: string; isMain: boolean }>;
    collections: string[];
    price: { isVisible: boolean; startingFrom?: number; currency?: string };
  };
  error?: string;
}> {
  try {
    const product = await getProductById(productId);
    
    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      };
    }

    return {
      success: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        collections: product.collections,
        price: product.price,
      },
    };
  } catch (error) {
    console.error('Error getting product for enquiry:', error);
    return {
      success: false,
      error: 'Failed to load product information',
    };
  }
}

/**
 * Track enquiry analytics
 */
export async function trackEnquiryAnalytics(
  productId: string,
  source: string,
  userId?: string
): Promise<void> {
  try {
    // TODO: Implement analytics tracking
    // This could track which products get the most enquiries
    // and which sources are most effective
    console.log('Tracking enquiry analytics:', { productId, source, userId });
  } catch (error) {
    console.error('Error tracking enquiry analytics:', error);
    // Don't throw error as this is non-critical
  }
}