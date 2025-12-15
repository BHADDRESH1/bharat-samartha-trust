'use client';

import { useState, useEffect } from 'react';
import { 
  Save,
  ArrowLeft,
  Eye,
  Settings,
  Palette,
  Keyboard,
  Navigation,
  RefreshCw,
  Play,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  MousePointer,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface LightboxSettings {
  // Appearance
  backdropColor: string;
  backdropOpacity: number;
  borderRadius: number;
  shadow: boolean;
  
  // Navigation
  showNavigationArrows: boolean;
  showNavigationDots: boolean;
  arrowSize: number;
  arrowColor: string;
  arrowBackgroundColor: string;
  arrowBackgroundOpacity: number;
  
  // Controls
  showCloseButton: boolean;
  showInfoButton: boolean;
  closeButtonPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  infoButtonPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  // Info Overlay
  infoOverlayBackground: string;
  infoOverlayOpacity: number;
  infoTextColor: string;
  showInfoByDefault: boolean;
  infoPosition: 'bottom' | 'top' | 'left' | 'right';
  
  // Keyboard Navigation
  enableKeyboardNavigation: boolean;
  escapeToClose: boolean;
  arrowKeysNavigation: boolean;
  infoToggleKey: string;
  
  // Animations
  animationDuration: number;
  animationType: 'fade' | 'scale' | 'slide';
  imageTransition: 'fade' | 'slide' | 'zoom';
  
  // Video Settings
  autoplayVideos: boolean;
  showVideoControls: boolean;
  videoVolume: number;
  muteByDefault: boolean;
  
  // Mobile Settings
  mobileSwipeNavigation: boolean;
  mobilePinchZoom: boolean;
  mobileDoubleTapZoom: boolean;
  
  // Performance
  preloadNextImages: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  lazyLoadImages: boolean;
  maxImageSize: number;
}

export default function AdminGalleryLightbox() {
  const [settings, setSettings] = useState<LightboxSettings>({
    // Appearance
    backdropColor: '#000000',
    backdropOpacity: 0.9,
    borderRadius: 8,
    shadow: true,
    
    // Navigation
    showNavigationArrows: true,
    showNavigationDots: false,
    arrowSize: 24,
    arrowColor: '#ffffff',
    arrowBackgroundColor: '#000000',
    arrowBackgroundOpacity: 0.5,
    
    // Controls
    showCloseButton: true,
    showInfoButton: true,
    closeButtonPosition: 'top-right',
    infoButtonPosition: 'top-left',
    
    // Info Overlay
    infoOverlayBackground: '#000000',
    infoOverlayOpacity: 0.8,
    infoTextColor: '#ffffff',
    showInfoByDefault: false,
    infoPosition: 'bottom',
    
    // Keyboard Navigation
    enableKeyboardNavigation: true,
    escapeToClose: true,
    arrowKeysNavigation: true,
    infoToggleKey: 'i',
    
    // Animations
    animationDuration: 0.4,
    animationType: 'scale',
    imageTransition: 'fade',
    
    // Video Settings
    autoplayVideos: true,
    showVideoControls: true,
    videoVolume: 1.0,
    muteByDefault: false,
    
    // Mobile Settings
    mobileSwipeNavigation: true,
    mobilePinchZoom: true,
    mobileDoubleTapZoom: true,
    
    // Performance
    preloadNextImages: true,
    imageQuality: 'high',
    lazyLoadImages: true,
    maxImageSize: 2048
  });

  const [activeTab, setActiveTab] = useState('appearance');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message or handle error
    }, 1500);
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'controls', label: 'Controls', icon: MousePointer },
    { id: 'keyboard', label: 'Keyboard', icon: Keyboard },
    { id: 'animations', label: 'Animations', icon: Zap },
    { id: 'media', label: 'Media', icon: Play },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'performance', label: 'Performance', icon: Settings }
  ];

  const LightboxPreview = () => (
    <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
      {/* Backdrop simulation */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: settings.backdropColor,
          opacity: settings.backdropOpacity
        }}
      />
      
      {/* Mock image container */}
      <div className="absolute inset-8 bg-white rounded-lg flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <Eye className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Sample Image</p>
        </div>
      </div>
      
      {/* Controls preview */}
      {settings.showCloseButton && (
        <button 
          className={`absolute ${
            settings.closeButtonPosition === 'top-right' ? 'top-2 right-2' :
            settings.closeButtonPosition === 'top-left' ? 'top-2 left-2' :
            settings.closeButtonPosition === 'bottom-right' ? 'bottom-2 right-2' :
            'bottom-2 left-2'
          } p-2 rounded-full`}
          style={{
            backgroundColor: settings.arrowBackgroundColor,
            opacity: settings.arrowBackgroundOpacity,
            color: settings.arrowColor
          }}
        >
          <X size={16} />
        </button>
      )}
      
      {settings.showInfoButton && (
        <button 
          className={`absolute ${
            settings.infoButtonPosition === 'top-right' ? 'top-2 right-2' :
            settings.infoButtonPosition === 'top-left' ? 'top-2 left-2' :
            settings.infoButtonPosition === 'bottom-right' ? 'bottom-2 right-2' :
            'bottom-2 left-2'
          } p-2 rounded-full`}
          style={{
            backgroundColor: settings.arrowBackgroundColor,
            opacity: settings.arrowBackgroundOpacity,
            color: settings.arrowColor
          }}
        >
          <Info size={16} />
        </button>
      )}
      
      {/* Navigation arrows */}
      {settings.showNavigationArrows && (
        <>
          <button 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
            style={{
              backgroundColor: settings.arrowBackgroundColor,
              opacity: settings.arrowBackgroundOpacity,
              color: settings.arrowColor
            }}
          >
            <ChevronLeft size={settings.arrowSize} />
          </button>
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
            style={{
              backgroundColor: settings.arrowBackgroundColor,
              opacity: settings.arrowBackgroundOpacity,
              color: settings.arrowColor
            }}
          >
            <ChevronRight size={settings.arrowSize} />
          </button>
        </>
      )}
      
      {/* Info overlay preview */}
      {settings.showInfoByDefault && (
        <div 
          className={`absolute ${
            settings.infoPosition === 'bottom' ? 'bottom-0 left-0 right-0' :
            settings.infoPosition === 'top' ? 'top-0 left-0 right-0' :
            settings.infoPosition === 'left' ? 'left-0 top-0 bottom-0 w-1/3' :
            'right-0 top-0 bottom-0 w-1/3'
          } p-3`}
          style={{
            backgroundColor: settings.infoOverlayBackground,
            opacity: settings.infoOverlayOpacity,
            color: settings.infoTextColor
          }}
        >
          <p className="text-xs font-bold">Sample Title</p>
          <p className="text-xs opacity-75">Sample description...</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link
            href="/admin/gallery"
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lightbox Settings</h1>
            <p className="text-gray-600">Configure your gallery lightbox behavior and appearance</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backdrop Color
                    </label>
                    <input
                      type="color"
                      value={settings.backdropColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, backdropColor: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backdrop Opacity
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.backdropOpacity}
                      onChange={(e) => setSettings(prev => ({ ...prev, backdropOpacity: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500 mt-1">{Math.round(settings.backdropOpacity * 100)}%</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Radius (px)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={settings.borderRadius}
                      onChange={(e) => setSettings(prev => ({ ...prev, borderRadius: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shadow"
                      checked={settings.shadow}
                      onChange={(e) => setSettings(prev => ({ ...prev, shadow: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="shadow" className="ml-2 text-sm text-gray-700">
                      Enable shadow effects
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Tab */}
              {activeTab === 'navigation' && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showNavigationArrows"
                      checked={settings.showNavigationArrows}
                      onChange={(e) => setSettings(prev => ({ ...prev, showNavigationArrows: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="showNavigationArrows" className="ml-2 text-sm text-gray-700">
                      Show navigation arrows
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showNavigationDots"
                      checked={settings.showNavigationDots}
                      onChange={(e) => setSettings(prev => ({ ...prev, showNavigationDots: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="showNavigationDots" className="ml-2 text-sm text-gray-700">
                      Show navigation dots
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrow Size (px)
                    </label>
                    <input
                      type="number"
                      min="16"
                      max="48"
                      value={settings.arrowSize}
                      onChange={(e) => setSettings(prev => ({ ...prev, arrowSize: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrow Color
                    </label>
                    <input
                      type="color"
                      value={settings.arrowColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, arrowColor: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrow Background Color
                    </label>
                    <input
                      type="color"
                      value={settings.arrowBackgroundColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, arrowBackgroundColor: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrow Background Opacity
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.arrowBackgroundOpacity}
                      onChange={(e) => setSettings(prev => ({ ...prev, arrowBackgroundOpacity: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500 mt-1">{Math.round(settings.arrowBackgroundOpacity * 100)}%</div>
                  </div>
                </div>
              )}

              {/* Controls Tab */}
              {activeTab === 'controls' && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showCloseButton"
                      checked={settings.showCloseButton}
                      onChange={(e) => setSettings(prev => ({ ...prev, showCloseButton: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="showCloseButton" className="ml-2 text-sm text-gray-700">
                      Show close button
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Close Button Position
                    </label>
                    <select
                      value={settings.closeButtonPosition}
                      onChange={(e) => setSettings(prev => ({ ...prev, closeButtonPosition: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showInfoButton"
                      checked={settings.showInfoButton}
                      onChange={(e) => setSettings(prev => ({ ...prev, showInfoButton: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="showInfoButton" className="ml-2 text-sm text-gray-700">
                      Show info button
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Info Button Position
                    </label>
                    <select
                      value={settings.infoButtonPosition}
                      onChange={(e) => setSettings(prev => ({ ...prev, infoButtonPosition: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Info Overlay Background
                    </label>
                    <input
                      type="color"
                      value={settings.infoOverlayBackground}
                      onChange={(e) => setSettings(prev => ({ ...prev, infoOverlayBackground: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Info Text Color
                    </label>
                    <input
                      type="color"
                      value={settings.infoTextColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, infoTextColor: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showInfoByDefault"
                      checked={settings.showInfoByDefault}
                      onChange={(e) => setSettings(prev => ({ ...prev, showInfoByDefault: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="showInfoByDefault" className="ml-2 text-sm text-gray-700">
                      Show info overlay by default
                    </label>
                  </div>
                </div>
              )}

              {/* Other tabs content would continue here... */}
              {/* For brevity, I'll show just a few key tabs */}

              {/* Keyboard Tab */}
              {activeTab === 'keyboard' && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableKeyboardNavigation"
                      checked={settings.enableKeyboardNavigation}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableKeyboardNavigation: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="enableKeyboardNavigation" className="ml-2 text-sm text-gray-700">
                      Enable keyboard navigation
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="escapeToClose"
                      checked={settings.escapeToClose}
                      onChange={(e) => setSettings(prev => ({ ...prev, escapeToClose: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="escapeToClose" className="ml-2 text-sm text-gray-700">
                      Escape key to close
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="arrowKeysNavigation"
                      checked={settings.arrowKeysNavigation}
                      onChange={(e) => setSettings(prev => ({ ...prev, arrowKeysNavigation: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="arrowKeysNavigation" className="ml-2 text-sm text-gray-700">
                      Arrow keys for navigation
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Info Toggle Key
                    </label>
                    <input
                      type="text"
                      value={settings.infoToggleKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, infoToggleKey: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      maxLength={1}
                      placeholder="i"
                    />
                  </div>
                </div>
              )}

              {/* Animations Tab */}
              {activeTab === 'animations' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animation Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={settings.animationDuration}
                      onChange={(e) => setSettings(prev => ({ ...prev, animationDuration: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animation Type
                    </label>
                    <select
                      value={settings.animationType}
                      onChange={(e) => setSettings(prev => ({ ...prev, animationType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="fade">Fade</option>
                      <option value="scale">Scale</option>
                      <option value="slide">Slide</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Transition
                    </label>
                    <select
                      value={settings.imageTransition}
                      onChange={(e) => setSettings(prev => ({ ...prev, imageTransition: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="zoom">Zoom</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="xl:col-span-1">
          {showPreview && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
              <LightboxPreview />
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="mb-2"><strong>Keyboard Shortcuts:</strong></p>
                <ul className="space-y-1 text-xs">
                  <li>• ESC: Close lightbox</li>
                  <li>• ← →: Navigate images</li>
                  <li>• {settings.infoToggleKey.toUpperCase()}: Toggle info</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}