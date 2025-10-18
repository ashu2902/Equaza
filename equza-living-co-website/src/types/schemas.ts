import { z } from 'zod';

// Reusing the image structure from ProductImage
export const ImageSchema = z.object({
  url: z
    .string()
    .url('Image URL must be a valid URL')
    .min(1, 'Image URL is required'),
  alt: z.string().min(1, 'Image alt text is required'),
  storageRef: z.string().optional(),
  isMain: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const WeaveTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  image: ImageSchema,
  sortOrder: z
    .number()
    .int()
    .min(0, 'Sort order must be a positive number')
    .default(0),
  isActive: z.boolean().default(true),
  createdAt: z.any().optional(), // Timestamp
  updatedAt: z.any().optional(), // Timestamp
});
