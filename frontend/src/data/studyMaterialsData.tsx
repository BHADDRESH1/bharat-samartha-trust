// @/data/studyMaterialsData.ts
export interface StudyMaterial {
    id: string;
    title: string;
    category: string;
    subject: string;
    author?: string;
    description: string;
    thumbnail: string;
    downloadLink: string;
    fileSize: string;
    format: 'PDF' | 'Video' | 'eBook' | 'Notes';
    popularity: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    recommended: boolean;
    tags: string[];
  }
  
  export const studyMaterials: StudyMaterial[] = [
    {
      id: 'ncert-history-ancient',
      title: 'NCERT Ancient History (Class 6)',
      category: 'NCERT Books',
      subject: 'History',
      author: 'NCERT',
      description: 'Comprehensive coverage of Ancient Indian History with simplified explanations, maps, and illustrations.',
      thumbnail: '/images/study-materials/ncert-history.jpg',
      downloadLink: '/downloads/ncert-history-class6.pdf',
      fileSize: '12.5 MB',
      format: 'PDF',
      popularity: 4.8,
      difficulty: 'Beginner',
      recommended: true,
      tags: ['UPSC', 'History', 'Ancient India', 'NCERT', 'Foundation']
    },
    {
      id: 'indian-polity-laxmikanth',
      title: 'Indian Polity by M. Laxmikanth',
      category: 'Standard Books',
      subject: 'Polity',
      author: 'M. Laxmikanth',
      description: 'The bible of Indian Polity for competitive exams with detailed analysis of the Constitution and political system.',
      thumbnail: '/images/study-materials/laxmikanth-polity.jpg',
      downloadLink: '/downloads/laxmikanth-polity-summary.pdf',
      fileSize: '18.7 MB',
      format: 'PDF',
      popularity: 4.9,
      difficulty: 'Intermediate',
      recommended: true,
      tags: ['UPSC', 'SSC', 'State PSC', 'Polity', 'Constitution']
    },
    {
      id: 'indian-economy-ramesh-singh',
      title: 'Indian Economy by Ramesh Singh',
      category: 'Standard Books',
      subject: 'Economy',
      author: 'Ramesh Singh',
      description: 'Comprehensive guide on Indian Economy covering macroeconomics, fiscal policy, monetary policy, and development issues.',
      thumbnail: '/images/study-materials/ramesh-singh-economy.jpg',
      downloadLink: '/downloads/ramesh-singh-economy-notes.pdf',
      fileSize: '22.3 MB',
      format: 'PDF',
      popularity: 4.7,
      difficulty: 'Advanced',
      recommended: true,
      tags: ['Economy', 'UPSC', 'Banking', 'SSC', 'Budget', 'Fiscal Policy']
    },
    {
      id: 'geography-spectrum',
      title: 'Geography - Spectrum Modern India',
      category: 'Standard Books',
      subject: 'Geography',
      author: 'Spectrum Publications',
      description: 'Detailed coverage of Indian Geography with maps, diagrams, and easy-to-understand explanations.',
      thumbnail: '/images/study-materials/spectrum-geography.jpg',
      downloadLink: '/downloads/spectrum-geography.pdf',
      fileSize: '25.1 MB',
      format: 'PDF',
      popularity: 4.6,
      difficulty: 'Intermediate',
      recommended: true,
      tags: ['Geography', 'UPSC', 'SSC', 'Maps', 'Climate', 'Resources']
    },
    {
      id: 'quantitative-aptitude-agarwal',
      title: 'Quantitative Aptitude by R.S. Agarwal',
      category: 'Standard Books',
      subject: 'Mathematics',
      author: 'R.S. Agarwal',
      description: 'Comprehensive guide for mathematical aptitude with thousands of practice questions and shortcuts.',
      thumbnail: '/images/study-materials/rs-agarwal-maths.jpg',
      downloadLink: '/downloads/rs-agarwal-math-shortcuts.pdf',
      fileSize: '15.3 MB',
      format: 'PDF',
      popularity: 4.9,
      difficulty: 'Intermediate',
      recommended: true,
      tags: ['Mathematics', 'Banking', 'SSC', 'Railways', 'Aptitude', 'Shortcuts']
    },
    {
      id: 'gs-mains-toppers-notes',
      title: 'GS Mains - Handwritten Notes (UPSC Topper)',
      category: 'Handwritten Notes',
      subject: 'General Studies',
      author: 'Anudeep Durishetty (AIR 1)',
      description: 'Comprehensive handwritten notes covering all GS papers by UPSC topper with diagrams and mind maps.',
      thumbnail: '/images/study-materials/topper-notes-gs.jpg',
      downloadLink: '/downloads/topper-notes-gs.pdf',
      fileSize: '35.2 MB',
      format: 'Notes',
      popularity: 4.8,
      difficulty: 'Advanced',
      recommended: true,
      tags: ['UPSC', 'Mains', 'General Studies', 'Topper Notes', 'Handwritten']
    },
    {
      id: 'science-lucent',
      title: 'General Science - Lucent',
      category: 'Standard Books',
      subject: 'Science',
      author: 'Lucent Publications',
      description: 'Simplified guide to General Science concepts with diagrams and quick revision points.',
      thumbnail: '/images/study-materials/lucent-science.jpg',
      downloadLink: '/downloads/lucent-science.pdf',
      fileSize: '17.8 MB',
      format: 'PDF',
      popularity: 4.5,
      difficulty: 'Beginner',
      recommended: true,
      tags: ['Science', 'SSC', 'Railways', 'UPSC Prelims', 'Physics', 'Chemistry', 'Biology']
    },
    {
      id: 'reasoning-verbal-nonverbal',
      title: 'Verbal & Non-Verbal Reasoning',
      category: 'Standard Books',
      subject: 'Reasoning',
      author: 'B.S. Sijwali & Indu Sijwali',
      description: 'Comprehensive coverage of all reasoning topics with solved examples and practice questions.',
      thumbnail: '/images/study-materials/verbal-nonverbal-reasoning.jpg',
      downloadLink: '/downloads/reasoning-tricks.pdf',
      fileSize: '14.6 MB',
      format: 'PDF',
      popularity: 4.7,
      difficulty: 'Intermediate',
      recommended: true,
      tags: ['Reasoning', 'SSC', 'Banking', 'Railways', 'Logical Thinking', 'Puzzles']
    },
    {
      id: 'current-affairs-vision-ias',
      title: 'Current Affairs Monthly - Vision IAS',
      category: 'Current Affairs',
      subject: 'General Knowledge',
      author: 'Vision IAS',
      description: 'Monthly compilation of current affairs with analysis and MCQs for practice.',
      thumbnail: '/images/study-materials/vision-current-affairs.jpg',
      downloadLink: '/downloads/vision-ias-feb-2025.pdf',
      fileSize: '10.2 MB',
      format: 'PDF',
      popularity: 4.9,
      difficulty: 'Intermediate',
      recommended: true,
      tags: ['Current Affairs', 'UPSC', 'Banking', 'SSC', 'Monthly Magazine']
    },
    {
      id: 'english-grammar-wren-martin',
      title: 'English Grammar - Wren & Martin',
      category: 'Standard Books',
      subject: 'English',
      author: 'Wren & Martin',
      description: 'Classic guide to English grammar with detailed explanations and practice exercises.',
      thumbnail: '/images/study-materials/wren-martin.jpg',
      downloadLink: '/downloads/wren-martin-summary.pdf',
      fileSize: '16.4 MB',
      format: 'PDF',
      popularity: 4.6,
      difficulty: 'Intermediate',
      recommended: true,
      tags: ['English', 'Grammar', 'Banking', 'SSC', 'UPSC', 'Language']
    },
    {
      id: 'interview-preparation-guide',
      title: 'Interview Preparation Guide',
      category: 'Personality Development',
      subject: 'Interview Skills',
      author: 'Career Experts',
      description: 'Comprehensive guide to crack interviews with practice questions, body language tips, and common mistakes to avoid.',
      thumbnail: '/images/study-materials/interview-guide.jpg',
      downloadLink: '/downloads/interview-preparation.pdf',
      fileSize: '8.7 MB',
      format: 'PDF',
      popularity: 4.5,
      difficulty: 'Intermediate',
      recommended: true,
      tags: ['Interview', 'UPSC', 'Banking', 'Personal Development', 'Communication']
    },
    {
      id: 'video-lectures-geography',
      title: 'Complete Geography Video Lectures',
      category: 'Video Lectures',
      subject: 'Geography',
      author: 'Roman Saini',
      description: 'Comprehensive video course covering Physical, Indian, and World Geography with maps and diagrams.',
      thumbnail: '/images/study-materials/geography-videos.jpg',
      downloadLink: '/courses/geography-complete',
      fileSize: '1.2 GB',
      format: 'Video',
      popularity: 4.8,
      difficulty: 'Intermediate',
      recommended: true,
      tags: ['Geography', 'Video Course', 'UPSC', 'Maps', 'Physical Geography']
    }
  ];