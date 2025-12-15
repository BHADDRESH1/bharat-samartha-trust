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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Target,
} from "lucide-react";
import AdminCard from "@/components/admin/ui/AdminCard";

interface DonationData {
  date: string;
  amount: number;
  donors: number;
  goal: number;
  month?: string;
}

interface CauseData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

const DonationChart = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month"
  );
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");

  // Mock data - replace with real API data
  const weeklyData: DonationData[] = [
    { date: "Mon", amount: 2400, donors: 12, goal: 3000 },
    { date: "Tue", amount: 1800, donors: 8, goal: 3000 },
    { date: "Wed", amount: 3200, donors: 16, goal: 3000 },
    { date: "Thu", amount: 2800, donors: 14, goal: 3000 },
    { date: "Fri", amount: 4200, donors: 21, goal: 3000 },
    { date: "Sat", amount: 3800, donors: 19, goal: 3000 },
    { date: "Sun", amount: 2900, donors: 15, goal: 3000 },
  ];

  const monthlyData: DonationData[] = [
    { date: "Jan", amount: 45000, donors: 234, goal: 50000, month: "January" },
    { date: "Feb", amount: 38000, donors: 198, goal: 50000, month: "February" },
    { date: "Mar", amount: 52000, donors: 267, goal: 50000, month: "March" },
    { date: "Apr", amount: 48000, donors: 245, goal: 50000, month: "April" },
    { date: "May", amount: 61000, donors: 312, goal: 60000, month: "May" },
    { date: "Jun", amount: 58000, donors: 298, goal: 60000, month: "June" },
    { date: "Jul", amount: 65000, donors: 334, goal: 60000, month: "July" },
    { date: "Aug", amount: 72000, donors: 367, goal: 70000, month: "August" },
    {
      date: "Sep",
      amount: 68000,
      donors: 345,
      goal: 70000,
      month: "September",
    },
    { date: "Oct", amount: 74000, donors: 378, goal: 70000, month: "October" },
    { date: "Nov", amount: 82000, donors: 421, goal: 80000, month: "November" },
    { date: "Dec", amount: 89000, donors: 456, goal: 80000, month: "December" },
  ];

  const yearlyData: DonationData[] = [
    { date: "2020", amount: 480000, donors: 2400, goal: 500000 },
    { date: "2021", amount: 620000, donors: 3100, goal: 600000 },
    { date: "2022", amount: 750000, donors: 3750, goal: 700000 },
    { date: "2023", amount: 890000, donors: 4450, goal: 850000 },
    { date: "2024", amount: 1200000, donors: 6000, goal: 1000000 },
  ];

  const causeData: CauseData[] = [
    { name: "Education", amount: 125000, percentage: 35, color: "#3B82F6" },
    { name: "Healthcare", amount: 89000, percentage: 25, color: "#10B981" },
    { name: "Clean Water", amount: 71000, percentage: 20, color: "#F59E0B" },
    {
      name: "Emergency Relief",
      amount: 54000,
      percentage: 15,
      color: "#EF4444",
    },
    { name: "Environment", amount: 18000, percentage: 5, color: "#8B5CF6" },
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
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const totalDonors = data.reduce((sum, item) => sum + item.donors, 0);
  const avgDonation = totalAmount / totalDonors;
  const lastPeriodAmount = data[data.length - 2]?.amount || 0;
  const currentPeriodAmount = data[data.length - 1]?.amount || 0;
  const growthRate =
    lastPeriodAmount > 0
      ? ((currentPeriodAmount - lastPeriodAmount) / lastPeriodAmount) * 100
      : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{`${
            timeframe === "month" ? payload[0]?.payload?.month || label : label
          }`}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Amount: ${payload[0]?.value?.toLocaleString()}
          </p>
          {payload[1] && (
            <p className="text-green-600 dark:text-green-400">
              Donors: {payload[1]?.value}
            </p>
          )}
          {payload[2] && (
            <p className="text-orange-600 dark:text-orange-400">
              Goal: ${payload[2]?.value?.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
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
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="goal"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
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
              dataKey="amount"
              stroke="#3B82F6"
              fill="url(#colorAmount)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="goal"
              stroke="#F59E0B"
              fill="url(#colorGoal)"
              strokeWidth={2}
              fillOpacity={0.3}
            />
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
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
            <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="goal"
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.6}
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
                Total Raised
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalAmount.toLocaleString()}
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
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Donors
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalDonors.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Active supporters
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg Donation
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${avgDonation.toFixed(0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Per donor
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                This Period
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${currentPeriodAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current {timeframe}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Main Chart */}
      <AdminCard>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Donation Analytics
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track donation trends and goal progress
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

      {/* Donation by Cause */}
      <div className="grid grid-cols-1 gap-8">
        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Donations by Cause
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={causeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {causeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Amount",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Cause Breakdown
          </h3>
          <div className="space-y-5">
            {causeData.map((cause, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cause.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {cause.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${cause.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {cause.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
};

export default DonationChart;
