'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Target, 
  MessageSquare, 
  BarChart3,
  Plus,
  Image as ImageIcon,
  FileText,
  Settings
} from 'lucide-react';
import { safeFetch } from '@/lib/fetchUtils';

interface CauseStats {
  totalCauses: number;
  totalDonors: number;
  totalRaised: number;
  activeCampaigns: number;
}

interface Cause {
  _id?: string;
  id: string;
  title: string;
  description: string;
  category: string;
  raisedAmount: number;
  goalAmount: number;
  image: string;
  status: 'active' | 'paused' | 'completed';
  lastUpdated: string;
}

export default function CausesManagement() {
  const [stats, setStats] = useState<CauseStats>({
    totalCauses: 0,
    totalDonors: 0,
    totalRaised: 0,
    activeCampaigns: 0
  });

  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch causes from API
  const fetchCauses = async () => {
    try {
      setLoading(true);
      const result = await safeFetch('/api/causeList');
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch causes');
      }
      
      const data = result.data;
      setCauses(data);
      
      // Calculate stats from fetched data
      const totalCauses = data.length;
      const activeCampaigns = data.filter((cause: Cause) => cause.status === 'active').length;
      const totalRaised = data.reduce((sum: number, cause: Cause) => sum + cause.raisedAmount, 0);
      
      // Calculate approximate donors (you might want to add this field to your schema)
      const totalDonors = Math.floor(totalRaised / 1000); // Rough estimate
      
      setStats({
        totalCauses,
        totalDonors,
        totalRaised,
        activeCampaigns
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching causes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch causes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const managementSections = [
    {
      title: 'Hero Banner',
      description: 'Manage the causes page hero section with video background',
      href: '/admin/causes/hero',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Introduction',
      description: 'Edit the introduction section content',
      href: '/admin/causes/introduction',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Impact Stats',
      description: 'Update impact statistics and achievements',
      href: '/admin/causes/stats',
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'Causes List',
      description: 'Manage individual causes and campaigns',
      href: '/admin/causes/causes-list',
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      title: 'Testimonials',
      description: 'Manage testimonials and success stories',
      href: '/admin/causes/testimonials',
      icon: MessageSquare,
      color: 'bg-yellow-500'
    },
    {
      title: 'Before & After',
      description: 'Manage before/after transformation slider',
      href: '/admin/causes/before-after',
      icon: ImageIcon,
      color: 'bg-indigo-500'
    },
    {
      title: 'Call to Action',
      description: 'Edit the CTA section with parallax effects',
      href: '/admin/causes/cta',
      icon: Settings,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Causes</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchCauses}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Causes Management</h1>
          <p className="text-gray-600 mt-2">Manage your causes page content and campaigns</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCauses}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
          <Link
            href="/admin/causes/causes-list"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Cause
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRaised)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
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
      </div>

      {/* Management Sections */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Page Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={section.href}
                className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`${section.color} p-3 rounded-lg`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Causes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Recent Causes</h2>
          <Link
            href="/admin/causes/causes-list"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {causes.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No causes found</h3>
              <p className="text-gray-500">Add your first cause to get started.</p>
            </div>
          ) : (
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
                    Status
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {causes.slice(0, 5).map((cause) => (
                  <tr key={cause._id || cause.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={cause.image}
                          alt={cause.title}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-cause.jpg';
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{cause.title}</div>
                          <div className="text-sm text-gray-500">
                            {cause.lastUpdated ? `Updated ${cause.lastUpdated}` : 'No update date'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{cause.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(cause.raisedAmount)} / {formatCurrency(cause.goalAmount)}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((cause.raisedAmount / cause.goalAmount) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round((cause.raisedAmount / cause.goalAmount) * 100)}% completed
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cause.status)}`}>
                        {cause.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}