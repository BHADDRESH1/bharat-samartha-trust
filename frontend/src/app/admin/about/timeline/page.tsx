'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import { AdminModal } from '@/components/admin/ui/AdminModal';

interface TimelineItem {
  _id?: string; // For MongoDB _id
  year: string;
  title: string;
  description: string;
}

const API_URL = 'http://localhost:5000/api/timeline';

export default function TimelineManagement() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [formData, setFormData] = useState<Partial<TimelineItem>>({});

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const res = await axios.get(API_URL);
      setTimelineItems(res.data);
    } catch (err) {
      console.error('Error fetching timeline items', err);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({ year: '', title: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEditItem = (item: TimelineItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!formData.year || !formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingItem && editingItem._id) {
        const res = await axios.put(`${API_URL}/${editingItem._id}`, formData);
        setTimelineItems(prev =>
          prev.map(item => (item._id === res.data._id ? res.data : item))
        );
      } else {
        const res = await axios.post(API_URL, formData);
        setTimelineItems(prev => [...prev, res.data]);
      }
      setIsModalOpen(false);
      setFormData({});
    } catch (err) {
      console.error('Error saving timeline item', err);
    }
  };

  const handleDeleteItem = async (id?: string) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this timeline item?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setTimelineItems(prev => prev.filter(item => item._id !== id));
      } catch (err) {
        console.error('Error deleting timeline item', err);
      }
    }
  };

  const sortedItems = [...timelineItems].sort((a, b) => parseInt(a.year) - parseInt(b.year));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timeline Management</h1>
          <p className="text-gray-600 mt-1">Manage your organization's journey milestones</p>
        </div>
        <AdminButton onClick={handleAddItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Timeline Item
        </AdminButton>
      </div>

      {/* Timeline Items */}
      <div className="space-y-4">
        {sortedItems.map((item) => (
          <AdminCard key={item._id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {item.year}
                  </span>
                  <span className="text-sm text-gray-500">ID: {item._id}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <AdminButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditItem(item)}
                >
                  <Edit className="w-4 h-4" />
                </AdminButton>
                <AdminButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}
        
        {timelineItems.length === 0 && (
          <AdminCard className="p-12 text-center">
            <p className="text-gray-500 text-lg">No timeline items yet.</p>
            <p className="text-gray-400 mt-2">Click "Add Timeline Item" to create your first milestone.</p>
          </AdminCard>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setFormData({});
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Timeline Item' : 'Add Timeline Item'}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.year || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Foundation Established"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe this milestone in your organization's journey..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <AdminButton 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                setFormData({});
                setEditingItem(null);
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSaveItem}>
              <Save className="w-4 h-4 mr-2" />
              {editingItem ? 'Update Item' : 'Save Item'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}