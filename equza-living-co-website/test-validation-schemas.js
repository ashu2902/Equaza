/**
 * Test file to validate all Zod schemas with sample data
 * Run with: node test-validation-schemas.js
 */

const { z } = require('zod');

// Import schema definitions (we'll recreate them here for testing)
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val),
    'Please enter a valid phone number'
  );

const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')
  .trim();

// Contact form schema
const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
});

// Customize form schema
const customizeFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  preferredSize: z
    .string()
    .min(1, 'Preferred size is required'),
  preferredMaterials: z
    .array(z.string())
    .optional()
    .default([]),
  message: z
    .string()
    .max(2000, 'Message must be less than 2000 characters')
    .optional()
    .transform((val) => val?.trim() || undefined),
});

// Product enquiry form schema
const enquiryFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: z
    .string()
    .min(10, 'Please provide more details about your enquiry')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
  productId: z
    .string()
    .min(1, 'Product ID is required'),
});

// Trade form schema
const tradeFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: z
    .string()
    .max(100, 'Company name is too long')
    .optional()
    .transform((val) => val?.trim() || undefined),
  message: z
    .string()
    .min(10, 'Please provide more details about your business')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
});

// Test data samples
const testData = {
  validContact: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    message: 'I am interested in learning more about your rug collections.'
  },
  invalidContact: {
    name: '',
    email: 'invalid-email',
    phone: 'invalid-phone',
    message: 'Short'
  },
  validCustomize: {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+9876543210',
    preferredSize: '8x10 feet',
    preferredMaterials: ['Wool', 'Silk'],
    message: 'I would like a custom rug for my living room with warm earth tones.'
  },
  invalidCustomize: {
    name: 'A'.repeat(101), // Too long
    email: 'invalid-email',
    preferredSize: '',
    message: 'A'.repeat(2001) // Too long
  },
  validEnquiry: {
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    message: 'I would like more information about this beautiful rug.',
    productId: 'rug-123-handwoven-wool'
  },
  invalidEnquiry: {
    name: '',
    email: 'bad-email',
    message: 'Too short',
    productId: ''
  },
  validTrade: {
    name: 'Sarah Johnson',
    email: 'sarah@designstudio.com',
    phone: '+1555123456',
    company: 'Modern Design Studio',
    message: 'We are interested in establishing a wholesale partnership for our interior design business.'
  },
  invalidTrade: {
    name: '',
    email: 'invalid',
    company: 'A'.repeat(101), // Too long
    message: 'Short'
  }
};

// Test function
function testSchema(schemaName, schema, testCases) {
  console.log(`\n=== Testing ${schemaName} Schema ===`);
  
  Object.entries(testCases).forEach(([caseName, data]) => {
    console.log(`\n${caseName}:`);
    const result = schema.safeParse(data);
    
    if (result.success) {
      console.log('✅ Valid:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Invalid:');
      result.error.errors.forEach(error => {
        console.log(`  - ${error.path.join('.')}: ${error.message}`);
      });
    }
  });
}

// Run all tests
console.log('🧪 Zod Schema Validation Tests');
console.log('================================');

testSchema('Contact Form', contactFormSchema, {
  valid: testData.validContact,
  invalid: testData.invalidContact
});

testSchema('Customize Form', customizeFormSchema, {
  valid: testData.validCustomize,
  invalid: testData.invalidCustomize
});

testSchema('Enquiry Form', enquiryFormSchema, {
  valid: testData.validEnquiry,
  invalid: testData.invalidEnquiry
});

testSchema('Trade Form', tradeFormSchema, {
  valid: testData.validTrade,
  invalid: testData.invalidTrade
});

// Test edge cases
console.log('\n=== Edge Case Tests ===');

// Test optional fields
console.log('\nTesting optional fields:');
const minimalContact = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a test message with minimum required length.'
};

const contactResult = contactFormSchema.safeParse(minimalContact);
console.log('✅ Minimal contact form:', contactResult.success);

// Test array handling
const customizeWithoutMaterials = {
  name: 'Test User',
  email: 'test@example.com',
  preferredSize: '6x9 feet'
};

const customizeResult = customizeFormSchema.safeParse(customizeWithoutMaterials);
console.log('✅ Customize without materials:', customizeResult.success);
console.log('   Default materials:', JSON.stringify(customizeResult.data?.preferredMaterials));

// Test string transformations
const dataWithWhitespace = {
  name: '  John Doe  ',
  email: 'john@example.com',
  message: '  This message has whitespace  ',
  productId: 'test-product'
};

const enquiryResult = enquiryFormSchema.safeParse(dataWithWhitespace);
console.log('\n✅ String trimming test:');
console.log('   Original name:', JSON.stringify(dataWithWhitespace.name));
console.log('   Trimmed name:', JSON.stringify(enquiryResult.data?.name));

console.log('\n🎉 All validation tests completed!'); 