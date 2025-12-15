'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, Upload, Video, Image, Type, MousePointer } from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminImageUpload from '@/components/admin/ui/AdminImageUpload';

export default function HeroSectionManagement() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Transform Lives Through Compassion',
    subtitle: 'Join our mission to create lasting change in communities worldwide',
    primaryButtonText: 'Donate Now',
    primaryButtonLink: '/donate',
    secondaryButtonText: 'Learn More',
    secondaryButtonLink: '/about',
    backgroundType: 'video',
    backgroundVideo: '/videos/hero-background.mp4',
    backgroundImage: '',
    overlayOpacity: 0.4,
    textAlignment: 'left',
    showScrollIndicator: true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save functionality here
    console.log('Saving hero section:', formData);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hero Section Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize your homepage hero section content and appearance
          </p>
        </div>
        <div className="flex space-x-3">
          <AdminButton variant="secondary" icon={Eye}>
            Preview
          </AdminButton>
          <AdminButton onClick={handleSave} icon={Save}>
            Save Changes
          </AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Text Content */}
          <AdminCard>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Type className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Text Content
                </h3>
              </div>
              
              <div className="space-y-4">
                <AdminInput
                  label="Main Title"
                  value={formData.title}
                  onChange={(value) => handleInputChange('title', value)}
                  placeholder="Enter hero title"
                />
                
                <AdminTextarea
                  label="Subtitle"
                  value={formData.subtitle}
                  onChange={(value) => handleInputChange('subtitle', value)}
                  placeholder="Enter hero subtitle"
                  rows={3}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminInput
                    label="Primary Button Text"
                    value={formData.primaryButtonText}
                    onChange={(value) => handleInputChange('primaryButtonText', value)}
                    placeholder="e.g., Donate Now"
                  />
                  <AdminInput
                    label="Primary Button Link"
                    value={formData.primaryButtonLink}
                    onChange={(value) => handleInputChange('primaryButtonLink', value)}
                    placeholder="e.g., /donate"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminInput
                    label="Secondary Button Text"
                    value={formData.secondaryButtonText}
                    onChange={(value) => handleInputChange('secondaryButtonText', value)}
                    placeholder="e.g., Learn More"
                  />
                  <AdminInput
                    label="Secondary Button Link"
                    value={formData.secondaryButtonLink}
                    onChange={(value) => handleInputChange('secondaryButtonLink', value)}
                    placeholder="e.g., /about"
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Background Settings */}
          <AdminCard>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Video className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Background Settings
                </h3>
              </div>
              
              <div className="space-y-4">
                <AdminSelect
                  label="Background Type"
                  value={formData.backgroundType}
                  onChange={(value) => handleInputChange('backgroundType', value)}
                  options={[
                    { value: 'video', label: 'Video Background' },
                    { value: 'image', label: 'Image Background' },
                    { value: 'gradient', label: 'Gradient Background' }
                  ]}
                />
                
                {formData.backgroundType === 'video' && (
                  <AdminInput
                    label="Background Video URL"
                    value={formData.backgroundVideo}
                    onChange={(value) => handleInputChange('backgroundVideo', value)}
                    placeholder="Enter video URL or upload path"
                  />
                )}
                
                {formData.backgroundType === 'image' && (
                  <AdminImageUpload
                    label="Background Image"
                    value={formData.backgroundImage}
                    onChange={(value) => handleInputChange('backgroundImage', value)}
                  />
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Overlay Opacity: {Math.round(formData.overlayOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.overlayOpacity}
                    onChange={(e) => handleInputChange('overlayOpacity', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Layout Settings */}
          <AdminCard>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <MousePointer className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Layout Settings
                </h3>
              </div>
              
              <div className="space-y-4">
                <AdminSelect
                  label="Text Alignment"
                  value={formData.textAlignment}
                  onChange={(value) => handleInputChange('textAlignment', value)}
                  options={[
                    { value: 'left', label: 'Left Aligned' },
                    { value: 'center', label: 'Center Aligned' },
                    { value: 'right', label: 'Right Aligned' }
                  ]}
                />
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="scrollIndicator"
                    checked={formData.showScrollIndicator}
                    onChange={(e) => handleInputChange('showScrollIndicator', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="scrollIndicator" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show scroll indicator
                  </label>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <AdminCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Live Preview
              </h3>
              
              {/* Preview Container */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {/* Background Overlay */}
                <div 
                  className="absolute inset-0 bg-black" 
                  style={{ opacity: formData.overlayOpacity }}
                />
                
                {/* Content Preview */}
                <div className={`relative z-10 h-full flex flex-col justify-center p-6 ${
                  formData.textAlignment === 'center' ? 'text-center items-center' :
                  formData.textAlignment === 'right' ? 'text-right items-end' :
                  'text-left items-start'
                }`}>
                  <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {formData.title}
                  </h1>
                  <p className="text-gray-200 text-sm mb-4 opacity-90">
                    {formData.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                      {formData.primaryButtonText}
                    </button>
                    <button className="border border-white text-white px-4 py-2 rounded text-sm font-medium">
                      {formData.secondaryButtonText}
                    </button>
                  </div>
                </div>
                
                {/* Scroll Indicator */}
                {formData.showScrollIndicator && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                      <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Preview Info */}
              <div className="mt-4 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Background:</span>
                  <span className="capitalize">{formData.backgroundType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Text Alignment:</span>
                  <span className="capitalize">{formData.textAlignment}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overlay:</span>
                  <span>{Math.round(formData.overlayOpacity * 100)}%</span>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Quick Actions */}
          <AdminCard className="mt-6">
            <div className="p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Upload New Video
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Choose from Gallery
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Reset to Default
                </button>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}