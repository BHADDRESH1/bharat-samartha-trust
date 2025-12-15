import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

const CallToAction = ({ ctaId = 'main-cta' }) => {
  const [ctaData, setCtaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCTAData = async () => {
      try {
        setLoading(true);
        setError(null);
        //before this coprrection there was another extra /cta/ in the path , so i solved it
        console.log(`Fetching CTA data from: /api/cta/${ctaId}`);
        
        const result = await safeFetch(`/api/cta/${ctaId}`);
        console.log('Fetch result:', result);
        
        if (result.success && result.data) {
          setCtaData(result.data);
        } else {
          setError(result.error || 'Failed to load CTA data');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching CTA data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCTAData();
  }, [ctaId]);

  // Animation variants based on database animation settings
  const getAnimationVariant = (animationType) => {
    const variants = {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 }
      },
      slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
      },
      slideDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
      },
      none: {
        initial: {},
        animate: {},
        transition: {}
      }
    };
    return variants[animationType] || variants.fadeIn;
  };

  // Generate background styles based on database settings
  const getBackgroundStyle = () => {
    if (!ctaData) return {};

    switch (ctaData.backgroundStyle) {
      case 'gradient':
        return {
          background: `linear-gradient(to right, ${ctaData.gradientFrom || '#9333ea'}, ${ctaData.gradientTo || '#3b82f6'})`
        };
      case 'solid':
        return {
          backgroundColor: ctaData.backgroundColor || '#9333ea'
        };
      case 'image':
        return {
          backgroundImage: `url(${ctaData.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      default:
        return {
          background: 'linear-gradient(to right, #9333ea, #3b82f6)'
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-6 mx-auto max-w-md"></div>
            <div className="h-6 bg-white/20 rounded mb-8 mx-auto max-w-lg"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-14 bg-white/20 rounded-full w-40 mx-auto sm:mx-0"></div>
              <div className="h-14 bg-white/20 rounded-full w-40 mx-auto sm:mx-0"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto px-4">
          <FetchErrorFallback 
            message={error}
            onRetry={() => window.location.reload()}
            showRetry={true}
          />
        </div>
      </section>
    );
  }

  // Don't render if CTA is disabled
  if (!ctaData?.enabled) {
    return null;
  }

  const titleAnimation = getAnimationVariant(ctaData.animation?.title);
  const descriptionAnimation = getAnimationVariant(ctaData.animation?.description);
  const buttonsAnimation = getAnimationVariant(ctaData.animation?.buttons);

  return (
    <section 
      className="py-20 text-white"
      style={getBackgroundStyle()}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-6"
          initial={titleAnimation.initial}
          whileInView={titleAnimation.animate}
          viewport={{ once: true }}
          transition={titleAnimation.transition}
          style={{ color: ctaData.textColor || 'inherit' }}
        >
          {ctaData.title}
        </motion.h2>
        
        <motion.p 
          className="text-xl mb-8 max-w-2xl mx-auto"
          initial={descriptionAnimation.initial}
          whileInView={descriptionAnimation.animate}
          viewport={{ once: true }}
          transition={{ ...descriptionAnimation.transition, delay: 0.2 }}
          style={{ color: ctaData.textColor || 'inherit' }}
        >
          {ctaData.description}
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={buttonsAnimation.initial}
          whileInView={buttonsAnimation.animate}
          viewport={{ once: true }}
          transition={{ ...buttonsAnimation.transition, delay: 0.4 }}
        >
          <Link 
            href={ctaData.primaryButton.url}
            className={`px-8 py-4 font-bold rounded-full text-xl transition-all duration-300 hover:scale-105 shadow-lg ${ctaData.primaryButton.style}`}
          >
            {ctaData.primaryButton.text}
          </Link>
          <Link 
            href={ctaData.secondaryButton.url}
            className={`px-8 py-4 font-bold rounded-full text-xl transition-all duration-300 hover:scale-105 ${ctaData.secondaryButton.style}`}
          >
            {ctaData.secondaryButton.text}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;

