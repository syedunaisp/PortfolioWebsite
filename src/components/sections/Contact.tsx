'use client';

import { useRef, useActionState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, Mail, MapPin, Loader2, Github, Linkedin, Twitter, FileText } from 'lucide-react';
import { sendContactMessage } from '@/lib/actions';
import { useFormStatus } from 'react-dom';

import { cn } from '@/lib/utils';

export default function Contact({ profile, className }: { profile: any, className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(sendContactMessage, null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state?.success]);

    return (
        <section id="contact" ref={containerRef} className={cn("min-h-screen flex items-center justify-center py-20 relative", className)}>
            <div className="container mx-auto px-4 relative z-10">
                <motion.div style={{ y }} className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                            Let's Connect
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Have a project in mind or just want to say hi? I'm always open to discussing new ideas and opportunities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info & Socials */}
                        <div className="space-y-8">
                            <div className="p-8 rounded-3xl border border-glass-border bg-glass-bg backdrop-blur-md">
                                <h3 className="text-2xl font-bold text-white mb-6">Contact Info</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <div className="p-3 rounded-xl bg-neon-purple/10 text-neon-purple">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <a href={`mailto:${profile?.email || 'hello@example.com'}`} className="hover:text-neon-purple transition-colors">
                                                {profile?.email || 'hello@example.com'}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <div className="p-3 rounded-xl bg-neon-blue/10 text-neon-blue">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p>Hyderabad, India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="grid grid-cols-2 gap-4">
                                {profile?.githubUrl && (
                                    <a
                                        href={profile.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-2xl border border-glass-border bg-card/30 hover:bg-card/50 hover:border-neon-purple/50 transition-all flex items-center gap-3 group"
                                    >
                                        <Github className="text-gray-400 group-hover:text-white transition-colors" />
                                        <span className="text-gray-400 group-hover:text-white transition-colors">GitHub</span>
                                    </a>
                                )}
                                {profile?.linkedinUrl && (
                                    <a
                                        href={profile.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-2xl border border-glass-border bg-card/30 hover:bg-card/50 hover:border-neon-blue/50 transition-all flex items-center gap-3 group"
                                    >
                                        <Linkedin className="text-gray-400 group-hover:text-white transition-colors" />
                                        <span className="text-gray-400 group-hover:text-white transition-colors">LinkedIn</span>
                                    </a>
                                )}
                                {profile?.twitterUrl && (
                                    <a
                                        href={profile.twitterUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-2xl border border-glass-border bg-card/30 hover:bg-card/50 hover:border-neon-pink/50 transition-all flex items-center gap-3 group"
                                    >
                                        <Twitter className="text-gray-400 group-hover:text-white transition-colors" />
                                        <span className="text-gray-400 group-hover:text-white transition-colors">Twitter</span>
                                    </a>
                                )}
                                {profile?.resumeUrl && (
                                    <a
                                        href={profile.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-2xl border border-glass-border bg-card/30 hover:bg-card/50 hover:border-neon-teal/50 transition-all flex items-center gap-3 group"
                                    >
                                        <FileText className="text-gray-400 group-hover:text-white transition-colors" />
                                        <span className="text-gray-400 group-hover:text-white transition-colors">Resume</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="p-8 rounded-3xl border border-glass-border bg-glass-bg backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-[50px] -z-10" />

                            <form ref={formRef} action={formAction} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-xl focus:outline-none focus:border-neon-purple transition-colors text-white placeholder-gray-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-xl focus:outline-none focus:border-neon-purple transition-colors text-white placeholder-gray-600"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-xl focus:outline-none focus:border-neon-purple transition-colors text-white placeholder-gray-600 resize-none"
                                        placeholder="Your message..."
                                    />
                                </div>

                                {state?.success && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500 text-sm">
                                        {state.message}
                                    </div>
                                )}
                                {state?.success === false && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                                        {state.message}
                                    </div>
                                )}

                                <SubmitButton />
                            </form>
                        </div>
                    </div>
                </motion.div >
            </div >
        </section >
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                </>
            ) : (
                <>
                    Send Message
                    <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
            )}
        </button>
    );
}
