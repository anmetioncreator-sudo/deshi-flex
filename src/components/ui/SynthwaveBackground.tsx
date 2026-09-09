"use client";

import React from 'react';

export default function SynthwaveBackground() {
  return (
    <div className="fixed inset-0 z-[-50] overflow-hidden bg-[#000000] pointer-events-none selection:bg-transparent">
      {/* Deep Space Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#050505] to-[#000000] opacity-90" />
      
      {/* Synthwave Sun */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full" 
           style={{
             background: 'linear-gradient(to bottom, #FFFFFF 0%, #888888 50%, #222222 100%)',
             boxShadow: '0 0 100px rgba(255,255,255,0.8), 0 0 200px rgba(255,255,255,0.4)',
             opacity: 0.85
           }}>
        {/* Sun cutouts for classic retro-wave look */}
        <div className="absolute bottom-0 w-full h-[40%] flex flex-col justify-end gap-2 pb-4">
          <div className="w-full h-1 bg-[#000000]" />
          <div className="w-full h-2 bg-[#000000]" />
          <div className="w-full h-3 bg-[#000000]" />
          <div className="w-full h-4 bg-[#000000]" />
          <div className="w-full h-6 bg-[#000000]" />
        </div>
      </div>
      
      {/* Perspective Neon Grid */}
      <div 
        className="absolute bottom-0 left-[-50%] right-[-50%] h-[55vh]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(to top, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(600px) rotateX(75deg)',
          transformOrigin: 'top',
          animation: 'grid-move 4s linear infinite',
          boxShadow: 'inset 0 100px 100px #000000' // fade out at the horizon
        }}
      />

      {/* Grid fade out at the horizon */}
      <div className="absolute top-[45%] left-0 right-0 h-[10vh] bg-gradient-to-b from-transparent to-[#000000]" />
      
      {/* Ambient glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF]/10 via-transparent to-[#FFFFFF]/5 pointer-events-none mix-blend-screen" />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
      `}} />
    </div>
  );
}
