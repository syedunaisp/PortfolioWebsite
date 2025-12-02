'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password');

    // Simple check against env var or hardcoded value
    if (password === (process.env.ADMIN_PASSWORD || 'admin123')) {
        const user = { email: 'admin@example.com', name: 'Admin' };

        // Create the session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({ user, expires });

        // Save the session in a cookie
        (await cookies()).set('session', session, { expires, httpOnly: true });

        redirect('/admin/dashboard');
    }

    return { success: false, message: 'Invalid password' };
}

export async function logout() {
    (await cookies()).set('session', '', { expires: new Date(0) });
    redirect('/admin/login');
}

const contactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function sendContactMessage(prevState: any, formData: FormData) {
    const validatedFields = contactSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, message } = validatedFields.data;

    try {
        // 1. Save to Database
        try {
            await prisma.message.create({
                data: {
                    name,
                    email,
                    message,
                },
            });
        } catch (dbError) {
            console.error('Database error:', dbError);
        }

        // 2. Send Email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: 'unais.portfolio@gmail.com',
                subject: `New Portfolio Message from ${name}`,
                text: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `,
                html: `
                <h3>New Message from Portfolio</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
            });
        } else {
            console.warn('SMTP credentials not found. Email not sent.');
        }

        return { success: true, message: 'Message sent successfully!' };
    } catch (error) {
        console.error('Contact form error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}

// ==================== PROJECT ACTIONS ====================

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    imageUrl: z.string().optional().or(z.literal('')), // Allow relative paths
    tags: z.string(), // Comma-separated tags
    link: z.union([z.literal(''), z.string().url()]).optional(),
    githubLink: z.union([z.literal(''), z.string().url()]).optional(),
    featured: z.boolean().optional(),
});

export async function createProject(prevState: any, formData: FormData) {
    const validatedFields = projectSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        imageUrl: formData.get('imageUrl'),
        tags: formData.get('tags'),
        link: formData.get('link'),
        githubLink: formData.get('githubLink'),
        featured: formData.get('featured') === 'on',
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { tags, ...data } = validatedFields.data;
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const isVisible = formData.get('isVisible') === 'on';

    try {
        const projectData = {
            ...data,
            imageUrl: data.imageUrl || null,
            tags: tagsArray,
            link: data.link || null,
            githubLink: data.githubLink || null,
            isVisible,
        };

        console.log('Creating project with data:', projectData);

        await prisma.project.create({
            data: projectData,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Project created successfully!' };
    } catch (error) {
        console.error('Create project error:', error);
        return { success: false, message: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

export async function updateProject(id: string, prevState: any, formData: FormData) {
    const validatedFields = projectSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        imageUrl: formData.get('imageUrl'),
        tags: formData.get('tags'),
        link: formData.get('link'),
        githubLink: formData.get('githubLink'),
        featured: formData.get('featured') === 'on',
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { tags, ...data } = validatedFields.data;
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const isVisible = formData.get('isVisible') === 'on';

    try {
        await prisma.project.update({
            where: { id },
            data: {
                ...data,
                imageUrl: data.imageUrl || null,
                tags: tagsArray,
                link: data.link || null,
                githubLink: data.githubLink || null,
                isVisible,
            },
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Project updated successfully!' };
    } catch (error) {
        console.error('Update project error:', error);
        return { success: false, message: 'Failed to update project.' };
    }
}

export async function deleteProject(id: string) {
    try {
        await prisma.project.delete({ where: { id } });
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete project error:', error);
        return { success: false, message: 'Failed to delete project.' };
    }
}

// ==================== SKILL ACTIONS ====================

const skillSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    proficiency: z.number().min(0).max(100),
    icon: z.string().optional(),
});

export async function createSkill(prevState: any, formData: FormData) {
    const validatedFields = skillSchema.safeParse({
        name: formData.get('name'),
        category: formData.get('category'),
        proficiency: parseInt(formData.get('proficiency') as string),
        icon: formData.get('icon'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const rawColor = formData.get('color') as string;
    const color = rawColor || null;
    const isVisible = formData.get('isVisible') === 'on';

    try {
        await prisma.skill.create({
            data: {
                ...validatedFields.data,
                color,
                isVisible,
            },
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Skill created successfully!' };
    } catch (error) {
        console.error('Create skill error:', error);
        return { success: false, message: 'Failed to create skill.' };
    }
}

export async function updateSkill(id: string, prevState: any, formData: FormData) {
    const validatedFields = skillSchema.safeParse({
        name: formData.get('name'),
        category: formData.get('category'),
        proficiency: parseInt(formData.get('proficiency') as string),
        icon: formData.get('icon'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const rawColor = formData.get('color') as string;
    const color = rawColor || null;
    const isVisible = formData.get('isVisible') === 'on';

    try {
        await prisma.skill.update({
            where: { id },
            data: {
                ...validatedFields.data,
                color,
                isVisible,
            },
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Skill updated successfully!' };
    } catch (error) {
        console.error('Update skill error:', error);
        return { success: false, message: 'Failed to update skill.' };
    }
}

export async function deleteSkill(id: string) {
    try {
        await prisma.skill.delete({ where: { id } });
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete skill error:', error);
        return { success: false, message: 'Failed to delete skill.' };
    }
}

// ==================== EXPERIENCE ACTIONS ====================

const experienceSchema = z.object({
    role: z.string().min(1, 'Role is required'),
    company: z.string().min(1, 'Company is required'),
    period: z.string().min(1, 'Period is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
});

export async function createExperience(prevState: any, formData: FormData) {
    const validatedFields = experienceSchema.safeParse({
        role: formData.get('role'),
        company: formData.get('company'),
        period: formData.get('period'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.experience.create({
            data: validatedFields.data,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Experience created successfully!' };
    } catch (error) {
        console.error('Create experience error:', error);
        return { success: false, message: 'Failed to create experience.' };
    }
}

export async function updateExperience(id: string, prevState: any, formData: FormData) {
    const validatedFields = experienceSchema.safeParse({
        role: formData.get('role'),
        company: formData.get('company'),
        period: formData.get('period'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.experience.update({
            where: { id },
            data: validatedFields.data,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Experience updated successfully!' };
    } catch (error) {
        console.error('Update experience error:', error);
        return { success: false, message: 'Failed to update experience.' };
    }
}

export async function deleteExperience(id: string) {
    try {
        await prisma.experience.delete({ where: { id } });
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete experience error:', error);
        return { success: false, message: 'Failed to delete experience.' };
    }
}

// ==================== MESSAGE ACTIONS ====================

export async function deleteMessage(id: string) {
    try {
        await prisma.message.delete({ where: { id } });
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Delete message error:', error);
        return { success: false, message: 'Failed to delete message.' };
    }
}

export async function markMessageAsRead(id: string) {
    try {
        await prisma.message.update({
            where: { id },
            data: { read: true },
        });
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Mark message as read error:', error);
        return { success: false, message: 'Failed to update message.' };
    }
}

// ==================== EDUCATION ACTIONS ====================

const educationSchema = z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    period: z.string().min(1, 'Period is required'),
    score: z.string().min(1, 'Score is required'),
});

export async function createEducation(prevState: any, formData: FormData) {
    const validatedFields = educationSchema.safeParse({
        degree: formData.get('degree'),
        institution: formData.get('institution'),
        period: formData.get('period'),
        score: formData.get('score'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.education.create({
            data: validatedFields.data,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Education created successfully!' };
    } catch (error) {
        console.error('Create education error:', error);
        return { success: false, message: 'Failed to create education.' };
    }
}

export async function updateEducation(id: string, prevState: any, formData: FormData) {
    const validatedFields = educationSchema.safeParse({
        degree: formData.get('degree'),
        institution: formData.get('institution'),
        period: formData.get('period'),
        score: formData.get('score'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.education.update({
            where: { id },
            data: validatedFields.data,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Education updated successfully!' };
    } catch (error) {
        console.error('Update education error:', error);
        return { success: false, message: 'Failed to update education.' };
    }
}

export async function deleteEducation(id: string) {
    try {
        await prisma.education.delete({ where: { id } });
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete education error:', error);
        return { success: false, message: 'Failed to delete education.' };
    }
}

// ==================== ACHIEVEMENT ACTIONS ====================

const achievementSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().min(1, 'Date is required'),
    award: z.string().optional(),
});

export async function createAchievement(prevState: any, formData: FormData) {
    const validatedFields = achievementSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        award: formData.get('award'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.achievement.create({
            data: {
                ...validatedFields.data,
                award: validatedFields.data.award || null,
            },
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Achievement created successfully!' };
    } catch (error) {
        console.error('Create achievement error:', error);
        return { success: false, message: 'Failed to create achievement.' };
    }
}

export async function updateAchievement(id: string, prevState: any, formData: FormData) {
    const validatedFields = achievementSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        award: formData.get('award'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.achievement.update({
            where: { id },
            data: {
                ...validatedFields.data,
                award: validatedFields.data.award || null,
            },
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Achievement updated successfully!' };
    } catch (error) {
        console.error('Update achievement error:', error);
        return { success: false, message: 'Failed to update achievement.' };
    }
}

export async function deleteAchievement(id: string) {
    try {
        await prisma.achievement.delete({ where: { id } });
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete achievement error:', error);
        return { success: false, message: 'Failed to delete achievement.' };
    }
}

// ==================== PROFILE ACTIONS ====================

const profileSchema = z.object({
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    careerObjective: z.string().min(10, 'Career Objective must be at least 10 characters'),
    resumeUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    twitterUrl: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
});

export async function updateProfile(prevState: any, formData: FormData) {
    const validatedFields = profileSchema.safeParse({
        bio: formData.get('bio'),
        careerObjective: formData.get('careerObjective'),
        resumeUrl: formData.get('resumeUrl'),
        linkedinUrl: formData.get('linkedinUrl'),
        githubUrl: formData.get('githubUrl'),
        twitterUrl: formData.get('twitterUrl'),
        email: formData.get('email'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // Check if profile exists
        const existingProfile = await prisma.profile.findFirst();

        if (existingProfile) {
            await prisma.profile.update({
                where: { id: existingProfile.id },
                data: validatedFields.data,
            });
        } else {
            await prisma.profile.create({
                data: validatedFields.data,
            });
        }

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, message: 'Failed to update profile.' };
    }
}

// ==================== RESEARCH ACTIONS ====================

const researchSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    abstract: z.string().min(10, 'Abstract must be at least 10 characters'),
    link: z.string().url().optional().or(z.literal('')),
    publicationDate: z.string().min(1, 'Publication Date is required'),
});

export async function createResearch(prevState: any, formData: FormData) {
    const validatedFields = researchSchema.safeParse({
        title: formData.get('title'),
        abstract: formData.get('abstract'),
        link: formData.get('link'),
        publicationDate: formData.get('publicationDate'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.researchPaper.create({
            data: validatedFields.data,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Research paper added successfully!' };
    } catch (error) {
        console.error('Create research error:', error);
        return { success: false, message: 'Failed to add research paper.' };
    }
}

export async function updateResearch(id: string, prevState: any, formData: FormData) {
    const validatedFields = researchSchema.safeParse({
        title: formData.get('title'),
        abstract: formData.get('abstract'),
        link: formData.get('link'),
        publicationDate: formData.get('publicationDate'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.researchPaper.update({
            where: { id },
            data: validatedFields.data,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Research paper updated successfully!' };
    } catch (error) {
        console.error('Update research error:', error);
        return { success: false, message: 'Failed to update research paper.' };
    }
}

export async function deleteResearch(id: string) {
    try {
        await prisma.researchPaper.delete({ where: { id } });
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete research error:', error);
        return { success: false, message: 'Failed to delete research paper.' };
    }
}

// ==================== CERTIFICATION ACTIONS ====================

const certificationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
    credentialUrl: z.string().url().optional().or(z.literal('')),
});

export async function createCertification(prevState: any, formData: FormData) {
    const validatedFields = certificationSchema.safeParse({
        name: formData.get('name'),
        issuer: formData.get('issuer'),
        date: formData.get('date'),
        credentialUrl: formData.get('credentialUrl'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.certification.create({
            data: validatedFields.data,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Certification added successfully!' };
    } catch (error) {
        console.error('Create certification error:', error);
        return { success: false, message: 'Failed to add certification.' };
    }
}

export async function updateCertification(id: string, prevState: any, formData: FormData) {
    const validatedFields = certificationSchema.safeParse({
        name: formData.get('name'),
        issuer: formData.get('issuer'),
        date: formData.get('date'),
        credentialUrl: formData.get('credentialUrl'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.certification.update({
            where: { id },
            data: validatedFields.data,
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Certification updated successfully!' };
    } catch (error) {
        console.error('Update certification error:', error);
        return { success: false, message: 'Failed to update certification.' };
    }
}

export async function deleteCertification(id: string) {
    try {
        await prisma.certification.delete({ where: { id } });
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete certification error:', error);
        return { success: false, message: 'Failed to delete certification.' };
    }
}

// ==================== HERO SETTINGS ACTIONS ====================

const heroSettingsSchema = z.object({
    heading: z.string().min(1, 'Heading is required'),
    subheading: z.string().optional(),
    keywords: z.string(), // Comma-separated keywords
});

export async function updateHeroSettings(prevState: any, formData: FormData) {
    const validatedFields = heroSettingsSchema.safeParse({
        heading: formData.get('heading'),
        subheading: formData.get('subheading'),
        keywords: formData.get('keywords'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { keywords, ...data } = validatedFields.data;
    const keywordsArray = keywords.split(',').map(k => k.trim()).filter(Boolean);

    try {
        const existingSettings = await prisma.heroSettings.findFirst();

        if (existingSettings) {
            await prisma.heroSettings.update({
                where: { id: existingSettings.id },
                data: {
                    ...data,
                    keywords: keywordsArray,
                },
            });
        } else {
            await prisma.heroSettings.create({
                data: {
                    ...data,
                    keywords: keywordsArray,
                },
            });
        }

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true, message: 'Hero settings updated successfully!' };
    } catch (error) {
        console.error('Update hero settings error:', error);
        return { success: false, message: 'Failed to update hero settings.' };
    }
}
