'use client';

import { motion } from 'framer-motion';

export default function DigitalHorizon() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-background">
            {/* 1. Moving Grid Floor */}
            <div className="absolute inset-0 perspective-1000">
                <motion.div
                    className="absolute bottom-0 left-[-50%] right-[-50%] h-[200%] origin-bottom"
                    style={{
                        backgroundSize: '50px 50px',
                        backgroundImage: `
                            linear-gradient(to right, rgba(0, 234, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 234, 255, 0.1) 1px, transparent 1px)
                        `,
                        transform: 'rotateX(60deg)',
                    }}
                    animate={{
                        backgroundPosition: ['0px 0px', '0px 50px'],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {/* Fade out at the top (horizon) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-background/50 to-background" />
                </motion.div>
            </div>

            {/* 2. Floating Wireframe Shapes */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute border border-neon-purple/20"
                    style={{
                        width: Math.random() * 50 + 20,
                        height: Math.random() * 50 + 20,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        rotate: [0, 180, 360],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}

            {/* 3. Upward Floating Data Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={`p-${i}`}
                    className="absolute w-1 h-1 bg-neon-blue rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: '100%',
                    }}
                    animate={{
                        y: [0, -1000],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 3,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
