// types/admin/adminTypes.ts

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  permissions: AdminPermission[];
}

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'moderator';

export interface AdminPermission {
  id: string;
  name: string;
  resource: AdminResource;
  actions: AdminAction[];
}

export type AdminResource = 
  | 'home'
  | 'about'
  | 'causes'
  | 'events'
  | 'blog'
  | 'donations'
  | 'volunteers' 
  | 'gallery'
  | 'users'
  | 'settings';

export type AdminAction = 'create' | 'read' | 'update' | 'delete' | 'publish' | 'moderate';

export interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  status: SectionStatus;
  lastUpdated: string;
  isVisible: boolean;
  order: number;
}

export type SectionStatus = 'active' | 'inactive' | 'draft' | 'scheduled';

export interface AdminSidebarItem {
  id: string;
  title: string;
  icon: string;
  href?: string;
  badge?: string | number;
  children?: AdminSidebarItem[];
  isExpanded?: boolean;
  permissions?: AdminAction[];
}

export interface AdminBreadcrumb {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface AdminStats {
  totalSections: number;
  activeSections: number;
  dailyViews: number;
  engagementRate: number;
  totalUsers: number;
  activeVolunteers: number;
  totalDonations: number;
  monthlyRevenue: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  userId?: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AdminDashboardCard {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: string;
  color: string;
  href?: string;
}

export interface AdminTableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface AdminTableConfig<T = any> {
  columns: AdminTableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  sorting?: {
    field: keyof T;
    direction: 'asc' | 'desc';
  };
  filters?: AdminTableFilter[];
}

export interface AdminTableFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange';
  options?: { label: string; value: string }[];
  value?: any;
}

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export interface AdminFormField {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  validation?: AdminFieldValidation;
  options?: SelectOption[];
  dependsOn?: string;
  conditional?: {
    field: string;
    value: any;
    operator: 'equals' | 'not_equals' | 'includes' | 'not_includes';
  };
}

export type AdminFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'image'
  | 'rich_text'
  | 'color'
  | 'url';

export interface AdminFieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: (value: any) => boolean | string;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

export interface AdminChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface AdminMetrics {
  donations: {
    total: number;
    monthly: number;
    growth: number;
    topDonors: Array<{
      name: string;
      amount: number;
      date: Date;
    }>;
  };
  events: {
    upcoming: number;
    totalParticipants: number;
    registrationRate: number;
  };
  volunteers: {
    active: number;
    pending: number;
    totalHours: number;
  };
  website: {
    visitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
}

export interface AdminActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  resource: string;
  resourceId?: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AdminSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    phoneNumber: string;
    address: string;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      youtube?: string;
    };
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    favicon?: string;
  };
  payments: {
    stripePublishableKey?: string;
    stripeSecretKey?: string;
    paypalClientId?: string;
    paypalSecretKey?: string;
    razorpayKeyId?: string;
    razorpaySecretKey?: string;
    currency: string;
    minDonationAmount: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminNotifications: {
      newDonation: boolean;
      newVolunteer: boolean;
      newEvent: boolean;
      systemAlerts: boolean;
    };
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage?: string;
    analyticsId?: string;
  };
}

export interface AdminError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface AdminResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AdminError;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    sorting?: {
      field: string;
      direction: 'asc' | 'desc';
    };
    filters?: Record<string, any>;
  };
}