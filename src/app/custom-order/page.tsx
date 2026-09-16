"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomDesignForm from "@/components/customer/CustomDesignForm";
import CheckoutForm from "@/components/customer/CheckoutForm";
import OrderTracking from "@/components/customer/OrderTracking";
import { ShoppingBag, PenTool, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CustomOrderPage() {
  const [activeTab, setActiveTab] = useState<'custom' | 'checkout' | 'track'>('custom');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-foreground flex flex-col">
      <Navbar />

      {/* Header */}
      <header className="border-b border-border bg-background relative z-10 pt-4">
        <div className="max-w-5xl mx-auto px-4 pb-4 md:py-4 flex flex-col items-center gap-4 md:gap-6 relative">
          <div className="w-full md:absolute md:left-4 md:top-6 flex justify-start z-10">
            <Link href="/" className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </Link>
          </div>
          <h1 className="font-bebas text-4xl md:text-5xl tracking-[0.15em] text-foreground m-0 leading-none text-center md:px-24 flex items-center justify-center gap-3 flex-wrap">
            <Image src="/df-logo.png" alt="DF Logo" width={64} height={36} className="object-contain filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]" />
            <span>DESHI <span className="text-primary">FLEX</span> / CUSTOM</span>
          </h1>
          
          <nav className="flex flex-wrap justify-center gap-2 w-full">
            <button 
              onClick={() => setActiveTab('custom')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border ${activeTab === 'custom' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              <PenTool className="w-4 h-4" /> <span>Custom Request</span>
            </button>

            <button 
              onClick={() => setActiveTab('track')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border ${activeTab === 'track' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              <Truck className="w-4 h-4" /> <span>Track Order</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'custom' && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8 border-l-4 border-primary pl-4">
                <h2 className="text-3xl font-bebas tracking-widest text-foreground uppercase">Custom Design Request</h2>
                <p className="text-muted-foreground text-sm mt-1">Submit your bespoke piece request. Upload sketches or describe your vision.</p>
              </div>
              <CustomDesignForm />
            </motion.div>
          )}

          {activeTab === 'track' && (
            <motion.div
              key="track"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8 border-l-4 border-primary pl-4">
                <h2 className="text-3xl font-bebas tracking-widest text-foreground uppercase">Order Tracking</h2>
                <p className="text-muted-foreground text-sm mt-1">Look up your order status instantly via your phone number.</p>
              </div>
              <OrderTracking />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
