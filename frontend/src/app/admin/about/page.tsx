'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home as Hero,  // Using Home as a replacement for Hero
  Users, 
  Target, 
  Clock, 
  UserCheck, 
  Star, 
  MessageCircle,
  Eye,
  Edit,
  Plus,
  BarChart3
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';

interface AboutSection {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  status: 'active' | 'draft';
  lastUpdated: string;
}

export default function AboutManagementPage() {
  const [sections, setSections] = useState<AboutSection[]>([
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Main banner with title, subtitle, and background',
      icon: Hero,
      href: '/admin/about/hero',
      status: 'active',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'who-we-are',
      name: 'Who We Are',
      description: 'Organization introduction and overview',
      icon: Users,
      href: '/admin/about/who-we-are',
      status: 'active',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'mission-vision',
      name: 'Mission & Vision',
      description: 'Mission statement, vision, and core values',
      icon: Target,
      href: '/admin/about/mission-vision',
      status: 'active',
      lastUpdated: '2024-01-13'
    },
    {
      id: 'timeline',
      name: 'Our Journey',
      description: 'Timeline of milestones and achievements',
      icon: Clock,
      href: '/admin/about/timeline',
      status: 'active',
      lastUpdated: '2024-01-12'
    },
    {
      id: 'team',
      name: 'Team Members',
      description: 'Leadership team and key personnel',
      icon: UserCheck,
      href: '/admin/about/team',
      status: 'active',
      lastUpdated: '2024-01-11'
    },
    {
      id: 'why-choose-us',
      name: 'Why Choose Us',
      description: 'Key differentiators and unique value propositions',
      icon: Star,
      href: '/admin/about/why-choose-us',
      status: 'active',
      lastUpdated: '2024-01-10'
    },
    {
      id: 'call-to-action',
      name: 'Call to Action',
      description: 'Final section CTA and engagement prompts',
      icon: MessageCircle,
      href: '/admin/about/call-to-action',
      status: 'active',
      lastUpdated: '2024-01-09'
    }
  ]);

  const [stats, setStats] = useState({
    totalSections: 7,
    activeSections: 7,
    draftSections: 0,
    lastUpdated: '2024-01-15'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Page Management</h1>
          <p className="text-gray-600 mt-1">Manage all sections of the About page</p>
        </div>
        <AdminButton>
          <Eye className="w-4 h-4 mr-2" />
          Preview Page
        </AdminButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sections</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSections}</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSections}</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draftSections}</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm font-bold text-gray-900">{stats.lastUpdated}</p>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sections.map((section) => (
          <AdminCard key={section.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <section.icon className="w-6 h-6 text-gray-600" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                section.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {section.status}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {section.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              {section.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Updated: {section.lastUpdated}</span>
            </div>
            
            <Link href={section.href}>
              <AdminButton variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Manage Section
              </AdminButton>
            </Link>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}