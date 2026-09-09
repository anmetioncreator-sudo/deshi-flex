"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';

function PreviewWrapperContent({ children }: { children: React.ReactNode }) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isIframe, setIsIframe] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

  // If we are already inside the iframe, just render the content normally without toggles
  if (isIframe) {
    return <>{children}</>;
  }

  const toggleButtons = (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1 p-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl">
      <button 
        onClick={() => setPreviewMode('desktop')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded ${previewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
      >
        <Monitor className="w-3 h-3" /> Desktop
      </button>
      <button 
        onClick={() => setPreviewMode('mobile')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded ${previewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
      >
        <Smartphone className="w-3 h-3" /> Mobile
      </button>
    </div>
  );

  if (previewMode === 'desktop') {
    return (
      <>
        {children}
        {toggleButtons}
      </>
    );
  }

  // Construct URL for iframe
  const queryString = searchParams ? searchParams.toString() : '';
  const iframeUrl = queryString ? `${pathname}?${queryString}` : pathname;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative w-full overflow-hidden">
      {toggleButtons}
      <div 
        className="w-[375px] h-[812px] bg-background border-[12px] border-zinc-900 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col ring-1 ring-white/20 my-8 shrink-0"
        style={{ contain: 'layout paint' }}
      >
        <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 rounded-b-xl w-32 mx-auto z-[999]"></div>
        <iframe 
          src={iframeUrl} 
          className="w-full h-full border-none bg-background custom-scrollbar rounded-[1.5rem]"
          title="Mobile Preview"
        />
      </div>
    </div>
  );
}

export default function PreviewWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <PreviewWrapperContent>{children}</PreviewWrapperContent>
    </Suspense>
  );
}
