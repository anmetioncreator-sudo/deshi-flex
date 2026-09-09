"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Region } from '@/types';
import { MapPin, TrendingUp, Package, Move, Lock } from 'lucide-react';

// Approximate relative coordinates for a simple visual representation
const REGION_COORDS: Record<Region, { top: string, left: string }> = {
  'Rangpur': { top: '15%', left: '35%' },
  'Mymensingh': { top: '35%', left: '50%' },
  'Sylhet': { top: '30%', left: '75%' },
  'Rajshahi': { top: '40%', left: '25%' },
  'Dhaka': { top: '50%', left: '50%' },
  'Khulna': { top: '75%', left: '35%' },
  'Barisal': { top: '80%', left: '55%' },
  'Chittagong': { top: '75%', left: '80%' },
  'Gazipur': { top: '42%', left: '48%' }, // Slightly above Dhaka
};

export default function LogisticsMap() {
  const orders = useStore((state) => state.orders);
  const fetchOrders = useStore((state) => state.fetchOrders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isMapInteractive, setIsMapInteractive] = useState<boolean>(false);

  // Filter orders by type first
  const typeFilteredOrders = useMemo(() => {
    if (selectedType === 'All') return orders;
    return orders.filter(o => o.type === selectedType);
  }, [orders, selectedType]);

  // Active orders (not Delivered)
  const activeOrders = useMemo(() => {
    return typeFilteredOrders.filter(o => o.status !== 'Delivered');
  }, [typeFilteredOrders]);

  // Aggregate stats per region
  const regionStats = useMemo(() => {
    const stats: Record<Region, { count: number, revenue: number, latestIds: string[] }> = {} as any;
    
    // Initialize
    (Object.keys(REGION_COORDS) as Region[]).forEach(r => {
      stats[r] = { count: 0, revenue: 0, latestIds: [] };
    });

    activeOrders.forEach(o => {
      if (stats[o.region]) {
        stats[o.region].count++;
        stats[o.region].revenue += Number(o.advancePaid) || 0; // Using advance paid as pending revenue for simplicity
        if (stats[o.region].latestIds.length < 3) {
          stats[o.region].latestIds.push(o.id);
        }
      }
    });

    return stats;
  }, [activeOrders]);

  // Top Delivery Hub
  const topHub = useMemo(() => {
    let top = { region: 'None', count: 0 };
    Object.entries(regionStats).forEach(([region, stat]) => {
      if (stat.count > top.count) {
        top = { region, count: stat.count };
      }
    });
    return top;
  }, [regionStats]);

  const getPinColor = (count: number) => {
    if (count === 0) return 'bg-muted border-border';
    if (count < 3) return 'bg-blue-500 border-blue-300 animate-pulse-slow';
    if (count < 10) return 'bg-zinc-400 border-zinc-200 animate-pulse';
    return 'bg-primary border-white animate-pulse'; // Hotspot
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-punk p-4 border-l-4 border-l-primary flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Active Orders</p>
            <p className="text-3xl font-bebas mt-1">{activeOrders.length}</p>
          </div>
          <Package className="w-8 h-8 text-primary opacity-50" />
        </div>
        <div className="glass-punk p-4 border-l-4 border-l-accent flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Top Delivery Hub</p>
            <p className="text-3xl font-bebas mt-1">{topHub.region}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-accent opacity-50" />
        </div>
        
        {/* Filters */}
        <div className="glass-punk p-4 flex flex-col justify-center">
          <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Order Type Filter</label>
          <select 
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setSelectedRegion(null);
            }}
            className="w-full bg-background border border-border p-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="All">All Orders</option>
            <option value="Standard Custom">Standard Custom</option>
            <option value="Full Image Custom">Full Image Custom</option>
            <option value="Direct Checkout">Direct Checkout</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Simulation Panel */}
        <div className="lg:col-span-2 glass-punk p-6 h-[500px] relative flex items-center justify-center border border-border overflow-hidden bg-background/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 to-background pointer-events-none opacity-50" />
          
          {/* Map Control */}
          <div className="absolute top-8 right-8 z-30">
            <button
              onClick={() => setIsMapInteractive(!isMapInteractive)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase transition-colors border shadow-lg backdrop-blur-md rounded-md ${isMapInteractive ? 'bg-primary text-foreground border-primary' : 'bg-background/60 text-foreground border-border hover:border-primary/50'}`}
            >
              {isMapInteractive ? <Move className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isMapInteractive ? 'Map Interactive' : 'Unlock Map'}
            </button>
          </div>
          
          {/* Realistic Map Background */}
          <div className="w-full h-full relative border border-border/20 bg-background rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7496149.95373021!2d85.04561002685794!3d23.452145889791494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adaaed80e18ba7%3A0xf2d28e0c4e1fc6b!2sBangladesh!5e0!3m2!1sen!2sbd!4v1716616429381!5m2!1sen!2sbd"
              className="absolute inset-0 w-full h-full grayscale invert opacity-80"
              style={{ pointerEvents: isMapInteractive ? 'auto' : 'none' }}
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Map Pins overlay */}
            {!isMapInteractive && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {(Object.keys(REGION_COORDS) as Region[]).map(region => {
                  const coords = REGION_COORDS[region];
                  const count = regionStats[region].count;
                  const isSelected = selectedRegion === region;
                  
                  return (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto transition-transform ${isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'}`}
                      style={{ top: coords.top, left: coords.left }}
                    >
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap shadow-lg backdrop-blur-sm border ${count > 0 ? 'bg-background/90 border-primary text-foreground' : 'bg-background/60 border-border text-muted-foreground'}`}>
                        <span>{region}</span>
                        {count > 0 && (
                          <span className="bg-primary text-foreground px-1.5 py-0.5 rounded-sm">
                            {count} {count === 1 ? 'Order' : 'Orders'}
                          </span>
                        )}
                      </div>
                      <div className={`w-1 h-3 mt-0.5 ${count > 0 ? 'bg-primary' : 'bg-border'}`}></div>
                      <div className={`w-2.5 h-2.5 rounded-full ${count > 0 ? 'bg-primary animate-pulse' : 'bg-border'}`}></div>
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Overlay notification when interactive */}
            {isMapInteractive && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/80 border border-primary text-primary px-4 py-2 rounded-md text-xs font-bold pointer-events-none z-20 shadow-lg backdrop-blur-sm">
                Pins hidden while map is interactive.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Detail Panel */}
        <div className="glass-punk p-6 flex flex-col h-[500px]">
          <h3 className="text-xl font-bebas tracking-widest text-foreground border-b border-border pb-2 mb-4">Zone Details</h3>
          
          {selectedRegion ? (
            <div className="flex-1 flex flex-col">
              <button 
                onClick={() => setSelectedRegion(null)}
                className="text-xs text-muted-foreground hover:text-foreground mb-4 self-start flex items-center gap-1 transition-colors"
              >
                &larr; BACK TO ZONES
              </button>
              <div className="mb-6 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-primary" />
                <div>
                  <h4 className="text-2xl font-bebas text-primary tracking-wider">{selectedRegion}</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Active Sector</p>
                </div>
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <div className="bg-background p-4 chrome-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Order Count</p>
                  <p className="text-2xl font-mono text-foreground mt-1">{regionStats[selectedRegion].count}</p>
                </div>
                
                <div className="bg-background p-4 chrome-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending Advance Revenue</p>
                  <p className="text-2xl font-mono text-accent mt-1">{regionStats[selectedRegion].revenue} TK</p>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Latest Active IDs</p>
                  {regionStats[selectedRegion].latestIds.length > 0 ? (
                    <ul className="space-y-2">
                      {regionStats[selectedRegion].latestIds.map(id => (
                        <li key={id} className="text-sm font-mono bg-muted/20 p-2 border border-border/50 text-foreground">
                          {id}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No active orders in this zone.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Select a zone to view details:</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(REGION_COORDS) as Region[]).map(region => {
                  const count = regionStats[region].count;
                  return (
                    <button 
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className="p-3 border border-border/50 bg-background/40 hover:border-primary text-xs font-bold uppercase transition-all flex justify-between items-center"
                    >
                      <span>{region}</span>
                      {count > 0 && <span className="bg-primary text-foreground px-1.5 py-0.5 rounded-sm">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
