"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Heart,
  Activity,
  AlertCircle,
} from "lucide-react";
import AdminCard from "@/components/admin/ui/AdminCard";
import DonationChart from "@/components/admin/charts/DonationChart";
import VisitorChart from "@/components/admin/charts/VisitorChart";
import EventChart from "@/components/admin/charts/EventChart";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 125000,
    totalDonors: 1250,
    totalVolunteers: 89,
    totalEvents: 24,
    monthlyGrowth: 12.5,
    activeCauses: 8,
  });

  useEffect(() => {
    setMounted(true);
    // Fetch dashboard data here
  }, []);

  const recentActivities = [
    {
      id: 1,
      type: "donation",
      message: "New donation of $500 received from John Doe",
      time: "5 minutes ago",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "volunteer",
      message: "New volunteer application from Sarah Johnson",
      time: "1 hour ago",
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "event",
      message: "12 new registrations for Charity Gala",
      time: "2 hours ago",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      id: 4,
      type: "cause",
      message: "Clean Water Initiative reached 60% funding",
      time: "3 hours ago",
      icon: Heart,
      color: "text-red-600",
    },
  ];

  const quickActions = [
    {
      title: "Create New Event",
      description: "Add a new fundraising event",
      href: "/admin/events/create",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Add New Cause",
      description: "Create a new cause for donations",
      href: "/admin/causes/create",
      icon: Heart,
      color: "bg-red-500",
    },
    {
      title: "Manage Volunteers",
      description: "Review volunteer applications",
      href: "/admin/volunteers",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "View Analytics",
      description: "Check donation analytics",
      href: "/admin/donations/analytics",
      icon: BarChart3,
      color: "bg-purple-500",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your charity organization.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AdminCard>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Donations
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalDonations.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />+{stats.monthlyGrowth}%
                  this month
                </p>
              </div>
            </div>
          </AdminCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AdminCard>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Donors
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalDonors.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active supporters
                </p>
              </div>
            </div>
          </AdminCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AdminCard>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Volunteers
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalVolunteers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active volunteers
                </p>
              </div>
            </div>
          </AdminCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AdminCard>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Causes
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeCauses}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ongoing projects
                </p>
              </div>
            </div>
          </AdminCard>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AdminCard title="Donation Analytics">
            <DonationChart />
          </AdminCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AdminCard title="Website Visitors">
            <VisitorChart />
          </AdminCard>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <AdminCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-5">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all"
                >
                  <div
                    className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </a>
              ))}
            </div>
          </AdminCard>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <AdminCard title="Recent Activities">
            <div className="space-y-5">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 pb-5 border-b border-gray-100 dark:border-gray-700 last:pb-0 last:border-0"
                >
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </motion.div>
      </div>
    </div>
  );
}
