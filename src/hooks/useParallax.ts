import { useState, useEffect } from 'react';
import { useMotionValue, useTransform } from 'framer-motion';

export function useParallax(sensitivity = 1) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            // Normalize mouse position from -1 to 1
            const x = (e.clientX / innerWidth) * 2 - 1;
            const y = (e.clientY / innerHeight) * 2 - 1;

            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Calculate transforms based on sensitivity
    // x/y are for translation (parallax)
    // rotateX/rotateY are for 3D tilt (robot tracking)

    // Note: rotateX should react to Y movement (looking up/down rotates around X axis)
    // rotateY should react to X movement (looking left/right rotates around Y axis)

    const x = useTransform(mouseX, [-1, 1], [-20 * sensitivity, 20 * sensitivity]);
    const y = useTransform(mouseY, [-1, 1], [-20 * sensitivity, 20 * sensitivity]);

    const rotateX = useTransform(mouseY, [-1, 1], [10 * sensitivity, -10 * sensitivity]); // Inverted for natural look
    const rotateY = useTransform(mouseX, [-1, 1], [-10 * sensitivity, 10 * sensitivity]);

    return { x, y, rotateX, rotateY, mouseX, mouseY };
}
