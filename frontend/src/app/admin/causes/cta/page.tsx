'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useEffect } from 'react';
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Settings, 
  Palette,
  Type,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw
} from 'lucide-react';

interface CTAButton {
  id: number;
  text: string;
  href: string;
  type: 'primary' | 'secondary';
  isVisible: boolean;
}

interface CTASettings {
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  isVisible: boolean;
  animation: {
    enabled: boolean;
    duration: number;
    delay: number;
  };
  layout: 'center' | 'left' | 'right';
  spacing: 'compact' | 'normal' | 'relaxed';
}

const CTAPreview = ({ 
  settings, 
  buttons, 
  previewMode 
}: { 
  settings: CTASettings; 
  buttons: CTAButton[];
  previewMode: 'desktop' | 'tablet' | 'mobile';
}) => {
  const getPreviewClass = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-2xl mx-auto';
      default: return 'max-w-4xl mx-auto';
    }
  };

  const getSpacingClass = () => {
    switch (settings.spacing) {
      case 'compact': return 'py-8';
      case 'relaxed': return 'py-20';
      default: return 'py-16';
    }
  };

  const getTextAlignClass = () => {
    switch (settings.layout) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };

  const visibleButtons = buttons.filter(btn => btn.isVisible);

  return (
    <div className={`${settings.backgroundColor} ${settings.textColor} ${getSpacingClass()}`}>
      <div className="container mx-auto px-4">
        <div className={`${getPreviewClass()} ${getTextAlignClass()}`}>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={settings.animation.enabled ? { opacity: 0, y: -20 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: settings.animation.duration }}
          >
            {settings.title}
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8"
            initial={settings.animation.enabled ? { opacity: 0, y: -20 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: settings.animation.duration, delay: settings.animation.delay }}
          >
            {settings.description}
          </motion.p>
          
          <motion.div 
            className={`flex flex-col sm:flex-row gap-4 ${
              settings.layout === 'center' ? 'justify-center' : 
              settings.layout === 'left' ? 'justify-start' : 'justify-end'
            }`}
            initial={settings.animation.enabled ? { opacity: 0, y: 20 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: settings.animation.duration, delay: settings.animation.delay * 2 }}
          >
            {visibleButtons.map(button => (
              <div key={button.id}>
                {button.type === 'primary' ? (
                  <div className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition-colors duration-300 cursor-pointer">
                    {button.text}
                  </div>
                ) : (
                  <div className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 font-bold py-3 px-6 rounded-lg transition-colors duration-300 cursor-pointer">
                    {button.text}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function CTAAdmin() {
  const [settings, setSettings] = useState<CTASettings>({
    title: "Join Us in Making a Difference",
    description: "Your contribution can change lives. Every donation, no matter the size, brings us one step closer to creating a better world for everyone.",
    backgroundColor: "bg-blue-700",
    textColor: "text-white",
    isVisible: true,
    animation: {
      enabled: true,
      duration: 0.7,
      delay: 0.2
    },
    layout: "center",
    spacing: "normal"
  });

  const [buttons, setButtons] = useState<CTAButton[]>([
    {
      id: 1,
      text: "Donate Now",
      href: "/donate",
      type: "primary",
      isVisible: true
    },
    {
      id: 2,
      text: "Volunteer With Us",
      href: "/volunteer",
      type: "secondary",
      isVisible: true
    }
  ]);

  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'buttons' | 'preview'>('content');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nextButtonId, setNextButtonId] = useState(3); // Track next available ID

  useEffect(() => {
    const fetchCTA = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/api/causecta');
        if (res.data) {
          setSettings({
            title: res.data.title || "Join Us in Making a Difference",
            description: res.data.description || "Your contribution can change lives. Every donation, no matter the size, brings us one step closer to creating a better world for everyone.",
            backgroundColor: res.data.backgroundColor || "bg-blue-700",
            textColor: res.data.textColor || "text-white",
            isVisible: res.data.isVisible !== undefined ? res.data.isVisible : true,
            animation: {
              enabled: res.data.animation?.enabled !== undefined ? res.data.animation.enabled : true,
              duration: res.data.animation?.duration || 0.7,
              delay: res.data.animation?.delay || 0.2
            },
            layout: res.data.layout || "center",
            spacing: res.data.spacing || "normal"
          });
          
          // Handle buttons with proper ID management
          if (res.data.buttons && Array.isArray(res.data.buttons) && res.data.buttons.length > 0) {
            const processedButtons = res.data.buttons.map((btn, index) => ({
              id: btn.id || (index + 1), // Use existing ID or generate sequential
              text: btn.text || "Button Text",
              href: btn.href || "#",
              type: btn.type || "secondary",
              isVisible: btn.isVisible !== undefined ? btn.isVisible : true
            }));
            setButtons(processedButtons);
            
            // Set next available ID
            const maxId = Math.max(...processedButtons.map(b => b.id));
            setNextButtonId(maxId + 1);
          } else {
            // Use default buttons if none exist
            setButtons([
              {
                id: 1,
                text: "Donate Now",
                href: "/donate",
                type: "primary",
                isVisible: true
              },
              {
                id: 2,
                text: "Volunteer With Us",
                href: "/volunteer",
                type: "secondary",
                isVisible: true
              }
            ]);
            setNextButtonId(3);
          }
        }
      } catch (err) {
        console.error('Failed to fetch CTA data:', err);
        // Keep default values on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchCTA();
  }, []);

  const handleSettingsChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleAnimationChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      animation: {
        ...prev.animation,
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleButtonChange = (id: number, field: string, value: any) => {
    setButtons(prev => prev.map(btn => 
      btn.id === id ? { ...btn, [field]: value } : btn
    ));
    setHasChanges(true);
  };

  const addButton = () => {
    const newButton: CTAButton = {
      id: nextButtonId,
      text: "New Button",
      href: "#",
      type: "secondary",
      isVisible: true
    };
    setButtons(prev => [...prev, newButton]);
    setNextButtonId(prev => prev + 1);
    setHasChanges(true);
  };

  const removeButton = (id: number) => {
    if (buttons.length > 1) {
      setButtons(prev => prev.filter(btn => btn.id !== id));
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Ensure all buttons have valid IDs
      const buttonsToSave = buttons.map((btn, index) => ({
        id: btn.id || (index + 1),
        text: btn.text || "Button Text",
        href: btn.href || "#",
        type: btn.type || "secondary",
        isVisible: btn.isVisible !== undefined ? btn.isVisible : true
      }));
      
      const payload = { 
        ...settings, 
        buttons: buttonsToSave 
      };
      
      console.log('Saving payload:', payload); // Debug log
      
      await axios.post('http://localhost:5000/api/causecta', payload);
      setHasChanges(false);
      alert('CTA section saved successfully!');
    } catch (err) {
      console.error('Error saving CTA section:', err);
      alert('Failed to save CTA section. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset to default settings?')) {
      setSettings({
        title: "Join Us in Making a Difference",
        description: "Your contribution can change lives. Every donation, no matter the size, brings us one step closer to creating a better world for everyone.",
        backgroundColor: "bg-blue-700",
        textColor: "text-white",
        isVisible: true,
        animation: {
          enabled: true,
          duration: 0.7,
          delay: 0.2
        },
        layout: "center",
        spacing: "normal"
      });
      setButtons([
        {
          id: 1,
          text: "Donate Now",
          href: "/donate",
          type: "primary",
          isVisible: true
        },
        {
          id: 2,
          text: "Volunteer With Us",
          href: "/volunteer",
          type: "secondary",
          isVisible: true
        }
      ]);
      setNextButtonId(3);
      setHasChanges(true);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading CTA settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Call to Action Management</h1>
            <p className="text-gray-600 mt-1">Customize your CTA section content and design</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetToDefaults}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'content', label: 'Content', icon: Type },
            { id: 'design', label: 'Design', icon: Palette },
            { id: 'buttons', label: 'Buttons', icon: ExternalLink },
            { id: 'preview', label: 'Preview', icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
              <h3 className="text-lg font-semibold">Content Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => handleSettingsChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={settings.description}
                  onChange={(e) => handleSettingsChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter section description"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sectionVisible"
                  checked={settings.isVisible}
                  onChange={(e) => handleSettingsChange('isVisible', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="sectionVisible" className="ml-2 text-sm text-gray-700">
                  Show section on website
                </label>
              </div>
            </div>
          )}

          {/* Design Tab */}
          {activeTab === 'design' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
              <h3 className="text-lg font-semibold">Design Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <select
                    value={settings.backgroundColor}
                    onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bg-blue-700">Blue</option>
                    <option value="bg-green-700">Green</option>
                    <option value="bg-purple-700">Purple</option>
                    <option value="bg-red-700">Red</option>
                    <option value="bg-gray-700">Gray</option>
                    <option value="bg-indigo-700">Indigo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <select
                    value={settings.textColor}
                    onChange={(e) => handleSettingsChange('textColor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="text-white">White</option>
                    <option value="text-gray-100">Light Gray</option>
                    <option value="text-gray-900">Dark Gray</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout
                  </label>
                  <select
                    value={settings.layout}
                    onChange={(e) => handleSettingsChange('layout', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spacing
                  </label>
                  <select
                    value={settings.spacing}
                    onChange={(e) => handleSettingsChange('spacing', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="relaxed">Relaxed</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="text-md font-medium mb-4">Animation Settings</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="animationEnabled"
                      checked={settings.animation.enabled}
                      onChange={(e) => handleAnimationChange('enabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="animationEnabled" className="ml-2 text-sm text-gray-700">
                      Enable animations
                    </label>
                  </div>
                  
                  {settings.animation.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (seconds)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="2"
                          value={settings.animation.duration}
                          onChange={(e) => handleAnimationChange('duration', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delay (seconds)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          value={settings.animation.delay}
                          onChange={(e) => handleAnimationChange('delay', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Buttons Tab */}
          {activeTab === 'buttons' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Button Settings</h3>
                <button
                  onClick={addButton}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add Button
                </button>
              </div>
              
              <div className="space-y-4">
                {buttons.map((button, index) => (
                  <div key={button.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Button {index + 1} (ID: {button.id})</h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleButtonChange(button.id, 'isVisible', !button.isVisible)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {button.isVisible ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        {buttons.length > 1 && (
                          <button
                            onClick={() => removeButton(button.id)}
                            className="text-red-600 text-sm hover:bg-red-50 px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={button.text}
                          onChange={(e) => handleButtonChange(button.id, 'text', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Link URL
                        </label>
                        <input
                          type="text"
                          value={button.href}
                          onChange={(e) => handleButtonChange(button.id, 'href', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Style
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={button.type === 'primary'}
                            onChange={() => handleButtonChange(button.id, 'type', 'primary')}
                            className="mr-2"
                          />
                          Primary (Filled)
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={button.type === 'secondary'}
                            onChange={() => handleButtonChange(button.id, 'type', 'secondary')}
                            className="mr-2"
                          />
                          Secondary (Outline)
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {[
                  { mode: 'desktop', icon: Monitor },
                  { mode: 'tablet', icon: Tablet },
                  { mode: 'mobile', icon: Smartphone }
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      previewMode === mode
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Live Preview</h3>
              </div>
              <div className="p-0">
                <CTAPreview 
                  settings={settings} 
                  buttons={buttons}
                  previewMode={previewMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}