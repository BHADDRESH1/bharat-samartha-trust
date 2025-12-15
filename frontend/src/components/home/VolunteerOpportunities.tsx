import  { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Users,
  Briefcase,
  Heart,
  BookOpen,
  Utensils,
  Code,
  MapPin,
  AlertCircle,
  Wifi,
  Calendar,
  Award,
  Star,
  X,
  Send,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { safeFetch, FetchErrorFallback } from "@/lib/fetchUtils";

interface Opportunity {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  timeCommitment: string;
  skillsRequired: string[];
  spotsAvailable: number;
  totalSpots: number;
  currentVolunteers?: number;
  active: boolean;
  featured: boolean;
  visible?: boolean;
  urgent?: boolean;
  icon: string;
  applicationDeadline: string;
  _id?: string;
}

interface SectionSettings {
  sectionVisible: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  backgroundColor: string;
  showViewAllButton: boolean;
  viewAllButtonText: string;
  viewAllButtonLink: string;
  requireRegistration: boolean;
  maxOpportunitiesToShow: number;
  showOnlyActive: boolean;
  highlightUrgent?: boolean;
}

interface VolunteerData {
  sectionSettings: SectionSettings;
  opportunities: Opportunity[];
}

const VolunteerOpportunities = () => {
  const [volunteerData, setVolunteerData] = useState<VolunteerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    experience: "",
    availability: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Icon mapping for dynamic icons
  const iconMap: Record<string, any> = {
    BookOpen: BookOpen,
    Utensils: Utensils,
    Code: Code,
    Heart: Heart,
    Users: Users,
    Briefcase: Briefcase,
    Clock: Clock,
    MapPin: MapPin,
    Award: Award,
    // Add more common icon mappings
    "book-open": BookOpen,
    utensils: Utensils,
    code: Code,
    heart: Heart,
    users: Users,
    briefcase: Briefcase,
    clock: Clock,
    "map-pin": MapPin,
    award: Award,
  };

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const result = await safeFetch("/api/volunteer-management");
        if (result.success && result.data) {
          setVolunteerData(result.data);
        } else {
          // Use fallback data when API fails
          setVolunteerData(getFallbackVolunteerData());
        }
      } catch (err) {
        // Use fallback data on error
        setVolunteerData(getFallbackVolunteerData());
      } finally {
        setLoading(false);
      }
    };

    // Check if user is logged in (you'll need to implement this based on your auth system)
    const checkAuthStatus = () => {
      // This is a placeholder - replace with your actual auth check
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    fetchVolunteerData();
    checkAuthStatus();
  }, []);

  // Fallback volunteer data for Bharat Samarth Trust
  const getFallbackVolunteerData = () => ({
    sectionSettings: {
      sectionVisible: true,
      sectionTitle: "Volunteer Opportunities",
      sectionSubtitle: "Make a difference in your community",
      backgroundColor: "bg-gradient-to-r from-purple-50 to-blue-50",
      showViewAllButton: true,
      viewAllButtonText: "Explore All Opportunities",
      viewAllButtonLink: "/volunteer",
      requireRegistration: false,
      maxOpportunitiesToShow: 3,
      showOnlyActive: true
    },
    opportunities: [
      {
        id: 1,
        title: "Teaching Assistant",
        category: "Education",
        description: "Help underprivileged children with their studies and homework",
        location: "Chennai, Tamil Nadu",
        timeCommitment: "2-3 hours/week",
        skillsRequired: ["Teaching", "Patience", "Communication"],
        spotsAvailable: 5,
        totalSpots: 10,
        active: true,
        featured: true,
        icon: "BookOpen",
        applicationDeadline: "2025-02-01"
      },
      {
        id: 2,
        title: "Food Distribution Volunteer",
        category: "Community Service",
        description: "Assist in distributing food to homeless and needy families",
        location: "Coimbatore, Tamil Nadu",
        timeCommitment: "4 hours/week",
        skillsRequired: ["Teamwork", "Physical Fitness", "Compassion"],
        spotsAvailable: 8,
        totalSpots: 15,
        active: true,
        featured: true,
        icon: "Utensils",
        applicationDeadline: "2025-01-25"
      },
      {
        id: 3,
        title: "Healthcare Support",
        category: "Healthcare",
        description: "Support medical camps and health awareness programs",
        location: "Madurai, Tamil Nadu",
        timeCommitment: "Flexible",
        skillsRequired: ["Medical Background", "Empathy", "Organization"],
        spotsAvailable: 3,
        totalSpots: 8,
        active: true,
        featured: true,
        icon: "Heart",
        applicationDeadline: "2025-01-30"
      }
    ]
  });

  const handleApplyClick = (opportunity: Opportunity) => {
    if (volunteerData?.sectionSettings?.requireRegistration && !isLoggedIn) {
      setSelectedOpportunity(opportunity);
      setShowLoginPrompt(true);
    } else {
      setSelectedOpportunity(opportunity);
      setShowApplicationForm(true);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const payload = {
        opportunityId: selectedOpportunity._id,
        opportunityTitle: selectedOpportunity.title,
        ...applicationForm,
      };

      const res = await safeFetch("/api/volunteer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setFormSubmitted(true);
        setApplicationForm({
          name: "",
          email: "",
          phone: "",
          message: "",
          experience: "",
          availability: "",
        });
        setTimeout(() => {
          setShowApplicationForm(false);
          setFormSubmitted(false);
          setSelectedOpportunity(null);
        }, 3000);
      } else {
        throw new Error(res.error || "Failed to submit application");
      }
    } catch (err) {
      alert(
        "Error submitting application: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowApplicationForm(false);
    setShowLoginPrompt(false);
    setSelectedOpportunity(null);
    setFormSubmitted(false);
  };

  if (loading) {
    return (
      <div className="mt-12">
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-6 h-6" />
            <p>Error loading volunteer opportunities: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!volunteerData || !volunteerData.sectionSettings?.sectionVisible) {
    return null;
  }

  const { sectionSettings, opportunities } = volunteerData;
  const visibleOpportunities =
    opportunities?.filter((opp) => opp.visible) || [];
  const urgentOpportunities = visibleOpportunities.filter((opp) => opp.urgent);

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="relative h-64 lg:h-auto col-span-1">
            <Image
              src="/images/volunteer/volunteers-group.jpg"
              alt="Volunteer team"
              fill
              style={{ objectFit: "cover" }}
              className="brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                Make an Impact
              </span>
            </div>
            {urgentOpportunities.length > 0 &&
              sectionSettings.highlightUrgent && (
                <div className="absolute top-6 left-6">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    {urgentOpportunities.length} Urgent Need
                    {urgentOpportunities.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
          </div>

          <div className="col-span-2 p-8 lg:p-12">
            <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-4">
              {sectionSettings.sectionTitle}
            </h3>

            <div className="space-y-6 mb-8">
              <p className="text-indigo-100 text-lg leading-relaxed">
                {sectionSettings.sectionSubtitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-orange-400" />
                    Flexible Scheduling
                  </h4>
                  <p className="text-indigo-100">
                    Choose from one-time events, weekly commitments, or remote
                    opportunities that fit your schedule.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Users className="w-6 h-6 mr-3 text-orange-400" />
                    Community Building
                  </h4>
                  <p className="text-indigo-100">
                    Connect with passionate individuals who share your
                    commitment to making a difference.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Briefcase className="w-6 h-6 mr-3 text-orange-400" />
                    Skills Development
                  </h4>
                  <p className="text-indigo-100">
                    Gain valuable experience and develop new skills through
                    meaningful volunteer work.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Heart className="w-6 h-6 mr-3 text-orange-400" />
                    Direct Impact
                  </h4>
                  <p className="text-indigo-100">
                    See firsthand how your contribution transforms lives in our
                    community programs.
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/volunteer"
                className="inline-block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-full hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Become a Volunteer
              </Link>
              <Link
                href="/volunteer"
                className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/30 transition-all duration-300 text-center shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Current Opportunities Section */}
        {visibleOpportunities.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-800/60 to-purple-800/60 backdrop-blur-sm p-8 lg:p-10 border-t border-white/10">
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-400" />
              Current Opportunities
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleOpportunities.slice(0, 6).map((opportunity, index) => {
                // Handle icon mapping more robustly
                let IconComponent = Heart; // Default fallback icon

                if (opportunity.icon) {
                  // Try direct mapping first
                  IconComponent =
                    iconMap[opportunity.icon] ||
                    // Try lowercase version
                    iconMap[opportunity.icon.toLowerCase()] ||
                    // Try with kebab-case
                    iconMap[
                      opportunity.icon
                        .replace(/([A-Z])/g, "-$1")
                        .toLowerCase()
                        .substring(1)
                    ] ||
                    // Default fallback
                    Heart;
                }

                const spotsLeft =
                  opportunity.spotsAvailable - opportunity.currentVolunteers;

                return (
                  <motion.div
                    key={opportunity._id || index}
                    className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 ${
                      opportunity.urgent
                        ? "bg-red-500/20 border-red-400/50 hover:bg-red-500/30"
                        : "bg-white/10 border-white/20 hover:bg-white/15"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {opportunity.urgent && sectionSettings.highlightUrgent && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          URGENT
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`p-3 rounded-full ${
                            opportunity.color || "bg-blue-500/20"
                          }`}
                        >
                          <IconComponent
                            className={`w-6 h-6 ${
                              opportunity.color?.includes("blue")
                                ? "text-blue-300"
                                : opportunity.color?.includes("green")
                                ? "text-green-300"
                                : opportunity.color?.includes("purple")
                                ? "text-purple-300"
                                : "text-blue-300"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white font-semibold text-lg mb-1">
                            {opportunity.title}
                          </h5>
                          <p className="text-indigo-200 text-sm mb-2">
                            {opportunity.category}
                          </p>
                        </div>
                      </div>

                      <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                        {opportunity.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-indigo-300" />
                          <span className="text-indigo-200">
                            {opportunity.timeCommitment}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          {opportunity.remote ? (
                            <>
                              <Wifi className="w-4 h-4 text-indigo-300" />
                              <span className="text-indigo-200">Remote</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 text-indigo-300" />
                              <span className="text-indigo-200">
                                {opportunity.location}
                              </span>
                            </>
                          )}
                        </div>

                        {spotsLeft > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-green-400" />
                            <span className="text-green-300">
                              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""}{" "}
                              available
                            </span>
                          </div>
                        )}

                        {sectionSettings.showSkillsRequired &&
                          opportunity.skillsRequired?.length > 0 && (
                            <div className="mt-3">
                              <p className="text-indigo-300 text-xs mb-1">
                                Skills Required:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {opportunity.skillsRequired
                                  .slice(0, 3)
                                  .map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="bg-blue-500/20 text-blue-200 text-xs px-2 py-1 rounded-full border border-blue-400/30"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {opportunity.skillsRequired.length > 3 && (
                                  <span className="text-indigo-300 text-xs px-2 py-1">
                                    +{opportunity.skillsRequired.length - 3}{" "}
                                    more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                        {sectionSettings.showBenefits &&
                          opportunity.benefits?.length > 0 && (
                            <div className="mt-3">
                              <p className="text-indigo-300 text-xs mb-1">
                                Benefits:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {opportunity.benefits
                                  .slice(0, 2)
                                  .map((benefit, benefitIndex) => (
                                    <span
                                      key={benefitIndex}
                                      className="bg-green-500/20 text-green-200 text-xs px-2 py-1 rounded-full border border-green-400/30"
                                    >
                                      {benefit}
                                    </span>
                                  ))}
                                {opportunity.benefits.length > 2 && (
                                  <span className="text-indigo-300 text-xs px-2 py-1">
                                    +{opportunity.benefits.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {visibleOpportunities.length > 6 && (
              <div className="text-center mt-8">
                <Link
                  href="/volunteer-opportunities"
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-6 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  View All {visibleOpportunities.length} Opportunities
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Registration Required
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  To apply for <strong>{selectedOpportunity?.title}</strong>,
                  you need to be registered and logged in.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg text-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Login to Apply
                </Link>
                <Link
                  href="/register"
                  className="block w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg text-center hover:bg-gray-200 transition-all duration-300"
                >
                  Create New Account
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplicationForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for your interest in{" "}
                    <strong>{selectedOpportunity?.title}</strong>. We'll be in
                    touch soon!
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Apply for Volunteer Position
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {selectedOpportunity?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedOpportunity?.category}
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={applicationForm.name}
                          onChange={(e) =>
                            setApplicationForm({
                              ...applicationForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={applicationForm.email}
                          onChange={(e) =>
                            setApplicationForm({
                              ...applicationForm,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={applicationForm.phone}
                        onChange={(e) =>
                          setApplicationForm({
                            ...applicationForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      <input
                        type="text"
                        value={applicationForm.availability}
                        onChange={(e) =>
                          setApplicationForm({
                            ...applicationForm,
                            availability: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Weekends, Evenings, Flexible"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relevant Experience
                      </label>
                      <textarea
                        value={applicationForm.experience}
                        onChange={(e) =>
                          setApplicationForm({
                            ...applicationForm,
                            experience: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Tell us about any relevant experience or skills..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Why are you interested? *
                      </label>
                      <textarea
                        required
                        value={applicationForm.message}
                        onChange={(e) =>
                          setApplicationForm({
                            ...applicationForm,
                            message: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Tell us why you're interested in this volunteer opportunity..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium px-6 py-3 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formSubmitting
                          ? "Submitting..."
                          : "Submit Application"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VolunteerOpportunities;
