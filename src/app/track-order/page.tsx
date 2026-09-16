"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Search, AlertCircle, Clock, Package, CheckCircle2, MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Order } from '@/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TrackOrderPage() {
  const orders = useStore(state => state.orders);
  const fetchOrders = useStore(state => state.fetchOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');

  useEffect(() => {
    fetchOrders();
    // Check URL parameters for direct tracking links
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('id') || urlParams.get('phone') || urlParams.get('query') || urlParams.get('email');
      if (queryParam) {
        setSearchQuery(queryParam);
        executeSearch(queryParam);
      }
    }
  }, [fetchOrders]);

  const executeSearch = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsLoading(true);
    setSearchedTerm(trimmed);

    try {
      // Query Prisma database directly with multi-field search
      const res = await fetch(`/api/orders?query=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setSearchedOrders(data.orders);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to query live orders:", err);
    }

    // Fallback to local store
    const lower = trimmed.toLowerCase();
    const matches = orders.filter(o => 
      o.id.toLowerCase().includes(lower) ||
      o.phone.includes(trimmed) ||
      (o.email && o.email.toLowerCase().includes(lower)) ||
      o.fullName.toLowerCase().includes(lower)
    );
    matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSearchedOrders(matches);
    setIsLoading(false);
  };

  const handleCheckStatus = () => {
    executeSearch(searchQuery);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Verification':
        return <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-zinc-500/10 border border-zinc-400 text-zinc-200 rounded">Pending Verification</span>;
      case 'Processing':
        return <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-500/10 border border-blue-500 text-blue-400 rounded">Processing Order</span>;
      case 'Shipped':
        return <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-purple-500/10 border border-purple-500 text-purple-400 rounded">Shipped / In Transit</span>;
      case 'Delivered':
        return <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-green-500/10 border border-green-500 text-green-400 rounded">Delivered</span>;
      case 'Cancelled':
        return <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-red-500/10 border border-red-500 text-red-400 rounded">Cancelled</span>;
      default:
        return <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-muted border border-border text-foreground rounded">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-10 px-4 flex flex-col items-center">
        <div className="max-w-2xl w-full bg-card border border-border shadow-md rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex justify-center text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Truck className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-heading tracking-widest text-primary text-center">TRACK DELIVERY</h1>
        
        <p className="text-sm text-muted-foreground font-light leading-relaxed text-center">
          Enter your <strong>Email Address</strong>, <strong>Phone Number</strong>, or <strong>Order Tracking ID</strong> below to see real-time updates and delivery status.
        </p>

        <div className="pt-6 border-t border-border/50 space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g. DF-100200-BD, 01712345678, or yourname@gmail.com" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckStatus()}
              className="w-full industrial-input p-4 text-center tracking-wider text-base focus:border-primary"
            />
          </div>
          <button 
            onClick={handleCheckStatus} 
            disabled={isLoading}
            className="w-full industrial-button p-4 text-lg font-bold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>SEARCHING DATABASE...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>[ CHECK STATUS ]</span>
              </>
            )}
          </button>
        </div>

        {searchedOrders !== null && (
          <div className="pt-8 space-y-4 text-left border-t border-border/50 mt-8">
            <h3 className="font-heading tracking-widest text-lg text-center mb-6 text-foreground">
              {searchedOrders.length === 0 
                ? `No orders found matching "${searchedTerm}"`
                : `Found ${searchedOrders.length} Order${searchedOrders.length === 1 ? '' : 's'}`
              }
            </h3>
            
            <div className="grid gap-5">
              {searchedOrders.map(order => (
                <div key={order.id} className="p-6 border border-border bg-neutral-900/80 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-border/40 pb-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-bold">Tracking ID</span>
                      <div className="font-mono text-base font-bold text-primary">{order.id}</div>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-4 font-mono flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Placed on: {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-background/50 p-4 rounded-lg border border-border/30">
                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider block font-bold mb-0.5">Recipient</span>
                      <span className="text-foreground font-semibold">{order.fullName}</span>
                      {order.email && <span className="block text-xs text-muted-foreground font-mono">{order.email}</span>}
                      <span className="block text-xs text-muted-foreground font-mono">{order.phone}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider block font-bold mb-0.5">Order Type</span>
                      <span className="text-foreground font-semibold">{order.type}</span>
                      <span className="block text-xs text-primary font-bold mt-1">Advance: {order.advancePaid} TK (TrxID: {order.trxId || 'N/A'})</span>
                      {order.remainingBalance > 0 && (
                        <span className="block text-xs text-muted-foreground">Remaining COD: {order.remainingBalance} TK</span>
                      )}
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-border/20">
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider block font-bold mb-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" /> Delivery Address
                      </span>
                      <span className="text-foreground text-xs leading-relaxed">{order.address}</span>
                    </div>

                    {order.statusNote && (
                      <div className="sm:col-span-2 mt-2 p-3 bg-black/60 border border-primary/30 rounded-md">
                        <span className="text-primary text-[10px] uppercase tracking-[0.2em] block mb-1 font-bold">Admin Dispatch Update</span>
                        <span className="text-foreground/90 text-xs italic whitespace-pre-wrap">{order.statusNote}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-8 text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] inline-flex items-center gap-2">
            Return to Homepage
          </Link>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
