'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  Download,
  Star,
  TrendingUp,
  Zap,
  CheckCircle,
  Lock,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  provider: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  description: string;
  features: string[];
  syllabus: string[];
  certificate: boolean;
  jobAssistance: boolean;
  isFree: boolean;
  isPopular: boolean;
  completionRate?: number;
}

export default function SkillTraining() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'All', 'Digital Skills', 'Technical', 'Vocational', 'Language', 'Soft Skills', 'Government Programs'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const courses: Course[] = [
    {
      id: '1',
      title: 'Digital Literacy & Computer Basics',
      category: 'Digital Skills',
      provider: 'Skill India',
      duration: '4 weeks',
      level: 'Beginner',
      rating: 4.8,
      students: 15420,
      price: 0,
      thumbnail: '/api/placeholder/300/200',
      description: 'Learn essential computer skills including MS Office, internet usage, and digital communication.',
      features: ['MS Office Suite', 'Internet Browsing', 'Email Setup', 'Digital Payments'],
      syllabus: ['Computer Basics', 'Windows Navigation', 'MS Word', 'MS Excel', 'Internet & Email', 'Digital Banking'],
      certificate: true,
      jobAssistance: true,
      isFree: true,
      isPopular: true,
      completionRate: 92
    },
    {
      id: '2',
      title: 'Web Development Fundamentals',
      category: 'Technical',
      provider: 'FreeCodeCamp',
      duration: '12 weeks',
      level: 'Beginner',
      rating: 4.7,
      students: 8530,
      price: 0,
      thumbnail: '/api/placeholder/300/200',
      description: 'Complete introduction to web development with HTML, CSS, and JavaScript.',
      features: ['HTML5 & CSS3', 'JavaScript Basics', 'Responsive Design', 'Projects'],
      syllabus: ['HTML Fundamentals', 'CSS Styling', 'JavaScript Programming', 'Responsive Web Design', 'Final Projects'],
      certificate: true,
      jobAssistance: false,
      isFree: true,
      isPopular: false,
      completionRate: 78
    },
    {
      id: '3',
      title: 'Electrical Technician Training',
      category: 'Vocational',
      provider: 'PMKVY',
      duration: '6 months',
      level: 'Intermediate',
      rating: 4.6,
      students: 3240,
      price: 0,
      thumbnail: '/api/placeholder/300/200',
      description: 'Comprehensive electrical technician training with hands-on practice and job placement.',
      features: ['Practical Training', 'Safety Protocols', 'Wiring Techniques', 'Job Placement'],
      syllabus: ['Electrical Basics', 'Wiring & Installation', 'Safety Measures', 'Maintenance', 'Industry Practices'],
      certificate: true,
      jobAssistance: true,
      isFree: true,
      isPopular: true,
      completionRate: 85
    },
    {
      id: '4',
      title: 'English Communication Skills',
      category: 'Language',
      provider: 'British Council',
      duration: '8 weeks',
      level: 'Beginner',
      rating: 4.9,
      students: 12350,
      price: 999,
      originalPrice: 2999,
      thumbnail: '/api/placeholder/300/200',
      description: 'Improve your English speaking and writing skills for better job opportunities.',
      features: ['Speaking Practice', 'Grammar Basics', 'Interview Preparation', 'Pronunciation'],
      syllabus: ['Basic Grammar', 'Speaking Fluency', 'Written Communication', 'Interview Skills', 'Presentation Skills'],
      certificate: true,
      jobAssistance: false,
      isFree: false,
      isPopular: true,
      completionRate: 94
    },
    {
      id: '5',
      title: 'Data Entry & MS Excel Advanced',
      category: 'Digital Skills',
      provider: 'NIELIT',
      duration: '6 weeks',
      level: 'Intermediate',
      rating: 4.5,
      students: 5670,
      price: 0,
      thumbnail: '/api/placeholder/300/200',
      description: 'Master data entry techniques and advanced Excel functions for office jobs.',
      features: ['Advanced Excel', 'Data Analysis', 'Pivot Tables', 'Automation'],
      syllabus: ['Excel Basics', 'Data Manipulation', 'Formulas & Functions', 'Charts & Graphs', 'Automation Techniques'],
      certificate: true,
      jobAssistance: true,
      isFree: true,
      isPopular: false,
      completionRate: 88
    },
    {
      id: '6',
      title: 'Customer Service Excellence',
      category: 'Soft Skills',
      provider: 'Coursera',
      duration: '4 weeks',
      level: 'Beginner',
      rating: 4.7,
      students: 9870,
      price: 1499,
      originalPrice: 3999,
      thumbnail: '/api/placeholder/300/200',
      description: 'Learn customer service skills that are essential for hospitality and retail jobs.',
      features: ['Communication Skills', 'Problem Solving', 'Customer Psychology', 'Conflict Resolution'],
      syllabus: ['Customer Service Basics', 'Communication Techniques', 'Handling Complaints', 'Building Relationships'],
      certificate: true,
      jobAssistance: false,
      isFree: false,
      isPopular: false,
      completionRate: 91
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const governmentPrograms = [
    {
      name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
      description: 'Free skill development training with monetary rewards',
      eligibility: 'Youth aged 15-45 years',
      benefits: ['Free Training', 'Cash Reward ₹8,000', 'Job Placement', 'Industry Certification']
    },
    {
      name: 'Skill India Digital',
      description: 'Online courses for digital literacy and IT skills',
      eligibility: 'All age groups',
      benefits: ['Free Certification', 'Self-paced Learning', 'Multiple Languages', 'Job Portal Access']
    },
    {
      name: 'DDU-GKY (Rural Youth Program)',
      description: 'Placement-linked skill development for rural youth',
      eligibility: 'Rural youth aged 15-35 years',
      benefits: ['100% Free', 'Guaranteed Placement', 'Stipend During Training', 'Post-placement Support']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Free Skill Development Courses
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upgrade your skills with certified courses and vocational training programs
        </p>
      </div>

      {/* Government Programs Highlight */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500 rounded-full">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Government Skill Programs</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {governmentPrograms.map((program, index) => (
            <motion.div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h4 className="font-bold text-gray-800 mb-2">{program.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{program.description}</p>
              <p className="text-xs text-blue-600 mb-3">
                <strong>Eligibility:</strong> {program.eligibility}
              </p>
              <div className="space-y-1">
                {program.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors w-full">
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 py-3 px-4 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} transition-colors`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-3 px-4 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} transition-colors`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Course Results */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredCourses.length} courses
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Free Only
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 inline mr-1" />
            More Filters
          </button>
        </div>
      </div>

      {/* Courses Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
              viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Course Image */}
            <div className={`relative ${viewMode === 'list' ? 'md:w-64 md:flex-shrink-0' : 'aspect-video'} overflow-hidden`}>
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {course.isFree && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    FREE
                  </span>
                )}
                {course.isPopular && (
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                    POPULAR
                  </span>
                )}
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <button className="p-3 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-6 h-6 text-blue-600" />
                </button>
              </div>

              {/* Progress bar for enrolled courses */}
              {course.completionRate && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                  <p className="text-white text-xs">{course.completionRate}% Complete</p>
                </div>
              )}
            </div>

            {/* Course Content */}
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {course.category}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {course.features.slice(0, 3).map((feature, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {feature}
                  </span>
                ))}
                {course.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    +{course.features.length - 3} more
                  </span>
                )}
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-3 mb-4 text-xs">
                {course.certificate && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Award className="w-3 h-3" />
                    <span>Certificate</span>
                  </div>
                )}
                {course.jobAssistance && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>Job Assistance</span>
                  </div>
                )}
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {course.isFree ? (
                    <span className="text-2xl font-bold text-green-600">FREE</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{course.price.toLocaleString()}
                      </span>
                      {course.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ₹{course.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    {course.isFree ? 'Enroll Free' : 'Enroll Now'}
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <BookOpen className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Details Modal - This would be implemented with state management */}
      
      {/* Load More */}
      {filteredCourses.length > 0 && (
        <div className="text-center">
          <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
            Load More Courses
          </button>
        </div>
      )}

      {/* No Courses Found */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Courses Found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or check back later for new courses.
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Learning Path Suggestion */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-purple-500 rounded-full flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Recommended Learning Path</h3>
            <p className="text-gray-600 mb-4">
              Based on current job market trends, here's a suggested learning sequence:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <h4 className="font-medium text-gray-800">Foundation</h4>
                </div>
                <p className="text-sm text-gray-600">Digital Literacy & Computer Basics</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <h4 className="font-medium text-gray-800">Specialization</h4>
                </div>
                <p className="text-sm text-gray-600">Choose Technical or Vocational Skills</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <h4 className="font-medium text-gray-800">Enhancement</h4>
                </div>
                <p className="text-sm text-gray-600">Soft Skills & Communication</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Ravi Kumar",
              course: "Digital Literacy Program",
              outcome: "Got job as Data Entry Operator at ₹18,000/month",
              image: "/api/placeholder/60/60"
            },
            {
              name: "Priya Sharma",
              course: "Electrical Technician Training",
              outcome: "Started own electrical repair business",
              image: "/api/placeholder/60/60"
            },
            {
              name: "Amit Patel",
              course: "Web Development Course",
              outcome: "Freelancing income of ₹40,000/month",
              image: "/api/placeholder/60/60"
            },
            {
              name: "Sunita Devi",
              course: "English Communication Skills",
              outcome: "Promoted to Customer Service Lead",
              image: "/api/placeholder/60/60"
            }
          ].map((story, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img 
                src={story.image} 
                alt={story.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-medium text-gray-800">{story.name}</h4>
                <p className="text-sm text-blue-600 mb-1">{story.course}</p>
                <p className="text-sm text-gray-600">{story.outcome}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Start Your Learning Journey?</h3>
        <p className="text-xl mb-6 opacity-90">
          Join thousands of learners who have transformed their careers
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
            Browse Free Courses
          </button>
          <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
            Get Career Guidance
          </button>
        </div>
      </div>
    </div>
  );
}