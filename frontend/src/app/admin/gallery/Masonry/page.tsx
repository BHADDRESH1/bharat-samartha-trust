'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Image, 
  Plus, 
  Eye, 
  Star, 
  Edit3,
  Trash2,
  Upload,
  Grid3X3,
  Layout,
  Settings,
  Filter,
  Search,
  MoreVertical,
  ArrowUpDown,
  Shuffle,
  Save,
  RefreshCw,
  Camera,
  Tag,
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Types
interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  thumbnail: string;
  category: string;
  tags: string[];
  featured: boolean;
  uploadDate: string;
  views: number;
  likes: number;
  position: number;
  aspectRatio: 'square' | 'portrait' | 'landscape';
  status: 'published' | 'draft' | 'archived';
}

interface MasonrySettings {
  columnCount: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap: number;
  enableHover: boolean;
  enableAnimations: boolean;
  loadingStrategy: 'lazy' | 'eager';
  imageQuality: number;
}

export default function AdminGalleryMasonry() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('position');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSettings, setShowSettings] = useState(false);
  
  const [masonrySettings, setMasonrySettings] = useState<MasonrySettings>({
    columnCount: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    },
    gap: 24,
    enableHover: true,
    enableAnimations: true,
    loadingStrategy: 'lazy',
    imageQuality: 85
  });

  const categories = ['Events', 'Volunteers', 'Impact', 'Medical', 'Environment', 'Education'];
  const statuses = ['published', 'draft', 'archived'];

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchGalleryItems = async () => {
      setTimeout(() => {
        const mockItems: GalleryItem[] = [
          {
            id: '1',
            title: 'Community Food Drive Success',
            description: 'Annual food drive helping 500+ families',
            image: '/api/placeholder/400/600',
            thumbnail: '/api/placeholder/200/300',
            category: 'Events',
            tags: ['community', 'food', 'charity'],
            featured: true,
            uploadDate: '2024-05-27',
            views: 234,
            likes: 45,
            position: 1,
            aspectRatio: 'portrait',
            status: 'published'
          },
          {
            id: '2',
            title: 'Volunteer Training Session',
            description: 'New volunteer orientation and training',
            image: '/api/placeholder/400/300',
            thumbnail: '/api/placeholder/200/150',
            category: 'Volunteers',
            tags: ['volunteers', 'training', 'orientation'],
            featured: false,
            uploadDate: '2024-05-26',
            views: 156,
            likes: 23,
            position: 2,
            aspectRatio: 'landscape',
            status: 'published'
          },
          {
            id: '3',
            title: 'Children Education Program',
            description: 'Educational support for underprivileged children',
            image: '/api/placeholder/400/500',
            thumbnail: '/api/placeholder/200/250',
            category: 'Education',
            tags: ['education', 'children', 'learning'],
            featured: true,
            uploadDate: '2024-05-25',
            views: 189,
            likes: 67,
            position: 3,
            aspectRatio: 'portrait',
            status: 'published'
          },
          {
            id: '4',
            title: 'Healthcare Camp Setup',
            description: 'Mobile healthcare services in rural areas',
            image: '/api/placeholder/400/300',
            thumbnail: '/api/placeholder/200/150',
            category: 'Medical',
            tags: ['healthcare', 'medical', 'rural'],
            featured: false,
            uploadDate: '2024-05-24',
            views: 142,
            likes: 34,
            position: 4,
            aspectRatio: 'landscape',
            status: 'draft'
          },
          {
            id: '5',
            title: 'Environmental Cleanup',
            description: 'Community environmental cleanup initiative',
            image: '/api/placeholder/400/400',
            thumbnail: '/api/placeholder/200/200',
            category: 'Environment',
            tags: ['environment', 'cleanup', 'nature'],
            featured: false,
            uploadDate: '2024-05-23',
            views: 198,
            likes: 52,
            position: 5,
            aspectRatio: 'square',
            status: 'published'
          }
        ];
        
        setItems(mockItems);
        setFilteredItems(mockItems);
        setLoading(false);
      }, 1000);
    };

    fetchGalleryItems();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'position':
          return a.position - b.position;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, filterCategory, filterStatus, sortBy]);

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleBulkAction = (action: 'publish' | 'draft' | 'archive' | 'delete' | 'feature') => {
    // Implement bulk actions
    console.log(`Bulk ${action} for items:`, selectedItems);
    setSelectedItems([]);
  };

  const handleToggleFeatured = (itemId: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, featured: !item.featured } : item
      )
    );
  };

  const handleStatusChange = (itemId: string, status: 'published' | 'draft' | 'archived') => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, status } : item
      )
    );
  };

  const handleSaveSettings = () => {
    // Save masonry settings
    console.log('Saving masonry settings:', masonrySettings);
    // API call to save settings
  };

  const handleReorderItems = () => {
    // Shuffle items for demo
    const shuffled = [...filteredItems].sort(() => Math.random() - 0.5);
    const reordered = shuffled.map((item, index) => ({ ...item, position: index + 1 }));
    setItems(prev => prev.map(item => reordered.find(r => r.id === item.id) || item));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const MasonrySettingsPanel = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Masonry Settings</h2>
        <button
          onClick={handleSaveSettings}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column Count Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Column Count</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Mobile</label>
              <input
                type="number"
                min="1"
                max="2"
                value={masonrySettings.columnCount.mobile}
                onChange={(e) => setMasonrySettings(prev => ({
                  ...prev,
                  columnCount: { ...prev.columnCount, mobile: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tablet</label>
              <input
                type="number"
                min="1"
                max="3"
                value={masonrySettings.columnCount.tablet}
                onChange={(e) => setMasonrySettings(prev => ({
                  ...prev,
                  columnCount: { ...prev.columnCount, tablet: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Desktop</label>
              <input
                type="number"
                min="2"
                max="5"
                value={masonrySettings.columnCount.desktop}
                onChange={(e) => setMasonrySettings(prev => ({
                  ...prev,
                  columnCount: { ...prev.columnCount, desktop: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Layout</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Gap (px)</label>
              <input
                type="number"
                min="8"
                max="48"
                step="4"
                value={masonrySettings.gap}
                onChange={(e) => setMasonrySettings(prev => ({
                  ...prev,
                  gap: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableHover"
                checked={masonrySettings.enableHover}
                onChange={(e) => setMasonrySettings(prev => ({
                  ...prev,
                  enableHover: e.target.checked
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="enableHover" className="ml-2 text-sm text-gray-700">
                Enable Hover Effects
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableAnimations"
                checked={masonrySettings.enableAnimations}
                onChange={(e) => setMasonrySettings(prev => ({
                  ...prev,
                  enableAnimations: e.target.checked
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="enableAnimations" className="ml-2 text-sm text-gray-700">
                Enable Animations
              </label>
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Performance</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Loading Strategy</label>
              <select
                value={masonrySettings.loadingStrategy}
                onChange={(e) => setMasonrySettings(prev => ({
                  ...prev,
                  loadingStrategy: e.target.value as 'lazy' | 'eager'
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="lazy">Lazy Loading</option>
                <option value="eager">Eager Loading</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Image Quality (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                step="5"
                value={masonrySettings.imageQuality}
                onChange={(e) => setMasonrySettings(prev => ({
                  ...prev,
                  imageQuality: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Masonry</h1>
          <p className="text-gray-600">Manage masonry gallery layout and items</p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          
          <Link
            href="/admin/gallery/items/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Link>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && <MasonrySettingsPanel />}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="position">Position</option>
              <option value="title">Title</option>
              <option value="date">Date</option>
              <option value="views">Views</option>
              <option value="likes">Likes</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Layout className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                  Publish
                </button>
                <button
                  onClick={() => handleBulkAction('feature')}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200"
                >
                  <Star className="w-3 h-3 mr-1 inline" />
                  Feature
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                  <Trash2 className="w-3 h-3 mr-1 inline" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-gray-500">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        <button
          onClick={handleReorderItems}
          className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Reorder
        </button>
      </div>

      {/* Gallery Items */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/gallery/items/${item.id}/edit`}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-gray-700" />
                    </Link>
                    <button
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`p-2 rounded-full transition-colors ${
                        item.featured 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${item.featured ? 'text-white fill-current' : 'text-gray-700'}`} />
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Select Checkbox */}
                <div className="absolute top-2 right-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-4 h-4 text-blue-600 bg-white border-2 border-white rounded focus:ring-blue-500"
                  />
                </div>

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute bottom-2 left-2">
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="px-2 py-1 bg-gray-100 rounded">{item.category}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{item.aspectRatio}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {item.views}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {item.likes}
                    </span>
                  </div>
                  <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                </div>

                {/* Quick Actions */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                    
                    <div className="flex space-x-1">
                      <Link
                        href={`/admin/gallery/items/${item.id}/edit`}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Link>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                            {item.featured && (
                              <Star className="w-4 h-4 text-orange-500 fill-current ml-2" />
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">{item.description}</p>
                          )}
                          <div className="flex items-center mt-1">
                            {item.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mr-1">
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="text-xs text-gray-400">+{item.tags.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                        {item.category}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{item.aspectRatio}</div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                        className={`text-xs border-0 rounded px-2 py-1 font-medium focus:ring-2 focus:ring-blue-500 ${
                          item.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Eye className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{item.views}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(item.uploadDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/gallery/items/${item.id}/edit`}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleFeatured(item.id)}
                          className={`p-1 rounded ${
                            item.featured 
                              ? 'text-orange-600 hover:bg-orange-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${item.featured ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Get started by adding your first gallery item'
            }
          </p>
          <Link
            href="/admin/gallery/items/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Item
          </Link>
        </div>
      )}

      {/* Preview Modal/Sidebar */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Masonry Preview</h2>
            <button
              onClick={() => window.open('/gallery', '_blank')}
              className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Live
            </button>
          </div>
          
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {filteredItems.slice(0, 9).map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-gray-100 rounded aspect-square ${
                    index % 3 === 1 ? 'row-span-2' : ''
                  }`}
                  style={{ backgroundColor: `hsl(${(index * 45) % 360}, 40%, 85%)` }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Masonry layout preview with {masonrySettings.columnCount.desktop} columns
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Footer */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{items.length}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{items.filter(i => i.status === 'published').length}</div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{items.filter(i => i.featured).length}</div>
          <div className="text-sm text-gray-600">Featured</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{items.reduce((acc, item) => acc + item.views, 0)}</div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
      </div>
    </div>
  );
}