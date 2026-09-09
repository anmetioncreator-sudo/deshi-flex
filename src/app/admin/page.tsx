"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CatalogManager from "@/components/admin/CatalogManager";
import OrderQueue from "@/components/admin/OrderQueue";
import LogisticsMap from "@/components/admin/LogisticsMap";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";
import { Settings, Package, Map, LayoutDashboard, LogOut, Sliders } from "lucide-react";
import Link from "next/link";
import { useAdminStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'queue' | 'map' | 'catalog' | 'settings'>('queue');
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const logout = useAdminStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/admin/login");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-heading tracking-widest text-xl">AUTHENTICATING...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="font-bebas text-3xl tracking-widest text-foreground m-0 leading-none">
              DF <span className="text-primary">ADMIN</span> TERMINAL
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={logout}
              className="text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Exit to Storefront ↗
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4 px-2">Navigation</p>
          <nav className="flex-1 space-y-2">
            <button 
              onClick={() => setActiveTab('queue')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border ${activeTab === 'queue' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
            >
              <Package className="w-4 h-4" /> Order Queue
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border ${activeTab === 'map' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
            >
              <Map className="w-4 h-4" /> Logistics Map
            </button>
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border ${activeTab === 'catalog' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
            >
              <Settings className="w-4 h-4" /> Catalog Manager
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border ${activeTab === 'settings' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
            >
              <Sliders className="w-4 h-4" /> Site Settings
            </button>
          </nav>

          <div className="mt-auto p-4 border border-border/50 bg-background">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold text-foreground tracking-widest">System Online</span>
            </div>
            <p className="text-[9px] text-primary font-mono font-bold">DB: PRISMA_SQLITE_LIVE</p>
          </div>
        </aside>

        {/* Mobile Nav (Bottom) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 flex">
          <button 
            onClick={() => setActiveTab('queue')}
            className={`flex-1 flex flex-col items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider ${activeTab === 'queue' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Package className="w-5 h-5 mb-1" /> Queue
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex flex-col items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider ${activeTab === 'map' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Map className="w-5 h-5 mb-1" /> Map
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 flex flex-col items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider ${activeTab === 'catalog' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Settings className="w-5 h-5 mb-1" /> Catalog
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center justify-center p-3 text-[10px] font-bold uppercase tracking-wider ${activeTab === 'settings' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Sliders className="w-5 h-5 mb-1" /> Settings
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-background">
          <AnimatePresence mode="wait">
            {activeTab === 'queue' && (
              <motion.div
                key="queue"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-6xl mx-auto"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">Order Queue Management</h2>
                  <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider"> verify, and update order statuses.</p>
                </div>
                <OrderQueue />
              </motion.div>
            )}

            {activeTab === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-6xl mx-auto"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">Logistics & Geographic Map</h2>
                  <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">Visualize delivery distributions across Bangladesh.</p>
                </div>
                <LogisticsMap />
              </motion.div>
            )}

            {activeTab === 'catalog' && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-6xl mx-auto"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">Catalog & Inventory Management</h2>
                  <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">Append new items to the store database.</p>
                </div>
                <CatalogManager />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-6xl mx-auto"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">Site configuration</h2>
                  <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">Configure hero banners and landing page content.</p>
                </div>
                <SiteSettingsManager />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
