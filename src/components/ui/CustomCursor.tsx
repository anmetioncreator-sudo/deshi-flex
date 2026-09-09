"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Motion values for coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs for the outer trailing ring
  const ringConfig = { damping: 24, stiffness: 280, mass: 0.35 };
  const ringX = useSpring(cursorX, ringConfig);
  const ringY = useSpring(cursorY, ringConfig);

  // Springs for the slow background spotlight
  const spotlightConfig = { damping: 18, stiffness: 70, mass: 0.8 };
  const spotlightX = useSpring(cursorX, spotlightConfig);
  const spotlightY = useSpring(cursorY, spotlightConfig);

  useEffect(() => {
    // Check if the device is a mobile or touch screen (pointer coarse)
    const checkDevice = () => {
      const hasTouch = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(hasTouch);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track hovered interactive elements
    const addHoverEvents = () => {
      const clickables = document.querySelectorAll(
        'a, button, select, input, textarea, [role="button"], .zoom-img-container, input[type="submit"]'
      );
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Set up MutationObserver to handle dynamically added DOM elements
    addHoverEvents();
    const observer = new MutationObserver(addHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Ambient mouse-tracking spotlight behind all page content */}
      <motion.div
        className="fixed top-0 left-0 w-[450px] h-[450px] rounded-full bg-primary/[0.035] filter blur-[120px] pointer-events-none z-[-10] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: spotlightX,
          y: spotlightY,
        }}
      />
      {/* Inner solid silver dot (zero latency) */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
      {/* Outer trailing translucent silver ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-primary/50 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          width: isHovered ? 44 : 28,
          height: isHovered ? 44 : 28,
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0)",
        }}
        transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
      />
    </>
  );
}
