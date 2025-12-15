export interface Topper {
    id: number;
    name: string;
    exam: string;
    rank: string;
    year: string;
    imageUrl: string;
    qualification: string;
    attempts: number;
    quote: string;
    keyStrategies: string[];
    recommendedBooks: string[];
    interviewUrl?: string;
    videoUrl?: string;
    storyContent: string;
  }
  
  export const toppersData: Topper[] = [
    {
      id: 1,
      name: "Shruti Sharma",
      exam: "UPSC Civil Services",
      rank: "AIR 1",
      year: "2024",
      imageUrl: "/images/toppers/shruti-sharma.jpg",
      qualification: "History Graduate from Delhi University",
      attempts: 2,
      quote: "Consistency is more important than intensity. Study for 6-7 hours daily rather than 15 hours occasionally.",
      keyStrategies: [
        "Made short notes for revision",
        "Focused on NCERT books thoroughly",
        "Daily newspaper reading with note-making",
        "Weekly revision of current affairs",
        "At least 2 mock tests every week"
      ],
      recommendedBooks: [
        "Indian Polity by M. Laxmikanth",
        "Indian Economy by Ramesh Singh",
        "India's Struggle for Independence by Bipan Chandra",
        "Certificate Physical Geography by GC Leong"
      ],
      interviewUrl: "/interviews/shruti-sharma-upsc-2024.pdf",
      videoUrl: "https://www.youtube.com/watch?v=example1",
      storyContent: "Shruti Sharma topped the UPSC CSE 2024 with a well-structured study approach. Coming from a middle-class family in Delhi, she completed her graduation in History from Delhi University before dedicating herself to UPSC preparation. She believes in quality study rather than quantity, focusing on understanding concepts rather than rote learning. Her daily routine included 6-7 hours of dedicated study, newspaper reading, and revision. She cleared the exam in her second attempt, improving significantly from her previous rank of 235. Her success mantra was consistent revision and regular mock tests to improve answer writing skills."
    },
    {
      id: 2,
      name: "Rohit Sharma",
      exam: "SSC CGL",
      rank: "AIR 1",
      year: "2024",
      imageUrl: "/images/toppers/rohit-sharma.jpg",
      qualification: "B.Tech in Computer Science",
      attempts: 1,
      quote: "Focus on your weaknesses while maintaining your strengths. Time management is crucial.",
      keyStrategies: [
        "Created subject-wise timetable",
        "Practiced 200+ questions daily",
        "Used online learning platforms",
        "Focused heavily on previous year papers",
        "Created formulas and shortcut techniques"
      ],
      recommendedBooks: [
        "Quantitative Aptitude by R.S. Aggarwal",
        "Fast Track Objective Arithmetic by Rajesh Verma",
        "Word Power Made Easy by Norman Lewis",
        "Lucent's General Knowledge"
      ],
      videoUrl: "https://www.youtube.com/watch?v=example2",
      storyContent: "Rohit Sharma, a computer science graduate from NIT Warangal, secured All India Rank 1 in SSC CGL 2024 in his very first attempt. His engineering background gave him an edge in the quantitative and reasoning sections. He followed a disciplined approach, dedicating 8-10 hours daily to preparation. Rohit's unique study technique involved creating mind maps and flow charts for complex topics, which helped him retain information better. He emphasized the importance of solving previous year papers to understand the exam pattern and regularly timed himself to improve speed. His success proves that with the right strategy and dedicated effort, even first-time aspirants can achieve top ranks."
    },
    {
      id: 3,
      name: "Priya Patel",
      exam: "IBPS PO",
      rank: "AIR 1",
      year: "2024",
      imageUrl: "/images/toppers/priya-patel.jpg",
      qualification: "MBA in Finance",
      attempts: 2,
      quote: "Banking exams test your speed and accuracy. Practice is the only way to excel.",
      keyStrategies: [
        "Solved 50 puzzles daily",
        "Practiced speed calculations",
        "Read financial newspapers",
        "Created banking awareness notes",
        "Practiced descriptive writing daily"
      ],
      recommendedBooks: [
        "Banking Awareness by Arihant Publications",
        "Quantitative Aptitude For Competitive Examinations by R.S. Aggarwal",
        "A Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal",
        "Objective General English by S.P. Bakshi"
      ],
      interviewUrl: "/interviews/priya-patel-ibps-2024.pdf",
      storyContent: "Priya Patel topped the IBPS PO examination in 2024 with her focused preparation strategy. With an MBA in Finance from Symbiosis, Pune, she had a strong foundation in banking concepts. After an unsuccessful first attempt where she missed the cutoff by just 2 marks, she analyzed her weaknesses and created a structured study plan. She focused heavily on improving her speed in the reasoning and quantitative sections, solving at least 50 puzzles daily. For banking awareness, she made concise notes from financial newspapers and magazines. Her advice to aspirants is to maintain a separate notebook for formulas and shortcuts, which helped her save crucial time during the exam."
    },
    {
      id: 4,
      name: "Amit Kumar",
      exam: "RRB NTPC",
      rank: "AIR 1",
      year: "2023",
      imageUrl: "/images/toppers/amit-kumar.jpg",
      qualification: "B.Sc. Mathematics",
      attempts: 1,
      quote: "Railway exams require thorough knowledge of basics and excellent speed. Focus on accuracy.",
      keyStrategies: [
        "Practiced 5 mock tests weekly",
        "Created quick revision notes",
        "Focused on math shortcuts",
        "Memorized important GK facts",
        "Improved typing speed for CBT"
      ],
      recommendedBooks: [
        "Mathematics for Railway Exams by Kiran Publications",
        "Lucent's General Knowledge",
        "Reasoning and General Intelligence by Kiran Publications",
        "Platform Magazine for Current Affairs"
      ],
      videoUrl: "https://www.youtube.com/watch?v=example4",
      storyContent: "Amit Kumar, a mathematics graduate from Patna University, secured the top position in RRB NTPC 2023 examination. Coming from a small town in Bihar, Amit's journey is truly inspiring. He prepared for the exam while working part-time as a tutor. His strong foundation in mathematics gave him an advantage, but he worked extra hard on general awareness and reasoning sections. Amit's preparation strategy focused on speed and accuracy, practicing at least 5 full-length mock tests every week. He believes that regular revision of the basics and staying updated with current affairs were key to his success. His advice to railway exam aspirants is to focus on improving calculation speed and practicing previous year papers extensively."
    }
  ];