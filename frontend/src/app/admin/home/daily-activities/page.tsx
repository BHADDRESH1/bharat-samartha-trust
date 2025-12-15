'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  AlertCircle,
  Activity,
  X,
  Check
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';

interface DailyActivity {
  id: number;
  title: string;
  time: string;
  location: string;
  description: string;
  days: string[];
  visible: boolean;
  volunteers: number;
  beneficiaries: number;
  icon: string;
  color: string;
}

const defaultActivity: Omit<DailyActivity, 'id'> = {
  title: '',
  time: '',
  location: '',
  description: '',
  days: [],
  visible: true,
  volunteers: 0,
  beneficiaries: 0,
  icon: '🎯',
  color: 'bg-blue-500'
};

const availableIcons = ['🍽️', '📚', '👴', '🏥', '🎯', '🏠', '🌱', '💡', '🎨', '⚽', '🔧', '💊'];
const availableColors = [
  'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500',
  'bg-orange-500', 'bg-teal-500', 'bg-cyan-500', 'bg-lime-500'
];

export default function DailyActivitiesManagement() {
  const [mounted, setMounted] = useState(false);
  const [activities, setActivities] = useState<DailyActivity[]>([
    {
      id: 1,
      title: 'Food Distribution',
      time: 'Daily, 12:00 PM - 2:00 PM',
      location: 'Various Community Centers',
      description: 'Our volunteers distribute nutritious meals to those in need across the city.',
      days: ['Monday', 'Wednesday', 'Friday'],
      visible: true,
      volunteers: 25,
      beneficiaries: 150,
      icon: '🍽️',
      color: 'bg-orange-500'
    },
    {
      id: 2,
      title: 'After-School Learning Program',
      time: 'Weekdays, 3:30 PM - 5:30 PM',
      location: 'Community Education Centers',
      description: 'Providing tutoring and enrichment activities for underprivileged children.',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      visible: true,
      volunteers: 15,
      beneficiaries: 80,
      icon: '📚',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      title: 'Senior Care Visits',
      time: 'Daily, 10:00 AM - 12:00 PM',
      location: 'Various Senior Living Facilities',
      description: 'Volunteers provide companionship and assistance to elderly individuals.',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      visible: true,
      volunteers: 20,
      beneficiaries: 60,
      icon: '👴',
      color: 'bg-green-500'
    },
    {
      id: 4,
      title: 'Free Medical Checkups',
      time: '9:00 AM - 1:00 PM',
      location: 'Mobile Health Clinics',
      description: 'Providing basic health screenings and consultations in underserved areas.',
      days: ['Tuesday', 'Thursday', 'Saturday'],
      visible: true,
      volunteers: 12,
      beneficiaries: 100,
      icon: '🏥',
      color: 'bg-red-500'
    }
  ]);

  const [sectionSettings, setSectionSettings] = useState({
    sectionVisible: true,
    sectionTitle: 'Daily Activities',
    sectionSubtitle: 'Our ongoing commitment to the community',
    showSchedule: true,
    showVolunteerCount: true,
    showBeneficiaryCount: true
  });

  const [editingActivity, setEditingActivity] = useState<DailyActivity | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState<Omit<DailyActivity, 'id'>>(defaultActivity);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/activities');
      const data = await res.json();
      if (data) {
        setActivities(data.activities || []);
        setSectionSettings(data.settings || sectionSettings);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  fetchData();
  setMounted(true);
}, []);


  const handleToggleActivityVisibility = (activityId: number) => {
    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? { ...activity, visible: !activity.visible }
        : activity
    ));
    setHasChanges(true);
  };

  const handleDeleteActivity = (activityId: number) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      setActivities(activities.filter(activity => activity.id !== activityId));
      setHasChanges(true);
    }
  };

  const handleEditActivity = (activity: DailyActivity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      time: activity.time,
      location: activity.location,
      description: activity.description,
      days: [...activity.days],
      visible: activity.visible,
      volunteers: activity.volunteers,
      beneficiaries: activity.beneficiaries,
      icon: activity.icon,
      color: activity.color
    });
  };

  const handleAddActivity = () => {
    setShowAddForm(true);
    setFormData(defaultActivity);
  };

  const handleSaveActivity = () => {
    if (!formData.title || !formData.time || !formData.location || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingActivity) {
      // Update existing activity
      setActivities(activities.map(activity =>
        activity.id === editingActivity.id
          ? { ...activity, ...formData }
          : activity
      ));
    } else {
      // Add new activity
      const newActivity: DailyActivity = {
        ...formData,
        id: Math.max(...activities.map(a => a.id), 0) + 1
      };
      setActivities([...activities, newActivity]);
    }

    setEditingActivity(null);
    setShowAddForm(false);
    setFormData(defaultActivity);
    setHasChanges(true);
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
    setShowAddForm(false);
    setFormData(defaultActivity);
  };

  const handleDayToggle = (day: string) => {
    setFormData({
      ...formData,
      days: formData.days.includes(day)
        ? formData.days.filter(d => d !== day)
        : [...formData.days, day]
    });
  };

  const handleSaveChanges = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activities, sectionSettings })
    });

    if (!res.ok) throw new Error('Save failed');
    alert('Changes saved successfully!');
    setHasChanges(false);
  } catch (err) {
    console.error(err);
    alert('Failed to save changes');
  }
};


  const handleResetChanges = async () => {
  if (confirm('Are you sure you want to reset all changes?')) {
    try {
      const res = await fetch('http://localhost:5000/api/activities');
      if (!res.ok) throw new Error('Failed to fetch original data');
      
      const data = await res.json();
      setActivities(data.activities || []);
      setSectionSettings(data.settings || sectionSettings);
      setHasChanges(false);
    } catch (err) {
      console.error('Reset failed:', err);
      alert('Failed to reset changes');
    }
  }
};


  const getDayAbbreviation = (day: string) => {
    return day.substring(0, 3).toUpperCase();
  };

  const getActivityFrequency = (days: string[]) => {
    if (days.length === 7) return 'Daily';
    if (days.length === 5 && !days.includes('Saturday') && !days.includes('Sunday')) return 'Weekdays';
    if (days.length === 2 && days.includes('Saturday') && days.includes('Sunday')) return 'Weekends';
    return `${days.length} days/week`;
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily Activities Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage regular ongoing activities and programs
          </p>
        </div>
        <div className="flex space-x-3">
          {hasChanges && (
            <>
              <button
                onClick={handleResetChanges}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              <button
                onClick={handleSaveChanges}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </>
          )}
          <button
            onClick={handleAddActivity}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              You have unsaved changes. Don't forget to save your work!
            </span>
          </div>
        </div>
      )}

      {/* Add/Edit Activity Modal */}
      {(showAddForm || editingActivity) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingActivity ? 'Edit Activity' : 'Add New Activity'}
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter activity title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Schedule *
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Daily, 12:00 PM - 2:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter activity location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the activity"
                />
              </div>

              {/* Schedule Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Active Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                        formData.days.includes(day)
                          ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-600'
                          : 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {availableIcons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({...formData, icon})}
                        className={`p-2 text-xl rounded-md border-2 transition-colors ${
                          formData.icon === icon
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({...formData, color})}
                        className={`w-8 h-8 rounded-md border-2 transition-all ${color} ${
                          formData.color === color
                            ? 'border-gray-800 dark:border-white scale-110'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Volunteers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.volunteers}
                    onChange={(e) => setFormData({...formData, volunteers: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Beneficiaries
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beneficiaries}
                    onChange={(e) => setFormData({...formData, beneficiaries: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({...formData, visible: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Make this activity visible on the website
                  </span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveActivity}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Check className="w-4 h-4 mr-2 inline" />
                {editingActivity ? 'Update Activity' : 'Create Activity'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Settings */}
      <AdminCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Section Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={sectionSettings.sectionTitle}
                onChange={(e) => {
                  setSectionSettings({...sectionSettings, sectionTitle: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Subtitle
              </label>
              <input
                type="text"
                value={sectionSettings.sectionSubtitle}
                onChange={(e) => {
                  setSectionSettings({...sectionSettings, sectionSubtitle: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sectionSettings.sectionVisible}
                onChange={(e) => {
                  setSectionSettings({...sectionSettings, sectionVisible: e.target.checked});
                  setHasChanges(true);
                }}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show section on homepage
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sectionSettings.showSchedule}
                onChange={(e) => {
                  setSectionSettings({...sectionSettings, showSchedule: e.target.checked});
                  setHasChanges(true);
                }}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show activity schedule
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sectionSettings.showVolunteerCount}
                onChange={(e) => {
                  setSectionSettings({...sectionSettings, showVolunteerCount: e.target.checked});
                  setHasChanges(true);
                }}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show volunteer count
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sectionSettings.showBeneficiaryCount}
                onChange={(e) => {
                  setSectionSettings({...sectionSettings, showBeneficiaryCount: e.target.checked});
                  setHasChanges(true);
                }}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show beneficiary count
              </span>
            </label>
          </div>
        </div>
      </AdminCard>

      {/* Activities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{activities.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Activities</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.visible).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Activities</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">
              {activities.reduce((sum, a) => sum + a.volunteers, 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Volunteers</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              {activities.reduce((sum, a) => sum + a.beneficiaries, 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">People Served</div>
          </div>
        </AdminCard>
      </div>

      {/* Activities List */}
      <AdminCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Activities ({activities.length})
          </h3>
          <div className="space-y-4">
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    <div className={`w-12 h-12 ${activity.color} rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {activity.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {activity.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {activity.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {getActivityFrequency(activity.days)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">SCHEDULE:</span>
                          <div className="flex space-x-1">
                            {daysOfWeek.map(day => (
                              <span
                                key={day}
                                className={`px-1.5 py-0.5 text-xs rounded ${
                                  activity.days.includes(day)
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                                }`}
                              >
                                {getDayAbbreviation(day)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm mt-3">
                        <div className="flex items-center text-blue-600 dark:text-blue-400">
                          <Users className="w-4 h-4 mr-1" />
                          {activity.volunteers} volunteers
                        </div>
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Activity className="w-4 h-4 mr-1" />
                          {activity.beneficiaries} beneficiaries
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActivityVisibility(activity.id)}
                      className={`p-2 rounded-md ${
                        activity.visible
                          ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                          : 'text-gray-400 bg-gray-100 dark:bg-gray-800'
                      }`}
                      title="Toggle Visibility"
                    >
                      {activity.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEditActivity(activity)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                      title="Edit Activity"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                      title="Delete Activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {activities.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Activity className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No activities yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Get started by creating your first daily activity.
                </p>
                <button
                  onClick={handleAddActivity}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Activity
                </button>
              </div>
            )}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}