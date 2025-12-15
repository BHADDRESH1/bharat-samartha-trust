'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Clock,
  MapPin,
  Users,
  Calendar,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  AlertCircle,
  Heart,
  Award,
  CheckCircle
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';

interface VolunteerOpportunity {
  id: number;
  title: string;
  category: string;
  description: string;
  requirements: string[];
  timeCommitment: string;
  location: string;
  spotsAvailable: number;
  currentVolunteers: number;
  skillsRequired: string[];
  benefits: string[];
  visible: boolean;
  urgent: boolean;
  remote: boolean;
  icon: string;
  color: string;
}

interface SectionSettings {
  sectionVisible: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  highlightUrgent: boolean;
  showSkillsRequired: boolean;
  showBenefits: boolean;
  showApplicationForm: boolean;
  requireRegistration: boolean;
}

interface VolunteerData {
  sectionSettings: SectionSettings;
  opportunities: VolunteerOpportunity[];
}

export default function VolunteerOpportunitiesManagement() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([
    {
      id: 1,
      title: 'Community Outreach Coordinator',
      category: 'Leadership',
      description: 'Help coordinate community events and outreach programs to expand our impact.',
      requirements: ['Strong communication skills', 'Event planning experience', 'Available weekends'],
      timeCommitment: '10-15 hours/week',
      location: 'Main Office + Field Work',
      spotsAvailable: 3,
      currentVolunteers: 1,
      skillsRequired: ['Communication', 'Organization', 'Leadership'],
      benefits: ['Leadership experience', 'Networking opportunities', 'Certificate of service'],
      visible: true,
      urgent: true,
      remote: false,
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Social Media Manager',
      category: 'Marketing',
      description: 'Manage our social media presence and create engaging content to raise awareness.',
      requirements: ['Social media experience', 'Creative skills', 'Basic design knowledge'],
      timeCommitment: '5-8 hours/week',
      location: 'Remote',
      spotsAvailable: 2,
      currentVolunteers: 0,
      skillsRequired: ['Social Media', 'Content Creation', 'Design'],
      benefits: ['Portfolio building', 'Marketing experience', 'Flexible schedule'],
      visible: true,
      urgent: false,
      remote: true,
      icon: '📱',
      color: 'bg-purple-500'
    },
    {
      id: 3,
      title: 'Youth Mentor',
      category: 'Education',
      description: 'Provide guidance and support to underprivileged youth in our after-school programs.',
      requirements: ['Background check', 'Good with children', 'Reliable schedule'],
      timeCommitment: '4-6 hours/week',
      location: 'Community Centers',
      spotsAvailable: 8,
      currentVolunteers: 5,
      skillsRequired: ['Mentoring', 'Patience', 'Communication'],
      benefits: ['Personal fulfillment', 'Skill development', 'Community impact'],
      visible: true,
      urgent: false,
      remote: false,
      icon: '🎓',
      color: 'bg-green-500'
    },
    {
      id: 4,
      title: 'Healthcare Support Volunteer',
      category: 'Healthcare',
      description: 'Assist with basic health screenings and provide support at mobile clinics.',
      requirements: ['Medical background preferred', 'First aid certification', 'Physical fitness'],
      timeCommitment: '6-8 hours/week',
      location: 'Mobile Clinics',
      spotsAvailable: 5,
      currentVolunteers: 3,
      skillsRequired: ['Healthcare', 'First Aid', 'Compassion'],
      benefits: ['Medical experience', 'Skill enhancement', 'Direct impact'],
      visible: true,
      urgent: true,
      remote: false,
      icon: '🏥',
      color: 'bg-red-500'
    }
  ]);

  const [sectionSettings, setSectionSettings] = useState<SectionSettings>({
    sectionVisible: true,
    sectionTitle: 'Volunteer Opportunities',
    sectionSubtitle: 'Join our mission to make a difference',
    highlightUrgent: true,
    showSkillsRequired: true,
    showBenefits: true,
    showApplicationForm: false,
    requireRegistration: false
  });

  const [editingOpportunity, setEditingOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const categories = ['Leadership', 'Marketing', 'Education', 'Healthcare', 'Technology', 'Operations', 'Fundraising'];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/volunteer-management');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: VolunteerData = await response.json();
        setSectionSettings(data.sectionSettings);
        setOpportunities(data.opportunities);
      } catch (err) {
        console.error('Failed to fetch:', err);
        // Keep default data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted]);

  const handleToggleOpportunityVisibility = (opportunityId: number) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, visible: !opp.visible }
        : opp
    ));
    setHasChanges(true);
  };

  const handleToggleUrgent = (opportunityId: number) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, urgent: !opp.urgent }
        : opp
    ));
    setHasChanges(true);
  };

  const handleDeleteOpportunity = (opportunityId: number) => {
    if (confirm('Are you sure you want to delete this volunteer opportunity?')) {
      setOpportunities(opportunities.filter(opp => opp.id !== opportunityId));
      setHasChanges(true);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/volunteer-management', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sectionSettings, opportunities }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Save successful:', result);
      alert('Saved successfully!');
      setHasChanges(false);
    } catch (err) {
      console.error('Save failed:', err);
      alert(`Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleResetChanges = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      setSectionSettings({
        sectionVisible: true,
        sectionTitle: 'Volunteer Opportunities',
        sectionSubtitle: 'Join our mission to make a difference',
        highlightUrgent: true,
        showSkillsRequired: true,
        showBenefits: true,
        showApplicationForm: false,
        requireRegistration: false
      });
      setOpportunities([
        {
          id: 1,
          title: 'Community Outreach Coordinator',
          category: 'Leadership',
          description: 'Help coordinate community events and outreach programs to expand our impact.',
          requirements: ['Strong communication skills', 'Event planning experience', 'Available weekends'],
          timeCommitment: '10-15 hours/week',
          location: 'Main Office + Field Work',
          spotsAvailable: 3,
          currentVolunteers: 1,
          skillsRequired: ['Communication', 'Organization', 'Leadership'],
          benefits: ['Leadership experience', 'Networking opportunities', 'Certificate of service'],
          visible: true,
          urgent: true,
          remote: false,
          icon: '👥',
          color: 'bg-blue-500'
        },
        {
          id: 2,
          title: 'Social Media Manager',
          category: 'Marketing',
          description: 'Manage our social media presence and create engaging content to raise awareness.',
          requirements: ['Social media experience', 'Creative skills', 'Basic design knowledge'],
          timeCommitment: '5-8 hours/week',
          location: 'Remote',
          spotsAvailable: 2,
          currentVolunteers: 0,
          skillsRequired: ['Social Media', 'Content Creation', 'Design'],
          benefits: ['Portfolio building', 'Marketing experience', 'Flexible schedule'],
          visible: true,
          urgent: false,
          remote: true,
          icon: '📱',
          color: 'bg-purple-500'
        },
        {
          id: 3,
          title: 'Youth Mentor',
          category: 'Education',
          description: 'Provide guidance and support to underprivileged youth in our after-school programs.',
          requirements: ['Background check', 'Good with children', 'Reliable schedule'],
          timeCommitment: '4-6 hours/week',
          location: 'Community Centers',
          spotsAvailable: 8,
          currentVolunteers: 5,
          skillsRequired: ['Mentoring', 'Patience', 'Communication'],
          benefits: ['Personal fulfillment', 'Skill development', 'Community impact'],
          visible: true,
          urgent: false,
          remote: false,
          icon: '🎓',
          color: 'bg-green-500'
        },
        {
          id: 4,
          title: 'Healthcare Support Volunteer',
          category: 'Healthcare',
          description: 'Assist with basic health screenings and provide support at mobile clinics.',
          requirements: ['Medical background preferred', 'First aid certification', 'Physical fitness'],
          timeCommitment: '6-8 hours/week',
          location: 'Mobile Clinics',
          spotsAvailable: 5,
          currentVolunteers: 3,
          skillsRequired: ['Healthcare', 'First Aid', 'Compassion'],
          benefits: ['Medical experience', 'Skill enhancement', 'Direct impact'],
          visible: true,
          urgent: true,
          remote: false,
          icon: '🏥',
          color: 'bg-red-500'
        }
      ]);
      setHasChanges(false);
      setEditingOpportunity(null);
      setShowAddForm(false);
    }
  };

  const getAvailabilityStatus = (current: number, total: number) => {
    const percentage = (current / total) * 100;
    if (percentage >= 90) return { status: 'Full', color: 'text-red-600' };
    if (percentage >= 70) return { status: 'Almost Full', color: 'text-yellow-600' };
    return { status: 'Available', color: 'text-green-600' };
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading volunteer opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Volunteer Opportunities Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage volunteer positions and opportunities
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
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Opportunity
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
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
                  checked={sectionSettings.showSkillsRequired}
                  onChange={(e) => {
                    setSectionSettings({...sectionSettings, showSkillsRequired: e.target.checked});
                    setHasChanges(true);
                  }}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Show required skills
                </span>
              </label>
            </div>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sectionSettings.highlightUrgent}
                  onChange={(e) => {
                    setSectionSettings({...sectionSettings, highlightUrgent: e.target.checked});
                    setHasChanges(true);
                  }}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Highlight urgent positions
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sectionSettings.showBenefits}
                  onChange={(e) => {
                    setSectionSettings({...sectionSettings, showBenefits: e.target.checked});
                    setHasChanges(true);
                  }}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Show volunteer benefits
                </span>
              </label>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{opportunities.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Opportunities</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {opportunities.filter(o => o.visible).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Positions</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-red-600">
              {opportunities.filter(o => o.urgent).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Urgent Positions</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">
              {opportunities.reduce((sum, o) => sum + o.currentVolunteers, 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Current Volunteers</div>
          </div>
        </AdminCard>
      </div>

      {/* Add/Edit Opportunity Form */}
      {(showAddForm || editingOpportunity) && (
        <AdminCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const newOpportunity = {
                id: editingOpportunity ? editingOpportunity.id : Date.now(),
                title: formData.get('title') as string,
                category: formData.get('category') as string,
                description: formData.get('description') as string,
                requirements: (formData.get('requirements') as string).split('\n').filter(req => req.trim()),
                timeCommitment: formData.get('timeCommitment') as string,
                location: formData.get('location') as string,
                spotsAvailable: parseInt(formData.get('spotsAvailable') as string),
                currentVolunteers: editingOpportunity ? editingOpportunity.currentVolunteers : 0,
                skillsRequired: (formData.get('skillsRequired') as string).split(',').map(skill => skill.trim()).filter(skill => skill),
                benefits: (formData.get('benefits') as string).split(',').map(benefit => benefit.trim()).filter(benefit => benefit),
                visible: formData.get('visible') === 'on',
                urgent: formData.get('urgent') === 'on',
                remote: formData.get('remote') === 'on',
                icon: formData.get('icon') as string || '📋',
                color: formData.get('color') as string || 'bg-gray-500'
              };
              
              if (editingOpportunity) {
                setOpportunities(opportunities.map(opp => opp.id === editingOpportunity.id ? newOpportunity : opp));
              } else {
                setOpportunities([...opportunities, newOpportunity]);
              }
              
              setEditingOpportunity(null);
              setShowAddForm(false);
              setHasChanges(true);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingOpportunity?.title || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    defaultValue={editingOpportunity?.category || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingOpportunity?.description || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Commitment *
                  </label>
                  <input
                    type="text"
                    name="timeCommitment"
                    defaultValue={editingOpportunity?.timeCommitment || ''}
                    placeholder="e.g., 5-8 hours/week"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={editingOpportunity?.location || ''}
                    placeholder="e.g., Remote, Main Office"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Spots *
                  </label>
                  <input
                    type="number"
                    name="spotsAvailable"
                    defaultValue={editingOpportunity?.spotsAvailable || 1}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    name="icon"
                    defaultValue={editingOpportunity?.icon || '📋'}
                    placeholder="e.g., 📋, 👥, 💻"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <select
                    name="color"
                    defaultValue={editingOpportunity?.color || 'bg-gray-500'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="bg-blue-500">Blue</option>
                    <option value="bg-green-500">Green</option>
                    <option value="bg-purple-500">Purple</option>
                    <option value="bg-red-500">Red</option>
                    <option value="bg-yellow-500">Yellow</option>
                    <option value="bg-indigo-500">Indigo</option>
                    <option value="bg-pink-500">Pink</option>
                    <option value="bg-gray-500">Gray</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills Required (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skillsRequired"
                    defaultValue={editingOpportunity?.skillsRequired?.join(', ') || ''}
                    placeholder="e.g., Communication, Leadership, Design"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Benefits (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="benefits"
                    defaultValue={editingOpportunity?.benefits?.join(', ') || ''}
                    placeholder="e.g., Skill development, Networking, Certificate"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requirements (one per line)
                  </label>
                  <textarea
                    name="requirements"
                    rows={4}
                    defaultValue={editingOpportunity?.requirements?.join('\n') || ''}
                    placeholder="Enter each requirement on a new line"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="visible"
                      defaultChecked={editingOpportunity?.visible ?? true}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Visible</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="urgent"
                      defaultChecked={editingOpportunity?.urgent || false}
                      className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Urgent</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="remote"
                      defaultChecked={editingOpportunity?.remote || false}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remote</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingOpportunity(null);
                    setShowAddForm(false);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingOpportunity ? 'Update Opportunity' : 'Create Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </AdminCard>
      )}

      {/* Opportunities List */}
      <AdminCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Volunteer Opportunities ({opportunities.length})
          </h3>
          <div className="space-y-4">
            {opportunities.map((opportunity) => {
              const availability = getAvailabilityStatus(opportunity.currentVolunteers, opportunity.spotsAvailable);
              return (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                    opportunity.urgent 
                      ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800' 
                      : 'bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4 flex-1">
                        <div className={`w-16 h-16 ${opportunity.color} rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg`}>
                          {opportunity.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                              {opportunity.title}
                            </h4>
                            {opportunity.urgent && (
                              <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-sm">
                                URGENT
                              </span>
                            )}
                            {opportunity.remote && (
                              <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300 rounded-full">
                                REMOTE
                              </span>
                            )}
                            <span className="px-3 py-1 text-xs font-medium bg-white/70 backdrop-blur-sm text-gray-700 dark:bg-gray-800/70 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600">
                              {opportunity.category}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <Clock className="w-4 h-4 mr-2 text-orange-500" />
                                <span className="font-medium">Time:</span>
                              </div>
                              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                                {opportunity.timeCommitment}
                              </p>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                                <span className="font-medium">Location:</span>
                              </div>
                              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                                {opportunity.location}
                              </p>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <Users className="w-4 h-4 mr-2 text-orange-500" />
                                <span className="font-medium">Spots:</span>
                              </div>
                              <p className={`text-sm mt-1 font-medium ${availability.color}`}>
                                {opportunity.currentVolunteers}/{opportunity.spotsAvailable} filled
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            {opportunity.description}
                          </p>
                          
                          {/* Skills Required */}
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                              <Award className="w-4 h-4 mr-1 text-blue-500" />
                              Skills Required:
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {opportunity.skillsRequired.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Benefits */}
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                              <Heart className="w-4 h-4 mr-1 text-green-500" />
                              Benefits:
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {opportunity.benefits.map((benefit, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 rounded-full border border-green-200 dark:border-green-700"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1 text-purple-500" />
                              Requirements:
                            </h5>
                            <div className="bg-white/40 backdrop-blur-sm dark:bg-gray-800/40 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50">
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                {opportunity.requirements.map((req, index) => (
                                  <li key={index} className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleToggleUrgent(opportunity.id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            opportunity.urgent
                              ? 'text-red-600 bg-red-100 dark:bg-red-900/30 shadow-sm'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                          title="Toggle Urgent Status"
                        >
                          <AlertCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleOpportunityVisibility(opportunity.id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            opportunity.visible
                              ? 'text-green-600 bg-green-100 dark:bg-green-900/30 shadow-sm'
                              : 'text-gray-400 bg-gray-100 dark:bg-gray-800'
                          }`}
                          title="Toggle Visibility"
                        >
                          {opportunity.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => setEditingOpportunity(opportunity)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                          title="Edit Opportunity"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOpportunity(opportunity.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                          title="Delete Opportunity"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}