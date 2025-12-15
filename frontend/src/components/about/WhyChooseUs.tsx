import { motion } from 'framer-motion';
import { CheckCircle, Shield, Heart, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

export default function WhyChooseUs() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Icon mapping based on iconType from database
  const iconMap = {
    shield: <Shield className="w-8 h-8 text-purple-600" />,
    heart: <Heart className="w-8 h-8 text-red-500" />,
    chart: <BarChart3 className="w-8 h-8 text-blue-500" />,
    check: <CheckCircle className="w-8 h-8 text-green-500" />,
  };

  // Button styling based on type
  const getButtonStyles = (type) => {
    switch (type) {
      case 'primary':
        return 'px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-lg';
      case 'secondary':
        return 'px-6 py-3 bg-transparent border-2 border-purple-600 text-purple-600 font-bold rounded-full hover:bg-purple-50 transition-all duration-300';
      case 'tertiary':
        return 'px-6 py-3 bg-transparent border-2 border-blue-500 text-blue-500 font-bold rounded-full hover:bg-blue-50 transition-all duration-300';
      default:
        return 'px-6 py-3 bg-gray-600 text-white font-bold rounded-full hover:bg-gray-700 transition-all duration-300';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await safeFetch('/api/choose');
        if (result.success && result.data) {
          setData(result.data);
        } else {
          // Use fallback data
          setData(getFallbackData());
        }
      } catch (err) {
        console.error('Failed to fetch Why Choose Us data:', err);
        // Use fallback data on error
        setData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback data for Bharat Samarth Trust
  const getFallbackData = () => ({
    sectionTitle: 'Why Choose Bharat Samarth Trust',
    sectionSubtitle: 'Making a Meaningful Difference Together',
    reasons: [
      {
        _id: '1',
        iconType: 'shield',
        title: 'Transparency & Trust',
        description: 'Complete transparency in fund utilization with regular impact reports and financial disclosures. Every contribution is tracked and reported.',
        order: 1
      },
      {
        _id: '2',
        iconType: 'heart',
        title: 'Grassroots Impact',
        description: 'Direct engagement with communities across Tamil Nadu, ensuring resources reach those who need them most without intermediaries.',
        order: 2
      },
      {
        _id: '3',
        iconType: 'chart',
        title: 'Proven Track Record',
        description: '9+ years of dedicated service, impacting 50,000+ lives through education, healthcare, and empowerment programs across Tamil Nadu.',
        order: 3
      },
      {
        _id: '4',
        iconType: 'check',
        title: 'Holistic Approach',
        description: 'Comprehensive programs addressing education, healthcare, women empowerment, environmental sustainability, and social welfare initiatives.',
        order: 4
      }
    ],
    buttons: [
      {
        _id: 'btn1',
        text: 'Support Our Cause',
        url: '/donate',
        type: 'primary',
        isVisible: true
      },
      {
        _id: 'btn2',
        text: 'Become a Volunteer',
        url: '/volunteer',
        type: 'secondary',
        isVisible: true
      }
    ],
    isVisible: true
  });

  // Loading state
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex items-start p-6 rounded-xl bg-gray-50 shadow-md">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-red-800 mb-2">Unable to Load Content</h2>
              <p className="text-red-600">Failed to fetch data: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (!data) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No content available</p>
          </div>
        </div>
      </section>
    );
  }

  // Sort reasons by order field
  const sortedReasons = data.reasons?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
  
  // Filter visible buttons
  const visibleButtons = data.ctaButtons?.filter(button => button.visible) || [];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            {data.mainTitle || 'Why Choose Us?'}
          </h2>
          {data.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedReasons.map((reason, index) => (
            <motion.div 
              key={reason._id || reason.id}
              className="flex items-start p-6 rounded-xl bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="mr-4 p-2 bg-white rounded-full shadow-md">
                {iconMap[reason.iconType] || iconMap.check}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {data.ctaText && (
            <p className="text-xl text-purple-600 font-semibold mb-4">
              {data.ctaText}
            </p>
          )}
          
          {visibleButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {visibleButtons.map((button) => (
                <a 
                  key={button.id || button._id}
                  href={button.href}
                  className={getButtonStyles(button.type)}
                >
                  {button.text}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}