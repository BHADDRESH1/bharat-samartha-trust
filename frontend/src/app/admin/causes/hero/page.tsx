  'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Save, 
  Eye, 
  RefreshCw, 
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Type,
  Palette,
  Film,
  Sparkles,
  Clock,
  Target,
  ArrowLeft,
  Image
} from 'lucide-react';
import Link from 'next/link';

interface HeroBannerData {
  mainTitle: string;
  tagline: string;
  videoUrl: string;
  imageUrl: string;
  mediaType: 'video' | 'image';
  videoPlaybackRate: number;
  gradientOverlay: {
    from: string;
    to: string;
    opacity: string;
  };
  animations: {
    titleDelay: number;
    taglineDelay: number;
    typingDuration: number;
  };
  floatingEmojis: {
    enabled: boolean;
    icons: string[];
    animationDuration: number;
    opacity: {
      min: number;
      max: number;
    };
  };
  scrollIndicator: {
    enabled: boolean;
    animationDuration: number;
  };
}

export default function HeroBannerAdmin() {
  const [heroData, setHeroData] = useState<HeroBannerData>({
    mainTitle: "Our Causes",
    tagline: "Be the Change. Support a Cause Today.",
    videoUrl: "/videos/causes-hero.mp4",
    imageUrl: "",
    mediaType: 'video',
    videoPlaybackRate: 0.7,
    gradientOverlay: {
      from: "from-black/60",
      to: "to-purple-900/40",
      opacity: "60"
    },
    animations: {
      titleDelay: 0.3,
      taglineDelay: 1,
      typingDuration: 2
    },
    floatingEmojis: {
      enabled: true,
      icons: ['🥖', '📚', '🏥', '👩‍🦰', '🌿'],
      animationDuration: 5,
      opacity: {
        min: 0.4,
        max: 0.8
      }
    },
    scrollIndicator: {
      enabled: true,
      animationDuration: 1.5
    }
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [videoPreview, setVideoPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const gradientOptions = [
    { label: "Dark Purple", from: "from-black/60", to: "to-purple-900/40" },
    { label: "Blue Ocean", from: "from-blue-900/60", to: "to-cyan-600/40" },
    { label: "Warm Sunset", from: "from-orange-900/60", to: "to-red-600/40" },
    { label: "Forest Green", from: "from-green-900/60", to: "to-emerald-600/40" },
    { label: "Deep Night", from: "from-black/70", to: "to-gray-900/50" }
  ];

  const emojiCategories = {
    causes: ['🥖', '📚', '🏥', '👩‍🦰', '🌿', '💧', '🏠', '🎓', '❤️', '🌍'],
    hearts: ['❤️', '💚', '💙', '💜', '🧡', '💛', '🤍', '🖤', '💗', '💖'],
    nature: ['🌿', '🌱', '🌳', '🌺', '🌸', '🌼', '🌻', '🍃', '🌲', '🌴'],
    people: ['👥', '👪', '🤝', '👶', '👩‍🦰', '👨‍🦳', '👵', '🧓', '👫', '👬']
  };

  const handleSave = async () => {
  setIsSaving(true);
  try {
    await axios.post('http://localhost:5000/api/causeHero/save', heroData);
    alert('Hero banner settings saved successfully!');
  } catch (err) {
    console.error('Failed to save settings:', err);
    alert('Failed to save settings.');
  } finally {
    setIsSaving(false);
  }
};

useEffect(() => {
  axios.get('http://localhost:5000/api/causeHero').then(res => {
    if (res.data) setHeroData(res.data);
  });
}, []);


  const handleVideoUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  
  // Check file type first
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  if (!isImage && !isVideo) {
    alert('Unsupported file type. Please upload an image or video.');
    return;
  }

  // Use the correct field name based on file type
  // Backend expects 'image' for images and 'video' for videos
  if (isImage) {
    formData.append('image', file);  // Changed from 'file' to 'image'
  } else if (isVideo) {
    formData.append('video', file);  // Changed from 'file' to 'video'
  }

  // Preview before upload
  const url = URL.createObjectURL(file);

  try {
    const endpoint = isImage 
      ? 'http://localhost:5000/api/causeHero/upload-image' 
      : 'http://localhost:5000/api/causeHero/upload-video';

    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data?.url) {
      setHeroData(prev => ({
        ...prev,
        imageUrl: isImage ? data.url : prev.imageUrl,
        videoUrl: isVideo ? data.url : prev.videoUrl,
        mediaType: isImage ? 'image' : 'video'
      }));
      alert(`${isImage ? 'Image' : 'Video'} uploaded successfully!`);
    } else {
      alert('Upload failed. No URL returned.');
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert(`Upload failed: ${err.message}`);
  }
};


  const handleEmojiToggle = (emoji: string) => {
    const currentIcons = heroData.floatingEmojis.icons;
    const newIcons = currentIcons.includes(emoji)
      ? currentIcons.filter(icon => icon !== emoji)
      : [...currentIcons, emoji];
    
    setHeroData(prev => ({
      ...prev,
      floatingEmojis: {
        ...prev.floatingEmojis,
        icons: newIcons
      }
    }));
  };

  const PreviewSection = () => (
    <div className="relative h-64 rounded-lg overflow-hidden mb-6">
      {/* Background Media */}
      {heroData.mediaType === 'image' && heroData.imageUrl ? (
        <img 
          src={heroData.imageUrl} 
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r bg-gray-800"></div>
      )}
      
      <div className={`absolute inset-0 bg-gradient-to-r ${heroData.gradientOverlay.from} ${heroData.gradientOverlay.to} z-10`} />
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          {heroData.mainTitle}
        </h1>
        <p className="text-lg text-white/90 italic">
          {heroData.tagline}
        </p>
      </div>
      
      {heroData.floatingEmojis.enabled && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {heroData.floatingEmojis.icons.slice(0, 3).map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl"
              style={{
                top: `${30 + index * 20}%`,
                left: `${20 + index * 25}%`,
              }}
              animate={{
                opacity: [heroData.floatingEmojis.opacity.min, heroData.floatingEmojis.opacity.max, heroData.floatingEmojis.opacity.min],
                y: [0, -5, 0],
              }}
              transition={{
                duration: heroData.floatingEmojis.animationDuration,
                repeat: Infinity,
                delay: index * 0.3
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
      
      {heroData.scrollIndicator.enabled && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-white"
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: heroData.scrollIndicator.animationDuration,
            repeat: Infinity,
          }}
        >
          <Target className="w-4 h-4" />
        </motion.div>
      )}
    </div>
  );

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'video', label: 'Media', icon: Film },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'animations', label: 'Animations', icon: Sparkles },
    { id: 'emojis', label: 'Floating Icons', icon: Target }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/causes" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Banner Management</h1>
            <p className="text-gray-600 mt-2">Customize the causes page hero section</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
        <PreviewSection />
      </div>

      {!isPreviewMode && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={heroData.mainTitle}
                    onChange={(e) => setHeroData(prev => ({ ...prev, mainTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter main title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline (with typing effect)
                  </label>
                  <input
                    type="text"
                    value={heroData.tagline}
                    onChange={(e) => setHeroData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tagline text"
                  />
                </div>
              </div>
            )}

            {/* Media Tab (Previously Video Tab) */}
            {activeTab === 'video' && (
              <div className="space-y-6">
                {/* Media Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Background Media Type
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setHeroData(prev => ({ ...prev, mediaType: 'video' }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                        heroData.mediaType === 'video'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      Video
                    </button>
                    <button
                      onClick={() => setHeroData(prev => ({ ...prev, mediaType: 'image' }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                        heroData.mediaType === 'image'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image className="w-4 h-4" />
                      Image
                    </button>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload {heroData.mediaType === 'video' ? 'Video' : 'Image'}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept={heroData.mediaType === 'video' ? 'video/*' : 'image/*'}
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label
                      htmlFor="media-upload"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Choose {heroData.mediaType === 'video' ? 'Video' : 'Image'}
                    </label>
                    {(heroData.videoUrl || heroData.imageUrl) && (
                      <span className="text-sm text-gray-600">
                        {heroData.mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully
                      </span>
                    )}
                  </div>
                </div>

                {/* Video URL (Manual Input) */}
                {heroData.mediaType === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter Video URL
                    </label>
                    <input
                      type="text"
                      value={heroData.videoUrl}
                      onChange={(e) => setHeroData(prev => ({ ...prev, videoUrl: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/videos/causes-hero.mp4"
                    />
                  </div>
                )}

                {/* Image URL (Manual Input) */}
                {heroData.mediaType === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter Image URL
                    </label>
                    <input
                      type="text"
                      value={heroData.imageUrl}
                      onChange={(e) => setHeroData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/images/causes-hero.jpg"
                    />
                  </div>
                )}

                {/* Video-specific controls */}
                {heroData.mediaType === 'video' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Playback Speed: {heroData.videoPlaybackRate}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={heroData.videoPlaybackRate}
                        onChange={(e) => setHeroData(prev => ({ ...prev, videoPlaybackRate: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.5x (Slow)</span>
                        <span>1x (Normal)</span>
                        <span>2x (Fast)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setVideoPreview(!videoPreview)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        {videoPreview ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {videoPreview ? 'Stop Preview' : 'Preview Video'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Overlay Gradient
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {gradientOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setHeroData(prev => ({
                          ...prev,
                          gradientOverlay: {
                            ...prev.gradientOverlay,
                            from: option.from,
                            to: option.to
                          }
                        }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          heroData.gradientOverlay.from === option.from
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`h-12 rounded bg-gradient-to-r ${option.from} ${option.to} mb-2`}></div>
                        <p className="text-sm font-medium">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlay Opacity: {heroData.gradientOverlay.opacity}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={heroData.gradientOverlay.opacity}
                    onChange={(e) => setHeroData(prev => ({
                      ...prev,
                      gradientOverlay: {
                        ...prev.gradientOverlay,
                        opacity: e.target.value
                      }
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Animations Tab */}
            {activeTab === 'animations' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Delay (seconds)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={heroData.animations.titleDelay}
                      onChange={(e) => setHeroData(prev => ({
                        ...prev,
                        animations: {
                          ...prev.animations,
                          titleDelay: parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline Delay (seconds)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={heroData.animations.taglineDelay}
                      onChange={(e) => setHeroData(prev => ({
                        ...prev,
                        animations: {
                          ...prev.animations,
                          taglineDelay: parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Typing Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={heroData.animations.typingDuration}
                      onChange={(e) => setHeroData(prev => ({
                        ...prev,
                        animations: {
                          ...prev.animations,
                          typingDuration: parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      Scroll Indicator
                    </label>
                    <button
                      onClick={() => setHeroData(prev => ({
                        ...prev,
                        scrollIndicator: {
                          ...prev.scrollIndicator,
                          enabled: !prev.scrollIndicator.enabled
                        }
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        heroData.scrollIndicator.enabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          heroData.scrollIndicator.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {heroData.scrollIndicator.enabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Animation Duration: {heroData.scrollIndicator.animationDuration}s
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={heroData.scrollIndicator.animationDuration}
                        onChange={(e) => setHeroData(prev => ({
                          ...prev,
                          scrollIndicator: {
                            ...prev.scrollIndicator,
                            animationDuration: parseFloat(e.target.value)
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Floating Emojis Tab */}
            {activeTab === 'emojis' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Enable Floating Icons
                  </label>
                  <button
                    onClick={() => setHeroData(prev => ({
                      ...prev,
                      floatingEmojis: {
                        ...prev.floatingEmojis,
                        enabled: !prev.floatingEmojis.enabled
                      }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      heroData.floatingEmojis.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        heroData.floatingEmojis.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {heroData.floatingEmojis.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Selected Icons ({heroData.floatingEmojis.icons.length}/10)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
                        {heroData.floatingEmojis.icons.map((emoji, index) => (
                          <span
                            key={index}
                            className="text-2xl p-2 bg-white rounded-lg border cursor-pointer hover:bg-red-50"
                            onClick={() => handleEmojiToggle(emoji)}
                          >
                            {emoji}
                          </span>
                        ))}
                      </div>
                    </div>

                    {Object.entries(emojiCategories).map(([category, emojis]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                          {category}
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiToggle(emoji)}
                              className={`text-xl p-2 rounded-lg border transition-colors ${
                                heroData.floatingEmojis.icons.includes(emoji)
                                  ? 'bg-blue-100 border-blue-300'
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Animation Duration: {heroData.floatingEmojis.animationDuration}s
                        </label>
                        <input
                          type="range"
                          min="2"
                          max="10"
                          step="0.5"
                          value={heroData.floatingEmojis.animationDuration}
                          onChange={(e) => setHeroData(prev => ({
                            ...prev,
                            floatingEmojis: {
                              ...prev.floatingEmojis,
                              animationDuration: parseFloat(e.target.value)
                            }
                          }))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opacity Range: {heroData.floatingEmojis.opacity.min} - {heroData.floatingEmojis.opacity.max}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={heroData.floatingEmojis.opacity.min}
                            onChange={(e) => setHeroData(prev => ({
                              ...prev,
                              floatingEmojis: {
                                ...prev.floatingEmojis,
                                opacity: {
                                  ...prev.floatingEmojis.opacity,
                                  min: parseFloat(e.target.value)
                                }
                              }
                            }))}
                            className="flex-1"
                          />
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={heroData.floatingEmojis.opacity.max}
                            onChange={(e) => setHeroData(prev => ({
                              ...prev,
                              floatingEmojis: {
                                ...prev.floatingEmojis,
                                opacity: {
                                  ...prev.floatingEmojis.opacity,
                                  max: parseFloat(e.target.value)
                                }
                              }
                            }))}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}