/**
 * MIGRATION SUMMARY: Fixing Hydration and Fetch Errors
 * 
 * Fix #1: ParticleBackground Hydration Error - COMPLETED
 * - Added `isClient` state with useEffect
 * - Math.random() and Date.now() now only execute in useEffect (client-side)
 * - Prevents server/client mismatch
 * 
 * Fix #2: Network Error Handling - IN PROGRESS
 * 
 * All fetch calls must follow this pattern:
 * 
 * BEFORE (Error-prone):
 * ```tsx
 * import fetch from '...';
 * const response = await fetch('http://localhost:5000/api/endpoint');
 * if (!response.ok) throw new Error('Failed');
 * const data = await response.json();
 * setData(data);
 * ```
 * 
 * AFTER (Safe):
 * ```tsx
 * import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';
 * const result = await safeFetch('/api/endpoint');
 * if (result.success && result.data) {
 *   setData(result.data);
 * } else {
 *   setError(result.error);
 * }
 * ```
 * 
 * Error UI Pattern:
 * BEFORE: Manual error display
 * AFTER: <FetchErrorFallback message={error} onRetry={() => window.location.reload()} />
 * 
 * COMPLETED COMPONENTS (safeFetch implemented):
 * ✅ src/lib/fetchUtils.ts (created with retry logic, timeouts, error handling)
 * ✅ src/components/ui/ParticleBackground.tsx (hydration fix)
 * ✅ src/components/home/CallToAction.tsx
 * ✅ src/components/home/ImpactSection.tsx
 * ✅ src/components/home/StatsSection.tsx
 * ✅ src/components/home/FeaturedCauses.tsx
 * ✅ src/components/home/HeroSection.tsx
 * ✅ src/components/home/EventsSection.tsx
 * ✅ src/components/home/DailyActivitiesSection.tsx
 * ✅ src/components/home/VolunteerOpportunities.tsx
 * 
 * REMAINING TO FIX (37 files):
 * Volunteers: WhyVolunteerSection, VolunteerRolesSection, TrustSection, TestimonialsSection, ImpactTrackerSection, HeroSection, FAQSection
 * Legal: LawFinder, PropertyLawSection, LegalRightsSection, LegalAidSection
 * Gallery: GalleryHero
 * Donate: ThankYouModal, TestimonialSection, ImpactMeter, HeroBanner
 * Events: EventHeroBanner
 * Causes: ImpactStats, HeroBanner, BeforeAfterSlider
 * Exams: CallToAction, ExamOverview, HeroSection, StudyPlan, PreviousYearPapers, StudyMaterials, AdditionalFeatures
 * About: TeamSection, WhyChooseUs, MissionVision, HeroSection, CallToAction
 * 
 * These will use the same safeFetch pattern.
 */
