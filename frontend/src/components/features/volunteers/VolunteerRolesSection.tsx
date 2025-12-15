'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

// Define types for volunteer roles
type VolunteerRole = {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  commitment: string;
  skills: string[];
  isActive: boolean;
  applicantsCount: number;
  createdDate: string;
  lastUpdated: string;
};

export default function VolunteerRolesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<VolunteerRole | null>(null);
  const [volunteerRoles, setVolunteerRoles] = useState<VolunteerRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const modalRef = useRef<HTMLDivElement>(null);

  // Default icon mapping for categories with inline SVG fallback
  const defaultIcons: { [key: string]: string } = {
    'Teaching': '/icons/teaching.svg',
    'Medical': '/icons/medical.svg',
    'Fundraising': '/icons/fundraising.svg',
    'Events': '/icons/events.svg',
    'Environment': '/icons/environment.svg',
    'Marketing': '/icons/social-media.svg',
    'Outreach': '/icons/community.svg',
    'Technical': '/icons/technical.svg',
    // Use inline SVG as ultimate fallback to prevent 404 loops
    'default': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PHBhdGggZD0ibTkgMTIgMiAyIDQtNCIvPjwvc3ZnPg=='
  };

  // Fetch volunteer roles from database
  useEffect(() => {
    const fetchVolunteerRoles = async () => {
      try {
        setLoading(true);
        const result = await safeFetch('/api/vrole');
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to fetch volunteer roles');
        }
        
        const data = result.data;
        
        // Filter only active roles and fix problematic icons
        const activeRoles = data
          .filter((role: VolunteerRole) => role.isActive)
          .map((role: VolunteerRole) => ({
            ...role,
            icon: role.icon && 
                  role.icon !== '/icons/default.svg' && 
                  role.icon !== '/icons/volunteer.svg' && // Block volunteer.svg
                  !role.icon.includes('volunteer.svg') // Block any variant of volunteer.svg
              ? role.icon 
              : defaultIcons[role.category] || defaultIcons.default
          }));
        
        setVolunteerRoles(activeRoles);
        setError(null);
      } catch (err) {
        console.error('Error fetching volunteer roles:', err);
        setError(err instanceof Error ? err.message : 'Failed to load volunteer roles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerRoles();
  }, []);

  // Get unique categories for filter
  const categories = ['All', ...Array.from(new Set(volunteerRoles.map(role => role.category)))];

  // Filter roles based on selected category
  const filteredRoles = selectedCategory === 'All' 
    ? volunteerRoles 
    : volunteerRoles.filter(role => role.category === selectedCategory);

  // Handle click outside of modal to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedRole(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle image error with smart fallback to prevent infinite loops
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, originalSrc: string) => {
    const target = e.currentTarget;
    
    // Prevent infinite loops by tracking failed images
    if (failedImages.has(originalSrc)) {
      return; // Already tried to fix this image, don't try again
    }
    
    // Add to failed images set
    setFailedImages(prev => new Set([...prev, originalSrc]));
    
    // Try category-specific icon first, then fallback to default
    const role = volunteerRoles.find(r => r.icon === originalSrc);
    if (role && defaultIcons[role.category] && defaultIcons[role.category] !== originalSrc) {
      target.src = defaultIcons[role.category];
    } else {
      // Use inline SVG as final fallback
      target.src = defaultIcons.default;
    }
  };

  // Get the appropriate icon source for a role
  const getIconSrc = (role: VolunteerRole): string => {
    if (failedImages.has(role.icon)) {
      return defaultIcons[role.category] || defaultIcons.default;
    }
    return role.icon;
  };

  if (loading) {
    return (
      <section id="volunteer-roles" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading volunteer opportunities...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="volunteer-roles" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FetchErrorFallback 
            message={error} 
            onRetry={() => window.location.reload()} 
            showRetry={true} 
          />
        </div>
      </section>
    );
  }

  return (
    <section id="volunteer-roles" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Find Your Perfect Role</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the volunteer opportunity that matches your skills, interests, and availability
          </p>
        </motion.div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        )}

        {/* No roles message */}
        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No volunteer roles available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later for new opportunities.</p>
          </div>
        )}

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRoles.map((role) => (
            <motion.div
              key={role._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md group cursor-pointer"
              onClick={() => setSelectedRole(role)}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                  <Image 
                    src={getIconSrc(role)} 
                    alt={role.title} 
                    width={32} 
                    height={32}
                    className="text-purple-600"
                    onError={(e) => handleImageError(e, role.icon)}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  {role.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  {role.description.length > 100 
                    ? `${role.description.substring(0, 100)}...` 
                    : role.description
                  }
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-sm font-medium text-purple-600">{role.category}</span>
                  <span className="text-sm text-gray-500">{role.commitment || 'Flexible'}</span>
                </div>
                {role.applicantsCount > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {role.applicantsCount} applicant{role.applicantsCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Role Detail Modal */}
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Image 
                        src={getIconSrc(selectedRole)} 
                        alt={selectedRole.title} 
                        width={24} 
                        height={24}
                        onError={(e) => handleImageError(e, selectedRole.icon)}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedRole.title}</h3>
                      <span className="text-sm font-medium text-purple-600">{selectedRole.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedRole.description}</p>
                </div>

                {selectedRole.commitment && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Time Commitment</h4>
                    <p className="text-gray-600">{selectedRole.commitment}</p>
                  </div>
                )}

                {selectedRole.skills && selectedRole.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.skills.map((skill, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRole.applicantsCount > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Interest Level</h4>
                    <p className="text-gray-600">
                      {selectedRole.applicantsCount} volunteer{selectedRole.applicantsCount !== 1 ? 's have' : ' has'} already applied for this role
                    </p>
                  </div>
                )}

                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-md"
                    onClick={() => {
                      setSelectedRole(null);
                      // Scroll to signup form
                      document.getElementById('volunteer-signup')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}