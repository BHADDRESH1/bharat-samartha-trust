const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path"); 
const app = express();
require("./config/database.js");

// Initialize cache
global.apiCache = new Map();

// Import middleware
const { apiLimiter } = require('./middleware/rateLimiter');
const { handleApplicationError, handleNotFoundError } = require('./middleware/errorHandler');

const aboutCta = require("./routes/about/aboutCta.js");
const ctaRoutes = require("./routes/home/CTARoutes.js");
const statsRoutes = require("./routes/home/statsRoutes.js");
const causesRoutes = require("./routes/home/causesRoutes.js");
const authRoutes = require("./routes/auth/authRoutes.js");
const eventsRoutes = require("./routes/home/eventsRoutes.js");
const activityRoutes = require("./routes/home/activitiesRoutes.js");
const impactRoutes = require("./routes/home/impactRoutes.js");
const volunteerManagementRoutes = require("./routes/home/volunteer.js");
const heroSection = require("./routes/home/heroSection.js");
const testimonial = require("./routes/home/testimonial.js");
const newsletterRoutes = require("./routes/home/newsletter.js");

const eventRoutes = require("./routes/event/eventPage.js");
const eventFilter = require("./routes/event/eventFilter.js");
const eventHero = require("./routes/event/eventHero.js");

const aboutChoose = require("./routes/about/aboutChoose.js");
const timelineRoutes = require("./routes/about/timeline.js");
const mission = require("./routes/about/mission.js");
const aboutHero = require("./routes/about/aboutHero.js");
const teamRoutes = require("./routes/about/aboutTeam.js");

const causeHero = require("./routes/cause/causeHero.js");
const causeImpact = require("./routes/cause/causeImpact.js");
const projectRoutes = require("./routes/cause/projects.js");
const sectionRoutes = require("./routes/cause/sectionSetting.js");
const causecta = require("./routes/cause/causeCta.js");
const causeList = require("./routes/cause/causeList.js");
const news = require("./routes/cause/new.js");

const FAQ = require("./routes/volunteer/vFaq.js");
const vhero = require("./routes/volunteer/vhero.js");
const vimpact = require("./routes/volunteer/vimpact.js");
const vtrust = require("./routes/volunteer/vtrust.js");
const vrole = require("./routes/volunteer/vrole.js");
const vtest = require("./routes/volunteer/vtest.js");
const vWhy = require("./routes/volunteer/vWhy.js");
const vsignup = require("./routes/volunteer/vsignup.js");
const vvolun = require("./routes/volunteer/vvolun.js");

const dhero = require("./routes/donate/dhero.js");
const dimpact = require("./routes/donate/dimpact.js");
const dtest = require("./routes/donate/dtest.js");
const dthanks = require("./routes/donate/dthank.js");
const dform = require("./routes/donate/dform.js");

const ghero = require("./routes/gallery/ghero.js");
const gpage = require("./routes/gallery/gpage.js");
const gaudio = require("./routes/gallery/gaudio.js");

const ecta = require("./routes/exam/ecta.js");
const ehero = require("./routes/exam/ehero.js");
const eoverview = require("./routes/exam/eoverview.js");
const eadd = require("./routes/exam/eadd.js");
const ecurr = require("./routes/exam/ecurr.js");
const epre = require("./routes/exam/epre.js");
const eplan = require("./routes/exam/eplan.js");
const emat = require("./routes/exam/emat.js");
const etop = require("./routes/exam/etop.js");

const lcase = require("./routes/legal/caseTracker.js");
const docu = require("./routes/legal/document.js");
const right = require("./routes/legal/right.js");
const find = require("./routes/legal/finder.js");
const aid = require("./routes/legal/aid.js");
const property = require("./routes/legal/property.js");
const legalsec = require("./routes/legal/legalsec.js");


const paymentRoutes = require("./routes/paymentRoutes"); // forr payment

// Apply rate limiting middleware
app.use(apiLimiter);

// Middleware
app.use(helmet());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

console.log("🚀 Backend server initialized...");
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  console.log("✅ Health check endpoint hit");
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    demoMode: process.env.DEMO_MODE === 'true'
  });
});

// Frontend connection test endpoint
app.get("/api/test-connection", (req, res) => {
  console.log("🔗 Frontend connection test received");
  res.json({ 
    message: "Frontend successfully connected to backend!",
    demoMode: process.env.DEMO_MODE === 'true'
  });
});

// In your Express server setup
// Static uploads route
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/cta", ctaRoutes);
app.use("/api/stat", statsRoutes);
app.use("/api/causes", causesRoutes);
app.use("/api", eventsRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api", volunteerManagementRoutes);
app.use("/api/hero", heroSection);
app.use("/api/test", testimonial);
app.use("/api", newsletterRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/filter", eventFilter);
app.use("/api/eventHero", eventHero);

app.use("/api/aboutcta", aboutCta);
app.use("/api/choose", aboutChoose);
app.use("/api/timeline", timelineRoutes);
app.use("/api/mission", mission);
app.use("/api/aboutHero", aboutHero);
app.use("/api/team", teamRoutes);

app.use("/api/causeHero", causeHero);
app.use("/api/causeImpact", causeImpact);
app.use("/api/transform-projects", projectRoutes);
app.use("/api/transform-section-settings", sectionRoutes);
app.use("/api/causecta", causecta);
app.use("/api/causeList", causeList);
app.use("/api/new", news);

app.use("/api/faq", FAQ);
app.use("/api/vhero", vhero);
app.use("/api/vimpact", vimpact);
app.use("/api/vtrust", vtrust);
app.use("/api/vrole", vrole);
app.use("/api/vtest", vtest);
app.use("/api/vWhy", vWhy);
app.use("/api/vsignup", vsignup);
app.use("/api/vvolun", vvolun);

app.use("/api/dhero", dhero);
app.use("/api/dimpact", dimpact);
app.use("/api/dtest", dtest);
app.use("/api/dthanks", dthanks);
app.use("/api/dform", dform);

app.use("/api/ghero", ghero);
app.use("/api/gpage", gpage);
app.use("/api/gaudio", gaudio);

app.use("/api/ecta", ecta);
app.use("/api/ehero", ehero);
app.use("/api/eoverview", eoverview);
app.use("/api/eadd", eadd);
app.use("/api/ecurr", ecurr);
app.use("/api/epre", epre);
app.use("/api/eplan", eplan);
app.use("/api/emat", emat);
app.use("/api/etop", etop);

app.use("/api/lcase", lcase);
app.use("/api/docu", docu);
app.use("/api/right", right);
app.use("/api/find", find);
app.use("/api/aid", aid);
app.use("/api/property-law", property);
app.use("/api/legalsec", legalsec);

app.use("/api/payments", paymentRoutes); // for payment

// Cache cleanup interval
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of global.apiCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      global.apiCache.delete(key);
    }
  }
  console.log(`🧹 Cache cleanup completed. ${global.apiCache.size} items remaining.`);
}, 5 * 60 * 1000); // Every 5 minutes

// Error handling middleware (should be last)
app.use(handleApplicationError);

// 404 handler
app.use("*", handleNotFoundError);

module.exports = app;