'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Event } from '@/types/event';

interface EventCalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function EventCalendarView({ events, onEventClick }: EventCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = monthStart;
  const endDate = monthEnd;
  
  const dateFormat = "MMMM yyyy";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Get day of the week of the first day of the month (0-6)
  const startDayOfWeek = getDay(monthStart);

  // Function to get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b">
        <motion.button
          onClick={prevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </motion.button>
        
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentMonth, dateFormat)}
        </h2>
        
        <motion.button
          onClick={nextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </motion.button>
      </div>
      
      <div className="grid grid-cols-7 gap-0">
        {/* Calendar Header (Day names) */}
        {days.map((day, index) => (
          <div key={index} className="p-4 text-center font-semibold text-gray-600 bg-gray-50">
            {day}
          </div>
        ))}
        
        {/* Calendar Grid */}
        {/* Empty cells for start of month */}
        {Array.from({ length: startDayOfWeek }).map((_, index) => (
          <div key={`empty-start-${index}`} className="p-4 min-h-[120px] border border-gray-100"></div>
        ))}
        
        {/* Days in month */}
        {daysInMonth.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div 
              key={i} 
              className={`p-2 min-h-[120px] border border-gray-100 relative ${
                isSameMonth(day, currentMonth) ? "" : "text-gray-300"
              }`}
            >
              <div className="font-medium mb-2">{format(day, "d")}</div>
              
              {dayEvents.length > 0 && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onEventClick(event)}
                      className={`py-1 px-2 rounded text-xs truncate text-white cursor-pointer ${
                        event.category === 'Education' ? 'bg-blue-500' : 
                        event.category === 'Fundraising' ? 'bg-green-500' : 
                        event.category === 'Community' ? 'bg-yellow-500' : 
                        event.category === 'Health' ? 'bg-red-500' : 
                        'bg-purple-500'
                      }`}
                    >
                      {event.title}
                    </motion.div>
                  ))}
                  
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Empty cells for end of month */}
        {Array.from({ length: (7 - ((startDayOfWeek + daysInMonth.length) % 7)) % 7 }).map((_, index) => (
          <div key={`empty-end-${index}`} className="p-4 min-h-[120px] border border-gray-100"></div>
        ))}
      </div>
      
      <div className="p-4 border-t text-center text-sm text-gray-500">
        Click on an event to see more details
      </div>
    </div>
  );
}