import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.project.findMany({
        orderBy: { order: 'asc' },
        select: { title: true, order: true, id: true }
    });

    console.log('Current Projects in DB (Ordered by order: asc):');
    projects.forEach(p => console.log(`${p.order}: ${p.title.substring(0, 20)}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
