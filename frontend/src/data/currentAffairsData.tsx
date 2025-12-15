export interface CurrentAffairsItem {
    id: number;
    date: string;
    title: string;
    category: string;
    summary: string;
    tags: string[];
    imageUrl: string;
  }
  
  export interface DailyQuizItem {
    id: number;
    date: string;
    title: string;
    questionsCount: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }
  
  export interface MockTestItem {
    id: number;
    examType: string;
    title: string;
    duration: string;
    questionsCount: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }
  
  export interface CurrentAffairsData {
    dailyUpdates: CurrentAffairsItem[];
    weeklyCompilations: {
      id: number;
      week: string;
      title: string;
      downloadUrl: string;
    }[];
    dailyQuizzes: DailyQuizItem[];
    mockTests: MockTestItem[];
    upcomingExams: {
      id: number;
      examName: string;
      examDate: string;
      registrationLastDate: string;
      examLevel: string;
    }[];
  }
  
  export const currentAffairsData: CurrentAffairsData = {
    dailyUpdates: [
      {
        id: 1,
        date: "2025-03-20",
        title: "India Launches Satellite to Monitor Ocean Climate Change",
        category: "Science & Technology",
        summary: "ISRO successfully launched OCEANSAT-3B satellite to monitor ocean temperatures and climate patterns, enhancing weather prediction capabilities.",
        tags: ["ISRO", "Satellite", "Climate Change", "Ocean Monitoring"],
        imageUrl: "/images/ca-oceansat.jpg"
      },
      {
        id: 2,
        date: "2025-03-20",
        title: "New Constitutional Amendment Bill Passed in Parliament",
        category: "Polity & Governance",
        summary: "Parliament passed the 130th Constitutional Amendment Bill to enhance powers of local governments and improve grassroots governance.",
        tags: ["Parliament", "Constitution", "Local Government", "Governance"],
        imageUrl: "/images/ca-parliament.jpg"
      },
      {
        id: 3,
        date: "2025-03-19",
        title: "India Signs Trade Agreement with ASEAN Countries",
        category: "Economy & International Relations",
        summary: "India finalized a new comprehensive economic partnership agreement with ASEAN nations to boost trade and investment opportunities.",
        tags: ["Trade", "ASEAN", "Economy", "International Relations"],
        imageUrl: "/images/ca-trade.jpg"
      },
      {
        id: 4,
        date: "2025-03-19",
        title: "Supreme Court Ruling on Digital Privacy Rights",
        category: "Legal Affairs",
        summary: "Supreme Court delivered landmark judgment defining extent of digital privacy rights and data protection obligations for companies.",
        tags: ["Supreme Court", "Privacy", "Digital Rights", "Legal"],
        imageUrl: "/images/ca-privacy.jpg"
      },
      {
        id: 5,
        date: "2025-03-18",
        title: "National Agriculture Policy 2025 Announced",
        category: "Agriculture & Rural",
        summary: "Government unveiled new agriculture policy focusing on sustainable farming, modernization and doubling farmer income by 2030.",
        tags: ["Agriculture", "Policy", "Sustainability", "Farmer Welfare"],
        imageUrl: "/images/ca-agriculture.jpg"
      }
    ],
    weeklyCompilations: [
      {
        id: 1,
        week: "March 14-20, 2025",
        title: "Weekly Current Affairs Compilation - March 3rd Week",
        downloadUrl: "/downloads/ca-mar-week3-2025.pdf"
      },
      {
        id: 2,
        week: "March 7-13, 2025",
        title: "Weekly Current Affairs Compilation - March 2nd Week",
        downloadUrl: "/downloads/ca-mar-week2-2025.pdf"
      },
      {
        id: 3,
        week: "Feb 28-March 6, 2025",
        title: "Weekly Current Affairs Compilation - March 1st Week",
        downloadUrl: "/downloads/ca-mar-week1-2025.pdf"
      }
    ],
    dailyQuizzes: [
      {
        id: 1,
        date: "2025-03-20",
        title: "Daily Current Affairs Quiz - March 20",
        questionsCount: 15,
        difficulty: "Medium"
      },
      {
        id: 2,
        date: "2025-03-19",
        title: "Daily Current Affairs Quiz - March 19",
        questionsCount: 15,
        difficulty: "Easy"
      },
      {
        id: 3,
        date: "2025-03-18",
        title: "Daily Current Affairs Quiz - March 18",
        questionsCount: 15,
        difficulty: "Hard"
      }
    ],
    mockTests: [
      {
        id: 1,
        examType: "UPSC",
        title: "UPSC CSE Prelims Full Mock Test - Series 1",
        duration: "2 hours",
        questionsCount: 100,
        difficulty: "Hard"
      },
      {
        id: 2,
        examType: "SSC",
        title: "SSC CGL Tier 1 Mock Test - Series 3",
        duration: "1 hour",
        questionsCount: 100,
        difficulty: "Medium"
      },
      {
        id: 3,
        examType: "Banking",
        title: "IBPS PO Prelims Mock Test - Series 2",
        duration: "1 hour",
        questionsCount: 100,
        difficulty: "Medium"
      }
    ],
    upcomingExams: [
      {
        id: 1,
        examName: "UPSC CSE Prelims 2025",
        examDate: "2025-06-01",
        registrationLastDate: "2025-03-30",
        examLevel: "National"
      },
      {
        id: 2,
        examName: "SSC CGL Tier 1 2025",
        examDate: "2025-05-15",
        registrationLastDate: "2025-04-10",
        examLevel: "National"
      },
      {
        id: 3,
        examName: "IBPS PO Prelims 2025",
        examDate: "2025-08-05",
        registrationLastDate: "2025-07-15",
        examLevel: "National"
      }
    ]
  };