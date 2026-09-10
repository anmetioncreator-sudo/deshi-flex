"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Region, Order } from "@/types";
import {
  MapPin,
  TrendingUp,
  Package,
  Move,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Phone,
  User,
  ArrowRight,
} from "lucide-react";

// Approximate relative coordinates for a simple visual representation
const REGION_COORDS: Record<Region, { top: string; left: string }> = {
  Rangpur: { top: "15%", left: "35%" },
  Mymensingh: { top: "35%", left: "50%" },
  Sylhet: { top: "30%", left: "75%" },
  Rajshahi: { top: "40%", left: "25%" },
  Dhaka: { top: "50%", left: "50%" },
  Khulna: { top: "75%", left: "35%" },
  Barisal: { top: "80%", left: "55%" },
  Chittagong: { top: "75%", left: "80%" },
  Gazipur: { top: "42%", left: "48%" },
};

export default function LogisticsMap() {
  const orders = useStore((state) => state.orders);
  const fetchOrders = useStore((state) => state.fetchOrders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<Region | null>("Dhaka");
  const [isMapInteractive, setIsMapInteractive] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter orders by type first
  const typeFilteredOrders = useMemo(() => {
    if (selectedType === "All") return orders;
    return orders.filter((o) => o.type === selectedType);
  }, [orders, selectedType]);

  // Active orders (not Delivered)
  const activeOrders = useMemo(() => {
    return typeFilteredOrders.filter((o) => o.status !== "Delivered");
  }, [typeFilteredOrders]);

  // Aggregate stats per region
  const regionStats = useMemo(() => {
    const stats: Record<Region, { count: number; revenue: number; latestOrders: Order[] }> = {} as any;

    (Object.keys(REGION_COORDS) as Region[]).forEach((r) => {
      stats[r] = { count: 0, revenue: 0, latestOrders: [] };
    });

    activeOrders.forEach((o) => {
      const reg = o.region as Region;
      if (stats[reg]) {
        stats[reg].count++;
        stats[reg].revenue += Number(o.advancePaid) || 0;
        stats[reg].latestOrders.push(o);
      }
    });

    return stats;
  }, [activeOrders]);

  // Top Delivery Hub
  const topHub = useMemo(() => {
    let top = { region: "Dhaka", count: 0 };
    Object.entries(regionStats).forEach(([region, stat]) => {
      if (stat.count > top.count) {
        top = { region, count: stat.count };
      }
    });
    return top;
  }, [regionStats]);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Total Active Orders
            </span>
            <span className="text-3xl font-bold font-mono text-foreground">{activeOrders.length}</span>
            <span className="text-xs text-muted-foreground block mt-1">Pending delivery dispatch</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Top Delivery Hub
            </span>
            <span className="text-3xl font-bold font-bebas text-white tracking-wider">{topHub.region}</span>
            <span className="text-xs text-neutral-400 block mt-1 font-mono">Highest regional volume</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col justify-center">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Order Type Filter
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
            }}
            className="w-full bg-background border border-border px-3.5 py-2.5 text-sm font-semibold rounded-lg text-foreground focus:border-primary focus:outline-none"
          >
            <option value="All">All Order Formats</option>
            <option value="Standard Custom">Standard Custom Apparel</option>
            <option value="Full Image Custom">Full Image Custom Apparel</option>
            <option value="Direct Checkout">Direct Checkout Catalog</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Map & Interactive Zone Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Simulation Panel - 7 columns */}
        <div className="lg:col-span-7 bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Bangladesh Regional Delivery Map
              </span>
            </div>
            <button
              onClick={() => setIsMapInteractive(!isMapInteractive)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors border rounded-md shadow-sm ${
                isMapInteractive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              }`}
            >
              {isMapInteractive ? <Move className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isMapInteractive ? "Map Interactive" : "Unlock Map"}</span>
            </button>
          </div>

          <div className="flex-1 w-full relative border border-border/70 bg-background rounded-xl overflow-hidden min-h-[480px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7496149.95373021!2d85.04561002685794!3d23.452145889791494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adaaed80e18ba7%3A0xf2d28e0c4e1fc6b!2sBangladesh!5e0!3m2!1sen!2sbd!4v1716616429381!5m2!1sen!2sbd"
              className="absolute inset-0 w-full h-full grayscale invert opacity-75"
              style={{ pointerEvents: isMapInteractive ? "auto" : "none" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Map Pins overlay */}
            {!isMapInteractive && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {(Object.keys(REGION_COORDS) as Region[]).map((region) => {
                  const coords = REGION_COORDS[region];
                  const count = regionStats[region]?.count || 0;
                  const isSelected = selectedRegion === region;

                  return (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto transition-transform ${
                        isSelected ? "scale-110 z-30" : "hover:scale-105 z-10"
                      }`}
                      style={{ top: coords.top, left: coords.left }}
                    >
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap shadow-xl backdrop-blur-md border ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : count > 0
                            ? "bg-background/95 border-primary text-foreground"
                            : "bg-background/70 border-border text-muted-foreground"
                        }`}
                      >
                        <span>{region}</span>
                        {count > 0 && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                              isSelected ? "bg-black/30 text-white" : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </div>
                      <div className={`w-1 h-3 mt-0.5 ${count > 0 ? "bg-primary" : "bg-border"}`}></div>
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          count > 0 ? "bg-primary animate-pulse" : "bg-border"
                        }`}
                      ></div>
                    </button>
                  );
                })}
              </div>
            )}

            {isMapInteractive && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/90 border border-primary text-primary px-4 py-2 rounded-lg text-xs font-bold pointer-events-none z-20 shadow-lg backdrop-blur-sm">
                Map interactive mode active. Click &apos;Lock Map&apos; to restore pins.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Detail Panel - 5 columns - Completely Revamped and Not Cut Off */}
        <div className="lg:col-span-5 bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[580px]">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-xl font-bebas tracking-widest text-foreground uppercase m-0 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                ZONE LOGISTICS DETAILS
              </h3>
              {selectedRegion && (
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="text-xs text-muted-foreground hover:text-foreground uppercase font-semibold"
                >
                  View All Zones
                </button>
              )}
            </div>

            {selectedRegion ? (
              <div className="space-y-4">
                {/* Active Sector Banner */}
                <div className="p-4 bg-muted/20 border border-border rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-bebas text-primary tracking-wider uppercase leading-none">
                      {selectedRegion}
                    </h4>
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block mt-1">
                      Active Delivery Sector
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase rounded-md">
                    {regionStats[selectedRegion]?.count || 0} Orders
                  </span>
                </div>

                {/* Regional Stat Boxes */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background border border-border p-3.5 rounded-lg">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block mb-1">
                      Orders Count
                    </span>
                    <span className="text-2xl font-bold font-mono text-foreground">
                      {regionStats[selectedRegion]?.count || 0}
                    </span>
                  </div>
                  <div className="bg-background border border-border p-3.5 rounded-lg">
                    <span className="text-xs text-neutral-400 font-semibold uppercase block mb-1 font-mono">
                      Pending COD / Advance
                    </span>
                    <span className="text-2xl font-bold font-mono text-white">
                      ৳ {(regionStats[selectedRegion]?.revenue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Latest Active IDs - High Quality, Interactive Card List (Circled in User Image 4) */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                      Latest Active Orders in {selectedRegion}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {regionStats[selectedRegion]?.latestOrders.length || 0} Listed
                    </span>
                  </div>

                  {regionStats[selectedRegion]?.latestOrders.length > 0 ? (
                    <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                      {regionStats[selectedRegion].latestOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-3 bg-background border border-border hover:border-neutral-500 rounded-lg transition-all group shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-white">
                                {order.id}
                              </span>
                              <button
                                onClick={() => copyToClipboard(order.id)}
                                className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
                                title="Copy Order ID"
                              >
                                {copiedId === order.id ? (
                                  <Check className="w-3.5 h-3.5 text-white" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                                order.status === "Delivered"
                                  ? "bg-white text-black border-white"
                                  : "bg-neutral-900 text-white border-neutral-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-neutral-400 font-sans">
                            <span className="truncate max-w-[180px] text-white font-medium">
                              {order.fullName}
                            </span>
                            <span className="font-mono font-bold text-white">
                              ৳ {(Number(order.advancePaid || 0) + Number(order.remainingBalance || 0)).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-[11px] text-neutral-400 mt-1 truncate font-mono">
                            {order.address}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-background border border-border/60 rounded-lg text-xs text-neutral-400 font-mono">
                      No active orders dispatched to {selectedRegion} currently.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold font-mono">
                  Select a division to inspect delivery queue and revenue:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.keys(REGION_COORDS) as Region[]).map((region) => {
                    const count = regionStats[region]?.count || 0;
                    return (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className="p-3.5 rounded-lg border border-border bg-background hover:border-white text-xs font-bold uppercase transition-all flex justify-between items-center group shadow-sm cursor-pointer"
                      >
                        <span className="text-white">{region}</span>
                        {count > 0 ? (
                          <span className="bg-white text-black px-2 py-0.5 rounded text-xs font-mono font-bold">
                            {count}
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-mono">0</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Bangladesh Logistics Radar</span>
            <span className="text-white font-bold">GPS Sync Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
