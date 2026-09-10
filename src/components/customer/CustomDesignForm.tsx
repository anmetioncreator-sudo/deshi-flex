"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Order, DesignType, AdvanceTier, DIVISIONS } from '@/types';
import { Upload, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

function CustomSelect({ value, onChange, options, searchable = false, placeholder = "Select an option" }: { value: string, onChange: (val: string) => void, options: string[], searchable?: boolean, placeholder?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = searchable 
    ? options.filter(opt => opt.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div className="relative w-full mb-4" ref={selectRef}>
      <div 
        onClick={() => { setIsOpen(!isOpen); setQuery(''); }}
        className="w-full industrial-input p-2.5 text-sm flex justify-between items-center cursor-pointer bg-background"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <>

          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border max-h-72 overflow-hidden shadow-2xl flex flex-col rounded-lg">
            {searchable && (
              <div className="p-2 border-b border-border bg-background z-30">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Type to search..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-muted/20 text-foreground p-3 text-sm outline-none border border-border focus:border-primary transition-colors rounded"
                />
              </div>
            )}
            <div className="overflow-y-auto overscroll-contain max-h-48 custom-scrollbar">
              {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                <div 
                  key={opt}
                  className={`p-3 cursor-pointer transition-colors hover:bg-muted/40 ${value === opt ? 'bg-primary/20 text-primary font-bold' : 'text-foreground/80 hover:text-foreground'}`}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  {opt}
                </div>
              )) : (
                <div className="p-4 text-muted-foreground text-sm text-center italic">No divisions found matching your search.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const getContrastBg = (hex: string) => {
  const lightColors = ['#f5f5f7', '#fffdd0', '#f8f4e6', '#e6e6fa'];
  return lightColors.includes(hex.toLowerCase()) ? '#171717' : '#f5f5f7';
};

const PrintSizeGuide = () => {
  return (
    <div className="bg-[#111111] border border-border/30 shadow-2xl rounded-xl p-6 lg:p-8 space-y-6 max-w-md mx-auto w-full mb-8 mt-4">
      <div className="border-b border-border/30 pb-4 text-center">
        <h3 className="text-2xl font-bebas tracking-widest text-white uppercase" style={{ textShadow: '-1px 0 0 #ff5500, 1px 0 0 #00d2ff' }}>Print Size Guide</h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">Standard Dimension Chart</p>
      </div>
      
      <div className="relative w-full aspect-[4/5] bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden border border-border/20 max-w-[320px] mx-auto drop-shadow-md">
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ backgroundColor: '#cfa9e6', maskImage: 'url(/mockup-front.png?v=2)', maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat', WebkitMaskImage: 'url(/mockup-front.png?v=2)', WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat' }} />
        <img src="/mockup-front.png?v=2" alt="Mockup" className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-multiply opacity-80" />
        
        <div className="absolute top-[32%] left-1/2 -translate-x-1/2 flex flex-col items-center w-[38%]">
          <div className="relative w-full border border-white flex flex-col items-center bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)]" style={{ aspectRatio: '1/1.414' }}>
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-[12px] leading-none font-bold text-white drop-shadow-md">A2</span>
              <span className="text-[7px] leading-none font-bold text-white/90 uppercase mt-[1px] whitespace-nowrap">400 mm</span>
            </div>
            
            <div className="relative w-[75%] mt-[12.5%] border border-white flex flex-col items-center" style={{ aspectRatio: '1/1.414' }}>
              <div className="absolute bottom-[2px] flex flex-col items-center">
                <span className="text-[10px] leading-none font-bold text-white drop-shadow-md">A3</span>
                <span className="text-[6px] leading-none font-bold text-white/90 uppercase mt-[1px] whitespace-nowrap">300 mm</span>
              </div>
              
              <div className="relative w-[70%] mt-[15%] border border-white flex flex-col items-center" style={{ aspectRatio: '1/1.414' }}>
                <div className="absolute bottom-[2px] flex flex-col items-center">
                  <span className="text-[8px] leading-none font-bold text-white drop-shadow-md">A4</span>
                  <span className="text-[5px] leading-none font-bold text-white/90 uppercase mt-[1px] whitespace-nowrap">210 mm</span>
                </div>
                
                <div className="relative w-[50%] mt-[25%] border border-white flex flex-col items-center" style={{ aspectRatio: '1/1.414' }}>
                  <div className="absolute bottom-[1px] flex flex-col items-center">
                    <span className="text-[6px] leading-none font-bold text-white drop-shadow-md">A6</span>
                    <span className="text-[4px] leading-none font-bold text-white/90 uppercase mt-[1px] whitespace-nowrap">105 mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 text-xs font-mono uppercase tracking-widest text-muted-foreground mt-8 text-center bg-black/40 p-4 rounded border border-border/20">
        <p className="flex justify-between border-b border-border/20 pb-2"><span className="text-white font-bold">A6</span> <span>Left Chest / Small</span></p>
        <p className="flex justify-between border-b border-border/20 pb-2"><span className="text-white font-bold">A4</span> <span>Standard Print</span></p>
        <p className="flex justify-between border-b border-border/20 pb-2"><span className="text-white font-bold">A3</span> <span>Large Graphic</span></p>
        <p className="flex justify-between"><span className="text-white font-bold">A2</span> <span>Full Back / Oversize</span></p>
      </div>
    </div>
  );
};

export default function CustomDesignForm() {
  const addOrder = useStore((state) => state.addOrder);
  const [designType, setDesignType] = useState<DesignType>('Drop Shoulder');
  const [frontPrintSize, setFrontPrintSize] = useState('A4');
  const [backPrintSize, setBackPrintSize] = useState('A4');
  const [materials, setMaterials] = useState('');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState<Order['region']>('');
  const [area, setArea] = useState('');
  const [deliveryType, setDeliveryType] = useState('Home');
  const [advancePaid, setAdvancePaid] = useState<AdvanceTier>(300);
  const [customAdvanceAmount, setCustomAdvanceAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [frontImageName, setFrontImageName] = useState<string | null>(null);
  const [backImageName, setBackImageName] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [tshirtColor, setTshirtColor] = useState('#111111');
  const [frontScale, setFrontScale] = useState(1);
  const [backScale, setBackScale] = useState(1);
  const [frontPos, setFrontPos] = useState({ x: 0, y: 0 });
  const [backPos, setBackPos] = useState({ x: 0, y: 0 });
  const frontConstraintsRef = useRef(null);
  const backConstraintsRef = useRef(null);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [frontCustomWidth, setFrontCustomWidth] = useState<number | ''>('');
  const [frontCustomHeight, setFrontCustomHeight] = useState<number | ''>('');
  const [backCustomWidth, setBackCustomWidth] = useState<number | ''>('');
  const [backCustomHeight, setBackCustomHeight] = useState<number | ''>('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFrontImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFrontFile(e.target.files[0]);
      setFrontImageName(e.target.files[0].name);
      setFrontImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleBackImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackFile(e.target.files[0]);
      setBackImageName(e.target.files[0].name);
      setBackImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const getPrintPrice = (size: string, customW: number | '', customH: number | '') => {
    switch (size) {
      case 'A6': return 15;
      case 'A5': return 25;
      case 'A4': return 45;
      case 'A3': return 90;
      case 'A2': return 200;
      case 'Custom':
        if (typeof customW === 'number' && typeof customH === 'number') {
          return customW * customH * 0.50;
        }
        return 0;
      default: return 0;
    }
  };

  const rawTshirtPrice = 590;
  const frontPrice = frontImagePreview ? getPrintPrice(frontPrintSize, frontCustomWidth, frontCustomHeight) : 0;
  const backPrice = backImagePreview ? getPrintPrice(backPrintSize, backCustomWidth, backCustomHeight) : 0;
  const totalPrice = rawTshirtPrice + frontPrice + backPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      let finalFrontName = frontImageName;
      let finalBackName = backImageName;

      if (frontFile) {
        const formData = new FormData();
        formData.append('file', frontFile);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Upload failed: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.success) finalFrontName = data.filename;
      }

      if (backFile) {
        const formData = new FormData();
        formData.append('file', backFile);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Upload failed: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.success) finalBackName = data.filename;
      }

      const actualAdvance = advancePaid === 'Custom' ? Number(customAdvanceAmount) : advancePaid;
      const priceBreakdownStr = `\n\n--- Price Breakdown ---\nRaw T-Shirt: ${rawTshirtPrice} TK\n` +
        (frontImagePreview ? `Front Print (${frontPrintSize}): ${frontPrice} TK\n` : '') +
        (backImagePreview ? `Back Print (${backPrintSize}): ${backPrice} TK\n` : '') +
        `Total Estimated Price: ${totalPrice} TK`;

      const newOrder: Order = {
        id: `CUST-${Date.now().toString().slice(-6)}`,
        type: advancePaid === 400 ? 'Full Image Custom' : 'Standard Custom',
        date: new Date().toISOString(),
        fullName,
        phone,
        address: `${address}, ${area ? area + ', ' : ''}${region} (${deliveryType} Delivery)`,
        region,
        designType,
        materials,
        description: description + (additionalDetails ? '\n\nAdditional Details: ' + additionalDetails : '') + priceBreakdownStr,
        advancePaid: actualAdvance,
        trxId,
        remainingBalance: totalPrice - actualAdvance > 0 ? totalPrice - actualAdvance : 0,
        status: 'Pending Verification',
        referenceImage: finalFrontName || finalBackName || undefined,
        frontImageName: finalFrontName || undefined,
        backImageName: finalBackName || undefined,
        frontImagePos: { ...frontPos, scale: frontScale },
        backImagePos: { ...backPos, scale: backScale },
        frontPrintSize,
        backPrintSize,
        color: tshirtColor,
      };
      
      await addOrder(newOrder);
      setSuccessMsg(`Order successfully submitted! ID: ${newOrder.id}`);
      setSubmittedOrder(newOrder);
      setShowPopup(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      setDescription('');
      setAdditionalDetails('');
      setTrxId('');
      setCustomAdvanceAmount('');
      setFrontFile(null);
      setBackFile(null);
      setFrontImageName(null);
      setBackImageName(null);
      setFrontImagePreview(null);
      setBackImagePreview(null);
      setTshirtColor('#111111');
      setFrontScale(1);
      setBackScale(1);
      setFrontPos({ x: 0, y: 0 });
      setBackPos({ x: 0, y: 0 });
    } catch (error: any) {
      console.error("Submission failed", error);
      setErrorMsg(error.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-card border border-border shadow-xl rounded-xl p-8 space-y-5">
        <div className="flex items-center gap-4 border-b border-border/50 pb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading text-lg">1</div>
          <div>
            <h3 className="text-2xl font-bebas tracking-widest text-foreground">Design Specifications</h3>
            <p className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Customize Your Vision</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">Design Type</label>
          <CustomSelect 
            value={designType}
            onChange={(val) => setDesignType(val as DesignType)}
            options={["Drop Shoulder", "Custom Design Drop Shoulder"]}
          />
        </div>
        
        <PrintSizeGuide />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">Front Image</label>
            {frontImagePreview ? (
              <div className="space-y-2">
                <div ref={frontConstraintsRef} className="relative w-full h-[400px] chrome-border flex flex-col items-center justify-center overflow-hidden transition-colors duration-300" style={{ backgroundColor: getContrastBg(tshirtColor) }}>
                  <div className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-300" style={{ backgroundColor: tshirtColor, maskImage: 'url(/mockup-front.png?v=2)', maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat', WebkitMaskImage: 'url(/mockup-front.png?v=2)', WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat' }} />
                  <img src="/mockup-front.png?v=2" alt="Front Mockup" className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-multiply" />
                  <motion.img 
                    src={frontImagePreview} 
                    alt="Front Design" 
                    drag 
                    dragConstraints={frontConstraintsRef}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragEnd={(e, info) => setFrontPos({ x: frontPos.x + info.offset.x, y: frontPos.y + info.offset.y })}
                    style={{ scale: frontScale }}
                    className="absolute z-10 w-[45%] h-auto cursor-move" 
                  />
                  <label className="absolute bottom-2 right-2 bg-background/80 px-3 py-1 text-xs cursor-pointer hover:bg-background transition-colors chrome-border z-20">
                    Change
                    <input type="file" className="hidden" onChange={handleFrontImageUpload} accept="image/png, image/jpeg" />
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-muted-foreground uppercase">Scale:</label>
                  <input type="range" min="0.5" max="2" step="0.05" value={frontScale} onChange={(e) => setFrontScale(parseFloat(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 chrome-border border-dashed cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <Upload className="w-6 h-6 mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Upload Front Design</p>
                </div>
                <input type="file" className="hidden" onChange={handleFrontImageUpload} accept="image/png, image/jpeg" />
              </label>
            )}
            <div className="pt-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold mb-1 block">Front Print Size</label>
              <CustomSelect 
                value={frontPrintSize}
                onChange={setFrontPrintSize}
                options={["A2", "A3", "A4", "A5", "A6", "Custom"]}
              />
              {frontPrintSize === 'Custom' && (
                <div className="flex items-center gap-2 mt-2">
                  <input type="number" placeholder="W (in)" value={frontCustomWidth} onChange={(e) => setFrontCustomWidth(e.target.value ? Number(e.target.value) : '')} className="w-full industrial-input p-2 text-xs bg-background" />
                  <span className="text-muted-foreground text-xs font-mono">x</span>
                  <input type="number" placeholder="H (in)" value={frontCustomHeight} onChange={(e) => setFrontCustomHeight(e.target.value ? Number(e.target.value) : '')} className="w-full industrial-input p-2 text-xs bg-background" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">Back Image</label>
            {backImagePreview ? (
              <div className="space-y-2">
                <div ref={backConstraintsRef} className="relative w-full h-[400px] chrome-border flex flex-col items-center justify-center overflow-hidden transition-colors duration-300" style={{ backgroundColor: getContrastBg(tshirtColor) }}>
                  <div className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-300" style={{ backgroundColor: tshirtColor, maskImage: 'url(/mockup-back.png?v=2)', maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat', WebkitMaskImage: 'url(/mockup-back.png?v=2)', WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat' }} />
                  <img src="/mockup-back.png?v=2" alt="Back Mockup" className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-multiply" />
                  <motion.img 
                    src={backImagePreview} 
                    alt="Back Design" 
                    drag 
                    dragConstraints={backConstraintsRef}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragEnd={(e, info) => setBackPos({ x: backPos.x + info.offset.x, y: backPos.y + info.offset.y })}
                    style={{ scale: backScale }}
                    className="absolute z-10 w-[45%] h-auto cursor-move" 
                  />
                  <label className="absolute bottom-2 right-2 bg-background/80 px-3 py-1 text-xs cursor-pointer hover:bg-background transition-colors chrome-border z-20">
                    Change
                    <input type="file" className="hidden" onChange={handleBackImageUpload} accept="image/png, image/jpeg" />
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-muted-foreground uppercase">Scale:</label>
                  <input type="range" min="0.5" max="2" step="0.05" value={backScale} onChange={(e) => setBackScale(parseFloat(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 chrome-border border-dashed cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <Upload className="w-6 h-6 mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Upload Back Design</p>
                </div>
                <input type="file" className="hidden" onChange={handleBackImageUpload} accept="image/png, image/jpeg" />
              </label>
            )}
            <div className="pt-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold mb-1 block">Back Print Size</label>
              <CustomSelect 
                value={backPrintSize}
                onChange={setBackPrintSize}
                options={["A2", "A3", "A4", "A5", "A6", "Custom"]}
              />
              {backPrintSize === 'Custom' && (
                <div className="flex items-center gap-2 mt-2">
                  <input type="number" placeholder="W (in)" value={backCustomWidth} onChange={(e) => setBackCustomWidth(e.target.value ? Number(e.target.value) : '')} className="w-full industrial-input p-2 text-xs bg-background" />
                  <span className="text-muted-foreground text-xs font-mono">x</span>
                  <input type="number" placeholder="H (in)" value={backCustomHeight} onChange={(e) => setBackCustomHeight(e.target.value ? Number(e.target.value) : '')} className="w-full industrial-input p-2 text-xs bg-background" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">T-Shirt Base Color</label>
          <div className="bg-card/50 p-4 chrome-border">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {[
                { name: 'Black', hex: '#111111' },
                { name: 'White', hex: '#f5f5f7' },
                { name: 'Off-White', hex: '#f8f4e6' },
                { name: 'Olive', hex: '#4b5320' },
                { name: 'Cream', hex: '#fffdd0' },
                { name: 'Navy Blue', hex: '#1c2e4a' },
                { name: 'Maroon', hex: '#630f0f' },
                { name: 'Coffee', hex: '#4a2c2a' },
                { name: 'Dusty Rose', hex: '#d6b5b5' },
                { name: 'Lavender', hex: '#e6e6fa' },
                { name: 'Sage Green', hex: '#9dc183' }
              ].map(c => (
                <button 
                  key={c.hex} 
                  type="button" 
                  onClick={() => setTshirtColor(c.hex)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-300 ${
                    tshirtColor === c.hex 
                      ? 'bg-primary/10 ring-1 ring-primary scale-105' 
                      : 'hover:bg-muted/30 hover:scale-102'
                  }`}
                >
                  <span 
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      tshirtColor === c.hex ? 'border-primary shadow-[0_0_12px_rgba(var(--color-primary),0.3)]' : 'border-border'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className={`text-[9px] tracking-wider font-medium transition-colors ${
                    tshirtColor === c.hex ? 'text-primary' : 'text-muted-foreground'
                  }`}>{c.name}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/30">
              <span className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: tshirtColor }} />
              <span className="text-xs text-muted-foreground">Selected: <span className="text-foreground font-semibold">{
                [
                  { name: 'Black', hex: '#111111' },
                  { name: 'White', hex: '#f5f5f7' },
                  { name: 'Off-White', hex: '#f8f4e6' },
                  { name: 'Olive', hex: '#4b5320' },
                  { name: 'Cream', hex: '#fffdd0' },
                  { name: 'Navy Blue', hex: '#1c2e4a' },
                  { name: 'Maroon', hex: '#630f0f' },
                  { name: 'Coffee', hex: '#4a2c2a' },
                  { name: 'Dusty Rose', hex: '#d6b5b5' },
                  { name: 'Lavender', hex: '#e6e6fa' },
                  { name: 'Sage Green', hex: '#9dc183' }
                ].find(c => c.hex === tshirtColor)?.name || tshirtColor.toUpperCase()
              }</span></span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase tracking-wider">Material Preferences</label>
          <input 
            type="text" 
            placeholder="e.g., Stainless steel, leather, specific metals"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            className="w-full industrial-input p-2.5 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase tracking-wider">Detailed Description</label>
          <textarea 
            placeholder="Describe your design in detail (dimensions, specific elements, engraving requests, etc.)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full industrial-input p-2.5 text-sm min-h-[50px]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase tracking-wider">Additional Details (Optional)</label>
          <textarea 
            placeholder="Any extra notes or specific sizing instructions..."
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="w-full industrial-input p-2.5 text-sm min-h-[50px]"
          />
        </div>

        {/* Pricing Summary */}
        <div className="mt-10 bg-black/40 border border-border/30 rounded-xl p-8 font-mono shadow-lg">
          <h4 className="text-xs text-primary uppercase tracking-[0.2em] font-bold mb-5 border-b border-border/20 pb-3">Estimated Price Breakdown</h4>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Raw T-Shirt (Premium Base)</span>
              <span>{rawTshirtPrice} TK</span>
            </div>
            {frontImagePreview && (
              <div className="flex justify-between text-white/90">
                <span>Front Print ({frontPrintSize})</span>
                <span>+{frontPrice} TK</span>
              </div>
            )}
            {backImagePreview && (
              <div className="flex justify-between text-white/90">
                <span>Back Print ({backPrintSize})</span>
                <span>+{backPrice} TK</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-border/40 pt-5 mt-5 font-bold text-white">
              <span className="font-heading text-lg tracking-wider uppercase">Estimated Total Price</span>
              <span className="text-primary text-2xl md:text-3xl font-heading tracking-widest">{totalPrice} TK</span>
            </div>
            <p className="text-[10px] mt-3 opacity-60">* Final price may vary slightly based on custom requests or complex sizing.</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-xl p-8 space-y-5 relative z-50 mt-8">
        <div className="flex items-center gap-4 border-b border-border/50 pb-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading text-lg">2</div>
          <div>
            <h3 className="text-2xl font-bebas tracking-widest text-foreground">Delivery Information</h3>
            <p className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Where Should We Ship?</p>
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
              <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Recipient Name *</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none transition-colors font-semibold text-foreground" />
            </div>
            <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
              <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Contact Number *</label>
              <input type="tel" required pattern="[0-9]{11}" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="017XXXXXXXX" className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none transition-colors font-semibold text-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
               <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Country</label>
               <div className="w-full border-b border-border pb-2 text-sm font-semibold text-foreground">
                 Bangladesh
               </div>
             </div>
             <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
               <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Division *</label>
               <div className="mt-1">
                 <CustomSelect 
                   value={region}
                   onChange={(val) => setRegion(val as any)}
                   options={[...DIVISIONS]}
                   searchable={true}
                   placeholder="Search Division..."
                 />
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
               <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Area/Thana/Upazilla *</label>
               <input type="text" required value={area} onChange={(e) => setArea(e.target.value)} placeholder="Enter Area / Thana / Upazila" className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none font-semibold text-foreground" />
             </div>
             <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
               <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Select Effective Delivery *</label>
               <div className="flex items-center gap-4 mt-1">
                 <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
                   <input type="radio" name="customDeliveryType" value="Home" checked={deliveryType === 'Home'} onChange={() => setDeliveryType('Home')} className="accent-primary w-4 h-4" /> Home
                 </label>
                 <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
                   <input type="radio" name="customDeliveryType" value="Office" checked={deliveryType === 'Office'} onChange={() => setDeliveryType('Office')} className="accent-primary w-4 h-4" /> Office
                 </label>
               </div>
             </div>
          </div>

          <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
            <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Give The Full Address *</label>
            <textarea required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Division / District / Upazila / Area / House No." className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none transition-colors font-semibold min-h-[60px] text-foreground" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-xl p-8 space-y-5 border-l-4 border-l-primary mt-8">
        <div className="flex items-center gap-4 border-b border-border/50 pb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading text-lg">3</div>
          <div>
            <h3 className="text-2xl font-bebas tracking-widest text-foreground">Payment Policy</h3>
            <p className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Secure Your Order</p>
          </div>
        </div>

        <div className="flex justify-between items-start bg-black/40 border border-primary/30 p-5 rounded-lg gap-4 overflow-hidden">
           <div className="flex flex-col gap-1 min-w-0">
             <span className="text-lg sm:text-xl md:text-2xl font-bebas tracking-widest text-white uppercase leading-none truncate">Estimated Total</span>
             <span className="text-lg sm:text-xl md:text-2xl font-bebas tracking-widest text-white uppercase leading-none truncate">Price</span>
           </div>
           <div className="flex flex-col items-end gap-1 shrink-0">
             <span className="text-lg sm:text-xl md:text-2xl font-bebas tracking-widest text-white uppercase leading-none">{totalPrice}</span>
             <span className="text-lg sm:text-xl md:text-2xl font-bebas tracking-widest text-white uppercase leading-none">TK</span>
           </div>
        </div>

        <p className="text-sm text-foreground/70 leading-relaxed">To process your request, an advance payment is required via bKash or Nagad. The remaining balance will be collected as Cash on Delivery.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#E2136E]/10 border border-[#E2136E]/20 p-3 text-center rounded-lg">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">Send bKash Advance To</p>
            <p className="text-2xl font-heading tracking-widest text-[#E2136E]">01852786645</p>
          </div>
          <div className="bg-[#ED1C24]/10 border border-[#ED1C24]/20 p-3 text-center rounded-lg">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">Send Nagad Advance To</p>
            <p className="text-2xl font-heading tracking-widest text-[#ED1C24]">01710793841</p>
          </div>
        </div>
        <div className="flex flex-col space-y-3 bg-card/50 p-5 chrome-border rounded-lg">
          {designType === 'Drop Shoulder' && (
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="radio" name="advanceTier" value={120} checked={advancePaid === 120} onChange={() => setAdvancePaid(120)} className="accent-primary w-4 h-4" />
              <span className="font-semibold group-hover:text-primary transition-colors">Delivery Charge Advance: <span className="text-primary">120 TK</span></span>
            </label>
          )}

          <label className="flex items-center space-x-3 cursor-pointer group">
            <input type="radio" name="advanceTier" value={400} checked={advancePaid === 400} onChange={() => setAdvancePaid(400)} className="accent-primary w-4 h-4" />
            <span className="font-semibold group-hover:text-primary transition-colors">Full Image Customization: <span className="text-primary">400 TK</span> Advance</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input type="radio" name="advanceTier" value="Custom" checked={advancePaid === 'Custom'} onChange={() => setAdvancePaid('Custom')} className="accent-primary w-4 h-4" />
            <span className="font-semibold group-hover:text-primary transition-colors">Custom Advance <span className="text-muted-foreground text-xs">(Admin phone verification required)</span></span>
          </label>
          {advancePaid === 'Custom' && (
            <div className="pl-7 mt-2">
              <input 
                type="number" 
                placeholder="Enter custom advance amount (TK)" 
                value={customAdvanceAmount} 
                onChange={(e) => setCustomAdvanceAmount(e.target.value)}
                className="w-full md:w-1/2 industrial-input p-2.5 text-sm text-sm"
                required
              />
            </div>
          )}
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">Transaction ID (TrxID)</label>
          <input 
            type="text" placeholder="Enter TrxID after sending advance" value={trxId} onChange={(e) => setTrxId(e.target.value)}
            className="w-full industrial-input p-2.5 text-sm" required
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-5 bg-red-950/80 border border-red-500/60 text-red-400 font-bold rounded-lg flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">⚠️</span>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-5 bg-green-900/30 border border-green-500/50 text-green-400 font-bold rounded-lg flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">✓</span>
          {successMsg}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="w-full p-5 industrial-button text-lg cta-pulse rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? 'Uploading & Submitting...' : (advancePaid === 400 
        ? 'Submit Custom Order Request' 
        : 'Proceed to Next Step')}
      </button>

      <AnimatePresence>
        {showPopup && submittedOrder && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-xl">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-neutral-950 border border-emerald-500/30 p-6 sm:p-10 rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.15)] text-center max-w-lg w-full relative my-8"
              >
                {/* Glowing Luxury Seal Icon */}
                <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.35)]">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                </div>

                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 mb-3">
                  ✓ BESPOKE COMMISSION CONFIRMED
                </div>

                <h2 className="text-2xl sm:text-3xl font-montserrat font-black tracking-wider text-white mb-2 uppercase leading-tight">
                  ORDER PLACED SUCCESSFULLY
                </h2>
                <p className="text-xs text-neutral-400 font-montserrat uppercase tracking-[0.2em] mb-6 font-semibold">
                  Wear Your Culture • Flex Your Style
                </p>

                {/* VIP Order Receipt Details */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 text-left mb-6 font-mono divide-y divide-neutral-800/80 shadow-2xl">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Tracking ID:</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-400 bg-black px-3 py-1 rounded border border-emerald-500/30 font-mono tracking-wider">
                      {submittedOrder.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Delivery Region:</span>
                    <span className="text-xs sm:text-sm font-bold text-white text-right max-w-[60%] truncate">
                      {submittedOrder.region}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Payment Method:</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-400 text-right">
                      Advance ({submittedOrder.advancePaid} TK) + COD
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Estimated Delivery:</span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      3-5 Days Nationwide
                    </span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 mb-6 leading-relaxed font-sans">
                  <p>Our concierge team will reach you at <strong className="text-white font-mono">{submittedOrder.phone}</strong> before dispatch.</p>
                  <p className="text-[11px] font-mono text-neutral-500 mt-1">Official Hotline: <span className="text-white font-bold">01710793841</span></p>
                  <p className="text-[10px] mt-4 uppercase tracking-[0.25em] border-t border-neutral-800 pt-3 italic text-neutral-400 font-montserrat">
                    &ldquo;It&apos;s not just a cloth, it&apos;s a symbol of luxury.&rdquo;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/8801710793841"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 px-4 bg-emerald-500 hover:bg-emerald-400 text-black transition-all font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 font-mono cursor-pointer"
                  >
                    WhatsApp Concierge
                  </a>
                  <button 
                    type="button"
                    onClick={() => { setShowPopup(false); window.location.href = '/'; }}
                    className="flex-1 py-4 px-4 bg-white hover:bg-neutral-200 text-black transition-all font-bold uppercase tracking-wider text-xs rounded-xl shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer font-mono"
                  >
                    Continue Shopping
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </form>
  );
}
