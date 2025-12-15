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
  Edit,
  Eye,
  Trash2,
  ImageIcon,
  FileText,
  Settings,
  MapPin,
  Calendar,
  Camera,
  TrendingUp,
  Share2,
  Award
} from 'lucide-react';

interface CauseStats {
  totalCauses: number;
  totalDonors: number;
  totalRaised: number;
  activeCampaigns: number;
  totalBeneficiaries: number;
  completionRate: number;
}

interface CauseUpdate {
  date: string;
  title: string;
  content: string;
}

interface Cause {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  raised: number;
  goal: number;
  donors: number;
  progress: number;
  status: 'active' | 'paused' | 'completed';
  image: string;
  gallery: string[];
  location: string;
  beneficiaries: string;
  startDate: string;
  endDate: string;
  lastUpdated: string;
  updates: CauseUpdate[];
}

export default function EnhancedCausesManagement() {
  const [stats, setStats] = useState<CauseStats>({
    totalCauses: 8,
    totalDonors: 15420,
    totalRaised: 8750000,
    activeCampaigns: 6,
    totalBeneficiaries: 25000,
    completionRate: 73
  });

  const [causes, setCauses] = useState<Cause[]>([
    {
      id: 1,
      title: "Clean Water Initiative",
      description: "Providing access to clean and safe drinking water in rural communities across Africa.",
      longDescription: "Access to clean water is a fundamental human right, yet millions of people around the world still lack this basic necessity...",
      category: "Water",
      raised: 1500000,
      goal: 2000000,
      donors: 3245,
      progress: 75,
      status: 'active',
      image: '/images/causes/clean-water.jpg',
      gallery: ['/images/causes/gallery/water-1.jpg', '/images/causes/gallery/water-2.jpg', '/images/causes/gallery/water-3.jpg'],
      location: 'Multiple villages in Kenya and Tanzania',
      beneficiaries: '5,000+ people across 12 villages',
      startDate: 'January 2023',
      endDate: 'December 2025',
      lastUpdated: '2024-12-15',
      updates: [
        { date: 'March 15, 2023', title: 'First well completed in Mbita Village', content: 'We are thrilled to announce the completion of our first well in Mbita Village...' },
        { date: 'June 22, 2023', title: 'Water purification systems installed', content: 'Thanks to your generous donations, we have installed 5 water purification systems...' }
      ]
    },
    {
      id: 2,
      title: "Education for All",
      description: "Building schools and providing educational resources for underprivileged children.",
      longDescription: "Education is the foundation of a better future...",
      category: "Education",
      raised: 1200000,
      goal: 1800000,
      donors: 2156,
      progress: 67,
      status: 'active',
      image: '/images/causes/education.jpg',
      gallery: ['/images/causes/gallery/edu-1.jpg', '/images/causes/gallery/edu-2.jpg'],
      location: 'Rural communities in India and Bangladesh',
      beneficiaries: '3,500+ children across 8 schools',
      startDate: 'March 2023',
      endDate: 'March 2026',
      lastUpdated: '2024-12-14',
      updates: [
        { date: 'August 10, 2023', title: 'New school opened in Delhi', content: 'Our latest school facility is now operational...' }
      ]
    },
    {
      id: 3,
      title: "Healthcare Access",
      description: "Improving healthcare facilities and access in remote areas.",
      longDescription: "Healthcare is a basic human right that should be accessible to all...",
      category: "Healthcare",
      raised: 980000,
      goal: 1500000,
      donors: 1879,
      progress: 65,
      status: 'active',
      image: '/images/causes/healthcare.jpg',
      gallery: ['/images/causes/gallery/health-1.jpg', '/images/causes/gallery/health-2.jpg', '/images/causes/gallery/health-3.jpg'],
      location: 'Remote villages in Nepal and Myanmar',
      beneficiaries: '8,000+ people across 15 villages',
      startDate: 'June 2023',
      endDate: 'June 2025',
      lastUpdated: '2024-12-13',
      updates: [
        { date: 'September 5, 2023', title: 'Mobile clinic launched', content: 'Our new mobile healthcare unit is serving remote communities...' }
      ]
    },
    {
      id: 4,
      title: "Sustainable Farming",
      description: "Teaching sustainable farming techniques to improve food security.",
      longDescription: "Sustainable agriculture is key to ensuring food security for future generations...",
      category: "Agriculture",
      raised: 750000,
      goal: 1000000,
      donors: 1234,
      progress: 75,
      status: 'active',
      image: '/images/causes/farming.jpg',
      gallery: ['/images/causes/gallery/farm-1.jpg', '/images/causes/gallery/farm-2.jpg'],
      location: 'Farming communities in Ethiopia and Uganda',
      beneficiaries: '2,200+ farmers and families',
      startDate: 'February 2023',
      endDate: 'February 2025',
      lastUpdated: '2024-12-12',
      updates: [
        { date: 'July 20, 2023', title: 'Training program reaches 500 farmers', content: 'Our sustainable farming workshops have been a great success...' }
      ]
    }
  ]);

  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);
  const [showCauseModal, setShowCauseModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
      title: 'Hero Section',
      description: 'Manage the main hero banner with background video/image',
      href: '/admin/causes/hero',
      icon: Target,
      color: 'bg-blue-500',
      items: ['Background Media', 'Hero Title', 'Hero Description', 'CTA Buttons']
    },
    {
      title: 'Cause Details',
      description: 'Manage individual cause information and content',
      href: '/admin/causes/details',
      icon: Heart,
      color: 'bg-red-500',
      items: ['Basic Info', 'Long Description', 'Project Details', 'Gallery Management']
    },
    {
      title: 'Progress Tracking',
      description: 'Update fundraising progress and goals',
      href: '/admin/causes/progress',
      icon: TrendingUp,
      color: 'bg-green-500',
      items: ['Funding Goals', 'Current Progress', 'Donor Statistics', 'Milestones']
    },
    {
      title: 'Updates & News',
      description: 'Manage cause updates and project news',
      href: '/admin/causes/updates',
      icon: MessageSquare,
      color: 'bg-purple-500',
      items: ['Recent Updates', 'Project News', 'Timeline Events', 'Announcements']
    },
    {
      title: 'Gallery Management',
      description: 'Manage photo galleries and media content',
      href: '/admin/causes/gallery',
      icon: ImageIcon,
      color: 'bg-indigo-500',
      items: ['Photo Gallery', 'Before/After Images', 'Video Content', 'Media Library']
    },
    {
      title: 'Donation Settings',
      description: 'Configure donation options and payment settings',
      href: '/admin/causes/donations',
      icon: Settings,
      color: 'bg-orange-500',
      items: ['Donation Amounts', 'Payment Methods', 'Tax Settings', 'Receipt Templates']
    },
    {
      title: 'Social Sharing',
      description: 'Manage social media integration and sharing options',
      href: '/admin/causes/social',
      icon: Share2,
      color: 'bg-pink-500',
      items: ['Share Buttons', 'Social Media Links', 'Sharing Templates', 'Campaign Hashtags']
    },
    {
      title: 'Related Causes',
      description: 'Manage related causes and cross-promotion',
      href: '/admin/causes/related',
      icon: Award,
      color: 'bg-teal-500',
      items: ['Cause Relationships', 'Cross-promotion', 'Category Management', 'Featured Causes']
    }
  ];

  const viewCauseDetails = (cause: Cause) => {
    setSelectedCause(cause);
    setShowCauseModal(true);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Causes Management</h1>
          <p className="text-gray-600 mt-2">Manage your cause campaigns, content, and donor engagement</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/causes/analytics"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
          <Link
            href="/admin/causes/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Cause
          </Link>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Beneficiaries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBeneficiaries.toLocaleString()}+</p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-teal-500" />
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Management Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-gray-600 text-sm mb-3">{section.description}</p>
                <div className="space-y-1">
                  {section.items.map((item, idx) => (
                    <span key={idx} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2 mb-1">
                      {item}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Causes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Active Causes</h2>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
              <option>All Categories</option>
              <option>Water</option>
              <option>Education</option>
              <option>Healthcare</option>
              <option>Agriculture</option>
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Paused</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cause Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Beneficiaries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress & Funding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {causes.map((cause) => (
                <tr key={cause.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <img
                        src={cause.image}
                        alt={cause.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{cause.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs">{cause.description}</div>
                        <div className="flex items-center mt-1">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {cause.category}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {cause.gallery.length} photos
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-900 mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="font-medium">{cause.location}</span>
                      </div>
                      <div className="text-gray-600 text-xs">{cause.beneficiaries}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {formatCurrency(cause.raised)} / {formatCurrency(cause.goal)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${cause.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{cause.progress}% completed</span>
                        <span>{cause.donors.toLocaleString()} donors</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {cause.updates.length} updates posted
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span className="text-xs">{cause.startDate} - {cause.endDate}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated {cause.lastUpdated}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cause.status)}`}>
                      {cause.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => viewCauseDetails(cause)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link 
                        href={`/admin/causes/edit/${cause.id}`}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Edit Cause"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/causes/gallery/${cause.id}`}
                        className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                        title="Manage Gallery"
                      >
                        <Camera className="w-4 h-4" />
                      </Link>
                      <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cause Details Modal */}
      {showCauseModal && selectedCause && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCause.title}</h2>
                <button 
                  onClick={() => setShowCauseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedCause.image} 
                    alt={selectedCause.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900">{selectedCause.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Beneficiaries</p>
                      <p className="text-gray-900">{selectedCause.beneficiaries}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Timeline</p>
                      <p className="text-gray-900">{selectedCause.startDate} - {selectedCause.endDate}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full" 
                          style={{ width: `${selectedCause.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>{formatCurrency(selectedCause.raised)}</span>
                        <span>{formatCurrency(selectedCause.goal)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Recent Updates</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedCause.updates.map((update, index) => (
                          <div key={index} className="border-l-2 border-blue-500 pl-3">
                            <p className="text-xs text-gray-500">{update.date}</p>
                            <p className="text-sm font-medium text-gray-900">{update.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Gallery</p>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedCause.gallery.map((image, index) => (
                          <img 
                            key={index}
                            src={image} 
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowCauseModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <Link 
                  href={`/admin/causes/edit/${selectedCause.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit Cause
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}