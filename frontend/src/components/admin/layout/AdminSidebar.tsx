'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Heart,
  Calendar,
  FileText,
  Image,
  DollarSign,
  UserCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  BarChart3,
  X,
  Info,
  Activity,
  Award,
  MessageSquare,
  Mail,
  Target,
  Clock,
  Zap,
  Camera,
  Upload,
  Shield,
  Palette,
  CreditCard,
  Bell,
  UserPlus,
  Building,
  Map,
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  icon: any;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: BarChart3,
    href: '/admin'
  },
  {
    title: 'Home Page',
    icon: Home,
    children: [
      { title: 'Hero Section', icon: Zap, href: '/admin/home/hero-section' },
      { title: 'Stats Section', icon: BarChart3, href: '/admin/home/stats-section' },
      { title: 'Events Section', icon: Calendar, href: '/admin/home/events-section' },
      { title: 'Daily Activities', icon: Clock, href: '/admin/home/daily-activities' },
      { title: 'Volunteer Opportunities', icon: UserPlus, href: '/admin/home/volunteer-opportunities' },
      { title: 'Impact Section', icon: Target, href: '/admin/home/impact-section' },
      { title: 'Featured Causes', icon: Heart, href: '/admin/home/featured-causes' },
      { title: 'Testimonials', icon: MessageSquare, href: '/admin/home/testimonials' },
      { title: 'Call to Action', icon: Activity, href: '/admin/home/call-to-action' },
      { title: 'Newsletter', icon: Mail, href: '/admin/home/newsletter' }
    ]
  },
  {
    title: 'About Page',
    icon: Info,
    children: [
      { title: 'About Content', icon: FileText, href: '/admin/about' },
      { title: 'Team Members', icon: Users, href: '/admin/about/team' },
      { title: 'Company Timeline', icon: Map, href: '/admin/about/timeline' }
    ]
  },
  {
    title: 'Causes',
    icon: Heart,
    children: [
      { title: 'All Causes', icon: Heart, href: '/admin/causes' },
      { title: 'Create Cause', icon: Award, href: '/admin/causes/create' }
    ]
  },
  {
    title: 'Events',
    icon: Calendar,
    children: [
      { title: 'All Events', icon: Calendar, href: '/admin/events' },
      { title: 'Create Event', icon: Activity, href: '/admin/events/create' }
    ]
  },
  {
    title: 'Blog',
    icon: FileText,
    children: [
      { title: 'All Posts', icon: FileText, href: '/admin/blog' },
      { title: 'Create Post', icon: FileText, href: '/admin/blog/create' }
    ]
  },
  {
    title: 'Donations',
    icon: DollarSign,
    children: [
      { title: 'Overview', icon: BarChart3, href: '/admin/donations' },
      { title: 'Transactions', icon: DollarSign, href: '/admin/donations/transactions' },
      { title: 'Analytics', icon: BarChart3, href: '/admin/donations/analytics' }
    ]
  },
  {
    title: 'Volunteers',
    icon: UserCheck,
    children: [
      { title: 'All Volunteers', icon: UserCheck, href: '/admin/volunteers' },
      { title: 'Applications', icon: UserPlus, href: '/admin/volunteers/applications' }
    ]
  },
  {
    title: 'Gallery',
    icon: Image,
    children: [
      { title: 'All Media', icon: Image, href: '/admin/gallery' },
      { title: 'Upload Media', icon: Upload, href: '/admin/gallery/upload' }
    ]
  },
  {
    title: 'Users',
    icon: Users,
    children: [
      { title: 'All Users', icon: Users, href: '/admin/users' },
      { title: 'Permissions', icon: Shield, href: '/admin/users/permissions' }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'General', icon: Settings, href: '/admin/settings' },
      { title: 'Appearance', icon: Palette, href: '/admin/settings/appearance' },
      { title: 'Payments', icon: CreditCard, href: '/admin/settings/payments' },
      { title: 'Notifications', icon: Bell, href: '/admin/settings/notifications' }
    ]
  }
];

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isParentActive = (children: MenuItem[]) => {
    return children.some(child => child.href && pathname === child.href);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Panel
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isParentActive(item.children)
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.title}
                    </div>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedItems.includes(item.title) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-2 space-y-1"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href!}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(child.href!)
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                          >
                            <child.icon className="w-4 h-4 mr-3" />
                            {child.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href!)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@charity.org</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}