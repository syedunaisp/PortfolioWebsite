'use client';

import { motion } from 'framer-motion';

interface GlitchTextProps {
    text: string;
    className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
    return (
        <div className={`relative inline-block group ${className}`}>
            <motion.span
                className="relative z-10 block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {text}
            </motion.span>
            <span
                className="absolute top-0 left-0 -z-10 w-full h-full text-neon-blue opacity-0 group-hover:opacity-70 animate-glitch"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, -2px)' }}
                aria-hidden="true"
            >
                {text}
            </span>
            <span
                className="absolute top-0 left-0 -z-10 w-full h-full text-neon-pink opacity-0 group-hover:opacity-70 animate-glitch"
                style={{ clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)', transform: 'translate(2px, 2px)', animationDirection: 'reverse' }}
                aria-hidden="true"
            >
                {text}
            </span>
        </div>
    );
}
