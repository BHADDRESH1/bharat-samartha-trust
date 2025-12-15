'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Plus,
  Edit,
  Eye,
  Save,
  RotateCcw,
  Image as ImageIcon,
  DollarSign,
  Users,
  Calendar,
  Star,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';

import { safeFetch } from '@/lib/fetchUtils';

export default function FeaturedCausesManagement() {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [sectionData, setSectionData] = useState({
    title: "Current Causes",
    subtitle: "These are the initiatives that need your support right now. Every contribution makes a difference.",
    description: "These causes need immediate attention and support. Every contribution helps us reach our goals and create meaningful impact in communities worldwide.",
    maxDisplayed: 3,
    causes: [
      {
        id: 1,
        title: 'Clean Water Initiative',
        description: 'Providing clean water access to remote villages in developing countries through sustainable infrastructure projects.',
        image: '/images/causes/water.jpg',
        raised: 15000,
        goal: 25000,
        donors: 123,
        category: 'Infrastructure',
        featured: true,
        priority: 1,
        endDate: '2025-08-15',
        status: 'active',
        tags: ['Water', 'Infrastructure', 'Urgent']
      },
      {
        id: 2,
        title: 'Education for All',
        description: 'Supporting underprivileged children with quality education, school supplies, and learning resources.',
        image: '/images/causes/education.jpg',
        raised: 28000,
        goal: 50000,
        donors: 245,
        category: 'Education',
        featured: true,
        priority: 2,
        endDate: '2025-07-30',
        status: 'active',
        tags: ['Education', 'Children', 'Development']
      },
      {
        id: 3,
        title: 'Healthcare Access',
        description: 'Mobile medical camps providing essential healthcare services to rural and underserved communities.',
        image: '/images/causes/healthcare.jpg',
        raised: 12000,
        goal: 30000,
        donors: 98,
        category: 'Healthcare',
        featured: true,
        priority: 3,
        endDate: '2025-09-01',
        status: 'active',
        tags: ['Healthcare', 'Medical', 'Rural']
      },
      {
        id: 4,
        title: 'Emergency Food Relief',
        description: 'Providing emergency food packages to families affected by natural disasters and economic hardship.',
        image: '/images/causes/food-relief.jpg',
        raised: 8500,
        goal: 20000,
        donors: 76,
        category: 'Emergency',
        featured: false,
        priority: 4,
        endDate: '2025-06-30',
        status: 'active',
        tags: ['Food', 'Emergency', 'Relief']
      }
    ]
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await safeFetch('/api/causes');
      if (res.success && res.data) {
        setSectionData(res.data as any);
      } else {
        console.error('Invalid data format from API', res.error);
      }
    } catch (error) {
      console.error('Failed to fetch featured causes:', error);
    } finally {
      setMounted(true);
    }
  };

  fetchData();
}, []);



  const handleSectionChange = (field: string, value: any) => {
    setSectionData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };
  
 const handleImageUpload = async (causeId: number, event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await safeFetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (res.success && res.data && (res.data as any).url) {
      handleCauseChange(causeId, 'image', (res.data as any).url);
    } else {
      console.error('Image upload failed:', res.error || res.data);
    }
  } catch (error) {
    console.error('Image upload error:', error);
  }
};



  const handleCauseChange = (causeId: number, field: string, value: any) => {
    setSectionData(prev => ({
      ...prev,
      causes: prev.causes.map(cause => 
        cause.id === causeId ? { ...cause, [field]: value } : cause
      )
    }));
    setHasChanges(true);
  };

  const addNewCause = () => {
    const newCause = {
      id: Math.max(...sectionData.causes.map(c => c.id)) + 1,
      title: 'New Cause',
      description: 'Description for the new cause',
      image: '/images/causes/placeholder.jpg',
      raised: 0,
      goal: 10000,
      donors: 0,
      category: 'General',
      featured: false,
      priority: sectionData.causes.length + 1,
      endDate: '2025-12-31',
      status: 'active',
      tags: ['New']
    };
    setSectionData(prev => ({
      ...prev,
      causes: [...prev.causes, newCause]
    }));
    setHasChanges(true);
  };

  const deleteCause = (causeId: number) => {
    setSectionData(prev => ({
      ...prev,
      causes: prev.causes.filter(cause => cause.id !== causeId)
    }));
    setHasChanges(true);
  };

  const moveCausePriority = (causeId: number, direction: 'up' | 'down') => {
    const currentCause = sectionData.causes.find(c => c.id === causeId);
    if (!currentCause) return;

    const targetPriority = direction === 'up' ? currentCause.priority - 1 : currentCause.priority + 1;
    const targetCause = sectionData.causes.find(c => c.priority === targetPriority);
    
    if (targetCause) {
      setSectionData(prev => ({
        ...prev,
        causes: prev.causes.map(cause => {
          if (cause.id === causeId) return { ...cause, priority: targetPriority };
          if (cause.id === targetCause.id) return { ...cause, priority: currentCause.priority };
          return cause;
        })
      }));
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
  console.log('Saving section data:', sectionData);

  try {
    const res = await safeFetch('/api/causes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sectionData),
    });

    if (res.success) {
      console.log('Save successful');
      setHasChanges(false);
      setIsEditing(false);
    } else {
      console.error('Failed to save featured causes', res.error);
    }
  } catch (error) {
    console.error('Save error:', error);
  }
};



  const handleReset = () => {
    setHasChanges(false);
    setIsEditing(false);
  };

  const featuredCauses = sectionData.causes.filter(cause => cause.featured).sort((a, b) => a.priority - b.priority);
  const totalRaised = sectionData.causes.reduce((sum, cause) => sum + cause.raised, 0);
  const totalGoal = sectionData.causes.reduce((sum, cause) => sum + cause.goal, 0);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Current Causes Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage current causes displayed on your homepage
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview Section
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Stop Editing' : 'Edit Section'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{sectionData.causes.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Causes</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{featuredCauses.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Featured Causes</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">${totalRaised.toLocaleString()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Raised</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round((totalRaised / totalGoal) * 100)}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Average Progress</div>
          </div>
        </AdminCard>
      </div>

      {/* Save/Reset Bar */}
      {isEditing && hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
              You have unsaved changes
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section Settings */}
      <AdminCard title="Section Settings">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={sectionData.title}
                onChange={(e) => handleSectionChange('title', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subtitle
              </label>
              <textarea
                value={sectionData.subtitle}
                onChange={(e) => handleSectionChange('subtitle', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Causes Displayed
              </label>
              <select
                value={sectionData.maxDisplayed}
                onChange={(e) => handleSectionChange('maxDisplayed', parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value={2}>2 Causes</option>
                <option value={3}>3 Causes</option>
                <option value={4}>4 Causes</option>
                <option value={6}>6 Causes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={sectionData.description}
              onChange={(e) => handleSectionChange('description', e.target.value)}
              disabled={!isEditing}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
          </div>
        </div>
      </AdminCard>

      {/* Causes Management */}
      <AdminCard 
        title="Causes Management"
        action={
          isEditing ? (
            <button
              onClick={addNewCause}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Cause
            </button>
          ) : null
        }
      >
        <div className="space-y-6">
          {sectionData.causes.sort((a, b) => a.priority - b.priority).map((cause) => (
            <motion.div
              key={cause.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Cause Image & Basic Info */}
                <div className="space-y-4">
  <div className="relative group">
    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      {cause.image && cause.image !== '/images/causes/placeholder.jpg' ? (
        <img 
          src={cause.image} 
          alt={cause.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      {/* Image Upload Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <label className="cursor-pointer bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <ImageIcon className="w-4 h-4" />
              <span>Change Image</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(cause.id, e)}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
    
    {/* Image URL Input (Alternative Method) */}
    {isEditing && (
      <div className="mt-2">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image URL
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            value={cause.image}
            onChange={(e) => handleCauseChange(cause.id, 'image', e.target.value)}
            placeholder="Enter image URL or upload above"
            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {cause.image && cause.image !== '/images/causes/placeholder.jpg' && (
            <button
              onClick={() => handleCauseChange(cause.id, 'image', '/images/causes/placeholder.jpg')}
              className="px-2 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50"
              title="Remove image"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    )}
  </div>
  
  <div className="flex items-center space-x-2">
    {cause.featured && (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">
        <Star className="w-3 h-3 mr-1" />
        Featured
      </span>
    )}
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      cause.status === 'active' 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }`}>
      {cause.status}
    </span>
  </div>

  {/* Priority Controls */}
  {isEditing && (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">Priority:</span>
      <button
        onClick={() => moveCausePriority(cause.id, 'up')}
        disabled={cause.priority === 1}
        className="p-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium">{cause.priority}</span>
      <button
        onClick={() => moveCausePriority(cause.id, 'down')}
        disabled={cause.priority === sectionData.causes.length}
        className="p-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  )}
</div>

                {/* Cause Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={cause.title}
                      onChange={(e) => handleCauseChange(cause.id, 'title', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={cause.description}
                      onChange={(e) => handleCauseChange(cause.id, 'description', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={cause.category}
                        onChange={(e) => handleCauseChange(cause.id, 'category', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      >
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Environment">Environment</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={cause.endDate}
                        onChange={(e) => handleCauseChange(cause.id, 'endDate', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Funding & Controls */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Raised ($)
                      </label>
                      <input
                        type="number"
                        value={cause.raised}
                        onChange={(e) => handleCauseChange(cause.id, 'raised', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Goal ($)
                      </label>
                      <input
                        type="number"
                        value={cause.goal}
                        onChange={(e) => handleCauseChange(cause.id, 'goal', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Donors
                    </label>
                    <input
                      type="number"
                      value={cause.donors}
                      onChange={(e) => handleCauseChange(cause.id, 'donors', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`featured-${cause.id}`}
                      checked={cause.featured}
                      onChange={(e) => handleCauseChange(cause.id, 'featured', e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label htmlFor={`featured-${cause.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                      Featured on homepage
                    </label>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((cause.raised / cause.goal) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((cause.raised / cause.goal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  {isEditing && (
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => deleteCause(cause.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}