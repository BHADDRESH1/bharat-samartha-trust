// types/admin/formTypes.ts

export interface HeroSectionFormData {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundVideo?: string;
  backgroundImage?: string;
  overlayOpacity: number;
  isActive: boolean;
}

export interface StatsSectionFormData {
  stats: Array<{
    id: string;
    label: string;
    value: string;
    suffix?: string;
    icon?: string;
    color?: string;
  }>;
  title?: string;
  subtitle?: string;
  isActive: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  shortDescription?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  venue?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image?: string;
  gallery?: string[];
  category: EventCategory;
  tags: string[];
  maxParticipants?: number;
  registrationFee?: number;
  isRegistrationRequired: boolean;
  registrationDeadline?: Date;
  isFeatured: boolean;
  isPublished: boolean;
  organizer: {
    name: string;
    email: string;
    phone?: string;
  };
  customFields?: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
  }>;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export type EventCategory = 
  | 'fundraising'
  | 'awareness'
  | 'volunteer'
  | 'educational'
  | 'community'
  | 'sports'
  | 'cultural'
  | 'other';

export interface CauseFormData {
  title: string;
  description: string;
  shortDescription?: string;
  story: string;
  goal: number;
  raised: number;
  currency: string;
  category: CauseCategory;
  tags: string[];
  location?: string;
  startDate: Date;
  endDate?: Date;
  image?: string;
  gallery?: string[];
  isFeatured: boolean;
  isUrgent: boolean;
  isPublished: boolean;
  beneficiaries?: Array<{
    name: string;
    age?: number;
    story?: string;
    image?: string;
  }>;
  updates?: Array<{
    title: string;
    content: string;
    image?: string;
    date: Date;
  }>;
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export type CauseCategory = 
  | 'education'
  | 'healthcare'
  | 'environment'
  | 'poverty'
  | 'disaster_relief'
  | 'child_welfare'
  | 'elderly_care'
  | 'animal_welfare'
  | 'community_development'
  | 'other';

export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  gallery?: string[];
  category: BlogCategory;
  tags: string[];
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  publishDate: Date;
  isPublished: boolean;
  isFeatured: boolean;
  readingTime?: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export type BlogCategory = 
  | 'news'
  | 'success_stories'
  | 'volunteer_spotlight'
  | 'fundraising'
  | 'awareness'
  | 'events'
  | 'updates'
  | 'other';

export interface TeamMemberFormData {
  name: string;
  position: string;
  department?: string;
  bio: string;
  image?: string;
  email?: string;
  phone?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  isActive: boolean;
  joinDate: Date;
  order: number;
}

export interface TestimonialFormData {
  name: string;
  position?: string;
  company?: string;
  content: string;
  rating?: number;
  image?: string;
  isApproved: boolean;
  isFeatured: boolean;
  dateGiven: Date;
  category: TestimonialCategory;
}

export type TestimonialCategory = 
  | 'donor'
  | 'volunteer'
  | 'beneficiary'
  | 'partner'
  | 'staff'
  | 'other';

export interface DailyActivityFormData {
  title: string;
  description: string;
  time: string;
  location: string;
  days: DayOfWeek[];
  category: ActivityCategory;
  maxParticipants?: number;
  isActive: boolean;
  coordinator: {
    name: string;
    email: string;
    phone?: string;
  };
  requirements?: string[];
  image?: string;
}

export type DayOfWeek = 
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ActivityCategory = 
  | 'food_distribution'
  | 'education'
  | 'healthcare'
  | 'elderly_care'
  | 'community_service'
  | 'environmental'
  | 'other';

export interface VolunteerOpportunityFormData {
  title: string;
  description: string;
  requirements: string[];
  timeCommitment: string;
  location: string;
  category: VolunteerCategory;
  skills?: string[];
  isRemote: boolean;
  isActive: boolean;
  coordinator: {
    name: string;
    email: string;
    phone?: string;
  };
  schedule?: {
    days: DayOfWeek[];
    startTime: string;
    endTime: string;
    duration?: string;
  };
  benefits?: string[];
  image?: string;
}

export type VolunteerCategory = 
  | 'event_support'
  | 'administrative'
  | 'fundraising'
  | 'education'
  | 'healthcare'
  | 'community_outreach'
  | 'technical'
  | 'marketing'
  | 'other';

export interface VolunteerApplicationFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  experience: {
    previousVolunteerWork?: string;
    skills: string[];
    education?: string;
    employment?: string;
  };
  availability: {
    days: DayOfWeek[];
    timeSlots: string[];
    startDate: Date;
    duration: string;
  };
  interests: {
    categories: VolunteerCategory[];
    specificRoles?: string[];
    preferences?: string;
  };
  references?: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }>;
  backgroundCheck: {
    consentGiven: boolean;
    criminalRecord: boolean;
    details?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  additionalInfo?: {
    motivation: string;
    specialNeeds?: string;
    questions?: string;
  };
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: AdminRole;
  permissions: string[];
  isActive: boolean;
  password?: string;
  confirmPassword?: string;
  avatar?: string;
  department?: string;
  bio?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface GalleryItemFormData {
  title: string;
  description?: string;
  image: string;
  category: GalleryCategory;
  tags: string[];
  location?: string;
  date: Date;
  photographer?: string;
  isPublished: boolean;
  isFeatured: boolean;
  order?: number;
}

export type GalleryCategory = 
  | 'events'
  | 'activities'
  | 'beneficiaries'
  | 'volunteers'
  | 'facilities'
  | 'achievements'
  | 'behind_scenes'
  | 'other';

export interface NewsletterFormData {
  title: string;
  description?: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
  privacyText: string;
  isActive: boolean;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
  };
}

export interface CallToActionFormData {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    url: string;
    style?: 'primary' | 'secondary' | 'outline';
  };
  secondaryButton?: {
    text: string;
    url: string;
    style?: 'primary' | 'secondary' | 'outline';
  };
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number;
  isActive: boolean;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

export interface ImpactSectionFormData {
  title: string;
  description?: string;
  impacts: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    image?: string;
    stats?: {
      number: string;
      label: string;
    };
  }>;
  layout: 'grid' | 'carousel' | 'timeline';
  isActive: boolean;
}

// Form validation and state types
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
}

export interface FormState<T> {
  data: T;
  validation: FormValidation;
  isLoading: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  value?: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  disabled?: boolean;
  options?: SelectOption[];
  validation?: AdminFieldValidation;
}

export interface FileUploadProps {
  accept: string;
  maxSize: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
  existingFiles?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
}

export interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  toolbar?: string[];
  disabled?: boolean;
}