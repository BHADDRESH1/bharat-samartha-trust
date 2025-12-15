import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    description: string;
    featured?: boolean;
  };
  delay?: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300"
    >
      <div className="h-48 relative">
        <Image 
          src={event.image} 
          alt={event.title}
          fill
          style={{objectFit: "cover"}}
          className="transition-transform duration-500 hover:scale-105"
        />
        {event.featured && (
          <div className="absolute top-4 left-4 bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{event.location}</span>
        </div>
        <p className="text-gray-600 mb-6 line-clamp-3">{event.description}</p>
        <Link 
          href="/events"
          className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium px-4 py-2 rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
        >
          Learn More
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;