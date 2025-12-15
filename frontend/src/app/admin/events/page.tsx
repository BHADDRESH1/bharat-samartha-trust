"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import dynamic from "next/dynamic";
import axios from "axios";

// Icons (assuming you're using Lucide or similar)
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  Clock,
  Save,
  X,
  Upload,
  Download,
} from "lucide-react";

// Dynamic Imports
const AdminEventModal = dynamic(
  () => import("@/components/admin/AdminEventModal"),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

const API_HOST = process.env.NEXT_PUBLIC_API_BASE_URL
  ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "")
  : "http://localhost:5000";
const api = axios.create({ baseURL: `${API_HOST}/api` });

const fetchEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

const createEvent = async (eventData) => {
  const res = await api.post("/events", eventData);
  return res.data;
};

const updateEvent = async (_id, eventData) => {
  const res = await api.put(`/events/${_id}`, eventData);
  return res.data;
};

const deleteEvent = async (_id) => {
  const res = await api.delete(`/events/${_id}`);
  return res.data;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [error, setError] = useState(null);

  const tableRef = useRef(null);

  // Helper function to generate placeholder image
  const getPlaceholderImage = (title = "Event") => {
    // Create a simple SVG placeholder as base64
    const svg = `
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#e5e7eb"/>
        <text x="50%" y="45%" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
          No Image
        </text>
        <text x="50%" y="65%" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af">
          ${title.substring(0, 15)}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Helper function to format location
  const formatLocation = (location) => {
    if (!location) return "TBD";

    // If location is a string, return it directly
    if (typeof location === "string") {
      return location;
    }

    // If location is an object, format it properly
    if (typeof location === "object") {
      const { name, address, city, state } = location;

      if (name) {
        return name;
      }

      if (address && city && state) {
        return `${address}, ${city}, ${state}`;
      }

      if (city && state) {
        return `${city}, ${state}`;
      }

      if (city) {
        return city;
      }

      // If none of the above, try to return any string value from the object
      const stringValues = Object.values(location).filter(
        (val) => typeof val === "string" && val.trim()
      );
      if (stringValues.length > 0) {
        return stringValues[0];
      }
    }

    return "TBD";
  };

  // Helper function to get searchable location text
  const getLocationSearchText = (location) => {
    if (!location) return "";

    if (typeof location === "string") {
      return location.toLowerCase();
    }

    if (typeof location === "object") {
      const { name, address, city, state, zip } = location;
      return [name, address, city, state, zip]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    }

    return "";
  };

  // Helper function to validate date
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  // Fetch Events
  useEffect(() => {
    const getEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchEvents();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        const validatedData = data.map((event) => {
          // Ensure all required fields exist
          const validatedEvent = {
            _id: event._id, // Preserve the MongoDB _id
            id: event.id || event._id, // Keep both for compatibility
            title: event.title || "Untitled Event",
            description: event.description || "",
            category: event.category || "Uncategorized",
            location: event.location || "TBD",
            imageUrl:
              event.imageUrl || getPlaceholderImage(event.title || "Event"),
            ...event,
          };

          // Validate and format dates
          if (event.date) {
            const eventDate = new Date(event.date);
            validatedEvent.date = isValidDate(eventDate)
              ? eventDate.toISOString()
              : null;
          } else {
            validatedEvent.date = null;
          }

          if (event.createdAt) {
            const createdDate = new Date(event.createdAt);
            validatedEvent.createdAt = isValidDate(createdDate)
              ? createdDate.toISOString()
              : new Date().toISOString();
          } else {
            validatedEvent.createdAt = new Date().toISOString();
          }

          if (event.updatedAt) {
            const updatedDate = new Date(event.updatedAt);
            validatedEvent.updatedAt = isValidDate(updatedDate)
              ? updatedDate.toISOString()
              : new Date().toISOString();
          } else {
            validatedEvent.updatedAt = new Date().toISOString();
          }

          return validatedEvent;
        });

        setEvents(validatedData);
        setFilteredEvents(validatedData);

        // Extract Categories
        const uniqueCategories = Array.from(
          new Set(validatedData.map((event) => event.category).filter(Boolean))
        );
        setCategories(["All", ...uniqueCategories]);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again.");
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (isLoading || typeof window === "undefined") return;

    const timer = setTimeout(() => {
      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll(".admin-row-animate");
        if (rows.length > 0) {
          gsap.fromTo(
            rows,
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 0.4,
              ease: "power2.out",
            }
          );
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading, filteredEvents]);

  // Filter and Search Events
  useEffect(() => {
    let filtered = [...events];

    // Category Filter
    if (activeCategory !== "All") {
      filtered = filtered.filter((event) => event.category === activeCategory);
    }

    // Search Filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (event) =>
          (event.title && event.title.toLowerCase().includes(searchLower)) ||
          (event.description &&
            event.description.toLowerCase().includes(searchLower)) ||
          getLocationSearchText(event.location).includes(searchLower) ||
          (event.category && event.category.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "title":
          aVal = (a.title || "").toLowerCase();
          bVal = (b.title || "").toLowerCase();
          break;
        case "date":
          aVal = a.date ? new Date(a.date) : new Date(0);
          bVal = b.date ? new Date(b.date) : new Date(0);
          break;
        case "category":
          aVal = (a.category || "").toLowerCase();
          bVal = (b.category || "").toLowerCase();
          break;
        case "createdAt":
          aVal = new Date(a.createdAt || 0);
          bVal = new Date(b.createdAt || 0);
          break;
        default:
          aVal = a[sortBy] || "";
          bVal = b[sortBy] || "";
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEvents(filtered);
  }, [events, activeCategory, searchTerm, sortBy, sortOrder]);

  // Event Handlers
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setModalMode("view");
    setIsModalOpen(true);
  };

  // FIXED: Delete functionality with proper ID handling
  const handleDeleteEvent = async (eventId) => {
    try {
      setError(null);

      // Find the event to get the correct _id
      const eventToDelete = events.find(
        (event) => event._id === eventId || event.id === eventId
      );
      if (!eventToDelete) {
        throw new Error("Event not found");
      }

      // Use _id for the API call (MongoDB format)
      await deleteEvent(eventToDelete._id);

      // Remove from state using _id
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventToDelete._id)
      );
      setDeleteConfirmId(null);

      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event. Please try again.");
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      setError(null);
      if (modalMode === "create") {
        const newEvent = await createEvent(eventData);
        if (newEvent) {
          setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
      } else if (modalMode === "edit" && selectedEvent) {
        const updatedEvent = await updateEvent(selectedEvent._id, eventData);
        if (updatedEvent) {
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event._id === selectedEvent._id ? updatedEvent : event
            )
          );
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Failed to save event. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    try {
      const date = new Date(dateString);
      if (!isValidDate(date)) return "Invalid date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getEventStatus = (event) => {
    if (!event.date)
      return { status: "no date", color: "bg-gray-100 text-gray-600" };

    try {
      const now = new Date();
      const eventDate = new Date(event.date);

      if (!isValidDate(eventDate)) {
        return { status: "invalid date", color: "bg-gray-100 text-gray-600" };
      }

      if (eventDate < now)
        return { status: "past", color: "bg-gray-100 text-gray-600" };
      if (eventDate > now)
        return { status: "upcoming", color: "bg-green-100 text-green-600" };
      return { status: "ongoing", color: "bg-blue-100 text-blue-600" };
    } catch (error) {
      return { status: "error", color: "bg-red-100 text-red-600" };
    }
  };

  const getUpcomingEventsCount = () => {
    return events.filter((event) => {
      if (!event.date) return false;
      try {
        const eventDate = new Date(event.date);
        return isValidDate(eventDate) && eventDate > new Date();
      } catch {
        return false;
      }
    }).length;
  };

  const getPastEventsCount = () => {
    return events.filter((event) => {
      if (!event.date) return false;
      try {
        const eventDate = new Date(event.date);
        return isValidDate(eventDate) && eventDate < new Date();
      } catch {
        return false;
      }
    }).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 mt-4">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Event Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your events, create new ones, and track performance
              </p>
            </div>
            <motion.button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateEvent}
            >
              <Plus size={20} />
              <span>Create Event</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.length}
                </p>
              </div>
              <Calendar className="text-purple-600" size={32} />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming</p>
                <p className="text-3xl font-bold text-green-600">
                  {getUpcomingEventsCount()}
                </p>
              </div>
              <Clock className="text-green-600" size={32} />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Past Events</p>
                <p className="text-3xl font-bold text-gray-600">
                  {getPastEventsCount()}
                </p>
              </div>
              <Users className="text-gray-600" size={32} />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Categories</p>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.max(0, categories.length - 1)}
                </p>
              </div>
              <Filter className="text-blue-600" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center space-x-4">
              {/* Category Filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="category">Sort by Category</option>
                <option value="createdAt">Sort by Created</option>
              </select>

              <button
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                title={`Sort ${
                  sortOrder === "asc" ? "Descending" : "Ascending"
                }`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-600">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading events...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table ref={tableRef} className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => {
                      const eventStatus = getEventStatus(event);
                      return (
                        <tr
                          key={event._id}
                          className="admin-row-animate hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                className="h-12 w-12 rounded-lg object-cover mr-4"
                                src={event.imageUrl}
                                alt={event.title}
                                onError={(e) => {
                                  e.target.src = getPlaceholderImage(
                                    event.title
                                  );
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {event.title}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {event.description
                                    ? `${event.description.substring(0, 50)}...`
                                    : "No description"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(event.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {event.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <MapPin
                                size={14}
                                className="mr-1 text-gray-400"
                              />
                              {formatLocation(event.location)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventStatus.color}`}
                            >
                              {eventStatus.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                className="text-gray-600 hover:text-purple-600 p-1"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleViewEvent(event)}
                                title="View Event"
                              >
                                <Eye size={16} />
                              </motion.button>
                              <motion.button
                                className="text-gray-600 hover:text-blue-600 p-1"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditEvent(event)}
                                title="Edit Event"
                              >
                                <Edit2 size={16} />
                              </motion.button>
                              <motion.button
                                className="text-gray-600 hover:text-red-600 p-1"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setDeleteConfirmId(event._id)}
                                title="Delete Event"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        {searchTerm || activeCategory !== "All"
                          ? "No events found matching your criteria."
                          : "No events found. Create your first event to get started."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AdminEventModal
            event={selectedEvent}
            mode={modalMode}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEvent}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Event
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this event? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  onClick={() => handleDeleteEvent(deleteConfirmId)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
