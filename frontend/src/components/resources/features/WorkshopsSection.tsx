'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star,
  Filter,
  Search,
  Video,
  User,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Award,
  Zap,
  Globe
} from 'lucide-react';
import Image from 'next/image';

interface Workshop {
  id: number;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    expertise: string;
    rating: number;
  };
  type: 'live' | 'recorded' | 'upcoming';
  category: string;
  date: string;
  time: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  price: number;
  originalPrice?: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  thumbnail: string;
  features: string[];
  language: string;
  isPopular?: boolean;
  isFree?: boolean;
}

export default function WorkshopsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [timeLeft, setTimeLeft] = useState<{[key: number]: string}>({});

  const categories = [
    { id: 'all', name: 'All Categories', icon: Globe },
    { id: 'exam-strategy', name: 'Exam Strategy', icon: BookOpen },
    { id: 'soft-skills', name: 'Soft Skills', icon: User },
    { id: 'tech-talks', name: 'Tech Talks', icon: Zap },
    { id: 'life-coaching', name: 'Life Coaching', icon: Award }
  ];

  const mockWorkshops: Workshop[] = [
    {
      id: 1,
      title: 'UPSC Strategy Bootcamp 2024 - From Zero to Hero',
      description: 'Comprehensive strategy session by UPSC topper covering prelims, mains, and interview preparation with personalized guidance.',
      instructor: {
        name: 'Dr. Rajesh Sharma',
        avatar: '/api/placeholder/60/60',
        expertise: 'UPSC Topper 2019, AIR 25',
        rating: 4.9
      },
      type: 'upcoming',
      category: 'exam-strategy',
      date: '2024-02-15',
      time: '10:00 AM',
      duration: '3 hours',
      participants: 245,
      maxParticipants: 500,
      price: 0,
      level: 'Intermediate',
      tags: ['UPSC', 'Strategy', 'Prelims', 'Mains'],
      thumbnail: '/api/placeholder/400/300',
      features: ['Live Q&A', 'Study Material', 'Recording Access', 'Certificate'],
      language: 'English',
      isPopular: true,
      isFree: true
    },
    {
      id: 2,
      title: 'Master Communication Skills for Interview Success',
      description: 'Learn effective communication techniques, body language, and confidence building for job interviews and professional interactions.',
      instructor: {
        name: 'Priya Patel',
        avatar: '/api/placeholder/60/60',
        expertise: 'HR Expert & Life Coach',
        rating: 4.8
      },
      type: 'live',
      category: 'soft-skills',
      date: '2024-02-10',
      time: '2:00 PM',
      duration: '2.5 hours',
      participants: 156,
      maxParticipants: 300,
      price: 299,
      originalPrice: 499,
      level: 'Beginner',
      tags: ['Communication', 'Interview', 'Confidence', 'Body Language'],
      thumbnail: '/api/placeholder/400/300',
      features: ['Interactive Sessions', 'Mock Interviews', 'Feedback', 'Resources'],
      language: 'English'
    },
    {
      id: 3,
      title: 'AI & Machine Learning: Future of Technology',
      description: 'Explore the latest trends in AI and ML, career opportunities, and hands-on introduction to popular frameworks and tools.',
      instructor: {
        name: 'Vikash Kumar',
        avatar: '/api/placeholder/60/60',
        expertise: 'ML Engineer at Google',
        rating: 4.9
      },
      type: 'recorded',
      category: 'tech-talks',
      date: '2024-02-08',
      time: 'Available Now',
      duration: '4 hours',
      participants: 890,
      maxParticipants: 1000,
      price: 599,
      originalPrice: 999,
      level: 'Advanced',
      tags: ['AI', 'ML', 'Technology', 'Career'],
      thumbnail: '/api/placeholder/400/300',
      features: ['Lifetime Access', 'Code Examples', 'Projects', 'Community'],
      language: 'English',
      isPopular: true
    },
    {
      id: 4,
      title: 'Building Mental Resilience for Competitive Exams',
      description: 'Psychological strategies to handle exam stress, maintain motivation, and develop a winning mindset for long-term preparation.',
      instructor: {
        name: 'Dr. Anita Singh',
        avatar: '/api/placeholder/60/60',
        expertise: 'Clinical Psychologist',
        rating: 4.7
      },
      type: 'upcoming',
      category: 'life-coaching',
      date: '2024-02-12',
      time: '6:00 PM',
      duration: '2 hours',
      participants: 78,
      maxParticipants: 200,
      price: 0,
      level: 'Beginner',
      tags: ['Mental Health', 'Stress Management', 'Motivation', 'Psychology'],
      thumbnail: '/api/placeholder/400/300',
      features: ['Guided Meditation', 'Workbook', 'Follow-up Session', 'Support Group'],
      language: 'Hindi & English',
      isFree: true
    },
    {
      id: 5,
      title: 'Resume Building & LinkedIn Optimization Masterclass',
      description: 'Create a standout resume and optimize your LinkedIn profile to attract recruiters and land your dream job.',
      instructor: {
        name: 'Rohit Gupta',
        avatar: '/api/placeholder/60/60',
        expertise: 'Career Consultant & Recruiter',
        rating: 4.6
      },
      type: 'live',
      category: 'soft-skills',
      date: '2024-02-14',
      time: '7:00 PM',
      duration: '2 hours',
      participants: 123,
      maxParticipants: 250,
      price: 199,
      originalPrice: 399,
      level: 'Beginner',
      tags: ['Resume', 'LinkedIn', 'Job Search', 'Career'],
      thumbnail: '/api/placeholder/400/300',
      features: ['Template Access', 'Profile Review', 'Job Portal Tips', 'Networking'],
      language: 'English'
    }
  ];

  useEffect(() => {
    let filtered = mockWorkshops;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(workshop => workshop.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(workshop => workshop.type === selectedType);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(workshop => workshop.level === selectedLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(workshop =>
        workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredWorkshops(filtered);
  }, [searchTerm, selectedCategory, selectedType, selectedLevel]);

  // Countdown timer for upcoming workshops
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft: {[key: number]: string} = {};
      
      filteredWorkshops.forEach(workshop => {
        if (workshop.type === 'upcoming') {
          const eventDate = new Date(`${workshop.date} ${workshop.time}`);
          const now = new Date();
          const difference = eventDate.getTime() - now.getTime();

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            
            newTimeLeft[workshop.id] = `${days}d ${hours}h ${minutes}m`;
          } else {
            newTimeLeft[workshop.id] = 'Started';
          }
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [filteredWorkshops]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'live':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recorded':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const joinWorkshop = (workshop: Workshop) => {
    console.log(`Joining workshop: ${workshop.title}`);
    // In real implementation, this would handle workshop registration
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          📅 Online Workshops & Webinars
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Join live sessions by experts, career counselors, exam toppers, and industry professionals
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Live Sessions', value: '25+', icon: Video, color: 'text-red-500' },
          { label: 'Expert Mentors', value: '50+', icon: User, color: 'text-blue-500' },
          { label: 'Participants', value: '15K+', icon: Users, color: 'text-green-500' },
          { label: 'Success Rate', value: '95%', icon: Award, color: 'text-purple-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
          >
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search workshops, instructors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="live">Live</option>
              <option value="upcoming">Upcoming</option>
              <option value="recorded">Recorded</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['Free Workshops', 'Live Now', 'Popular', 'This Week'].map((filter, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredWorkshops.map((workshop, index) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Workshop Header */}
            <div className="relative">
              <Image
                src={workshop.thumbnail}
                alt={workshop.title}
                width={400}
                height={240}
                className="w-full h-48 object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(workshop.type)}`}>
                  {workshop.type.toUpperCase()}
                </span>
                {workshop.isPopular && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-200">
                    POPULAR
                  </span>
                )}
                {workshop.isFree && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
                    FREE
                  </span>
                )}
              </div>

              {/* Countdown Timer for Upcoming */}
              {workshop.type === 'upcoming' && timeLeft[workshop.id] && (
                <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ⏰ {timeLeft[workshop.id]}
                </div>
              )}

              {/* Live Indicator */}
              {workshop.type === 'live' && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  LIVE
                </div>
              )}
            </div>

            {/* Workshop Content */}
            <div className="p-6">
              {/* Title and Description */}
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {workshop.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {workshop.description}
              </p>

              {/* Instructor Info */}
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={workshop.instructor.avatar}
                  alt={workshop.instructor.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-800">{workshop.instructor.name}</h4>
                  <p className="text-sm text-gray-600">{workshop.instructor.expertise}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{workshop.instructor.rating}</span>
                  </div>
                </div>
              </div>

              {/* Workshop Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{workshop.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{workshop.participants}/{workshop.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{workshop.language}</span>
                </div>
              </div>

              {/* Level and Duration */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(workshop.level)}`}>
                  {workshop.level}
                </span>
                <span className="text-sm text-gray-600">{workshop.duration}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {workshop.tags.slice(0, 4).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Features */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-800 mb-2">What's Included:</h5>
                <div className="grid grid-cols-2 gap-1">
                  {workshop.features.slice(0, 4).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-1 text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  {workshop.price === 0 ? (
                    <span className="text-2xl font-bold text-green-600">FREE</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-800">₹{workshop.price}</span>
                      {workshop.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">₹{workshop.originalPrice}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => joinWorkshop(workshop)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg flex items-center gap-2 ${
                    workshop.type === 'live'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : workshop.type === 'upcoming'
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {workshop.type === 'live' && (
                    <>
                      <Video className="w-4 h-4" />
                      Join Live
                    </>
                  )}
                  {workshop.type === 'upcoming' && (
                    <>
                      <Calendar className="w-4 h-4" />
                      Register
                    </>
                  )}
                  {workshop.type === 'recorded' && (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Access Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredWorkshops.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No workshops found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Upcoming Events Calendar */}
      <section className="mt-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">📅 This Week's Schedule</h3>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <h4 className="font-medium text-gray-700 mb-2">{day}</h4>
                <div className="space-y-2">
                  {index % 3 === 0 && (
                    <div className="bg-blue-50 p-2 rounded-lg text-xs">
                      <div className="font-medium text-blue-800">10:00 AM</div>
                      <div className="text-blue-600">Strategy Session</div>
                    </div>
                  )}
                  {index % 2 === 0 && index !== 0 && (
                    <div className="bg-green-50 p-2 rounded-lg text-xs">
                      <div className="font-medium text-green-800">2:00 PM</div>
                      <div className="text-green-600">Coding Workshop</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="mt-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">🌟 Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Priya Sharma",
              achievement: "Cleared UPSC after attending strategy workshops",
              image: "/api/placeholder/60/60",
              quote: "The workshops completely changed my approach to UPSC preparation!"
            },
            {
              name: "Rahul Kumar",
              achievement: "Got job at Google after tech workshops",
              image: "/api/placeholder/60/60",
              quote: "The AI/ML workshop opened doors I never thought possible."
            },
            {
              name: "Anjali Patel",
              achievement: "Built confidence through communication workshops",
              image: "/api/placeholder/60/60",
              quote: "Now I can speak confidently in any interview or meeting."
            }
          ].map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-2xl border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={story.image}
                  alt={story.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-800">{story.name}</h4>
                  <p className="text-sm text-green-600 font-medium">{story.achievement}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">"{story.quote}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl text-center"
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Career?</h3>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Join thousands of learners who have accelerated their success through our expert-led workshops and webinars.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition-colors">
            Browse All Workshops
          </button>
          <button className="px-8 py-3 bg-purple-700 text-white font-bold rounded-full hover:bg-purple-800 transition-colors">
            Become an Instructor
          </button>
        </div>
      </motion.section>
    </div>
  );
}