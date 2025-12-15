import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

// Types based on your backend CTASection schema
interface Animation {
  initial: {
    opacity: number;
    y: number;
  };
  animate: {
    opacity: number;
    y: number;
  };
  transition: {
    duration: number;
    delay: number;
  };
}

interface Button {
  text: string;
  url: string;
  className: string;
}

interface CTAData {
  _id?: string;
  id: string;
  title: string;
  description: string;
  primaryButton: Button;
  secondaryButton: Button;
  sectionClassName: string;
  containerClassName: string;
  enabled: boolean;
  animation: {
    title: Animation;
    description: Animation;
    buttons: Animation;
  };
}

interface CTASectionProps {
  className?: string;
}

// API service
const ctaAPI = {
  getAllCTASections: async (): Promise<CTAData[]> => {
    try {
      const result = await safeFetch('/api/hero', {
        retries: 3, // Add retries for better resilience
        timeout: 15000, // Increase timeout
        cacheKey: 'hero-sections', // Add caching
        ttl: 600000 // Cache for 10 minutes
      });
      if (result.success && result.data) {
        const data = Array.isArray(result.data) ? result.data : [result.data];
        return data.filter((cta: CTAData) => cta.enabled);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch CTA sections:', error);
      return [];
    }
  }
};

const CTASection: React.FC<CTASectionProps> = ({ className = '' }) => {
  const [ctaData, setCTAData] = useState<CTAData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default fallback data matching hero style
  const defaultCTAData: CTAData = {
    id: 'default-cta',
    title: 'Ready to Make a Difference?',
    description: 'Join thousands of supporters who are already making an impact through compassion and action',
    primaryButton: {
      text: 'Donate Now',
      url: '/donate',
      className: ''
    },
    secondaryButton: {
      text: 'Learn More',
      url: '/about',
      className: ''
    },
    sectionClassName: '',
    containerClassName: '',
    enabled: true,
    animation: {
      title: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.2 }
      },
      description: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.4 }
      },
      buttons: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.6 }
      }
    }
  };

  useEffect(() => {
    const loadCTAData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const data = await ctaAPI.getAllCTASections();
        setCTAData(data.length > 0 ? data : [defaultCTAData]);
      } catch (err) {
        setError('Failed to load CTA sections');
        setCTAData([defaultCTAData]);
      } finally {
        setLoading(false);
      }
    };

    loadCTAData();
  }, []);

  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-center">
        <div className="max-w-md mx-auto">
          <FetchErrorFallback 
            message={error} 
            onRetry={() => window.location.reload()} 
            showRetry={true} 
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {ctaData.map((cta, index) => (
        <section 
          key={cta.id || index}
          className={`relative h-screen overflow-hidden flex items-center justify-center px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white ${cta.sectionClassName} ${className}`}
        >
          <div className="max-w-6xl mx-auto text-center z-10">
            
            {/* Title - matching hero typography */}
            <motion.h2 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              initial={cta.animation.title.initial}
              whileInView={cta.animation.title.animate}
              transition={cta.animation.title.transition}
              viewport={{ once: true, margin: "-100px" }}
            >
              {cta.title}
            </motion.h2>
            
            {/* Description - matching hero subtitle style */}
            <motion.p 
              className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8"
              initial={cta.animation.description.initial}
              whileInView={cta.animation.description.animate}
              transition={cta.animation.description.transition}
              viewport={{ once: true, margin: "-100px" }}
            >
              {cta.description}
            </motion.p>
            
            {/* Buttons - exactly matching hero button styles */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={cta.animation.buttons.initial}
              whileInView={cta.animation.buttons.animate}
              transition={cta.animation.buttons.transition}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Primary Button - Purple gradient matching hero */}
              <Link 
                href={cta.primaryButton.url}
                className={`
                  px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 
                  text-white font-bold rounded-full text-xl 
                  hover:scale-105 transition-all duration-300 shadow-lg 
                  inline-block
                  ${cta.primaryButton.className}
                `}
              >
                {cta.primaryButton.text}
              </Link>
              
              {/* Secondary Button - Outline style matching hero */}
              <Link 
                href={cta.secondaryButton.url}
                className={`
                  px-8 py-4 border-2 border-white text-white font-bold 
                  rounded-full text-xl hover:bg-white hover:text-gray-900 
                  transition-all duration-300 inline-block
                  ${cta.secondaryButton.className}
                `}
              >
                {cta.secondaryButton.text}
              </Link>
            </motion.div>
            
          </div>
        </section>
      ))}
    </>
  );
};

export default CTASection;