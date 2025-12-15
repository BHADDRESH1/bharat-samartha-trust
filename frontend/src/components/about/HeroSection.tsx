import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { safeFetch } from '@/lib/fetchUtils';

interface HeroData {
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundVideo?: string;
  overlayGradient: {
    from: string;
    to: string;
    opacity: number;
  };
  showScrollIndicator: boolean;
  height: string;
  isVisible: boolean;
}

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hero data from database
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const result = await safeFetch('/api/aboutHero', { timeout: 5000 });
        if (result.success && result.data) {
          setHeroData(result.data);
        } else {
          // Use fallback data
          setHeroData(getFallbackData());
        }
      } catch (err) {
        console.error('Error fetching hero data:', err);
        // Use fallback data on error
        setHeroData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Fallback data for Bharat Samarth Trust
  const getFallbackData = (): HeroData => ({
    title: 'About Bharat Samarth Trust',
    subtitle: 'Empowering Communities Across Tamil Nadu Since 2015',
    backgroundImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920',
    backgroundVideo: '',
    overlayGradient: {
      from: 'purple-900/60',
      to: 'blue-900/60',
      opacity: 60
    },
    showScrollIndicator: true,
    height: '70vh',
    isVisible: true
  });

  // Convert Tailwind gradient classes to CSS
  const getGradientStyle = (overlayGradient: any) => {
    const colorMap: { [key: string]: string } = {
      'purple-900': 'rgb(88, 28, 135)',
      'blue-900': 'rgb(30, 58, 138)',
      'indigo-900': 'rgb(49, 46, 129)',
      'green-900': 'rgb(20, 83, 45)',
      'orange-900': 'rgb(154, 52, 18)',
      'red-900': 'rgb(127, 29, 29)',
      'gray-900': 'rgb(17, 24, 39)',
      'black': 'rgb(0, 0, 0)'
    };

    const fromColor = overlayGradient.from.replace('/60', '');
    const toColor = overlayGradient.to.replace('/60', '');
    const opacity = overlayGradient.opacity / 100;

    const fromRgb = colorMap[fromColor] || colorMap['purple-900'];
    const toRgb = colorMap[toColor] || colorMap['blue-900'];

    return {
      background: `linear-gradient(to right, ${fromRgb.replace('rgb', 'rgba').replace(')', `, ${opacity})`)}, ${toRgb.replace('rgb', 'rgba').replace(')', `, ${opacity})`)})`
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative h-[70vh] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Error state or if section is not visible
  if (error || !heroData || !heroData.isVisible) {
    return null;
  }

  return (
    <div 
      className="relative overflow-hidden"
      style={{ height: heroData.height }}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {heroData.backgroundVideo ? (
          <div className="w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              poster={heroData.backgroundImage}
            >
              <source src={heroData.backgroundVideo} type="video/mp4" />
              {/* Fallback to image if video fails */}
            </video>
            {/* Fallback image if video doesn't load */}
            <img 
              src={heroData.backgroundImage}
              alt="Hero background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ display: 'none' }}
              onError={(e) => {
                e.currentTarget.style.display = 'block';
                if (videoRef.current) {
                  videoRef.current.style.display = 'none';
                }
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-900">
            <img 
              src={heroData.backgroundImage}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10" 
        style={getGradientStyle(heroData.overlayGradient)}
      />
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {heroData.title}
        </motion.h1>
        
        <motion.div
          className="backdrop-blur-sm bg-white/10 p-6 rounded-xl max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-xl md:text-2xl text-white font-light">
            {heroData.subtitle}
          </p>
        </motion.div>
        
        {heroData.showScrollIndicator && (
          <motion.div 
            className="absolute bottom-8 w-full flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="animate-bounce w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}