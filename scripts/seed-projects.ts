import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
    {
        title: "Glassic – AI Voice Agent Platform",
        description: "Developed a platform to build and deploy AI-powered voice agents capable of automating conversations and enhancing user interaction. Implemented natural language processing techniques and integrated with external APIs for real-world use cases.",
        tags: ["AI/ML", "NLP", "Voice AI", "Platform Engineering"],
        imageUrl: "/uploads/glassic-bg.jpg", // Placeholder, user can update
        featured: true,
        isVisible: true,
        order: 0,
    },
    {
        title: "GigLens – Smart Financial Support System",
        description: "An AI-driven platform that predicts net income with 90% accuracy, detects hidden expense leakage, and evaluates financial health using behavioral and economic indicators. Built with FastAPI + Next.js and a 500-record hybrid dataset to improve savings by 15% and reduce debt stress by 20%.",
        tags: ["FastAPI", "Next.js", "AI/ML", "FinTech"],
        imageUrl: "/uploads/giglens-bg.jpg", // Placeholder
        featured: true,
        isVisible: true,
        order: 1,
    },
    {
        title: "Sahyogi – AI-Powered Smart Farming Assistant",
        description: "Developed a multilingual on-call AI assistant enabling agricultural decision support for small & marginal farmers without smartphones or internet access. Delivered 90% accurate market-price forecasting, SHC-based soil advisory, weather-intelligent alerts, and automated farm calendars. Built using FastAPI, Next.js, Twilio, YOLOv11, Cartesia, Random Forest & Cloud infra, targeting 20–30% yield improvement and 15–20% reduction in input cost.",
        tags: ["FastAPI", "Twilio", "YOLOv11", "AI/ML", "AgriTech"],
        imageUrl: "/uploads/sahyogi-bg.jpg", // Placeholder
        featured: true,
        isVisible: true,
        order: 2,
    },
    {
        title: "Vision AI – Retinal Condition Detection",
        description: "Working on an AI/ML system to analyze retinal scans and detect conditions such as myopia, diabetic retinopathy, and glaucoma. Leveraging EfficientNet/ResNet architectures with TensorFlow/PyTorch, supported by datasets like EyePACS and Messidor.",
        tags: ["Computer Vision", "TensorFlow", "PyTorch", "Healthcare AI"],
        imageUrl: "/uploads/vision-ai-bg.jpg", // Placeholder
        featured: false,
        isVisible: true,
        order: 3,
    },
    {
        title: "Rain Predictor",
        description: "Designed a machine learning model to predict rainfall likelihood using historical weather data. Implemented data preprocessing, feature engineering, and supervised learning techniques to generate accurate forecasts.",
        tags: ["Python", "scikit-learn", "Pandas", "Data Science"],
        imageUrl: "/uploads/rain-predictor-bg.jpg", // Placeholder
        featured: false,
        isVisible: true,
        order: 4,
    },
    {
        title: "Medical Expense Detector",
        description: "Built a predictive model to estimate medical expenses based on demographic and health-related attributes. Used scikit-learn for regression modeling, achieving insights into key cost drivers like age, BMI, smoking habits, and dependents.",
        tags: ["Machine Learning", "Regression", "Python", "Healthcare"],
        imageUrl: "/uploads/medical-expense-bg.jpg", // Placeholder
        featured: false,
        isVisible: true,
        order: 5,
    }
];

async function main() {
    console.log('Start seeding projects...');

    for (const project of projects) {
        // Upsert based on title to avoid duplicates but update content
        const existing = await prisma.project.findFirst({
            where: { title: { contains: project.title.split('–')[0].trim() } }
        });

        if (existing) {
            console.log(`Updating project: ${project.title}`);
            await prisma.project.update({
                where: { id: existing.id },
                data: {
                    title: project.title,
                    description: project.description,
                    tags: project.tags,
                    // Only update image if it's currently null
                    imageUrl: existing.imageUrl || project.imageUrl,
                    order: project.order,
                }
            });
        } else {
            console.log(`Creating project: ${project.title}`);
            await prisma.project.create({
                data: project
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
