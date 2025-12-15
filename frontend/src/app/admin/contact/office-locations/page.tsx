"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Settings,
  Palette,
  Layout,
  MousePointer,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Zap,
  Globe,
  AlertCircle,
} from "lucide-react";

import { safeFetch } from "@/lib/fetchUtils";

// Types
interface Highlight {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

interface VisualSettings {
  theme: "light" | "dark" | "auto";
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  animationSpeed: "slow" | "normal" | "fast";
  showGrid: boolean;
  showPulse: boolean;
  showFloatingElements: boolean;
  enableInteractions: boolean;
}

interface AnalyticsData {
  totalViews: number;
  interactions: number;
  averageEngagementTime: string;
  mostClickedHighlight: string;
  conversionRate: number;
  thisWeek: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "")}/api`
  : "/api";

export default function AnimatedContactVisualAdmin() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [visualSettings, setVisualSettings] = useState<VisualSettings>({
    theme: "light",
    backgroundColor: "#f8fafc",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    animationSpeed: "normal",
    showGrid: true,
    showPulse: true,
    showFloatingElements: true,
    enableInteractions: true,
  });
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 12456,
    interactions: 3247,
    averageEngagementTime: "2m 34s",
    mostClickedHighlight: "Our Mission",
    conversionRate: 26.1,
    thisWeek: 1834,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingHighlight, setIsEditingHighlight] = useState<string | null>(
    null
  );
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [previewDevice, setPreviewDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // API functions with fallback to mock data for demo
  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Try to fetch from API, fallback to mock data for demo
      try {
        const res = await safeFetch("/api/contact-visual/admin");
        if (!res.success) throw new Error(res.error || "API not available");
        const data = res.data;
        setHighlights(data.highlights || []);
        setVisualSettings(data.visualSettings || visualSettings);

        // Fetch analytics separately
        const analyticsRes = await safeFetch(
          "/api/contact-visual/admin/analytics"
        );
        if (analyticsRes.success && analyticsRes.data) {
          setAnalytics(analyticsRes.data);
        }
      } catch (apiError) {
        // Fallback to mock data for demo
        console.log("Using mock data for demo");
        const mockHighlights: Highlight[] = [
          {
            id: 1,
            title: "Our Mission",
            description:
              "Creating positive change through community engagement and sustainable practices.",
            isActive: true,
            order: 1,
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-20T14:20:00Z",
          },
          {
            id: 2,
            title: "Our Impact",
            description:
              "Transforming lives across India with innovative solutions and dedicated service.",
            isActive: true,
            order: 2,
            createdAt: "2024-01-15T10:30:00Z",
          },
          {
            id: 3,
            title: "Join Our Cause",
            description:
              "Be part of a movement that is making a difference in communities nationwide.",
            isActive: true,
            order: 3,
            createdAt: "2024-01-15T10:30:00Z",
          },
          {
            id: 4,
            title: "Our Network",
            description:
              "Connected across Mumbai, Delhi, Bangalore, Chennai, and beyond.",
            isActive: false,
            order: 4,
            createdAt: "2024-01-15T10:30:00Z",
          },
        ];
        setHighlights(mockHighlights);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateHighlights = async (newHighlights: Highlight[]) => {
    try {
      setIsUpdating(true);

      // Try API call, fallback to local state update for demo
      try {
        const res = await safeFetch("/api/contact-visual/admin/highlights", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ highlights: newHighlights }),
        });

        if (!res.success)
          throw new Error(res.error || "Failed to update highlights");
        setHighlights(res.data?.highlights || newHighlights);
      } catch (apiError) {
        // Fallback to local state update for demo
        console.log("Updating highlights locally for demo");
        setHighlights(newHighlights);
      }

      setError(null);
    } catch (error) {
      console.error("Error updating highlights:", error);
      setError("Failed to update highlights");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateVisualSettingsAPI = async (newSettings: VisualSettings) => {
    try {
      // Try API call, fallback to local state update for demo
      try {
        const res = await safeFetch(
          "/api/contact-visual/admin/visual-settings",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSettings),
          }
        );

        if (!res.success)
          throw new Error(res.error || "Failed to update visual settings");
        setVisualSettings(res.data?.visualSettings || newSettings);
      } catch (apiError) {
        // Fallback to local state update for demo
        console.log("Updating settings locally for demo");
        setVisualSettings(newSettings);
      }

      setError(null);
    } catch (error) {
      console.error("Error updating visual settings:", error);
      setError("Failed to update visual settings");
    }
  };

  const addHighlight = async (title: string, description: string) => {
    try {
      // Try API call, fallback to local state update for demo
      try {
        const res = await safeFetch("/api/contact-visual/admin/highlights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        });

        if (!res.success)
          throw new Error(res.error || "Failed to add highlight");

        await fetchData(); // Refresh data
      } catch (apiError) {
        // Fallback to local state update for demo
        console.log("Adding highlight locally for demo");
        const newHighlight: Highlight = {
          id: Math.max(...highlights.map((h) => h.id || 0)) + 1,
          title,
          description,
          isActive: true,
          order: highlights.length + 1,
          createdAt: new Date().toISOString(),
        };
        setHighlights((prev) => [...prev, newHighlight]);
      }

      setError(null);
    } catch (error) {
      console.error("Error adding highlight:", error);
      setError("Failed to add highlight");
    }
  };

  const deleteHighlight = async (id: string) => {
    try {
      // Try API call, fallback to local state update for demo
      try {
        const res = await safeFetch(
          `/api/contact-visual/admin/highlights/${id}`,
          { method: "DELETE" }
        );

        if (!res.success)
          throw new Error(res.error || "Failed to delete highlight");
      } catch (apiError) {
        console.log("Deleting highlight locally for demo");
      }

      setHighlights((prev) =>
        prev.filter((h) => (h._id || h.id?.toString()) !== id)
      );
      setError(null);
    } catch (error) {
      console.error("Error deleting highlight:", error);
      setError("Failed to delete highlight");
    }
  };

  const exportConfig = async () => {
    try {
      const config = {
        highlights,
        visualSettings,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contact-visual-config.json";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting config:", error);
      setError("Failed to export configuration");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditHighlight = (highlight: Highlight) => {
    const id = highlight._id || highlight.id?.toString() || "";
    setIsEditingHighlight(id);
    setEditForm({
      title: highlight.title,
      description: highlight.description,
    });
  };

  const handleSaveHighlight = async () => {
    if (isEditingHighlight) {
      const updatedHighlights = highlights.map((h) => {
        const id = h._id || h.id?.toString();
        return id === isEditingHighlight
          ? {
              ...h,
              title: editForm.title,
              description: editForm.description,
              updatedAt: new Date().toISOString(),
            }
          : h;
      });

      await updateHighlights(updatedHighlights);
      setIsEditingHighlight(null);
      setEditForm({ title: "", description: "" });
    }
  };

  const handleToggleActive = async (targetId: string) => {
    const updatedHighlights = highlights.map((h) => {
      const id = h._id || h.id?.toString();
      return id === targetId ? { ...h, isActive: !h.isActive } : h;
    });

    await updateHighlights(updatedHighlights);
  };

  const handleDeleteHighlight = async (targetId: string) => {
    if (window.confirm("Are you sure you want to delete this highlight?")) {
      await deleteHighlight(targetId);
    }
  };

  const handleAddHighlight = async () => {
    const title = prompt("Enter highlight title:");
    const description = prompt("Enter highlight description:");

    if (title && description) {
      await addHighlight(title, description);
    }
  };

  const handleSaveSettings = async () => {
    await updateVisualSettingsAPI(visualSettings);
    setShowSettingsPanel(false);
  };

  const getDevicePreviewClass = () => {
    switch (previewDevice) {
      case "mobile":
        return "w-80 h-96";
      case "tablet":
        return "w-96 h-72";
      default:
        return "w-full h-96";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Contact Visual Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Manage animated contact visual content and settings
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportConfig}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Config
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setShowSettingsPanel(true)}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.totalViews.toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interactions</p>
              <p className="text-3xl font-bold text-green-600">
                {analytics.interactions.toLocaleString()}
              </p>
            </div>
            <MousePointer className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg. Engagement
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {analytics.averageEngagementTime}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Clicked</p>
              <p className="text-lg font-bold text-orange-600 truncate">
                {analytics.mostClickedHighlight}
              </p>
            </div>
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Conversion Rate
              </p>
              <p className="text-3xl font-bold text-indigo-600">
                {analytics.conversionRate}%
              </p>
            </div>
            <Globe className="w-8 h-8 text-indigo-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-3xl font-bold text-red-600">
                {analytics.thisWeek.toLocaleString()}
              </p>
            </div>
            <RefreshCw className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>
      </div>

      {/* Content Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highlights Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Highlight Elements
              </h2>
              <button
                onClick={handleAddHighlight}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                disabled={isUpdating}
              >
                <Plus className="w-4 h-4" />
                Add Highlight
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {highlights.map((highlight, index) => {
              const highlightId =
                highlight._id || highlight.id?.toString() || "";
              return (
                <motion.div
                  key={highlightId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    highlight.isActive
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {isEditingHighlight === highlightId ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Highlight title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Highlight description"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveHighlight}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1 disabled:opacity-50"
                        >
                          <Save className="w-3 h-3" />
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setIsEditingHighlight(null)}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {highlight.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              highlight.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {highlight.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleActive(highlightId)}
                            className={`p-1 rounded text-xs hover:bg-gray-200 ${
                              highlight.isActive
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                            title={
                              highlight.isActive ? "Deactivate" : "Activate"
                            }
                            disabled={isUpdating}
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleEditHighlight(highlight)}
                            className="p-1 rounded text-xs text-blue-600 hover:bg-gray-200"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteHighlight(highlightId)}
                            className="p-1 rounded text-xs text-red-600 hover:bg-gray-200"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button className="p-1 rounded text-xs text-gray-600 hover:bg-gray-200">
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {highlight.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Order: {highlight.order}</span>
                        <span>
                          Updated:{" "}
                          {new Date(
                            highlight.updatedAt || highlight.createdAt || ""
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Live Preview
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-2 rounded ${
                      previewDevice === "desktop" ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("tablet")}
                    className={`p-2 rounded ${
                      previewDevice === "tablet" ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-2 rounded ${
                      previewDevice === "mobile" ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-center">
              <div
                className={`${getDevicePreviewClass()} border-2 border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50`}
              >
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* Simplified preview representation */}
                  <div className="text-center">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        Connecting Communities
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Interactive preview
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                      {highlights
                        .filter((h) => h.isActive)
                        .slice(0, 4)
                        .map((highlight) => {
                          const highlightId =
                            highlight._id || highlight.id?.toString() || "";
                          return (
                            <div
                              key={highlightId}
                              className="p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm"
                            >
                              <div className="text-xs font-semibold text-blue-600 mb-1">
                                {highlight.title}
                              </div>
                              <div className="w-6 h-0.5 bg-blue-400 rounded-full mb-1"></div>
                              <div className="text-xs text-gray-600 line-clamp-2">
                                {highlight.description}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Animated elements */}
                  {visualSettings.showFloatingElements && (
                    <div className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`absolute w-4 h-4 bg-blue-200 rounded-full opacity-20 ${
                            visualSettings.showPulse ? "animate-pulse" : ""
                          }`}
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + i * 10}%`,
                            animationDelay: `${i * 0.5}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                <Copy className="w-3 h-3" />
                Copy Code
              </button>
              <button
                onClick={fetchData}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettingsPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Visual Settings
              </h2>
              <button
                onClick={() => setShowSettingsPanel(false)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme & Colors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={visualSettings.theme}
                      onChange={(e) =>
                        setVisualSettings({
                          ...visualSettings,
                          theme: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={visualSettings.primaryColor}
                      onChange={(e) =>
                        setVisualSettings({
                          ...visualSettings,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Animation Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Animation Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animation Speed
                    </label>
                    <select
                      value={visualSettings.animationSpeed}
                      onChange={(e) =>
                        setVisualSettings({
                          ...visualSettings,
                          animationSpeed: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={visualSettings.showGrid}
                        onChange={(e) =>
                          setVisualSettings({
                            ...visualSettings,
                            showGrid: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Show Grid Pattern
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={visualSettings.showPulse}
                        onChange={(e) =>
                          setVisualSettings({
                            ...visualSettings,
                            showPulse: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Pulse Effects
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={visualSettings.showFloatingElements}
                        onChange={(e) =>
                          setVisualSettings({
                            ...visualSettings,
                            showFloatingElements: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Floating Elements
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={visualSettings.enableInteractions}
                        onChange={(e) =>
                          setVisualSettings({
                            ...visualSettings,
                            enableInteractions: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Enable Interactions
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowSettingsPanel(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
