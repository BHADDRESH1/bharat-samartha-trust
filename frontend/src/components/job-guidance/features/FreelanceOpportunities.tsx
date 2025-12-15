'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  DollarSign, 
  Clock, 
  Star, 
  TrendingUp,
  Users,
  Award,
  ExternalLink,
  Calculator,
  Briefcase,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Eye
} from 'lucide-react';

interface FreelanceGig {
  id: string;
  title: string;
  platform: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hourlyRate: { min: number; max: number };
  demand: 'High' | 'Medium' | 'Low';
  description: string;
  skills: string[];
  timeToStart: string;
  averageEarnings: string;
  logo: string;
}

interface Platform {
  name: string;
  logo: string;
  description: string;
  signupBonus?: string;
  rating: number;
  fees: string;
  bestFor: string[];
  link: string;
}

export default function FreelanceOpportunities() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showIncomeCalculator, setShowIncomeCalculator] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    hoursPerDay: 4,
    daysPerWeek: 5,
    hourlyRate: 500
  });

  const categories = ['All', 'Writing', 'Design', 'Programming', 'Data Entry', 'Marketing', 'Customer Service', 'Translation'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const platforms: Platform[] = [
    {
      name: 'Upwork',
      logo: '/api/placeholder/60/60',
      description: 'World\'s largest freelancing platform with diverse opportunities',
      signupBonus: 'Free to join',
      rating: 4.2,
      fees: '5-20% commission',
      bestFor: ['Professional services', 'Long-term projects', 'High-value clients'],
      link: 'https://upwork.com'
    },
    {
      name: 'Fiverr',
      logo: '/api/placeholder/60/60',
      description: 'Gig-based marketplace perfect for quick services',
      signupBonus: 'Free to join',
      rating: 4.1,
      fees: '5-20% commission',
      bestFor: ['Quick gigs', 'Creative services', 'Beginners'],
      link: 'https://fiverr.com'
    },
    {
      name: 'Freelancer',
      logo: '/api/placeholder/60/60',
      description: 'Global platform with contests and fixed-price projects',
      signupBonus: 'Free to join',
      rating: 3.9,
      fees: '3-10% commission',
      bestFor: ['Contests', 'Budget projects', 'Quick turnaround'],
      link: 'https://freelancer.com'
    },
    {
      name: 'Toptal',
      logo: '/api/placeholder/60/60',
      description: 'Elite network for top 3% of freelance talent',
      signupBonus: 'Screening required',
      rating: 4.8,
      fees: '0% commission',
      bestFor: ['Premium projects', 'Experienced professionals', 'High rates'],
      link: 'https://toptal.com'
    }
  ];

  const freelanceGigs: FreelanceGig[] = [
    {
      id: '1',
      title: 'Content Writing',
      platform: 'Multiple',
      category: 'Writing',
      difficulty: 'Easy',
      hourlyRate: { min: 200, max: 800 },
      demand: 'High',
      description: 'Write articles, blog posts, and web content for businesses',
      skills: ['Good English', 'Research skills', 'SEO knowledge'],
      timeToStart: '1-2 days',
      averageEarnings: '₹15,000-40,000/month',
      logo: '/api/placeholder/40/40'
    },
    {
      id: '2',
      title: 'Data Entry',
      platform: 'Upwork',
      category: 'Data Entry',
      difficulty: 'Easy',
      hourlyRate: { min: 150, max: 400 },
      demand: 'High',
      description: 'Enter data from various sources into spreadsheets or databases',
      skills: ['MS Excel', 'Attention to detail', 'Fast typing'],
      timeToStart: 'Same day',
      averageEarnings: '₹10,000-25,000/month',
      logo: '/api/placeholder/40/40'
    },
    {
      id: '3',
      title: 'Graphic Design',
      platform: 'Fiverr',
      category: 'Design',
      difficulty: 'Medium',
      hourlyRate: { min: 300, max: 1200 },
      demand: 'High',
      description: 'Create logos, banners, social media graphics, and marketing materials',
      skills: ['Photoshop', 'Illustrator', 'Creative thinking'],
      timeToStart: '2-3 days',
      averageEarnings: '₹20,000-60,000/month',
      logo: '/api/placeholder/40/40'
    },
    {
      id: '4',
      title: 'Web Development',
      platform: 'Toptal',
      category: 'Programming',
      difficulty: 'Hard',
      hourlyRate: { min: 1000, max: 3000 },
      demand: 'High',
      description: 'Build websites and web applications for clients',
      skills: ['HTML/CSS', 'JavaScript', 'React/Angular'],
      timeToStart: '1-2 weeks',
      averageEarnings: '₹50,000-150,000/month',
      logo: '/api/placeholder/40/40'
    },
    {
      id: '5',
      title: 'Virtual Assistant',
      platform: 'Multiple',
      category: 'Customer Service',
      difficulty: 'Easy',
      hourlyRate: { min: 200, max: 600 },
      demand: 'Medium',
      description: 'Provide administrative support to businesses remotely',
      skills: ['Communication', 'Organization', 'Basic computer skills'],
      timeToStart: '1-2 days',
      averageEarnings: '₹12,000-30,000/month',
      logo: '/api/placeholder/40/40'
    },
    {
      id: '6',
      title: 'Social Media Management',
      platform: 'Upwork',
      category: 'Marketing',
      difficulty: 'Medium',
      hourlyRate: { min: 400, max: 1000 },
      demand: 'High',
      description: 'Manage social media accounts and create content strategies',
      skills: ['Social media knowledge', 'Content creation', 'Analytics'],
      timeToStart: '2-3 days',
      averageEarnings: '₹18,000-50,000/month',
      logo: '/api/placeholder/40/40'
    },
    {
      id: '7',
      title: 'Translation Services',
      platform: 'Freelancer',
      category: 'Translation',
      difficulty: 'Medium',
      hourlyRate: { min: 300, max: 900 },
      demand: 'Medium',
      description: 'Translate documents and content between languages',
      skills: ['Bilingual proficiency', 'Cultural knowledge', 'Writing skills'],
      timeToStart: '1-2 days',
      averageEarnings: '₹15,000-40,000/month',
      logo: '/api/placeholder/40/40'
    },
    {
      id: '8',
      title: 'Online Tutoring',
      platform: 'Multiple',
      category: 'Education',
      difficulty: 'Medium',
      hourlyRate: { min: 250, max: 800 },
      demand: 'High',
      description: 'Teach students online in various subjects',
      skills: ['Subject expertise', 'Teaching ability', 'Patience'],
      timeToStart: '1-3 days',
      averageEarnings: '₹12,000-35,000/month',
      logo: '/api/placeholder/40/40'
    }
  ];

  const filteredGigs = freelanceGigs.filter(gig => {
    const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || gig.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const calculateMonthlyIncome = () => {
    const weeklyHours = calculatorInputs.hoursPerDay * calculatorInputs.daysPerWeek;
    const weeklyIncome = weeklyHours * calculatorInputs.hourlyRate;
    const monthlyIncome = weeklyIncome * 4.33; // Average weeks per month
    return Math.round(monthlyIncome);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Freelancing & Work-from-Home Opportunities
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start earning from home with flexible freelance opportunities
        </p>
      </div>

      {/* Income Calculator */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-full">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Income Potential Calculator</h3>
          </div>
          <button
            onClick={() => setShowIncomeCalculator(!showIncomeCalculator)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showIncomeCalculator ? 'Hide' : 'Calculate'}
          </button>
        </div>

        {showIncomeCalculator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours per day
              </label>
              <input
                type="number"
                value={calculatorInputs.hoursPerDay}
                onChange={(e) => setCalculatorInputs(prev => ({ ...prev, hoursPerDay: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days per week
              </label>
              <input
                type="number"
                value={calculatorInputs.daysPerWeek}
                onChange={(e) => setCalculatorInputs(prev => ({ ...prev, daysPerWeek: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="7"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly rate (₹)
              </label>
              <input
                type="number"
                value={calculatorInputs.hourlyRate}
                onChange={(e) => setCalculatorInputs(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="100"
                max="5000"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">Monthly Income</div>
              <div className="text-2xl font-bold text-green-600">
                ₹{calculateMonthlyIncome().toLocaleString()}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Top Platforms */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Top Freelancing Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={platform.logo} 
                  alt={platform.name}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{platform.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{platform.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{platform.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fees:</span>
                  <span className="font-medium">{platform.fees}</span>
                </div>
                {platform.signupBonus && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Signup:</span>
                    <span className="font-medium text-green-600">{platform.signupBonus}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-1">Best for:</p>
                <div className="flex flex-wrap gap-1">
                  {platform.bestFor.map((item, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                Join Platform
                <ExternalLink className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Find Opportunities
            </button>
          </div>
        </div>
      </div>

      {/* Freelance Opportunities */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">Available Opportunities</h3>
          <p className="text-gray-600">
            Showing {filteredGigs.length} opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig, index) => (
            <motion.div
              key={gig.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={gig.logo} 
                    alt={gig.title}
                    className="w-10 h-10 rounded-lg"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{gig.title}</h4>
                    <p className="text-sm text-gray-600">{gig.platform}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  gig.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  gig.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {gig.difficulty}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">{gig.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    ₹{gig.hourlyRate.min}-{gig.hourlyRate.max}
                  </div>
                  <div className="text-xs text-gray-600">Per Hour</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{gig.averageEarnings}</div>
                  <div className="text-xs text-gray-600">Monthly Avg</div>
                </div>
              </div>

              {/* Demand and Time */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className={`font-medium ${
                    gig.demand === 'High' ? 'text-green-600' :
                    gig.demand === 'Medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {gig.demand} Demand
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">{gig.timeToStart}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {gig.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Get Started
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Portfolio Builder Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-purple-500 rounded-full flex-shrink-0">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Build Your Portfolio</h3>
            <p className="text-gray-600 mb-4">
              Create a professional portfolio to showcase your work and attract clients
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h4 className="font-medium text-gray-800">Showcase Work</h4>
                </div>
                <p className="text-sm text-gray-600">Display your best projects and samples</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-medium text-gray-800">Client Reviews</h4>
                </div>
                <p className="text-sm text-gray-600">Build trust with testimonials</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium text-gray-800">Online Presence</h4>
                </div>
                <p className="text-sm text-gray-600">Professional website and profiles</p>
              </div>
            </div>
            <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              Create Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Freelancing Tips */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Freelancing Success Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Start Small',
              description: 'Begin with simple projects to build your reputation and portfolio',
              color: 'text-yellow-500'
            },
            {
              icon: Star,
              title: 'Quality First',
              description: 'Always deliver high-quality work to get positive reviews',
              color: 'text-blue-500'
            },
            {
              icon: Clock,
              title: 'Meet Deadlines',
              description: 'Timely delivery is crucial for client satisfaction',
              color: 'text-green-500'
            },
            {
              icon: Users,
              title: 'Communicate Well',
              description: 'Clear communication leads to better client relationships',
              color: 'text-purple-500'
            },
            {
              icon: TrendingUp,
              title: 'Continuous Learning',
              description: 'Keep updating your skills to stay competitive',
              color: 'text-red-500'
            },
            {
              icon: DollarSign,
              title: 'Price Strategically',
              description: 'Start with competitive rates, then increase as you gain experience',
              color: 'text-indigo-500'
            }
          ].map((tip, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-3 bg-gray-50 rounded-full mb-3">
                <tip.icon className={`w-6 h-6 ${tip.color}`} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{tip.title}</h4>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Freelancer Profiles/Success Stories */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Freelancer Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Rahul Sharma",
              skill: "Content Writer",
              earnings: "₹45,000/month",
              story: "Started freelancing as a side hustle, now it's my full-time career",
              image: "/api/placeholder/60/60",
              rating: 4.9,
              projects: 127
            },
            {
              name: "Priya Patel",
              skill: "Graphic Designer",
              earnings: "₹60,000/month",
              story: "Built a strong portfolio and now work with international clients",
              image: "/api/placeholder/60/60",
              rating: 4.8,
              projects: 89
            },
            {
              name: "Amit Kumar",
              skill: "Web Developer",
              earnings: "₹80,000/month",
              story: "Specialized in React development and increased rates by 300%",
              image: "/api/placeholder/60/60",
              rating: 5.0,
              projects: 156
            },
            {
              name: "Sunita Devi",
              skill: "Virtual Assistant",
              earnings: "₹35,000/month",
              story: "Manages 5 regular clients and has flexible working hours",
              image: "/api/placeholder/60/60",
              rating: 4.7,
              projects: 203
            }
          ].map((freelancer, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img 
                src={freelancer.image} 
                alt={freelancer.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-800">{freelancer.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{freelancer.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-blue-600 font-medium">{freelancer.skill}</span>
                  <span className="text-sm text-green-600 font-bold">{freelancer.earnings}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">"{freelancer.story}"</p>
                <p className="text-xs text-gray-500">{freelancer.projects} projects completed</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Freelancing?</h3>
          <p className="text-xl opacity-90">
            Follow these simple steps to begin your freelancing journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: 'Choose Your Skill',
              description: 'Pick a skill you\'re good at or willing to learn'
            },
            {
              step: 2,
              title: 'Create Profiles',
              description: 'Sign up on freelancing platforms with professional profiles'
            },
            {
              step: 3,
              title: 'Build Portfolio',
              description: 'Create samples of your work to showcase your abilities'
            },
            {
              step: 4,
              title: 'Start Bidding',
              description: 'Apply for projects and start building your reputation'
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                {step.step}
              </div>
              <h4 className="font-bold mb-2">{step.title}</h4>
              <p className="text-sm opacity-90">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}