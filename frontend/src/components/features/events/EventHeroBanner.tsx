'use client'

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

// Type definitions for the hero banner data
interface HeroBannerData {
  _id?: string;
  title?: string;
  highlightText?: string;
  typewriterSequences?: string[];
  videoUrl?: string;
  videoSettings?: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
  };
  gradientOverlay?: {
    from?: string;
    to?: string;
  };
  nextEvent?: {
    name?: string;
    date?: string;
    location?: string;
  };
  buttons?: {
    primary?: {
      text?: string;
      link?: string;
      color?: string;
    };
    secondary?: {
      text?: string;
      link?: string;
      style?: string;
    };
  };
  parallaxIntensity?: number;
  animationTimings?: {
    titleDelay?: number;
    typewriterDelay?: number;
    countdownDelay?: number;
    buttonsDelay?: number;
  };
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function EventHeroBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // State for database data
  const [heroBannerData, setHeroBannerData] = useState<HeroBannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Fetch data from database
  useEffect(() => {
    const fetchHeroBannerData = async () => {
      try {
        setLoading(true);
        const result = await safeFetch('/api/eventHero');
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to load hero banner data');
        }
        
        setHeroBannerData(result.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch hero banner data:', err);
        setError('Failed to load hero banner data');
        // Set fallback data
        setHeroBannerData({
          title: 'Join Our',
          highlightText: 'Events',
          typewriterSequences: [
            'Be part of something bigger.',
            'Join our mission to create change.',
            'Transform lives together.'
          ],
          videoUrl: '/videos/events-hero.mp4',
          videoSettings: { autoplay: true, muted: true, loop: true },
          gradientOverlay: { from: 'purple-900/80', to: 'indigo-900/80' },
          nextEvent: {
            name: 'Charity Marathon',
            date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
            location: 'City Center'
          },
          buttons: {
            primary: { text: 'Browse Events', link: '#events', color: 'purple-600' }
            // Removed secondary button to eliminate 'Host an Event' option
          },
          parallaxIntensity: 0.3,
          animationTimings: {
            titleDelay: 0,
            typewriterDelay: 0.2,
            countdownDelay: 0.4,
            buttonsDelay: 0.6
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroBannerData();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!heroBannerData?.nextEvent?.date) return;

    const updateCountdown = () => {
      const eventDate = new Date(heroBannerData.nextEvent!.date!);
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [heroBannerData?.nextEvent?.date]);

  // Video handling effects
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !heroBannerData?.videoUrl) return;

    // Reset states
    setVideoLoaded(false);
    setVideoError(false);

    const handleLoadedData = () => {
      console.log('Video loaded successfully');
      setVideoLoaded(true);
      setVideoError(false);
      
      // Force play attempt after a short delay
      setTimeout(() => {
        attemptVideoPlay();
      }, 100);
    };

    const handleError = (e) => {
      console.error('Video failed to load:', e);
      setVideoError(true);
      setVideoLoaded(false);
    };

    const handleLoadStart = () => {
      console.log('Video loading started');
    };

    const attemptVideoPlay = async () => {
      if (!video) return;
      
      try {
        // Set video properties
        video.muted = true; // Always mute for autoplay
        video.playsInline = true;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('Video autoplay started successfully');
        }
      } catch (error) {
        console.warn('Video autoplay failed:', error.message);
        // Try to play muted
        try {
          video.muted = true;
          await video.play();
          console.log('Video started after muting');
        } catch (secondError) {
          console.error('Video play failed even when muted:', secondError.message);
        }
      }
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // Force load the video
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [heroBannerData?.videoUrl]);

  // User interaction to play video if autoplay fails
  useEffect(() => {
    const handleUserInteraction = () => {
      const video = videoRef.current;
      if (video && video.paused && !videoError) {
        video.play().catch(console.warn);
      }
    };

    // Try to play video on first user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [videoError]);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current && videoRef.current && heroBannerData?.parallaxIntensity) {
        const scrollPosition = window.scrollY;
        const parallaxValue = scrollPosition * heroBannerData.parallaxIntensity;
        
        gsap.to(videoRef.current, {
          y: parallaxValue,
          ease: 'none',
          duration: 0.1
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroBannerData?.parallaxIntensity]);

  // Animation variants
  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: custom * (heroBannerData?.animationTimings?.titleDelay || 0.2), 
        ease: "easeOut" 
      }
    })
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !heroBannerData) {
    return (
      <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-gradient-to-r from-red-900 to-red-800">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error loading hero banner</p>
          <p className="text-sm opacity-75">{error}</p>
        </div>
      </section>
    );
  }

  if (!heroBannerData) return null;

  // Create typewriter sequence for TypeAnimation
  const typewriterSequence = heroBannerData.typewriterSequences?.flatMap(text => [text, 2000]) || [
    'Be part of something bigger.',
    2000
  ];

  return (
    <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!videoError && heroBannerData.videoUrl ? (
          <>
            <video 
              ref={videoRef}
              muted={true}
              loop={heroBannerData.videoSettings?.loop !== false}
              playsInline={true}
              preload="metadata"
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                videoLoaded ? 'opacity-100' : 'opacity-50'
              }`}
              style={{ zIndex: 1 }}
            >
              <source src={heroBannerData.videoUrl} type="video/mp4" />
              <source src={heroBannerData.videoUrl.replace('.mp4', '.webm')} type="video/webm" />
              <source src={heroBannerData.videoUrl.replace('.mp4', '.mov')} type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
            
            {/* Play button overlay for user interaction */}
            {!videoLoaded && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <button 
                  onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                      video.muted = true;
                      video.play().then(() => {
                        setVideoLoaded(true);
                      }).catch(console.error);
                    }
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-6 transition-all duration-300"
                >
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          // Enhanced fallback background
          <div 
            className="absolute w-full h-full"
            style={{
              background: `
                linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(79, 70, 229, 0.8) 100%),
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23667eea"/><stop offset="100%" stop-color="%23764ba2"/></radialGradient></defs><rect fill="url(%23a)" width="100%" height="100%"/><g fill="none" stroke="%23ffffff" stroke-width="1" opacity="0.1"><circle cx="200" cy="200" r="100"/><circle cx="800" cy="300" r="150"/><circle cx="400" cy="700" r="120"/><circle cx="700" cy="800" r="80"/></g></svg>') center/cover
              `
            }}
          />
        )}
        
        {/* Dynamic Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(135deg, 
              rgba(147, 51, 234, ${heroBannerData.gradientOverlay?.from?.includes('/') ? '0.8' : '0.6'}) 0%, 
              rgba(79, 70, 229, ${heroBannerData.gradientOverlay?.to?.includes('/') ? '0.8' : '0.6'}) 100%)`
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-20 text-center text-white">
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
          custom={heroBannerData.animationTimings?.titleDelay || 0}
        >
          {heroBannerData.title || 'Join Our'} <span className="text-purple-300">{heroBannerData.highlightText || 'Events'}</span>
        </motion.h1>
        
        <motion.div
          className="text-xl md:text-3xl font-light mb-8 h-12"
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
          custom={heroBannerData.animationTimings?.typewriterDelay || 1}
        >
          <TypeAnimation
            sequence={typewriterSequence}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </motion.div>
        
        {/* Next Event Countdown */}
        {heroBannerData.nextEvent && (
          <motion.div
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
            custom={heroBannerData.animationTimings?.countdownDelay || 2}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 md:p-6 inline-block mb-8">
              <p className="text-purple-200 mb-2">
                Next Event: {heroBannerData.nextEvent.name || 'Upcoming Event'}
              </p>
              {heroBannerData.nextEvent.location && (
                <p className="text-purple-200 text-sm mb-2">
                  📍 {heroBannerData.nextEvent.location}
                </p>
              )}
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-4xl font-bold flip-number">{countdown.days}</div>
                  <div className="text-xs md:text-sm text-purple-200">Days</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-4xl font-bold flip-number">{countdown.hours}</div>
                  <div className="text-xs md:text-sm text-purple-200">Hours</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-4xl font-bold flip-number">{countdown.minutes}</div>
                  <div className="text-xs md:text-sm text-purple-200">Minutes</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-4xl font-bold flip-number">{countdown.seconds}</div>
                  <div className="text-xs md:text-sm text-purple-200">Seconds</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Dynamic Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
          custom={heroBannerData.animationTimings?.buttonsDelay || 3}
        >
          {heroBannerData.buttons?.primary && (
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="join-button"
            >
              <Link 
                href={heroBannerData.buttons.primary.link || '#events'}
                className={`px-8 py-4 bg-${heroBannerData.buttons.primary.color || 'purple-600'} text-white font-bold rounded-full text-xl shadow-lg inline-block hover:bg-${heroBannerData.buttons.primary.color || 'purple-600'}/80 transition-all duration-300`}
              >
                {heroBannerData.buttons.primary.text || 'Browse Events'}
              </Link>
            </motion.div>
          )}
          
          {heroBannerData.buttons?.secondary && (
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href={heroBannerData.buttons.secondary.link || '/host-event'}
                className={`px-8 py-4 ${
                  heroBannerData.buttons.secondary.style === 'outline' 
                    ? 'bg-transparent border-2 border-white text-white hover:bg-white/10' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                } font-bold rounded-full text-xl transition-all duration-300 inline-block`}
              >
                {heroBannerData.buttons.secondary.text || 'Host an Event'}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Scroll Down</span>
          <motion.div 
            className="w-8 h-12 border-2 border-white rounded-full flex justify-center"
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-white rounded-full mt-2"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0, 1], y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}