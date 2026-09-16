"use client";

import { useState, useRef } from "react";

interface ProductZoomProps {
  src: string;
  alt: string;
}

export default function ProductZoom({ src, alt }: ProductZoomProps) {
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
    transform: "scale(1)",
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current) return;
    
    // Only pan if we are currently zoomed in
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    if (isZoomed) {
      setIsZoomed(false);
      setZoomStyle({
        transformOrigin: "center center",
        transform: "scale(1)",
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) {
      setIsZoomed(false);
      setZoomStyle({
        transformOrigin: "center center",
        transform: "scale(1)",
      });
    } else if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      setIsZoomed(true);
      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: "scale(2)",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full overflow-hidden bg-white flex items-center justify-center border border-border ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
    >
      {src.toLowerCase().endsWith('.mp4') ? (
        <video
          src={src}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover transition-all duration-500 ease-out"
          style={zoomStyle}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="w-full h-full object-cover select-none transition-all duration-500 ease-out"
          style={zoomStyle}
        />
      )}
    </div>
  );
}
