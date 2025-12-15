'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Plus,
  Trash2,
  Upload
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminImageUpload from '@/components/admin/ui/AdminImageUpload';

interface SocialLink {
  platform: string;
  url: string;
}

interface Achievement {
  title: string;
  year: string;
  description: string;
}

interface TeamMember {
  id?: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  profileImage: string;
  location: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'alumni';
  isLeadership: boolean;
  displayOrder: number;
  socialLinks: SocialLink[];
  achievements: Achievement[];
  skills: string[];
  languages: string[];
}

interface TeamMemberFormProps {
  initialData?: TeamMember;
  onSubmit: (data: TeamMember) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TeamMemberForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: TeamMemberFormProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<TeamMember>({
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    bio: '',
    profileImage: '',
    location: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    isLeadership: false,
    displayOrder: 1,
    socialLinks: [],
    achievements: [],
    skills: [],
    languages: [],
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  const departments = [
    { value: 'leadership', label: 'Leadership' },
    { value: 'operations', label: 'Operations' },
    { value: 'programs', label: 'Programs' },
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'communications', label: 'Communications' },
    { value: 'finance', label: 'Finance' },
    { value: 'volunteers', label: 'Volunteer Coordination' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'community', label: 'Community Outreach' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'alumni', label: 'Alumni' }
  ];

  const socialPlatforms = [
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'website', label: 'Personal Website', icon: Globe }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (field: keyof TeamMember, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayAdd = (field: 'skills' | 'languages', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      if (field === 'skills') setSkillInput('');
      if (field === 'languages') setLanguageInput('');
    }
  };

  const handleArrayRemove = (field: 'skills' | 'languages', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }));
  };

  const handleSocialLinkAdd = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'linkedin', url: '' }]
    }));
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const handleSocialLinkRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleAchievementAdd = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { title: '', year: '', description: '' }]
    }));
  };

  const handleAchievementChange = (index: number, field: keyof Achievement, value: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => 
        i === index ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const handleAchievementRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Team Member' : 'Add New Team Member'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {initialData ? 'Update team member information and profile' : 'Add a new member to your team'}
          </p>
        </div>
        <AdminButton
          variant="secondary"
          onClick={onCancel}
          icon={X}
        >
          Cancel
        </AdminButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <AdminCard title="Personal Information" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange('firstName', value)}
                  placeholder="Enter first name"
                  required
                  error={errors.firstName}
                />

                <AdminInput
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange('lastName', value)}
                  placeholder="Enter last name"
                  required
                  error={errors.lastName}
                />

                <AdminInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  placeholder="Enter email address"
                  required
                  error={errors.email}
                />

                <AdminInput
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  placeholder="Enter phone number"
                />

                <AdminInput
                  label="Location"
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  placeholder="City, Country"
                />

                <AdminInput
                  label="Join Date"
                  type="date"
                  value={formData.joinDate}
                  onChange={(value) => handleInputChange('joinDate', value)}
                  required
                />
              </div>
            </AdminCard>

            {/* Professional Information */}
            <AdminCard title="Professional Information" icon={Briefcase}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminInput
                    label="Position"
                    value={formData.position}
                    onChange={(value) => handleInputChange('position', value)}
                    placeholder="Job title or role"
                    required
                    error={errors.position}
                  />

                  <AdminSelect
                    label="Department"
                    value={formData.department}
                    onChange={(value) => handleInputChange('department', value)}
                    options={departments}
                    required
                    error={errors.department}
                  />
                </div>

                <AdminTextarea
                  label="Bio"
                  value={formData.bio}
                  onChange={(value) => handleInputChange('bio', value)}
                  placeholder="Brief description about the team member"
                  rows={4}
                  required
                  error={errors.bio}
                  helperText={`${formData.bio.length}/500 characters`}
                />
              </div>
            </AdminCard>

            {/* Skills & Languages */}
            <AdminCard title="Skills & Languages" icon={Award}>
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleArrayAdd('skills', skillInput);
                        }
                      }}
                      placeholder="Add skill"
                      className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayAdd('skills', skillInput)}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleArrayRemove('skills', skill)}
                          className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Languages
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleArrayAdd('languages', languageInput);
                        }
                      }}
                      placeholder="Add language"
                      className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayAdd('languages', languageInput)}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((language, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => handleArrayRemove('languages', language)}
                          className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Achievements */}
            <AdminCard title="Achievements" icon={Award}>
              <div className="space-y-4">
                {formData.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Achievement #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleAchievementRemove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={achievement.title}
                          onChange={(e) => handleAchievementChange(index, 'title', e.target.value)}
                          placeholder="Achievement title"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={achievement.year}
                          onChange={(e) => handleAchievementChange(index, 'year', e.target.value)}
                          placeholder="Year"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <textarea
                        value={achievement.description}
                        onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                        placeholder="Achievement description"
                        rows={2}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                      />
                    </div>
                  </motion.div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAchievementAdd}
                  className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                >
                  <Plus className="w-5 h-5 mx-auto mb-1" />
                  Add Achievement
                </button>
              </div>
            </AdminCard>

            {/* Social Links */}
            <AdminCard title="Social Links" icon={Globe}>
              <div className="space-y-4">
                {formData.socialLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                  >
                    <select
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    >
                      {socialPlatforms.map(platform => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      placeholder="Enter URL"
                      className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleSocialLinkRemove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
                
                <button
                  type="button"
                  onClick={handleSocialLinkAdd}
                  className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                >
                  <Plus className="w-5 h-5 mx-auto mb-1" />
                  Add Social Link
                </button>
              </div>
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Photo */}
            <AdminCard title="Profile Photo" icon={Upload}>
              <AdminImageUpload
                value={formData.profileImage}
                onChange={(value) => handleInputChange('profileImage', value)}
                label="Upload profile photo"
                accept="image/*"
              />
            </AdminCard>

            {/* Status & Settings */}
            <AdminCard title="Status & Settings" icon={User}>
              <div className="space-y-4">
                <AdminSelect
                  label="Status"
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  options={statusOptions}
                  required
                />

                <AdminInput
                  label="Display Order"
                  type="number"
                  value={formData.displayOrder.toString()}
                  onChange={(value) => handleInputChange('displayOrder', parseInt(value) || 1)}
                  min="1"
                  helperText="Order in which this member appears on the team page"
                />

                <div className="flex items-center">
                  <input
                    id="isLeadership"
                    type="checkbox"
                    checked={formData.isLeadership}
                    onChange={(e) => handleInputChange('isLeadership', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="isLeadership" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Leadership Team Member
                  </label>
                </div>
              </div>
            </AdminCard>

            {/* Quick Info */}
            <AdminCard title="Quick Info">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Full Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Department:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {departments.find(d => d.value === formData.department)?.label || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Skills:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.skills.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Social Links:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.socialLinks.length}
                  </span>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <AdminButton
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </AdminButton>
          <AdminButton
            type="submit"
            isLoading={isLoading}
            icon={Save}
          >
            {initialData ? 'Update Team Member' : 'Add Team Member'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}