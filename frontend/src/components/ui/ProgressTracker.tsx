'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Award, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Book,
  Briefcase,
  X,
  ChevronRight,
  Plus
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'resume' | 'interview' | 'skills' | 'jobs' | 'general';
  points: number;
  unlockedAt: Date;
  icon: any;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: Date;
  progress: number;
  completed: boolean;
  steps: string[];
  completedSteps: number;
}

interface Activity {
  id: string;
  type: 'resume_built' | 'job_applied' | 'skill_learned' | 'interview_practiced' | 'course_completed';
  title: string;
  timestamp: Date;
  points: number;
}

export default function ProgressTracker() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [totalPoints, setTotalPoints] = useState(1250);
  const [level, setLevel] = useState(3);
  const [nextLevelPoints, setNextLevelPoints] = useState(1500);

  // Mock data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Resume',
      description: 'Created your first professional resume',
      category: 'resume',
      points: 100,
      unlockedAt: new Date(2024, 0, 15),
      icon: CheckCircle
    },
    {
      id: '2',
      title: 'Job Hunter',
      description: 'Applied to 10 jobs',
      category: 'jobs',
      points: 200,
      unlockedAt: new Date(2024, 0, 20),
      icon: Briefcase
    },
    {
      id: '3',
      title: 'Skill Builder',
      description: 'Completed 3 skill courses',
      category: 'skills',
      points: 300,
      unlockedAt: new Date(2024, 1, 5),
      icon: Book
    }
  ];

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Land a Job in Tech',
      description: 'Get hired as a software developer',
      category: 'Career',
      targetDate: new Date(2024, 5, 30),
      progress: 65,
      completed: false,
      steps: [
        'Complete JavaScript course',
        'Build 3 projects',
        'Create portfolio website',
        'Apply to 20 companies',
        'Practice interviews'
      ],
      completedSteps: 3
    },
    {
      id: '2',
      title: 'Improve Communication',
      description: 'Master professional communication skills',
      category: 'Skills',
      targetDate: new Date(2024, 3, 15),
      progress: 80,
      completed: false,
      steps: [
        'Complete communication course',
        'Practice public speaking',
        'Record practice sessions',
        'Get feedback'
      ],
      completedSteps: 3
    }
  ];

  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'resume_built',
      title: 'Updated resume with new skills',
      timestamp: new Date(2024, 1, 10),
      points: 50
    },
    {
      id: '2',
      type: 'job_applied',
      title: 'Applied to Software Developer position',
      timestamp: new Date(2024, 1, 9),
      points: 25
    },
    {
      id: '3',
      type: 'course_completed',
      title: 'Completed React Fundamentals course',
      timestamp: new Date(2024, 1, 8),
      points: 100
    },
    {
      id: '4',
      type: 'interview_practiced',
      title: 'Practiced behavioral interview questions',
      timestamp: new Date(2024, 1, 7),
      points: 30
    }
  ];

  useEffect(() => {
    // Show progress tracker after 5 seconds (for demo)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'resume_built': return CheckCircle;
      case 'job_applied': return Briefcase;
      case 'skill_learned': return Book;
      case 'interview_practiced': return Target;
      case 'course_completed': return Award;
      default: return Star;
    }
  };

  const progressToNextLevel = ((totalPoints % 500) / 500) * 100;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 left-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden"
        initial={{ opacity: 0, x: -100, y: 100 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: -100, y: 100 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <h3 className="font-bold">Progress Tracker</h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Level Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Level {level}</span>
            <span className="text-sm">{totalPoints} / {nextLevelPoints} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div 
              className="bg-yellow-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'achievements', label: 'Badges', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 max-h-80 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    {recentActivities.slice(0, 4).map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <div className="p-1 bg-blue-100 rounded">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-green-600">
                            +{activity.points} XP
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-xs text-gray-600">Jobs Applied</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">5</div>
                      <div className="text-xs text-gray-600">Skills Learned</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">3</div>
                      <div className="text-xs text-gray-600">Interviews</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">8</div>
                      <div className="text-xs text-gray-600">Courses</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Goals Tab */}
            {activeTab === 'goals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800">Active Goals</h4>
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-gray-800 text-sm">{goal.title}</h5>
                          <p className="text-xs text-gray-600">{goal.description}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {goal.category}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className="bg-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Due {goal.targetDate.toLocaleDateString()}</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {goal.completedSteps}/{goal.steps.length} steps
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800">Earned Badges</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-2 bg-yellow-500 rounded-full inline-flex mb-2">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h5 className="font-bold text-gray-800 text-sm mb-1">
                          {achievement.title}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-xs text-yellow-700">
                          <Star className="w-3 h-3" />
                          <span>{achievement.points} XP</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Next Achievements */}
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Next Badges</h5>
                  <div className="space-y-2">
                    {[
                      { title: 'Interview Pro', description: 'Complete 5 mock interviews', progress: 60 },
                      { title: 'Network Builder', description: 'Connect with 50 professionals', progress: 30 }
                    ].map((next, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg opacity-60">
                        <div className="p-1 bg-gray-300 rounded">
                          <Award className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">{next.title}</p>
                          <p className="text-xs text-gray-500">{next.description}</p>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className="bg-gray-400 h-1 rounded-full"
                              style={{ width: `${next.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-3">
          <button
            onClick={() => setIsVisible(false)}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-1"
          >
            View Full Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}