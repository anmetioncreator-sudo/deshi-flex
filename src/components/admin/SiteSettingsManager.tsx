"use client";

import React, { useState } from 'react';
import { useSiteSettingsStore } from '@/store';
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';

export default function SiteSettingsManager() {
  const { heroImages, forHimImage, forHerImage, updateSettings } = useSiteSettingsStore();

  const [localHeroImages, setLocalHeroImages] = useState<string[]>(heroImages);
  const [localForHim, setLocalForHim] = useState<string>(forHimImage);
  const [localForHer, setLocalForHer] = useState<string>(forHerImage);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = () => {
    updateSettings({
      heroImages: localHeroImages.filter(img => img.trim() !== ''),
      forHimImage: localForHim,
      forHerImage: localForHer,
    });
    setSuccessMsg('Site settings updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const addHeroImage = () => {
    setLocalHeroImages([...localHeroImages, '']);
  };

  const removeHeroImage = (index: number) => {
    setLocalHeroImages(localHeroImages.filter((_, i) => i !== index));
  };

  const updateHeroImage = (index: number, value: string) => {
    const newImages = [...localHeroImages];
    newImages[index] = value;
    setLocalHeroImages(newImages);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-background p-4 chrome-border">
        <h3 className="text-xl font-bebas tracking-widest text-primary">Site Settings Management</h3>
        <button onClick={handleSave} className="px-4 py-2 bg-primary text-foreground font-bold uppercase text-xs flex items-center gap-2 hover:bg-background transition-colors">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      {successMsg && <div className="text-white text-xs font-mono font-bold bg-neutral-900 p-3 border border-neutral-700 rounded-lg">{successMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Slider Images */}
        <div className="glass-punk p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <h4 className="font-bebas text-lg tracking-widest text-foreground uppercase">Hero Banner Images</h4>
            <button type="button" onClick={addHeroImage} className="text-xs bg-muted px-3 py-1 flex items-center gap-1 hover:text-primary transition-colors">
              <Plus className="w-3 h-3" /> Add Image
            </button>
          </div>
          
          <div className="space-y-4">
            {localHeroImages.map((img, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-background/20 p-4 border border-border">
                <div className="w-24 h-24 bg-muted flex-shrink-0 border border-border relative">
                  {img ? (
                    <img src={img} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 text-[9px] font-mono text-white">
                    0{idx + 1}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={img} 
                      onChange={(e) => updateHeroImage(idx, e.target.value)}
                      className="flex-1 industrial-input p-2 text-xs" 
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button 
                      type="button" 
                      onClick={() => removeHeroImage(idx)}
                      className="p-2 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-700 transition-colors"
                      title="Remove Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {localHeroImages.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No hero images. Add one to display on the storefront.</p>
            )}
          </div>
        </div>

        {/* Category Features */}
        <div className="space-y-8">
          {/* For Him */}
          <div className="glass-punk p-6 space-y-4">
            <h4 className="font-bebas text-lg tracking-widest text-foreground uppercase border-b border-border pb-2 mb-4">"For Him" Section</h4>
            <div className="flex gap-4 items-start">
              <div className="w-32 h-40 bg-muted flex-shrink-0 border border-border relative">
                {localForHim ? (
                  <img src={localForHim} alt="For Him Preview" className="w-full h-full object-cover grayscale opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Background Image URL</label>
                <textarea 
                  value={localForHim} 
                  onChange={(e) => setLocalForHim(e.target.value)}
                  className="w-full industrial-input p-3 text-xs min-h-[80px]" 
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* For Her */}
          <div className="glass-punk p-6 space-y-4">
            <h4 className="font-bebas text-lg tracking-widest text-foreground uppercase border-b border-border pb-2 mb-4">"For Her" Section</h4>
            <div className="flex gap-4 items-start">
              <div className="w-32 h-40 bg-muted flex-shrink-0 border border-border relative">
                {localForHer ? (
                  <img src={localForHer} alt="For Her Preview" className="w-full h-full object-cover grayscale opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Background Image URL</label>
                <textarea 
                  value={localForHer} 
                  onChange={(e) => setLocalForHer(e.target.value)}
                  className="w-full industrial-input p-3 text-xs min-h-[80px]" 
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
