'use client';

import { useState, useEffect, useRef } from 'react';
import { safeFetch } from '@/lib/fetchUtils';
import { 
  Save, 
  Upload, 
  Eye, 
  RefreshCw, 
  Video, 
  Type, 
  Palette,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

interface HeroData {
  title: string;
  quote: string;
  buttonText: string;
  buttonLink: string;
  videoUrl: string;
  overlayOpacity: number;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  enableTypewriter: boolean;
  typewriterSpeed: number;
  enableScrollIndicator: boolean;
  enableVideoAutoplay: boolean;
  enableVideoLoop: boolean;
  enableVideoMute: boolean;
}

export default function AdminHeroManagement() {
  const [heroData, setHeroData] = useState<HeroData>({
    title: 'Become a Volunteer',
    quote: "Volunteering is not about giving your time; it's about changing lives – including your own.",
    buttonText: 'Join Now',
    buttonLink: '#volunteer-signup',
    videoUrl: '/videos/volunteers-hero.mp4',
    overlayOpacity: 50,
    backgroundColor: '#000000',
    textColor: '#ffffff',
    buttonColor: '#7c3aed',
    buttonHoverColor: '#6d28d9',
    enableTypewriter: true,
    typewriterSpeed: 45,
    enableScrollIndicator: true,
    enableVideoAutoplay: true,
    enableVideoLoop: true,
    enableVideoMute: true
  });

  // Use centralized safeFetch for API calls (endpoint: /api/vhero)

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await safeFetch('/api/vhero');
        const data = response.data;
        
        // Ensure overlayOpacity is a valid number
        if (data.overlayOpacity === undefined || isNaN(data.overlayOpacity)) {
          data.overlayOpacity = 50;
        }
        
        setHeroData(data);
        setVideoPreview(data.videoUrl);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchHero();
  }, []);

  const handleInputChange = (field: keyof HeroData, value: any) => {
    setHeroData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Special handling for overlayOpacity to prevent NaN
      if (field === 'overlayOpacity') {
        const numValue = parseInt(value);
        newData.overlayOpacity = isNaN(numValue) ? 50 : numValue;
      }
      
      return newData;
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      const formData = new FormData();
      formData.append('video', file);

      try {
        const res = await safeFetch('/api/vhero/upload-video', {
          method: 'POST',
          body: formData,
        });

        const uploadedUrl = res.data?.url;
        if (!uploadedUrl) {
          throw new Error('No video URL returned');
        }

        setHeroData(prev => ({
          ...prev,
          videoUrl: uploadedUrl,
        }));
      } catch (error) {
        console.error('Video upload failed:', error);
        alert('Video upload failed');
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await safeFetch('/api/vhero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData),
      });
      if (!res.success) throw new Error(res.error || 'Failed to save hero data');
      alert('Hero section updated successfully!');
    } catch (error) {
      console.error('Error saving hero data:', error);
      alert('Failed to save hero section.');
    }
    setIsSaving(false);
  };

  const toggleVideoPreview = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Ensure overlayOpacity is always a valid number for rendering
  const safeOverlayOpacity = isNaN(heroData.overlayOpacity) ? 50 : heroData.overlayOpacity;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Section Management</h1>
          <p className="text-gray-600">Customize the main hero section of your volunteer page</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Content Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Type className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Content Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={heroData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter hero title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quote/Subtitle
                  </label>
                  <textarea
                    value={heroData.quote || ''}
                    onChange={(e) => handleInputChange('quote', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter inspiring quote or subtitle"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={heroData.buttonText || ''}
                      onChange={(e) => handleInputChange('buttonText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={heroData.buttonLink || ''}
                      onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Video className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Video Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Video
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Video</span>
                    </label>
                    <span className="text-sm text-gray-500">
                      {heroData.videoUrl?.split('/').pop() || 'No video selected'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={heroData.enableVideoAutoplay || false}
                      onChange={(e) => handleInputChange('enableVideoAutoplay', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Autoplay</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={heroData.enableVideoLoop || false}
                      onChange={(e) => handleInputChange('enableVideoLoop', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Loop</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={heroData.enableVideoMute || false}
                      onChange={(e) => handleInputChange('enableVideoMute', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Muted</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Style Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Style Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlay Opacity ({safeOverlayOpacity}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={safeOverlayOpacity}
                    onChange={(e) => handleInputChange('overlayOpacity', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={heroData.textColor || '#ffffff'}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Color
                    </label>
                    <input
                      type="color"
                      value={heroData.buttonColor || '#7c3aed'}
                      onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Animation Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">Animation Settings</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={heroData.enableTypewriter || false}
                    onChange={(e) => handleInputChange('enableTypewriter', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enable Typewriter Effect</span>
                </label>

                {heroData.enableTypewriter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Typewriter Speed (ms per character)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={heroData.typewriterSpeed || 45}
                      onChange={(e) => handleInputChange('typewriterSpeed', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{heroData.typewriterSpeed || 45}ms</span>
                  </div>
                )}

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={heroData.enableScrollIndicator || false}
                    onChange={(e) => handleInputChange('enableScrollIndicator', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show Scroll Indicator</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h2>
              
              {/* Mini Hero Preview */}
              <div className="relative h-96 rounded-lg overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0">
                  {videoPreview ? (
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      className="w-full h-full object-cover"
                      autoPlay={heroData.enableVideoAutoplay}
                      loop={heroData.enableVideoLoop}
                      muted={heroData.enableVideoMute}
                      onPlay={() => setVideoPlaying(true)}
                      onPause={() => setVideoPlaying(false)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-white">Video Preview</span>
                    </div>
                  )}
                  <div 
                    className="absolute inset-0 bg-black"
                    style={{ opacity: safeOverlayOpacity / 100 }}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                  <h1 
                    className="text-2xl md:text-4xl font-bold mb-4"
                    style={{ color: heroData.textColor || '#ffffff' }}
                  >
                    {heroData.title || 'Title'}
                  </h1>
                  <p 
                    className="text-sm md:text-base mb-6 italic"
                    style={{ color: heroData.textColor || '#ffffff' }}
                  >
                    {heroData.quote || 'Quote'}
                  </p>
                  <button
                    style={{ 
                      backgroundColor: heroData.buttonColor || '#7c3aed',
                      color: heroData.textColor || '#ffffff'
                    }}
                    className="px-6 py-2 font-bold rounded-full transition-all duration-300 shadow-lg"
                  >
                    {heroData.buttonText || 'Button'}
                  </button>

                  {heroData.enableScrollIndicator && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-6 h-10 rounded-full border-2 border-white flex justify-center items-start p-1">
                        <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                {videoPreview && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={toggleVideoPreview}
                      className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      {videoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                      {heroData.enableVideoMute ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Settings Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Settings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="text-gray-900 font-medium">{heroData.title || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Button Text:</span>
                  <span className="text-gray-900 font-medium">{heroData.buttonText || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overlay Opacity:</span>
                  <span className="text-gray-900 font-medium">{safeOverlayOpacity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Typewriter Effect:</span>
                  <span className="text-gray-900 font-medium">
                    {heroData.enableTypewriter ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Video Autoplay:</span>
                  <span className="text-gray-900 font-medium">
                    {heroData.enableVideoAutoplay ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}