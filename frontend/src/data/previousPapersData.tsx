export interface PaperCategory {
    id: number;
    name: string;
    papers: Paper[];
  }
  
  export interface Paper {
    id: number;
    year: string;
    title: string;
    downloadUrl: string;
    solutionUrl: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questionCount: number;
  }
  
  export interface PreviousPapersData {
    categories: PaperCategory[];
  }
  
  export const previousPapersData: PreviousPapersData = {
    categories: [
      {
        id: 1,
        name: "UPSC Civil Services",
        papers: [
          {
            id: 101,
            year: "2024",
            title: "UPSC Civil Services Preliminary Examination 2024 (GS Paper I)",
            downloadUrl: "/downloads/papers/upsc-cse-prelims-2024-gs1.pdf",
            solutionUrl: "/downloads/solutions/upsc-cse-prelims-2024-gs1-solution.pdf",
            difficulty: "Hard",
            questionCount: 100
          },
          {
            id: 102,
            year: "2024",
            title: "UPSC Civil Services Preliminary Examination 2024 (CSAT Paper II)",
            downloadUrl: "/downloads/papers/upsc-cse-prelims-2024-csat.pdf",
            solutionUrl: "/downloads/solutions/upsc-cse-prelims-2024-csat-solution.pdf",
            difficulty: "Medium",
            questionCount: 80
          },
          {
            id: 103,
            year: "2023",
            title: "UPSC Civil Services Preliminary Examination 2023 (GS Paper I)",
            downloadUrl: "/downloads/papers/upsc-cse-prelims-2023-gs1.pdf",
            solutionUrl: "/downloads/solutions/upsc-cse-prelims-2023-gs1-solution.pdf",
            difficulty: "Hard",
            questionCount: 100
          },
          {
            id: 104,
            year: "2023",
            title: "UPSC Civil Services Mains 2023 - General Studies Paper I",
            downloadUrl: "/downloads/papers/upsc-cse-mains-2023-gs1.pdf",
            solutionUrl: "/downloads/solutions/upsc-cse-mains-2023-gs1-solution.pdf",
            difficulty: "Hard",
            questionCount: 20
          }
        ]
      },
      {
        id: 2,
        name: "SSC Combined Graduate Level",
        papers: [
          {
            id: 201,
            year: "2024",
            title: "SSC CGL Tier I Examination 2024",
            downloadUrl: "/downloads/papers/ssc-cgl-tier1-2024.pdf",
            solutionUrl: "/downloads/solutions/ssc-cgl-tier1-2024-solution.pdf",
            difficulty: "Medium",
            questionCount: 100
          },
          {
            id: 202,
            year: "2024",
            title: "SSC CGL Tier II Examination 2024 - Paper I (Quantitative Abilities)",
            downloadUrl: "/downloads/papers/ssc-cgl-tier2-paper1-2024.pdf",
            solutionUrl: "/downloads/solutions/ssc-cgl-tier2-paper1-2024-solution.pdf",
            difficulty: "Hard",
            questionCount: 100
          },
          {
            id: 203,
            year: "2023",
            title: "SSC CGL Tier I Examination 2023",
            downloadUrl: "/downloads/papers/ssc-cgl-tier1-2023.pdf",
            solutionUrl: "/downloads/solutions/ssc-cgl-tier1-2023-solution.pdf",
            difficulty: "Medium",
            questionCount: 100
          }
        ]
      },
      {
        id: 3,
        name: "Banking Examinations",
        papers: [
          {
            id: 301,
            year: "2024",
            title: "IBPS PO Preliminary Examination 2024",
            downloadUrl: "/downloads/papers/ibps-po-prelims-2024.pdf",
            solutionUrl: "/downloads/solutions/ibps-po-prelims-2024-solution.pdf",
            difficulty: "Medium",
            questionCount: 100
          },
          {
            id: 302,
            year: "2024",
            title: "SBI PO Preliminary Examination 2024",
            downloadUrl: "/downloads/papers/sbi-po-prelims-2024.pdf",
            solutionUrl: "/downloads/solutions/sbi-po-prelims-2024-solution.pdf",
            difficulty: "Medium",
            questionCount: 100
          },
          {
            id: 303,
            year: "2023",
            title: "RBI Grade B Phase I Examination 2023",
            downloadUrl: "/downloads/papers/rbi-grade-b-phase1-2023.pdf",
            solutionUrl: "/downloads/solutions/rbi-grade-b-phase1-2023-solution.pdf",
            difficulty: "Hard",
            questionCount: 120
          }
        ]
      },
      {
        id: 4,
        name: "Railway Recruitment",
        papers: [
          {
            id: 401,
            year: "2024",
            title: "RRB NTPC CBT-1 Examination 2024",
            downloadUrl: "/downloads/papers/rrb-ntpc-cbt1-2024.pdf",
            solutionUrl: "/downloads/solutions/rrb-ntpc-cbt1-2024-solution.pdf",
            difficulty: "Easy",
            questionCount: 100
          },
          {
            id: 402,
            year: "2023",
            title: "RRB Group D Examination 2023",
            downloadUrl: "/downloads/papers/rrb-group-d-2023.pdf",
            solutionUrl: "/downloads/solutions/rrb-group-d-2023-solution.pdf",
            difficulty: "Easy",
            questionCount: 100
          }
        ]
      }
    ]
  };