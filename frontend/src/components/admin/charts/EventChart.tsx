'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, Users, TrendingUp, Activity } from 'lucide-react';

interface EventData {
  name: string;
  participants: number;
  registered: number;
  capacity: number;
  date: string;
  type: string;
}

interface ParticipationTrend {
  month: string;
  events: number;
  participants: number;
  averageAttendance: number;
}

interface EventTypeData {
  name: string;
  value: number;
  color: string;
}

const EventChart = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'types' | 'upcoming'>('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data for recent events
  const recentEvents: EventData[] = [
    {
      name: 'Charity Gala',
      participants: 245,
      registered: 280,
      capacity: 300,
      date: '2024-03-15',
      type: 'Fundraising'
    },
    {
      name: 'Community Run',
      participants: 156,
      registered: 180,
      capacity: 200,
      date: '2024-03-20',
      type: 'Sports'
    },
    {
      name: 'Food Drive',
      participants: 89,
      registered: 120,
      capacity: 150,
      date: '2024-03-25',
      type: 'Community Service'
    },
    {
      name: 'Tech Workshop',
      participants: 67,
      registered: 75,
      capacity: 80,
      date: '2024-04-01',
      type: 'Education'
    },
    {
      name: 'Health Camp',
      participants: 134,
      registered: 150,
      capacity: 180,
      date: '2024-04-05',
      type: 'Healthcare'
    },
    {
      name: 'Art Exhibition',
      participants: 198,
      registered: 220,
      capacity: 250,
      date: '2024-04-10',
      type: 'Cultural'
    }
  ];

  // Mock data for participation trends
  const participationTrends: ParticipationTrend[] = [
    { month: 'Jan', events: 12, participants: 1420, averageAttendance: 118 },
    { month: 'Feb', events: 15, participants: 1680, averageAttendance: 112 },
    { month: 'Mar', events: 18, participants: 2100, averageAttendance: 117 },
    { month: 'Apr', events: 14, participants: 1890, averageAttendance: 135 },
    { month: 'May', events: 16, participants: 2240, averageAttendance: 140 },
    { month: 'Jun', events: 20, participants: 2800, averageAttendance: 140 }
  ];

  // Mock data for event types
  const eventTypes: EventTypeData[] = [
    { name: 'Fundraising', value: 35, color: '#3B82F6' },
    { name: 'Community Service', value: 25, color: '#10B981' },
    { name: 'Education', value: 20, color: '#F59E0B' },
    { name: 'Healthcare', value: 12, color: '#EF4444' },
    { name: 'Sports', value: 5, color: '#8B5CF6' },
    { name: 'Cultural', value: 3, color: '#EC4899' }
  ];

  if (!mounted) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Event Participation Analytics
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track event attendance and engagement metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Last 6 months</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview', icon: Activity },
            { key: 'trends', label: 'Trends', icon: TrendingUp },
            { key: 'types', label: 'Event Types', icon: Calendar },
            { key: 'upcoming', label: 'Upcoming', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Events</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">95</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Participants</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">12,130</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg Attendance</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">128</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Success Rate</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">87%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Events Performance */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Events Performance</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recentEvents}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="participants" fill="#3B82F6" name="Actual Participants" />
                  <Bar dataKey="registered" fill="#93C5FD" name="Registered" />
                  <Bar dataKey="capacity" fill="#E5E7EB" name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Participation Trends Over Time</h4>
            
            {/* Monthly Participation Trend */}
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={participationTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="participants" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.2}
                  name="Total Participants"
                />
                <Line 
                  type="monotone" 
                  dataKey="averageAttendance" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Average Attendance"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Events per Month */}
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={participationTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="events" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  name="Events Organized"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'types' && (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Event Types Distribution</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend and Stats */}
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900 dark:text-white">Event Categories</h5>
                {eventTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {type.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {type.value}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ~{Math.round(type.value * 0.95)} events
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Events Registration</h4>
            
            {/* Upcoming Events List */}
            <div className="space-y-4">
              {recentEvents.slice(0, 4).map((event, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">{event.name}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{event.type} • {event.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {event.registered}/{event.capacity}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round((event.registered / event.capacity) * 100)}% filled
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Registration Trend */}
            <div className="mt-8">
              <h5 className="font-medium text-gray-900 dark:text-white mb-4">Registration vs Capacity</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={recentEvents.slice(0, 4)}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="registered" fill="#3B82F6" name="Registered" />
                  <Bar dataKey="capacity" fill="#E5E7EB" name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventChart;