'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { createResearch, updateResearch } from '@/lib/actions';

interface ResearchFormProps {
    onClose: () => void;
    research?: any;
}

export default function ResearchForm({ onClose, research }: ResearchFormProps) {
    const [state, formAction] = useActionState(
        research ? updateResearch.bind(null, research.id) : createResearch,
        null
    );

    // Close modal and refresh on success
    useEffect(() => {
        if (state?.success) {
            setTimeout(() => {
                onClose();
            }, 1000);
        }
    }, [state?.success, onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-glass-border rounded-2xl p-8 max-w-lg w-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                        {research ? 'Edit Research Paper' : 'Add Research Paper'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form action={formAction} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={research?.title}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Research Paper Title"
                        />
                        {state?.errors?.title && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
                        )}
                    </div>

                    {/* Abstract */}
                    <div>
                        <label htmlFor="abstract" className="block text-sm font-medium mb-2">
                            Abstract *
                        </label>
                        <textarea
                            id="abstract"
                            name="abstract"
                            rows={4}
                            defaultValue={research?.abstract}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Brief summary of the research..."
                        />
                        {state?.errors?.abstract && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.abstract}</p>
                        )}
                    </div>

                    {/* Publication Date */}
                    <div>
                        <label htmlFor="publicationDate" className="block text-sm font-medium mb-2">
                            Publication Date *
                        </label>
                        <input
                            type="text"
                            id="publicationDate"
                            name="publicationDate"
                            defaultValue={research?.publicationDate}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="e.g., Oct 2024"
                        />
                        {state?.errors?.publicationDate && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.publicationDate}</p>
                        )}
                    </div>

                    {/* Link */}
                    <div>
                        <label htmlFor="link" className="block text-sm font-medium mb-2">
                            Link (Optional)
                        </label>
                        <input
                            type="url"
                            id="link"
                            name="link"
                            defaultValue={research?.link || ''}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="https://doi.org/..."
                        />
                        {state?.errors?.link && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.link}</p>
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
                    <SubmitButton isEdit={!!research} />
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
                    <>{isEdit ? 'Update Research' : 'Add Research'}</>
                )}
            </button>
        </div>
    );
}
