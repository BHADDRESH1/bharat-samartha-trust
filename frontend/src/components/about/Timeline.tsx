import { useRef, useEffect, useState } from 'react';
import { safeFetch } from '@/lib/fetchUtils';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface TimelineItem {
  _id: string; // MongoDB ObjectId
  id?: number; // Optional for backwards compatibility
  year: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TimelineProps {
  apiEndpoint?: string; // Optional prop to customize API endpoint
}

export default function Timeline({ apiEndpoint = '/api/timeline' }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch timeline data from database
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        const result = await safeFetch(apiEndpoint);
        if (result.success && result.data) {
          setTimelineData(result.data);
        } else {
          // Use fallback data
          setTimelineData(getFallbackTimelineData());
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        // Use fallback data on error
        setTimelineData(getFallbackTimelineData());
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [apiEndpoint]);

  // Fallback timeline data for Bharat Samarth Trust
  const getFallbackTimelineData = (): TimelineItem[] => [
    {
      _id: '1',
      year: '2015',
      title: 'Foundation Established',
      description: 'Bharat Samarth Trust was founded with a vision to empower underprivileged communities across Tamil Nadu through education, healthcare, and social welfare initiatives.'
    },
    {
      _id: '2',
      year: '2017',
      title: 'First Healthcare Camp',
      description: 'Successfully conducted our first free medical camp in rural villages, providing healthcare services to over 500 families and establishing mobile medical units.'
    },
    {
      _id: '3',
      year: '2018',
      title: 'Education Program Launch',
      description: 'Launched scholarship programs for underprivileged children, distributing books and school supplies to 1,000+ students across 50 schools in Tamil Nadu.'
    },
    {
      _id: '4',
      year: '2020',
      title: 'COVID-19 Relief Efforts',
      description: 'Mobilized emergency response teams during the pandemic, distributing food supplies, medical equipment, and essential services to 10,000+ affected families.'
    },
    {
      _id: '5',
      year: '2022',
      title: 'Women Empowerment Initiative',
      description: 'Started vocational training programs empowering 500+ women with skills in tailoring, handicrafts, and entrepreneurship, fostering financial independence.'
    },
    {
      _id: '6',
      year: '2024',
      title: 'Sustainable Future Projects',
      description: 'Launched environmental conservation drives including tree plantation campaigns (50,000+ trees), clean water access projects, and waste management initiatives across Tamil Nadu.'
    }
  ];

  // GSAP animations - only run after data is loaded
  useEffect(() => {
    if (loading || timelineData.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const timeline = timelineRef.current;
    if (timeline) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        // Create a horizontal scrolling effect for the timeline
        gsap.to('.timeline-container', {
          x: () => -(timeline.scrollWidth - timeline.clientWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: timeline,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          }
        });

        // Animate each timeline item
        gsap.from('.timeline-item', {
          opacity: 0,
          y: 20,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: timeline,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading, timelineData]);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              "From a Small Dream to a Nationwide Movement"
            </p>
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="text-gray-600">Loading timeline...</span>
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
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              "From a Small Dream to a Nationwide Movement"
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto">
              <h3 className="text-red-800 font-semibold mb-2">Unable to load timeline</h3>
              <p className="text-red-600">{error}</p>
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

  // Empty state
  if (timelineData.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              "From a Small Dream to a Nationwide Movement"
            </p>
            <p className="text-gray-500">No timeline items found.</p>
          </div>
        </div>
      </section>
    );
  }

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
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Our Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            "From a Small Dream to a Nationwide Movement"
          </p>
        </motion.div>
                
        <div ref={timelineRef} className="relative overflow-hidden" style={{ height: '500px' }}>
          <div className="timeline-container flex items-center space-x-16 absolute left-0 px-4">
            {timelineData.map((item) => (
              <div key={item._id || item.id} className="timeline-item w-80 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-purple-600 mb-2">{item.year}</h3>
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
                    
          {/* Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2">
            <div className="absolute top-1/2 left-0 h-3 w-3 bg-purple-600 rounded-full -translate-y-1/2"></div>
          </div>
        </div>
                
        <div className="text-center mt-12">
          <motion.p 
            className="text-xl font-semibold text-purple-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join us in writing the next chapter of hope!
          </motion.p>
        </div>
      </div>
    </section>
  );
}