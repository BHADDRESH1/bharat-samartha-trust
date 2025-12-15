"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  ArrowLeft,
  Settings,
  Image as ImageIcon,
} from "lucide-react";

interface TransformProject {
  id: number | string;
  _id?: string; // MongoDB ID
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SectionSettings {
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  isVisible: boolean;
}

interface ProjectFormData {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "")}/api`
  : "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE_URL });

// Helper function to normalize project data (handle both id and _id)
const normalizeProject = (project: any): TransformProject => ({
  ...project,
  id: project.id || project._id,
});

const projectsApi = {
  list: (): Promise<ApiResponse<TransformProject[]>> =>
    api.get("/transform-projects"),
  create: (data: ProjectFormData): Promise<ApiResponse<TransformProject>> =>
    api.post("/transform-projects", data),
  update: (
    id: number | string,
    data: ProjectFormData
  ): Promise<ApiResponse<TransformProject>> =>
    api.put(`/transform-projects/${id}`, data),
  toggle: (id: number | string): Promise<ApiResponse<TransformProject>> =>
    api.patch(`/transform-projects/toggle/${id}`),
  delete: (id: number | string): Promise<ApiResponse<void>> =>
    api.delete(`/transform-projects/${id}`),
};

const settingsApi = {
  get: (): Promise<ApiResponse<SectionSettings>> =>
    api.get("/transform-section-settings"),
  update: (data: SectionSettings): Promise<ApiResponse<SectionSettings>> =>
    api.put("/transform-section-settings", data),
};

interface BeforeAfterSlideProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
}

const BeforeAfterSlide = ({
  beforeImage,
  afterImage,
  title,
  description,
}: BeforeAfterSlideProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.min(Math.max(x, 0), 100));
    }
  };

  return (
    <div className="mb-4">
      <div
        ref={containerRef}
        className="relative h-48 overflow-hidden rounded-lg cursor-ew-resize"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt={`${title} - After`}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={`${title} - Before`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-white" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M18 8L22 12L18 16" stroke="black" strokeWidth="2" />
              <path d="M6 8L2 12L6 16" stroke="black" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      <h4 className="text-sm font-semibold mt-2">{title}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
};

export default function BeforeAfterAdmin() {
  const [projects, setProjects] = useState<TransformProject[]>([]);
  const [sectionSettings, setSectionSettings] = useState<SectionSettings>({
    title: "",
    subtitle: "",
    backgroundColor: "",
    textColor: "",
    isVisible: true,
  });
  const [activeTab, setActiveTab] = useState<"projects" | "settings">(
    "projects"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<TransformProject | null>(
    null
  );
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    beforeImage: "",
    afterImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const beforeImageInputRef = useRef<HTMLInputElement>(null);
  const afterImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [projResponse, settingsResponse] = await Promise.all([
          projectsApi.list(),
          settingsApi.get(),
        ]);

        // Normalize project data to ensure consistent ID field
        const normalizedProjects = projResponse.data.map(normalizeProject);
        console.log("Fetched projects:", normalizedProjects);

        setProjects(normalizedProjects);
        setSectionSettings(settingsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (project: TransformProject) => {
    console.log("Editing project:", project);
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      beforeImage: project.beforeImage,
      afterImage: project.afterImage,
    });
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      beforeImage: "",
      afterImage: "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!isFormValid) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingProject) {
        console.log("Updating project with ID:", editingProject.id);
        if (!editingProject.id) {
          throw new Error("Project ID is missing");
        }
        const response = await projectsApi.update(editingProject.id, formData);
        const normalizedProject = normalizeProject(response.data);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === normalizedProject.id ? normalizedProject : p
          )
        );
      } else {
        const response = await projectsApi.create(formData);
        const normalizedProject = normalizeProject(response.data);
        setProjects((prev) => [...prev, normalizedProject]);
      }
      setIsEditing(false);
      setEditingProject(null);
    } catch (err) {
      console.error("Error saving project:", err);
      setError("Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    console.log("Attempting to delete project with ID:", id);

    if (!id) {
      setError("Cannot delete project: ID is missing");
      return;
    }

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setLoading(true);
        setError(null);
        await projectsApi.delete(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Error deleting project:", err);
        setError("Failed to delete project. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleActive = async (id: number | string) => {
    console.log("Attempting to toggle project with ID:", id);

    if (!id) {
      setError("Cannot toggle project: ID is missing");
      return;
    }

    try {
      setError(null);
      const response = await projectsApi.toggle(id);
      const normalizedProject = normalizeProject(response.data);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? normalizedProject : p))
      );
    } catch (err) {
      console.error("Error toggling project:", err);
      setError("Failed to update project status. Please try again.");
    }
  };

  const handleFileUpload = async (
    field: "beforeImage" | "afterImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:5000/api/transform-projects/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data?.url;
      if (!imageUrl) {
        setError("Upload failed. No URL returned.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [field]: imageUrl,
      }));
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload image. Please try again.");
    }
  };

  const triggerFileUpload = (field: "beforeImage" | "afterImage") => {
    const inputRef =
      field === "beforeImage" ? beforeImageInputRef : afterImageInputRef;
    inputRef.current?.click();
  };

  const removeImage = (field: "beforeImage" | "afterImage") => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsApi.update(sectionSettings);
      setSectionSettings(response.data);
      alert("Section settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.beforeImage &&
    formData.afterImage;

  if (loading && projects.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Before/After Admin
          </h1>
          <p className="text-gray-600">
            Manage your transformation projects and section settings
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("projects")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "projects"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Section Settings
            </button>
          </nav>
        </div>

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            {!isEditing ? (
              <>
                {/* Add New Project Button */}
                <div className="mb-6">
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Project
                  </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <BeforeAfterSlide
                        beforeImage={project.beforeImage}
                        afterImage={project.afterImage}
                        title={project.title}
                        description={project.description}
                      />

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {project.isActive ? "Active" : "Inactive"}
                          </span>
                          <div className="text-xs text-gray-500">
                            ID: {project.id}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleActive(project.id)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled={loading}
                          >
                            {project.isActive ? (
                              <EyeOff className="h-4 w-4 mr-1" />
                            ) : (
                              <Eye className="h-4 w-4 mr-1" />
                            )}
                            {project.isActive ? "Hide" : "Show"}
                          </button>

                          <button
                            onClick={() => handleEdit(project)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(project.id)}
                            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {projects.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No projects
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new project.
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Edit/Add Form */
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </h2>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingProject(null);
                      setError(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project description"
                    />
                  </div>

                  {/* Before Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Before Image *
                    </label>
                    <div className="space-y-2">
                      {formData.beforeImage ? (
                        <div className="relative">
                          <img
                            src={formData.beforeImage}
                            alt="Before"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            onClick={() => removeImage("beforeImage")}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => triggerFileUpload("beforeImage")}
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-gray-400"
                        >
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              Upload Before Image
                            </p>
                          </div>
                        </button>
                      )}
                      <input
                        ref={beforeImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("beforeImage", e)}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* After Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      After Image *
                    </label>
                    <div className="space-y-2">
                      {formData.afterImage ? (
                        <div className="relative">
                          <img
                            src={formData.afterImage}
                            alt="After"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            onClick={() => removeImage("afterImage")}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => triggerFileUpload("afterImage")}
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-gray-400"
                        >
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              Upload After Image
                            </p>
                          </div>
                        </button>
                      )}
                      <input
                        ref={afterImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("afterImage", e)}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditingProject(null);
                        setError(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!isFormValid || loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                    >
                      {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      )}
                      <Save className="h-4 w-4 mr-2" />
                      {editingProject ? "Update Project" : "Create Project"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Section Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={sectionSettings.title}
                  onChange={(e) =>
                    setSectionSettings((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={sectionSettings.subtitle}
                  onChange={(e) =>
                    setSectionSettings((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={sectionSettings.backgroundColor}
                  onChange={(e) =>
                    setSectionSettings((prev) => ({
                      ...prev,
                      backgroundColor: e.target.value,
                    }))
                  }
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  value={sectionSettings.textColor}
                  onChange={(e) =>
                    setSectionSettings((prev) => ({
                      ...prev,
                      textColor: e.target.value,
                    }))
                  }
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={sectionSettings.isVisible}
                  onChange={(e) =>
                    setSectionSettings((prev) => ({
                      ...prev,
                      isVisible: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isVisible"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Section is visible on website
                </label>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 inline-flex items-center"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
