'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Users,
  Heart,
  Globe,
  TrendingUp,
  Award,
  Plus,
  Edit,
  Eye,
  Save,
  RotateCcw,
  Image as ImageIcon,
  BarChart3,
  Loader2,
  Trash2
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';

// API service functions (only save, get, and upload image)
const impactAPI = {
  // Fetch impact data
  async getImpactData() {
    const response = await fetch('http://localhost:5000/api/impact', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch impact data');
    }
    
    return response.json();
  },

  // Save impact data
  async saveImpactData(data) {
    const response = await fetch('http://localhost:5000/api/impact', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save impact data');
    }
    
    return response.json();
  },

  // Upload image
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('http://localhost:5000/api/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    return response.json();
  }
};

export default function ImpactSectionManagement() {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  const [impactData, setImpactData] = useState({
    title: "Our Global Impact",
    subtitle: "Making a difference in communities worldwide through dedicated action and support",
    description: "Every donation, every volunteer hour, and every act of kindness creates a ripple effect that transforms lives and communities. Here's how we're making a lasting impact together.",
    backgroundImage: "/images/impact/impact-bg.jpg",
    stats: [],
    achievements: []
  });

  useEffect(() => {
    setMounted(true);
    loadImpactData();
  }, []);

  const loadImpactData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await impactAPI.getImpactData();
      setImpactData(data);
      setOriginalData(JSON.parse(JSON.stringify(data))); 
    } catch (err) {
      setError(err.message);
      console.error('Error loading impact data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setImpactData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleStatChange = (statId, field, value) => {
    setImpactData(prev => ({
      ...prev,
      stats: prev.stats.map(stat => 
        stat.id === statId ? { ...stat, [field]: value } : stat
      )
    }));
    setHasChanges(true);
  };

  const handleAchievementChange = (achievementId, field, value) => {
    setImpactData(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => 
        achievement.id === achievementId ? { ...achievement, [field]: value } : achievement
      )
    }));
    setHasChanges(true);
  };

  const addNewStat = () => {
    const newStat = {
      id: `stat_${Date.now()}`, 
      icon: "Target",
      number: "0",
      label: "New Metric",
      description: "Description for new metric",
      color: "blue"
    };
    setImpactData(prev => ({
      ...prev,
      stats: [...prev.stats, newStat]
    }));
    setHasChanges(true);
  };

  const addNewAchievement = () => {
    const newAchievement = {
      id: `achievement_${Date.now()}`, 
      title: "New Achievement",
      description: "Description of the new achievement",
      image: "/images/impact/placeholder.jpg",
      category: "General",
      year: new Date().getFullYear().toString()
    };
    setImpactData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));
    setHasChanges(true);
  };

  const deleteStat = (statId) => {
    if (window.confirm('Are you sure you want to delete this statistic?')) {
      setImpactData(prev => ({
        ...prev,
        stats: prev.stats.filter(stat => stat.id !== statId)
      }));
      setHasChanges(true);
    }
  };

 
  const deleteAchievement = (achievementId) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      setImpactData(prev => ({
        ...prev,
        achievements: prev.achievements.filter(achievement => achievement.id !== achievementId)
      }));
      setHasChanges(true);
    }
  };

  const handleImageUpload = async (file, type, id = null) => {
    try {
      const result = await impactAPI.uploadImage(file);
      
      if (type === 'background') {
        handleInputChange('backgroundImage', result.url);
      } else if (type === 'achievement' && id) {
        handleAchievementChange(id, 'image', result.url);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const result = await impactAPI.saveImpactData(impactData);
      setImpactData(result);
      setOriginalData(JSON.parse(JSON.stringify(result)));
      setHasChanges(false);
      setIsEditing(false);
      
      // Show success message
      alert('Impact section saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalData) {
      setImpactData(JSON.parse(JSON.stringify(originalData)));
      setHasChanges(false);
      setIsEditing(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading impact data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="text-red-800 dark:text-red-200 text-sm font-medium">
            Error: {error}
          </div>
        </motion.div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Impact Section Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your impact statistics, achievements, and success stories
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview Section
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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
            <div className="text-2xl font-bold text-blue-600">{impactData.stats.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Impact Stats</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{impactData.achievements.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Achievements</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">92%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">4.8</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Impact Score</div>
          </div>
        </AdminCard>
      </div>

      {/* Save/Reset Bar (shown when editing) */}
      {isEditing && hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                You have unsaved changes
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                disabled={saving}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Settings */}
        <div className="lg:col-span-1">
          <AdminCard title="Section Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={impactData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={impactData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={impactData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Background Image
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={impactData.backgroundImage}
                    onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  />
                  {isEditing && (
                    <label className="cursor-pointer p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                      <ImageIcon className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'background')}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Impact Statistics */}
        <div className="lg:col-span-2">
          <AdminCard 
            title="Impact Statistics"
            action={
              isEditing ? (
                <button
                  onClick={addNewStat}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Stat
                </button>
              ) : null
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {impactData.stats.map((stat) => (
                <div key={stat.id} className="relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {isEditing && (
                    <button
                      onClick={() => deleteStat(stat.id)}
                      className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Number</label>
                        <input
                          type="text"
                          value={stat.number}
                          onChange={(e) => handleStatChange(stat.id, 'number', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                        <select
                          value={stat.color}
                          onChange={(e) => handleStatChange(stat.id, 'color', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="red">Red</option>
                          <option value="purple">Purple</option>
                          <option value="yellow">Yellow</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <textarea
                        value={stat.description}
                        onChange={(e) => handleStatChange(stat.id, 'description', e.target.value)}
                        disabled={!isEditing}
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Achievements Section */}
      <AdminCard 
        title="Key Achievements"
        action={
          isEditing ? (
            <button
              onClick={addNewAchievement}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Achievement
            </button>
          ) : null
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactData.achievements.map((achievement) => (
            <div key={achievement.id} className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {isEditing && (
                <button
                  onClick={() => deleteAchievement(achievement.id)}
                  className="absolute top-2 right-2 z-10 p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded bg-white dark:bg-gray-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                {achievement.image && achievement.image !== '/images/impact/placeholder.jpg' ? (
                  <img 
                    src={achievement.image} 
                    alt={achievement.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
                {isEditing && (
                  <label className="absolute bottom-2 right-2 cursor-pointer p-1 bg-black bg-opacity-50 text-white rounded">
                    <ImageIcon className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'achievement', achievement.id)}
                    />
                  </label>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={achievement.title}
                    onChange={(e) => handleAchievementChange(achievement.id, 'title', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea
                    value={achievement.description}
                    onChange={(e) => handleAchievementChange(achievement.id, 'description', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                    <input
                      type="text"
                      value={achievement.category}
                      onChange={(e) => handleAchievementChange(achievement.id, 'category', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
                    <input
                      type="text"
                      value={achievement.year}
                      onChange={(e) => handleAchievementChange(achievement.id, 'year', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}