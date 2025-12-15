  'use client';
import { useState, useEffect } from 'react';
import {
  Activity,
  Save,
  Eye,
  RefreshCw,
  Image,
  Type,
  Palette,
  Target,
  BarChart3,
  TrendingUp,
  MousePointer,
  Heart,
  Users,
  DollarSign,
  Plus,
  Trash2
} from 'lucide-react';
import { safeFetch } from '@/lib/fetchUtils';

interface CTASection {
  id: string;
  title: string;
  description: string;
  primaryButton: {
    text: string;
    url: string;
    className: string;
  };
  secondaryButton: {
    text: string;
    url: string;
    className: string;
  };
  sectionClassName: string;
  containerClassName: string;
  enabled: boolean;
  animation: {
    title: {
      initial: { opacity: number; y: number };
      animate: { opacity: number; y: number };
      transition: { duration: number };
    };
    description: {
      initial: { opacity: number; y: number };
      animate: { opacity: number; y: number };
      transition: { duration: number; delay: number };
    };
    buttons: {
      initial: { opacity: number; y: number };
      animate: { opacity: number; y: number };
      transition: { duration: number; delay: number };
    };
  };
}

interface CTAAnalytics {
  views: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
}

const AdminCard = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
    {children}
  </div>
);

export default function CallToActionManagement() {
  const [mounted, setMounted] = useState(false);
  const [ctaSections, setCtaSections] = useState<CTASection[]>([]);
  const [analytics, setAnalytics] = useState<CTAAnalytics>({
    views: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    conversionRate: 0
  });
  const [activeTab, setActiveTab] = useState<string>('main-cta');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Mock data matching the client-side component
    setCtaSections([
      {
        id: 'main-cta',
        title: 'Join Us in Making a Difference',
        description: 'Your contribution can change lives. Together, we can create a better world for all.',
        primaryButton: {
          text: 'Donate Now',
          url: '/donate',
          className: 'px-8 py-4 bg-white text-purple-600 font-bold rounded-full text-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg'
        },
        secondaryButton: {
          text: 'Get Involved',
          url: '/get-involved',
          className: 'px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-xl hover:bg-white/10 transition-all duration-300 hover:scale-105'
        },
        sectionClassName: 'py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white',
        containerClassName: 'container mx-auto px-4 text-center',
        enabled: true,
        animation: {
          title: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 }
          },
          description: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.2 }
          },
          buttons: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.4 }
          }
        }
      },
    ]);

    // Mock analytics data
    setAnalytics({
      views: 15420,
      clicks: 1205,
      conversions: 187,
      ctr: 7.8,
      conversionRate: 15.5
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await safeFetch('/api/hero');
        if (res.success) setCtaSections(res.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
      }

      // Set mock analytics (you can replace this with real analytics fetch if needed)
      setAnalytics({
        views: 15420,
        clicks: 1205,
        conversions: 187,
        ctr: 7.8,
        conversionRate: 15.5
      });

      setMounted(true);
    };

    fetchData();
  }, []);


  const activeCTA = ctaSections.find(cta => cta.id === activeTab) || ctaSections[0];

  const updateCTASection = (field: string, value: any) => {
    setCtaSections(prev => prev.map(cta => 
      cta.id === activeTab 
        ? { ...cta, [field]: value }
        : cta
    ));
  };

  const updateButton = (buttonType: 'primaryButton' | 'secondaryButton', field: string, value: string) => {
    setCtaSections(prev => prev.map(cta => 
      cta.id === activeTab 
        ? { 
            ...cta, 
            [buttonType]: { 
              ...cta[buttonType], 
              [field]: value 
            } 
          }
        : cta
    ));
  };

  const updateAnimation = (animationType: 'title' | 'description' | 'buttons', field: string, value: any) => {
    setCtaSections(prev => prev.map(cta => 
      cta.id === activeTab 
        ? { 
            ...cta, 
            animation: {
              ...cta.animation,
              [animationType]: {
                ...cta.animation[animationType],
                [field]: field === 'transition' ? { ...cta.animation[animationType].transition, ...value } : value
              }
            }
          }
        : cta
    ));
  };

  const saveCTASection = async () => {
  try {
    const res = await safeFetch('/api/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activeCTA),
    });

    if (res.success) {
      console.log('Saved:', res.data || res);
    } else {
      console.error('Save error:', res.error);
    }
    
  } catch (err) {
    console.error('Save error:', err);
  }
};


  

  if (!mounted) return null;

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Call-to-Action Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your homepage call-to-action sections and track their performance
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button
            onClick={saveCTASection}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <AdminCard>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{analytics.views.toLocaleString()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Views</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{analytics.clicks.toLocaleString()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Clicks</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-3">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{analytics.conversions}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Conversions</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{analytics.ctr}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Click Rate</div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{analytics.conversionRate}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</div>
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* CTA Section Tabs */}
        <div className="lg:col-span-1">
          <AdminCard>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                CTA Sections
              </h3>
            </div>
            <div className="space-y-2">
              {ctaSections.map((cta) => (
                <div
  key={cta.id}
  onClick={() => setActiveTab(cta.id)}
  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
    activeTab === cta.id
      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
      : 'bg-gray-50 dark:bg-gray-700 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
  }`}
>
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <div className="font-medium text-gray-900 dark:text-white truncate">
        {cta.title}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {cta.enabled ? 'Active' : 'Disabled'}
      </div>
    </div>
    <div className="flex items-center space-x-2 ml-2">
      <div className={`w-2 h-2 rounded-full ${
        cta.enabled ? 'bg-green-500' : 'bg-gray-400'
      }`} />
      {ctaSections.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteCTA(cta.id);
          }}
          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
</div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* CTA Editor */}
        <div className="lg:col-span-3">
          <AdminCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit CTA Section: {activeCTA.title}
                </h3>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeCTA.enabled}
                    onChange={(e) => updateCTASection('enabled', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    activeCTA.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      activeCTA.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    {activeCTA.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              {/* Content Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={activeCTA.title}
                    onChange={(e) => updateCTASection('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter compelling title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={activeCTA.description}
                    onChange={(e) => updateCTASection('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter description..."
                  />
                </div>
              </div>

              {/* Button Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white border-l-4 border-blue-500 pl-3">
                    Primary Button
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={activeCTA.primaryButton.text}
                      onChange={(e) => updateButton('primaryButton', 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={activeCTA.primaryButton.url}
                      onChange={(e) => updateButton('primaryButton', 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button Classes
                    </label>
                    <textarea
                      value={activeCTA.primaryButton.className}
                      onChange={(e) => updateButton('primaryButton', 'className', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                      placeholder="Tailwind CSS classes..."
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white border-l-4 border-gray-500 pl-3">
                    Secondary Button
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={activeCTA.secondaryButton.text}
                      onChange={(e) => updateButton('secondaryButton', 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={activeCTA.secondaryButton.url}
                      onChange={(e) => updateButton('secondaryButton', 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button Classes
                    </label>
                    <textarea
                      value={activeCTA.secondaryButton.className}
                      onChange={(e) => updateButton('secondaryButton', 'className', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                      placeholder="Tailwind CSS classes..."
                    />
                  </div>
                </div>
              </div>

              {/* Style Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Classes
                  </label>
                  <textarea
                    value={activeCTA.sectionClassName}
                    onChange={(e) => updateCTASection('sectionClassName', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                    placeholder="Section styling classes..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Container Classes
                  </label>
                  <textarea
                    value={activeCTA.containerClassName}
                    onChange={(e) => updateCTASection('containerClassName', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                    placeholder="Container styling classes..."
                  />
                </div>
              </div>

              {/* Animation Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white border-l-4 border-purple-500 pl-3">
                  Animation Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Title Animation</h5>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Duration (seconds)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={activeCTA.animation.title.transition.duration}
                        onChange={(e) => updateAnimation('title', 'transition', { duration: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Description Animation</h5>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Delay (seconds)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={activeCTA.animation.description.transition.delay}
                        onChange={(e) => updateAnimation('description', 'transition', { delay: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Buttons Animation</h5>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Delay (seconds)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={activeCTA.animation.buttons.transition.delay}
                        onChange={(e) => updateAnimation('buttons', 'transition', { delay: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Preview */}
      {previewMode && (
        <AdminCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Live Preview
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                This preview shows how the CTA will appear on your website
              </div>
            </div>
            
            {/* Preview Container */}
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <section className={activeCTA.sectionClassName}>
                <div className={activeCTA.containerClassName}>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    {activeCTA.title}
                  </h2>
                  
                  <p className="text-xl mb-8 max-w-2xl mx-auto">
                    {activeCTA.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className={activeCTA.primaryButton.className}>
                      {activeCTA.primaryButton.text}
                    </button>
                    <button className={activeCTA.secondaryButton.className}>
                      {activeCTA.secondaryButton.text}
                    </button>
                  </div>
                </div>
              </section>
            </div>
            
            {/* Preview Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Preview Information
                  </h4>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                    <p>• Animations will be visible on the live website</p>
                    <p>• Button hover effects are functional in this preview</p>
                    <p>• Mobile responsiveness is included</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your CTAs are performing well with a {analytics.ctr}% click-through rate
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Detailed Analytics →
            </button>
          </div>
        </AdminCard>

        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Templates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Use pre-designed templates to quickly create effective CTAs
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Browse Templates →
            </button>
          </div>
        </AdminCard>

        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">A/B Testing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Test different variations to optimize your conversion rates
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Start A/B Test →
            </button>
          </div>
        </AdminCard>
      </div>

      {/* Recent Activity */}
      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Save className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  CTA "Join Us in Making a Difference" updated
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Conversion rate increased by 2.3%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New CTA template "Volunteer" created
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}