'use client';
import { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  ArrowLeft,
  Settings,
  BarChart3,
  Plus,
  Trash2,
  GripVertical,
  TrendingUp,
  Users,
  Heart,
  Target,
  Globe
} from 'lucide-react';

interface StatItem {
  id: string;
  icon: string;
  value: string;
  label: string;
  suffix?: string;
  color: string;
  isActive: boolean;
  order: number;
}

// AdminCard component
const AdminCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    {children}
  </div>
);

export default function StatsSectionManagement() {
  const [mounted, setMounted] = useState(false);
  const [sectionSettings, setSectionSettings] = useState({
    title: 'Our Impact in Numbers',
    subtitle: 'Together, we\'ve achieved remarkable milestones in our mission to make the world a better place.',
    isActive: true,
    backgroundColor: 'white',
    animationType: 'countUp'
  });

  const [stats, setStats] = useState<StatItem[]>([
    {
      id: '1',
      icon: 'Heart',
      value: '2.5M',
      label: 'Donations Raised',
      suffix: '+',
      color: 'purple',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      icon: 'Users',
      value: '15000',
      label: 'Lives Changed',
      suffix: '+',
      color: 'blue',
      isActive: true,
      order: 2
    },
    {
      id: '3',
      icon: 'Globe',
      value: '25',
      label: 'Countries Reached',
      suffix: '+',
      color: 'green',
      isActive: true,
      order: 3
    },
    {
      id: '4',
      icon: 'TrendingUp',
      value: '120',
      label: 'Ongoing Projects',
      suffix: '+',
      color: 'orange',
      isActive: true,
      order: 4
    }
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
  setMounted(true);
  fetchStatsData();
}, []);

const fetchStatsData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/stat/stats');
    const data = await response.json();
    if (data) {
      setSectionSettings({
        title: data.title,
        subtitle: data.subtitle,
        isActive: data.isActive,
        backgroundColor: data.backgroundColor,
        animationType: data.animationType
      });
      setStats(data.stats || []);
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};


  const iconOptions = [
    { value: 'Users', label: 'Users', icon: Users },
    { value: 'Heart', label: 'Heart', icon: Heart },
    { value: 'Target', label: 'Target', icon: Target },
    { value: 'TrendingUp', label: 'Trending Up', icon: TrendingUp },
    { value: 'BarChart3', label: 'Bar Chart', icon: BarChart3 },
    { value: 'Globe', label: 'Globe', icon: Globe }
  ];

  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' }
  ];

  const handleSectionChange = (field: string, value: any) => {
    setSectionSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleStatChange = (id: string, field: string, value: any) => {
    setStats(prev => prev.map(stat => 
      stat.id === id ? { ...stat, [field]: value } : stat
    ));
    setHasChanges(true);
  };

  const addNewStat = () => {
    const newStat: StatItem = {
      id: Date.now().toString(),
      icon: 'Users',
      value: '0',
      label: 'New Stat',
      suffix: '',
      color: 'blue',
      isActive: true,
      order: stats.length + 1
    };
    setStats(prev => [...prev, newStat]);
    setHasChanges(true);
  };

  const deleteStat = (id: string) => {
    setStats(prev => prev.filter(stat => stat.id !== id));
    setHasChanges(true);
  };

  const handleSave = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/stat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...sectionSettings,
        stats
      })
    });

    const data = await response.json();
    console.log('Saved:', data);
    setHasChanges(false);
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};


  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Users,
      Heart,
      Target,
      TrendingUp,
      BarChart3,
      Globe
    };
    return iconMap[iconName] || Users;
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600'
    };
    return colorMap[color] || 'text-blue-600';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Stats Section Management
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage statistics and achievements displayed on your homepage
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        {hasChanges && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You have unsaved changes. Don't forget to save your work!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Settings */}
            <AdminCard>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Section Settings
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={sectionSettings.title}
                      onChange={(e) => handleSectionChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter section title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Section Subtitle
                    </label>
                    <textarea
                      value={sectionSettings.subtitle}
                      onChange={(e) => handleSectionChange('subtitle', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter section subtitle"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Background Color
                      </label>
                      <select
                        value={sectionSettings.backgroundColor}
                        onChange={(e) => handleSectionChange('backgroundColor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="white">White</option>
                        <option value="gray">Light Gray</option>
                        <option value="blue">Light Blue</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Animation Type
                      </label>
                      <select
                        value={sectionSettings.animationType}
                        onChange={(e) => handleSectionChange('animationType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="countUp">Count Up</option>
                        <option value="fadeIn">Fade In</option>
                        <option value="slideUp">Slide Up</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Statistics Management */}
            <AdminCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Statistics ({stats.length})
                    </h3>
                  </div>
                  <button
                    onClick={addNewStat}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Stat
                  </button>
                </div>
                
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.id}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Stat #{stat.order}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={stat.isActive}
                              onChange={(e) => handleStatChange(stat.id, 'isActive', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <button
                          onClick={() => deleteStat(stat.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Icon
                          </label>
                          <select
                            value={stat.icon}
                            onChange={(e) => handleStatChange(stat.id, 'icon', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          >
                            {iconOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Value
                          </label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="1000"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Suffix
                          </label>
                          <input
                            type="text"
                            value={stat.suffix || ''}
                            onChange={(e) => handleStatChange(stat.id, 'suffix', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="+ or %"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color
                          </label>
                          <select
                            value={stat.color}
                            onChange={(e) => handleStatChange(stat.id, 'color', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          >
                            {colorOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Lives Touched"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {stats.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No statistics added yet</p>
                      <button
                        onClick={addNewStat}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Add your first statistic
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Section Status */}
            <AdminCard>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Section Status
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sectionSettings.isActive}
                        onChange={(e) => handleSectionChange('isActive', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between mb-2">
                        <span>Total Stats:</span>
                        <span className="font-medium">{stats.length}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Active Stats:</span>
                        <span className="font-medium text-green-600">
                          {stats.filter(s => s.isActive).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="font-medium">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Live Preview */}
            <AdminCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Live Preview
                </h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    {stats.filter(s => s.isActive).slice(0, 4).map((stat) => {
                      const IconComponent = getIconComponent(stat.icon);
                      const colorClass = getColorClass(stat.color);
                      
                      return (
                        <div key={stat.id} className="flex flex-col items-center p-3 rounded-lg bg-gray-50 shadow-sm">
                          <IconComponent className={`w-8 h-8 ${colorClass} mb-2`} />
                          <div className="text-lg font-bold text-gray-800">
                            {stat.value}{stat.suffix}
                          </div>
                          <div className="text-xs text-gray-600 text-center">
                            {stat.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Quick Actions */}
            <AdminCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    Import Stats from CSV
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    Export Configuration
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    View Analytics
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    Reset to Default
                  </button>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}