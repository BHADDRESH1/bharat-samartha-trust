'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw,
  MessageCircle,
  Video,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  Volume2,
  FileText,
  Download,
  Star,
  CheckCircle,
  User,
  Zap,
  Clock,
  Eye
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  lessons: number;
  rating: number;
  thumbnail: string;
  skills: string[];
  completed?: boolean;
  progress?: number;
}

interface Exercise {
  id: string;
  title: string;
  type: 'speaking' | 'listening' | 'writing' | 'reading';
  description: string;
  instructions: string;
  timeLimit?: number;
  difficulty: string;
}

export default function CommunicationCoach() {
  const [activeTab, setActiveTab] = useState('modules');
  const [isRecording, setIsRecording] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const tabs = [
    { id: 'modules', label: 'Training Modules', icon: BookOpen },
    { id: 'practice', label: 'Practice Exercises', icon: Mic },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
    { id: 'resources', label: 'Resources', icon: FileText }
  ];

  const modules: Module[] = [
    {
      id: '1',
      title: 'Interview Communication Skills',
      category: 'Professional',
      duration: '2 hours',
      difficulty: 'Beginner',
      description: 'Master the art of communicating effectively during job interviews',
      lessons: 8,
      rating: 4.8,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Body Language', 'Answering Questions', 'Confidence Building'],
      completed: false,
      progress: 60
    },
    {
      id: '2',
      title: 'Public Speaking Fundamentals',
      category: 'Presentation',
      duration: '3 hours',
      difficulty: 'Intermediate',
      description: 'Overcome stage fright and deliver compelling presentations',
      lessons: 12,
      rating: 4.9,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Stage Presence', 'Voice Modulation', 'Audience Engagement'],
      completed: false,
      progress: 25
    },
    {
      id: '3',
      title: 'Business Email Writing',
      category: 'Written Communication',
      duration: '1.5 hours',
      difficulty: 'Beginner',
      description: 'Write professional emails that get results',
      lessons: 6,
      rating: 4.7,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Email Etiquette', 'Professional Tone', 'Clear Messaging'],
      completed: true,
      progress: 100
    },
    {
      id: '4',
      title: 'Customer Service Excellence',
      category: 'Professional',
      duration: '2.5 hours',
      difficulty: 'Intermediate',
      description: 'Handle customer interactions with confidence and professionalism',
      lessons: 10,
      rating: 4.6,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Active Listening', 'Problem Solving', 'Empathy'],
      completed: false,
      progress: 0
    },
    {
      id: '5',
      title: 'Telephone Etiquette',
      category: 'Professional',
      duration: '1 hour',
      difficulty: 'Beginner',
      description: 'Master professional phone communication skills',
      lessons: 5,
      rating: 4.5,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Voice Clarity', 'Professional Greetings', 'Call Handling'],
      completed: false,
      progress: 40
    },
    {
      id: '6',
      title: 'Team Communication',
      category: 'Workplace',
      duration: '2 hours',
      difficulty: 'Advanced',
      description: 'Collaborate effectively with team members and colleagues',
      lessons: 9,
      rating: 4.8,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Collaboration', 'Conflict Resolution', 'Leadership'],
      completed: false,
      progress: 15
    }
  ];

  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'Self Introduction Practice',
      type: 'speaking',
      description: 'Practice introducing yourself professionally',
      instructions: 'Record a 60-second self-introduction. Include your name, background, and career goals.',
      timeLimit: 60,
      difficulty: 'Beginner'
    },
    {
      id: '2',
      title: 'Common Interview Questions',
      type: 'speaking',
      description: 'Practice answering frequently asked interview questions',
      instructions: 'Answer the question: "Tell me about your strengths and weaknesses."',
      timeLimit: 120,
      difficulty: 'Intermediate'
    },
    {
      id: '3',
      title: 'Phone Call Simulation',
      type: 'speaking',
      description: 'Practice professional phone conversations',
      instructions: 'Role-play a customer service call. Listen to the scenario and respond appropriately.',
      timeLimit: 180,
      difficulty: 'Intermediate'
    },
    {
      id: '4',
      title: 'Email Writing Exercise',
      type: 'writing',
      description: 'Write a professional email response',
      instructions: 'Write a follow-up email after a job interview, thanking the interviewer.',
      difficulty: 'Beginner'
    }
  ];

  const progressData = {
    overallProgress: 45,
    completedModules: 1,
    totalModules: 6,
    practiceSessions: 12,
    totalPracticeTime: '8 hours',
    badges: [
      { name: 'First Steps', description: 'Completed first module', earned: true },
      { name: 'Practice Makes Perfect', description: '10 practice sessions', earned: true },
      { name: 'Speaking Pro', description: 'Master speaking exercises', earned: false },
      { name: 'Communication Expert', description: 'Complete all modules', earned: false }
    ]
  };

  const startRecording = () => {
    setIsRecording(true);
    // Start recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop recording and process audio
  };

  const playExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    // Play exercise audio if applicable
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          AI Communication Coach
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Improve your speaking and communication skills with personalized training
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: BookOpen, value: '6', label: 'Training Modules', color: 'text-blue-500' },
          { icon: Mic, value: '25+', label: 'Practice Exercises', color: 'text-green-500' },
          { icon: Award, value: '4', label: 'Achievement Badges', color: 'text-purple-500' },
          { icon: Clock, value: '10h', label: 'Content Duration', color: 'text-orange-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gray-50 rounded-full">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Training Modules */}
            {activeTab === 'modules' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">Available Modules</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Filter by Level
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={module.thumbnail} 
                          alt={module.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            module.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {module.difficulty}
                          </span>
                          {module.completed && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <button className="p-3 bg-white/90 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <Play className="w-6 h-6 text-blue-600" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {module.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{module.rating}</span>
                          </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mb-2">{module.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{module.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{module.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{module.lessons} lessons</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {module.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {module.progress !== undefined && module.progress > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{module.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          {module.completed ? 'Review' : module.progress ? 'Continue' : 'Start Module'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Practice Exercises */}
            {activeTab === 'practice' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Practice Exercises</h3>
                  <p className="text-gray-600">
                    Choose an exercise to practice your communication skills
                  </p>
                </div>

                {/* AI Voice Trainer */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500 rounded-full">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">AI Voice Trainer</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 mb-4">
                        Practice speaking and get instant feedback on your pronunciation, pace, and clarity.
                      </p>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`p-6 rounded-full transition-all duration-300 ${
                              isRecording 
                                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                          >
                            {isRecording ? (
                              <MicOff className="w-8 h-8 text-white" />
                            ) : (
                              <Mic className="w-8 h-8 text-white" />
                            )}
                          </button>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                          </p>
                          {isRecording && (
                            <div className="text-lg font-bold text-red-600">
                              {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-800 mb-3">Real-time Feedback</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <span className="text-sm text-gray-600">Clarity</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                            </div>
                            <span className="text-sm font-medium">80%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <span className="text-sm text-gray-600">Pace</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full w-3/5"></div>
                            </div>
                            <span className="text-sm font-medium">60%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <span className="text-sm text-gray-600">Confidence</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                            </div>
                            <span className="text-sm font-medium">75%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercise List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {exercise.type === 'speaking' && <Mic className="w-5 h-5 text-blue-600" />}
                            {exercise.type === 'writing' && <FileText className="w-5 h-5 text-blue-600" />}
                            {exercise.type === 'listening' && <Volume2 className="w-5 h-5 text-blue-600" />}
                            {exercise.type === 'reading' && <BookOpen className="w-5 h-5 text-blue-600" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{exercise.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{exercise.type} Exercise</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {exercise.difficulty}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{exercise.description}</p>
                      
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">
                          <strong>Instructions:</strong> {exercise.instructions}
                        </p>
                        {exercise.timeLimit && (
                          <p className="text-sm text-blue-600 mt-2">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Time limit: {exercise.timeLimit} seconds
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => playExercise(exercise)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Start Exercise
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Tracker */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Your Progress</h3>
                  <p className="text-gray-600">Track your communication skill development</p>
                </div>

                {/* Overall Progress */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800">Overall Progress</h4>
                    <span className="text-2xl font-bold text-blue-600">{progressData.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressData.overallProgress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{progressData.completedModules}</div>
                      <div className="text-sm text-gray-600">Modules Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{progressData.totalModules}</div>
                      <div className="text-sm text-gray-600">Total Modules</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{progressData.practiceSessions}</div>
                      <div className="text-sm text-gray-600">Practice Sessions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{progressData.totalPracticeTime}</div>
                      <div className="text-sm text-gray-600">Practice Time</div>
                    </div>
                  </div>
                </div>

                {/* Module Progress */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Module Progress</h4>
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div key={module.id} className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {module.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{module.title}</span>
                            <span className="text-sm text-gray-600">{module.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                module.completed ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${module.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Achievement Badges</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {progressData.badges.map((badge, index) => (
                      <motion.div
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                          badge.earned 
                            ? 'border-yellow-200 bg-yellow-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className={`p-3 rounded-full ${
                          badge.earned ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}>
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className={`font-bold ${
                            badge.earned ? 'text-yellow-800' : 'text-gray-600'
                          }`}>
                            {badge.name}
                          </h5>
                          <p className={`text-sm ${
                            badge.earned ? 'text-yellow-700' : 'text-gray-500'
                          }`}>
                            {badge.description}
                          </p>
                        </div>
                        {badge.earned && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Learning Resources</h3>
                  <p className="text-gray-600">Additional materials to enhance your communication skills</p>
                </div>

                {/* Resource Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Communication Handbooks',
                      description: 'Downloadable guides and best practices',
                      icon: BookOpen,
                      color: 'text-blue-500',
                      items: ['Interview Guide', 'Email Templates', 'Presentation Tips', 'Body Language Basics']
                    },
                    {
                      title: 'Video Tutorials',
                      description: 'Watch expert demonstrations and examples',
                      icon: Video,
                      color: 'text-green-500',
                      items: ['Public Speaking', 'Voice Modulation', 'Confidence Building', 'Professional Etiquette']
                    },
                    {
                      title: 'Practice Scripts',
                      description: 'Ready-to-use scenarios for practice',
                      icon: FileText,
                      color: 'text-purple-500',
                      items: ['Interview Scenarios', 'Customer Service Scripts', 'Phone Conversations', 'Meeting Discussions']
                    }
                  ].map((category, index) => (
                    <motion.div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <category.icon className={`w-6 h-6 ${category.color}`} />
                        </div>
                        <h4 className="font-bold text-gray-800">{category.title}</h4>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {category.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Access Resources
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Tips */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Communication Tips</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Maintain eye contact to build trust and confidence",
                      "Use clear and simple language to avoid confusion",
                      "Listen actively and ask clarifying questions",
                      "Practice deep breathing to control nerves",
                      "Use positive body language and gestures",
                      "Prepare and organize your thoughts beforehand"
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Improve Your Communication?</h3>
        <p className="text-xl mb-6 opacity-90">
          Start with our beginner-friendly modules and track your progress
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setActiveTab('modules')}
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Training
          </button>
          <button 
            onClick={() => setActiveTab('practice')}
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
          >
            Practice Now
          </button>
        </div>
      </div>
    </div>
  );
}