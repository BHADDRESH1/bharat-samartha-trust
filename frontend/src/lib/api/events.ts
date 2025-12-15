// lib/api/events.ts
import { Event } from '@/types/event';

// Mock data storage (in a real app, this would be your database)
let mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Charity Run',
    description: 'Join us for our annual charity run to raise funds for local children\'s hospitals. All fitness levels welcome!',
    date: '2025-04-15',
    time: '08:00 AM',
    location: {
      name: 'Central Park',
      address: '123 Park Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10022',
      coordinates: {
        lat: 40.7812,
        lng: -73.9665
      }
    },
    image: '/images/events/charity-run.jpg',
    category: 'Fundraising',
    tags: ['Running', 'Outdoors', 'Family-friendly'],
    capacity: 500,
    registered: 342,
    organizer: {
      name: 'Community Health Foundation',
      email: 'events@chf.org',
      phone: '(212) 555-1234'
    },
    schedule: [
      { time: '07:00 AM', activity: 'Registration Opens' },
      { time: '07:45 AM', activity: 'Warm-up Session' },
      { time: '08:00 AM', activity: 'Race Begins' },
      { time: '10:00 AM', activity: 'Awards Ceremony' }
    ]
  },
  {
    id: '2',
    title: 'Beach Cleanup Day',
    description: 'Help us clean up our local beaches and protect marine wildlife. Equipment and refreshments provided.',
    date: '2025-05-22',
    time: '09:00 AM',
    location: {
      name: 'Sunshine Beach',
      address: '456 Coastal Highway',
      city: 'Miami',
      state: 'FL',
      zip: '33139',
      coordinates: {
        lat: 25.7617,
        lng: -80.1918
      }
    },
    image: '/images/events/beach-cleanup.jpg',
    category: 'Environment',
    tags: ['Beach', 'Cleanup', 'Conservation'],
    capacity: 200,
    registered: 87,
    organizer: {
      name: 'Ocean Conservation Alliance',
      email: 'volunteer@oca.org',
      phone: '(305) 555-6789'
    },
    schedule: [
      { time: '09:00 AM', activity: 'Check-in & Equipment Distribution' },
      { time: '09:30 AM', activity: 'Cleanup Begins' },
      { time: '12:00 PM', activity: 'Lunch Break' },
      { time: '01:00 PM', activity: 'Educational Workshop' }
    ]
  },
  {
    id: '3',
    title: 'Food Drive for Homeless Shelters',
    description: 'Collecting non-perishable food items for local homeless shelters. Every donation makes a difference!',
    date: '2025-06-08',
    time: '10:00 AM',
    location: {
      name: 'Community Center',
      address: '789 Main Street',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      coordinates: {
        lat: 41.8781,
        lng: -87.6298
      }
    },
    image: '/images/events/food-drive.jpg',
    category: 'Community',
    tags: ['Food Drive', 'Donation', 'Hunger Relief'],
    capacity: 150,
    registered: 42,
    organizer: {
      name: 'Urban Relief Network',
      email: 'info@urbanrelief.org',
      phone: '(312) 555-4321'
    },
    schedule: [
      { time: '10:00 AM', activity: 'Donation Drop-off Opens' },
      { time: '02:00 PM', activity: 'Sorting & Packaging' },
      { time: '05:00 PM', activity: 'Distribution to Shelters' }
    ]
  },
  {
    id: '4',
    title: 'Mental Health Awareness Workshop',
    description: 'Join mental health professionals for a day of education, discussion, and support around mental health issues.',
    date: '2025-07-12',
    time: '11:00 AM',
    location: {
      name: 'Metro Convention Center',
      address: '321 Conference Blvd',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      coordinates: {
        lat: 47.6062,
        lng: -122.3321
      }
    },
    image: '/images/events/mental-health.jpg',
    category: 'Health',
    tags: ['Mental Health', 'Education', 'Support'],
    capacity: 300,
    registered: 189,
    organizer: {
      name: 'Mindful Living Foundation',
      email: 'workshops@mindful.org',
      phone: '(206) 555-8765'
    },
    schedule: [
      { time: '11:00 AM', activity: 'Registration & Welcome' },
      { time: '11:30 AM', activity: 'Keynote Speech' },
      { time: '01:00 PM', activity: 'Lunch Break' },
      { time: '02:00 PM', activity: 'Workshop Sessions' },
      { time: '04:30 PM', activity: 'Panel Discussion' }
    ]
  },
  {
    id: '5',
    title: 'Youth Coding Camp',
    description: 'A week-long camp teaching basic coding skills to underprivileged youth. No prior experience necessary.',
    date: '2025-08-03',
    time: '09:00 AM',
    location: {
      name: 'Tech Innovation Center',
      address: '567 Silicon Avenue',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      }
    },
    image: '/images/events/coding-camp.jpg',
    category: 'Education',
    tags: ['Coding', 'Youth', 'Technology'],
    capacity: 50,
    registered: 43,
    organizer: {
      name: 'Future Coders Initiative',
      email: 'camp@futurecoders.org',
      phone: '(415) 555-2345'
    },
    schedule: [
      { time: '09:00 AM', activity: 'Check-in & Introduction' },
      { time: '09:30 AM', activity: 'Morning Coding Session' },
      { time: '12:00 PM', activity: 'Lunch Break' },
      { time: '01:00 PM', activity: 'Afternoon Project Work' },
      { time: '04:00 PM', activity: 'Daily Wrap-up' }
    ]
  },
  {
    id: '6',
    title: 'Community Garden Planting',
    description: 'Help us plant and maintain our community garden that provides fresh produce to local food banks.',
    date: '2024-09-18',
    time: '10:00 AM',
    location: {
      name: 'Urban Roots Garden',
      address: '890 Green Street',
      city: 'Portland',
      state: 'OR',
      zip: '97205',
      coordinates: {
        lat: 45.5051,
        lng: -122.6750
      }
    },
    image: '/images/events/community-garden.jpg',
    category: 'Environment',
    tags: ['Gardening', 'Sustainability', 'Food Security'],
    capacity: 75,
    registered: 62,
    organizer: {
      name: 'Green City Initiative',
      email: 'garden@greencity.org',
      phone: '(503) 555-7890'
    },
    schedule: [
      { time: '10:00 AM', activity: 'Orientation & Tool Distribution' },
      { time: '10:30 AM', activity: 'Planting Begins' },
      { time: '12:30 PM', activity: 'Lunch Break' },
      { time: '01:30 PM', activity: 'Garden Maintenance Workshop' }
    ],
    isPastEvent: true
  },
  {
    id: '7',
    title: 'Senior Center Renovation',
    description: 'Volunteer to help renovate and beautify our local senior center. Tasks include painting, light repairs, and gardening.',
    date: '2024-10-25',
    time: '08:30 AM',
    location: {
      name: 'Golden Years Senior Center',
      address: '123 Elder Street',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
      coordinates: {
        lat: 42.3601,
        lng: -71.0589
      }
    },
    image: '/images/events/senior-center.jpg',
    category: 'Community',
    tags: ['Renovation', 'Seniors', 'Construction'],
    capacity: 100,
    registered: 85,
    organizer: {
      name: 'Building Better Communities',
      email: 'projects@bbc.org',
      phone: '(617) 555-3456'
    },
    schedule: [
      { time: '08:30 AM', activity: 'Check-in & Safety Briefing' },
      { time: '09:00 AM', activity: 'Project Assignments' },
      { time: '12:00 PM', activity: 'Lunch Break' },
      { time: '01:00 PM', activity: 'Afternoon Work Session' },
      { time: '04:00 PM', activity: 'Project Completion Celebration' }
    ],
    isPastEvent: true
  }
];

// Utility function to generate unique IDs
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// CRUD Operations

// Fetch all events
export async function fetchEvents(): Promise<Event[]> {
  await delay();
  return [...mockEvents];
}

// Fetch single event by ID
export async function fetchEventById(id: string): Promise<Event | null> {
  await delay();
  const event = mockEvents.find(event => event.id === id);
  return event ? { ...event } : null;
}

// Create new event
export async function createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
  await delay();
  
  const newEvent: Event = {
    ...eventData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockEvents.push(newEvent);
  return { ...newEvent };
}

// Update existing event
export async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
  await delay();
  
  const index = mockEvents.findIndex(event => event.id === id);
  if (index === -1) {
    throw new Error('Event not found');
  }
  
  const updatedEvent: Event = {
    ...mockEvents[index],
    ...eventData,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  };
  
  mockEvents[index] = updatedEvent;
  return { ...updatedEvent };
}

// Delete event
export async function deleteEvent(id: string): Promise<boolean> {
  await delay();
  
  const index = mockEvents.findIndex(event => event.id === id);
  if (index === -1) {
    throw new Error('Event not found');
  }
  
  mockEvents.splice(index, 1);
  return true;
}

// Additional utility functions

// Search events
export async function searchEvents(query: string): Promise<Event[]> {
  await delay();
  
  const lowercaseQuery = query.toLowerCase();
  return mockEvents.filter(event =>
    event.title.toLowerCase().includes(lowercaseQuery) ||
    event.description.toLowerCase().includes(lowercaseQuery) ||
    event.category.toLowerCase().includes(lowercaseQuery) ||
    event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Filter events by category
export async function fetchEventsByCategory(category: string): Promise<Event[]> {
  await delay();
  
  if (category === 'All') {
    return [...mockEvents];
  }
  
  return mockEvents.filter(event => event.category === category);
}

// Get events by date range
export async function fetchEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
  await delay();
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return mockEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= start && eventDate <= end;
  });
}

// Get upcoming events
export async function fetchUpcomingEvents(limit?: number): Promise<Event[]> {
  await delay();
  
  const now = new Date();
  const upcomingEvents = mockEvents
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
}

// Get past events
export async function fetchPastEvents(limit?: number): Promise<Event[]> {
  await delay();
  
  const now = new Date();
  const pastEvents = mockEvents
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return limit ? pastEvents.slice(0, limit) : pastEvents;
}

// Get all categories
export async function fetchCategories(): Promise<string[]> {
  await delay();
  
  const categories = Array.from(new Set(mockEvents.map(event => event.category)));
  return categories.sort();
}