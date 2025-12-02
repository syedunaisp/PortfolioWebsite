'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export const AIHudCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Mouse position motion values
    const mouseX = useMotionValue(-100); // Start off-screen
    const mouseY = useMotionValue(-100);

    // Smooth physics for the cursor movement (slight delay)
    const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Reset idle timer
            setIsIdle(false);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => setIsIdle(true), 4000);

            // Check hover state
            const target = e.target as Element;
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.classList.contains('cursor-pointer');

            setIsHovering(!!isClickable);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Main Cursor Container */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="absolute top-0 left-0 flex items-center justify-center mix-blend-difference"
            >
                {/* 1. Central White Dot */}
                <motion.div
                    className="h-1 w-1 rounded-full bg-white"
                    animate={{
                        scale: isHovering ? 0.5 : 1,
                    }}
                />

                {/* 2. Neon Glowing Hexagon/Reticle */}
                <motion.div
                    className="absolute border border-neon-cyan shadow-[0_0_10px_var(--neon-cyan)]"
                    style={{
                        width: '40px',
                        height: '40px',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', // Hexagon shape
                    }}
                    animate={{
                        scale: isHovering ? 1.6 : 1,
                        rotate: isHovering ? 180 : 0,
                        opacity: isIdle ? 0.5 : 1,
                    }}
                    transition={{
                        scale: { duration: 0.3 },
                        rotate: { duration: isHovering ? 0.5 : 0, ease: "linear", repeat: isHovering ? Infinity : 0 },
                        opacity: { duration: 0.5, repeat: isIdle ? Infinity : 0, repeatType: "reverse" }
                    }}
                >
                    {/* Radar Sweep Animation inside the ring */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-transparent via-neon-cyan/20 to-transparent"
                        animate={{ top: ['100%', '-100%'] }}
                        transition={{
                            duration: isHovering ? 1.2 : 6,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </motion.div>

                {/* 3. Click Shockwave Pulse */}
                <AnimatePresence>
                    {isClicking && (
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 4, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute rounded-full border border-neon-violet"
                            style={{ width: '40px', height: '40px' }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
