'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

interface BeforeAfterSlideProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
}

interface TransformProject {
  _id: string;
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SectionSettings {
  _id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  isVisible: boolean;
}

const BeforeAfterSlide: React.FC<BeforeAfterSlideProps> = ({ 
  beforeImage, 
  afterImage, 
  title, 
  description 
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.min(Math.max(x, 0), 100));
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current && e.touches[0]) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.min(Math.max(x, 0), 100));
    }
  };

  return (
    <div className="mb-12">
      <h4 className="text-xl font-bold mb-2" style={{ color: 'inherit' }}>{title}</h4>
      <p className="mb-4 opacity-75" style={{ color: 'inherit' }}>{description}</p>
      
      <div 
        ref={containerRef}
        className="relative h-80 md:h-96 overflow-hidden rounded-xl cursor-ew-resize"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* After image (full size) */}
        <div className="absolute inset-0">
          <Image 
            src={afterImage}
            alt="After transformation"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Before image (clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <Image 
            src={beforeImage}
            alt="Before transformation"
            fill
            className="object-cover"
          />
          <div className="absolute top-0 bottom-0 right-0 w-1 bg-white" />
        </div>
        
        {/* Slider handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8L22 12L18 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8L2 12L6 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const BeforeAfterSlider = () => {
  const [projects, setProjects] = useState<TransformProject[]>([]);
  const [settings, setSettings] = useState<SectionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects and settings in parallel
        const [projectsResponse, settingsResponse] = await Promise.all([
          safeFetch('/api/transform-projects', { timeout: 5000 }),
          safeFetch('/api/transform-section-settings', { timeout: 5000 })
        ]);

        if (projectsResponse.success && settingsResponse.success) {
          const projectsData = projectsResponse.data;
          const settingsData = settingsResponse.data;

          // Filter only active projects
          const activeProjects = projectsData.filter((project: TransformProject) => project.isActive);
          
          setProjects(activeProjects);
          setSettings(settingsData);
        } else {
          // Use fallback data
          const fallback = getFallbackData();
          setProjects(fallback.projects);
          setSettings(fallback.settings);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        // Use fallback data on error
        const fallback = getFallbackData();
        setProjects(fallback.projects);
        setSettings(fallback.settings);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback data for Bharat Samarth Trust
  const getFallbackData = () => ({
    projects: [
      {
        _id: '1',
        id: 1,
        title: 'Rural School Transformation',
        beforeImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
        afterImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
        description: 'Renovated and equipped a village school with modern facilities and learning resources',
        location: 'Madurai District, Tamil Nadu',
        year: 2023,
        category: 'Education',
        impactStat: '500+ students benefited',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        id: 2,
        title: 'Community Healthcare Center',
        beforeImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
        afterImage: 'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=800',
        description: 'Established a modern healthcare facility providing free medical services to rural communities',
        location: 'Theni, Tamil Nadu',
        year: 2024,
        category: 'Healthcare',
        impactStat: '2,000+ families served',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    settings: {
      _id: '1',
      title: 'Transformation Stories',
      subtitle: 'BEFORE & AFTER',
      sectionTitle: 'Transformation Stories',
      sectionSubtitle: 'BEFORE & AFTER',
      textColor: 'gray-800',
      isVisible: true,
      backgroundColor: 'gray-50',
      autoplaySpeed: 5000
    }
  });

  // Don't render if section is not visible or if there's an error
  if (error) {
    console.error('BeforeAfterSlider Error:', error);
    return null;
  }

  if (loading) {
    return (
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-lg">Loading transformations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!settings?.isVisible || projects.length === 0) {
    return null;
  }

  // Use settings for dynamic styling and content
  const title = settings.title || 'See Our Impact';
  const subtitle = settings.subtitle || 'Witness the transformative power of our projects through these before and after comparisons.';

  // Function to process color values - handles hex, rgb, rgba, or Tailwind classes
  const processColor = (colorValue: string, defaultColor: string) => {
    if (!colorValue) return defaultColor;
    
    // If it's already a hex color, rgb, rgba, or named color, use it directly
    if (colorValue.startsWith('#') || 
        colorValue.startsWith('rgb') || 
        colorValue.startsWith('hsl') ||
        /^[a-zA-Z]+$/.test(colorValue.replace(/\s/g, ''))) {
      return colorValue;
    }
    
    // If it's a Tailwind class, convert it
    const tailwindColorMap: { [key: string]: string } = {
      'bg-blue-900': '#1e3a8a',
      'bg-blue-800': '#1e40af',
      'bg-blue-700': '#1d4ed8',
      'bg-gray-900': '#111827',
      'bg-gray-800': '#1f2937',
      'bg-black': '#000000',
      'bg-white': '#ffffff',
      'bg-green-900': '#14532d',
      'bg-red-900': '#7f1d1d',
      'bg-purple-900': '#581c87',
      'bg-indigo-900': '#312e81',
      'text-white': '#ffffff',
      'text-black': '#000000',
      'text-gray-100': '#f3f4f6',
      'text-gray-200': '#e5e7eb',
      'text-gray-800': '#1f2937',
      'text-gray-900': '#111827',
      'text-blue-100': '#dbeafe',
      'text-blue-900': '#1e3a8a',
    };
    
    return tailwindColorMap[colorValue] || defaultColor;
  };

  const sectionStyle = {
    backgroundColor: processColor(settings.backgroundColor || 'bg-blue-900', '#1e3a8a'),
    color: processColor(settings.textColor || 'text-white', '#ffffff'),
  };

  return (
    <section className="py-16" style={sectionStyle}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl max-w-3xl mx-auto opacity-80">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <BeforeAfterSlide 
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                title={project.title}
                description={project.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;