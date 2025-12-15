import { AdminUser } from "./adminAuth";

// Base API configuration
// Normalize the base URL so it always: 1) has no trailing slash, 2) includes `/api`.
function normalizeApiBase(raw?: string): string {
  const val = (raw || "").trim();
  if (!val) return "/api";
  // remove trailing slashes
  let url = val.replace(/\/+$/g, "");
  // if `/api` is not present at end, append it
  if (!/\/api(?:$|\/)/i.test(url)) {
    url = `${url}/api`;
  }
  return url;
}

const API_BASE_URL = normalizeApiBase(
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL
);

// Map admin-style endpoints to the backend's actual routes.
// This keeps frontend admin code unchanged while allowing the backend
// to expose different paths.
function translateEndpoint(endpoint: string): string {
  const map: Record<string, string> = {
    "/admin/home/hero-section": "/hero",
    "/admin/home/stats-section": "/stat/stats",
    "/admin/home/events-section": "/", // backend mounts events at /api
    "/admin/home/daily-activities": "/activities",
    "/admin/home/volunteer-opportunities": "/volunteer-management",
    "/admin/home/impact-section": "/impact",
    "/admin/home/featured-causes": "/causes",
    "/admin/home/testimonials": "/test",
    "/admin/home/call-to-action": "/cta",
    "/admin/home/newsletter": "/newsletter",
  };

  // Exact match first
  if (map[endpoint]) return map[endpoint];

  // If endpoint contains one of the keys as prefix, replace prefix
  for (const [k, v] of Object.entries(map)) {
    if (endpoint.startsWith(k + "/")) {
      return endpoint.replace(k, v);
    }
  }

  return endpoint;
}

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
}

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { method = "GET", headers = {}, body, params } = options;

    // Translate endpoint mapping (admin -> backend) then build URL with query parameters
    endpoint = translateEndpoint(endpoint);
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });
      url += `?${searchParams.toString()}`;
    }

    // Prepare request configuration
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include", // Include cookies for authentication
    };

    // Add body for non-GET requests
    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Upload file to server
 */
export async function uploadFile(
  file: File,
  folder?: string
): Promise<ApiResponse<{ url: string; filename: string }>> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("File upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

// ============ HOME PAGE MANAGEMENT ============

export interface HeroSectionData {
  id?: string;
  title: string;
  subtitle: string;
  backgroundVideo?: string;
  backgroundImage?: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export interface StatsSectionData {
  id?: string;
  stats: Array<{
    id: string;
    label: string;
    value: string;
    icon: string;
    color: string;
  }>;
  isActive: boolean;
}

export const homePageApi = {
  // Hero Section
  getHeroSection: () => apiRequest<HeroSectionData>("/admin/home/hero-section"),
  updateHeroSection: (data: HeroSectionData) =>
    apiRequest<HeroSectionData>("/admin/home/hero-section", {
      method: "PUT",
      body: data,
    }),

  // Stats Section
  getStatsSection: () =>
    apiRequest<StatsSectionData>("/admin/home/stats-section"),
  updateStatsSection: (data: StatsSectionData) =>
    apiRequest<StatsSectionData>("/admin/home/stats-section", {
      method: "PUT",
      body: data,
    }),

  // Events Section
  getEventsSection: () => apiRequest("/admin/home/events-section"),
  updateEventsSection: (data: any) =>
    apiRequest("/admin/home/events-section", { method: "PUT", body: data }),

  // Daily Activities
  getDailyActivities: () => apiRequest("/admin/home/daily-activities"),
  updateDailyActivities: (data: any) =>
    apiRequest("/admin/home/daily-activities", { method: "PUT", body: data }),

  // Volunteer Opportunities
  getVolunteerOpportunities: () =>
    apiRequest("/admin/home/volunteer-opportunities"),
  updateVolunteerOpportunities: (data: any) =>
    apiRequest("/admin/home/volunteer-opportunities", {
      method: "PUT",
      body: data,
    }),

  // Impact Section
  getImpactSection: () => apiRequest("/admin/home/impact-section"),
  updateImpactSection: (data: any) =>
    apiRequest("/admin/home/impact-section", { method: "PUT", body: data }),

  // Featured Causes
  getFeaturedCauses: () => apiRequest("/admin/home/featured-causes"),
  updateFeaturedCauses: (data: any) =>
    apiRequest("/admin/home/featured-causes", { method: "PUT", body: data }),

  // Testimonials
  getTestimonials: () => apiRequest("/admin/home/testimonials"),
  updateTestimonials: (data: any) =>
    apiRequest("/admin/home/testimonials", { method: "PUT", body: data }),

  // Call to Action
  getCallToAction: () => apiRequest("/admin/home/call-to-action"),
  updateCallToAction: (data: any) =>
    apiRequest("/admin/home/call-to-action", { method: "PUT", body: data }),

  // Newsletter
  getNewsletter: () => apiRequest("/admin/home/newsletter"),
  updateNewsletter: (data: any) =>
    apiRequest("/admin/home/newsletter", { method: "PUT", body: data }),
};

// ============ CAUSES MANAGEMENT ============

export interface CauseData {
  id?: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  images?: string[];
  raised: number;
  goal: number;
  donors: number;
  category: string;
  status: "active" | "completed" | "paused";
  featured: boolean;
  urgent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const causesApi = {
  getCauses: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    featured?: boolean;
  }) => apiRequest<CauseData[]>("/admin/causes", { params }),
  getCause: (id: string) => apiRequest<CauseData>(`/admin/causes/${id}`),
  createCause: (data: Omit<CauseData, "id">) =>
    apiRequest<CauseData>("/admin/causes", { method: "POST", body: data }),
  updateCause: (id: string, data: Partial<CauseData>) =>
    apiRequest<CauseData>(`/admin/causes/${id}`, { method: "PUT", body: data }),
  deleteCause: (id: string) =>
    apiRequest(`/admin/causes/${id}`, { method: "DELETE" }),
};

// ============ EVENTS MANAGEMENT ============

export interface EventData {
  id?: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  image: string;
  images?: string[];
  capacity?: number;
  registered?: number;
  price?: number;
  featured: boolean;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  category: string;
  organizer: string;
  contactEmail: string;
  contactPhone?: string;
  registrationRequired: boolean;
  registrationDeadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const eventsApi = {
  getEvents: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    featured?: boolean;
  }) => apiRequest<EventData[]>("/admin/events", { params }),
  getEvent: (id: string) => apiRequest<EventData>(`/admin/events/${id}`),
  createEvent: (data: Omit<EventData, "id">) =>
    apiRequest<EventData>("/admin/events", { method: "POST", body: data }),
  updateEvent: (id: string, data: Partial<EventData>) =>
    apiRequest<EventData>(`/admin/events/${id}`, { method: "PUT", body: data }),
  deleteEvent: (id: string) =>
    apiRequest(`/admin/events/${id}`, { method: "DELETE" }),
  getEventRegistrations: (id: string) =>
    apiRequest(`/admin/events/${id}/registrations`),
};

// ============ BLOG MANAGEMENT ============

export interface BlogPostData {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const blogApi = {
  getPosts: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    featured?: boolean;
  }) => apiRequest<BlogPostData[]>("/admin/blog", { params }),
  getPost: (id: string) => apiRequest<BlogPostData>(`/admin/blog/${id}`),
  createPost: (data: Omit<BlogPostData, "id">) =>
    apiRequest<BlogPostData>("/admin/blog", { method: "POST", body: data }),
  updatePost: (id: string, data: Partial<BlogPostData>) =>
    apiRequest<BlogPostData>(`/admin/blog/${id}`, {
      method: "PUT",
      body: data,
    }),
  deletePost: (id: string) =>
    apiRequest(`/admin/blog/${id}`, { method: "DELETE" }),
};

// ============ DONATIONS MANAGEMENT ============

export interface DonationData {
  id?: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  causeId?: string;
  causeName?: string;
  message?: string;
  anonymous: boolean;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  transactionId?: string;
  createdAt?: string;
}

export const donationsApi = {
  getDonations: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    causeId?: string;
  }) => apiRequest<DonationData[]>("/admin/donations", { params }),
  getDonation: (id: string) =>
    apiRequest<DonationData>(`/admin/donations/${id}`),
  getDonationStats: () => apiRequest("/admin/donations/stats"),
  exportDonations: (params?: {
    startDate?: string;
    endDate?: string;
    format?: "csv" | "xlsx";
  }) => apiRequest("/admin/donations/export", { params }),
};

// ============ VOLUNTEERS MANAGEMENT ============

export interface VolunteerData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  skills: string[];
  interests: string[];
  availability: string[];
  experience?: string;
  motivation?: string;
  status: "pending" | "approved" | "rejected" | "inactive";
  appliedAt?: string;
  approvedAt?: string;
}

export const volunteersApi = {
  getVolunteers: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => apiRequest<VolunteerData[]>("/admin/volunteers", { params }),
  getVolunteer: (id: string) =>
    apiRequest<VolunteerData>(`/admin/volunteers/${id}`),
  updateVolunteerStatus: (id: string, status: VolunteerData["status"]) =>
    apiRequest(`/admin/volunteers/${id}/status`, {
      method: "PUT",
      body: { status },
    }),
  deleteVolunteer: (id: string) =>
    apiRequest(`/admin/volunteers/${id}`, { method: "DELETE" }),
};

// ============ USERS MANAGEMENT ============

export const usersApi = {
  getUsers: (params?: { page?: number; limit?: number; role?: string }) =>
    apiRequest<AdminUser[]>("/admin/users", { params }),
  getUser: (id: string) => apiRequest<AdminUser>(`/admin/users/${id}`),
  createUser: (
    data: Omit<AdminUser, "id" | "createdAt"> & { password: string }
  ) => apiRequest<AdminUser>("/admin/users", { method: "POST", body: data }),
  updateUser: (id: string, data: Partial<AdminUser>) =>
    apiRequest<AdminUser>(`/admin/users/${id}`, { method: "PUT", body: data }),
  deleteUser: (id: string) =>
    apiRequest(`/admin/users/${id}`, { method: "DELETE" }),
  updateUserPassword: (id: string, newPassword: string) =>
    apiRequest(`/admin/users/${id}/password`, {
      method: "PUT",
      body: { password: newPassword },
    }),
};

// ============ ANALYTICS & REPORTS ============

export interface AnalyticsData {
  visitors: {
    total: number;
    today: number;
    thisMonth: number;
    change: number;
  };
  donations: {
    total: number;
    thisMonth: number;
    avgDonation: number;
    change: number;
  };
  events: {
    upcoming: number;
    thisMonth: number;
    totalRegistrations: number;
  };
  volunteers: {
    active: number;
    pending: number;
    thisMonth: number;
  };
}

export const analyticsApi = {
  getDashboardStats: () =>
    apiRequest<AnalyticsData>("/admin/analytics/dashboard"),
  getDonationAnalytics: (params?: { period?: string; causeId?: string }) =>
    apiRequest("/admin/analytics/donations", { params }),
  getVisitorAnalytics: (params?: { period?: string }) =>
    apiRequest("/admin/analytics/visitors", { params }),
  getEventAnalytics: (params?: { period?: string }) =>
    apiRequest("/admin/analytics/events", { params }),
};

// ============ SETTINGS MANAGEMENT ============

export const settingsApi = {
  getSettings: () => apiRequest("/admin/settings"),
  updateSettings: (data: any) =>
    apiRequest("/admin/settings", { method: "PUT", body: data }),
  getPaymentSettings: () => apiRequest("/admin/settings/payments"),
  updatePaymentSettings: (data: any) =>
    apiRequest("/admin/settings/payments", { method: "PUT", body: data }),
  getNotificationSettings: () => apiRequest("/admin/settings/notifications"),
  updateNotificationSettings: (data: any) =>
    apiRequest("/admin/settings/notifications", { method: "PUT", body: data }),
};

// ============ GALLERY MANAGEMENT ============

export const galleryApi = {
  getImages: (params?: { page?: number; limit?: number; folder?: string }) =>
    apiRequest("/admin/gallery", { params }),
  uploadImage: (file: File, folder?: string) => uploadFile(file, folder),
  deleteImage: (id: string) =>
    apiRequest(`/admin/gallery/${id}`, { method: "DELETE" }),
  updateImageData: (
    id: string,
    data: { title?: string; alt?: string; description?: string }
  ) => apiRequest(`/admin/gallery/${id}`, { method: "PUT", body: data }),
};
