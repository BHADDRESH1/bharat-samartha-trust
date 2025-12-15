// @/data/examData.ts
export interface ExamType {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    eligibility: string;
    pattern: string;
    syllabus: string[];
    jobOpportunities: string[];
    logo: string;
    color: string;
    officialWebsite: string;
    notificationDate: string;
    examDate: string;
  }
  
  export const examData: ExamType[] = [
    {
      id: 'upsc-cse',
      title: 'UPSC Civil Services',
      shortDescription: "India's most prestigious civil services exam",
      fullDescription: "The Civil Services Examination (CSE) is a nationwide competitive examination conducted by the Union Public Service Commission (UPSC) for recruitment to various Civil Services of the Government of India, including the Indian Administrative Service (IAS), Indian Foreign Service (IFS), Indian Police Service (IPS), among others.",
      eligibility: "Citizens of India, between 21-32 years (with relaxation for reserved categories), must hold a bachelor's degree from a recognized university.",
      pattern: "Three-stage process: Prelims (objective), Mains (written), and Interview (personality test).",
      syllabus: [
        "General Studies (History, Geography, Polity, Economy, Environment, Science & Tech)",
        "Current Affairs",
        "Aptitude & Reasoning",
        "Optional Subject (one subject of candidate's choice)"
      ],
      jobOpportunities: [
        "Indian Administrative Service (IAS)",
        "Indian Police Service (IPS)",
        "Indian Foreign Service (IFS)",
        "Indian Revenue Service (IRS)",
        "Indian Audit and Accounts Service (IA&AS)"
      ],
      logo: "/images/exams/upsc-logo.png",
      color: "#2563eb",
      officialWebsite: "https://upsc.gov.in/",
      notificationDate: "February 2025",
      examDate: "June 2025"
    },
    {
      id: 'ssc-cgl',
      title: 'SSC CGL',
      shortDescription: "Combined Graduate Level exam for various government posts",
      fullDescription: "The Staff Selection Commission - Combined Graduate Level Examination is conducted for recruitment to various Group 'B' and Group 'C' posts in different Ministries/Departments/Organizations of the Government of India.",
      eligibility: "Indian citizens, 18-32 years (relaxation as per government norms), with a bachelor's degree in any discipline.",
      pattern: "Four-tier system: Tier-I (Computer Based), Tier-II (Computer Based), Tier-III (Descriptive Paper), and Tier-IV (Computer Proficiency/Skill Test/Document Verification).",
      syllabus: [
        "General Intelligence & Reasoning",
        "General Awareness",
        "Quantitative Aptitude",
        "English Comprehension",
        "Statistics (for some posts)",
        "Computer Knowledge"
      ],
      jobOpportunities: [
        "Assistant Audit Officer",
        "Assistant Section Officer",
        "Inspector (Income Tax/Central Excise/Customs)",
        "Assistant/Superintendent",
        "Statistical Investigator"
      ],
      logo: "/images/exams/ssc-logo.png",
      color: "#059669",
      officialWebsite: "https://ssc.nic.in/",
      notificationDate: "December 2024",
      examDate: "April 2025"
    },
    {
      id: 'ibps-po',
      title: 'IBPS PO',
      shortDescription: "Probationary Officer exam for public sector banks",
      fullDescription: "The Institute of Banking Personnel Selection conducts the Probationary Officer examination for recruitment of POs in various participating public sector banks across India.",
      eligibility: "Indian citizens, 20-30 years (relaxation as per norms), with a bachelor's degree in any discipline.",
      pattern: "Three-stage process: Prelims (objective), Mains (objective + descriptive), and Interview.",
      syllabus: [
        "English Language",
        "Quantitative Aptitude",
        "Reasoning Ability",
        "General Awareness (with special reference to Banking Industry)",
        "Computer Knowledge"
      ],
      jobOpportunities: [
        "Probationary Officer in various public sector banks",
        "Career progression to Senior Management positions in banking"
      ],
      logo: "/images/exams/ibps-logo.png",
      color: "#d97706",
      officialWebsite: "https://www.ibps.in/",
      notificationDate: "January 2025",
      examDate: "May 2025"
    },
    {
      id: 'rrb-ntpc',
      title: 'RRB NTPC',
      shortDescription: "Non-Technical Popular Categories exam for railway jobs",
      fullDescription: "The Railway Recruitment Board conducts the Non-Technical Popular Categories exam for various non-technical posts in Indian Railways.",
      eligibility: "Indian citizens, 18-33 years (relaxation as per norms), with a bachelor's degree or 12th pass (depending on the post).",
      pattern: "Multi-stage process: Computer Based Test (CBT) 1 & 2, followed by Skill Test/Typing Test (where applicable) and Document Verification.",
      syllabus: [
        "General Awareness",
        "Mathematics",
        "General Intelligence & Reasoning",
        "General Science"
      ],
      jobOpportunities: [
        "Station Master",
        "Commercial Apprentice",
        "Traffic Apprentice",
        "Goods Guard",
        "Junior Clerk cum Typist",
        "Accounts Clerk cum Typist",
        "Junior Time Keeper"
      ],
      logo: "/images/exams/rrb-logo.png",
      color: "#dc2626",
      officialWebsite: "https://rrbapply.gov.in/",
      notificationDate: "March 2025",
      examDate: "July 2025"
    },
    {
      id: 'state-psc',
      title: 'State PSC Exams',
      shortDescription: "State-level civil services and administrative exams",
      fullDescription: "Various State Public Service Commissions conduct exams for recruitment to administrative and civil services posts within their respective states.",
      eligibility: "Varies by state, typically requires citizenship, age between 21-32 years (with relaxations), and a bachelor's degree.",
      pattern: "Usually multi-stage: Preliminary Exam, Main Exam, and Interview/Personality Test.",
      syllabus: [
        "State-specific GK & Current Affairs",
        "General Studies",
        "Aptitude & Reasoning",
        "Language Papers (State Official Language & English)"
      ],
      jobOpportunities: [
        "State Administrative Service",
        "State Police Service",
        "State Tax Officer",
        "Block Development Officer",
        "State Finance Service"
      ],
      logo: "/images/exams/state-psc-logo.png",
      color: "#7c3aed",
      officialWebsite: "Varies by state",
      notificationDate: "Various dates",
      examDate: "Various dates"
    },
    {
      id: 'nda',
      title: 'NDA Exam',
      shortDescription: "National Defence Academy entrance for armed forces",
      fullDescription: "The National Defence Academy Examination is conducted by UPSC for admission to the Army, Navy and Air Force wings of the National Defence Academy.",
      eligibility: "Unmarried male candidates, 16.5-19.5 years, who have passed 12th class or equivalent.",
      pattern: "Two-stage process: Written Exam (Mathematics & General Ability Test) followed by SSB Interview.",
      syllabus: [
        "Mathematics (up to 12th standard)",
        "General Ability Test (Physics, Chemistry, General Science, History, Geography, Current Events)",
        "English"
      ],
      jobOpportunities: [
        "Commission in Indian Army",
        "Commission in Indian Navy",
        "Commission in Indian Air Force"
      ],
      logo: "/images/exams/nda-logo.png",
      color: "#0f766e",
      officialWebsite: "https://upsc.gov.in/",
      notificationDate: "December 2024",
      examDate: "April 2025"
    },
    {
      id: 'ctet',
      title: 'CTET',
      shortDescription: "Central Teacher Eligibility Test for teaching positions",
      fullDescription: "The Central Teacher Eligibility Test is conducted by CBSE for determining eligibility for appointment as a teacher for Classes I to VIII in central government schools.",
      eligibility: "Indian citizens with B.Ed. or equivalent qualification, or final year students of B.Ed.",
      pattern: "Paper I (for Classes I to V) and Paper II (for Classes VI to VIII), multiple-choice questions.",
      syllabus: [
        "Child Development & Pedagogy",
        "Language I & II",
        "Mathematics (for Paper I) / Mathematics and Science (for Paper II)",
        "Environmental Studies (for Paper I) / Social Studies (for Paper II)"
      ],
      jobOpportunities: [
        "Primary Teacher (Classes I-V)",
        "Upper Primary/Middle School Teacher (Classes VI-VIII)",
        "Opportunities in KVS, NVS, and other central government schools"
      ],
      logo: "/images/exams/ctet-logo.png",
      color: "#db2777",
      officialWebsite: "https://ctet.nic.in/",
      notificationDate: "January 2025",
      examDate: "May 2025"
    },
    {
      id: 'gate',
      title: 'GATE',
      shortDescription: "Graduate Aptitude Test in Engineering for higher studies and PSUs",
      fullDescription: "The Graduate Aptitude Test in Engineering is conducted for admission to postgraduate programs in engineering/technology/architecture and for recruitment in PSUs.",
      eligibility: "Bachelor's degree holders in Engineering/Technology/Architecture/Science (4 years after 10+2)/those in final year.",
      pattern: "Computer-based test with multiple-choice questions, multiple select questions, and numerical answer type questions.",
      syllabus: [
        "General Aptitude",
        "Subject-specific knowledge (27 papers to choose from)",
        "Engineering Mathematics",
        "Core discipline subjects"
      ],
      jobOpportunities: [
        "M.Tech/M.E. admission in IITs, NITs, and other institutions",
        "Recruitment in PSUs like BHEL, IOCL, NTPC, BARC, etc.",
        "Research positions in government organizations"
      ],
      logo: "/images/exams/gate-logo.png",
      color: "#4f46e5",
      officialWebsite: "https://gate.iitk.ac.in/",
      notificationDate: "February 2025",
      examDate: "June 2025"
    }
  ];