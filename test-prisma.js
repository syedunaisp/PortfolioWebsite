const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Testing Prisma connection...');
    try {
        const count = await prisma.project.count();
        console.log('Successfully connected! Project count:', count);
    } catch (e) {
        console.error('Connection failed:', e);
        require('fs').writeFileSync('error.log', require('util').inspect(e));
    } finally {
        await prisma.$disconnect();
    }
}

main();
