'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Target, 
  MessageSquare, 
  BarChart3,
  Plus,
  Edit,
  Eye,
  Trash2,
  ImageIcon,
  FileText,
  Settings,
  Filter,
  Search,
  DollarSign,
  X,
  Save,
  Upload,
  Camera
} from 'lucide-react';

interface CauseStats {
  totalCauses: number;
  totalDonors: number;
  totalRaised: number;
  activeCampaigns: number;
  avgProgress: number;
}

interface Cause {
  _id?: string;
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  raised: string;
  goal: string;
  raisedAmount: number;
  goalAmount: number;
  image: string;
  lastUpdated: string;
  status: 'active' | 'paused' | 'completed';
}

export default function CausesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingCause, setEditingCause] = useState<Cause | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState<CauseStats>({
    totalCauses: 0,
    totalDonors: 8450,
    totalRaised: 0,
    activeCampaigns: 0,
    avgProgress: 0
  });

  const [causes, setCauses] = useState<Cause[]>([]);

  const categories = ['All', ...Array.from(new Set(causes.map(cause => cause.category)))];
  const statuses = ['All', 'active', 'paused', 'completed'];
  const availableCategories = ['Water', 'Education', 'Healthcare', 'Agriculture', 'Empowerment', 'Emergency', 'Environment', 'Technology'];

  const filteredCauses = causes.filter(cause => {
    const matchesSearch = cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cause.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || cause.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || cause.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const updateStats = (causesData: Cause[]) => {
    const totalRaised = causesData.reduce((sum, cause) => sum + cause.raisedAmount, 0);
    const avgProgress = causesData.length > 0 
      ? Math.round(causesData.reduce((sum, cause) => sum + cause.progress, 0) / causesData.length)
      : 0;
    const activeCampaigns = causesData.filter(cause => cause.status === 'active').length;

    setStats({
      totalCauses: causesData.length,
      totalDonors: 8450,
      totalRaised,
      activeCampaigns,
      avgProgress
    });
  };

  useEffect(() => {
    const fetchCauses = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/causeList');
        
        const processedCauses = res.data.map((cause: any) => ({
          ...cause,
          raisedAmount: typeof cause.raisedAmount === 'string' 
            ? parseInt(cause.raisedAmount.replace(/[$,]/g, '')) 
            : cause.raisedAmount,
          goalAmount: typeof cause.goalAmount === 'string' 
            ? parseInt(cause.goalAmount.replace(/[$,]/g, '')) 
            : cause.goalAmount,
          progress: cause.progress || Math.round((cause.raisedAmount / cause.goalAmount) * 100),
          raised: cause.raised || `$${cause.raisedAmount?.toLocaleString()}`,
          goal: cause.goal || `$${cause.goalAmount?.toLocaleString()}`
        }));

        setCauses(processedCauses);
        updateStats(processedCauses);
      } catch (error) {
        console.error('Error fetching causes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCauses();
  }, []);

  // Image upload handler
  // Frontend (React/TypeScript) - Fixed to work with your existing backend
const handleImageUpload = async (file: File) => {
  if (!file) return null;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file.');
    return null;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB.');
    return null;
  }

  setUploadingImage(true);

  try {
    const formData = new FormData();
    formData.append('image', file);

    // Upload to your image upload endpoint
    const response = await axios.post(
      'http://localhost:5000/api/causeList/upload-image', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Fixed: Your backend returns 'url', not 'imageUrl'
    return response.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Better error handling
    if (error.response?.status === 413) {
      alert('File too large. Please select an image smaller than 5MB.');
    } else if (error.response?.data?.message) {
      alert(`Upload failed: ${error.response.data.message}`);
    } else if (error.code === 'ECONNABORTED') {
      alert('Upload timeout. Please try a smaller image or check your connection.');
    } else if (error.response?.status >= 500) {
      alert('Server error. Please try again later.');
    } else {
      alert('Failed to upload image. Please try again.');
    }
    
    return null;
  } finally {
    setUploadingImage(false);
  }
};

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle image change button click
  const handleImageChangeClick = () => {
    fileInputRef.current?.click();
  };

  // Upload selected image
  const handleUploadSelectedImage = async () => {
    if (!selectedImageFile || !editingCause) return;

    const uploadedImageUrl = await handleImageUpload(selectedImageFile);
    
    if (uploadedImageUrl) {
      setEditingCause(prev => prev ? {...prev, image: uploadedImageUrl} : null);
      setSelectedImageFile(null);
      setPreviewImage('');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Cancel image selection
  const handleCancelImageSelection = () => {
    setSelectedImageFile(null);
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditCause = (cause: Cause) => {
    setEditingCause({ ...cause });
    setIsModalOpen(true);
    // Reset image upload states
    setSelectedImageFile(null);
    setPreviewImage('');
  };

  const handleSaveCause = async () => {
    if (!editingCause || !editingCause._id) {
      console.error('No cause selected for editing or missing _id');
      return;
    }

    setIsLoading(true);
    
    const progress = Math.min(Math.round((editingCause.raisedAmount / editingCause.goalAmount) * 100), 100);

    const updatedCause = {
      ...editingCause,
      progress,
      raised: `$${editingCause.raisedAmount.toLocaleString()}`,
      goal: `$${editingCause.goalAmount.toLocaleString()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/causeList/${editingCause._id}`, updatedCause);
      
      console.log('Update response:', response.data);

      const updatedCauses = causes.map(cause => 
        cause._id === editingCause._id ? { ...updatedCause, _id: editingCause._id } : cause
      );
      
      setCauses(updatedCauses);
      updateStats(updatedCauses);

      setIsModalOpen(false);
      setEditingCause(null);
      setSelectedImageFile(null);
      setPreviewImage('');
      
      alert('Cause updated successfully!');
      
    } catch (err) {
      console.error('Error saving cause:', err);
      alert('Error updating cause. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCause(null);
    setSelectedImageFile(null);
    setPreviewImage('');
  };

  const handleDeleteCause = async (cause: Cause) => {
    if (!window.confirm('Are you sure you want to delete this cause? This action cannot be undone.')) return;

    if (!cause._id) {
      console.error('Cannot delete cause: missing _id');
      return;
    }

    setIsLoading(true);

    try {
      await axios.delete(`http://localhost:5000/api/causeList/${cause._id}`);
      
      const remainingCauses = causes.filter(c => c._id !== cause._id);
      setCauses(remainingCauses);
      updateStats(remainingCauses);

      alert('Cause deleted successfully!');
    } catch (err) {
      console.error('Error deleting cause:', err);
      alert('Error deleting cause. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Causes Management</h1>
          <p className="text-gray-600 mt-2">Manage your causes page content and campaigns</p>
        </div>
        <Link
          href="/admin/causes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Cause
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Causes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCauses}</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonors.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRaised.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Causes Management Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Manage Causes</h2>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search causes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cause
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Raised / Goal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCauses.map((cause) => (
                  <tr key={cause._id || cause.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={cause.image}
                          alt={cause.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{cause.title}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{cause.description}</div>
                          <div className="text-xs text-gray-400">Updated {cause.lastUpdated}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {cause.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(cause.progress)}`}
                              style={{ width: `${Math.min(cause.progress, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                            {cause.progress}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{cause.raised}</div>
                        <div className="text-gray-500">of {cause.goal}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cause.status)}`}>
                        {cause.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link href={`/causes/${cause.id}`} className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleEditCause(cause)}
                          className="text-green-600 hover:text-green-900"
                          disabled={isLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCause(cause)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!isLoading && filteredCauses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No causes found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingCause && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Cause</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Enhanced Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cause Image
                </label>
                
                {/* Current Image */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={previewImage || editingCause.image} 
                      alt={editingCause.title}
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {/* File selection and upload buttons */}
                    {!selectedImageFile ? (
                      <button 
                        type="button"
                        onClick={handleImageChangeClick}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={uploadingImage || isLoading}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Choose New Image
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Selected: {selectedImageFile.name}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handleUploadSelectedImage}
                            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={uploadingImage || isLoading}
                          >
                            {uploadingImage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelImageSelection}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={uploadingImage || isLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Supports JPG, PNG, WebP. Max size: 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingCause.title}
                  onChange={(e) => setEditingCause(prev => prev ? {...prev, title: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingCause.description}
                  onChange={(e) => setEditingCause(prev => prev ? {...prev, description: e.target.value} : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={editingCause.category}
                    onChange={(e) => setEditingCause(prev => prev ? {...prev, category: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    {availableCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editingCause.status}
                    onChange={(e) => setEditingCause(prev => prev ? {...prev, status: e.target.value as 'active' | 'paused' | 'completed'} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Raised and Goal Amounts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Raised ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingCause.raisedAmount || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 0 : parseInt(value);
                      setEditingCause(prev => prev ? {...prev, raisedAmount: Math.max(0, numValue || 0)} : null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Amount ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingCause.goalAmount || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 0 : parseInt(value);
                      setEditingCause(prev => prev ? {...prev, goalAmount: Math.max(0, numValue || 0)} : null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Progress Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Progress
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getProgressColor(
                        editingCause.goalAmount > 0 
                          ? Math.min(Math.round((editingCause.raisedAmount / editingCause.goalAmount) * 100), 100)
                          : 0
                      )}`}
                      style={{ 
                        width: `${editingCause.goalAmount > 0 
                          ? Math.min(Math.round((editingCause.raisedAmount / editingCause.goalAmount) * 100), 100)
                          : 0
                        }%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                    {editingCause.goalAmount > 0 
                      ? Math.min(Math.round((editingCause.raisedAmount / editingCause.goalAmount) * 100), 100)
                      : 0
                    }%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Progress is automatically calculated based on raised/goal amounts
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCause}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={isLoading || uploadingImage}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}