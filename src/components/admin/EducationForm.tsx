import { useState, useEffect, useActionState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { createEducation, updateEducation } from '@/lib/actions';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

interface EducationFormProps {
    onClose: () => void;
    education?: any;
}

export default function EducationForm({ onClose, education }: EducationFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(
        education ? updateEducation.bind(null, education.id) : createEducation,
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
                        {education ? 'Edit Education' : 'Add New Education'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form action={formAction} className="space-y-6">
                    {/* Degree */}
                    <div>
                        <label htmlFor="degree" className="block text-sm font-medium mb-2">
                            Degree *
                        </label>
                        <input
                            type="text"
                            id="degree"
                            name="degree"
                            defaultValue={education?.degree}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="B.E. Computer Science Engineering"
                        />
                        {state?.errors?.degree && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.degree}</p>
                        )}
                    </div>

                    {/* Institution */}
                    <div>
                        <label htmlFor="institution" className="block text-sm font-medium mb-2">
                            Institution *
                        </label>
                        <input
                            type="text"
                            id="institution"
                            name="institution"
                            defaultValue={education?.institution}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Muffakham Jah College of Engineering and Technology"
                        />
                        {state?.errors?.institution && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.institution}</p>
                        )}
                    </div>

                    {/* Period */}
                    <div>
                        <label htmlFor="period" className="block text-sm font-medium mb-2">
                            Period *
                        </label>
                        <input
                            type="text"
                            id="period"
                            name="period"
                            defaultValue={education?.period}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="2024–Present"
                        />
                        {state?.errors?.period && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.period}</p>
                        )}
                    </div>

                    {/* Score */}
                    <div>
                        <label htmlFor="score" className="block text-sm font-medium mb-2">
                            Score/Grade *
                        </label>
                        <input
                            type="text"
                            id="score"
                            name="score"
                            defaultValue={education?.score}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="CGPA / Percentage"
                        />
                        {state?.errors?.score && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.score}</p>
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
                    <SubmitButton isEdit={!!education} />
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
                    <>{isEdit ? 'Update Education' : 'Add Education'}</>
                )}
            </button>
        </div>
    );
}
