'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  BarChart3,
  Calendar,
  Clock,
  UserPlus,
  Target,
  Heart,
  MessageSquare,
  Activity,
  Mail,
  Edit,
  Eye,
  Settings,
  ChevronRight
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';

export default function HomeManagement() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const homeSections = [
    {
      id: 'hero-section',
      title: 'Hero Section',
      description: 'Main banner with video background and call-to-action',
      icon: Zap,
      color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      href: '/admin/home/hero-section',
      status: 'active',
      lastUpdated: '2 days ago'
    },
    {
      id: 'stats-section',
      title: 'Stats Section',
      description: 'Key statistics and achievements display',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-green-500 to-teal-600',
      href: '/admin/home/stats-section',
      status: 'active',
      lastUpdated: '1 week ago'
    },
    {
      id: 'events-section',
      title: 'Events Section',
      description: 'Upcoming events and registration links',
      icon: Calendar,
      color: 'bg-gradient-to-r from-red-500 to-pink-600',
      href: '/admin/home/events-section',
      status: 'active',
      lastUpdated: '3 days ago'
    },
    {
      id: 'daily-activities',
      title: 'Daily Activities',
      description: 'Regular ongoing activities and programs',
      icon: Clock,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      href: '/admin/home/daily-activities',
      status: 'active',
      lastUpdated: '5 days ago'
    },
    {
      id: 'volunteer-opportunities',
      title: 'Volunteer Opportunities',
      description: 'Ways people can get involved and volunteer',
      icon: UserPlus,
      color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
      href: '/admin/home/volunteer-opportunities',
      status: 'active',
      lastUpdated: '1 day ago'
    },
    {
      id: 'impact-section',
      title: 'Impact Section',
      description: 'Showcase of achievements and impact made',
      icon: Target,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      href: '/admin/home/impact-section',
      status: 'active',
      lastUpdated: '4 days ago'
    },
    {
      id: 'featured-causes',
      title: 'Featured Causes',
      description: 'Highlighted causes needing immediate support',
      icon: Heart,
      color: 'bg-gradient-to-r from-rose-500 to-red-600',
      href: '/admin/home/featured-causes',
      status: 'active',
      lastUpdated: '2 days ago'
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Stories and feedback from beneficiaries',
      icon: MessageSquare,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      href: '/admin/home/testimonials',
      status: 'active',
      lastUpdated: '1 week ago'
    },
    {
      id: 'call-to-action',
      title: 'Call to Action',
      description: 'Main donation and engagement prompts',
      icon: Activity,
      color: 'bg-gradient-to-r from-emerald-500 to-green-600',
      href: '/admin/home/call-to-action',
      status: 'active',
      lastUpdated: '3 days ago'
    },
    {
      id: 'newsletter',
      title: 'Newsletter Section',
      description: 'Email subscription and newsletter signup',
      icon: Mail,
      color: 'bg-gradient-to-r from-violet-500 to-purple-600',
      href: '/admin/home/newsletter',
      status: 'active',
      lastUpdated: '6 days ago'
    }
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Home Page Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage all sections and content on your homepage
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview Home
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            Global Settings
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">10</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Sections</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">10</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Sections</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2.5k</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Daily Views</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Engagement Rate</div>
          </div>
        </AdminCard>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeSections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={section.href}>
              <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer">
                {/* Section Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        section.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {section.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {section.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Section Footer */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Last updated: {section.lastUpdated}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <AdminCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <Settings className="w-5 h-5 mr-2" />
              Bulk Edit Sections
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <Eye className="w-5 h-5 mr-2" />
              Preview Changes
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <Activity className="w-5 h-5 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}