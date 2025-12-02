import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration: Resetting default skill colors to null...');

    try {
        const result = await prisma.skill.updateMany({
            where: {
                color: '#00d9ff',
            },
            data: {
                color: null,
            },
        });

        console.log(`Migration complete. Updated ${result.count} skills.`);
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
