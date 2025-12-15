# Testing Checklist - Hydration & Fetch Error Fixes

## Before Running Tests
- [ ] Backend is running: `node server.js` on port 5000
- [ ] Frontend is running: `npm run dev` on port 3000
- [ ] Both .env files are configured correctly
- [ ] DevTools console is open

## Test 1: Hydration Errors (FIXED)
**File**: `ParticleBackground.tsx`

Steps:
1. Open http://localhost:3000 in browser
2. Open DevTools → Console tab
3. Look for "Hydration failed" messages - SHOULD BE NONE
4. Particles animation should render smoothly

Expected: ✅ No hydration warnings, smooth particle animations

---

## Test 2: Fetch Timeout Protection (NEW safeFetch)
**File**: `src/lib/fetchUtils.ts`

Steps:
1. Stop backend server (`Ctrl+C`)
2. Refresh http://localhost:3000
3. Wait for pages to load
4. After 10 seconds, pages should display fallback UI
5. Look for "Service unavailable" message
6. Click "Try Again" button - should show retry UI

Expected: ✅ Graceful error handling, no page crashes, retry works

---

## Test 3: Successful Data Loading (NORMAL FLOW)
**File**: All `/api/*` endpoints

Steps:
1. Start backend server again
2. Refresh http://localhost:3000
3. Wait for data to load
4. Check DevTools Network tab - all `http://localhost:5000/api/*` calls succeed
5. Verify data displays on page

Expected: ✅ All data loads, no errors, proper rendering

---

## Test 4: Components with Fixed Fetches

**Home Page Components**:
- [ ] CallToAction - Check if it loads or shows fallback
- [ ] ImpactSection - Verify impact data displays
- [ ] StatsSection - Check statistics load
- [ ] FeaturedCauses - Causes should display
- [ ] HeroSection - Hero content visible
- [ ] EventsSection - Events load correctly
- [ ] DailyActivitiesSection - Activities show
- [ ] VolunteerOpportunities - Volunteer data displays

**About Page Components**:
- [ ] TeamSection - Team members display
- [ ] CallToAction - CTA renders correctly

---

## Test 5: Error UI Consistency (FetchErrorFallback)
**File**: `src/lib/fetchUtils.ts` → `FetchErrorFallback`

Steps:
1. Stop backend again
2. Refresh pages and navigate to multiple sections
3. All error states should show consistent UI:
   - Gray box with error icon
   - Friendly error message
   - "Try Again" button

Expected: ✅ Consistent error UI across all pages

---

## Test 6: Network Request Monitoring

Steps:
1. Open DevTools → Network tab
2. Filter by `fetch`
3. Refresh page
4. Observe all requests to `http://localhost:5000/api/*`
5. Check response times and status codes

Expected: ✅ All requests show 200/OK or appropriate error codes

---

## Common Issues & Fixes

### Issue: "Cannot find module '@/lib/fetchUtils'"
**Fix**: Ensure file exists: `src/lib/fetchUtils.ts`

### Issue: Hydration failed still appearing
**Fix**: Check `ParticleBackground.tsx` has `isClient` state check

### Issue: Pages show errors instead of fallback UI
**Fix**: Verify safeFetch import is present and fetch calls use `/api/...` paths

### Issue: Backend shows CORS errors
**Fix**: Check `app.js` has CORS middleware configured for `localhost:3000`

### Issue: "Service unavailable" shows even when backend is running
**Fix**: Check PORT in `.env` matches 5000, check MongoDB connection

---

## Performance Metrics

**Before Fixes**:
- Hydration errors: YES
- Fetch timeouts: ~30 seconds (browser default)
- Network failures: Page crashes

**After Fixes**:
- Hydration errors: ZERO
- Fetch timeouts: 10 seconds (configurable)
- Network failures: Graceful fallback UI

---

## Quick Start Commands

### Terminal 1 - Backend
```bash
cd new-trustback-main
npm install
node server.js
```

### Terminal 2 - Frontend
```bash
cd new-trust-main
npm install
npm run dev
```

### Browser
Open http://localhost:3000 and test above scenarios

---

## Files to Monitor

In DevTools Console, you should see (but no errors):
```
[fetchUtils] Fetching /api/...
[fetchUtils] Response: { success: true, data: {...} }
```

If you see fetch errors, they should look like:
```
[fetchUtils] Error: Failed to connect to server
[fetchUtils] Returning fallback UI
```

**NOT**:
```
Hydration failed
Fetch error: fetch is not defined
Cannot read property 'json' of undefined
```

---

## Success Criteria

All tests PASS when:
1. ✅ Zero hydration errors in console
2. ✅ No "fetch is not defined" errors
3. ✅ Network errors show user-friendly UI
4. ✅ Retry buttons work
5. ✅ Data loads when backend is available
6. ✅ App doesn't crash when backend is down
7. ✅ All page sections display correctly
