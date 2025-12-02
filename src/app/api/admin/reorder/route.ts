import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
    try {
        const { model, items } = await request.json();

        if (!model || !items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Validate model name to prevent arbitrary table updates
        const allowedModels = ['project', 'skill', 'experience', 'education', 'achievement', 'researchPaper', 'certification'];
        if (!allowedModels.includes(model)) {
            return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
        }

        // Use a transaction to update all items
        await prisma.$transaction(
            items.map((item: { id: string; order: number }) => {
                // Dynamic model access: prisma[model]
                // @ts-ignore - Dynamic access is safe due to allowedModels check
                return prisma[model].update({
                    where: { id: item.id },
                    data: { order: item.order },
                });
            })
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reorder error:', error);
        return NextResponse.json({ error: 'Failed to reorder items' }, { status: 500 });
    }
}
