'use client'

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // Add video ref for debugging
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null); // Track video errors
  const [videoLoaded, setVideoLoaded] = useState(false); // Track video load status

  // Fetch hero data from API
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const result = await safeFetch('/api/vhero', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to fetch hero data');
        }
        
        console.log('Fetched hero data:', result.data);
        setHeroData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching hero data:', err);
        // Set default data in case of error - use a test video URL
        setHeroData({
          title: "Become a Volunteer",
          quote: "Volunteering is not about giving your time; it's about changing lives – including your own.",
          buttonText: "Join Now",
          buttonLink: "#volunteer-signup",
          // Use a test video URL that definitely works
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          overlayOpacity: 0.3, // Reduced opacity so you can see the video
          backgroundColor: "#1f2937",
          textColor: "#ffffff",
          buttonColor: "#7c3aed",
          buttonHoverColor: "#6d28d9",
          enableTypewriter: true,
          typewriterSpeed: 45,
          enableScrollIndicator: true,
          enableVideoAutoplay: true,
          enableVideoLoop: true,
          enableVideoMute: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Video event handlers for debugging
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoLoad = () => {
      console.log('Video loaded successfully');
      setVideoLoaded(true);
      setVideoError(null);
    };

    const handleVideoError = (e) => {
      console.error('Video error:', e);
      setVideoError('Failed to load video');
      setVideoLoaded(false);
    };

    const handleVideoCanPlay = () => {
      console.log('Video can play');
    };

    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('canplay', handleVideoCanPlay);

    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('canplay', handleVideoCanPlay);
    };
  }, [heroData]);

  // GSAP animations for hero section
  useEffect(() => {
    if (!heroData || loading) return;

    // Page load animation
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 1.2,
        ease: "power3.out"
      });
    }

    // Typewriter effect for quote (if enabled)
    if (textRef.current && heroData.enableTypewriter && heroData.quote) {
      const text = heroData.quote;
      const textElement = textRef.current;
      textElement.innerHTML = '';

      let i = 0;
      const typeEffect = setInterval(() => {
        if (i < text.length) {
          textElement.innerHTML += text.charAt(i);
          i++;
        } else {
          clearInterval(typeEffect);
        }
      }, heroData.typewriterSpeed || 45);

      return () => clearInterval(typeEffect);
    } else if (textRef.current && heroData.quote) {
      // If typewriter is disabled, show the full text immediately
      textRef.current.innerHTML = heroData.quote;
    }
  }, [heroData, loading]);

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          Loading hero content...
        </div>
      </section>
    );
  }

  // Default values if no data is available
  const {
    title = "Become a Volunteer",
    quote = "Volunteering is not about giving your time; it's about changing lives – including your own.",
    buttonText = "Join Now",
    buttonLink = "#volunteer-signup",
    videoUrl = "/videos/volunteers-hero.mp4",
    overlayOpacity = 0.5,
    backgroundColor = "#1f2937",
    textColor = "#ffffff",
    buttonColor = "#7c3aed",
    buttonHoverColor = "#6d28d9",
    enableTypewriter = true,
    typewriterSpeed = 45,
    enableScrollIndicator = true,
    enableVideoAutoplay = true,
    enableVideoLoop = true,
    enableVideoMute = true
  } = heroData || {};

  // Convert overlayOpacity to proper decimal (if it's > 1, divide by 10)
  const normalizedOverlayOpacity = overlayOpacity > 1 ? overlayOpacity / 10 : overlayOpacity;
  
  // Force a lower opacity for testing - you can adjust this value
  const testOverlayOpacity = Math.min(normalizedOverlayOpacity, 0.4);

  // Debug log for video URL
  console.log('Video URL:', videoUrl);
  console.log('Video loaded:', videoLoaded);
  console.log('Video error:', videoError);

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: backgroundColor }}
    >
      {/* Video Background with Dynamic Overlay */}
      {videoUrl && (
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay={enableVideoAutoplay}
            muted={enableVideoMute}
            loop={enableVideoLoop}
            playsInline
            preload="metadata" // Add preload attribute
            className="absolute w-full h-full object-cover"
            style={{ 
              opacity: videoLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            {/* Add additional source formats if available */}
            <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
            <source src={videoUrl.replace('.mp4', '.ogg')} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
          
          {/* Fallback background if video fails */}
          {videoError && (
            <div 
              className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
              style={{ opacity: 0.8 }}
            />
          )}
          
          <div 
            className="absolute inset-0 bg-black z-10"
            style={{ opacity: testOverlayOpacity }}
          ></div>
        </div>
      )}

      

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          style={{ color: textColor }}
        >
          {title}
        </motion.h1>

        {quote && (
          <div className="max-w-3xl mx-auto">
            <div 
              ref={textRef}
              className="text-xl md:text-2xl italic mb-12 min-h-[6rem]"
              style={{ color: textColor }}
            ></div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: enableTypewriter ? 1.5 : 0.8 }}
        >
          <motion.a
            href={buttonLink}
            className="px-8 py-4 font-bold rounded-full text-xl transition-all duration-300 shadow-lg inline-block"
            style={{ 
              backgroundColor: buttonColor,
              color: textColor
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = buttonHoverColor || buttonColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = buttonColor;
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: [`0px 0px 0px ${buttonColor}50`, `0px 0px 20px ${buttonColor}50`, `0px 0px 0px ${buttonColor}50`],
            }}
            transition={{
              boxShadow: {
                repeat: Infinity,
                duration: 2,
              }
            }}
          >
            {buttonText}
          </motion.a>
        </motion.div>

        {/* Conditional Scroll Indicator */}
        {enableScrollIndicator && (
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ 
              opacity: { delay: 2, duration: 1 },
              y: { delay: 2, duration: 1.5, repeat: Infinity }
            }}
          >
            <div 
              className="w-8 h-12 rounded-full border-2 flex justify-center items-start p-2"
              style={{ borderColor: textColor }}
            >
              <div 
                className="w-1 h-3 rounded-full animate-bounce"
                style={{ backgroundColor: textColor }}
              ></div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;