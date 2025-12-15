'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  X,
  Upload,
  Eye,
  Calendar,
  User,
  Tag,
  FileText,
  Image as ImageIcon,
  Clock,
  Globe,
  AlertCircle
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminImageUpload from '@/components/admin/ui/AdminImageUpload';
import AdminRichEditor from '@/components/admin/ui/AdminRichEditor';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string;
  seoTitle: string;
  seoDescription: string;
  readTime: number;
}

interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: BlogPost) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BlogForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: BlogFormProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: '',
    category: '',
    tags: [],
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
    seoTitle: '',
    seoDescription: '',
    readTime: 5,
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { value: 'news', label: 'News & Updates' },
    { value: 'success-stories', label: 'Success Stories' },
    { value: 'events', label: 'Events' },
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'volunteer-spotlight', label: 'Volunteer Spotlight' },
    { value: 'impact-reports', label: 'Impact Reports' },
    { value: 'community', label: 'Community' },
    { value: 'education', label: 'Education' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'scheduled', label: 'Scheduled' }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !initialData?.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, initialData?.slug]);

  // Auto-generate SEO title from title
  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      setFormData(prev => ({ 
        ...prev, 
        seoTitle: formData.title.length > 60 ? formData.title.substring(0, 57) + '...' : formData.title 
      }));
    }
  }, [formData.title, formData.seoTitle]);

  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length > 200) {
      newErrors.excerpt = 'Excerpt must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.seoDescription.trim()) {
      newErrors.seoDescription = 'SEO description is required';
    } else if (formData.seoDescription.length > 160) {
      newErrors.seoDescription = 'SEO description must be less than 160 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {initialData ? 'Update your blog post content and settings' : 'Create engaging content for your audience'}
          </p>
        </div>
        <div className="flex space-x-3">
          <AdminButton
            variant="secondary"
            onClick={() => setShowPreview(!showPreview)}
            icon={Eye}
          >
            {showPreview ? 'Hide Preview' : 'Preview'}
          </AdminButton>
          <AdminButton
            variant="secondary"
            onClick={onCancel}
            icon={X}
          >
            Cancel
          </AdminButton>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <AdminCard title="Basic Information" icon={FileText}>
              <div className="space-y-4">
                <AdminInput
                  label="Title"
                  value={formData.title}
                  onChange={(value) => handleInputChange('title', value)}
                  placeholder="Enter blog post title"
                  required
                  error={errors.title}
                />

                <AdminInput
                  label="Slug"
                  value={formData.slug}
                  onChange={(value) => handleInputChange('slug', value)}
                  placeholder="url-friendly-slug"
                  required
                  error={errors.slug}
                  helperText="URL-friendly version of the title"
                />

                <AdminTextarea
                  label="Excerpt"
                  value={formData.excerpt}
                  onChange={(value) => handleInputChange('excerpt', value)}
                  placeholder="Brief description of the blog post"
                  rows={3}
                  required
                  error={errors.excerpt}
                  helperText={`${formData.excerpt.length}/200 characters`}
                />
              </div>
            </AdminCard>

            {/* Content */}
            <AdminCard title="Content" icon={FileText}>
              <AdminRichEditor
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
                placeholder="Write your blog post content here..."
                error={errors.content}
              />
            </AdminCard>

            {/* SEO Settings */}
            <AdminCard title="SEO Settings" icon={Globe}>
              <div className="space-y-4">
                <AdminInput
                  label="SEO Title"
                  value={formData.seoTitle}
                  onChange={(value) => handleInputChange('seoTitle', value)}
                  placeholder="SEO optimized title"
                  helperText={`${formData.seoTitle.length}/60 characters`}
                />

                <AdminTextarea
                  label="SEO Description"
                  value={formData.seoDescription}
                  onChange={(value) => handleInputChange('seoDescription', value)}
                  placeholder="Brief description for search engines"
                  rows={2}
                  required
                  error={errors.seoDescription}
                  helperText={`${formData.seoDescription.length}/160 characters`}
                />
              </div>
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <AdminCard title="Publish Settings" icon={Calendar}>
              <div className="space-y-4">
                <AdminSelect
                  label="Status"
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  options={statusOptions}
                  required
                />

                <AdminInput
                  label="Publish Date"
                  type="date"
                  value={formData.publishDate}
                  onChange={(value) => handleInputChange('publishDate', value)}
                  required
                />

                <AdminInput
                  label="Author"
                  value={formData.author}
                  onChange={(value) => handleInputChange('author', value)}
                  placeholder="Author name"
                  required
                  error={errors.author}
                />

                <AdminInput
                  label="Read Time (minutes)"
                  type="number"
                  value={formData.readTime.toString()}
                  onChange={(value) => handleInputChange('readTime', parseInt(value) || 5)}
                  min="1"
                  max="60"
                />
              </div>
            </AdminCard>

            {/* Categorization */}
            <AdminCard title="Categorization" icon={Tag}>
              <div className="space-y-4">
                <AdminSelect
                  label="Category"
                  value={formData.category}
                  onChange={(value) => handleInputChange('category', value)}
                  options={categories}
                  required
                  error={errors.category}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag"
                      className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Featured Image */}
            <AdminCard title="Featured Image" icon={ImageIcon}>
              <AdminImageUpload
                value={formData.featuredImage}
                onChange={(value) => handleInputChange('featuredImage', value)}
                label="Upload featured image"
                accept="image/*"
              />
            </AdminCard>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Auto-saved 2 minutes ago</span>
          </div>
          <div className="flex space-x-3">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => handleInputChange('status', 'draft')}
            >
              Save as Draft
            </AdminButton>
            <AdminButton
              type="submit"
              isLoading={isLoading}
              icon={Save}
            >
              {formData.status === 'published' ? 'Publish' : 'Save'}
            </AdminButton>
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <article className="prose dark:prose-invert max-w-none">
                {formData.featuredImage && (
                  <img src={formData.featuredImage} alt={formData.title} className="w-full h-64 object-cover rounded-lg mb-6" />
                )}
                <h1>{formData.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>By {formData.author}</span>
                  <span>•</span>
                  <span>{formData.readTime} min read</span>
                  <span>•</span>
                  <span>{new Date(formData.publishDate).toLocaleDateString()}</span>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 italic">{formData.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              </article>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}