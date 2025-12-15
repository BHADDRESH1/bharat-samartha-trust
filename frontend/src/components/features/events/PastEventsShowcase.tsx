'use client'

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Event } from '@/types/event';

interface PastEventsShowcaseProps {
  events: Event[];
}

export default function PastEventsShowcase({ events }: PastEventsShowcaseProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (showcaseRef.current) {
      const eventElements = showcaseRef.current.querySelectorAll('.past-event-card');
      
      gsap.fromTo(
        eventElements,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-medium text-gray-600">No past events to display</h3>
        <p className="text-gray-500 mt-2">Check back later for our event history</p>
      </div>
    );
  }

  return (
    <div ref={showcaseRef} className="relative">
      {/* Featured Past Event */}
      <motion.div 
        className="mb-16 rounded-2xl overflow-hidden shadow-xl relative h-[500px] group"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src={events[0].image || "/images/placeholder-event.jpg"} 
            alt={events[0].title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            width={1200}
            height={600}
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
          <span className="bg-purple-600 text-xs font-semibold rounded-full px-3 py-1 uppercase tracking-wider mb-4 inline-block">
            Featured Event
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold mb-2">{events[0].title}</h3>
          <p className="text-gray-200 mb-4">{events[0].description.substring(0, 150)}...</p>
          
          <div className="flex items-center mb-6">
            <div className="mr-6">
              <span className="block text-sm text-gray-300">Date</span>
              <span className="font-medium">{new Date(events[0].date).toLocaleDateString()}</span>
            </div>
            <div className="mr-6">
              <span className="block text-sm text-gray-300">Location</span>
              <span className="font-medium">{events[0].location}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-300">Participants</span>
              <span className="font-medium">{events[0].totalAttendees || "250+"}</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-800 px-6 py-3 rounded-full font-bold"
            onClick={() => setSelectedEvent(events[0])}
          >
            View Highlights
          </motion.button>
        </div>
      </motion.div>

      {/* Past Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.slice(1).map((event, index) => (
          <motion.div
            key={event.id}
            className="rounded-xl overflow-hidden shadow-lg bg-white past-event-card relative h-[350px] group"
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
            <div className="absolute inset-0 overflow-hidden">
              <Image 
                src={event.image || "/images/placeholder-event.jpg"}
                alt={event.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                width={600}
                height={400} 
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
              <span className={`text-xs font-semibold rounded-full px-3 py-1 uppercase tracking-wider mb-3 inline-block ${
                event.category === 'Education' ? 'bg-blue-500' : 
                event.category === 'Fundraising' ? 'bg-green-500' : 
                event.category === 'Community' ? 'bg-yellow-500' : 
                event.category === 'Health' ? 'bg-red-500' : 
                'bg-purple-500'
              }`}>
                {event.category}
              </span>
              <h3 className="text-xl font-bold mb-1">{event.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{new Date(event.date).toLocaleDateString()}</p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
                onClick={() => setSelectedEvent(event)}
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80">
              <Image
                src={selectedEvent.image || "/images/placeholder-event.jpg"}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
                width={800}
                height={400}
              />
              <button 
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
                onClick={() => setSelectedEvent(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-6 sm:p-8">
              <span className={`text-xs font-semibold rounded-full px-3 py-1 uppercase tracking-wider mb-3 inline-block ${
                selectedEvent.category === 'Education' ? 'bg-blue-500 text-white' : 
                selectedEvent.category === 'Fundraising' ? 'bg-green-500 text-white' : 
                selectedEvent.category === 'Community' ? 'bg-yellow-500 text-white' : 
                selectedEvent.category === 'Health' ? 'bg-red-500 text-white' : 
                'bg-purple-500 text-white'
              }`}>
                {selectedEvent.category}
              </span>
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{selectedEvent.title}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500">Date</span>
                  <p className="font-medium">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500">Location</span>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500">Participants</span>
                  <p className="font-medium">{selectedEvent.totalAttendees || "250+"}</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Event Summary</h3>
              <p className="text-gray-700 mb-6">{selectedEvent.description}</p>
              
              <h3 className="text-xl font-semibold mb-3">Highlights</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6">
                <li>Successfully raised ${selectedEvent.totalFunds || "5,000+"} for the cause</li>
                <li>Engaged {selectedEvent.totalAttendees || "250+"} community members</li>
                <li>Featured {selectedEvent.totalSpeakers || "5"} inspiring speakers</li>
                <li>Received coverage in local media outlets</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">Impact</h3>
              <div className="bg-purple-50 p-6 rounded-xl mb-6">
                <p className="text-gray-700">{selectedEvent.impactDescription || "This event created significant positive impact in our community, bringing together people from all walks of life to support a common cause. We're grateful to all participants and sponsors who made this possible."}</p>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Event Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="rounded-lg overflow-hidden h-24 sm:h-32 bg-gray-100">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-6 flex justify-end">
                <button
                  className="px-6 py-3 bg-gray-200 rounded-full font-medium text-gray-700"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}