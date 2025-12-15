import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order?: number;
  isVisible?: boolean;
}

interface SectionSettings {
  title?: string;
  subtitle?: string;
  volunteerText?: string;
  volunteerCount?: string;
  ctaText?: string;
  ctaLink?: string;
  showCtaSection?: boolean;
  backgroundColor?: string;
  isVisible?: boolean;
}

interface TeamData {
  sectionSettings: SectionSettings;
  members: TeamMember[];
}

export default function TeamSection() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTeamMember, setActiveTeamMember] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const result = await safeFetch('/api/team', { 
        timeout: 15000, // Increase timeout
        retries: 3 // Add retries
      });
      
      if (result.success && result.data) {
        setTeamData(result.data);
      } else {
        // Use fallback data
        setTeamData(getFallbackData());
      }
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError('Failed to load team data');
      // Use fallback data on error
      setTeamData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  // Fallback data for Bharat Samarth Trust
  const getFallbackData = (): TeamData => ({
    sectionSettings: {
      title: 'Meet Our Dedicated Team',
      subtitle: 'LEADERSHIP',
      volunteerText: 'Active Volunteers',
      volunteerCount: '250+',
      ctaText: 'Join Our Team',
      ctaLink: '/get-involved',
      showCtaSection: true,
      backgroundColor: 'white',
      isVisible: true
    },
    members: [
      {
        id: '1',
        name: 'DR T VEERAMANI',
        role: 'Founder & Director',
        bio: 'Leading Bharat Samarth Trust with dedication and vision to empower communities across Tamil Nadu.',
        image: '',
        order: 1,
        isVisible: true
      }
    ]
  });

  // Loading state
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading team data...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <FetchErrorFallback 
              message={error} 
              onRetry={fetchTeamData}
              showRetry={true}
            />
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (!teamData) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No team data available.</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if section is set to not visible
  if (teamData.sectionSettings.isVisible === false) {
    return null;
  }

  // Filter visible members and sort by order
  const visibleMembers = teamData.members
    .filter(member => member.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Use settings from database or fallback to defaults
  const {
    title = "Meet Our Team",
    subtitle = "The Heart Behind the Mission",
    volunteerText = "Volunteers & Change-Makers",
    volunteerCount = "+1000",
    ctaText = "Join Our Team",
    ctaLink = "/get-involved",
    showCtaSection = true,
    backgroundColor = "bg-gray-50"
  } = teamData.sectionSettings;

  return (
    <section className={`py-16 md:py-24 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            "{subtitle}"
          </p>
        </motion.div>
                
        {visibleMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleMembers.map((member, index) => (
              <motion.div 
                key={member.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setActiveTeamMember(member.id)}
                onHoverEnd={() => setActiveTeamMember(null)}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={member.image || `/api/placeholder/400/400`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = `/api/placeholder/400/400`;
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent transition-opacity duration-300 ${activeTeamMember === member.id ? 'opacity-70' : 'opacity-0'}`} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                    <p className="text-purple-600 font-medium">{member.role}</p>
                    
                    <div
                      className={`mt-4 overflow-hidden transition-all duration-300 ${activeTeamMember === member.id ? 'max-h-48' : 'max-h-0'}`}
                    >
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
                
        {showCtaSection && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl text-gray-700 mb-8">
              <span className="font-bold">{volunteerCount} {volunteerText}</span> across India
            </p>
            <div className="inline-block">
              <a 
                href={ctaLink}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {ctaText}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}