'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Users, 
  Star, 
  MessageCircle, 
  Calendar,
  Award,
  TrendingUp,
  Search,
  Filter,
  Heart,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  Zap
} from 'lucide-react';
import Image from 'next/image';

interface Mentor {
  id: number;
  name: string;
  avatar: string;
  title: string;
  company: string;
  expertise: string[];
  experience: string;
  rating: number;
  totalMentees: number;
  activeMentees: number;
  responseTime: string;
  languages: string[];
  location: string;
  bio: string;
  achievements: string[];
  availability: 'Available' | 'Busy' | 'Limited';
  price: number;
  sessionTypes: string[];
  isVerified: boolean;
  isTopRated?: boolean;
}

interface MentorshipRequest {
  mentorType: string;
  goals: string[];
  experience: string;
  timeCommitment: string;
  preferredLanguage: string;
  specificNeeds: string;
}

export default function MentorshipProgram() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [mentorshipRequest, setMentorshipRequest] = useState<MentorshipRequest>({
    mentorType: '',
    goals: [],
    experience: '',
    timeCommitment: '',
    preferredLanguage: '',
    specificNeeds: ''
  });

  const expertiseAreas = [
    'all',
    'UPSC/Civil Services',
    'Engineering',
    'MBA/Business',
    'Technology',
    'Banking/Finance',
    'Healthcare',
    'Arts/Literature',
    'Entrepreneurship',
    'Life Coaching'
  ];

  const mockMentors: Mentor[] = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      avatar: '/api/placeholder/80/80',
      title: 'IAS Officer',
      company: 'Government of India',
      expertise: ['UPSC/Civil Services', 'Public Administration', 'Current Affairs'],
      experience: '12+ years',
      rating: 4.9,
      totalMentees: 156,
      activeMentees: 12,
      responseTime: '< 2 hours',
      languages: ['English', 'Hindi'],
      location: 'New Delhi',
      bio: 'AIR 25 in UPSC 2011. Currently serving as District Collector. Passionate about guiding UPSC aspirants with practical insights and proven strategies.',
      achievements: ['AIR 25 UPSC 2011', 'Young Administrator Award', '100+ Success Stories'],
      availability: 'Available',
      price: 0,
      sessionTypes: ['One-on-One', 'Group Sessions', 'Mock Interviews'],
      isVerified: true,
      isTopRated: true
    },
    {
      id: 2,
      name: 'Priya Sharma',
      avatar: '/api/placeholder/80/80',
      title: 'Senior Software Engineer',
      company: 'Google',
      expertise: ['Technology', 'Software Engineering', 'Career Transition'],
      experience: '8+ years',
      rating: 4.8,
      totalMentees: 89,
      activeMentees: 8,
      responseTime: '< 4 hours',
      languages: ['English'],
      location: 'Bangalore',
      bio: 'Ex-Microsoft, currently at Google. Specializes in helping engineers level up their careers and crack top tech companies.',
      achievements: ['Google L6 Engineer', 'Ex-Microsoft', 'Tech Interview Expert'],
      availability: 'Limited',
      price: 2500,
      sessionTypes: ['Career Guidance', 'Technical Interviews', 'Code Reviews'],
      isVerified: true
    },
    {
      id: 3,
      name: 'CA Vikash Singh',
      avatar: '/api/placeholder/80/80',
      title: 'Chartered Accountant',
      company: 'KPMG',
      expertise: ['Banking/Finance', 'CA Preparation', 'Financial Planning'],
      experience: '10+ years',
      rating: 4.7,
      totalMentees: 134,
      activeMentees: 15,
      responseTime: '< 6 hours',
      languages: ['English', 'Hindi'],
      location: 'Mumbai',
      bio: 'CA with Big 4 experience. Cleared CA in first attempt. Helps students with CA preparation and finance career guidance.',
      achievements: ['CA First Attempt', 'Big 4 Experience', 'Finance Expert'],
      availability: 'Available',
      price: 1500,
      sessionTypes: ['Exam Strategy', 'Career Planning', 'Interview Prep'],
      isVerified: true,
      isTopRated: true
    },
    {
      id: 4,
      name: 'Dr. Anita Patel',
      avatar: '/api/placeholder/80/80',
      title: 'Life Coach & Psychologist',
      company: 'Independent Practice',
      expertise: ['Life Coaching', 'Mental Health', 'Personal Development'],
      experience: '15+ years',
      rating: 4.9,
      totalMentees: 203,
      activeMentees: 20,
      responseTime: '< 3 hours',
      languages: ['English', 'Hindi', 'Gujarati'],
      location: 'Ahmedabad',
      bio: 'Clinical psychologist turned life coach. Specializes in helping students overcome mental barriers and achieve their potential.',
      achievements: ['PhD Psychology', '15+ Years Experience', 'Mindfulness Expert'],
      availability: 'Available',
      price: 0,
      sessionTypes: ['Life Coaching', 'Stress Management', 'Goal Setting'],
      isVerified: true
    },
    {
      id: 5,
      name: 'Rohit Gupta',
      avatar: '/api/placeholder/80/80',
      title: 'Startup Founder',
      company: 'TechVenture Inc.',
      expertise: ['Entrepreneurship', 'Business Strategy', 'Startup Guidance'],
      experience: '6+ years',
      rating: 4.6,
      totalMentees: 67,
      activeMentees: 9,
      responseTime: '< 8 hours',
      languages: ['English'],
      location: 'Pune',
      bio: 'Founded 2 successful startups. Mentor at various incubators. Passionate about helping aspiring entrepreneurs build successful businesses.',
      achievements: ['2x Founder', 'Series A Funding', 'Incubator Mentor'],
      availability: 'Busy',
      price: 3000,
      sessionTypes: ['Business Planning', 'Pitch Review', 'Fundraising'],
      isVerified: true
    }
  ];

  useEffect(() => {
    let filtered = mockMentors;

    if (selectedExpertise !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.expertise.some(exp => exp.includes(selectedExpertise))
      );
    }

    if (selectedAvailability !== 'all') {
      filtered = filtered.filter(mentor => mentor.availability === selectedAvailability);
    }

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredMentors(filtered);
  }, [searchTerm, selectedExpertise, selectedAvailability]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Limited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Busy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const connectWithMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowRequestForm(true);
  };

  const submitMentorshipRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mentorship request submitted:', mentorshipRequest, selectedMentor);
    setShowRequestForm(false);
    setSelectedMentor(null);
    // In real implementation, this would send the request to the backend
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
          🎯 Mentorship Programs
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Get matched with expert mentors from diverse fields for personalized guidance and career acceleration
        </p>
      </motion.div>

      {/* How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            step: '1',
            title: 'Fill Request Form',
            description: 'Tell us about your goals, interests, and what kind of mentorship you need',
            icon: '📝',
            color: 'from-blue-500 to-purple-500'
          },
          {
            step: '2',
            title: 'Get Matched',
            description: 'Our AI algorithm matches you with the most suitable mentors based on your requirements',
            icon: '🤝',
            color: 'from-green-500 to-blue-500'
          },
          {
            step: '3',
            title: 'Start Learning',
            description: 'Begin your mentorship journey with regular sessions and continuous support',
            icon: '🚀',
            color: 'from-purple-500 to-pink-500'
          }
        ].map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`bg-gradient-to-r ${step.color} p-6 rounded-2xl text-white text-center hover:shadow-xl transition-shadow`}
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-bold mb-2">Step {step.step}: {step.title}</h3>
            <p className="text-white/90">{step.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Expert Mentors', value: '500+', icon: Users, color: 'text-blue-500' },
          { label: 'Success Stories', value: '2,500+', icon: Award, color: 'text-green-500' },
          { label: 'Active Sessions', value: '1,200+', icon: MessageCircle, color: 'text-purple-500' },
          { label: 'Satisfaction Rate', value: '98%', icon: Star, color: 'text-yellow-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search mentors by name, expertise, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {expertiseAreas.map((area) => (
                <option key={area} value={area}>
                  {area === 'all' ? 'All Expertise' : area}
                </option>
              ))}
            </select>

            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Availability</option>
              <option value="Available">Available</option>
              <option value="Limited">Limited</option>
              <option value="Busy">Busy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMentors.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Mentor Header */}
            <div className="relative p-6 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={mentor.avatar}
                    alt={mentor.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                  {mentor.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{mentor.name}</h3>
                    {mentor.isTopRated && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        ⭐ Top Rated
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium">{mentor.title}</p>
                  <p className="text-gray-500 text-sm">{mentor.company}</p>
                </div>
              </div>
              
              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(mentor.availability)}`}>
                  {mentor.availability}
                </span>
              </div>
            </div>

            {/* Mentor Details */}
            <div className="p-6">
              {/* Rating and Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-medium">{mentor.rating}</span>
                  <span className="text-gray-500 text-sm">({mentor.totalMentees} mentees)</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Response time</div>
                  <div className="font-medium text-green-600">{mentor.responseTime}</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mentor.bio}</p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {mentor.expertise.slice(0, 3).map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{mentor.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{mentor.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{mentor.activeMentees} active</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{mentor.languages.join(', ')}</span>
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-800 mb-2">Key Achievements:</h5>
                <div className="space-y-1">
                  {mentor.achievements.slice(0, 2).map((achievement, achIndex) => (
                    <div key={achIndex} className="flex items-center gap-1 text-sm text-gray-600">
                      <Award className="w-3 h-3 text-yellow-500" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Types */}
              <div className="mb-6">
                <h5 className="font-medium text-gray-800 mb-2">Session Types:</h5>
                <div className="flex flex-wrap gap-1">
                  {mentor.sessionTypes.map((type, typeIndex) => (
                    <span
                      key={typeIndex}
                      className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  {mentor.price === 0 ? (
                    <span className="text-xl font-bold text-green-600">FREE</span>
                  ) : (
                    <div>
                      <span className="text-xl font-bold text-gray-800">₹{mentor.price}</span>
                      <span className="text-gray-500 text-sm">/session</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => connectWithMentor(mentor)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:shadow-lg"
                  disabled={mentor.availability === 'Busy'}
                >
                  {mentor.availability === 'Busy' ? 'Unavailable' : 'Connect'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredMentors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No mentors found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Success Stories */}
      <section className="mt-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">🌟 Mentorship Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              mentee: "Arjun Patel",
              mentor: "Dr. Rajesh Kumar",
              achievement: "Cleared UPSC in 2nd attempt",
              image: "/api/placeholder/60/60",
              story: "The guidance I received was invaluable. My mentor helped me identify my weak areas and provided a structured approach."
            },
            {
              mentee: "Sneha Reddy",
              mentor: "Priya Sharma",
              achievement: "Landed job at Amazon",
              image: "/api/placeholder/60/60",
              story: "Thanks to my mentor's technical interview preparation, I was able to crack multiple FAANG interviews."
            },
            {
              mentee: "Vikram Singh",
              mentor: "CA Vikash Singh",
              achievement: "Started own CA practice",
              image: "/api/placeholder/60/60",
              story: "My mentor not only helped me clear CA but also guided me in setting up my own successful practice."
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
                  alt={story.mentee}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-800">{story.mentee}</h4>
                  <p className="text-sm text-blue-600">Mentored by {story.mentor}</p>
                  <p className="text-sm text-green-600 font-medium">{story.achievement}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">"{story.story}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mentorship Request Form Modal */}
      <AnimatePresence>
        {showRequestForm && selectedMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRequestForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Request Mentorship</h3>
                  <p className="text-gray-600">Connect with {selectedMentor.name}</p>
                </div>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={submitMentorshipRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What type of mentorship are you looking for?
                  </label>
                  <select
                    value={mentorshipRequest.mentorType}
                    onChange={(e) => setMentorshipRequest({...mentorshipRequest, mentorType: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select mentorship type</option>
                    <option value="career">Career Guidance</option>
                    <option value="exam">Exam Preparation</option>
                    <option value="skill">Skill Development</option>
                    <option value="personal">Personal Development</option>
                    <option value="business">Business/Entrepreneurship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your main goals? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Clear competitive exams',
                      'Career transition',
                      'Skill enhancement',
                      'Interview preparation',
                      'Leadership development',
                      'Work-life balance'
                    ].map((goal) => (
                      <label key={goal} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={mentorshipRequest.goals.includes(goal)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMentorshipRequest({
                                ...mentorshipRequest,
                                goals: [...mentorshipRequest.goals, goal]
                              });
                            } else {
                              setMentorshipRequest({
                                ...mentorshipRequest,
                                goals: mentorshipRequest.goals.filter(g => g !== goal)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your current experience level?
                  </label>
                  <select
                    value={mentorshipRequest.experience}
                    onChange={(e) => setMentorshipRequest({...mentorshipRequest, experience: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="beginner">Complete Beginner</option>
                    <option value="some">Some Experience</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How much time can you commit per week?
                  </label>
                  <select
                    value={mentorshipRequest.timeCommitment}
                    onChange={(e) => setMentorshipRequest({...mentorshipRequest, timeCommitment: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select time commitment</option>
                    <option value="1-2 hours">1-2 hours</option>
                    <option value="3-5 hours">3-5 hours</option>
                    <option value="6-10 hours">6-10 hours</option>
                    <option value="10+ hours">10+ hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  <select
                    value={mentorshipRequest.preferredLanguage}
                    onChange={(e) => setMentorshipRequest({...mentorshipRequest, preferredLanguage: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select preferred language</option>
                    {selectedMentor.languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your specific needs and expectations
                  </label>
                  <textarea
                    rows={4}
                    value={mentorshipRequest.specificNeeds}
                    onChange={(e) => setMentorshipRequest({...mentorshipRequest, specificNeeds: e.target.value})}
                    placeholder="Describe what you hope to achieve through this mentorship..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  ></textarea>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-300"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-2xl text-center"
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Accelerate Your Growth?</h3>
        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
          Join thousands of learners who have transformed their careers with personalized mentorship from industry experts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowRequestForm(true)}
            className="px-8 py-3 bg-white text-green-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Find My Mentor
          </button>
          <button className="px-8 py-3 bg-green-700 text-white font-bold rounded-full hover:bg-green-800 transition-colors">
            Become a Mentor
          </button>
        </div>
      </motion.section>
    </div>
  );
}