import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import ImpactCard from '@/components/ui/ImpactCard';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

const ImpactSection = () => {
  const [impactData, setImpactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await safeFetch('/api/impact', { timeout: 5000 });
        if (result.success && result.data) {
          setImpactData(result.data);
        } else {
          // Use fallback data instead of showing error
          setImpactData(getFallbackData());
        }
      } catch (err) {
        console.error('Error fetching impact data:', err);
        // Use fallback data on error
        setImpactData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  // Fallback data for Bharat Samarth Trust
  const getFallbackData = () => ({
    title: 'Our Impact Across Tamil Nadu',
    subtitle: 'TRANSFORMING LIVES TOGETHER',
    description: 'Through dedication and your generous support, Bharat Samarth Trust is making a real difference in communities across Tamil Nadu. Our impact spans education, healthcare, and social welfare with measurable results.',
    stats: [
      { id: '1', icon: '👥', number: '50,000+', label: 'Lives Impacted', description: 'Across Tamil Nadu', color: 'blue' },
      { id: '2', icon: '🏫', number: '50+', label: 'Schools Supported', description: 'With Educational Resources', color: 'green' },
      { id: '3', icon: '🏥', number: '25,000+', label: 'Patients Served', description: 'Through Medical Camps', color: 'red' },
      { id: '4', icon: '🌳', number: '50,000+', label: 'Trees Planted', description: 'For Sustainable Future', color: 'amber' }
    ],
    achievements: [
      {
        id: '1',
        title: 'Priya\'s Education Journey',
        description: 'From a small village in Madurai to becoming the first female engineer in her community, Priya\'s success story exemplifies the transformative power of our education scholarship program.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        category: 'Education',
        year: '2024'
      },
      {
        id: '2',
        title: 'Theni Village Healthcare',
        description: 'A village transformed by our mobile medical units. Disease rates have dropped by 60%, while healthcare accessibility has improved dramatically for 2,000+ families.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        category: 'Healthcare',
        year: '2023'
      },
      {
        id: '3',
        title: 'Women Empowerment Success',
        description: '500+ women across Tamil Nadu gained financial independence through our vocational training programs in tailoring, handicrafts, and entrepreneurship.',
        image: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=800',
        category: 'Social Welfare',
        year: '2023'
      }
    ],
    cta: {
      title: 'Join Our Mission',
      description: 'Together, we can create lasting change in more communities',
      buttonText: 'Get Involved',
      buttonLink: '/volunteer'
    }
  });

  const data = impactData || getFallbackData();

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        tagBg: 'bg-blue-100',
        tagText: 'text-blue-800'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        tagBg: 'bg-green-100',
        tagText: 'text-green-800'
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        tagBg: 'bg-red-100',
        tagText: 'text-red-800'
      },
      amber: {
        bg: 'bg-amber-100',
        text: 'text-amber-600',
        tagBg: 'bg-amber-100',
        tagText: 'text-amber-800'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        tagBg: 'bg-purple-100',
        tagText: 'text-purple-800'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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

  return (
    <section 
      className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      style={data.backgroundImage ? { 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-500 opacity-5 rounded-full -translate-y-1/2 scale-150"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-5 rounded-full translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {data.subtitle && (
            <span className="inline-block py-1 px-3 bg-blue-100 text-blue-800 font-medium rounded-full text-sm mb-4">
              {data.subtitle}
            </span>
          )}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            {data.title ? (
              <>
                {data.title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                  {data.title.split(' ').slice(-1)}
                </span>
              </>
            ) : (
              <>
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Impact</span>
              </>
            )}
          </h2>
          {data.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {data.description}
            </p>
          )}
        </motion.div>
        
        {/* Stats Section */}
        {data.stats && data.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {data.stats.map((stat, index) => {
              const colors = getColorClasses(stat.color || 'blue');
              return (
                <motion.div
                  key={stat.id || index}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`w-24 h-24 rounded-full ${colors.bg} flex items-center justify-center mb-4`}>
                    {stat.icon ? (
                      <span className="text-2xl">{stat.icon}</span>
                    ) : (
                      <span className={`text-3xl md:text-4xl font-bold ${colors.text}`}>
                        {stat.number}
                      </span>
                    )}
                  </div>
                  <h3 className="text-gray-800 font-bold mb-1">{stat.label}</h3>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* Impact Cards Section - keeping original structure for now */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ImpactCard 
            title="Clean Water Initiative"
            description="Provided 50,000+ people with access to clean drinking water through well construction and filtration systems."
            items={[
              { text: "Constructed 120 wells in rural areas" },
              { text: "Installed 85 water filtration systems" },
              { text: "Reduced waterborne diseases by 65%" }
            ]}
            color="blue"
            linkText="Learn more about our water projects"
            linkHref="/impact/water"
          />
          
          <ImpactCard 
            title="Education Program"
            description="Built 35 schools and educated over 12,000 children with quality learning resources and trained teachers."
            items={[
              { text: "Trained 450+ teachers in modern methods" },
              { text: "Distributed 15,000 educational kits" },
              { text: "Improved literacy rates by 42% in target communities" }
            ]}
            color="green"
            linkText="Learn more about our education projects"
            linkHref="/impact/education"
          />
          
          <ImpactCard 
            title="Healthcare Access"
            description="Delivered medical supplies and services to 75,000+ individuals through mobile clinics and health centers."
            items={[
              { text: "Established 22 mobile medical clinics" },
              { text: "Provided 130,000+ vaccinations" },
              { text: "Reduced infant mortality by 35% in target areas" }
            ]}
            color="red"
            linkText="Learn more about our healthcare projects"
            linkHref="/impact/healthcare"
          />
        </div>
        
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Global Reach, Local Impact</h3>
              <p className="text-gray-600 mb-6">
                Our programs have reached 25+ countries across 5 continents, with a focus on creating 
                sustainable solutions that empower local communities to thrive long-term.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">25+</div>
                  <div className="text-gray-600 text-sm">Countries</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">350+</div>
                  <div className="text-gray-600 text-sm">Projects</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">120+</div>
                  <div className="text-gray-600 text-sm">Communities</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 mb-1">1.2M+</div>
                  <div className="text-gray-600 text-sm">Lives Impacted</div>
                </div>
              </div>
              <Link 
                href="/impact/global"
                className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
              >
                Explore Our Global Impact
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            <div className="relative h-72 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive impact map would display here</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Achievements/Stories Section */}
        {data.achievements && data.achievements.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Transformation Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.achievements.map((achievement, index) => {
                const colors = getColorClasses(achievement.category?.toLowerCase() === 'education' ? 'green' : 
                                                achievement.category?.toLowerCase().includes('water') ? 'blue' : 'red');
                return (
                  <div key={achievement.id || index} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="h-48 relative">
                      <Image 
                        src={achievement.image || '/images/impact/default.jpg'} 
                        alt={achievement.title}
                        fill
                        style={{objectFit: "cover"}}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      {achievement.category && (
                        <span className={`inline-block py-1 px-2 ${colors.tagBg} ${colors.tagText} text-xs font-medium rounded mb-2`}>
                          {achievement.category}
                        </span>
                      )}
                      <h4 className="text-lg font-bold text-gray-800 mb-2">{achievement.title}</h4>
                      <p className="text-gray-600 mb-4">{achievement.description}</p>
                      <Link 
                        href={`/stories/${achievement.id || achievement.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center"
                      >
                        Read full story
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
        
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Download Our Annual Impact Report</h3>
            <p className="text-white/90 max-w-2xl">
              Get a comprehensive look at our programs, impact metrics, financial transparency, and plans for the future.
              Learn how your support is changing lives around the world.
            </p>
          </div>
          <Link 
            href="/impact-report"
            className="inline-flex items-center px-6 py-4 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 whitespace-nowrap"
          >
            Download Report
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;