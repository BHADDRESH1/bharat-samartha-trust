import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';
import Link from 'next/link';
import { Clock, MapPin, ArrowRight, Users, Heart } from 'lucide-react';

interface Activity {
  id: number;
  title: string;
  time: string;
  location: string;
  description: string;
  days: string[];
  visible: boolean;
  volunteers?: number;
  beneficiaries?: number;
  icon?: string;
  color?: string;
}

interface Settings {
  sectionVisible: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  showSchedule: boolean;
  showVolunteerCount: boolean;
  showBeneficiaryCount: boolean;
}

interface DailyData {
  activities: Activity[];
  settings: Settings;
}

const DailyActivitiesSection: React.FC = () => {
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        setLoading(true);
        const result = await safeFetch('/api/activities');
        
        if (result.success && result.data) {
          setDailyData(result.data);
        } else {
          setError(result.error || 'Failed to fetch activities');
        }
      } catch (err) {
        console.error('Error fetching daily activities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyData();
  }, []);

  // Don't render if section is not visible or data is not loaded
  if (!dailyData?.settings?.sectionVisible || loading) {
    return loading ? (
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    ) : null;
  }

  if (error) {
    return (
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">Error loading activities: {error}</p>
        </div>
      </div>
    );
  }

  const { activities, settings } = dailyData;
  const visibleActivities = activities.filter(activity => activity.visible);

  // Get dynamic color classes
  const getColorClasses = (color?: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    
    return colorMap[color || 'blue'] || colorMap.blue;
  };

  const getAccentColor = (color?: string) => {
    const accentMap: { [key: string]: string } = {
      blue: 'text-blue-600 hover:text-blue-800',
      green: 'text-green-600 hover:text-green-800',
      purple: 'text-purple-600 hover:text-purple-800',
      red: 'text-red-600 hover:text-red-800',
      yellow: 'text-yellow-600 hover:text-yellow-800',
      indigo: 'text-indigo-600 hover:text-indigo-800',
      pink: 'text-pink-600 hover:text-pink-800',
      orange: 'text-orange-600 hover:text-orange-800',
    };
    
    return accentMap[color || 'purple'] || accentMap.purple;
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            {settings.sectionTitle || 'Daily Activities'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {settings.sectionSubtitle || 'Our ongoing programs that make a difference every day in our communities.'}
          </p>
        </motion.div>
        
        {visibleActivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No activities are currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visibleActivities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Header with optional icon */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      {activity.title}
                    </h3>
                    {activity.icon && (
                      <div className={`w-12 h-12 rounded-lg ${getColorClasses(activity.color)} flex items-center justify-center ml-4`}>
                        <span className="text-lg">{activity.icon}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{activity.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                </div>

                {/* Stats section */}
                {(settings.showVolunteerCount || settings.showBeneficiaryCount) && 
                 (activity.volunteers || activity.beneficiaries) && (
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center justify-center space-x-6 text-sm">
                      {settings.showVolunteerCount && activity.volunteers && (
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{activity.volunteers} volunteers</span>
                        </div>
                      )}
                      {settings.showBeneficiaryCount && activity.beneficiaries && (
                        <div className="flex items-center text-gray-600">
                          <Heart className="w-4 h-4 mr-1" />
                          <span>{activity.beneficiaries} beneficiaries</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Schedule section */}
                {settings.showSchedule && activity.days && activity.days.length > 0 && (
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-2">Schedule:</h4>
                    <div className="flex flex-wrap gap-2">
                      {activity.days.map(day => (
                        <span 
                          key={day}
                          className={`inline-block rounded-full px-3 py-1 text-sm border ${getColorClasses(activity.color)}`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action button */}
                <div className="p-4 bg-white">
                  <Link 
                    href="/get-involved"
                    className={`inline-block font-medium transition-colors ${getAccentColor(activity.color)}`}
                  >
                    <span className="flex items-center">
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DailyActivitiesSection;