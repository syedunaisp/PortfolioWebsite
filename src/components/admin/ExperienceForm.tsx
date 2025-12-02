'use client';

import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { createExperience, updateExperience } from '@/lib/actions';
import { useFormStatus } from 'react-dom';

interface ExperienceFormProps {
    onClose: () => void;
    experience?: any;
}

import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

export default function ExperienceForm({ onClose, experience }: ExperienceFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(
        experience ? updateExperience.bind(null, experience.id) : createExperience,
        null
    );

    // Close modal and refresh on success
    useEffect(() => {
        if (state?.success) {
            router.refresh();
            setTimeout(() => {
                onClose();
            }, 1000);
        }
    }, [state?.success, router, onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-glass-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                        {experience ? 'Edit Experience' : 'Add New Experience'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form action={formAction} className="space-y-6">
                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium mb-2">
                            Role/Position *
                        </label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            defaultValue={experience?.role}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Senior Frontend Developer"
                        />
                        {state?.errors?.role && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.role}</p>
                        )}
                    </div>

                    {/* Company */}
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-2">
                            Company/Organization *
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            defaultValue={experience?.company}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Tech Corp Inc."
                        />
                        {state?.errors?.company && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.company}</p>
                        )}
                    </div>

                    {/* Period */}
                    <div>
                        <label htmlFor="period" className="block text-sm font-medium mb-2">
                            Time Period *
                        </label>
                        <input
                            type="text"
                            id="period"
                            name="period"
                            defaultValue={experience?.period}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Jan 2022 - Present"
                        />
                        {state?.errors?.period && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.period}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={5}
                            defaultValue={experience?.description}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors resize-none"
                            placeholder="Describe your role, responsibilities, and achievements..."
                        />
                        {state?.errors?.description && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
                        )}
                    </div>

                    {/* Success/Error Messages */}
                    {state?.success && (
                        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500">
                            {state.message}
                        </div>
                    )}
                    {state?.success === false && state?.message && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                            {state.message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <SubmitButton isEdit={!!experience} />
                </form>
            </motion.div>
        </div>
    );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();

    return (
        <div className="flex gap-3 pt-4">
            <button
                type="submit"
                disabled={pending}
                className="flex-1 px-6 py-3 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {pending ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        {isEdit ? 'Updating...' : 'Creating...'}
                    </>
                ) : (
                    <>{isEdit ? 'Update Experience' : 'Create Experience'}</>
                )}
            </button>
        </div>
    );
}
