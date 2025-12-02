'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { createSkill, updateSkill } from '@/lib/actions';

interface SkillFormProps {
    onClose: () => void;
    skill?: any;
}

import { useRouter } from 'next/navigation';

export default function SkillForm({ onClose, skill }: SkillFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(
        skill ? updateSkill.bind(null, skill.id) : createSkill,
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
                className="bg-card border border-glass-border rounded-2xl p-8 max-w-lg w-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                        {skill ? 'Edit Skill' : 'Add New Skill'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form action={formAction} className="space-y-6">
                    {/* Skill Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Skill Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={skill?.name}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="React, Python, Docker..."
                        />
                        {state?.errors?.name && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-2">
                            Category *
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            list="categories"
                            defaultValue={skill?.category}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Select or type a category..."
                        />
                        <datalist id="categories">
                            <option value="Programming Languages" />
                            <option value="Machine Learning" />
                            <option value="Web Development" />
                            <option value="Data Visualization" />
                            <option value="Tools" />
                            <option value="DevOps" />
                            <option value="Design" />
                        </datalist>
                        {state?.errors?.category && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.category}</p>
                        )}
                    </div>

                    {/* Proficiency */}
                    <div>
                        <label htmlFor="proficiency" className="block text-sm font-medium mb-2">
                            Proficiency Level (0-100) *
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                id="proficiency"
                                name="proficiency"
                                min="0"
                                max="100"
                                defaultValue={skill?.proficiency || 50}
                                className="flex-1"
                                onInput={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    const output = document.getElementById('proficiency-value');
                                    if (output) output.textContent = target.value + '%';
                                }}
                            />
                            <span
                                id="proficiency-value"
                                className="text-neon-purple font-bold w-12 text-right"
                            >
                                {skill?.proficiency || 50}%
                            </span>
                        </div>
                        {state?.errors?.proficiency && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.proficiency}</p>
                        )}
                    </div>

                    {/* Icon (optional) */}
                    <div>
                        <label htmlFor="icon" className="block text-sm font-medium mb-2">
                            Icon (Lucide icon name - optional)
                        </label>
                        <input
                            type="text"
                            id="icon"
                            name="icon"
                            defaultValue={skill?.icon || ''}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Code, Database, Zap..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Find icons at{' '}
                            <a
                                href="https://lucide.dev/icons"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neon-blue hover:underline"
                            >
                                lucide.dev
                            </a>
                        </p>
                    </div>

                    {/* Color */}
                    <div>
                        <label htmlFor="color" className="block text-sm font-medium mb-2">
                            Color *
                        </label>
                        <select
                            id="color"
                            name="color"
                            defaultValue={skill?.color || ''}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                        >
                            <option value="">Default (Category Color)</option>
                            <option value="#00d9ff" style={{ color: '#00d9ff' }}>🔵 Cyan</option>
                            <option value="#a855f7" style={{ color: '#a855f7' }}>🟣 Purple</option>
                            <option value="#f59e0b" style={{ color: '#f59e0b' }}>🟡 Amber/Yellow</option>
                            <option value="#10b981" style={{ color: '#10b981' }}>🟢 Emerald/Green</option>
                            <option value="#ef4444" style={{ color: '#ef4444' }}>🔴 Red</option>
                            <option value="#ec4899" style={{ color: '#ec4899' }}>🩷 Pink</option>
                        </select>
                        {state?.errors?.color && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.color}</p>
                        )}
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isVisible"
                            name="isVisible"
                            defaultChecked={skill?.isVisible ?? true}
                            className="w-5 h-5 rounded border-glass-border bg-black/30 text-neon-blue focus:ring-neon-blue"
                        />
                        <label htmlFor="isVisible" className="text-sm font-medium">
                            Show on homepage
                        </label>
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
                    <SubmitButton isEdit={!!skill} />
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
                    <>{isEdit ? 'Update Skill' : 'Create Skill'}</>
                )}
            </button>
        </div>
    );
}
