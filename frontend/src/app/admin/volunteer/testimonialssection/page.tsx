'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  MessageSquare, 
  Star, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  MapPin,
  Camera,
  X,
  ImageIcon,
  FileUp
} from 'lucide-react';

import { safeFetch } from '@/lib/fetchUtils';

interface TestimonialStats {
  totalTestimonials: number;
  publishedTestimonials: number;
  pendingReview: number;
  averageRating: number;
  thisMonthSubmissions: number;
  featuredTestimonials: number;
}

interface Testimonial {
  _id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  image: string;
  quote: string;
  rating: number;
  yearsSince: number;
  status: 'pending' | 'published' | 'featured' | 'rejected';
  submittedDate: string;
  publishedDate?: string;
  category: string;
  verified: boolean;
}

export default function AdminTestimonialsPage() {
  const [stats, setStats] = useState<TestimonialStats>({
    totalTestimonials: 127,
    publishedTestimonials: 89,
    pendingReview: 15,
    averageRating: 4.8,
    thisMonthSubmissions: 12,
    featuredTestimonials: 8
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      role: 'Teaching Volunteer',
      location: 'Kenya',
      image: '/images/testimonials/volunteer-1.jpg',
      quote: 'Volunteering as a teacher in Kenya changed my perspective forever. The children\'s eagerness to learn despite difficult circumstances was truly inspiring. This experience has given me much more than I could ever give back.',
      rating: 5,
      yearsSince: 2,
      status: 'published',
      submittedDate: '2024-01-10',
      publishedDate: '2024-01-12',
      category: 'Education',
      verified: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      role: 'Medical Support',
      location: 'Guatemala',
      image: '/images/testimonials/volunteer-2.jpg',
      quote: 'As a medical student, I wanted to use my skills where they were most needed. Working alongside local healthcare providers taught me so much about resourcefulness and compassion.',
      rating: 5,
      yearsSince: 1,
      status: 'featured',
      submittedDate: '2024-01-08',
      publishedDate: '2024-01-09',
      category: 'Healthcare',
      verified: true
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      email: 'emma.r@email.com',
      role: 'Environmental Advocate',
      location: 'Costa Rica',
      image: '/images/testimonials/volunteer-3.jpg',
      quote: 'Working on wildlife conservation projects has been incredibly fulfilling. Every day brought new challenges and opportunities to make a real difference.',
      rating: 4,
      yearsSince: 1,
      status: 'pending',
      submittedDate: '2024-01-15',
      category: 'Environment',
      verified: false
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'james.w@email.com',
      role: 'Community Outreach',
      location: 'Peru',
      image: '/images/testimonials/volunteer-4.jpg',
      quote: 'Facilitating communication between communities and development projects has shown me the power of collaboration and understanding.',
      rating: 5,
      yearsSince: 3,
      status: 'pending',
      submittedDate: '2024-01-14',
      category: 'Community Development',
      verified: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Image upload states
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for add/edit testimonial
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    location: '',
    image: '',
    quote: '',
    rating: 5,
    yearsSince: 1,
    category: 'Education',
    verified: false
  });

  const categories = ['Education', 'Healthcare', 'Environment', 'Community Development', 'Fundraising'];

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      location: '',
      image: '',
      quote: '',
      rating: 5,
      yearsSince: 1,
      category: 'Education',
      verified: false
    });
    setImagePreview('');
    setUploadProgress(0);
  };

  // Use centralized safeFetch wrapper for testimonials API
  const API_BASE = '/api/vtest';

  useEffect(() => {
  const fetchTestimonials = async () => {
    try {
      const res = await safeFetch('/api/vtest');
      if (res.success && res.data) setTestimonials(res.data as Testimonial[]);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
    }
  };
  fetchTestimonials();
}, []);


  // Image upload handler
  const handleImageUpload = async (file: File) => {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB');
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    setImagePreview(e.target?.result as string);
  };
  reader.readAsDataURL(file);

  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await safeFetch('/api/vtest/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (res.success && res.data && (res.data as any).url) {
      setUploadProgress(100);
      setIsUploading(false);
      handleFormChange('image', (res.data as any).url); // Cloudinary image URL
    } else {
      throw new Error(res.error || 'Upload failed');
    }
  } catch (err) {
    console.error('Image upload error:', err);
    alert('Image upload failed. Please try again.');
    setIsUploading(false);
  }
};


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    handleFormChange('image', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTestimonial = () => {
    setIsAddModalOpen(true);
    resetForm();
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      email: testimonial.email,
      role: testimonial.role,
      location: testimonial.location,
      image: testimonial.image,
      quote: testimonial.quote,
      rating: testimonial.rating,
      yearsSince: testimonial.yearsSince,
      category: testimonial.category,
      verified: testimonial.verified
    });
    setImagePreview(testimonial.image);
    setIsEditModalOpen(true);
  };

  const handleSaveTestimonial = async () => {
  try {
    if (isEditModalOpen && editingTestimonial) {
      // PUT request to update
      await fetch(`${API_BASE}/${editingTestimonial._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setTestimonials(prev =>
        prev.map(t =>
          t._id === editingTestimonial._id ? { ...t, ...formData } : t
        )
      );
      setIsEditModalOpen(false);
      setEditingTestimonial(null);
    } else {
      // POST request to add new
      const newTestimonial = {
        ...formData,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      };

      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial)
      });

      const saved = await res.json();
      setTestimonials(prev => [...prev, saved]);
      setIsAddModalOpen(false);
    }
    resetForm();
  } catch (error) {
    console.error('Failed to save testimonial:', error);
  }
};


  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = async (_id: string, newStatus: Testimonial['status']) => {
  try {
    const publishedDate = ['published', 'featured'].includes(newStatus)
      ? new Date().toISOString().split('T')[0]
      : undefined;

    await fetch(`${API_BASE}/${_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, publishedDate })
    });

    setTestimonials(prev =>
      prev.map(t =>
        t._id === _id
          ? { ...t, status: newStatus, publishedDate }
          : t
      )
    );
  } catch (err) {
    console.error('Failed to update status:', err);
  }
};


  const handleDelete = async (_id: string) => {
  try {
    await fetch(`${API_BASE}/${_id}`, {
      method: 'DELETE'
    });
    setTestimonials(prev => prev.filter(t => t._id !== _id));
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
  }
};


  const handleVerify = async (_id: string) => {
  try {
    const res = await fetch(`${API_BASE}/verify/${_id}`, {
      method: 'PATCH'
    });
    const updated = await res.json();

    setTestimonials(prev =>
      prev.map(t => (t._id === _id ? updated : t))
    );
  } catch (err) {
    console.error('Failed to verify testimonial:', err);
  }
};


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'featured': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || testimonial.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || testimonial.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimonials Management</h1>
        <p className="text-gray-600">Manage volunteer testimonials, reviews, and success stories</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Testimonials</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTestimonials}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.publishedTestimonials}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageRating}</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.thisMonthSubmissions}</p>
            </div>
            <Calendar className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.featuredTestimonials}</p>
            </div>
            <Award className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button 
          onClick={handleAddTestimonial}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center space-x-4">
            <Plus className="h-10 w-10 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Add Testimonial</h3>
              <p className="text-sm text-gray-600">Create a new testimonial entry</p>
            </div>
          </div>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="flex items-center space-x-4">
            <Upload className="h-10 w-10 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Bulk Import</h3>
              <p className="text-sm text-gray-600">Import testimonials from CSV</p>
            </div>
          </div>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="flex items-center space-x-4">
            <Star className="h-10 w-10 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Featured Stories</h3>
              <p className="text-sm text-gray-600">Manage featured testimonials</p>
            </div>
          </div>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="flex items-center space-x-4">
            <Camera className="h-10 w-10 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Media Library</h3>
              <p className="text-sm text-gray-600">Manage testimonial images</p>
            </div>
          </div>
        </button>
      </div>

      {/* Testimonials Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Testimonials</h2>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search testimonials..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="featured">Featured</option>
              <option value="rejected">Rejected</option>
            </select>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volunteer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role & Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestimonials.map((testimonial) => (
                <tr key={testimonial._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {testimonial.name}
                          {testimonial.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{testimonial.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{testimonial.role}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {testimonial.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{testimonial.rating}/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {testimonial.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(testimonial.status)}`}>
                      {testimonial.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(testimonial.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedTestimonial(testimonial)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditTestimonial(testimonial)}
                        className="text-gray-600 hover:text-gray-900" 
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleVerify(testimonial._id)}
                        className={`${testimonial.verified ? 'text-green-600' : 'text-gray-400'} hover:text-green-900`}
                        title="Toggle Verification"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      {testimonial.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(testimonial._id, 'published')}
                            className="text-green-600 hover:text-green-900"
                            title="Publish"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(testimonial._id, 'featured')}
                            className="text-purple-600 hover:text-purple-900"
                            title="Feature"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(testimonial._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Testimonial Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">
                {isEditModalOpen ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setEditingTestimonial(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  
                  {/* Image Upload Area */}
                  <div className="mb-6">
                    {imagePreview || formData.image ? (
                      <div className="relative">
                        <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                          <Image
                            src={imagePreview || formData.image}
                            alt="Preview"
                            width={400}
                            height={256}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-center mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-gray-400 text-sm">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {isUploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alternative URL Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleFormChange('image', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Volunteer's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="volunteer@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                      <input
                        type="text"
                        required
                        value={formData.role}
                        onChange={(e) => handleFormChange('role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Teaching Volunteer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => handleFormChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Kenya"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                      <select
                        value={formData.rating}
                        onChange={(e) => handleFormChange('rating', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years Since Volunteering</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={formData.yearsSince}
                        onChange={(e) => handleFormChange('yearsSince', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Quote *</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.quote}
                      onChange={(e) => handleFormChange('quote', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Share your volunteering experience..."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.quote.length}/500 characters
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={formData.verified}
                      onChange={(e) => handleFormChange('verified', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="verified" className="ml-2 block text-sm text-gray-900">
                      Mark as verified
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setEditingTestimonial(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTestimonial}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditModalOpen ? 'Update Testimonial' : 'Save Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Testimonial Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Testimonial Details</h3>
              <button 
                onClick={() => setSelectedTestimonial(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={selectedTestimonial.image}
                    alt={selectedTestimonial.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="text-xl font-semibold text-gray-900">{selectedTestimonial.name}</h4>
                    {selectedTestimonial.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                    )}
                  </div>
                  <p className="text-gray-600">{selectedTestimonial.email}</p>
                  <p className="text-sm text-gray-500">{selectedTestimonial.role} • {selectedTestimonial.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Rating</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < selectedTestimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{selectedTestimonial.rating}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Category</p>
                  <p className="text-sm text-gray-900">{selectedTestimonial.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTestimonial.status)}`}>
                    {selectedTestimonial.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Years Since</p>
                  <p className="text-sm text-gray-900">{selectedTestimonial.yearsSince} years ago</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Testimonial</p>
                <blockquote className="text-gray-900 italic border-l-4 border-blue-500 pl-4">
                  "{selectedTestimonial.quote}"
                </blockquote>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Submitted Date</p>
                  <p className="text-gray-900">{new Date(selectedTestimonial.submittedDate).toLocaleDateString()}</p>
                </div>
                {selectedTestimonial.publishedDate && (
                  <div>
                    <p className="font-medium text-gray-700">Published Date</p>
                    <p className="text-gray-900">{new Date(selectedTestimonial.publishedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEditTestimonial(selectedTestimonial);
                  setSelectedTestimonial(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Testimonial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}