/**
 * Email Integration Server Actions
 * Server-side actions for sending emails and notifications
 */

'use server';

import type { 
  ContactFormData, 
  CustomizeFormData, 
  EnquiryFormData, 
  TradeFormData,
  Product 
} from '@/types';

export interface EmailResult {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

/**
 * Email templates
 */
const EMAIL_TEMPLATES = {
  // Admin notification templates
  CONTACT_NOTIFICATION: 'contact-notification',
  CUSTOMIZE_NOTIFICATION: 'customize-notification', 
  ENQUIRY_NOTIFICATION: 'enquiry-notification',
  TRADE_NOTIFICATION: 'trade-notification',

  // Auto-reply templates
  CONTACT_AUTO_REPLY: 'contact-auto-reply',
  CUSTOMIZE_AUTO_REPLY: 'customize-auto-reply',
  ENQUIRY_AUTO_REPLY: 'enquiry-auto-reply',
  TRADE_AUTO_REPLY: 'trade-auto-reply',
} as const;

/**
 * Get email configuration from environment
 */
function getEmailConfig() {
  return {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@equzaliving.com',
    fromEmail: process.env.FROM_EMAIL || 'hello@equzaliving.com',
    fromName: process.env.FROM_NAME || 'Equza Living Co.',
    replyToEmail: process.env.REPLY_TO_EMAIL || 'hello@equzaliving.com',
  };
}

/**
 * Send email using configured email service
 * TODO: Implement actual email service (SendGrid, Resend, etc.)
 */
async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string,
  from?: string,
  replyTo?: string
): Promise<EmailResult> {
  try {
    const config = getEmailConfig();
    
    // TODO: Implement actual email sending
    // Example with SendGrid:
    // const msg = {
    //   to,
    //   from: from || config.fromEmail,
    //   subject,
    //   text: textContent,
    //   html: htmlContent,
    //   replyTo: replyTo || config.replyToEmail,
    // };
    // const result = await sgMail.send(msg);
    
    // Placeholder implementation
    console.log('Email would be sent:', {
      to,
      from: from || config.fromEmail,
      subject,
      htmlContent: htmlContent.substring(0, 100) + '...',
    });

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: `mock-${Date.now()}`,
    };

  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate email template content
 */
function generateEmailTemplate(
  template: string,
  data: Record<string, any>
): { subject: string; html: string; text: string } {
  const config = getEmailConfig();
  
  switch (template) {
    case EMAIL_TEMPLATES.CONTACT_NOTIFICATION:
      return {
        subject: `New Contact Form Submission - ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          <p><strong>Source:</strong> ${data.source}</p>
          <p><strong>Lead ID:</strong> ${data.leadId}</p>
        `,
        text: `New Contact Form Submission\n\nName: ${data.name}\nEmail: ${data.email}${data.phone ? `\nPhone: ${data.phone}` : ''}\n\nMessage:\n${data.message}\n\nSource: ${data.source}\nLead ID: ${data.leadId}`,
      };

    case EMAIL_TEMPLATES.CONTACT_AUTO_REPLY:
      return {
        subject: 'Thank you for contacting Equza Living Co.',
        html: `
          <h2>Thank you for your message, ${data.name}!</h2>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <p>In the meantime, feel free to browse our collections or schedule a consultation:</p>
          <ul>
            <li><a href="${process.env.NEXT_PUBLIC_BASE_URL}/collections">Browse Collections</a></li>
            <li><a href="${process.env.NEXT_PUBLIC_BASE_URL}/customize">Custom Rugs</a></li>
            <li><a href="${config.calendlyUrl || '#'}">Schedule Consultation</a></li>
          </ul>
          <p>Best regards,<br>The Equza Living Co. Team</p>
        `,
        text: `Thank you for your message, ${data.name}!\n\nWe've received your message and will get back to you within 24 hours.\n\nBest regards,\nThe Equza Living Co. Team`,
      };

    case EMAIL_TEMPLATES.CUSTOMIZE_NOTIFICATION:
      return {
        subject: `New Custom Rug Request - ${data.name}`,
        html: `
          <h2>New Custom Rug Request</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          <p><strong>Preferred Size:</strong> ${data.preferredSize}</p>
          ${data.preferredMaterials?.length ? `<p><strong>Materials:</strong> ${data.preferredMaterials.join(', ')}</p>` : ''}
          ${data.message ? `<p><strong>Additional Notes:</strong></p><div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${data.message.replace(/\n/g, '<br>')}</div>` : ''}
          ${data.uploadedFiles?.length ? `<p><strong>Uploaded Files:</strong> ${data.uploadedFiles.length} moodboard images</p>` : ''}
          <p><strong>Source:</strong> ${data.source}</p>
          <p><strong>Lead ID:</strong> ${data.leadId}</p>
        `,
        text: `New Custom Rug Request\n\nName: ${data.name}\nEmail: ${data.email}${data.phone ? `\nPhone: ${data.phone}` : ''}\nPreferred Size: ${data.preferredSize}${data.preferredMaterials?.length ? `\nMaterials: ${data.preferredMaterials.join(', ')}` : ''}${data.message ? `\n\nAdditional Notes:\n${data.message}` : ''}${data.uploadedFiles?.length ? `\n\nUploaded Files: ${data.uploadedFiles.length} moodboard images` : ''}\n\nSource: ${data.source}\nLead ID: ${data.leadId}`,
      };

    case EMAIL_TEMPLATES.ENQUIRY_NOTIFICATION:
      return {
        subject: `Product Enquiry - ${data.productName}`,
        html: `
          <h2>Product Enquiry</h2>
          <p><strong>Product:</strong> ${data.productName}</p>
          <p><strong>Customer:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          <p><strong>Source:</strong> ${data.source}</p>
          <p><strong>Lead ID:</strong> ${data.leadId}</p>
        `,
        text: `Product Enquiry\n\nProduct: ${data.productName}\nCustomer: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n\nSource: ${data.source}\nLead ID: ${data.leadId}`,
      };

    default:
      return {
        subject: 'Notification',
        html: '<p>New notification</p>',
        text: 'New notification',
      };
  }
}

/**
 * Send contact form notification email
 */
export async function sendContactNotificationEmail(
  formData: ContactFormData,
  leadId: string,
  source: string = 'contact-form'
): Promise<EmailResult> {
  const config = getEmailConfig();
  const template = generateEmailTemplate(EMAIL_TEMPLATES.CONTACT_NOTIFICATION, {
    ...formData,
    leadId,
    source,
  });

  return sendEmail(
    config.adminEmail,
    template.subject,
    template.html,
    template.text
  );
}

/**
 * Send contact form auto-reply email
 */
export async function sendContactAutoReplyEmail(
  email: string,
  name: string
): Promise<EmailResult> {
  const template = generateEmailTemplate(EMAIL_TEMPLATES.CONTACT_AUTO_REPLY, {
    name,
  });

  return sendEmail(
    email,
    template.subject,
    template.html,
    template.text
  );
}

/**
 * Send customize form notification email
 */
export async function sendCustomizeNotificationEmail(
  formData: CustomizeFormData,
  leadId: string,
  uploadedFiles: string[] = [],
  source: string = 'customize-form'
): Promise<EmailResult> {
  const config = getEmailConfig();
  const template = generateEmailTemplate(EMAIL_TEMPLATES.CUSTOMIZE_NOTIFICATION, {
    ...formData,
    leadId,
    source,
    uploadedFiles,
  });

  return sendEmail(
    config.adminEmail,
    template.subject,
    template.html,
    template.text
  );
}

/**
 * Send enquiry notification email
 */
export async function sendEnquiryNotificationEmail(
  formData: EnquiryFormData,
  leadId: string,
  product: Product,
  source: string = 'product-enquiry'
): Promise<EmailResult> {
  const config = getEmailConfig();
  const template = generateEmailTemplate(EMAIL_TEMPLATES.ENQUIRY_NOTIFICATION, {
    ...formData,
    leadId,
    source,
    productName: product.name,
  });

  return sendEmail(
    config.adminEmail,
    template.subject,
    template.html,
    template.text
  );
}

/**
 * Send trade form notification email
 */
export async function sendTradeNotificationEmail(
  formData: TradeFormData,
  leadId: string,
  applicationId: string,
  source: string = 'trade-form'
): Promise<EmailResult> {
  const config = getEmailConfig();
  const template = generateEmailTemplate(EMAIL_TEMPLATES.TRADE_NOTIFICATION, {
    ...formData,
    leadId,
    source,
    applicationId,
  });

  return sendEmail(
    config.adminEmail,
    template.subject,
    template.html,
    template.text
  );
}

/**
 * Send bulk notification email (for admin use)
 */
export async function sendBulkNotificationEmail(
  recipients: string[],
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<{
  success: boolean;
  results: EmailResult[];
  successCount: number;
  errorCount: number;
}> {
  try {
    const results = await Promise.all(
      recipients.map(email => 
        sendEmail(email, subject, htmlContent, textContent)
      )
    );

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return {
      success: successCount > 0,
      results,
      successCount,
      errorCount,
    };

  } catch (error) {
    console.error('Error sending bulk notification email:', error);
    
    return {
      success: false,
      results: [],
      successCount: 0,
      errorCount: recipients.length,
    };
  }
}