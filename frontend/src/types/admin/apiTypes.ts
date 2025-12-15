// types/admin/apiTypes.ts

// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  meta?: ApiMeta;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
  validationErrors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiMeta {
  pagination?: PaginationMeta;
  sorting?: SortingMeta;
  filters?: FilterMeta;
  requestId?: string;
  version?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SortingMeta {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterMeta {
  [key: string]: any;
}

// Authentication API Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: AdminUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// User Management API Types
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  permissions?: string[];
  isActive?: boolean;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: AdminRole;
  permissions?: string[];
  isActive?: boolean;
  avatar?: string;
}

export interface UsersListResponse {
  users: AdminUser[];
  total: number;
}

export interface UserDetailsResponse {
  user: AdminUser;
  activities: AdminActivity[];
}

// Content Management API Types
export interface CreateEventRequest extends Omit<EventFormData, 'id'> {}

export interface UpdateEventRequest extends Partial<EventFormData> {}

export interface EventsListResponse {
  events: Event[];
  total: number;
}

export interface EventDetailsResponse {
  event: Event;
  registrations?: EventRegistration[];
  analytics?: EventAnalytics;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  venue?: string;
  address: string;
  image?: string;
  gallery?: string[];
  category: EventCategory;
  tags: string[];
  maxParticipants?: number;
  currentParticipants: number;
  registrationFee?: number;
  isRegistrationRequired: boolean;
  registrationDeadline?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  organizer: EventOrganizer;
}

export interface EventOrganizer {
  name: string;
  email: string;
  phone?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
  registrationDate: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  customFields?: Record<string, any>;
}

export interface EventAnalytics {
  totalRegistrations: number;
  registrationRate: number;
  revenueGenerated: number;
  attendanceRate?: number;
}

export interface CreateCauseRequest extends Omit<CauseFormData, 'id'> {}

export interface UpdateCauseRequest extends Partial<CauseFormData> {}

export interface CausesListResponse {
  causes: Cause[];
  total: number;
}

export interface CauseDetailsResponse {
  cause: Cause;
  donations?: CauseDonation[];
  analytics?: CauseAnalytics;
}

export interface Cause {
  id: string;
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
  startDate: string;
  endDate?: string;
  image?: string;
  gallery?: string[];
  isFeatured: boolean;
  isUrgent: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  beneficiaries?: Beneficiary[];
  updates?: CauseUpdate[];
}

export interface Beneficiary {
  id: string;
  name: string;
  age?: number;
  story?: string;
  image?: string;
}

export interface CauseUpdate {
  id: string;
  title: string;
  content: string;
  image?: string;
  date: string;
}

export interface CauseDonation {
  id: string;
  causeId: string;
  donorName?: string;
  donorEmail?: string;
  amount: number;
  currency: string;
  isAnonymous: boolean;
  message?: string;
  donationDate: string;
  paymentMethod: string;
  transactionId: string;
}

export interface CauseAnalytics {
  totalDonations: number;
  uniqueDonors: number;
  averageDonation: number;
  progressPercentage: number;
  donationTrend: Array<{
    date: string;
    amount: number;
  }>;
}

export interface CreateBlogRequest extends Omit<BlogFormData, 'id'> {}

export interface UpdateBlogRequest extends Partial<BlogFormData> {}

export interface BlogPostsListResponse {
  posts: BlogPost[];
  total: number;
}

export interface BlogPostDetailsResponse {
  post: BlogPost;
  analytics?: BlogAnalytics;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  gallery?: string[];
  category: BlogCategory;
  tags: string[];
  author: BlogAuthor;
  publishDate: string;
  isPublished: boolean;
  isFeatured: boolean;
  readingTime?: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
}

export interface BlogAnalytics {
  totalViews: number;
  uniqueViews: number;
  averageReadTime: number;
  socialShares: number;
  comments: number;
}

// Donation Management API Types
export interface DonationsListResponse {
  donations: Donation[];
  total: number;
  totalAmount: number;
}

export interface DonationDetailsResponse {
  donation: Donation;
  donor?: Donor;
}

export interface Donation {
  id: string;
  donorId?: string;
  causeId?: string;
  eventId?: string;
  amount: number;
  currency: string;
  donationType: 'one_time' | 'recurring';
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  isAnonymous: boolean;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  message?: string;
  dedicationType?: 'in_honor' | 'in_memory';
  dedicationDetails?: string;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  donationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Donor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalDonated: number;
  donationCount: number;
  firstDonationDate: string;
  lastDonationDate: string;
  isRecurringDonor: boolean;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    mail: boolean;
  };
}

export interface DonationAnalytics {
  totalDonations: number;
  totalAmount: number;
  uniqueDonors: number;
  averageDonation: number;
  recurringDonors: number;
  monthlyGrowth: number;
  donationsByMonth: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  topDonors: Array<{
    name: string;
    amount: number;
  }>;
  donationsByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

// Volunteer Management API Types
export interface VolunteersListResponse {
  volunteers: Volunteer[];
  total: number;
}

export interface VolunteerDetailsResponse {
  volunteer: Volunteer;
  activities?: VolunteerActivity[];
}

export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  skills: string[];
  interests: VolunteerCategory[];
  availability: {
    days: DayOfWeek[];
    timeSlots: string[];
    startDate: string;
    duration: string;
  };
  status: 'pending' | 'approved' | 'active' | 'inactive' | 'suspended';
  totalHours: number;
  joinDate: string;
  lastActivity?: string;
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerActivity {
  id: string;
  volunteerId: string;
  activityType: string;
  description: string;
  date: string;
  hours: number;
  supervisor?: string;
  notes?: string;
}

export interface VolunteerApplicationsListResponse {
  applications: VolunteerApplication[];
  total: number;
}

export interface VolunteerApplication {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
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
    startDate: string;
    duration: string;
  };
  interests: {
    categories: VolunteerCategory[];
    specificRoles?: string[];
    preferences?: string;
  };
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

// Gallery Management API Types
export interface GalleryItemsListResponse {
  items: GalleryItem[];
  total: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: GalleryCategory;
  tags: string[];
  location?: string;
  date: string;
  photographer?: string;
  isPublished: boolean;
  isFeatured: boolean;
  order?: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryItemRequest extends Omit<GalleryItemFormData, 'id'> {}

export interface UpdateGalleryItemRequest extends Partial<GalleryItemFormData> {}

// Settings API Types
export interface GetSettingsResponse {
  settings: AdminSettings;
}

export interface UpdateSettingsRequest extends Partial<AdminSettings> {}

export interface UpdateSettingsResponse {
  settings: AdminSettings;
  message: string;
}

// Analytics API Types
export interface DashboardAnalyticsResponse {
  overview: {
    totalDonations: number;
    totalVolunteers: number;
    activeEvents: number;
    websiteVisitors: number;
  };
  donationTrends: Array<{
    date: string;
    amount: number;
  }>;
  volunteerGrowth: Array<{
    month: string;
    count: number;
  }>;
  eventParticipation: Array<{
    eventName: string;
    participants: number;
  }>;
  topCauses: Array<{
    name: string;
    raised: number;
    goal: number;
  }>;
  recentActivities: AdminActivity[];
}

export interface WebsiteAnalytics {
  visitors: {
    total: number;
    unique: number;
    returning: number;
  };
  pageViews: {
    total: number;
    perSession: number;
  };
  traffic: {
    organic: number;
    direct: number;
    social: number;
    referral: number;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
  }>;
  bounceRate: number;
  avgSessionDuration: number;
}

// File Upload API Types
export interface FileUploadResponse {
  success: boolean;
  file: {
    id: string;
    name: string;
    originalName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadDate: string;
  };
}

export interface MultipleFileUploadResponse {
  success: boolean;
  files: Array<{
    id: string;
    name: string;
    originalName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadDate: string;
  }>;
  failed?: Array<{
    name: string;
    error: string;
  }>;
}

export interface DeleteFileRequest {
  fileId: string;
}

// Newsletter API Types
export interface NewsletterSubscribersResponse {
  subscribers: NewsletterSubscriber[];
  total: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  unsubscribedAt?: string;
  source: string;
}

export interface SendNewsletterRequest {
  subject: string;
  content: string;
  recipients: 'all' | 'segment';
  segmentFilters?: {
    interests?: string[];
    donorStatus?: 'all' | 'donors_only' | 'non_donors';
    volunteerStatus?: 'all' | 'volunteers_only' | 'non_volunteers';
  };
  scheduleDate?: string;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  recipientCount: number;
  openRate?: number;
  clickRate?: number;
  sentAt?: string;
  createdAt: string;
}

// Notification API Types
export interface NotificationsResponse {
  notifications: AdminNotification[];
  unreadCount: number;
}

export interface MarkNotificationReadRequest {
  notificationId: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  userId?: string;
  actionUrl?: string;
}

// Export/Import API Types
export interface ExportDataRequest {
  type: 'donations' | 'volunteers' | 'events' | 'causes' | 'subscribers';
  format: 'csv' | 'excel' | 'pdf';
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  filters?: Record<string, any>;
}

export interface ExportDataResponse {
  downloadUrl: string;
  expiresAt: string;
  fileName: string;
  fileSize: number;
}

export interface ImportDataRequest {
  type: 'donations' | 'volunteers' | 'subscribers';
  file: File;
  mapping: Record<string, string>;
  skipDuplicates?: boolean;
}

export interface ImportDataResponse {
  success: boolean;
  imported: number;
  skipped: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

// Search API Types
export interface SearchRequest {
  query: string;
  type?: 'all' | 'events' | 'causes' | 'blog' | 'volunteers' | 'donors';
  limit?: number;
  filters?: Record<string, any>;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  took: number;
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description?: string;
  url: string;
  score: number;
  highlight?: string;
}

// Backup & Restore API Types
export interface CreateBackupRequest {
  includeFiles?: boolean;
  description?: string;
}

export interface BackupResponse {
  id: string;
  fileName: string;
  size: number;
  createdAt: string;
  description?: string;
  downloadUrl: string;
}

export interface BackupsListResponse {
  backups: BackupResponse[];
  total: number;
}

export interface RestoreBackupRequest {
  backupId: string;
  restoreFiles?: boolean;
}

// System Health API Types
export interface SystemHealthResponse {
  status: 'healthy' | 'warning' | 'critical';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message?: string;
    details?: any;
  }>;
  uptime: number;
  version: string;
  environment: string;
}

// Audit Log API Types
export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// Generic Request/Response Types
export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface BulkActionRequest {
  ids: string[];
  action: 'delete' | 'activate' | 'deactivate' | 'archive' | 'publish' | 'unpublish';
}

export interface BulkActionResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}