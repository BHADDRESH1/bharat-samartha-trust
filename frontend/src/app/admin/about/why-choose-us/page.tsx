'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Shield, 
  Heart, 
  BarChart3,
  Edit,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  ArrowLeft,
  Settings
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import Link from 'next/link';

interface Reason {
  id: number;
  title: string;
  description: string;
  iconType: 'shield' | 'heart' | 'chart' | 'check';
  order: number;
}

interface CTAButton {
  id: string;
  text: string;
  href: string;
  type: 'primary' | 'secondary' | 'tertiary';
  visible: boolean;
}

interface SectionContent {
  mainTitle: string;
  subtitle: string;
  ctaText: string;
}

const API_BASE_URL = 'http://localhost:5000/api/choose';

export default function WhyChooseUsAdmin() {
  const [isEditing, setIsEditing] = useState(false);
  const [reasons, setReasons] = useState<Reason[]>([
    {
      id: 1,
      title: '100% Transparent Donations',
      description: 'Every rupee is accounted for with our blockchain-based tracking system',
      iconType: 'shield',
      order: 1,
    },
    {
      id: 2,
      title: 'Real Impact, Real Stories',
      description: 'Testimonials and success stories from the people we help',
      iconType: 'heart',
      order: 2,
    },
    {
      id: 3,
      title: 'Technology for Change',
      description: 'AI-powered donation tracking & real-time impact reports',
      iconType: 'chart',
      order: 3,
    },
    {
      id: 4,
      title: 'Community-Driven',
      description: 'Built by the people, for the people with local participation',
      iconType: 'check',
      order: 4,
    },
  ]);

  const [sectionContent, setSectionContent] = useState<SectionContent>({
    mainTitle: 'Why Choose Us?',
    subtitle: '',
    ctaText: 'Your support changes lives. Be the reason someone smiles today!',
  });

  const [ctaButtons, setCtaButtons] = useState<CTAButton[]>([
    {
      id: 'donate',
      text: 'Donate Now',
      href: '/donate',
      type: 'primary',
      visible: true,
    },
    {
      id: 'volunteer',
      text: 'Volunteer',
      href: '/get-involved',
      type: 'secondary',
      visible: true,
    },
    {
      id: 'contact',
      text: 'Contact Us',
      href: '/contact',
      type: 'tertiary',
      visible: true,
    },
  ]);

  const [editingReason, setEditingReason] = useState<Reason | null>(null);

  const iconOptions = {
    shield: <Shield className="w-8 h-8 text-purple-600" />,
    heart: <Heart className="w-8 h-8 text-red-500" />,
    chart: <BarChart3 className="w-8 h-8 text-blue-500" />,
    check: <CheckCircle className="w-8 h-8 text-green-500" />,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_BASE_URL);
        if (res.data) {
          setSectionContent({
            mainTitle: res.data.mainTitle || '',
            subtitle: res.data.subtitle || '',
            ctaText: res.data.ctaText || '',
          });
          setReasons(res.data.reasons || []);
          setCtaButtons(res.data.ctaButtons || []);
        }
      } catch (error) {
        console.error('Error fetching Why Choose Us data:', error);
      }
    };

    fetchData();
  }, []);

  // Fixed: Generate unique ID properly
  const generateNewId = () => {
    if (reasons.length === 0) return 1;
    return Math.max(...reasons.map(r => r.id)) + 1;
  };

  // Fixed: Handle both add and edit operations correctly
  const handleSaveReason = (reason: Reason) => {
    if (reason.id === 0) {
      // Adding new reason
      const newReason = { 
        ...reason, 
        id: generateNewId(),
        order: reasons.length + 1
      };
      setReasons([...reasons, newReason]);
    } else {
      // Editing existing reason
      setReasons(reasons.map(r => r.id === reason.id ? reason : r));
    }
    setEditingReason(null);
  };

  const handleDeleteReason = (id: number) => {
    setReasons(reasons.filter(r => r.id !== id));
  };

  const handleReorderReasons = (dragIndex: number, hoverIndex: number) => {
    const draggedReason = reasons[dragIndex];
    const newReasons = [...reasons];
    newReasons.splice(dragIndex, 1);
    newReasons.splice(hoverIndex, 0, draggedReason);
    setReasons(newReasons.map((reason, index) => ({ ...reason, order: index + 1 })));
  };

  // Fixed: Add new reason with proper initial values
  const handleAddNewReason = () => {
    const newReason: Reason = {
      id: 0, // Temporary ID for new reasons
      title: '',
      description: '',
      iconType: 'shield',
      order: reasons.length + 1
    };
    setEditingReason(newReason);
  };

  const handleSaveSection = async () => {
    const payload = {
      mainTitle: sectionContent.mainTitle,
      subtitle: sectionContent.subtitle,
      ctaText: sectionContent.ctaText,
      reasons,
      ctaButtons,
    };

    try {
      await axios.post(API_BASE_URL, payload);
      console.log('Saved successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving Why Choose Us data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/admin/about">
            <AdminButton variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to About
            </AdminButton>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Why Choose Us Section</h1>
            <p className="text-gray-600 mt-1">Manage reasons and call-to-action buttons</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <AdminButton variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </AdminButton>
          {isEditing ? (
            <AdminButton onClick={handleSaveSection}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </AdminButton>
          ) : (
            <AdminButton onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Section
            </AdminButton>
          )}
        </div>
      </div>

      {/* Section Content */}
      <AdminCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={sectionContent.mainTitle}
              onChange={(e) => setSectionContent({ ...sectionContent, mainTitle: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={sectionContent.subtitle}
              onChange={(e) => setSectionContent({ ...sectionContent, subtitle: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call-to-Action Text
            </label>
            <textarea
              value={sectionContent.ctaText}
              onChange={(e) => setSectionContent({ ...sectionContent, ctaText: e.target.value })}
              disabled={!isEditing}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </AdminCard>

      {/* Reasons Management */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Reasons ({reasons.length})</h3>
        {isEditing && (
          <AdminButton
            size="sm"
            onClick={handleAddNewReason}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reason
          </AdminButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reasons.sort((a, b) => a.order - b.order).map((reason, index) => (
          <AdminCard key={reason.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {isEditing && (
                  <button className="cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-4 h-4" />
                  </button>
                )}
                <div className="p-2 bg-gray-100 rounded-lg">
                  {iconOptions[reason.iconType]}
                </div>
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingReason(reason)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReason(reason.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {reason.title}
            </h4>
            
            <p className="text-gray-600 text-sm">
              {reason.description}
            </p>
          </AdminCard>
        ))}
      </div>

      {/* CTA Buttons Management */}
      <AdminCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Call-to-Action Buttons</h3>
        <div className="space-y-4">
          {ctaButtons.map((button) => (
            <div key={button.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                checked={button.visible}
                onChange={(e) => setCtaButtons(ctaButtons.map(b => 
                  b.id === button.id ? { ...b, visible: e.target.checked } : b
                ))}
                disabled={!isEditing}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={button.text}
                  onChange={(e) => setCtaButtons(ctaButtons.map(b => 
                    b.id === button.id ? { ...b, text: e.target.value } : b
                  ))}
                  disabled={!isEditing}
                  placeholder="Button Text"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
                <input
                  type="text"
                  value={button.href}
                  onChange={(e) => setCtaButtons(ctaButtons.map(b => 
                    b.id === button.id ? { ...b, href: e.target.value } : b
                  ))}
                  disabled={!isEditing}
                  placeholder="Link URL"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
                <select
                  value={button.type}
                  onChange={(e) => setCtaButtons(ctaButtons.map(b => 
                    b.id === button.id ? { ...b, type: e.target.value as 'primary' | 'secondary' | 'tertiary' } : b
                  ))}
                  disabled={!isEditing}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="tertiary">Tertiary</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Edit Reason Modal */}
      {editingReason && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingReason.id === 0 ? 'Add New Reason' : 'Edit Reason'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingReason.title}
                  onChange={(e) => setEditingReason({ ...editingReason, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingReason.description}
                  onChange={(e) => setEditingReason({ ...editingReason, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(iconOptions).map(([key, icon]) => (
                    <button
                      key={key}
                      onClick={() => setEditingReason({ ...editingReason, iconType: key as any })}
                      className={`p-3 border rounded-lg flex items-center justify-center transition-colors ${
                        editingReason.iconType === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <AdminButton
                variant="outline"
                onClick={() => setEditingReason(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                onClick={() => handleSaveReason(editingReason)}
                disabled={!editingReason.title.trim() || !editingReason.description.trim()}
              >
                {editingReason.id === 0 ? 'Add' : 'Save'}
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}