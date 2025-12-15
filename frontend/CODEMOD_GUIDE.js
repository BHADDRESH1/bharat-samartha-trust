#!/usr/bin/env node
/**
 * CODEMOD: Batch Fix for Remaining 37 Components
 * 
 * This script documents all the replacements needed.
 * Each component needs these changes:
 * 
 * 1. ADD IMPORT (if not present):
 *    import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';
 * 
 * 2. REPLACE FETCH CALLS:
 *    OLD: const response = await fetch('http://localhost:5000/api/endpoint');
 *    NEW: const result = await safeFetch('/api/endpoint');
 * 
 * 3. REPLACE ERROR HANDLING:
 *    OLD: if (!response.ok) throw new Error(...);
 *    NEW: if (!result.success || !result.data) setError(result.error);
 * 
 * 4. REPLACE ERROR UI:
 *    OLD: <div className="text-red-600">{error}</div>
 *    NEW: <FetchErrorFallback message={error} onRetry={() => window.location.reload()} />
 */

// COMPONENTS TO FIX (37 total):

const componentsToFix = {
  // About (5)
  'src/components/about/TeamSection.tsx': { endpoint: '/api/team' },
  'src/components/about/HeroSection.tsx': { endpoint: '/api/aboutHero' },
  'src/components/about/WhyChooseUs.tsx': { endpoint: '/api/choose' },
  'src/components/about/MissionVision.tsx': { endpoint: '/api/mission' },
  
  // Volunteers (7)
  'src/components/features/volunteers/WhyVolunteerSection.tsx': { endpoint: '/api/vWhy' },
  'src/components/features/volunteers/VolunteerRolesSection.tsx': { endpoint: '/api/vrole' },
  'src/components/features/volunteers/TrustSection.tsx': { endpoint: '/api/vtrust' },
  'src/components/features/volunteers/TestimonialsSection.tsx': { endpoint: '/api/vtest' },
  'src/components/features/volunteers/ImpactTrackerSection.tsx': { endpoint: '/api/vimpact' },
  'src/components/features/volunteers/HeroSection.tsx': { endpoint: '/api/vhero' },
  'src/components/features/volunteers/FAQSection.tsx': { endpoint: '/api/faq' },
  
  // Legal (4)
  'src/components/features/legal/LawFinder.tsx': { endpoint: '/api/find' },
  'src/components/features/legal/PropertyLawSection.tsx': { endpoint: '/api/property-law/all-data' },
  'src/components/features/legal/LegalRightsSection.tsx': { endpoint: '/api/legalsec/rights' },
  'src/components/features/legal/LegalAidSection.tsx': { endpoint: '/api/aid/all' },
  
  // Gallery (1)
  'src/components/features/gallery/GalleryHero.tsx': { endpoint: '/api/ghero' },
  
  // Donate (4)
  'src/components/features/donate/ThankYouModal.tsx': { endpoint: '/api/dthanks' },
  'src/components/features/donate/TestimonialSection.tsx': { endpoint: '/api/dtest' },
  'src/components/features/donate/ImpactMeter.tsx': { endpoint: '/api/dimpact' },
  'src/components/features/donate/HeroBanner.tsx': { endpoint: '/api/dhero' },
  
  // Events (1)
  'src/components/features/events/EventHeroBanner.tsx': { endpoint: '/api/eventHero' },
  
  // Causes (3)
  'src/components/features/causes/ImpactStats.tsx': { endpoint: '/api/causeImpact' },
  'src/components/features/causes/HeroBanner.tsx': { endpoint: '/api/causeHero' },
  'src/components/features/causes/BeforeAfterSlider.tsx': { endpoint: '/api/transform-projects' },
  
  // Competitive Exams (7)
  'src/components/competitive-exams/CallToAction.tsx': { endpoint: '/api/ecta' },
  'src/components/competitive-exams/ExamOverview.tsx': { endpoint: '/api/eoverview' },
  'src/components/competitive-exams/HeroSection.tsx': { endpoint: '/api/ehero' },
  'src/components/competitive-exams/StudyPlan.tsx': { endpoint: '/api/eplan' },
  'src/components/competitive-exams/PreviousYearPapers.tsx': { endpoint: '/api/epre' },
  'src/components/competitive-exams/StudyMaterials.tsx': { endpoint: '/api/emat' },
  'src/components/competitive-exams/AdditionalFeatures.tsx': { endpoint: '/api/eadd' },
};

console.log(`
CODEMOD: Fix Remaining ${Object.keys(componentsToFix).length} Components

For each file above, make these changes:

1. Add import at top:
   import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

2. Replace pattern:
   FROM: const response = await fetch('http://localhost:5000/api/...');
   TO:   const result = await safeFetch('/api/...');

3. Replace error check:
   FROM: if (!response.ok) throw new Error(...);
   TO:   if (!result.success) { setError(result.error); return; }

4. Replace data extraction:
   FROM: const data = await response.json();
   TO:   const data = result.data;

5. Replace error UI:
   FROM: <p>{error}</p>
   TO:   <FetchErrorFallback message={error} onRetry={() => window.location.reload()} />

All fetch URLs are already hardcoded in the components.
The safeFetch utility will automatically:
- Add 'http://localhost:5000' prefix
- Handle timeout (10 seconds)
- Wrap in try/catch
- Return structured { success, data, error, status }
`);
