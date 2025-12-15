'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import {
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  User,
  Calendar,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  organization?: string;
  content: string;
  rating: number;
  image: string;
  featured: boolean;
  approved: boolean;
  dateSubmitted: string;
  location: string;
  category: 'beneficiary' | 'volunteer' | 'donor' | 'partner';
}

interface TestimonialFormData {
  name: string;
  role: string;
  organization: string;
  content: string;
  rating: number;
  location: string;
  category: 'beneficiary' | 'volunteer' | 'donor' | 'partner';
}

export default function TestimonialsManagement() {
  const [mounted, setMounted] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    role: '',
    organization: '',
    content: '',
    rating: 5,
    location: '',
    category: 'beneficiary'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      organization: '',
      content: '',
      rating: 5,
      location: '',
      category: 'beneficiary'
    });
  };

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Math.max(...testimonials.map(t => t.id), 0) + 1,
      ...formData,
      image: '/images/testimonials/default.jpg',
      featured: false,
      approved: false,
      dateSubmitted: new Date().toISOString().split('T')[0]
    };
    
    setTestimonials(prev => [newTestimonial, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditTestimonial = () => {
    if (!editingTestimonial) return;
    
    setTestimonials(prev => prev.map(testimonial => 
      testimonial.id === editingTestimonial.id 
        ? { ...testimonial, ...formData }
        : testimonial
    ));
    setEditingTestimonial(null);
    resetForm();
  };

  const openEditModal = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      organization: testimonial.organization || '',
      content: testimonial.content,
      rating: testimonial.rating,
      location: testimonial.location,
      category: testimonial.category
    });
    setEditingTestimonial(testimonial);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setEditingTestimonial(null);
    resetForm();
  };

  useEffect(() => {
    setMounted(true);
    // Mock data - replace with actual API call
    setTestimonials([
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'School Principal',
        organization: 'Riverside Elementary',
        content: 'The education program has transformed our school. Children are more engaged and motivated than ever before. The support from this organization has been incredible.',
        rating: 5,
        image: '/images/testimonials/sarah.jpg',
        featured: true,
        approved: true,
        dateSubmitted: '2024-01-15',
        location: 'New York, NY',
        category: 'beneficiary'
      },
      {
        id: 2,
        name: 'Michael Chen',
        role: 'Volunteer Coordinator',
        organization: 'Community Outreach',
        content: 'Volunteering with this organization has been life-changing. The impact we make together is truly remarkable and inspiring.',
        rating: 5,
        image: '/images/testimonials/michael.jpg',
        featured: true,
        approved: true,
        dateSubmitted: '2024-01-10',
        location: 'San Francisco, CA',
        category: 'volunteer'
      },
      {
        id: 3,
        name: 'Emma Davis',
        role: 'Regular Donor',
        content: 'I\'ve been donating for 3 years and seeing the transparent use of funds and real impact gives me confidence in this organization.',
        rating: 4,
        image: '/images/testimonials/emma.jpg',
        featured: false,
        approved: true,
        dateSubmitted: '2024-01-08',
        location: 'Chicago, IL',
        category: 'donor'
      },
      {
        id: 4,
        name: 'Dr. James Wilson',
        role: 'Medical Director',
        organization: 'Rural Health Initiative',
        content: 'The mobile health clinics have been a game-changer for our rural communities. Professional, efficient, and truly caring service.',
        rating: 5,
        image: '/images/testimonials/james.jpg',
        featured: false,
        approved: false,
        dateSubmitted: '2024-01-20',
        location: 'Austin, TX',
        category: 'partner'
      }
    ]);
  }, []);

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || testimonial.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'approved' && testimonial.approved) ||
                         (filterStatus === 'pending' && !testimonial.approved) ||
                         (filterStatus === 'featured' && testimonial.featured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleApproval = (id: number) => {
    setTestimonials(prev => prev.map(testimonial => 
      testimonial.id === id ? { ...testimonial, approved: !testimonial.approved } : testimonial
    ));
  };

  const toggleFeatured = (id: number) => {
    setTestimonials(prev => prev.map(testimonial => 
      testimonial.id === id ? { ...testimonial, featured: !testimonial.featured } : testimonial
    ));
  };

  const deleteTestimonial = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    }
  };

  const Modal = ({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const TestimonialForm = ({ onSubmit, submitText }: {
    onSubmit: () => void;
    submitText: string;
  }) => (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role *
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Organization
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="beneficiary">Beneficiary</option>
            <option value="volunteer">Volunteer</option>
            <option value="donor">Donor</option>
            <option value="partner">Partner</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rating *
          </label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Testimonial Content *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the testimonial content..."
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={closeModals}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!formData.name || !formData.role || !formData.content || !formData.location}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitText}
        </button>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Testimonials Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage customer testimonials and reviews
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{testimonials.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Testimonials</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {testimonials.filter(t => t.approved).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Approved</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {testimonials.filter(t => !t.approved).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Pending Review</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {testimonials.filter(t => t.featured).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Featured</div>
          </div>
        </AdminCard>
      </div>

      {/* Filters and Search */}
      <AdminCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="beneficiary">Beneficiary</option>
              <option value="volunteer">Volunteer</option>
              <option value="donor">Donor</option>
              <option value="partner">Partner</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>
      </AdminCard>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AdminCard>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                        {testimonial.organization && ` at ${testimonial.organization}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(testimonial.dateSubmitted).toLocaleDateString()}
                    </span>
                    <span>{testimonial.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      testimonial.category === 'beneficiary' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      testimonial.category === 'volunteer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      testimonial.category === 'donor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                    }`}>
                      {testimonial.category}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    {testimonial.featured && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      testimonial.approved
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {testimonial.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFeatured(testimonial.id)}
                      className={`p-1 rounded-md transition-colors ${
                        testimonial.featured
                          ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={testimonial.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleApproval(testimonial.id)}
                      className={`p-1 rounded-md transition-colors ${
                        testimonial.approved
                          ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={testimonial.approved ? 'Unapprove' : 'Approve'}
                    >
                      {testimonial.approved ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(testimonial)}
                      className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md transition-colors"
                      title="Edit testimonial"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-md transition-colors"
                      title="Delete testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </AdminCard>
          </motion.div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <AdminCard>
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No testimonials found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first testimonial'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </button>
          </div>
        </AdminCard>
      )}

      {/* Add/Edit Testimonial Modals */}
      <Modal
        isOpen={showAddModal}
        onClose={closeModals}
        title="Add New Testimonial"
      >
        <TestimonialForm
          onSubmit={handleAddTestimonial}
          submitText="Add Testimonial"
        />
      </Modal>

      <Modal
        isOpen={!!editingTestimonial}
        onClose={closeModals}
        title="Edit Testimonial"
      >
        <TestimonialForm
          onSubmit={handleEditTestimonial}
          submitText="Update Testimonial"
        />
      </Modal>
    </div>
  );
}