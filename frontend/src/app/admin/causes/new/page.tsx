'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Upload,
  ImageIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { safeFetch } from '@/lib/fetchUtils';

interface NewCause {
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  image: string;
  status: 'active' | 'paused' | 'completed';
}

export default function AddNewCause() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [newCause, setNewCause] = useState<NewCause>({
    title: '',
    description: '',
    category: 'Education',
    goalAmount: 0,
    image: '/images/causes/default.jpg',
    status: 'active'
  });

  const availableCategories = [
    'Water', 'Education', 'Healthcare', 'Agriculture', 
    'Empowerment', 'Emergency', 'Environment', 'Technology'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newCause.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (newCause.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!newCause.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (newCause.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!newCause.category) {
      newErrors.category = 'Category is required';
    }

    if (!newCause.goalAmount || newCause.goalAmount <= 0) {
      newErrors.goalAmount = 'Goal amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateId = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const result = await safeFetch('/api/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCause)
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create cause');
    }

    const data = result.data;
    console.log('New cause created:', data);

    setShowSuccess(true);
    setTimeout(() => router.push('/admin/causes'), 2000);
  } catch (error: any) {
    console.error('Error creating cause:', error.message);
    setErrors({ submit: error.message });
  } finally {
    setIsSubmitting(false);
  }
};


const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file); // must match backend multer field

  try {
    const result = await safeFetch('/api/new/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!result.success) {
      throw new Error(result.error || 'Image upload failed');
    }

    const data = result.data;
    console.log('Upload response:', data); // ✅ DEBUG

    // ✅ Use the correct key from backend
    setNewCause(prev => ({ ...prev, image: data.url }));
    console.log('Uploaded image:', data.url); // ✅ Works now
  } catch (err) {
    console.error('Upload failed:', err);
    setErrors(prev => ({ ...prev, image: 'Image upload failed' }));
  }
};




  if (showSuccess) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cause Created Successfully!</h2>
          <p className="text-gray-600 mb-4">Your new cause has been added and is now live.</p>
          <div className="text-sm text-gray-500">Redirecting to causes management...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/causes"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Causes
          </Link>
          <div className="w-px h-6 bg-gray-300"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Cause</h1>
            <p className="text-gray-600 mt-1">Create a new fundraising campaign</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cause Title *
              </label>
              <input
                type="text"
                value={newCause.title}
                onChange={(e) => setNewCause(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter a compelling title for your cause"
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={newCause.description}
                onChange={(e) => setNewCause(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your cause, its impact, and why people should donate"
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="text-sm text-gray-500">
                  {newCause.description.length} characters
                </div>
              </div>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newCause.category}
                  onChange={(e) => setNewCause(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Status
                </label>
                <select
                  value={newCause.status}
                  onChange={(e) => setNewCause(prev => ({ ...prev, status: e.target.value as 'active' | 'paused' | 'completed' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Goal Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fundraising Goal *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="1"
                  value={newCause.goalAmount || ''}
                  onChange={(e) => setNewCause(prev => ({ ...prev, goalAmount: parseInt(e.target.value) || 0 }))}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.goalAmount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="50000"
                />
              </div>
              {errors.goalAmount && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.goalAmount}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Set a realistic and achievable fundraising target
              </p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Cause Image</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={newCause.image} 
                  alt="Cause preview"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-gray-500">
                    JPG, PNG or GIF (max 5MB)
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Choose a compelling image that represents your cause and motivates people to donate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Ready to Launch?</h3>
              <p className="text-gray-600 text-sm mt-1">
                Review your cause details and publish when ready
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/admin/causes"
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Cause
                  </>
                )}
              </button>
            </div>
          </div>
          
          {errors.submit && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700">{errors.submit}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}