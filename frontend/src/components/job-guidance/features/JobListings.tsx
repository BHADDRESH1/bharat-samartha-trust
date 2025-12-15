'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter,
  Building,
  GraduationCap,
  Briefcase,
  Bell,
  ExternalLink,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Government' | 'Private' | 'Internship' | 'Remote';
  experience: string;
  salary: string;
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  logo: string;
  isBookmarked: boolean;
  isNew: boolean;
}

export default function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [loading, setLoading] = useState(true);

  // Mock job data
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Junior Software Developer',
      company: 'TCS',
      location: 'Bangalore',
      type: 'Private',
      experience: '0-2 years',
      salary: '₹3-5 LPA',
      postedDate: '2 hours ago',
      deadline: '15 days left',
      description: 'Looking for fresh graduates with programming skills in Java, Python, or JavaScript.',
      requirements: ['BE/BTech in CSE/IT', 'Good programming skills', 'Problem-solving abilities'],
      logo: '/api/placeholder/60/60',
      isBookmarked: false,
      isNew: true
    },
    {
      id: '2',
      title: 'SSC Constable',
      company: 'Delhi Police',
      location: 'Delhi',
      type: 'Government',
      experience: '0-1 years',
      salary: '₹2-3 LPA',
      postedDate: '1 day ago',
      deadline: '30 days left',
      description: 'Recruitment for Constable positions in Delhi Police. Physical fitness required.',
      requirements: ['12th Pass', 'Age 18-25 years', 'Physical fitness standards'],
      logo: '/api/placeholder/60/60',
      isBookmarked: false,
      isNew: true
    },
    {
      id: '3',
      title: 'Content Writer Intern',
      company: 'Digital Marketing Agency',
      location: 'Mumbai',
      type: 'Internship',
      experience: 'Fresher',
      salary: '₹15,000/month',
      postedDate: '3 days ago',
      deadline: '10 days left',
      description: 'Internship opportunity for content writing and digital marketing.',
      requirements: ['Graduate in any field', 'Good English writing skills', 'Creativity'],
      logo: '/api/placeholder/60/60',
      isBookmarked: true,
      isNew: false
    },
    {
      id: '4',
      title: 'Customer Support Executive',
      company: 'Amazon',
      location: 'Remote',
      type: 'Remote',
      experience: '0-1 years',
      salary: '₹2.5-4 LPA',
      postedDate: '5 days ago',
      deadline: '20 days left',
      description: 'Work from home opportunity for customer support role.',
      requirements: ['Graduate', 'Good communication skills', 'Computer literacy'],
      logo: '/api/placeholder/60/60',
      isBookmarked: false,
      isNew: false
    },
    {
      id: '5',
      title: 'Bank Clerk',
      company: 'SBI',
      location: 'Chennai',
      type: 'Government',
      experience: 'Fresher',
      salary: '₹3-4 LPA',
      postedDate: '1 week ago',
      deadline: '25 days left',
      description: 'Clerk positions available in State Bank of India branches.',
      requirements: ['Graduate', 'Basic computer knowledge', 'Age 20-28 years'],
      logo: '/api/placeholder/60/60',
      isBookmarked: false,
      isNew: false
    },
    {
      id: '6',
      title: 'Sales Executive',
      company: 'Reliance Retail',
      location: 'Hyderabad',
      type: 'Private',
      experience: '0-2 years',
      salary: '₹2-3 LPA',
      postedDate: '2 weeks ago',
      deadline: '5 days left',
      description: 'Sales opportunities in retail sector with growth potential.',
      requirements: ['Any Graduate', 'Sales aptitude', 'Communication skills'],
      logo: '/api/placeholder/60/60',
      isBookmarked: false,
      isNew: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, selectedType, selectedLocation, jobs]);

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    if (selectedLocation !== 'All') {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    setFilteredJobs(filtered);
  };

  const toggleBookmark = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  };

  const jobTypes = ['All', 'Government', 'Private', 'Internship', 'Remote'];
  const locations = ['All', 'Bangalore', 'Delhi', 'Mumbai', 'Chennai', 'Hyderabad', 'Remote'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Latest Job Openings
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Real-time job listings from government and private sectors
        </p>
      </div>

      {/* Job Alert Ticker */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 overflow-hidden">
        <div className="flex items-center mb-2">
          <Bell className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="font-medium text-yellow-800">Latest Job Alerts</span>
        </div>
        <div className="relative overflow-hidden">
          <motion.div
            className="whitespace-nowrap"
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <span className="text-yellow-700">
              🔥 TCS hiring 5000+ freshers • Railway recruitment 2024 • Amazon work from home jobs • 
              Banking sector openings • Government teacher positions • IT internships available
            </span>
          </motion.div>
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
              placeholder="Search jobs, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Job Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          {/* Smart Alert Button */}
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2">
            <Bell className="w-5 h-5" />
            Get Alerts
          </button>
        </div>
      </div>

      {/* Job Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredJobs.length} jobs out of {jobs.length}
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 inline mr-1" />
            More Filters
          </button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {loading ? (
          // Loading skeletons
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Company Logo and Basic Info */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img 
                      src={job.logo} 
                      alt={job.company}
                      className="w-16 h-16 rounded-lg border border-gray-200"
                    />
                    {job.isNew && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building className="w-4 h-4" />
                      <span>{job.company}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.type === 'Government' ? 'bg-green-100 text-green-800' :
                        job.type === 'Private' ? 'bg-blue-100 text-blue-800' :
                        job.type === 'Remote' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {job.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.postedDate}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.slice(0, 2).map((req, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 2 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                          +{job.requirements.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:items-end">
                  <div className="text-right mb-2">
                    <span className="text-sm text-red-600 font-medium">
                      ⏰ {job.deadline}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBookmark(job.id)}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      {job.isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Load More */}
      {!loading && filteredJobs.length > 0 && (
        <div className="text-center">
          <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
            Load More Jobs
          </button>
        </div>
      )}

      {/* No Jobs Found */}
      {!loading && filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Jobs Found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedType('All');
              setSelectedLocation('All');
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}