export const stats = [
  { value: "12K+", label: "students onboarded" },
  { value: "40", label: "internship domains" },
  { value: "96%", label: "task completion visibility" },
  { value: "48h", label: "average review window" },
];

const techDomains = [
  "Web Development",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Java Development",
  "Python Development",
  "C++ Programming",
  "Data Science",
  "Data Analytics",
  "Machine Learning",
  "Artificial Intelligence",
  "Deep Learning",
  "Generative AI",
  "Cyber Security",
  "Ethical Hacking",
  "Cloud Computing",
  "DevOps Engineering",
  "Android App Development",
  "Flutter App Development",
  "UI/UX Design",
  "Graphic Design",
  "Blockchain Development",
  "Internet of Things (IoT)",
  "Software Testing & QA",
  "Database Management (SQL)",
];

const nonTechDomains = [
  "Digital Marketing",
  "Social Media Marketing",
  "Content Writing",
  "Technical Writing",
  "Human Resource (HR)",
  "Business Development",
  "Sales & Marketing",
  "Finance & Accounting",
  "Stock Market & Trading",
  "Cryptocurrency & Blockchain Trading",
  "Bioinformatics",
  "Biotechnology Research",
  "English Speaking & Communication",
  "Public Speaking & Personality Development",
  "Entrepreneurship & Startup Management",
];

const featuredDomains = new Set([
  "Full Stack Development",
  "Data Analytics",
  "Artificial Intelligence",
  "Machine Learning",
  "Cyber Security",
  "Digital Marketing",
  "UI/UX Design",
  "Stock Market & Trading",
  "Bioinformatics",
  "English Speaking & Communication",
]);

function domainIcon(title) {
  return title
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function domainSummary(title, category) {
  if (category === "Tech") {
    return `Build practical ${title.toLowerCase()} skills through guided tasks, tools, reviews, and portfolio-ready submissions.`;
  }

  return `Develop career-ready ${title.toLowerCase()} experience with structured assignments, communication, reporting, and review.`;
}

function domainSkills(title, category) {
  if (category === "Tech") {
    return `${title}, Git, documentation, deployment, project workflow`;
  }

  return `${title}, research, communication, reporting, execution`;
}

export const programs = [...techDomains, ...nonTechDomains].map((title, index) => {
  const category = index < techDomains.length ? "Tech" : "Non-Tech";

  return {
    icon: domainIcon(title),
    title,
    category,
    featured: featuredDomains.has(title),
    summary: domainSummary(title, category),
    duration: category === "Tech" ? "4 to 8 weeks" : "4 to 6 weeks",
    skills: domainSkills(title, category),
    project:
      category === "Tech"
        ? `Complete a hands-on ${title.toLowerCase()} capstone project`
        : `Create a practical ${title.toLowerCase()} campaign or case study`,
  };
});

export const journeySteps = [
  { title: "Apply", copy: "Choose a domain and submit your basic profile." },
  { title: "Offer Letter", copy: "Receive an auto-generated offer letter and intern ID." },
  { title: "Dashboard", copy: "Access tasks, resources, deadlines, and progress tracking." },
  { title: "Tasks", copy: "Complete guided projects with submission checkpoints." },
  { title: "Review", copy: "Mentors or admins verify work and update your status." },
  { title: "Payment", copy: "Optional certificate or program payments can be verified." },
  { title: "Certificate", copy: "Download a QR enabled certificate after completion." },
  { title: "Verification", copy: "Anyone can verify the certificate by ID, intern ID, or QR." },
];

export const dashboardHighlights = [
  {
    title: "Student Dashboard",
    items: [
      "Profile",
      "Intern ID",
      "Offer Letter",
      "Tasks",
      "Progress",
      "Payment",
      "Certificate Download",
      "Feedback",
    ],
  },
  {
    title: "Admin Dashboard",
    items: [
      "Student Management",
      "Domain Management",
      "Task Management",
      "Bulk Email",
      "Bulk Certificates",
      "Payment Verification",
      "Analytics",
    ],
  },
];

export const careerTools = [
  { title: "Resume Builder", copy: "Generate role-specific resume sections from internship outcomes." },
  { title: "ATS Checker", copy: "Compare resumes against target roles and improve keyword coverage." },
  { title: "Interview Prep", copy: "Practice project explanations, HR answers, and technical prompts." },
  { title: "Career Roadmap", copy: "Map next skills, portfolio gaps, and weekly learning milestones." },
  { title: "Portfolio Builder", copy: "Convert completed tasks into case studies and portfolio proof." },
];

export const services = [
  {
    title: "Virtual Internship Platform",
    copy: "Structured cohorts with offer letters, intern IDs, task workflows, mentor review, and completion certificates.",
    points: ["Domain onboarding", "Task submission", "Progress analytics"],
  },
  {
    title: "Certificate Verification System",
    copy: "A QR-ready verification layer for intern IDs, certificate IDs, issue dates, completion status, and validity checks.",
    points: ["QR verification", "MySQL records", "Public validation"],
  },
  {
    title: "Admin Operations Suite",
    copy: "Tools for student management, domain setup, bulk communication, certificate issuing, payments, and reporting.",
    points: ["Bulk email", "Payment review", "Admin analytics"],
  },
  {
    title: "AI Career Enablement",
    copy: "Resume, ATS, interview, roadmap, and portfolio workflows that convert internship output into job-ready proof.",
    points: ["Resume builder", "ATS checker", "Portfolio cases"],
  },
];

export const aboutValues = [
  {
    title: "Practical First",
    copy: "Every track is built around visible output, not passive learning hours.",
  },
  {
    title: "Verification Ready",
    copy: "Certificates, intern IDs, and review trails are designed to be easy to validate.",
  },
  {
    title: "Career Oriented",
    copy: "Students finish with project stories, portfolio assets, and interview talking points.",
  },
];

export const contactChannels = [
  { title: "Email", value: "hello@veloraskills.tech", href: "mailto:hello@veloraskills.tech" },
  { title: "WhatsApp", value: "+91 99999 99999", href: "https://wa.me/919999999999" },
  { title: "Admin", value: "Open admin panel", href: "/admin/login" },
];

export const blogPosts = [
  {
    title: "Top Web Development Trends in 2026: Technologies Every Student Should Know",
    category: "Web Development",
    date: "June 19, 2026",
    author: "VeloraSkills",
    theme: "web",
    copy: "Explore the frameworks, APIs, AI-assisted workflows, and deployment patterns shaping modern web development careers.",
  },
  {
    title: "How Much Does Website Development Cost in India in 2026?",
    category: "Web Development",
    date: "June 18, 2026",
    author: "VeloraSkills",
    theme: "cost",
    copy: "A student-friendly breakdown of website pricing, project scope, hosting, design systems, and full-stack delivery.",
  },
  {
    title: "Mobile App Development Cost Guide 2026: Complete Pricing Breakdown",
    category: "Mobile Development",
    date: "June 16, 2026",
    author: "VeloraSkills",
    theme: "mobile",
    copy: "Understand mobile app cost drivers, platform choices, design complexity, backend needs, and maintenance planning.",
  },
  {
    title: "How to turn internship tasks into portfolio case studies",
    category: "Portfolio",
    date: "June 12, 2026",
    author: "VeloraSkills",
    theme: "portfolio",
    copy: "A practical framework for writing project context, implementation notes, screenshots, and measurable outcomes.",
  },
  {
    title: "Why certificate verification matters for virtual internships",
    category: "Verification",
    date: "June 8, 2026",
    author: "VeloraSkills",
    theme: "verify",
    copy: "Verified certificates help recruiters and colleges confirm intern identity, domain, issue date, and completion status.",
  },
  {
    title: "Choosing your first technical internship domain",
    category: "Career",
    date: "June 3, 2026",
    author: "VeloraSkills",
    theme: "career",
    copy: "Compare web development, Python, data science, AI, design, and cyber security based on your current skill level.",
  },
];

export const resources = [
  { title: "Learning Material", copy: "Track-wise starter notes and curated references.", href: "#programs" },
  { title: "GitHub Guide", copy: "Repository setup, commits, README, and submission hygiene.", href: "#process" },
  { title: "Submission Guide", copy: "How to package tasks for review and certificate approval.", href: "#apply" },
  { title: "Blog", copy: "SEO-ready internship updates, career tips, and student wins.", href: "#about" },
];

export const testimonials = [
  {
    quote: "The weekly tasks helped me turn scattered learning into projects I could show.",
    name: "Aarav Mehta",
    role: "Web Development Intern",
  },
  {
    quote: "Certificate verification made my internship proof easy to share during interviews.",
    name: "Nisha Rao",
    role: "Data Science Intern",
  },
  {
    quote: "The dashboard kept deadlines, feedback, and submissions in one place.",
    name: "Kabir Ansari",
    role: "Python Intern",
  },
];

export const faqs = [
  {
    question: "Is the internship remote?",
    answer: "Yes. The platform is designed for virtual internships with dashboard tasks and online submissions.",
  },
  {
    question: "Will students get an offer letter?",
    answer: "Yes. The backend supports auto intern IDs and offer letter records after application approval.",
  },
  {
    question: "How is the certificate verified?",
    answer: "Certificates can be searched by certificate ID, intern ID, or QR code using the verification route.",
  },
  {
    question: "Can admins send bulk emails and certificates?",
    answer: "The dashboard content and database schema reserve fields for bulk email, certificates, analytics, and payment verification workflows.",
  },
];

export const studentSnapshot = {
  internId: "VS-2026-00042",
  name: "Riya Sharma",
  domain: "Web Development",
  status: "Active",
  progress: 68,
  nextDeadline: "Task 4 due in 2 days",
};

export const studentTasks = [
  { title: "Portfolio Landing Page", status: "Approved", score: "92%" },
  { title: "API Integration", status: "Submitted", score: "Reviewing" },
  { title: "Dashboard UI", status: "In Progress", score: "Pending" },
  { title: "Final Deployment", status: "Locked", score: "Pending" },
];

export const adminMetrics = [
  { label: "New applications", value: "184" },
  { label: "Active interns", value: "1,236" },
  { label: "Pending reviews", value: "72" },
  { label: "Certificates ready", value: "318" },
];

export const adminRows = [
  { name: "Riya Sharma", domain: "Web Development", status: "Active", payment: "Verified" },
  { name: "Aman Verma", domain: "Python Development", status: "Pending", payment: "Pending" },
  { name: "Sara Khan", domain: "Data Science", status: "Completed", payment: "Verified" },
  { name: "Neil Dsouza", domain: "AI and Machine Learning", status: "Review", payment: "Verified" },
];
