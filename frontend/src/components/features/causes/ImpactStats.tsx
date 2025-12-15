'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';
import { Heart, Book, Stethoscope, Users, Sprout, Globe, Calendar, Award, Target, Lightbulb, Zap } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  description: string;
  delay: number;
}

interface Goal {
  id: number;
  text: string;
  color: string;
}

interface Stat {
  id: number;
  icon: string;
  value: number;
  label: string;
  color: string;
  description: string;
  delay: number;
}

interface ImpactData {
  headerData: {
    title: string;
    subtitle: string;
  };
  stats: Stat[];
  storyContent: {
    title: string;
    paragraphs: string[];
  };
  goalsContent: {
    title: string;
    goals: Goal[];
  };
  footerQuote: string;
}

// Default fallback data
const DEFAULT_DATA: ImpactData = {
  headerData: {
    title: "Our Global Impact",
    subtitle: "Transforming lives and communities through compassion and action"
  },
  stats: [
    {
      id: 1,
      icon: "Heart",
      value: 1250000,
      label: "meals served",
      color: "text-red-500",
      description: "Nutritious meals delivered to communities facing food insecurity across 27 countries.",
      delay: 0.1
    },
    {
      id: 2,
      icon: "Book",
      value: 75000,
      label: "children educated",
      color: "text-blue-500",
      description: "Quality education provided through our scholarship programs and 120 newly built schools.",
      delay: 0.2
    },
    {
      id: 3,
      icon: "Stethoscope",
      value: 500000,
      label: "medical consultations",
      color: "text-green-500",
      description: "Free healthcare services delivered by our volunteer medical professionals in underserved areas.",
      delay: 0.3
    },
    {
      id: 4,
      icon: "Users",
      value: 1000,
      label: "volunteers worldwide",
      color: "text-purple-500",
      description: "Dedicated individuals donating their time and expertise across 42 countries.",
      delay: 0.4
    }
  ],
  storyContent: {
    title: "Our Journey",
    paragraphs: [
      "Founded in 2010 by a small group of passionate individuals, our organization began with a simple mission: to make tangible differences in communities facing the greatest challenges.",
      "What started as local weekend meal deliveries has grown into a global movement spanning 50 countries and impacting millions of lives through sustainable development programs.",
      "Today, we work with governments, local leaders, and other NGOs to implement data-driven solutions that address the root causes of poverty, inequality, and environmental degradation."
    ]
  },
  goalsContent: {
    title: "Future Goals",
    goals: [
      { id: 1, text: "Expand educational programs to reach 200,000 children by 2027", color: "bg-blue-500" },
      { id: 2, text: "Plant 1 million trees as part of our climate action initiative", color: "bg-green-500" },
      { id: 3, text: "Establish 50 new community health centers in underserved regions", color: "bg-purple-500" },
      { id: 4, text: "Increase volunteer base to 2,500 active members worldwide", color: "bg-red-500" }
    ]
  },
  footerQuote: "Together, we're not just changing statistics – we're changing lives."
};

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, color, description, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="mb-6 relative"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300">
        <div className="flex-1">
          <span className="font-bold text-2xl">
            <CountUp end={value} separator="," duration={2.5} />
            <span className="text-sm ml-1">{label}</span>
          </span>
          <motion.p 
            className="text-sm text-gray-600 mt-1 max-w-md"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.p>
        </div>
        <motion.div 
          className={`${color} h-12 w-12 rounded-full flex items-center justify-center bg-opacity-20 p-2 flex-shrink-0 ml-4`}
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};

const ImpactStats: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'story' | 'goals'>('stats');
  const [isVisible, setIsVisible] = useState(false);
  const [impactData, setImpactData] = useState<ImpactData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'default' | 'api'>('default');

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Heart': <Heart />,
      'Book': <Book />,
      'Stethoscope': <Stethoscope />,
      'Users': <Users />,
      'Sprout': <Sprout />,
      'Globe': <Globe />,
      'Calendar': <Calendar />,
      'Award': <Award />,
      'Target': <Target />,
      'Lightbulb': <Lightbulb />,
      'Zap': <Zap />
    };
    return iconMap[iconName] || <Heart />;
  };

  // Color validation function
  const validateColor = (color: string) => {
    const validColors = [
      'text-red-500', 'text-blue-500', 'text-green-500', 'text-purple-500',
      'text-emerald-500', 'text-indigo-500', 'text-amber-500', 'text-rose-500',
      'text-orange-500', 'text-cyan-500', 'text-pink-500', 'text-teal-500',
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
      'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-rose-500',
      'bg-orange-500', 'bg-cyan-500', 'bg-pink-500', 'bg-teal-500'
    ];
    return validColors.includes(color) ? color : 'text-blue-500';
  };

  // Fetch data from API
  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        setLoading(true);
        console.log('Attempting to fetch from /api/causeImpact...');
        
        const result = await safeFetch('/api/causeImpact', { timeout: 5000 });
        console.log('Response received:', result.status, result.success);
        
        if (result.success && result.data && typeof result.data === 'object') {
          setImpactData(result.data);
          setDataSource('api');
          console.log('Using API data');
        } else {
          console.log('API failed or invalid data, using default fallback');
          setDataSource('default');
        }
      } catch (err) {
        console.error('Error fetching impact data:', err);
        setDataSource('default');
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Always render something - no empty states
  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 md:p-8 transition-all duration-700 overflow-hidden max-w-6xl mx-auto"
        style={{ 
          backgroundImage: "linear-gradient(to right bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.8))",
          backgroundSize: "cover"
        }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        ref={statsRef}
      >
        

        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {impactData.headerData?.title || 'Our Global Impact'}
          </h2>
          <p className="text-gray-600 mt-2 max-w-lg mx-auto">
            {impactData.headerData?.subtitle || 'Transforming lives and communities through compassion and action'}
          </p>
        </motion.div>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            {['stats', 'story', 'goals'].map((tab) => (
              <motion.button
                key={tab}
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === tab ? 'bg-white shadow-md text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab(tab as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'stats' && (
              <div className="grid md:grid-cols-2 gap-4">
                {impactData.stats && impactData.stats.length > 0 ? (
                  impactData.stats.map((stat, index) => (
                    <StatItem
                      key={stat.id || index}
                      icon={getIconComponent(stat.icon)}
                      value={stat.value}
                      label={stat.label}
                      color={validateColor(stat.color)}
                      description={stat.description}
                      delay={stat.delay}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500 py-8">
                    <p>No statistics available</p>
                    <p className="text-sm">Data: {JSON.stringify(impactData.stats)}</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'story' && (
  <motion.div 
    className="bg-gray-50 p-6 rounded-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-2xl font-bold mb-4 text-gray-800">
      {impactData.storyContent?.title || 'Our Journey'}
    </h3>
    {impactData.storyContent?.paragraphs && impactData.storyContent.paragraphs.length > 0 ? (
      <>
        {impactData.storyContent.paragraphs.map((paragraph, index) => (
          <p 
            key={index} 
            className={`text-gray-700 ${index === impactData.storyContent.paragraphs.length - 1 ? '' : 'mb-4'}`}
          >
            {paragraph}
          </p>
        ))}
      </>
    ) : (
      <p className="text-gray-500">No story content available</p>
    )}
  </motion.div>
)}
            
            {activeTab === 'goals' && (
              <motion.div 
                className="bg-gray-50 p-6 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  {impactData.goalsContent?.title || 'Future Goals'}
                </h3>
                {impactData.goalsContent?.goals && impactData.goalsContent.goals.length > 0 ? (
                  <ul className="space-y-3">
                    {impactData.goalsContent.goals.map((goal, index) => (
                      <motion.li 
                        key={goal.id || index}
                        className="flex items-center text-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className={`h-2 w-2 rounded-full ${validateColor(goal.color)} mr-2`}></span>
                        {goal.text}
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No goals available</p>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-gray-600 italic">
            {impactData.footerQuote || '"Together, we\'re not just changing statistics – we\'re changing lives."'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImpactStats;