'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  X,
  Upload,
  Star,
  User,
  MapPin,
  Calendar,
  Quote,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminImageUpload from '@/components/admin/ui/AdminImageUpload';

interface TestimonialFormProps {
  testimonial?: {
    id?: string;
    name: string;
    role: string;
    organization?: string;
    location: string;
    content: string;
    rating: number;
    image?: string;
    featured: boolean;
    published: boolean;
    category: string;
    dateReceived: string;
    emailConsent: boolean;
    videoUrl?: string;
  };
  onSave: (testimonial: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TestimonialForm({ 
  testimonial, 
  onSave, 
  onCancel, 
  isLoading = false 
}: TestimonialFormProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    organization: '',
    location: '',
    content: '',
    rating: 5,
    image: '',
    featured: false,
    published: true,
    category: 'general',
    dateReceived: new Date().toISOString().split('T')[0],
    emailConsent: false,
    videoUrl: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    if (testimonial) {
      setFormData({
        ...testimonial,
        dateReceived: testimonial.dateReceived || new Date().toISOString().split('T')[0]
      });
      setImagePreview(testimonial.image || '');
    }
  }, [testimonial]);

  const testimonialCategories = [
    { value: 'general', label: 'General Support' },
    { value: 'education', label: 'Education Programs' },
    { value: 'healthcare', label: 'Healthcare Services' },
    { value: 'water', label: 'Clean Water Initiative' },
    { value: 'food', label: 'Food Distribution' },
    { value: 'volunteer', label: 'Volunteer Experience' },
    { value: 'donor', label: 'Donor Experience' },
    { value: 'events', label: 'Events & Activities' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Testimonial content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Testimonial should be at least 50 characters long';
    } else if (formData.content.length > 1000) {
      newErrors.content = 'Testimonial should not exceed 1000 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid video URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setImagePreview(imageUrl);
    handleInputChange('image', imageUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleInputChange('rating', star)}
            className={`p-1 transition-colors ${
              star <= formData.rating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {formData.rating}/5 stars
        </span>
      </div>
    );
  };

  const renderPreview = () => (
    <AdminCard>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Testimonial Preview
        </h3>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            {(imagePreview || formData.image) && (
              <img
                src={imagePreview || formData.image}
                alt={formData.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
            )}
            <div className="flex-1">
              <Quote className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{formData.content}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formData.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.role}
                    {formData.organization && `, ${formData.organization}`}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {formData.location}
                  </p>
                </div>
                <div className="flex items-center">
                  {[...Array(formData.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminCard>
  );

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {testimonial?.id ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {testimonial?.id ? 'Update testimonial details' : 'Create a new testimonial entry'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <AdminButton
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center"
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AdminCard>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput
                  label="Full Name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(value) => handleInputChange('name', value)}
                  error={errors.name}
                  required
                />
                
                <AdminInput
                  label="Role/Title"
                  placeholder="e.g., Beneficiary, Volunteer, Donor"
                  value={formData.role}
                  onChange={(value) => handleInputChange('role', value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <AdminInput
                  label="Organization (Optional)"
                  placeholder="Company or organization name"
                  value={formData.organization}
                  onChange={(value) => handleInputChange('organization', value)}
                />
                
                <AdminInput
                  label="Location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  error={errors.location}
                  icon={MapPin}
                  required
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Quote className="w-5 h-5 mr-2" />
                Testimonial Content
              </h3>
              
              <AdminTextarea
                label="Testimonial Content"
                placeholder="Share your experience with our organization..."
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
                error={errors.content}
                required
                rows={6}
                maxLength={1000}
                showCount
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                {renderRatingStars()}
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.rating}
                  </p>
                )}
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Media & Additional Info
              </h3>
              
              <div className="space-y-4">
                <AdminImageUpload
                  label="Profile Photo (Optional)"
                  onUpload={handleImageUpload}
                  currentImage={imagePreview}
                  acceptedFormats={['jpg', 'jpeg', 'png', 'webp']}
                  maxSize={5}
                />

                <AdminInput
                  label="Video URL (Optional)"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(value) => handleInputChange('videoUrl', value)}
                  error={errors.videoUrl}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminSelect
                    label="Category"
                    value={formData.category}
                    onChange={(value) => handleInputChange('category', value)}
                    options={testimonialCategories}
                  />
                  
                  <AdminInput
                    type="date"
                    label="Date Received"
                    value={formData.dateReceived}
                    onChange={(value) => handleInputChange('dateReceived', value)}
                    icon={Calendar}
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Settings & Permissions
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Featured Testimonial
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Display prominently on homepage
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Published
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Make visible on website
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.published}
                      onChange={(e) => handleInputChange('published', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Email Consent
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Permission to use testimonial in emails
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.emailConsent}
                      onChange={(e) => handleInputChange('emailConsent', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <AdminButton
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {testimonial?.id ? 'Update Testimonial' : 'Create Testimonial'}
                </>
              )}
            </AdminButton>
          </div>
        </form>

        {/* Preview Panel */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:sticky lg:top-6"
          >
            {renderPreview()}
          </motion.div>
        )}
      </div>
    </div>
  );
}