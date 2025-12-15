'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CauseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  progress: number;
  raised: string;
  goal: string;
}

// Move data outside component to avoid re-creation on each render
const causes: CauseCardProps[] = [
  {
    id: 'clean-water',
    title: 'Clean Water Initiative',
    description: 'Providing access to clean and safe drinking water in rural communities across Africa.',
    image: '/images/causes/clean-water.jpg',
    category: 'Water',
    progress: 75,
    raised: '$15,000',
    goal: '$20,000'
  },
  {
    id: 'education',
    title: 'Education for All',
    description: 'Building schools and supporting education programs for underprivileged children.',
    image: '/images/causes/education.jpg',
    category: 'Education',
    progress: 60,
    raised: '$30,000',
    goal: '$50,000'
  },
  {
    id: 'healthcare',
    title: 'Healthcare Access',
    description: 'Improving healthcare facilities and services in remote and underserved areas.',
    image: '/images/causes/healthcare.jpg',
    category: 'Healthcare',
    progress: 45,
    raised: '$22,500',
    goal: '$50,000'
  },
  {
    id: 'sustainable-farming',
    title: 'Sustainable Farming',
    description: 'Teaching sustainable farming techniques to combat food insecurity and climate change.',
    image: '/images/causes/farming.jpg',
    category: 'Agriculture',
    progress: 85,
    raised: '$42,500',
    goal: '$50,000'
  },
  {
    id: 'women-empowerment',
    title: 'Women Empowerment',
    description: 'Supporting women entrepreneurs and providing skills training for economic independence.',
    image: '/images/causes/women.jpg',
    category: 'Empowerment',
    progress: 65,
    raised: '$32,500',
    goal: '$50,000'
  },
  {
    id: 'disaster-relief',
    title: 'Disaster Relief',
    description: 'Providing immediate aid and long-term support for communities affected by natural disasters.',
    image: '/images/causes/disaster.jpg',
    category: 'Emergency',
    progress: 90,
    raised: '$45,000',
    goal: '$50,000'
  }
];

// Extract categories once instead of in each render
const categories = ['All', ...Array.from(new Set(causes.map(cause => cause.category)))];

const CauseCard: React.FC<CauseCardProps> = ({ 
  id, 
  title, 
  description, 
  image, 
  category, 
  progress, 
  raised, 
  goal 
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{raised} raised</span>
            <span className="text-gray-500">Goal: {goal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <Link href={`/causes/${id}`}>
          <div className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300">
            Donate Now
          </div>
        </Link>
      </div>
    </div>
  );
};

const CausesGrid = () => {
  // Use SSR-safe initialization
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const filteredCauses = activeFilter === 'All' 
    ? causes 
    : causes.filter(cause => cause.category === activeFilter);
  
  if (!mounted) {
    // Return a skeleton or placeholder until client-side rendering occurs
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Current Causes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our ongoing projects and find a cause that resonates with your values.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700"
              >
                {category}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Current Causes</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our ongoing projects and find a cause that resonates with your values.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeFilter === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCauses.map((cause, index) => (
            <motion.div
              key={cause.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CauseCard {...cause} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CausesGrid;