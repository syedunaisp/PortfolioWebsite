'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Loader2, Save } from 'lucide-react';
import { updateProfile } from '@/lib/actions';

interface ProfileFormProps {
    onClose: () => void;
    profile?: any;
}

export default function ProfileForm({ onClose, profile }: ProfileFormProps) {
    const [state, formAction] = useActionState(updateProfile, null);

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
                className="bg-card border border-glass-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Edit Profile</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form action={formAction} className="space-y-6">
                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium mb-2">
                            Bio *
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            defaultValue={profile?.bio}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Tell us about yourself..."
                        />
                        {state?.errors?.bio && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.bio}</p>
                        )}
                    </div>

                    {/* Career Objective */}
                    <div>
                        <label htmlFor="careerObjective" className="block text-sm font-medium mb-2">
                            Career Objective *
                        </label>
                        <textarea
                            id="careerObjective"
                            name="careerObjective"
                            rows={3}
                            defaultValue={profile?.careerObjective}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="What are your professional goals?"
                        />
                        {state?.errors?.careerObjective && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.careerObjective}</p>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                defaultValue={profile?.email || ''}
                                className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                                placeholder="contact@example.com"
                            />
                            {state?.errors?.email && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="resumeUrl" className="block text-sm font-medium mb-2">
                                Resume URL
                            </label>
                            <input
                                type="url"
                                id="resumeUrl"
                                name="resumeUrl"
                                defaultValue={profile?.resumeUrl || ''}
                                className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                                placeholder="https://..."
                            />
                            {state?.errors?.resumeUrl && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.resumeUrl}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="linkedinUrl" className="block text-sm font-medium mb-2">
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                id="linkedinUrl"
                                name="linkedinUrl"
                                defaultValue={profile?.linkedinUrl || ''}
                                className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                                placeholder="https://linkedin.com/in/..."
                            />
                            {state?.errors?.linkedinUrl && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.linkedinUrl}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="githubUrl" className="block text-sm font-medium mb-2">
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                id="githubUrl"
                                name="githubUrl"
                                defaultValue={profile?.githubUrl || ''}
                                className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                                placeholder="https://github.com/..."
                            />
                            {state?.errors?.githubUrl && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.githubUrl}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="twitterUrl" className="block text-sm font-medium mb-2">
                                Twitter/X URL
                            </label>
                            <input
                                type="url"
                                id="twitterUrl"
                                name="twitterUrl"
                                defaultValue={profile?.twitterUrl || ''}
                                className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                                placeholder="https://twitter.com/..."
                            />
                            {state?.errors?.twitterUrl && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.twitterUrl}</p>
                            )}
                        </div>
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
                    <SubmitButton />
                </form>
            </motion.div>
        </div>
    );
}

function SubmitButton() {
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
                        Saving...
                    </>
                ) : (
                    <>
                        <Save size={18} />
                        Save Profile
                    </>
                )}
            </button>
        </div>
    );
}
