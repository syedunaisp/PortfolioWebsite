import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Wipe tables first to prevent duplicates if ran multiple times
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.researchPaper.deleteMany();
  await prisma.certification.deleteMany();

  // ==================== PROFILE ====================
  await prisma.profile.upsert({
    where: { id: 'profile-main' },
    update: {},
    create: {
      id: 'profile-main',
      bio: 'I am Syed Unais Panjathan, a B.E. Computer Science student at Muffakham Jah College of Engineering and Technology, Hyderabad. I am passionate about Machine Learning, MLOps, and building intelligent systems that solve real-world problems. With hands-on experience in deploying AI pipelines, building full-stack applications, and winning multiple hackathons, I thrive at the intersection of AI and software engineering.',
      careerObjective: 'Aspiring MLOps and AI Engineer with a strong foundation in machine learning, cloud infrastructure, and full-stack development. Currently interning at HenceProve, building production-grade AI agent pipelines. Passionate about leveraging cutting-edge AI to create impactful, scalable solutions — from smart farming assistants to clinical decision support tools.',
      resumeUrl: '',
      linkedinUrl: 'https://www.linkedin.com/in/syedunaisp',
      githubUrl: 'https://github.com/syedunaisp',
      twitterUrl: '',
      email: 'syedunais516@gmail.com',
    },
  });
  console.log('  ✅ Profile created');

  // ==================== HERO SETTINGS ====================
  await prisma.heroSettings.upsert({
    where: { id: 'hero-main' },
    update: {},
    create: {
      id: 'hero-main',
      heading: "Hi, I'm Syed Unais",
      subheading: 'MLOps Engineer • AI Builder • Full-Stack Developer',
      keywords: [
        'Machine Learning',
        'MLOps',
        'Full-Stack Development',
        'AI Agents',
        'Cloud Infrastructure',
        'Deep Learning',
        'Computer Vision',
        'NLP',
      ],
    },
  });
  console.log('  ✅ Hero settings created');

  // ==================== SECTION SETTINGS ====================
  await prisma.sectionSettings.upsert({
    where: { id: 'sections-main' },
    update: {},
    create: {
      id: 'sections-main',
      showAbout: true,
      showSkills: true,
      showProjects: true,
      showExperience: true,
      showEducation: true,
      showAchievements: true,
      showResearch: true,
      showCertifications: false,
    },
  });
  console.log('  ✅ Section settings created');

  // ==================== EXPERIENCE ====================
  const experiences = [
    {
      role: 'MLOps Intern',
      company: 'HenceProve',
      period: 'Feb 2026 – Present',
      description:
        'Built an AI agent pipeline extracting text from PDF question banks via LightOn OCR (AWS-hosted), converting to Markdown, then to structured JSON using GPT OSS 120B on Cloudflare Workers AI, with a secondary model validation layer for output accuracy. Deployed a COVID-19 case prediction model on AWS, gaining hands-on experience with cloud infrastructure and end-to-end ML model deployment pipelines. Architected AutoApply, a B2C SaaS job application platform on Cloudflare Workers + D1 + Vectorize + R2 + Next.js 14, automating resume tailoring, ATS submission, and cold email outreach via Apollo.io and Resend.',
      order: 0,
    },
    {
      role: 'ML Intern',
      company: 'EduLumos',
      period: 'Jan 2026 – Feb 2026',
      description:
        'Built supervised classification models for heart disease risk prediction (Logistic Regression, Decision Trees) and NLP-based fake news detection using TF-IDF, alongside K-Means customer segmentation — delivering 4 end-to-end ML projects.',
      order: 1,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log('  ✅ Experiences created');

  // ==================== EDUCATION ====================
  const educations = [
    {
      degree: 'B.E. Computer Science',
      institution: 'Muffakham Jah College of Engineering and Technology, Hyderabad',
      period: '2024 – Present',
      score: 'CGPA: 7.0',
      order: 0,
    },
    {
      degree: 'Class XII',
      institution: 'Nasr Boys School, Hyderabad',
      period: '2022 – 2024',
      score: 'Aggregate: 75%',
      order: 1,
    },
    {
      degree: 'Class X',
      institution: 'New Al Wurood International School, Jeddah, Saudi Arabia',
      period: '2012 – 2022',
      score: 'Aggregate: 85%',
      order: 2,
    },
  ];

  for (const edu of educations) {
    await prisma.education.create({ data: edu });
  }
  console.log('  ✅ Education created');

  // ==================== PROJECTS ====================
  const projects = [
    {
      title: 'Sahyogi — Multilingual Voice-First AI Smart Farming Assistant',
      description:
        'Reduced agricultural decision time for 150M+ small and marginal farmers by building a multilingual voice-first AI assistant using FastAPI, Next.js, Twilio, YOLOv11, and Random Forest in 15 hours, resulting in 90%-accurate market-price forecasts, SHC-powered soil advisory, and a projected 20–30% yield growth and 15–20% reduction in input costs.',
      imageUrl: '/projects/sahyogi.png',
      tags: ['FastAPI', 'Next.js', 'Twilio', 'YOLOv11', 'Random Forest', 'AI', 'Voice Assistant'],
      link: '',
      githubLink: '',
      featured: true,
      order: 0,
    },
    {
      title: 'GigLens — AI-Powered Smart Financial Support System for Gig Workers',
      description:
        'Improved financial health outcomes for gig workers by training an XGBoost model on a 1,000-record hybrid dataset and building a FastAPI + Next.js dashboard with GigLens Score, FlowForward forecasting, and LeakShield expense detection, achieving 90% net-income forecasting accuracy and targeting 15% savings improvement and 20% debt reduction.',
      imageUrl: '/projects/giglens.png',
      tags: ['XGBoost', 'FastAPI', 'Next.js', 'Machine Learning', 'FinTech'],
      link: '',
      githubLink: '',
      featured: true,
      order: 1,
    },
    {
      title: 'RuralClinic AI — Clinical Decision Support for Rural Health Workers',
      description:
        'Enabled safe AI-assisted triage in low-resource rural clinics by using Groq Llama 3.3-70B to normalize unstructured patient narratives paired with a 100% deterministic Red/Amber/Green rule engine built on FastAPI, Next.js 14, Supabase, Redis, and Docker, resulting in a zero-hallucination triage system deployable without stable internet.',
      imageUrl: '/projects/ruralclinic.png',
      tags: ['Groq', 'Llama 3.3', 'FastAPI', 'Next.js', 'Supabase', 'Redis', 'Docker', 'Healthcare AI'],
      link: '',
      githubLink: '',
      featured: true,
      order: 2,
    },
    {
      title: 'Dark Web Threat Intelligence — SOC Dashboard',
      description:
        'Accelerated threat detection for SOC analysts by building an LLM-powered IOC/CVE extraction pipeline with real-time NVD REST API 2.0 validation, 7-day file-based caching, and rate-limited retries, resulting in a Next.js 16 + FastAPI + Recharts dashboard across 6 threat intelligence views for real-time dark web monitoring and early warning alerts.',
      imageUrl: '/projects/darkweb.png',
      tags: ['LLM', 'NVD API', 'Next.js', 'FastAPI', 'Recharts', 'Cybersecurity', 'SOC'],
      link: '',
      githubLink: '',
      featured: false,
      order: 3,
    },
    {
      title: 'Glassic — AI Voice Agent Platform',
      description:
        'Reduced custom voice agent development time by building a platform that enables businesses to deploy AI-powered conversational agents using NLP techniques and external API integrations, automating customer interactions without custom infrastructure.',
      imageUrl: '/projects/glassic.png',
      tags: ['NLP', 'Voice AI', 'API Integration', 'Automation', 'Platform'],
      link: '',
      githubLink: '',
      featured: false,
      order: 4,
    },
    {
      title: 'AutoApply — B2C SaaS Job Application Platform',
      description:
        'Architected a B2C SaaS job application platform on Cloudflare Workers + D1 + Vectorize + R2 + Next.js 14, automating resume tailoring, ATS submission (Greenhouse, Lever, Ashby), and cold email outreach via Apollo.io and Resend.',
      imageUrl: '/projects/autoapply.png',
      tags: ['Cloudflare Workers', 'D1', 'Vectorize', 'Next.js', 'SaaS', 'Automation'],
      link: '',
      githubLink: '',
      featured: false,
      order: 5,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log('  ✅ Projects created');

  // ==================== SKILLS ====================
  const skills = [
    // Languages
    { name: 'Python', category: 'Languages', proficiency: 95, color: '#3776AB', order: 0 },
    { name: 'Java', category: 'Languages', proficiency: 75, color: '#007396', order: 1 },
    { name: 'C', category: 'Languages', proficiency: 70, color: '#A8B9CC', order: 2 },
    { name: 'TypeScript', category: 'Languages', proficiency: 90, color: '#3178C6', order: 3 },

    // ML / AI
    { name: 'scikit-learn', category: 'ML / AI', proficiency: 90, color: '#F7931E', order: 4 },
    { name: 'XGBoost', category: 'ML / AI', proficiency: 85, color: '#FF6600', order: 5 },
    { name: 'Random Forest', category: 'ML / AI', proficiency: 85, color: '#228B22', order: 6 },
    { name: 'TensorFlow', category: 'ML / AI', proficiency: 80, color: '#FF6F00', order: 7 },
    { name: 'PyTorch', category: 'ML / AI', proficiency: 80, color: '#EE4C2C', order: 8 },
    { name: 'YOLOv11', category: 'ML / AI', proficiency: 80, color: '#00BFFF', order: 9 },
    { name: 'Groq (Llama 3.3-70B)', category: 'ML / AI', proficiency: 85, color: '#9B59B6', order: 10 },
    { name: 'LLM Pipelines', category: 'ML / AI', proficiency: 85, color: '#E74C3C', order: 11 },

    // MLOps / Cloud
    { name: 'AWS', category: 'MLOps / Cloud', proficiency: 80, color: '#FF9900', order: 12 },
    { name: 'Cloudflare Workers', category: 'MLOps / Cloud', proficiency: 85, color: '#F48120', order: 13 },
    { name: 'FastAPI', category: 'MLOps / Cloud', proficiency: 90, color: '#009688', order: 14 },
    { name: 'Docker', category: 'MLOps / Cloud', proficiency: 80, color: '#2496ED', order: 15 },
    { name: 'NVD API', category: 'MLOps / Cloud', proficiency: 75, color: '#1ABC9C', order: 16 },

    // Data
    { name: 'Pandas', category: 'Data', proficiency: 90, color: '#150458', order: 17 },
    { name: 'NumPy', category: 'Data', proficiency: 90, color: '#013243', order: 18 },
    { name: 'Matplotlib', category: 'Data', proficiency: 85, color: '#11557C', order: 19 },
    { name: 'Seaborn', category: 'Data', proficiency: 80, color: '#4C72B0', order: 20 },
    { name: 'NLTK', category: 'Data', proficiency: 75, color: '#154F5B', order: 21 },
    { name: 'TF-IDF', category: 'Data', proficiency: 80, color: '#E67E22', order: 22 },

    // Web
    { name: 'Next.js', category: 'Web', proficiency: 90, color: '#000000', order: 23 },
    { name: 'React', category: 'Web', proficiency: 90, color: '#61DAFB', order: 24 },
    { name: 'Django', category: 'Web', proficiency: 70, color: '#092E20', order: 25 },
    { name: 'Tailwind CSS', category: 'Web', proficiency: 90, color: '#06B6D4', order: 26 },
    { name: 'HTML/CSS/JavaScript', category: 'Web', proficiency: 90, color: '#E34F26', order: 27 },

    // Tools
    { name: 'Git', category: 'Tools', proficiency: 90, color: '#F05032', order: 28 },
    { name: 'LightOn OCR', category: 'Tools', proficiency: 75, color: '#FF5722', order: 29 },
    { name: 'Twilio', category: 'Tools', proficiency: 75, color: '#F22F46', order: 30 },
    { name: 'Supabase', category: 'Tools', proficiency: 85, color: '#3ECF8E', order: 31 },
    { name: 'Redis', category: 'Tools', proficiency: 80, color: '#DC382D', order: 32 },
    { name: 'Apollo.io', category: 'Tools', proficiency: 70, color: '#6C63FF', order: 33 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log('  ✅ Skills created');

  // ==================== ACHIEVEMENTS ====================
  const achievements = [
    {
      title: '2nd Place — Hack Revolution 2025',
      description:
        'Won by building Sahyogi, a multilingual voice-first AI farming assistant using FastAPI + Twilio + YOLOv11 in 15 hours, delivering 90%-accurate market forecasts for 150M+ farmers.',
      date: '2025',
      award: '₹25,000',
      order: 0,
    },
    {
      title: '3rd Place — Datanyx Datathon 2025',
      description:
        'Secured by developing GigLens, an XGBoost-powered financial platform achieving 90% net-income forecasting accuracy targeting gig worker debt reduction.',
      date: '2025',
      award: null,
      order: 1,
    },
    {
      title: 'Domain Winner — CodeStorm 2026',
      description:
        'Won by building RuralClinic AI, a Groq Llama 3.3-70B-powered zero-hallucination triage tool improving rural healthcare access in low-resource environments. 100+ teams participated.',
      date: '2026',
      award: '₹5,000',
      order: 2,
    },
    {
      title: '2nd Place — HackSavvy 2026',
      description:
        'Secured by developing a Dark Web Threat Intelligence SOC dashboard with LLM-powered IOC/CVE extraction and real-time NVD REST API 2.0 validation. 100+ teams participated.',
      date: '2026',
      award: '₹15,000',
      order: 3,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement });
  }
  console.log('  ✅ Achievements created');

  // ==================== RESEARCH PAPERS ====================
  await prisma.researchPaper.create({
    data: {
      title: 'The Security Implications of Microservices in Modern Software Development',
      abstract:
        'Explored expanded attack surfaces, inter-service communication vulnerabilities, OAuth 2.0/JWT authentication, mutual TLS, and service meshes (Istio); discussed AI/ML-driven anomaly detection and blockchain for transaction integrity in microservices environments.',
      link: '',
      publicationDate: '2025',
      order: 0,
    },
  });
  console.log('  ✅ Research paper created');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
