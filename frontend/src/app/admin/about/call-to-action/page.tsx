'use client';
import axios from 'axios'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit,
  Save,
  Eye,
  ArrowLeft,
  Palette,
  Type,
  Link as LinkIcon,
  Settings,
  RotateCcw,
  Plus,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import Link from 'next/link';

interface CTAButton {
  id: string;
  text: string;
  href: string;
  style: 'primary' | 'secondary';
  visible: boolean;
  order: number;
}

interface SectionContent {
  mainTitle: string;
  description: string;
  backgroundType: 'gradient' | 'solid' | 'image';
  gradientFrom: string;
  gradientTo: string;
  solidColor: string;
  backgroundImage?: string;
  textColor: string;
  padding: 'small' | 'medium' | 'large';
}

interface AnimationSettings {
  enabled: boolean;
  titleDelay: number;
  descriptionDelay: number;
  buttonsDelay: number;
  duration: number;
}



export default function CallToActionAdmin() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'buttons' | 'animation'>('content');

  const [sectionContent, setSectionContent] = useState<SectionContent>({
    mainTitle: 'Be Part of Our Story',
    description: 'Together, we can create lasting change. Join us in our mission to build a better world.',
    backgroundType: 'gradient',
    gradientFrom: 'purple-600',
    gradientTo: 'blue-500',
    solidColor: 'purple-600',
    textColor: 'white',
    padding: 'large',
  });

  const [ctaButtons, setCtaButtons] = useState<CTAButton[]>([
    {
      id: 'donate',
      text: 'Donate Now',
      href: '/donate',
      style: 'primary',
      visible: true,
      order: 1,
    },
    {
      id: 'volunteer',
      text: 'Volunteer',
      href: '/get-involved',
      style: 'secondary',
      visible: true,
      order: 2,
    },
  ]);

  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>({
    enabled: true,
    titleDelay: 0,
    descriptionDelay: 0.2,
    buttonsDelay: 0.4,
    duration: 0.6,
  });

  const [imageUploading, setImageUploading] = useState(false);

  const colorOptions = [
    'purple-600', 'blue-500', 'green-500', 'red-500', 'yellow-500', 
    'indigo-600', 'pink-500', 'teal-500', 'orange-500', 'gray-800'
  ];

  const paddingOptions = {
    small: 'py-12',
    medium: 'py-16',
    large: 'py-20',
  };

  useEffect(() => {
  const fetchCTAData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/aboutcta');
      if (res.data) {
        setSectionContent({
          mainTitle: res.data.mainTitle,
          description: res.data.description,
          backgroundType: res.data.backgroundType,
          gradientFrom: res.data.gradientFrom,
          gradientTo: res.data.gradientTo,
          solidColor: res.data.solidColor,
          backgroundImage: res.data.backgroundImage || '',
          textColor: res.data.textColor,
          padding: res.data.padding,
        });
        setCtaButtons(res.data.buttons || []);
        setAnimationSettings(res.data.animation || animationSettings);
      }
    } catch (error) {
      console.error('Failed to fetch CTA data:', error);
    }
  };

  fetchCTAData();
}, []);

  const handleSaveSection = async () => {
  try {
    await axios.post('http://localhost:5000/api/aboutcta', {
      ...sectionContent,
      buttons: ctaButtons,
      animation: animationSettings,
    });
    setIsEditing(false);
    console.log('CTA section saved successfully');
  } catch (error) {
    console.error('Failed to save CTA section:', error);
  }
};

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:5000/api/aboutcta/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.url) {
        setSectionContent({
          ...sectionContent,
          backgroundImage: response.data.url,
        });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSectionContent({
      ...sectionContent,
      backgroundImage: '',
    });
  };

  const handleAddButton = () => {
    const newButton: CTAButton = {
      id: `button-${Date.now()}`,
      text: 'New Button',
      href: '#',
      style: 'secondary',
      visible: true,
      order: ctaButtons.length + 1,
    };
    setCtaButtons([...ctaButtons, newButton]);
  };

  const handleDeleteButton = (id: string) => {
    setCtaButtons(ctaButtons.filter(b => b.id !== id));
  };

  const handleResetToDefault = () => {
    setSectionContent({
      mainTitle: 'Be Part of Our Story',
      description: 'Together, we can create lasting change. Join us in our mission to build a better world.',
      backgroundType: 'gradient',
      gradientFrom: 'purple-600',
      gradientTo: 'blue-500',
      solidColor: 'purple-600',
      textColor: 'white',
      padding: 'large',
    });
    setCtaButtons([
      {
        id: 'donate',
        text: 'Donate Now',
        href: '/donate',
        style: 'primary',
        visible: true,
        order: 1,
      },
      {
        id: 'volunteer',
        text: 'Volunteer',
        href: '/get-involved',
        style: 'secondary',
        visible: true,
        order: 2,
      },
    ]);
  };

  const getBackgroundClass = () => {
    if (sectionContent.backgroundType === 'gradient') {
      return `bg-gradient-to-r from-${sectionContent.gradientFrom} to-${sectionContent.gradientTo}`;
    } else if (sectionContent.backgroundType === 'solid') {
      return `bg-${sectionContent.solidColor}`;
    } else if (sectionContent.backgroundType === 'image' && sectionContent.backgroundImage) {
      return 'bg-cover bg-center bg-no-repeat';
    }
    return 'bg-gray-800';
  };

  const getBackgroundStyle = () => {
    if (sectionContent.backgroundType === 'image' && sectionContent.backgroundImage) {
      return {
        backgroundImage: `url(${sectionContent.backgroundImage})`,
      };
    }
    return {};
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/admin/about">
            <AdminButton variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to About
            </AdminButton>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Call to Action Section</h1>
            <p className="text-gray-600 mt-1">Manage the final conversion section</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <AdminButton variant="outline" onClick={handleResetToDefault}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </AdminButton>
          <AdminButton variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </AdminButton>
          {isEditing ? (
            <AdminButton onClick={handleSaveSection}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </AdminButton>
          ) : (
            <AdminButton onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Section
            </AdminButton>
          )}
        </div>
      </div>

      {/* Preview */}
      <AdminCard className="p-0 overflow-hidden">
        <div 
          className={`${paddingOptions[sectionContent.padding]} ${getBackgroundClass()} text-${sectionContent.textColor} relative`}
          style={getBackgroundStyle()}
        >
          {sectionContent.backgroundType === 'image' && sectionContent.backgroundImage && (
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          )}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {sectionContent.mainTitle}
              </h2>
              <p className="text-xl mb-8">
                {sectionContent.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {ctaButtons
                  .filter(button => button.visible)
                  .sort((a, b) => a.order - b.order)
                  .map((button) => (
                    <a
                      key={button.id}
                      href={button.href}
                      className={`px-8 py-4 font-bold rounded-full text-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                        button.style === 'primary'
                          ? `bg-${sectionContent.textColor} text-${sectionContent.gradientFrom} hover:bg-gray-100`
                          : `bg-transparent border-2 border-${sectionContent.textColor} text-${sectionContent.textColor} hover:bg-white/10`
                      }`}
                    >
                      {button.text}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'content', label: 'Content', icon: Type },
            { id: 'design', label: 'Design', icon: Palette },
            { id: 'buttons', label: 'Buttons', icon: LinkIcon },
            { id: 'animation', label: 'Animation', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Title
              </label>
              <input
                type="text"
                value={sectionContent.mainTitle}
                onChange={(e) => setSectionContent({ ...sectionContent, mainTitle: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={sectionContent.description}
                onChange={(e) => setSectionContent({ ...sectionContent, description: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </AdminCard>
      )}

      {/* Design Tab */}
      {activeTab === 'design' && (
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Type
              </label>
              <div className="flex space-x-4">
                {['gradient', 'solid', 'image'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      value={type}
                      checked={sectionContent.backgroundType === type}
                      onChange={(e) => setSectionContent({ ...sectionContent, backgroundType: e.target.value as any })}
                      disabled={!isEditing}
                      className="mr-2"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {sectionContent.backgroundType === 'gradient' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gradient From
                  </label>
                  <select
                    value={sectionContent.gradientFrom}
                    onChange={(e) => setSectionContent({ ...sectionContent, gradientFrom: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gradient To
                  </label>
                  <select
                    value={sectionContent.gradientTo}
                    onChange={(e) => setSectionContent({ ...sectionContent, gradientTo: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {sectionContent.backgroundType === 'solid' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <select
                  value={sectionContent.solidColor}
                  onChange={(e) => setSectionContent({ ...sectionContent, solidColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}

            {sectionContent.backgroundType === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <div className="space-y-3">
                  {sectionContent.backgroundImage ? (
                    <div className="relative">
                      <img
                        src={sectionContent.backgroundImage}
                        alt="Background"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      {isEditing && (
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No image selected</p>
                      </div>
                    </div>
                  )}
                  
                  {isEditing && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                        className="hidden"
                        id="background-image-upload"
                      />
                      <label
                        htmlFor="background-image-upload"
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                          imageUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {imageUploading ? 'Uploading...' : sectionContent.backgroundImage ? 'Change Image' : 'Upload Image'}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <select
                  value={sectionContent.textColor}
                  onChange={(e) => setSectionContent({ ...sectionContent, textColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="gray-800">Dark Gray</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Padding
                </label>
                <select
                  value={sectionContent.padding}
                  onChange={(e) => setSectionContent({ ...sectionContent, padding: e.target.value as any })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="small">Small (3rem)</option>
                  <option value="medium">Medium (4rem)</option>
                  <option value="large">Large (5rem)</option>
                </select>
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Buttons Tab */}
      {activeTab === 'buttons' && (
        <AdminCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">CTA Buttons</h3>
            {isEditing && (
              <AdminButton size="sm" onClick={handleAddButton}>
                <Plus className="w-4 h-4 mr-2" />
                Add Button
              </AdminButton>
            )}
          </div>
          <div className="space-y-4">
            {ctaButtons.sort((a, b) => a.order - b.order).map((button, index) => (
              <div key={button.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={button.visible}
                      onChange={(e) => setCtaButtons(ctaButtons.map(b => 
                        b.id === button.id ? { ...b, visible: e.target.checked } : b
                      ))}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="font-medium text-gray-900">Button {index + 1}</span>
                  </div>
                  {isEditing && ctaButtons.length > 1 && (
                    <button
                      onClick={() => handleDeleteButton(button.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={button.text}
                      onChange={(e) => setCtaButtons(ctaButtons.map(b => 
                        b.id === button.id ? { ...b, text: e.target.value } : b
                      ))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link URL
                    </label>
                    <input
                      type="text"
                      value={button.href}
                      onChange={(e) => setCtaButtons(ctaButtons.map(b => 
                        b.id === button.id ? { ...b, href: e.target.value } : b
                      ))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Style
                    </label>
                    <select
                      value={button.style}
                      onChange={(e) => setCtaButtons(ctaButtons.map(b => 
                        b.id === button.id ? { ...b, style: e.target.value as 'primary' | 'secondary' } : b
                      ))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="primary">Primary (Filled)</option>
                      <option value="secondary">Secondary (Outline)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Animation Tab */}
      {activeTab === 'animation' && (
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Animation Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="animations-enabled"
                checked={animationSettings.enabled}
                onChange={(e) => setAnimationSettings({ ...animationSettings, enabled: e.target.checked })}
                disabled={!isEditing}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="animations-enabled" className="text-sm font-medium text-gray-700">
                Enable Animations
              </label>
            </div>

            {animationSettings.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Delay (seconds)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={animationSettings.titleDelay}
                    onChange={(e) => setAnimationSettings({ ...animationSettings, titleDelay: parseFloat(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description Delay (seconds)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={animationSettings.descriptionDelay}
                    onChange={(e) => setAnimationSettings({ ...animationSettings, descriptionDelay: parseFloat(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buttons Delay (seconds)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={animationSettings.buttonsDelay}
                    onChange={(e) => setAnimationSettings({ ...animationSettings, buttonsDelay: parseFloat(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Animation Duration (seconds)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="2"
                    value={animationSettings.duration}
                    onChange={(e) => setAnimationSettings({ ...animationSettings, duration: parseFloat(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            )}
          </div>
        </AdminCard>
      )}
    </div>
  );
}