'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    // Scroll progress (0 to 1)
    const scrollProgress = useMotionValue(0);

    const scrollbarRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    useEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        setLenis(lenisInstance);

        function raf(time: number) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        const resize = () => {
            setDimension({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', resize);
        resize();

        // Update scroll progress on scroll
        lenisInstance.on('scroll', (e: any) => {
            const progress = e.scroll / (document.documentElement.scrollHeight - window.innerHeight);
            scrollProgress.set(isNaN(progress) ? 0 : progress);
        });

        return () => {
            lenisInstance.destroy();
            window.removeEventListener('resize', resize);
        };
    }, []);

    // Handle Drag Logic
    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!isDragging.current || !lenis || !scrollbarRef.current || !thumbRef.current) return;

            e.preventDefault();

            const trackRect = scrollbarRef.current.getBoundingClientRect();
            const trackHeight = trackRect.height;
            const thumbHeight = thumbRef.current.clientHeight;
            const scrollableHeight = trackHeight - thumbHeight;

            // Calculate relative Y position of pointer within track
            // We subtract half thumb height to center the thumb on the pointer
            const relativeY = e.clientY - trackRect.top - (thumbHeight / 2);

            // Clamp value
            const clampedY = Math.max(0, Math.min(relativeY, scrollableHeight));

            // Calculate progress
            const progress = clampedY / scrollableHeight;

            // Scroll Lenis
            const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            lenis.scrollTo(progress * totalScrollHeight, { immediate: true });
        };

        const handlePointerUp = () => {
            isDragging.current = false;
            document.body.style.userSelect = ''; // Re-enable selection
            document.body.style.cursor = ''; // Reset cursor
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [lenis]);

    // Map scroll progress to thumb position
    const thumbY = useTransform(scrollProgress, [0, 1], [0, dimension.height - (dimension.height * 0.1)]);

    return (
        <div className="relative w-full">
            {children}

            {/* Custom Scrollbar Track */}
            <div
                ref={scrollbarRef}
                className="fixed top-0 right-0 h-full w-2 z-[9999] mix-blend-difference"
            >
                {/* Custom Scrollbar Thumb */}
                <motion.div
                    ref={thumbRef}
                    style={{ y: thumbY, height: '10%' }}
                    className={cn(
                        "w-full rounded-full bg-neon-blue/50 hover:bg-neon-blue transition-colors duration-300 backdrop-blur-md",
                        "border border-white/20 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                    )}
                    onPointerDown={(e) => {
                        isDragging.current = true;
                        document.body.style.userSelect = 'none'; // Prevent text selection while dragging
                        // We don't set cursor here because we want to keep the custom cursor active
                    }}
                />
            </div>
        </div>
    );
}
