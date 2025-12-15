import { useState, useEffect } from 'react';
import { safeFetch } from '@/lib/fetchUtils';
import { Star, Heart, Globe, Lightbulb, Target, Eye } from 'lucide-react';

interface CoreValue {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface MissionVisionData {
  mission: {
    title: string;
    content: string;
    isVisible: boolean;
  };
  vision: {
    title: string;
    content: string;
    isVisible: boolean;
  };
  coreValues: CoreValue[];
}

interface MissionVisionProps {
  valuesRef?: React.RefObject<HTMLDivElement>;
}

export default function MissionVision({ valuesRef }: MissionVisionProps) {
  const [data, setData] = useState<MissionVisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissionVision = async () => {
      try {
        const result = await safeFetch('/api/mission', { timeout: 5000 });
        if (result.success && result.data) {
          setData(result.data);
        } else {
          // Use fallback data
          setData(getFallbackData());
        }
      } catch (err) {
        console.error('Error fetching mission/vision:', err);
        // Use fallback data on error
        setData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchMissionVision();
  }, []);

  // Fallback data for Bharat Samarth Trust
  const getFallbackData = (): MissionVisionData => ({
    mission: {
      title: 'Our Mission',
      content: 'To empower underprivileged communities across Tamil Nadu through sustainable education, healthcare, and social welfare programs. We are committed to creating lasting positive change by providing resources, opportunities, and support to those who need it most.',
      isVisible: true
    },
    vision: {
      title: 'Our Vision',
      content: 'A Tamil Nadu where every individual has access to quality education, healthcare, and opportunities for growth. We envision communities that are self-reliant, healthy, and prosperous, where no one is left behind.',
      isVisible: true
    },
    coreValues: [
      {
        id: 1,
        title: 'Compassion',
        description: 'We lead with empathy and understanding, treating every individual with dignity and respect.',
        icon: 'Heart'
      },
      {
        id: 2,
        title: 'Transparency',
        description: 'We maintain complete transparency in our operations and fund utilization, building trust through accountability.',
        icon: 'Globe'
      },
      {
        id: 3,
        title: 'Innovation',
        description: 'We embrace creative solutions to address complex social challenges and maximize our impact.',
        icon: 'Lightbulb'
      },
      {
        id: 4,
        title: 'Sustainability',
        description: 'We focus on long-term sustainable solutions that empower communities to become self-sufficient.',
        icon: 'Target'
      }
    ]
  });

  const getIcon = (iconName: string) => {
    const iconClasses = "w-16 h-16 drop-shadow-lg";
    switch (iconName) {
      case 'Heart':
        return <Heart className={`${iconClasses} text-pink-500`} />;
      case 'Globe':
        return <Globe className={`${iconClasses} text-blue-500`} />;
      case 'Lightbulb':
        return <Lightbulb className={`${iconClasses} text-yellow-500`} />;
      case 'Target':
        return <Target className={`${iconClasses} text-green-500`} />;
      default:
        return <Star className={`${iconClasses} text-purple-500`} />;
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 text-lg">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block p-2 bg-indigo-100 rounded-full mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Our Purpose & Direction
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mb-20">
          {/* Mission Section */}
          {data.mission.isVisible && (
            <div className="lg:w-1/2 group">
              <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-sm shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-6 shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-800">
                        {data.mission.title || 'Mission'}
                      </h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {data.mission.content || 'To create a world where every individual has access to basic human rights—food, education, healthcare, and dignity.'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Vision Section */}
          {data.vision.isVisible && (
            <div className="lg:w-1/2 group">
              <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-sm shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-6 shadow-lg">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-800">
                        {data.vision.title || 'Vision'}
                      </h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2"></div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {data.vision.content || 'To end poverty, uplift communities, and create sustainable solutions for a better tomorrow.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Core Values Section */}
        {data.coreValues && data.coreValues.length > 0 && (
          <div ref={valuesRef} className="mt-20">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-5xl font-black text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Core Values
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide every decision we make and every action we take.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full mt-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data.coreValues.map((value, index) => (
                <div 
                  key={value.id} 
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex flex-col items-center text-center">
                      <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                        {getIcon(value.icon)}
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                        {value.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}