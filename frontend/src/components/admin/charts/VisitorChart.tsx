"use client";

import { useState, useEffect } from "react";
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Eye,
  Users,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AdminCard from "@/components/admin/ui/AdminCard";

interface VisitorData {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface DeviceData {
  device: string;
  visitors: number;
  percentage: number;
  color: string;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

interface PageData {
  page: string;
  views: number;
  uniqueViews: number;
  avgTime: string;
}

const VisitorChart = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month"
  );
  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");

  // Mock data - replace with real analytics API data
  const weeklyData: VisitorData[] = [
    {
      date: "Mon",
      visitors: 1240,
      pageViews: 3200,
      uniqueVisitors: 980,
      bounceRate: 45,
      avgSessionDuration: 180,
    },
    {
      date: "Tue",
      visitors: 980,
      pageViews: 2100,
      uniqueVisitors: 820,
      bounceRate: 52,
      avgSessionDuration: 165,
    },
    {
      date: "Wed",
      visitors: 1580,
      pageViews: 4200,
      uniqueVisitors: 1320,
      bounceRate: 38,
      avgSessionDuration: 210,
    },
    {
      date: "Thu",
      visitors: 1320,
      pageViews: 3800,
      uniqueVisitors: 1100,
      bounceRate: 42,
      avgSessionDuration: 195,
    },
    {
      date: "Fri",
      visitors: 1890,
      pageViews: 5200,
      uniqueVisitors: 1560,
      bounceRate: 35,
      avgSessionDuration: 225,
    },
    {
      date: "Sat",
      visitors: 2100,
      pageViews: 6800,
      uniqueVisitors: 1780,
      bounceRate: 40,
      avgSessionDuration: 240,
    },
    {
      date: "Sun",
      visitors: 1650,
      pageViews: 4500,
      uniqueVisitors: 1380,
      bounceRate: 43,
      avgSessionDuration: 200,
    },
  ];

  const monthlyData: VisitorData[] = [
    {
      date: "Jan",
      visitors: 28500,
      pageViews: 85000,
      uniqueVisitors: 22000,
      bounceRate: 45,
      avgSessionDuration: 180,
    },
    {
      date: "Feb",
      visitors: 32000,
      pageViews: 96000,
      uniqueVisitors: 25600,
      bounceRate: 42,
      avgSessionDuration: 195,
    },
    {
      date: "Mar",
      visitors: 35800,
      pageViews: 107000,
      uniqueVisitors: 28600,
      bounceRate: 38,
      avgSessionDuration: 210,
    },
    {
      date: "Apr",
      visitors: 38200,
      pageViews: 115000,
      uniqueVisitors: 30500,
      bounceRate: 40,
      avgSessionDuration: 205,
    },
    {
      date: "May",
      visitors: 42500,
      pageViews: 128000,
      uniqueVisitors: 34000,
      bounceRate: 36,
      avgSessionDuration: 220,
    },
    {
      date: "Jun",
      visitors: 45800,
      pageViews: 137000,
      uniqueVisitors: 36600,
      bounceRate: 34,
      avgSessionDuration: 235,
    },
    {
      date: "Jul",
      visitors: 48200,
      pageViews: 145000,
      uniqueVisitors: 38500,
      bounceRate: 35,
      avgSessionDuration: 228,
    },
    {
      date: "Aug",
      visitors: 52000,
      pageViews: 156000,
      uniqueVisitors: 41600,
      bounceRate: 33,
      avgSessionDuration: 245,
    },
    {
      date: "Sep",
      visitors: 49800,
      pageViews: 149000,
      uniqueVisitors: 39800,
      bounceRate: 37,
      avgSessionDuration: 215,
    },
    {
      date: "Oct",
      visitors: 54200,
      pageViews: 163000,
      uniqueVisitors: 43400,
      bounceRate: 32,
      avgSessionDuration: 250,
    },
    {
      date: "Nov",
      visitors: 58500,
      pageViews: 176000,
      uniqueVisitors: 46800,
      bounceRate: 30,
      avgSessionDuration: 265,
    },
    {
      date: "Dec",
      visitors: 61200,
      pageViews: 184000,
      uniqueVisitors: 49000,
      bounceRate: 29,
      avgSessionDuration: 270,
    },
  ];

  const yearlyData: VisitorData[] = [
    {
      date: "2020",
      visitors: 380000,
      pageViews: 1140000,
      uniqueVisitors: 304000,
      bounceRate: 48,
      avgSessionDuration: 165,
    },
    {
      date: "2021",
      visitors: 485000,
      pageViews: 1455000,
      uniqueVisitors: 388000,
      bounceRate: 44,
      avgSessionDuration: 185,
    },
    {
      date: "2022",
      visitors: 620000,
      pageViews: 1860000,
      uniqueVisitors: 496000,
      bounceRate: 40,
      avgSessionDuration: 205,
    },
    {
      date: "2023",
      visitors: 750000,
      pageViews: 2250000,
      uniqueVisitors: 600000,
      bounceRate: 36,
      avgSessionDuration: 225,
    },
    {
      date: "2024",
      visitors: 890000,
      pageViews: 2670000,
      uniqueVisitors: 712000,
      bounceRate: 32,
      avgSessionDuration: 245,
    },
  ];

  const deviceData: DeviceData[] = [
    { device: "Desktop", visitors: 18500, percentage: 42, color: "#3B82F6" },
    { device: "Mobile", visitors: 20800, percentage: 47, color: "#10B981" },
    { device: "Tablet", visitors: 4900, percentage: 11, color: "#F59E0B" },
  ];

  const trafficSources: TrafficSource[] = [
    {
      source: "Organic Search",
      visitors: 19800,
      percentage: 45,
      color: "#3B82F6",
    },
    { source: "Direct", visitors: 13200, percentage: 30, color: "#10B981" },
    {
      source: "Social Media",
      visitors: 6600,
      percentage: 15,
      color: "#F59E0B",
    },
    { source: "Referral", visitors: 3300, percentage: 7.5, color: "#EF4444" },
    { source: "Email", visitors: 1100, percentage: 2.5, color: "#8B5CF6" },
  ];

  const topPages: PageData[] = [
    { page: "/", views: 15800, uniqueViews: 12600, avgTime: "2:45" },
    { page: "/causes", views: 8900, uniqueViews: 7200, avgTime: "3:20" },
    { page: "/donate", views: 6500, uniqueViews: 5800, avgTime: "4:15" },
    { page: "/events", views: 5200, uniqueViews: 4400, avgTime: "2:30" },
    { page: "/about", views: 4800, uniqueViews: 4100, avgTime: "3:45" },
    { page: "/volunteer", views: 3900, uniqueViews: 3400, avgTime: "3:10" },
  ];

  const getCurrentData = () => {
    switch (timeframe) {
      case "week":
        return weeklyData;
      case "month":
        return monthlyData;
      case "year":
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  const data = getCurrentData();
  const totalVisitors = data.reduce((sum, item) => sum + item.visitors, 0);
  const totalPageViews = data.reduce((sum, item) => sum + item.pageViews, 0);
  const avgBounceRate =
    data.reduce((sum, item) => sum + item.bounceRate, 0) / data.length;
  const avgSessionDuration =
    data.reduce((sum, item) => sum + item.avgSessionDuration, 0) / data.length;

  const lastPeriod = data[data.length - 2]?.visitors || 0;
  const currentPeriod = data[data.length - 1]?.visitors || 0;
  const growthRate =
    lastPeriod > 0 ? ((currentPeriod - lastPeriod) / lastPeriod) * 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Visitors"
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="pageViews"
              stroke="#10B981"
              strokeWidth={2}
              name="Page Views"
              dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="visitors"
              stackId="1"
              stroke="#3B82F6"
              fill="url(#colorVisitors)"
              strokeWidth={2}
              name="Visitors"
            />
            <Area
              type="monotone"
              dataKey="uniqueVisitors"
              stackId="2"
              stroke="#10B981"
              fill="url(#colorUniqueVisitors)"
              strokeWidth={2}
              name="Unique Visitors"
            />
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient
                id="colorUniqueVisitors"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="visitors"
              fill="#3B82F6"
              name="Visitors"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="uniqueVisitors"
              fill="#10B981"
              name="Unique Visitors"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Visitors
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalVisitors.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                {growthRate >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    growthRate >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(growthRate).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Page Views
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPageViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total views
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg. Session
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(Math.round(avgSessionDuration))}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Duration
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Bounce Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgBounceRate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Average
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Main Chart */}
      <AdminCard>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Website Traffic
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monitor visitor trends and engagement
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
            {/* Timeframe Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {(["week", "month", "year"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    timeframe === period
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {(["area", "line", "bar"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    chartType === type
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </AdminCard>

      {/* Device & Traffic Sources */}
      <div className="grid grid-cols-1 gap-8">
        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Device Types
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="visitors"
                  label={({ device, percentage }) => `${device} ${percentage}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Visitors",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {deviceData.map((device, index) => {
              const Icon =
                device.device === "Desktop"
                  ? Monitor
                  : device.device === "Mobile"
                  ? Smartphone
                  : Tablet;
              return (
                <div key={index} className="text-center">
                  <Icon
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: device.color }}
                  />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.visitors.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {device.device}
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Traffic Sources
          </h3>
          <div className="space-y-5">
            {trafficSources.map((source, index) => (
              <div
                key={index}
                className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-gray-700 last:pb-0 last:border-0"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: source.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {source.source}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${source.percentage}%`,
                          backgroundColor: source.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {source.visitors.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {source.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Top Pages */}
      <AdminCard>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Pages
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  Page
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  Views
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  Unique Views
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  Avg. Time
                </th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {page.page === "/"
                        ? "Home"
                        : page.page.replace("/", "").charAt(0).toUpperCase() +
                          page.page.slice(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {page.page}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                    {page.uniqueViews.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                    {page.avgTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
};

export default VisitorChart;
