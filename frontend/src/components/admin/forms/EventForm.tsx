'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Save,
  Eye,
  AlertCircle,
  X,
  Plus
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminImageUpload from '@/components/admin/ui/AdminImageUpload';
import AdminDatePicker from '@/components/admin/ui/AdminDatePicker';
import AdminRichEditor from '@/components/admin/ui/AdminRichEditor';
import AdminButton from '@/components/admin/ui/AdminButton';

interface EventFormData {
  id?: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  address: string;
  maxAttendees: number;
  registrationFee: number;
  category: string;
  status: 'draft' | 'published' | 'cancelled';
  featured: boolean;
  image: string;
  gallery: string[];
  tags: string[];
  requirements: string[];
  organizer: string;
  contactEmail: string;
  contactPhone: string;
  registrationDeadline: string;
  refundPolicy: string;
  additionalInfo: string;
}

interface EventFormProps {
  eventData?: EventFormData;
  isEditing?: boolean;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({ eventData, isEditing = false, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    shortDescription: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    address: '',
    maxAttendees: 0,
    registrationFee: 0,
    category: '',
    status: 'draft',
    featured: false,
    image: '',
    gallery: [],
    tags: [],
    requirements: [],
    organizer: '',
    contactEmail: '',
    contactPhone: '',
    registrationDeadline: '',
    refundPolicy: '',
    additionalInfo: '',
    ...eventData
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  const eventCategories = [
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'awareness', label: 'Awareness Campaign' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'environment', label: 'Environment' },
    { value: 'community', label: 'Community Service' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'workshop', label: 'Workshop/Training' },
    { value: 'conference', label: 'Conference' },
    { value: 'social', label: 'Social Event' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Start time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Date validation
    if (formData.date && new Date(formData.date) < new Date()) {
      newErrors.date = 'Event date cannot be in the past';
    }

    // Registration deadline validation
    if (formData.registrationDeadline && formData.date) {
      if (new Date(formData.registrationDeadline) >= new Date(formData.date)) {
        newErrors.registrationDeadline = 'Registration deadline must be before event date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Add requirement
  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  // Remove requirement
  const removeRequirement = (requirementToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== requirementToRemove)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Update event details and settings' : 'Add a new event to your calendar'}
          </p>
        </div>
        <div className="flex space-x-3">
          <AdminButton
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            icon={Eye}
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </AdminButton>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <AdminCard title="Basic Information" icon={Calendar}>
              <div className="space-y-4">
                <AdminInput
                  label="Event Title"
                  value={formData.title}
                  onChange={(value) => handleInputChange('title', value)}
                  error={errors.title}
                  placeholder="Enter event title"
                  required
                />

                <AdminTextarea
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={(value) => handleInputChange('shortDescription', value)}
                  error={errors.shortDescription}
                  placeholder="Brief description for event cards and previews"
                  rows={2}
                  required
                />

                <AdminRichEditor
                  label="Full Description"
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  error={errors.description}
                  placeholder="Detailed event description with formatting"
                  required
                />
              </div>
            </AdminCard>

            {/* Date & Time */}
            <AdminCard title="Date & Time" icon={Clock}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminDatePicker
                  label="Event Date"
                  value={formData.date}
                  onChange={(value) => handleInputChange('date', value)}
                  error={errors.date}
                  required
                />

                <AdminInput
                  type="time"
                  label="Start Time"
                  value={formData.time}
                  onChange={(value) => handleInputChange('time', value)}
                  error={errors.time}
                  required
                />

                <AdminInput
                  type="time"
                  label="End Time"
                  value={formData.endTime}
                  onChange={(value) => handleInputChange('endTime', value)}
                  error={errors.endTime}
                />

                <AdminDatePicker
                  label="Registration Deadline"
                  value={formData.registrationDeadline}
                  onChange={(value) => handleInputChange('registrationDeadline', value)}
                  error={errors.registrationDeadline}
                />
              </div>
            </AdminCard>

            {/* Location */}
            <AdminCard title="Location Details" icon={MapPin}>
              <div className="space-y-4">
                <AdminInput
                  label="Venue Name"
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  error={errors.location}
                  placeholder="e.g., Grand Ballroom, Community Center"
                  required
                />

                <AdminTextarea
                  label="Full Address"
                  value={formData.address}
                  onChange={(value) => handleInputChange('address', value)}
                  error={errors.address}
                  placeholder="Complete address with directions if needed"
                  rows={3}
                />
              </div>
            </AdminCard>

            {/* Registration & Pricing */}
            <AdminCard title="Registration & Pricing" icon={Users}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput
                  type="number"
                  label="Maximum Attendees"
                  value={formData.maxAttendees}
                  onChange={(value) => handleInputChange('maxAttendees', parseInt(value) || 0)}
                  error={errors.maxAttendees}
                  placeholder="0 for unlimited"
                  min="0"
                />

                <AdminInput
                  type="number"
                  label="Registration Fee ($)"
                  value={formData.registrationFee}
                  onChange={(value) => handleInputChange('registrationFee', parseFloat(value) || 0)}
                  error={errors.registrationFee}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <AdminTextarea
                label="Refund Policy"
                value={formData.refundPolicy}
                onChange={(value) => handleInputChange('refundPolicy', value)}
                error={errors.refundPolicy}
                placeholder="Describe your refund policy for this event"
                rows={3}
              />
            </AdminCard>

            {/* Tags */}
            <AdminCard title="Tags" icon={Tag}>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <AdminInput
                    value={newTag}
                    onChange={setNewTag}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <AdminButton
                    type="button"
                    onClick={addTag}
                    icon={Plus}
                    disabled={!newTag.trim()}
                  >
                    Add
                  </AdminButton>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </AdminCard>

            {/* Requirements */}
            <AdminCard title="Requirements & Prerequisites">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <AdminInput
                    value={newRequirement}
                    onChange={setNewRequirement}
                    placeholder="Add a requirement"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <AdminButton
                    type="button"
                    onClick={addRequirement}
                    icon={Plus}
                    disabled={!newRequirement.trim()}
                  >
                    Add
                  </AdminButton>
                </div>

                {formData.requirements.length > 0 && (
                  <ul className="space-y-2">
                    {formData.requirements.map((requirement, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {requirement}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(requirement)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </AdminCard>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <AdminCard title="Publish Settings">
              <div className="space-y-4">
                <AdminSelect
                  label="Status"
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  options={statusOptions}
                  error={errors.status}
                />

                <AdminSelect
                  label="Category"
                  value={formData.category}
                  onChange={(value) => handleInputChange('category', value)}
                  options={eventCategories}
                  error={errors.category}
                  required
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Featured Event
                  </label>
                </div>
              </div>
            </AdminCard>

            {/* Organizer Information */}
            <AdminCard title="Organizer Information">
              <div className="space-y-4">
                <AdminInput
                  label="Organizer Name"
                  value={formData.organizer}
                  onChange={(value) => handleInputChange('organizer', value)}
                  error={errors.organizer}
                  placeholder="Event organizer or team"
                  required
                />

                <AdminInput
                  type="email"
                  label="Contact Email"
                  value={formData.contactEmail}
                  onChange={(value) => handleInputChange('contactEmail', value)}
                  error={errors.contactEmail}
                  placeholder="contact@example.com"
                  required
                />

                <AdminInput
                  type="tel"
                  label="Contact Phone"
                  value={formData.contactPhone}
                  onChange={(value) => handleInputChange('contactPhone', value)}
                  error={errors.contactPhone}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </AdminCard>

            {/* Event Image */}
            <AdminCard title="Event Image" icon={ImageIcon}>
              <AdminImageUpload
                value={formData.image}
                onChange={(value) => handleInputChange('image', value)}
                error={errors.image}
                aspectRatio="16:9"
                helperText="Recommended size: 1200x675px"
              />
            </AdminCard>

            {/* Additional Information */}
            <AdminCard title="Additional Information">
              <AdminTextarea
                label="Additional Info"
                value={formData.additionalInfo}
                onChange={(value) => handleInputChange('additionalInfo', value)}
                error={errors.additionalInfo}
                placeholder="Any other important details"
                rows={4}
              />
            </AdminCard>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            {Object.keys(errors).length > 0 && (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} above
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <AdminButton
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </AdminButton>
            
            <AdminButton
              type="submit"
              loading={isSubmitting}
              icon={Save}
            >
              {isEditing ? 'Update Event' : 'Create Event'}
            </AdminButton>
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Event Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Preview Content */}
              <div className="space-y-4">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.title || 'Event Title'}
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {formData.shortDescription || 'Short description will appear here'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Date:</strong> {formData.date || 'Not set'}
                  </div>
                  <div>
                    <strong>Time:</strong> {formData.time || 'Not set'}
                  </div>
                  <div>
                    <strong>Location:</strong> {formData.location || 'Not set'}
                  </div>
                  <div>
                    <strong>Fee:</strong> ${formData.registrationFee || '0.00'}
                  </div>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}