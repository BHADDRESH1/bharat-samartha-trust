// @/data/studyPlanData.ts
export interface StudyPlanStep {
    id: string;
    title: string;
    description: string;
    tips: string[];
    resources: {
      title: string;
      link: string;
    }[];
    icon: string;
  }
  
  export const studyPlanSteps: StudyPlanStep[] = [
    {
      id: 'step-1',
      title: 'Understanding the Syllabus & Exam Pattern',
      description: 'The first step is to thoroughly understand what you\'re preparing for. Study the official syllabus, exam pattern, marking scheme, and past trends.',
      tips: [
        'Download the official notification and read it completely',
        'Make a checklist of all topics mentioned in the syllabus',
        'Analyze previous year question papers to understand the pattern',
        'Create a topic-wise weightage chart to prioritize your studies'
      ],
      resources: [
        {
          title: 'Official Exam Websites',
          link: '#exam-websites'
        },
        {
          title: 'Previous Year Analysis',
          link: '#previous-year-analysis'
        },
        {
          title: 'Syllabus Breakdown Videos',
          link: '#syllabus-videos'
        }
      ],
      icon: 'BookOpen'
    },
    {
      id: 'step-2',
      title: 'Creating a Personalized Study Plan',
      description: 'Develop a realistic and structured study plan that fits your schedule and learning style. Set daily, weekly, and monthly goals.',
      tips: [
        'Assess your strengths and weaknesses first',
        'Allocate more time to difficult subjects',
        'Include revision time in your schedule',
        'Be realistic with your daily targets',
        'Use the Pomodoro technique (25 minutes study + 5 minutes break)'
      ],
      resources: [
        {
          title: 'Study Planner Template',
          link: '#study-planner'
        },
        {
          title: 'Time Management Strategies',
          link: '#time-management'
        },
        {
          title: 'Productivity Apps for Students',
          link: '#productivity-apps'
        }
      ],
      icon: 'Calendar'
    },
    {
      id: 'step-3',
      title: 'Best Books & Online Courses',
      description: 'Select high-quality study materials that are exam-oriented and comprehensive. Don\'t overwhelm yourself with too many resources.',
      tips: [
        'Stick to standard books recommended by toppers',
        'Use online courses for difficult concepts',
        'Make your own notes while studying',
        'Supplement with YouTube tutorials for complex topics',
        'Join a test series for regular practice'
      ],
      resources: [
        {
          title: 'Recommended Books List',
          link: '#recommended-books'
        },
        {
          title: 'Top Online Courses',
          link: '#online-courses'
        },
        {
          title: 'Free YouTube Channels',
          link: '#youtube-channels'
        }
      ],
      icon: 'BookMarked'
    },
    {
      id: 'step-4',
      title: 'Daily Current Affairs & Static GK',
      description: 'Staying updated with current events is crucial for most competitive exams. Develop a daily habit of reading newspapers and magazines.',
      tips: [
        'Read one good newspaper daily (The Hindu/Indian Express)',
        'Make monthly compilations of important news',
        'Connect current affairs with static subjects',
        'Follow reputable current affairs websites and apps',
        'Attempt daily quizzes to test your knowledge'
      ],
      resources: [
        {
          title: 'Current Affairs Monthly PDF',
          link: '#current-affairs-pdf'
        },
        {
          title: 'Daily News Analysis',
          link: '#daily-news'
        },
        {
          title: 'Current Affairs Quiz',
          link: '#current-affairs-quiz'
        }
      ],
      icon: 'Newspaper'
    },
    {
      id: 'step-5',
      title: 'Regular Mock Tests & Self-Assessment',
      description: 'Regular testing is vital to gauge your preparation level and identify areas for improvement. Aim for at least one full-length mock test per week.',
      tips: [
        'Join a good test series (online or offline)',
        'Simulate exact exam conditions during practice tests',
        'Analyze your performance after each test',
        'Revise topics where you score less',
        'Track your progress with performance graphs'
      ],
      resources: [
        {
          title: 'Mock Test Series',
          link: '#mock-tests'
        },
        {
          title: 'Performance Analysis Tools',
          link: '#performance-analysis'
        },
        {
          title: 'Subject-wise Practice Tests',
          link: '#subject-tests'
        }
      ],
      icon: 'FileSpreadsheet'
    },
    {
      id: 'step-6',
      title: 'Time Management & Stress-Free Learning',
      description: 'Develop effective time management skills and stress management techniques to maintain mental well-being during preparation.',
      tips: [
        'Use the 80/20 principle - focus on high-yield topics',
        'Practice meditation and breathing exercises',
        'Maintain a healthy diet and exercise routine',
        'Get adequate sleep (7-8 hours daily)',
        'Take short breaks and avoid burnout'
      ],
      resources: [
        {
          title: 'Stress Management Techniques',
          link: '#stress-management'
        },
        {
          title: 'Time Management Strategies',
          link: '#time-strategies'
        },
        {
          title: 'Meditation for Students',
          link: '#meditation'
        }
      ],
      icon: 'Clock'
    },
    {
      id: 'step-7',
      title: 'Interview & Personality Development',
      description: 'For exams with an interview component, develop your communication skills, general awareness, and personality traits.',
      tips: [
        'Read extensively on diverse topics',
        'Practice mock interviews with friends or mentors',
        'Develop informed opinions on current issues',
        'Work on your body language and communication',
        'Prepare for common interview questions'
      ],
      resources: [
        {
          title: 'Interview Preparation Guide',
          link: '#interview-guide'
        },
        {
          title: 'Common Questions & Answers',
          link: '#interview-questions'
        },
        {
          title: 'Personality Development Tips',
          link: '#personality-development'
        }
      ],
      icon: 'Users'
    }
  ];