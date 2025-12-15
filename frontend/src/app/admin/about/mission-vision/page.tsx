// src/app/admin/about/mission-vision/page.tsx
'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import { Save, Eye, Plus, Edit, Trash2, Heart, Globe, Lightbulb, Star } from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import {AdminModal} from '@/components/admin/ui/AdminModal';
import { safeFetch } from '@/lib/fetchUtils';

interface CoreValue {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface MissionVisionData {
  mission: {
    title: string;
    content: string;
    isVisible: boolean;
  };
  vision: {
    title: string;
    content: string;
    isVisible: boolean;
  };
  coreValues: CoreValue[];
}

export default function MissionVisionManagement() {
  const [data, setData] = useState<MissionVisionData>({
    mission: {
      title: 'Our Mission',
      content: 'To create a world where every individual has access to basic human rights—food, education, healthcare, and dignity.',
      isVisible: true
    },
    vision: {
      title: 'Our Vision',
      content: 'To end poverty, uplift communities, and create sustainable solutions for a better tomorrow.',
      isVisible: true
    },
    coreValues: [
      {
        id: 1,
        title: 'Compassion',
        description: 'We approach every situation with empathy and understanding, putting people first.',
        icon: 'Heart'
      },
      {
        id: 2,
        title: 'Global Impact',
        description: 'We work across borders to create meaningful change in communities worldwide.',
        icon: 'Globe'
      },
      {
        id: 3,
        title: 'Innovation',
        description: 'We seek creative solutions to complex problems, always looking for better ways.',
        icon: 'Lightbulb'
      },
      {
        id: 4,
        title: 'Excellence',
        description: 'We strive for the highest standards in everything we do, never settling for less.',
        icon: 'Star'
      }
    ]
  });

  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null);
  const [valueFormData, setValueFormData] = useState<Partial<CoreValue>>({});

  const iconOptions = [
    { value: 'Heart', label: 'Heart', icon: Heart, color: 'text-purple-600' },
    { value: 'Globe', label: 'Globe', icon: Globe, color: 'text-blue-600' },
    { value: 'Lightbulb', label: 'Lightbulb', icon: Lightbulb, color: 'text-yellow-500' },
    { value: 'Star', label: 'Star', icon: Star, color: 'text-green-600' }
  ];

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    if (!iconOption) return <Star className="w-6 h-6 text-green-600" />;
    
    const IconComponent = iconOption.icon;
    return <IconComponent className={`w-6 h-6 ${iconOption.color}`} />;
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await safeFetch('/api/mission');
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch');
      }
    } catch (error) {
      console.error('Error fetching mission-vision data:', error);
      alert('Failed to load mission and vision data');
    }
  };

  fetchData();
}, []);

  const handleSave = async () => {
  try {
    const result = await safeFetch('/api/mission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (result.success) {
      alert('Changes saved successfully!');
    } else {
      throw new Error(result.error || 'Failed to save changes');
    }
  } catch (error) {
    alert('Failed to save changes');
    console.error(error);
  }
};

  const handleAddValue = () => {
    setEditingValue(null);
    setValueFormData({
      title: '',
      description: '',
      icon: 'Heart'
    });
    setIsValueModalOpen(true);
  };

  const handleEditValue = (value: CoreValue) => {
    setEditingValue(value);
    setValueFormData(value);
    setIsValueModalOpen(true);
  };

  const handleSaveValue = () => {
    if (!valueFormData.title || !valueFormData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingValue) {
      setData(prev => ({
        ...prev,
        coreValues: prev.coreValues.map(value => 
          value.id === editingValue.id 
            ? { ...value, ...valueFormData as CoreValue }
            : value
        )
      }));
    } else {
      const newId = Math.max(...data.coreValues.map(v => v.id), 0) + 1;
      const newValue: CoreValue = {
        id: newId,
        ...valueFormData as Omit<CoreValue, 'id'>
      };
      setData(prev => ({
        ...prev,
        coreValues: [...prev.coreValues, newValue]
      }));
    }
    setIsValueModalOpen(false);
    setValueFormData({});
  };

  const handleDeleteValue = (id: number) => {
    if (confirm('Are you sure you want to delete this core value?')) {
      setData(prev => ({
        ...prev,
        coreValues: prev.coreValues.filter(v => v.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mission & Vision</h1>
          <p className="text-gray-600 mt-1">Manage your organization's mission, vision, and core values</p>
        </div>
        <div className="flex gap-3">
          <AdminButton variant="secondary">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </AdminButton>
          <AdminButton onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mission */}
        <AdminCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mission Statement</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.mission.isVisible}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  mission: { ...prev.mission, isVisible: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={data.mission.title}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  mission: { ...prev.mission, title: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={data.mission.content}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  mission: { ...prev.mission, content: e.target.value }
                }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe your organization's mission..."
              />
            </div>
          </div>
        </AdminCard>

        {/* Vision */}
        <AdminCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Vision Statement</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.vision.isVisible}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  vision: { ...prev.vision, isVisible: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={data.vision.title}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  vision: { ...prev.vision, title: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={data.vision.content}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  vision: { ...prev.vision, content: e.target.value }
                }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your organization's vision..."
              />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Core Values */}
      <AdminCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Core Values</h2>
          <AdminButton onClick={handleAddValue}>
            <Plus className="w-4 h-4 mr-2" />
            Add Value
          </AdminButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.coreValues.map((value) => (
            <div key={value.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {getIconComponent(value.icon)}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditValue(value)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteValue(value.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {data.coreValues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No core values defined yet.</p>
            <p className="text-gray-400 mt-2">Click "Add Value" to create your first core value.</p>
          </div>
        )}
      </AdminCard>

      {/* Core Value Modal */}
      <AdminModal 
        isOpen={isValueModalOpen} 
        onClose={() => {
          setIsValueModalOpen(false);
          setValueFormData({});
          setEditingValue(null);
        }}
        title={editingValue ? 'Edit Core Value' : 'Add Core Value'}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={valueFormData.title || ''}
              onChange={(e) => setValueFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Compassion"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <select
              value={valueFormData.icon || 'Heart'}
              onChange={(e) => setValueFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="mt-2 flex gap-2">
              {iconOptions.map(option => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValueFormData(prev => ({ ...prev, icon: option.value }))}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      valueFormData.icon === option.value 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${option.color}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={valueFormData.description || ''}
              onChange={(e) => setValueFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe this core value and what it means to your organization..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <AdminButton 
              variant="secondary"
              onClick={() => {
                setIsValueModalOpen(false);
                setValueFormData({});
                setEditingValue(null);
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSaveValue}>
              <Save className="w-4 h-4 mr-2" />
              {editingValue ? 'Update Value' : 'Save Value'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}