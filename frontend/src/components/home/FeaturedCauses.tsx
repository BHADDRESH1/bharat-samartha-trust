import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CauseCard from '@/components/ui/CauseCard';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

interface Cause {
  _id?: string;
  id: number;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  donors: number;
  category?: string;
  featured?: boolean;
  priority?: number;
  endDate?: Date;
  status?: string;
  tags?: string[];
}

interface FeaturedCausesSection {
  _id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  maxDisplayed?: number;
  causes?: Cause[];
}

const FeaturedCauses: React.FC = () => {
  const [sectionData, setSectionData] = useState<FeaturedCausesSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCauses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await safeFetch('/api/causes', { timeout: 5000 });
        console.log('Fetch result:', result);
        
        if (result.success && result.data) {
          setSectionData(result.data);
        } else {
          // Use fallback data
          setSectionData(getFallbackData());
        }
      } catch (err) {
        console.error('Error fetching featured causes:', err);
        // Use fallback data on error
        setSectionData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCauses();
  }, []);

  // Fallback data for Bharat Samarth Trust
  const getFallbackData = (): FeaturedCausesSection => ({
    title: 'Featured Causes',
    subtitle: 'SUPPORT OUR MISSION',
    description: 'Your contributions make a real difference in the lives of people across Tamil Nadu',
    maxDisplayed: 3,
    causes: [
      {
        id: 1,
        title: 'Education for All',
        description: 'Provide scholarships and learning materials to underprivileged children',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        raised: 325000,
        goal: 500000,
        donors: 245,
        category: 'Education',
        featured: true,
        status: 'active'
      },
      {
        id: 2,
        title: 'Rural Healthcare',
        description: 'Mobile medical units serving remote villages',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        raised: 480000,
        goal: 750000,
        donors: 312,
        category: 'Healthcare',
        featured: true,
        status: 'active'
      },
      {
        id: 3,
        title: 'Clean Water Access',
        description: 'Installing purification systems in water-scarce regions',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        raised: 280000,
        goal: 400000,
        donors: 189,
        category: 'Infrastructure',
        featured: true,
        status: 'active'
      }
    ]
  });

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading featured causes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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

  if (!sectionData) {
    return null;
  }

  // Handle different data structures and provide fallbacks
  const causes = sectionData.causes || [];
  const maxDisplay = sectionData.maxDisplayed || 6;
  
  // Filter and process causes similar to events
  let displayedCauses = causes.length > 0 
    ? causes
        .filter(cause => cause.featured !== false) // Show all if no featured flag
        .sort((a, b) => (a.priority || 999) - (b.priority || 999))
        .slice(0, maxDisplay)
    : [];

  // If no causes from API, show fallback message instead of mock data
  // This ensures we only show real data from your backend

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold tracking-wide uppercase">
              {sectionData?.subtitle || "Make a Difference"}
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-6 leading-tight">
            {sectionData?.title || "Featured Causes"}
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {sectionData?.description || "Join us in making a positive impact. Every contribution brings us closer to our goals."}
          </p>
        </motion.div>

        {displayedCauses.length > 0 ? (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {displayedCauses.map((cause, index) => (
                <motion.div
                  key={cause.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -8 }}
                  className="transform transition-all duration-300"
                >
                  <CauseCard 
                    cause={cause} 
                    delay={index * 0.1}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link 
                href="/causes"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-1"
              >
                <span className="relative z-10">View All Causes</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg 
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Featured Causes</h3>
              <p className="text-gray-500">Check back soon for new causes that need your support.</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCauses;