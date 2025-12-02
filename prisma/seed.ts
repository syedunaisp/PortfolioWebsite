import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // Clear existing data
    await prisma.achievement.deleteMany();
    await prisma.education.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.project.deleteMany();
    await prisma.message.deleteMany();

    // --- PROJECTS ---
    const projects = [
        {
            title: 'Glassic',
            description: 'AI-powered voice agent platform capable of automating dynamic conversations. Implemented NLP pipelines and integrated third-party APIs to support real-world use cases.',
            imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop', // Keeping placeholder or use specific if available
            tags: ['JavaScript', 'NLP', 'APIs'],
            link: 'https://glassic.vercel.app',
            featured: true,
        },
        {
            title: 'Vision AI',
            description: 'AI/ML system to analyze retinal scans and detect conditions like diabetic retinopathy, glaucoma, and myopia using EfficientNet/ResNet architecture.',
            imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop',
            tags: ['TensorFlow', 'PyTorch', 'EfficientNet', 'Computer Vision'],
            featured: true,
        },
        {
            title: 'Rain Predictor',
            description: 'Machine learning model predicting rainfall probability using historical weather datasets. Implemented feature engineering, supervised learning methods, and model evaluation techniques.',
            imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974&auto=format&fit=crop',
            tags: ['Python', 'scikit-learn', 'Pandas'],
        },
        {
            title: 'Medical Expense Detector',
            description: 'Regression-based ML system for predicting medical expenses using demographic and health features. Extracted key cost contributors such as BMI, age, and smoking patterns.',
            imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
            tags: ['scikit-learn', 'Regression Models'],
        },
        {
            title: 'Smart Financial Support System for Gig Workers',
            description: 'An AI-driven platform that predicts net income with 90% accuracy, detects hidden expense leakage, and evaluates financial health using behavioral and economic indicators. Built with FastAPI + Next.js and a 500-record hybrid dataset to improve savings by 15% and reduce debt stress by 20%.',
            imageUrl: 'https://images.unsplash.com/photo-1554224155-98406858d0ade?q=80&w=2072&auto=format&fit=crop',
            tags: ['FastAPI', 'Next.js', 'AI/ML'],
        },
        {
            title: 'Sahyogi – AI-Powered Smart Farming Assistant',
            description: 'Multilingual on-call AI assistant for farmers without internet access. Features 90% accurate market-price forecasting, soil advisory, and weather alerts. Built with FastAPI, Next.js, Twilio, YOLOv11, and Cartesia, targeting 20–30% yield improvement.',
            imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
            tags: ['FastAPI', 'Twilio', 'YOLOv11', 'AI/ML'],
        },
    ];

    for (const project of projects) {
        await prisma.project.create({ data: project });
    }

    // --- SKILLS ---
    const skills = [
        // Programming Languages
        { name: 'Java', category: 'Programming Languages', proficiency: 90, icon: 'Coffee' },
        { name: 'Python', category: 'Programming Languages', proficiency: 95, icon: 'Terminal' },
        { name: 'C', category: 'Programming Languages', proficiency: 80, icon: 'Code' },

        // Machine Learning & Data Science
        { name: 'TensorFlow', category: 'Machine Learning', proficiency: 85, icon: 'Cpu' },
        { name: 'PyTorch', category: 'Machine Learning', proficiency: 80, icon: 'Cpu' },
        { name: 'scikit-learn', category: 'Machine Learning', proficiency: 90, icon: 'Brain' },
        { name: 'Data Preprocessing', category: 'Machine Learning', proficiency: 95, icon: 'Database' },

        // Web Development
        { name: 'React', category: 'Web Development', proficiency: 90, icon: 'Code' },
        { name: 'Next.js', category: 'Web Development', proficiency: 85, icon: 'Layout' },
        { name: 'Tailwind CSS', category: 'Web Development', proficiency: 95, icon: 'Palette' },
        { name: 'JavaScript', category: 'Web Development', proficiency: 90, icon: 'FileCode' },
        { name: 'Django', category: 'Web Development', proficiency: 80, icon: 'Server' },
        { name: 'HTML/CSS', category: 'Web Development', proficiency: 100, icon: 'Layout' },

        // Data Visualization
        { name: 'Matplotlib', category: 'Data Visualization', proficiency: 85, icon: 'BarChart' },
        { name: 'Seaborn', category: 'Data Visualization', proficiency: 80, icon: 'PieChart' },

        // Version Control
        { name: 'Git', category: 'Tools', proficiency: 90, icon: 'GitBranch' },
        { name: 'GitHub', category: 'Tools', proficiency: 90, icon: 'Github' },

        // Backend
        { name: 'FastAPI', category: 'Web Development', proficiency: 20, icon: 'Server' },
    ];

    for (const skill of skills) {
        await prisma.skill.create({ data: skill });
    }

    // --- EXPERIENCE ---
    const experiences = [
        {
            role: 'AIML Core Team',
            company: 'Google Developer Groups (GDG)',
            period: 'Present',
            description: 'Contributing to AI/ML workshops, events, and community initiatives as part of the core team.',
        },
        {
            role: 'Tech Associate Lead',
            company: 'Computer Society of India (CSI)',
            period: 'Present',
            description: 'Leading technical initiatives and managing event logistics as part of the executive committee.',
        },
        {
            role: 'DEV Core Team',
            company: 'AWS Cloud Club (AWS CC)',
            period: '2024 - 2025',
            description: 'Core team member driving development initiatives and cloud computing awareness.',
        },
    ];

    for (const experience of experiences) {
        await prisma.experience.create({ data: experience });
    }

    // --- EDUCATION ---
    const education = [
        {
            degree: 'B.E. Computer Science Engineering',
            institution: 'Muffakham Jah College of Engineering and Technology',
            period: '2024 - Present',
            score: 'CGPA 7',
        },
        {
            degree: 'Class 12',
            institution: 'Nasr Boys School',
            period: '2022 - 2024',
            score: '75%',
        },
        {
            degree: 'Class 10',
            institution: 'New Al Wurood International School',
            period: '2012 - 2022',
            score: '85%',
        },
    ];

    for (const edu of education) {
        await prisma.education.create({ data: edu });
    }

    // --- PROFILE ---
    await prisma.profile.deleteMany();
    await prisma.profile.create({
        data: {
            bio: "I'm Unais — a developer passionate about building intelligent, reactive, and visually refined digital experiences. I specialize in AI/ML, full-stack development, and crafting fast, clean, animated interfaces using modern web technologies. I enjoy turning complex ideas into usable, scalable systems. My work spans across AI voice agents, retinal disease detection, predictive modelling, and interactive front-end development. I love solving problems that blend creativity with engineering and delivering solutions that feel polished, intuitive, and futuristic.",
            careerObjective: "Motivated and detail-oriented second-year Computer Science student seeking opportunities to apply theoretical knowledge in practical settings. Eager to contribute to cutting-edge projects in areas such as artificial intelligence, machine learning, data science, or cybersecurity.",
            email: "syedunais516@gmail.com",
            githubUrl: "https://github.com/unais",
            linkedinUrl: "https://linkedin.com/in/unais",
        },
    });

    // --- ACHIEVEMENTS ---
    const achievements = [
        {
            title: 'HackRev 2025 — Winner',
            description: 'Built and presented a high-impact tech solution under competitive and time-restricted conditions. Demonstrated strong problem-solving, teamwork, and full-stack development skills.',
            date: '2025',
            award: 'Winner (₹25,000 Prize)',
        },
    ];

    for (const achievement of achievements) {
        await prisma.achievement.create({ data: achievement });
    }

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
