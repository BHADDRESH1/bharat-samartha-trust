'use client'

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

interface TopVolunteer {
  name: string;
  hours: number;
  badge: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface ImpactGoal {
  metric: string;
  currentValue: number;
  targetValue: number;
  deadline: string;
  status: 'on-track' | 'behind' | 'achieved';
}

interface ImpactStats {
  volunteersThisMonth: number;
  totalHours: number;
  projects: number;
  livesImpacted: number;
}

interface ImpactData {
  stats: ImpactStats;
  topVolunteers: TopVolunteer[];
  goals: ImpactGoal[];
}

const ImpactTrackerSection = () => {
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [animatedStats, setAnimatedStats] = useState<ImpactStats>({
    volunteersThisMonth: 0,
    totalHours: 0,
    projects: 0,
    livesImpacted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [userHours, setUserHours] = useState<number>(1);
  const [userImpact, setUserImpact] = useState<{hours: number, people: number}>({ hours: 1, people: 3 });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  
  // Function to get initials from name for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  // Function to get a consistent color for each volunteer based on their name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };
  
  // Fetch data from database
  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        setLoading(true);
        const result = await safeFetch('/api/vimpact');
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to fetch data');
        }
        
        const data: ImpactData = result.data;
        setImpactData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching impact data:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMsg);
        
        // Fallback to dummy data if API fails
        setImpactData({
          stats: {
            volunteersThisMonth: 230,
            totalHours: 10645,
            projects: 52,
            livesImpacted: 5280
          },
          topVolunteers: [
            { name: "Sarah Johnson", hours: 143, badge: "Community Hero", email: "sarah@example.com", status: "active", joinDate: "2024-01-15" },
            { name: "Michael Chen", hours: 126, badge: "Teacher", email: "michael@example.com", status: "active", joinDate: "2024-02-20" },
            { name: "Aisha Patel", hours: 118, badge: "Environmental Champion", email: "aisha@example.com", status: "active", joinDate: "2024-01-30" },
            { name: "David Wilson", hours: 107, badge: "Mentor", email: "david@example.com", status: "active", joinDate: "2024-03-05" },
          ],
          goals: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);
  
  // Animate counting for stats when data is loaded
  useEffect(() => {
    if (!impactData || !countRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: countRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      }
    });
    
    tl.to(animatedStats, {
      duration: 2,
      volunteersThisMonth: impactData.stats.volunteersThisMonth,
      totalHours: impactData.stats.totalHours,
      projects: impactData.stats.projects,
      livesImpacted: impactData.stats.livesImpacted,
      roundProps: ["volunteersThisMonth", "totalHours", "projects", "livesImpacted"],
      onUpdate: () => {
        setAnimatedStats({...animatedStats});
      },
      ease: "power2.out"
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [impactData]);
  
  // Calculate user impact
  useEffect(() => {
    setUserImpact({
      hours: userHours,
      people: Math.floor(userHours * 3)
    });
  }, [userHours]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Filter active volunteers and sort by hours
  const activeVolunteers = impactData?.topVolunteers
    .filter(volunteer => volunteer.status === 'active')
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 4) || [];

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading impact data...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !impactData) {
    return (
      <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold">Unable to load impact data</p>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-indigo-800 mb-4">Live Impact Tracker</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch in real-time how our volunteers are changing the world
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md text-sm max-w-md mx-auto">
              Using cached data due to connection issues
            </div>
          )}
        </motion.div>
        
        {/* Live Stats Counter */}
        <div ref={countRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">New Volunteers</h3>
            </div>
            <p className="text-4xl font-bold text-blue-600">{animatedStats.volunteersThisMonth}</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">Hours Logged</h3>
            </div>
            <p className="text-4xl font-bold text-purple-600">{animatedStats.totalHours.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">And counting</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">Active Projects</h3>
            </div>
            <p className="text-4xl font-bold text-green-600">{animatedStats.projects}</p>
            <p className="text-sm text-gray-500 mt-1">Ongoing initiatives</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">Lives Impacted</h3>
            </div>
            <p className="text-4xl font-bold text-amber-600">{animatedStats.livesImpacted.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">People helped</p>
          </motion.div>
        </div>
        
        {/* Your Impact Calculator */}
        <motion.div 
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:flex">
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-indigo-800 to-purple-700 text-white">
              <h3 className="text-2xl font-bold mb-4">Calculate Your Impact</h3>
              <p className="mb-6">
                See the difference your time can make. Move the slider to calculate the impact you could have.
              </p>
              
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                  Hours you can volunteer per month
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={userHours} 
                  onChange={(e) => setUserHours(parseInt(e.target.value))} 
                  className="w-full accent-pink-500"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>1 hour</span>
                  <span>20 hours</span>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <motion.button 
                  className="py-3 px-6 bg-white text-indigo-800 rounded-full font-bold hover:bg-indigo-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Volunteering Today
                </motion.button>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Potential Impact</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-2">With <span className="font-bold text-indigo-700">{userHours} {userHours === 1 ? 'hour' : 'hours'}</span> per month:</p>
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-indigo-700">{userHours * 12}</p>
                      <p className="text-sm text-gray-500">Hours contributed annually</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-purple-700">{userImpact.people * 12}</p>
                      <p className="text-sm text-gray-500">People you could help annually</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Volunteer Leaderboard */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Volunteer Recognition Board</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeVolunteers.map((volunteer, index) => (
              <motion.div 
                key={`${volunteer.email}-${index}`} 
                className="bg-white rounded-xl p-4 shadow-md flex items-center"
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 ${getAvatarColor(volunteer.name)}`}>
                  {getInitials(volunteer.name)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{volunteer.name}</h4>
                  <div className="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">{volunteer.hours} hours contributed</span>
                  </div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    {volunteer.badge}
                  </span>
                </div>
                {index === 0 && (
                  <div className="ml-2">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <motion.button 
              className="py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Volunteers
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactTrackerSection;