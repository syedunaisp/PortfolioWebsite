import { useState, useEffect, useActionState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { createAchievement, updateAchievement } from '@/lib/actions';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

interface AchievementFormProps {
    onClose: () => void;
    achievement?: any;
}

export default function AchievementForm({ onClose, achievement }: AchievementFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(
        achievement ? updateAchievement.bind(null, achievement.id) : createAchievement,
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
                        {achievement ? 'Edit Achievement' : 'Add New Achievement'}
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
                            defaultValue={achievement?.title}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="HackRev 2024 — 2nd Place Winner"
                        />
                        {state?.errors?.title && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
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
                            rows={4}
                            defaultValue={achievement?.description}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors resize-none"
                            placeholder="Built and presented a high-impact tech solution..."
                        />
                        {state?.errors?.description && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-2">
                            Date *
                        </label>
                        <input
                            type="text"
                            id="date"
                            name="date"
                            defaultValue={achievement?.date}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="2024"
                        />
                        {state?.errors?.date && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.date}</p>
                        )}
                    </div>

                    {/* Award (Optional) */}
                    <div>
                        <label htmlFor="award" className="block text-sm font-medium mb-2">
                            Award / Prize (Optional)
                        </label>
                        <input
                            type="text"
                            id="award"
                            name="award"
                            defaultValue={achievement?.award || ''}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="₹25,000 Prize"
                        />
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
                    <SubmitButton isEdit={!!achievement} />
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
                    <>{isEdit ? 'Update Achievement' : 'Add Achievement'}</>
                )}
            </button>
        </div>
    );
}
