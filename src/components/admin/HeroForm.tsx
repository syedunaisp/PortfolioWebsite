'use client';

import { useActionState } from 'react';
import { updateHeroSettings } from '@/lib/actions';
import { Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSettings {
    heading: string;
    subheading: string | null;
    keywords: string[];
}

export default function HeroForm({ settings }: { settings?: HeroSettings | null }) {
    const [state, action, isPending] = useActionState(updateHeroSettings, null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 backdrop-blur-xl border border-glass-border rounded-2xl p-6"
        >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-neon-blue">Hero Section</span>
                <span className="text-gray-500 text-sm font-normal">(Landing Page)</span>
            </h2>

            <form action={action} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="heading" className="text-sm font-medium text-gray-300">
                        Main Heading
                    </label>
                    <input
                        type="text"
                        id="heading"
                        name="heading"
                        defaultValue={settings?.heading || "Welcome to the future"}
                        className="w-full bg-black/20 border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                        placeholder="e.g. Welcome to the future"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="subheading" className="text-sm font-medium text-gray-300">
                        Subheading (Optional)
                    </label>
                    <input
                        type="text"
                        id="subheading"
                        name="subheading"
                        defaultValue={settings?.subheading || ""}
                        className="w-full bg-black/20 border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                        placeholder="e.g. Scroll down to explore"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="keywords" className="text-sm font-medium text-gray-300">
                        Typing Keywords (Comma separated)
                    </label>
                    <textarea
                        id="keywords"
                        name="keywords"
                        defaultValue={settings?.keywords.join(', ') || "Full Stack Developer, UI/UX Designer, Creative Technologist"}
                        className="w-full bg-black/20 border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all min-h-[100px]"
                        placeholder="e.g. Developer, Designer, Creator"
                        required
                    />
                    <p className="text-xs text-gray-500">
                        These words will appear in the typing animation.
                    </p>
                </div>

                {state?.errors && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        <ul className="list-disc list-inside">
                            {Object.entries(state.errors).map(([key, errors]) => (
                                <li key={key}>{errors}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {state?.message && (
                    <div className={`p-4 rounded-lg text-sm ${state.success ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                        {state.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50 rounded-lg px-6 py-3 font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}
