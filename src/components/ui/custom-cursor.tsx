'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Use MotionValues for high-performance updates
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Direct mapping for instant response (no bounce/lag)
    const cursorX = mouseX;
    const cursorY = mouseY;

    // Ref to track current position for scroll handler
    const mousePosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setIsVisible(true);
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };

        const checkHoverState = (target: Element | null) => {
            if (!target) {
                setIsHovering(false);
                return;
            }

            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.classList.contains('cursor-pointer');

            setIsHovering(!!isClickable);
        };

        const handleMouseOver = (e: MouseEvent) => {
            checkHoverState(e.target as Element);
        };

        const handleScroll = () => {
            if (mousePosRef.current.x === 0 && mousePosRef.current.y === 0) return;

            const element = document.elementFromPoint(mousePosRef.current.x, mousePosRef.current.y);
            checkHoverState(element);
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            {/* Center Dot (Crosshair) */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0
                }}
                animate={{
                    scale: isHovering ? 0.5 : 1,
                }}
            />

            {/* Outer Rotating Diamond */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-dashed border-neon-blue pointer-events-none z-[9999]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    borderColor: 'var(--primary)',
                    borderWidth: '1px',
                    opacity: isVisible ? (isHovering ? 1 : 0.5) : 0
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    rotate: isHovering ? 225 : 45,
                    borderRadius: isHovering ? "50%" : "0%"
                }}
                transition={{
                    rotate: {
                        duration: 1,
                        ease: "linear",
                        repeat: isHovering ? Infinity : 0
                    },
                    borderRadius: {
                        duration: 0.3
                    },
                    scale: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }
                }}
            />

            {/* Trailing Glow (Optional) */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9998]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    backgroundColor: 'var(--primary-glow)',
                    filter: 'blur(4px)',
                    opacity: isVisible && isHovering ? 0.5 : 0
                }}
                animate={{
                    scale: isHovering ? 2 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
            />
        </>
    );
};
