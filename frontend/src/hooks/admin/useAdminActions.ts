// hooks/admin/useAdminActions.ts
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { safeFetch } from "@/lib/fetchUtils";

interface ActionState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

interface UseAdminActionsOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

export function useAdminActions(options: UseAdminActionsOptions = {}) {
  const { onSuccess, onError, redirectTo } = options;
  const router = useRouter();

  const [state, setState] = useState<ActionState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      success: false,
    });
  }, []);

  const executeAction = useCallback(
    async (
      endpoint: string,
      method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
      data?: any
    ) => {
      try {
        setState({
          isLoading: true,
          error: null,
          success: false,
        });

        const token = localStorage.getItem("admin_token");
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        // include JSON content type for non-form requests
        if (data && !(data instanceof FormData)) {
          headers["Content-Type"] = "application/json";
        }

        const fetchOptions: RequestInit = {
          method,
          headers,
          // body: safeFetch expects RequestInit body; stringify if needed
        };

        if (data && method !== "GET") {
          fetchOptions.body =
            data instanceof FormData ? data : JSON.stringify(data);
        }

        const res = await safeFetch(endpoint, fetchOptions);

        if (!res.success) {
          throw new Error(res.error || `HTTP error`);
        }

        const responseData = res.data;

        setState({
          isLoading: false,
          error: null,
          success: true,
        });

        onSuccess?.(responseData);

        if (redirectTo) {
          router.push(redirectTo);
        }

        return { success: true, data: responseData };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Action failed";

        setState({
          isLoading: false,
          error: errorMessage,
          success: false,
        });

        onError?.(errorMessage);

        return { success: false, error: errorMessage };
      }
    },
    [onSuccess, onError, redirectTo, router]
  );

  // Specific action methods
  const createEvent = useCallback(
    async (eventData: any) => {
      return executeAction("/api/admin/events", "POST", eventData);
    },
    [executeAction]
  );

  const updateEvent = useCallback(
    async (id: string, eventData: any) => {
      return executeAction(`/api/admin/events/${id}`, "PUT", eventData);
    },
    [executeAction]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      return executeAction(`/api/admin/events/${id}`, "DELETE");
    },
    [executeAction]
  );

  const createCause = useCallback(
    async (causeData: any) => {
      return executeAction("/api/admin/causes", "POST", causeData);
    },
    [executeAction]
  );

  const updateCause = useCallback(
    async (id: string, causeData: any) => {
      return executeAction(`/api/admin/causes/${id}`, "PUT", causeData);
    },
    [executeAction]
  );

  const deleteCause = useCallback(
    async (id: string) => {
      return executeAction(`/api/admin/causes/${id}`, "DELETE");
    },
    [executeAction]
  );

  const createBlogPost = useCallback(
    async (postData: any) => {
      return executeAction("/api/admin/blog", "POST", postData);
    },
    [executeAction]
  );

  const updateBlogPost = useCallback(
    async (id: string, postData: any) => {
      return executeAction(`/api/admin/blog/${id}`, "PUT", postData);
    },
    [executeAction]
  );

  const deleteBlogPost = useCallback(
    async (id: string) => {
      return executeAction(`/api/admin/blog/${id}`, "DELETE");
    },
    [executeAction]
  );

  const updateHeroSection = useCallback(
    async (heroData: any) => {
      return executeAction("/api/admin/home/hero-section", "PUT", heroData);
    },
    [executeAction]
  );

  const updateStatsSection = useCallback(
    async (statsData: any) => {
      return executeAction("/api/admin/home/stats-section", "PUT", statsData);
    },
    [executeAction]
  );

  const updateTestimonial = useCallback(
    async (id: string, testimonialData: any) => {
      return executeAction(
        `/api/admin/testimonials/${id}`,
        "PUT",
        testimonialData
      );
    },
    [executeAction]
  );

  const createTestimonial = useCallback(
    async (testimonialData: any) => {
      return executeAction("/api/admin/testimonials", "POST", testimonialData);
    },
    [executeAction]
  );

  const deleteTestimonial = useCallback(
    async (id: string) => {
      return executeAction(`/api/admin/testimonials/${id}`, "DELETE");
    },
    [executeAction]
  );

  const updateUserPermissions = useCallback(
    async (userId: string, permissions: string[]) => {
      return executeAction(`/api/admin/users/${userId}/permissions`, "PUT", {
        permissions,
      });
    },
    [executeAction]
  );

  const updateSettings = useCallback(
    async (settingsData: any) => {
      return executeAction("/api/admin/settings", "PUT", settingsData);
    },
    [executeAction]
  );

  const uploadImage = useCallback(
    async (file: File, folder?: string) => {
      try {
        setState({
          isLoading: true,
          error: null,
          success: false,
        });

        const formData = new FormData();
        formData.append("file", file);
        if (folder) {
          formData.append("folder", folder);
        }

        const token = localStorage.getItem("admin_token");
        const fetchOptions: RequestInit = {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        };

        const res = await safeFetch("/api/admin/upload", fetchOptions);

        if (!res.success) {
          throw new Error(res.error || "Upload failed");
        }

        const responseData = res.data;

        setState({
          isLoading: false,
          error: null,
          success: true,
        });

        onSuccess?.(responseData);

        return { success: true, data: responseData };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";

        setState({
          isLoading: false,
          error: errorMessage,
          success: false,
        });

        onError?.(errorMessage);

        return { success: false, error: errorMessage };
      }
    },
    [onSuccess, onError]
  );

  const bulkDelete = useCallback(
    async (endpoint: string, ids: string[]) => {
      return executeAction(`${endpoint}/bulk-delete`, "DELETE", { ids });
    },
    [executeAction]
  );

  const exportData = useCallback(
    async (endpoint: string, format: "csv" | "json" = "csv") => {
      try {
        setState({
          isLoading: true,
          error: null,
          success: false,
        });

        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${endpoint}/export?format=${format}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Export failed");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `export-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setState({
          isLoading: false,
          error: null,
          success: true,
        });

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Export failed";

        setState({
          isLoading: false,
          error: errorMessage,
          success: false,
        });

        return { success: false, error: errorMessage };
      }
    },
    []
  );

  return {
    ...state,
    resetState,
    executeAction,

    // Event actions
    createEvent,
    updateEvent,
    deleteEvent,

    // Cause actions
    createCause,
    updateCause,
    deleteCause,

    // Blog actions
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,

    // Home page actions
    updateHeroSection,
    updateStatsSection,

    // Testimonial actions
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,

    // User actions
    updateUserPermissions,

    // Settings actions
    updateSettings,

    // Utility actions
    uploadImage,
    bulkDelete,
    exportData,
  };
}

// Custom hook for specific event management
export function useEventManagement() {
  const actions = useAdminActions({
    onSuccess: (data) => {
      console.log("Event action successful:", data);
    },
    onError: (error) => {
      console.error("Event action failed:", error);
    },
  });

  const events = useAdminData<any[]>({
    endpoint: "/api/admin/events",
    dependencies: [actions.success], // Refetch when an action succeeds
  });

  return {
    events: events.data || [],
    isLoading: events.isLoading || actions.isLoading,
    error: events.error || actions.error,
    refetchEvents: events.refetch,
    createEvent: actions.createEvent,
    updateEvent: actions.updateEvent,
    deleteEvent: actions.deleteEvent,
    uploadImage: actions.uploadImage,
  };
}

// Custom hook for cause management
export function useCauseManagement() {
  const actions = useAdminActions({
    onSuccess: (data) => {
      console.log("Cause action successful:", data);
    },
    onError: (error) => {
      console.error("Cause action failed:", error);
    },
  });

  const causes = useAdminData<any[]>({
    endpoint: "/api/admin/causes",
    dependencies: [actions.success],
  });

  return {
    causes: causes.data || [],
    isLoading: causes.isLoading || actions.isLoading,
    error: causes.error || actions.error,
    refetchCauses: causes.refetch,
    createCause: actions.createCause,
    updateCause: actions.updateCause,
    deleteCause: actions.deleteCause,
    uploadImage: actions.uploadImage,
  };
}

// Custom hook for dashboard analytics
export function useDashboardAnalytics() {
  const donationStats = useAdminData({
    endpoint: "/api/admin/analytics/donations",
  });

  const visitorStats = useAdminData({
    endpoint: "/api/admin/analytics/visitors",
  });

  const eventStats = useAdminData({
    endpoint: "/api/admin/analytics/events",
  });

  const userStats = useAdminData({
    endpoint: "/api/admin/analytics/users",
  });

  return {
    donations: donationStats.data,
    visitors: visitorStats.data,
    events: eventStats.data,
    users: userStats.data,
    isLoading:
      donationStats.isLoading ||
      visitorStats.isLoading ||
      eventStats.isLoading ||
      userStats.isLoading,
    error:
      donationStats.error ||
      visitorStats.error ||
      eventStats.error ||
      userStats.error,
    refetch: () => {
      donationStats.refetch();
      visitorStats.refetch();
      eventStats.refetch();
      userStats.refetch();
    },
  };
}
