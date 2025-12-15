import { z } from 'zod';

// ============ COMMON VALIDATION SCHEMAS ============

export const baseEntitySchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// ============ AUTHENTICATION VALIDATION ============

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ============ HOME PAGE VALIDATION ============

export const heroSectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  subtitle: z.string().min(1, 'Subtitle is required').max(200, 'Subtitle must be less than 200 characters'),
  backgroundVideo: z.string().url('Please enter a valid video URL').optional().or(z.literal('')),
  backgroundImage: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  ctaText: z.string().min(1, 'CTA text is required').max(50, 'CTA text must be less than 50 characters'),
  ctaLink: z.string().url('Please enter a valid URL').or(z.string().startsWith('/', 'Please enter a valid relative URL')),
  isActive: z.boolean().default(true),
}).extend(baseEntitySchema.shape);

export const statItemSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  label: z.string().min(1, 'Label is required').max(50, 'Label must be less than 50 characters'),
  value: z.string().min(1, 'Value is required').max(20, 'Value must be less than 20 characters'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color'),
});

export const statsSectionSchema = z.object({
  stats: z.array(statItemSchema).min(1, 'At least one stat is required').max(8, 'Maximum 8 stats allowed'),
  isActive: z.boolean().default(true),
}).extend(baseEntitySchema.shape);

// ============ CAUSES VALIDATION ============

export const causeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150, 'Title must be less than 150 characters'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters'),
  shortDescription: z.string().min(1, 'Short description is required').max(300, 'Short description must be less than 300 characters'),
  image: z.string().url('Please enter a valid image URL'),
  images: z.array(z.string().url()).optional(),
  raised: z.number().min(0, 'Raised amount cannot be negative'),
  goal: z.number().min(1, 'Goal must be greater than 0'),
  donors: z.number().min(0, 'Donors count cannot be negative').default(0),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['active', 'completed', 'paused'], {
    errorMap: () => ({ message: 'Status must be active, completed, or paused' })
  }).default('active'),
  featured: z.boolean().default(false),
  urgent: z.boolean().default(false),
}).extend(baseEntitySchema.shape)
.refine((data) => data.raised <= data.goal, {
  message: "Raised amount cannot exceed goal",
  path: ["raised"],
});

// ============ EVENTS VALIDATION ============

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150, 'Title must be less than 150 characters'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters'),
  shortDescription: z.string().min(1, 'Short description is required').max(300, 'Short description must be less than 300 characters'),
  date: z.string().min(1, 'Date is required').refine((date) => !isNaN(Date.parse(date)), {
    message: 'Please enter a valid date'
  }),
  time: z.string().min(1, 'Time is required').regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)').optional().or(z.literal('')),
  location: z.string().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
  image: z.string().url('Please enter a valid image URL'),
  images: z.array(z.string().url()).optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
  registered: z.number().min(0, 'Registered count cannot be negative').default(0),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  featured: z.boolean().default(false),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be upcoming, ongoing, completed, or cancelled' })
  }).default('upcoming'),
  category: z.string().min(1, 'Category is required'),
  organizer: z.string().min(1, 'Organizer is required').max(100, 'Organizer name must be less than 100 characters'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  registrationRequired: z.boolean().default(false),
  registrationDeadline: z.string().refine((date) => !date || !isNaN(Date.parse(date)), {
    message: 'Please enter a valid registration deadline'
  }).optional().or(z.literal('')),
}).extend(baseEntitySchema.shape)
.refine((data) => {
  if (data.capacity && data.registered > data.capacity) {
    return false;
  }
  return true;
}, {
  message: "Registered count cannot exceed capacity",
  path: ["registered"],
})
.refine((data) => {
  if (data.registrationDeadline && data.date) {
    const regDeadline = new Date(data.registrationDeadline);
    const eventDate = new Date(data.date);
    return regDeadline <= eventDate;
  }
  return true;
}, {
  message: "Registration deadline must be before event date",
  path: ["registrationDeadline"],
});

// ============ BLOG VALIDATION ============

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(50000, 'Content must be less than 50000 characters'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  featuredImage: z.string().url('Please enter a valid image URL'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name must be less than 100 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string().min(1).max(50)).max(10, 'Maximum 10 tags allowed'),
  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: 'Status must be draft, published, or archived' })
  }).default('draft'),
  featured: z.boolean().default(false),
  publishedAt: z.string().refine((date) => !date || !isNaN(Date.parse(date)), {
    message: 'Please enter a valid publish date'
  }).optional().or(z.literal('')),
}).extend(baseEntitySchema.shape);

// ============ DONATION VALIDATION ============

export const donationSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least $1').max(1000000, 'Amount cannot exceed $1,000,000'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)').default('USD'),
  donorName: z.string().min(1, 'Donor name is required').max(100, 'Donor name must be less than 100 characters'),
  donorEmail: z.string().email('Please enter a valid email address'),
  donorPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  causeId: z.string().optional(),
  causeName: z.string().optional(),
  message: z.string().max(1000, 'Message must be less than 1000 characters').optional().or(z.literal('')),
  anonymous: z.boolean().default(false),
  status: z.enum(['pending', 'completed', 'failed', 'refunded'], {
    errorMap: () => ({ message: 'Status must be pending, completed, failed, or refunded' })
  }).default('pending'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  transactionId: z.string().optional(),
}).extend(baseEntitySchema.shape);

// ============ VOLUNTEER VALIDATION ============

export const volunteerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  address: z.string().max(300, 'Address must be less than 300 characters').optional().or(z.literal('')),
  skills: z.array(z.string().min(1).max(50)).min(1, 'At least one skill is required').max(20, 'Maximum 20 skills allowed'),
  interests: z.array(z.string().min(1).max(50)).min(1, 'At least one interest is required').max(20, 'Maximum 20 interests allowed'),
  availability: z.array(z.string().min(1)).min(1, 'At least one availability option is required'),
  experience: z.string().max(2000, 'Experience must be less than 2000 characters').optional().or(z.literal('')),
  motivation: z.string().max(1000, 'Motivation must be less than 1000 characters').optional().or(z.literal('')),
  status: z.enum(['pending', 'approved', 'rejected', 'inactive'], {
    errorMap: () => ({ message: 'Status must be pending, approved, rejected, or inactive' })
  }).default('pending'),
  appliedAt: z.string().or(z.date()).optional(),
  approvedAt: z.string().or(z.date()).optional(),
}).extend(baseEntitySchema.shape);

// ============ USER VALIDATION ============

export const adminUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['super_admin', 'admin', 'editor'], {
    errorMap: () => ({ message: 'Role must be super_admin, admin, or editor' })
  }),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  lastLogin: z.string().or(z.date()).optional(),
}).extend(baseEntitySchema.shape);

export const createUserSchema = adminUserSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

// ============ SETTINGS VALIDATION ============

export const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100, 'Site name must be less than 100 characters'),
  siteDescription: z.string().min(1, 'Site description is required').max(500, 'Site description must be less than 500 characters'),
  siteUrl: z.string().url('Please enter a valid URL'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  address: z.string().min(1, 'Address is required').max(300, 'Address must be less than 300 characters'),
  socialMedia: z.object({
    facebook: z.string().url('Please enter a valid Facebook URL').optional().or(z.literal('')),
    twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
    instagram: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
    linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    youtube: z.string().url('Please enter a valid YouTube URL').optional().or(z.literal('')),
  }),
  logo: z.string().url('Please enter a valid logo URL').optional().or(z.literal('')),
  favicon: z.string().url('Please enter a valid favicon URL').optional().or(z.literal('')),
});

export const paymentSettingsSchema = z.object({
  stripePublishableKey: z.string().min(1, 'Stripe publishable key is required'),
  stripeSecretKey: z.string().min(1, 'Stripe secret key is required'),
  paypalClientId: z.string().optional().or(z.literal('')),
  paypalClientSecret: z.string().optional().or(z.literal('')),
  razorpayKeyId: z.string().optional().or(z.literal('')),
  razorpayKeySecret: z.string().optional().or(z.literal('')),
  currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
  minimumDonation: z.number().min(1, 'Minimum donation must be at least $1').default(5),
  maximumDonation: z.number().min(1, 'Maximum donation must be greater than 0').default(10000),
  processingFee: z.number().min(0, 'Processing fee cannot be negative').max(100, 'Processing fee cannot exceed 100%').default(2.9),
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.object({
    newDonations: z.boolean().default(true),
    newVolunteers: z.boolean().default(true),
    eventRegistrations: z.boolean().default(true),
    contactForms: z.boolean().default(true),
    newsletters: z.boolean().default(false),
  }),
  smsNotifications: z.object({
    enabled: z.boolean().default(false),
    twilioAccountSid: z.string().optional().or(z.literal('')),
    twilioAuthToken: z.string().optional().or(z.literal('')),
    twilioPhoneNumber: z.string().optional().or(z.literal('')),
  }),
  pushNotifications: z.object({
    enabled: z.boolean().default(false),
    firebaseServerKey: z.string().optional().or(z.literal('')),
  }),
});

// ============ IMAGE UPLOAD VALIDATION ============

export const imageUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a valid file' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type), 'File must be an image (JPEG, PNG, WebP, or GIF)'),
  folder: z.string().optional(),
  alt: z.string().max(200, 'Alt text must be less than 200 characters').optional().or(z.literal('')),
  title: z.string().max(200, 'Title must be less than 200 characters').optional().or(z.literal('')),
});

// ============ VALIDATION HELPER FUNCTIONS ============

export type ValidationError = {
  field: string;
  message: string;
};

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
}

export function getFieldError(errors: ValidationError[] | undefined, field: string): string | undefined {
  return errors?.find((error) => error.field === field)?.message;
}

export function hasFieldError(errors: ValidationError[] | undefined, field: string): boolean {
  return errors?.some((error) => error.field === field) ?? false;
}

// ============ SANITIZATION HELPERS ============

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    .replace(/^-+|-+$/g, '');
}