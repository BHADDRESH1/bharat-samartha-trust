// src/app/admin/about/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Users, Eye, EyeOff } from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { safeFetch } from '@/lib/fetchUtils';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
  isVisible: boolean;
}

interface TeamSectionSettings {
  title: string;
  subtitle: string;
  volunteerText: string;
  volunteerCount: string;
  ctaText: string;
  ctaLink: string;
  showCtaSection: boolean;
  backgroundColor: string;
  isVisible: boolean;
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Executive Director',
      bio: 'John has over 15 years of experience in nonprofit management and has dedicated his career to creating positive social impact.',
      image: '/api/placeholder/400/400',
      order: 1,
      isVisible: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Program Manager',
      bio: 'Sarah leads our community outreach programs and has helped establish partnerships with over 50 local organizations.',
      image: '/api/placeholder/400/400',
      order: 2,
      isVisible: true
    }
  ]);

  const [sectionSettings, setSectionSettings] = useState<TeamSectionSettings>({
    title: 'Meet Our Team',
    subtitle: 'The Heart Behind the Mission',
    volunteerText: 'Volunteers & Change-Makers',
    volunteerCount: '+1000',
    ctaText: 'Join Our Team',
    ctaLink: '/get-involved',
    showCtaSection: true,
    backgroundColor: 'gray-50',
    isVisible: true
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await safeFetch('/api/team');
      if (result.success && result.data) {
        setTeamMembers(result.data.members || []);
        setSectionSettings(result.data.sectionSettings || {});
      } else {
        throw new Error(result.error || 'Failed to fetch team data');
      }
    } catch (err) {
      console.error('Failed to load team data:', err);
    }
  };
  fetchData();
}, []);


  const handleAddMember = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      bio: '',
      image: '',
      order: teamMembers.length + 1,
      isVisible: true
    });
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    console.log('Editing member:', member);
    setEditingMember(member);
    setFormData(member);
    setImagePreview(member.image || '');
    setIsModalOpen(true);
  };

  const handleSaveMember = async () => {
  try {
    const result = await safeFetch('/api/team/member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, id: editingMember?.id })
    });

    if (result.success && result.data) {
      setTeamMembers(result.data.members || []);
      setIsModalOpen(false);
      setFormData({});
      setImagePreview('');
    } else {
      throw new Error(result.error || 'Failed to save member');
    }
  } catch (err) {
    console.error('Error saving member:', err);
    alert('Error saving member. Please try again.');
  }
};


  const handleDeleteMember = async (id: string) => {
  if (confirm('Are you sure you want to delete this team member?')) {
    try {
      const result = await safeFetch(`/api/team/member/${id}`, {
        method: 'DELETE'
      });
      
      if (result.success) {
        setTeamMembers(prev => prev.filter(member => member.id !== id));
      } else {
        throw new Error(result.error || 'Failed to delete member');
      }
    } catch (err) {
      console.error('Error deleting member:', err);
      alert('Error deleting member. Please try again.');
    }
  }
};


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formDataData = new FormData();
  formDataData.append('image', file);

  try {
    const result = await safeFetch('/api/team/upload-image', {
      method: 'POST',
      body: formDataData,
    });

    if (result.success && result.data) {
      setImagePreview(result.data.url); // preview the uploaded image
      setFormData(prev => ({ ...prev, image: result.data.url })); // save image URL to form data
    } else {
      throw new Error(result.error || 'Image upload failed');
    }
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Image upload failed. Please try again.');
  }
};


  const handleSaveSettings = async () => {
  try {
    const result = await safeFetch('/api/team/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sectionSettings)
    });

    if (result.success && result.data) {
      setSectionSettings(result.data);
      setIsSettingsModalOpen(false);
    } else {
      throw new Error(result.error || 'Failed to save settings');
    }
  } catch (err) {
    console.error('Error saving settings:', err);
    alert('Error saving settings. Please try again.');
  }
};


  const backgroundOptions = [
    { name: 'Light Gray', value: 'gray-50' },
    { name: 'White', value: 'white' },
    { name: 'Light Blue', value: 'blue-50' },
    { name: 'Light Purple', value: 'purple-50' },
    { name: 'Light Green', value: 'green-50' }
  ];

  // Filter and sort team members safely
  const sortedTeamMembers = teamMembers
    .filter(member => member && member.id)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Section Management</h1>
          <p className="text-gray-600 mt-1">Manage your team members and section settings</p>
        </div>
        <div className="flex gap-3">
          <AdminButton variant="secondary" onClick={() => setIsSettingsModalOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Section Settings
          </AdminButton>
          <AdminButton onClick={handleAddMember}>
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </AdminButton>
        </div>
      </div>

      {/* Section Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard className="p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">{teamMembers.length}</h3>
              <p className="text-gray-600">Total Members</p>
            </div>
          </div>
        </AdminCard>
        
        <AdminCard className="p-6">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">
                {teamMembers.filter(m => m?.isVisible).length}
              </h3>
              <p className="text-gray-600">Visible Members</p>
            </div>
          </div>
        </AdminCard>
        
        <AdminCard className="p-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded mr-3 ${sectionSettings.isVisible ? 'bg-green-500' : 'bg-gray-400'}`} />
            <div>
              <h3 className="text-lg font-semibold">
                {sectionSettings.isVisible ? 'Active' : 'Hidden'}
              </h3>
              <p className="text-gray-600">Section Status</p>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Team Members Table */}
      <AdminCard>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Team Members</h2>
          
          {/* Custom Table Implementation */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bio Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTeamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={member.image || '/api/placeholder/40/40'} 
                        alt={member.name || 'Team member'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate">
                          {member.bio || 'No bio provided'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditMember(member)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member.id)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm leading-4 font-medium text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminCard>

      {/* Live Preview */}
      <AdminCard className="p-6">
        <h2 className="text-lg font-semibold mb-4">Section Preview</h2>
        <div className={`bg-${sectionSettings.backgroundColor} p-8 rounded-lg`}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {sectionSettings.title}
            </h2>
            <p className="text-lg text-gray-600">
              "{sectionSettings.subtitle}"
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers
              .filter(m => m?.isVisible)
              .slice(0, 4)
              .map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-32 overflow-hidden">
                    <img
                      src={member.image || '/api/placeholder/400/400'}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm">{member.name}</h3>
                    <p className="text-purple-600 text-xs">{member.role}</p>
                    <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
          
          {sectionSettings.showCtaSection && (
            <div className="text-center mt-8">
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-bold">{sectionSettings.volunteerCount} {sectionSettings.volunteerText}</span> across India
              </p>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-full text-sm">
                {sectionSettings.ctaText}
              </button>
            </div>
          )}
        </div>
      </AdminCard>

      {/* Add/Edit Member Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Executive Director, Program Manager"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio *
            </label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description about the team member..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order || 1}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Visible on website</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVisible !== undefined ? formData.isVisible : true}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSaveMember}>
              <Save className="w-4 h-4 mr-2" />
              Save Member
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Section Settings Modal */}
      <AdminModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
        title="Section Settings"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={sectionSettings.title}
                onChange={(e) => setSectionSettings(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={sectionSettings.subtitle}
                onChange={(e) => setSectionSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <select
              value={sectionSettings.backgroundColor}
              onChange={(e) => setSectionSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {backgroundOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Call-to-Action Section</h3>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Show CTA Section</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sectionSettings.showCtaSection}
                  onChange={(e) => setSectionSettings(prev => ({ ...prev, showCtaSection: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {sectionSettings.showCtaSection && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volunteer Count
                    </label>
                    <input
                      type="text"
                      value={sectionSettings.volunteerCount}
                      onChange={(e) => setSectionSettings(prev => ({ ...prev, volunteerCount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volunteer Text
                    </label>
                    <input
                      type="text"
                      value={sectionSettings.volunteerText}
                      onChange={(e) => setSectionSettings(prev => ({ ...prev, volunteerText: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Volunteers & Change-Makers"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={sectionSettings.ctaText}
                      onChange={(e) => setSectionSettings(prev => ({ ...prev, ctaText: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={sectionSettings.ctaLink}
                      onChange={(e) => setSectionSettings(prev => ({ ...prev, ctaLink: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm font-medium text-gray-700">Section Visible</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sectionSettings.isVisible}
                onChange={(e) => setSectionSettings(prev => ({ ...prev, isVisible: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="secondary" onClick={() => setIsSettingsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}