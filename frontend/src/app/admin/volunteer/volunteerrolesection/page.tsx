'use client'

import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { safeFetch } from '@/lib/fetchUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Save,
  X,
  Users,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Heart,
  DollarSign,
  Calendar,
  Leaf,
  Megaphone,
  MessageCircle,
  Code
} from 'lucide-react';

// Define types for volunteer roles
type VolunteerRole = {
  _id: string; // Changed from id to _id to match MongoDB
  title: string;
  description: string;
  category: string;
  icon: string;
  commitment: string;
  skills: string[];
  isActive: boolean;
  applicantsCount: number;
  createdDate: string;
  lastUpdated: string;
};

type RoleFormData = {
  title: string;
  description: string;
  category: string;
  icon: string;
  commitment: string;
  skills: string[];
  isActive: boolean;
};

// Icon mapping for categories
const categoryIcons = {
  'Teaching': GraduationCap,
  'Medical': Heart,
  'Fundraising': DollarSign,
  'Events': Calendar,
  'Environment': Leaf,
  'Marketing': Megaphone,
  'Outreach': MessageCircle,
  'Technical': Code,
  'default': Users
};

// Function to get icon component for category
const getCategoryIcon = (category: string) => {
  return categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;
};

export default function AdminVolunteerRolesPage() {
  // Sample volunteer roles data with admin fields
  const [volunteerRoles, setVolunteerRoles] = useState<VolunteerRole[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<VolunteerRole | null>(null);
  const [viewingRole, setViewingRole] = useState<VolunteerRole | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<RoleFormData>({
    title: '',
    description: '',
    category: '',
    icon: 'Users', // Changed to use Lucide icon name
    commitment: '',
    skills: [],
    isActive: true
  });

  const [newSkill, setNewSkill] = useState('');

  // Get unique categories for filter
  const categories = ['All', ...Array.from(new Set(volunteerRoles.map(role => role.category)))];

  // Filter roles based on search and filters
  const filteredRoles = volunteerRoles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || role.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Active' && role.isActive) ||
                         (filterStatus === 'Inactive' && !role.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stats calculation
  const stats = {
    totalRoles: volunteerRoles.length,
    activeRoles: volunteerRoles.filter(role => role.isActive).length,
    totalApplicants: volunteerRoles.reduce((sum, role) => sum + role.applicantsCount, 0),
    avgApplicants: Math.round(volunteerRoles.reduce((sum, role) => sum + role.applicantsCount, 0) / volunteerRoles.length) || 0
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await safeFetch('/api/vrole');
        if (res.success && res.data) setVolunteerRoles(res.data as VolunteerRole[]);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      icon: 'Users', // Changed to use Lucide icon name
      commitment: '',
      skills: [],
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditRole = (role: VolunteerRole) => {
    setEditingRole(role);
    setFormData({
      title: role.title,
      description: role.description,
      category: role.category,
      icon: role.icon,
      commitment: role.commitment,
      skills: [...role.skills],
      isActive: role.isActive
    });
    setShowModal(true);
  };

  // Fixed: Use _id instead of id, and ensure role._id exists
  const handleDeleteRole = async (roleId: string) => {
    if (!roleId) {
      console.error('Role ID is missing');
      return;
    }
    
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        const del = await safeFetch(`/api/vrole/${roleId}`, { method: 'DELETE' });
        if (del.success) setVolunteerRoles(prev => prev.filter(role => role._id !== roleId));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete role. Please try again.');
      }
    }
  };

  // Fixed: Use _id instead of id, and ensure role._id exists
  const handleToggleStatus = async (roleId: string) => {
    if (!roleId) {
      console.error('Role ID is missing');
      return;
    }
    
    try {
      const res = await safeFetch(`/api/vrole/${roleId}/toggle`, { method: 'PATCH' });
      if (res.success && res.data) {
        setVolunteerRoles(prev => prev.map(role => role._id === roleId ? (res.data as VolunteerRole) : role));
      }
    } catch (err) {
      console.error('Status toggle failed:', err);
      alert('Failed to toggle status. Please try again.');
    }
  };

  const handleSaveRole = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
        if (editingRole) {
          const res = await safeFetch(`/api/vrole/${editingRole._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          if (res.success && res.data) {
            setVolunteerRoles(prev => prev.map(role => role._id === editingRole._id ? (res.data as VolunteerRole) : role));
          }
        } else {
          const res = await safeFetch('/api/vrole', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          if (res.success && res.data) setVolunteerRoles(prev => [...prev, res.data as VolunteerRole]);
        }
      setShowModal(false);
      setEditingRole(null);
    } catch (err) {
      console.error('Save role failed:', err);
      alert('Failed to save role. Please try again.');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  if (loading) return <div className="text-center p-4">Loading roles...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Roles Management</h1>
        <p className="text-gray-600">Create, edit, and manage volunteer role opportunities</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRoles}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeRoles}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applicants</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalApplicants}</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Applicants</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.avgApplicants}</p>
            </div>
            <Clock className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search roles..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select 
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={handleAddRole}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Role</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                    <span className="text-sm text-purple-600">{role.category}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    role.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{role.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Commitment:</span>
                  <span className="text-gray-900">{role.commitment}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Applicants:</span>
                  <span className="text-gray-900">{role.applicantsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="text-gray-900">{new Date(role.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {role.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {role.skills.length > 3 && (
                  <span className="text-gray-500 text-xs">+{role.skills.length - 3} more</span>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setViewingRole(role)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditRole(role)}
                    className="text-gray-600 hover:text-gray-800"
                    title="Edit Role"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteRole(role._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Role"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={() => handleToggleStatus(role._id)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    role.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {role.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Role Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingRole ? 'Edit Role' : 'Add New Role'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter role title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select category</option>
                      <option value="Teaching">Teaching</option>
                      <option value="Medical">Medical</option>
                      <option value="Fundraising">Fundraising</option>
                      <option value="Events">Events</option>
                      <option value="Environment">Environment</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Outreach">Outreach</option>
                      <option value="Technical">Technical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe the role and responsibilities"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Commitment
                  </label>
                  <input
                    type="text"
                    value={formData.commitment}
                    onChange={(e) => setFormData(prev => ({ ...prev, commitment: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., 4-8 hours weekly"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Add a skill"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Role (visible to volunteers)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingRole ? 'Update Role' : 'Create Role'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Role Modal */}
      <AnimatePresence>
        {viewingRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{viewingRole.title}</h3>
                    <span className="text-sm font-medium text-purple-600">{viewingRole.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingRole(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{viewingRole.description}</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Time Commitment</h4>
                  <p className="text-gray-600">{viewingRole.commitment}</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingRole.skills.map((skill, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <p className="font-medium">{viewingRole.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Applicants:</span>
                    <p className="font-medium">{viewingRole.applicantsCount}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Created:</span>
                    <p className="font-medium">{new Date(viewingRole.createdDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Last Updated:</span>
                    <p className="font-medium">{new Date(viewingRole.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setViewingRole(null);
                    handleEditRole(viewingRole);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Edit Role
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}