'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import HeroSection from '@/components/competitive-exams/HeroSection';
import ExamOverview from '@/components/competitive-exams/ExamOverview';
import StudyPlan from '@/components/competitive-exams/StudyPlan';
import StudyMaterials from '@/components/competitive-exams/StudyMaterials';
import CurrentAffairs from '@/components/competitive-exams/CurrentAffairs';
import PreviousYearPapers from '@/components/competitive-exams/PreviousYearPapers';
import TopperStories from '@/components/competitive-exams/TopperStories';
import DiscussionForum from '@/components/competitive-exams/DiscussionForum';
import AdditionalFeatures from '@/components/competitive-exams/AdditionalFeatures';
import CallToAction from '@/components/competitive-exams/CallToAction';
import ChatbotButton from '@/components/features/ChatbotButton';

// Data
import { examData } from '@/data/examData';
import { studyPlanSteps } from '@/data/studyPlanData';
import { studyMaterials } from '@/data/studyMaterialsData';
import { currentAffairsData } from '@/data/currentAffairsData';
import { previousPapersData } from '@/data/previousPapersData';
import { toppersData } from '@/data/toppersData';

export default function CompetitiveExamsPage() {
  const examOverviewRef = useRef<HTMLDivElement>(null);
  const studyMaterialsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animation for exam cards
    if (examOverviewRef.current) {
      gsap.from('.exam-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: examOverviewRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    // Animation for study materials
    if (studyMaterialsRef.current) {
      gsap.from('.material-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: studyMaterialsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Exams Overview Section */}
      <ExamOverview examData={examData} examOverviewRef={examOverviewRef} />
      
      {/* Study Plan Section */}
      <StudyPlan studyPlanSteps={studyPlanSteps} />
      
      {/* Study Materials Section */}
      <StudyMaterials studyMaterials={studyMaterials} studyMaterialsRef={studyMaterialsRef} />
      
      {/* Current Affairs Section */}
      <CurrentAffairs currentAffairsData={currentAffairsData} />
      
      {/* Previous Year Papers Section */}
      <PreviousYearPapers previousPapersData={previousPapersData} />
      
      {/* Topper's Stories Section */}
      <TopperStories toppersData={toppersData} />
      
      {/* Discussion Forum Section */}
      <DiscussionForum />
      
      {/* Additional Features Section */}
      <AdditionalFeatures />
      
      {/* Call to Action */}
      <CallToAction />
      
      {/* AI Chatbot */}
      <ChatbotButton />
    </main>
  );
}