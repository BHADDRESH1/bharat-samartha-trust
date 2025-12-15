'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Heart,
  DollarSign,
  Users,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTable } from '@/components/admin/ui/AdminTable';
import { AdminModal } from '@/components/admin/ui/AdminModal';

interface Cause {
  id: number;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  donors: number;
  status: 'active' | 'paused' | 'completed';
  category: string;
  createdAt: string;
  endDate: string;
}

export default function CausesManagement() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [causes] = useState<Cause[]>([
    {
      id: 1,
      title: 'Clean Water Initiative',
      description: 'Providing clean water access to remote villages in Africa',
      image: '/images/causes/water.jpg',
      goal: 25000,
      raised: 15000,
      donors: 123,
      status: 'active',
      category: 'Health',
      createdAt: '2024-01-15',
      endDate: '2024-06-30'
    },
    {
      id: 2,
      title: 'Education for All',
      description: 'Supporting underprivileged children with quality education',
      image: '/images/causes/education.jpg',
      goal: 50000,
      raised: 28000,
      donors: 245,
      status: 'active',
      category: 'Education',
      createdAt: '2024-02-01',
      endDate: '2024-12-31'
    },
    {
      id: 3,
      title: 'Healthcare Access',
      description: 'Mobile medical camps for rural communities',
      image: '/images/causes/healthcare.jpg',
      goal: 30000,
      raised: 12000,
      donors: 98,
      status: 'active',
      category: 'Health',
      createdAt: '2024-01-20',
      endDate: '2024-08-15'
    },
    {
      id: 4,
      title: 'Emergency Relief Fund',
      description: 'Disaster relief for affected communities',
      image: '/images/causes/relief.jpg',
      goal: 100000,
      raised: 85000,
      donors: 456,
      status: 'active',
      category: 'Emergency',
      createdAt: '2024-03-01',
      endDate: '2024-05-30'
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredCauses = causes.filter(cause => {
    const matchesSearch = cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cause.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cause.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'completed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const handleDeleteCause = (cause: Cause) => {
    setSelectedCause(cause);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Delete logic here
    console.log('Deleting cause:', selectedCause?.id);
    setIsDeleteModalOpen(false);
    setSelectedCause(null);
  };

  const columns = [
    {
      key: 'title',
      label: 'Cause',
      render: (value: string, row: Cause) => (
        <div className="flex items-center space-x-3">
          <img 
            src={row.image} 
            alt={row.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{row.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{row.category}</div>
          </div>
        </div>
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (value: any, row: Cause) => (
        <div className="w-32">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">
              ${row.raised.toLocaleString()}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {getProgressPercentage(row.raised, row.goal).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage(row.raised, row.goal)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Goal: ${row.goal.toLocaleString()}
          </div>
        </div>
      )
    },
    {
      key: 'donors',
      label: 'Donors',
      render: (value: number) => (
        <div className="flex items-center text-sm">
          <Users className="w-4 h-4 mr-1 text-gray-400" />
          {value}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: Cause) => (
        <div className="flex items-center space-x-2">
          <Link href={`/causes/${row.id}`}>
            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/admin/causes/${row.id}`}>
            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </Link>
          <button 
            onClick={() => handleDeleteCause(row)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Causes Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and track all your fundraising causes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/admin/causes/create">
            <AdminButton icon={Plus}>
              Create New Cause
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Causes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {causes.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Raised
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ${causes.reduce((sum, cause) => sum + cause.raised, 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Donors
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {causes.reduce((sum, cause) => sum + cause.donors, 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Causes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {causes.filter(c => c.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Filters and Search */}
      <AdminCard>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search causes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Emergency">Emergency</option>
                <option value="Environment">Environment</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Causes Table */}
      <AdminCard>
        <div className="p-6">
          <AdminTable columns={columns} data={filteredCauses} />
        </div>
      </AdminCard>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Cause"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete "{selectedCause?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <AdminButton 
              variant="secondary" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton 
              variant="danger" 
              onClick={confirmDelete}
            >
              Delete
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}