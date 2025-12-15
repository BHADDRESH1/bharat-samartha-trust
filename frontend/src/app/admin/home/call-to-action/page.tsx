"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye } from "lucide-react";
import AdminCard from "@/components/admin/ui/AdminCard";

// Type Interfaces
interface CTASection {
  id: string;
  title: string;
  description: string;
  primaryButton: {
    text: string;
    url: string;
    style: string;
  };
  secondaryButton: {
    text: string;
    url: string;
    style: string;
  };
  backgroundStyle: "gradient" | "solid" | "image";
  gradientFrom: string;
  gradientTo: string;
  backgroundColor: string;
  backgroundImage: string;
  textColor: string;
  enabled: boolean;
  animation: {
    title: "fadeIn" | "slideUp" | "slideDown" | "none";
    description: "fadeIn" | "slideUp" | "slideDown" | "none";
    buttons: "fadeIn" | "slideUp" | "slideDown" | "none";
  };
}

interface CTAAnalytics {
  views: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
}

// ✅ API Service (Internal)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "")}/api`
  : "http://localhost:5000/api";

const CTAService = {
  async getCTASection() {
    const response = await fetch(`${API_BASE_URL}/cta/cta/main-cta`);
    const result = await response.json();
    if (!result.success)
      throw new Error(result.message || "Failed to fetch CTA data");
    return result.data;
  },

  async saveCTASection(ctaData: CTASection) {
    const response = await fetch(`${API_BASE_URL}/cta/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ctaData),
    });
    const result = await response.json();
    if (!result.success)
      throw new Error(result.message || "Failed to save CTA data");
    return result;
  },

  async updateCTASection(updates: Partial<CTASection>) {
    const response = await fetch(`${API_BASE_URL}/cta`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const result = await response.json();
    if (!result.success)
      throw new Error(result.message || "Failed to update CTA data");
    return result;
  },
};

// ✅ Main Component
export default function CallToActionManagement() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ctaSection, setCtaSection] = useState<CTASection>({
    id: "main-cta",
    title: "Join Us in Making a Difference",
    description:
      "Your contribution can change lives. Together, we can create a better world for all.",
    primaryButton: {
      text: "Donate Now",
      url: "/donate",
      style: "bg-white text-purple-600 hover:bg-gray-100",
    },
    secondaryButton: {
      text: "Get Involved",
      url: "/get-involved",
      style:
        "bg-transparent border-2 border-white text-white hover:bg-white/10",
    },
    backgroundStyle: "gradient",
    gradientFrom: "#9333ea",
    gradientTo: "#3b82f6",
    backgroundColor: "#9333ea",
    backgroundImage: "",
    textColor: "#ffffff",
    enabled: true,
    animation: {
      title: "fadeIn",
      description: "fadeIn",
      buttons: "fadeIn",
    },
  });

  const [analytics, setAnalytics] = useState<CTAAnalytics>({
    views: 15420,
    clicks: 1205,
    conversions: 187,
    ctr: 7.8,
    conversionRate: 15.5,
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    loadCTAData();
  }, []);

  const loadCTAData = async () => {
    try {
      setLoading(true);
      const data = await CTAService.getCTASection();
      setCtaSection(data);
    } catch (error) {
      console.error("Failed to load CTA data:", error);
      showNotification("error", "Failed to load CTA data");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateCTASection = (field: string, value: any) => {
    setCtaSection((prev) => ({ ...prev, [field]: value }));
  };

  const updateButton = (
    buttonType: "primaryButton" | "secondaryButton",
    field: string,
    value: string
  ) => {
    setCtaSection((prev) => ({
      ...prev,
      [buttonType]: {
        ...prev[buttonType],
        [field]: value,
      },
    }));
  };

  const updateAnimation = (
    animationType: "title" | "description" | "buttons",
    value: string
  ) => {
    setCtaSection((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        [animationType]: value,
      },
    }));
  };

  const saveCTASection = async () => {
    try {
      setSaving(true);
      await CTAService.saveCTASection(ctaSection);
      showNotification("success", "CTA section saved successfully!");
    } catch (error) {
      console.error("Failed to save CTA section:", error);
      showNotification("error", "Failed to save CTA section");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Call-to-Action Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your homepage call-to-action section and track its
            performance
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Edit Mode" : "Preview"}
          </button>
          <button
            onClick={saveCTASection}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.views.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Views
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.clicks.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Clicks
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analytics.conversions}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Conversions
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.ctr}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Click Rate
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {analytics.conversionRate}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Conversion Rate
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CTA Editor */}
        <div>
          <AdminCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Call-to-Action Section
                </h3>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={ctaSection.enabled}
                      onChange={(e) =>
                        updateCTASection("enabled", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enabled
                    </span>
                  </label>
                </div>
              </div>

              {/* Content Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Main Title
                </label>
                <input
                  type="text"
                  value={ctaSection.title}
                  onChange={(e) => updateCTASection("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={ctaSection.description}
                  onChange={(e) =>
                    updateCTASection("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Button Configuration */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Primary Button
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={ctaSection.primaryButton.text}
                        onChange={(e) =>
                          updateButton("primaryButton", "text", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Button URL
                      </label>
                      <input
                        type="text"
                        value={ctaSection.primaryButton.url}
                        onChange={(e) =>
                          updateButton("primaryButton", "url", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Secondary Button
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={ctaSection.secondaryButton.text}
                        onChange={(e) =>
                          updateButton(
                            "secondaryButton",
                            "text",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Button URL
                      </label>
                      <input
                        type="text"
                        value={ctaSection.secondaryButton.url}
                        onChange={(e) =>
                          updateButton("secondaryButton", "url", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Background Style
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Type
                  </label>
                  <select
                    value={ctaSection.backgroundStyle}
                    onChange={(e) =>
                      updateCTASection("backgroundStyle", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="gradient">Gradient</option>
                    <option value="solid">Solid Color</option>
                    <option value="image">Background Image</option>
                  </select>
                </div>

                {ctaSection.backgroundStyle === "gradient" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gradient From
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={ctaSection.gradientFrom}
                          onChange={(e) =>
                            updateCTASection("gradientFrom", e.target.value)
                          }
                          className="w-12 h-10 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={ctaSection.gradientFrom}
                          onChange={(e) =>
                            updateCTASection("gradientFrom", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gradient To
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={ctaSection.gradientTo}
                          onChange={(e) =>
                            updateCTASection("gradientTo", e.target.value)
                          }
                          className="w-12 h-10 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={ctaSection.gradientTo}
                          onChange={(e) =>
                            updateCTASection("gradientTo", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {ctaSection.backgroundStyle === "solid" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={ctaSection.backgroundColor}
                        onChange={(e) =>
                          updateCTASection("backgroundColor", e.target.value)
                        }
                        className="w-12 h-10 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={ctaSection.backgroundColor}
                        onChange={(e) =>
                          updateCTASection("backgroundColor", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {ctaSection.backgroundStyle === "image" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Image URL
                    </label>
                    <input
                      type="text"
                      value={ctaSection.backgroundImage}
                      onChange={(e) =>
                        updateCTASection("backgroundImage", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={ctaSection.textColor}
                      onChange={(e) =>
                        updateCTASection("textColor", e.target.value)
                      }
                      className="w-12 h-10 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={ctaSection.textColor}
                      onChange={(e) =>
                        updateCTASection("textColor", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Animation Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Animations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title Animation
                    </label>
                    <select
                      value={ctaSection.animation.title}
                      onChange={(e) => updateAnimation("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="fadeIn">Fade In</option>
                      <option value="slideUp">Slide Up</option>
                      <option value="slideDown">Slide Down</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description Animation
                    </label>
                    <select
                      value={ctaSection.animation.description}
                      onChange={(e) =>
                        updateAnimation("description", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="fadeIn">Fade In</option>
                      <option value="slideUp">Slide Up</option>
                      <option value="slideDown">Slide Down</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Buttons Animation
                    </label>
                    <select
                      value={ctaSection.animation.buttons}
                      onChange={(e) =>
                        updateAnimation("buttons", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="fadeIn">Fade In</option>
                      <option value="slideUp">Slide Up</option>
                      <option value="slideDown">Slide Down</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Preview */}
        <div>
          <AdminCard>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Live Preview
            </h3>
            <div
              className="relative rounded-lg overflow-hidden py-20 px-4 text-center"
              style={{
                background:
                  ctaSection.backgroundStyle === "gradient"
                    ? `linear-gradient(135deg, ${ctaSection.gradientFrom}, ${ctaSection.gradientTo})`
                    : ctaSection.backgroundStyle === "image" &&
                      ctaSection.backgroundImage
                    ? `url(${ctaSection.backgroundImage})`
                    : ctaSection.backgroundColor,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: ctaSection.textColor,
              }}
            >
              <div className="container mx-auto relative z-10">
                <motion.h2
                  className="text-3xl md:text-5xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {ctaSection.title}
                </motion.h2>

                <motion.p
                  className="text-xl mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {ctaSection.description}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <button
                    className={`px-8 py-4 font-bold rounded-full text-xl transition-all duration-300 hover:scale-105 shadow-lg ${ctaSection.primaryButton.style}`}
                  >
                    {ctaSection.primaryButton.text}
                  </button>
                  <button
                    className={`px-8 py-4 font-bold rounded-full text-xl transition-all duration-300 hover:scale-105 ${ctaSection.secondaryButton.style}`}
                  >
                    {ctaSection.secondaryButton.text}
                  </button>
                </motion.div>
              </div>

              {/* Overlay for background images */}
              {ctaSection.backgroundStyle === "image" &&
                ctaSection.backgroundImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                )}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
