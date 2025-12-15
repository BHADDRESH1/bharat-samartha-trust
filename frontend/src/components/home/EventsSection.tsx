import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import EventCard from '@/components/ui/EventCard';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';
import DataLoader from '@/components/ui/DataLoader';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  featured: boolean;
  visible: boolean;
  registrations: number;
  maxCapacity: number;
  category: string;
}

interface SectionSettings {
  sectionVisible: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  backgroundGradient: string;
  showOnlyFeatured: boolean;
  maxEventsToShow: number;
  showViewAllButton: boolean;
  viewAllButtonText: string;
  viewAllButtonLink: string;
}

interface EventSectionData {
  events: Event[];
  sectionSettings: SectionSettings;
}

interface EventsSectionProps {
  eventsRef: React.RefObject<HTMLDivElement>;
}

const EventsSection: React.FC<EventsSectionProps> = ({ eventsRef }) => {
  // Fetch event data
  const fetchEventData = async () => {
    try {
      const result = await safeFetch('/api', {
        timeout: 15000,
        retries: 3,
        cacheKey: 'events-data', // Add caching
        ttl: 600000 // Cache for 10 minutes
      });
      
      if (result.success && result.data) {
        return result.data;
      }
      
      // Throw error to trigger fallback
      throw new Error('No data received from API');
    } catch (error) {
      console.error('Error fetching events:', error);
      // Throw error to trigger fallback
      throw error;
    }
  };

  // Fallback event data for Bharat Samarth Trust
  const getFallbackEventData = (): EventSectionData => ({
    sectionSettings: {
      sectionVisible: true,
      sectionTitle: 'Upcoming Events',
      sectionSubtitle: 'Join us in making a difference',
      backgroundGradient: 'from-blue-50 to-purple-50',
      showOnlyFeatured: false,
      maxEventsToShow: 3,
      showViewAllButton: true,
      viewAllButtonText: 'View All Events',
      viewAllButtonLink: '/events'
    },
    events: [
      {
        id: 1,
        title: 'Community Health Camp',
        date: '2025-01-15',
        time: '09:00 AM',
        location: 'Chennai, Tamil Nadu',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        description: 'Free health checkup and medical consultation for underprivileged communities',
        featured: true,
        visible: true,
        registrations: 45,
        maxCapacity: 100,
        category: 'Healthcare'
      },
      {
        id: 2,
        title: 'Education Drive 2025',
        date: '2025-01-20',
        time: '10:00 AM',
        location: 'Coimbatore, Tamil Nadu',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        description: 'Distribution of educational materials and scholarship program launch',
        featured: true,
        visible: true,
        registrations: 78,
        maxCapacity: 150,
        category: 'Education'
      },
      {
        id: 3,
        title: 'Tree Plantation Campaign',
        date: '2025-01-25',
        time: '07:00 AM',
        location: 'Madurai, Tamil Nadu',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        description: 'Join our mission to plant 1000 trees for a greener future',
        featured: true,
        visible: true,
        registrations: 120,
        maxCapacity: 200,
        category: 'Environment'
      }
    ]
  });

  return (
    <DataLoader
      fetchData={fetchEventData}
      fallbackData={getFallbackEventData()}
      retryOnError={true}
    >
      {(eventData: EventSectionData) => {
        const { events, sectionSettings } = eventData;

        // Don't render if section is set to not visible
        if (!sectionSettings.sectionVisible) {
          return null;
        }

        // Filter events based on settings
        let filteredEvents = events.filter((event: Event) => event.visible);
        
        if (sectionSettings.showOnlyFeatured) {
          filteredEvents = filteredEvents.filter((event: Event) => event.featured);
        }

        // Limit number of events to show
        if (sectionSettings.maxEventsToShow > 0) {
          filteredEvents = filteredEvents.slice(0, sectionSettings.maxEventsToShow);
        }

        // Dynamic background gradient class
        const backgroundClass = `py-16 md:py-24 bg-gradient-to-b ${sectionSettings.backgroundGradient}`;

        return (
          <section ref={eventsRef} className={backgroundClass}>
            <div className="container mx-auto px-4">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                  {sectionSettings.sectionTitle}
                </h2>
                {sectionSettings.sectionSubtitle && (
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {sectionSettings.sectionSubtitle}
                  </p>
                )}
              </motion.div>
              
              {filteredEvents.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event: Event, index: number) => (
                      <motion.div 
                        key={event.id} 
                        className="event-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <EventCard event={event} />
                        
                        {/* Optional: Show additional event info */}
                        <div className="mt-4 text-center text-sm text-gray-600">
                          <div className="flex justify-between items-center">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {event.category}
                            </span>
                            {event.maxCapacity > 0 && (
                              <span className="text-gray-500">
                                {event.registrations}/{event.maxCapacity} registered
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {sectionSettings.showViewAllButton && (
                    <motion.div 
                      className="text-center mt-12"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <Link
                        href={sectionSettings.viewAllButtonLink}
                        className="px-8 py-3 border-2 border-purple-600 text-purple-600 font-bold rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                      >
                        {sectionSettings.viewAllButtonText}
                      </Link>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-500 text-xl mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Events Available</h3>
                  <p className="text-gray-600">Check back soon for upcoming events!</p>
                </div>
              )}
            </div>
          </section>
        );
      }}
    </DataLoader>
  );
};

export default EventsSection;