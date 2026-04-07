export const siteConfig = {
  name: "HealthCare AI",
  tagline: "Smart Digital Health Assistance for Every Family",
  established: "Est. 2024",
};

export const images = {
  // Campus & buildings
  hero: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014920/campus_lnna9a.avif",
  campus1: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014920/campuss_uehbkc.avif",
  campus2: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014917/campus2_zf54py.jpg",
  collegeOutdoor: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014919/college_outdoor_fjyaux.avif",
  collegeClassroom: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014917/college_classroom_exefui.avif",
  // Students
  students: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014918/students_mxoblc.avif",
  moreStudents: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772099852/Gemini_Generated_Image_w1wdytw1wdytw1wd_mcx5pd.png",
  // Fests
  fest: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014920/fest_us0xrh.avif",
  universityFest: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014920/university_fest_yfozy0.avif",
  recruter1: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772099817/comapny2_bxy1wd.png",
  recruter2: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772100414/mnc_comapnies_k3o8pm.png",
  // Technology
  tech1: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014921/technology1_pyglce.png",
  tech2: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014918/technology_2_ygoerk.jpg",
  tech3: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014918/technology3_adezvo.jpg",
  tech4: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014919/tech4_grbl1u.jpg",
  // Teachers
  teacher1: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014914/teacher1_o1xjdu.jpg",
  teacher2: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014915/teacher2_dgauam.jpg",
  teacher3: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014915/teacher3_hffv5u.jpg",
  teacher4: "https://res.cloudinary.com/dpvbaiyus/image/upload/v1772014916/teacher4_lm99x4.jpg",
};

// ---- NAV LINKS ----
export const navLinks = [
 
  { label: "About", href: "#about" },
  { label: "Services", href: "#courses" },
  { label: "Doctors", href: "#mentors" },
  { label: "Care", href: "#campus" },
  { label: "Outcomes", href: "#placements" },
];

// ---- ABOUT ----
export const aboutContent = {
  title: "About HealthCare AI",
  subtitle: "Trusted Digital Care Platform",
  description:
    "HealthCare AI is a healthcare support platform that provides symptom guidance, appointment assistance, and medication reminders. Our secure workflow helps users access timely care information and manage routine health actions with confidence.",
  highlights: [
    { value: "24/7", label: "Chat Assistance" },
    { value: "95%", label: "Timely Responses" },
    { value: "10k+", label: "Support Sessions" },
    { value: "100%", label: "Digital Access" },
  ],
};

// ---- ACHIEVEMENTS ----
export const achievementsContent = {
  stats: [
    { value: "24/7", label: "Healthcare Chat Support" },
    { value: "2 min", label: "Average First Response" },
    { value: "1,500+", label: "Appointments Assisted" },
    { value: "3,000+", label: "Medication Reminders Set" },
  ],
};

// ---- COURSES ----
export const coursesContent = {
  btech: [
    { name: "Symptom Triage Assistant", seats: 24, avg: "Realtime Guidance" },
    { name: "Appointment Booking Support", seats: 24, avg: "Queue Management" },
    { name: "Medication Reminder Tracker", seats: 24, avg: "Daily Adherence" },
    { name: "Health FAQ Knowledge Chat", seats: 24, avg: "Safe Responses" },
    { name: "Doctor Callback Workflow", seats: 24, avg: "Fast Follow-up" },
    { name: "Care Insights Dashboard", seats: 24, avg: "Actionable Metrics" },
  ],
  mtech: [
    { name: "Chronic Care Follow-up", seats: 18 },
    { name: "Elderly Care Monitoring", seats: 18 },
    { name: "Maternal Health Guidance", seats: 18 },
  ],
  mba: { name: "Emergency Escalation Protocol", seats: 30, avg: "Critical Support" },
};

// ---- QUOTES ----
export const quotesContent = [
  {
    text: "The art of medicine consists in amusing the patient while nature cures the disease.",
    author: "Voltaire",
  },
  {
    text: "Wherever the art of medicine is loved, there is also a love of humanity.",
    author: "Hippocrates",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
];

// ---- MENTORS ----
export const mentorsContent = [
  {
    name: "Dr. Asha Mehta",
    role: "General Physician",
    image: images.teacher1,
    bio: "MBBS, MD · 18+ years in primary care",
    teaches: "Fever, flu, lifestyle conditions",
  },
  {
    name: "Dr. Rohan Iyer",
    role: "Cardiology Consultant",
    image: images.teacher2,
    bio: "DM Cardiology · 14 years clinical experience",
    teaches: "Heart risk awareness and care plans",
  },
  {
    name: "Dr. Nidhi Rao",
    role: "Pediatric Specialist",
    image: images.teacher3,
    bio: "MD Pediatrics · 12 years child-care practice",
    teaches: "Child fever, hydration, nutrition",
  },
  {
    name: "Dr. Vivek Menon",
    role: "Emergency Care Expert",
    image: images.teacher4,
    bio: "Emergency Medicine · 16 years trauma response",
    teaches: "Critical symptom escalation",
  },
];

// ---- CAMPUS / STUDENT LIFE (uses 6 images) ----
export const campusFeatures = [
  { title: "24/7 Care Chat", desc: "Always-on symptom guidance and safe next-step suggestions.", image: images.campus1 },
  { title: "Appointment Support", desc: "Book consultations with structured follow-up details.", image: images.collegeClassroom },
  { title: "Medication Tracking", desc: "Set reminder plans with dosage, frequency and date range.", image: images.campus2 },
  { title: "Emergency Guidance", desc: "Rapid red-flag recognition and escalation prompts.", image: images.fest },
  { title: "Health Education", desc: "Understand common conditions and preventive practices.", image: images.universityFest },
  { title: "Family Care Access", desc: "Simple workflows usable by seniors and caregivers.", image: images.collegeOutdoor },
];

// ---- PLACEMENTS ----
export const topRecruiters = [
  "General Medicine", "Cardiology", "Pediatrics", "ENT", "Dermatology",
  "Orthopedics", "Neurology", "Gynecology", "Diabetology", "Pulmonology",
  "Psychology", "Emergency Care",
];

export const deptPlacements = [
  { dept: "Appointments Completed", avg: "92%", pct: 92 },
  { dept: "First Response in <3 min", avg: "88%", pct: 88 },
  { dept: "Medication Adherence", avg: "84%", pct: 84 },
  { dept: "Successful Follow-ups", avg: "79%", pct: 79 },
  { dept: "Emergency Escalation Accuracy", avg: "95%", pct: 95 },
  { dept: "Patient Satisfaction", avg: "90%", pct: 90 },
  { dept: "Reminder Completion", avg: "81%", pct: 81 },
];

// ---- VAPI FORM ----
export const vapiFormContent = {
  courses: ["General Physician", "Cardiology", "Pediatrics", "Gynecology", "Dermatology", "ENT", "Orthopedics", "Mental Health", "Emergency Care"],
  topics: ["Symptoms Review", "Appointment Booking", "Medication Reminder", "Lab Report Query", "Preventive Care", "Emergency Guidance", "General"],
};

// ---- CONTACT ----
export const contactInfo = {
  email: "care@healthcareai.in",
  phone: "+91-9876543210",
  general: "support@healthcareai.in",
  address: "Hyderabad, Telangana, India",
};

export const eventsGallery = [
  { title: "Health Camp Highlights", image: images.recruter1 },
  { title: "Awareness Drive", image: images.recruter2 },
  { title: "Patient Support Session", image: images.students },
  { title: "Telehealth Workshop", image: images.tech4 },
  { title: "Nutrition Webinar", image: images.universityFest },
  { title: "Community Wellness Day", image: images.collegeOutdoor },
];
