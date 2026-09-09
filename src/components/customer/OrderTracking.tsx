"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store';
import { Order } from '@/types';
import { Search } from 'lucide-react';

const translations = {
  en: {
    trackTitle: "Track Your Order",
    enterPlaceholder: "e.g. DF-100200-BD, 01712345678, or yourname@gmail.com",
    searchBtn: "[Search Order]",
    resultsTitle: "Search Results",
    noOrders: "No orders found matching your search term.",
    colId: "Order ID",
    colDate: "Date",
    colType: "Type / Details",
    colAdvance: "Advance Paid",
    colCod: "COD Balance",
    colStatus: "Status"
  },
  bn: {
    trackTitle: "আপনার অর্ডার ট্র্যাক করুন",
    enterPlaceholder: "যেমন: DF-100200-BD, 01712345678, অথবা yourname@gmail.com",
    searchBtn: "[অর্ডার খুঁজুন]",
    resultsTitle: "অনুসন্ধানের ফলাফল",
    noOrders: "এই তথ্যের জন্য কোনো অর্ডার পাওয়া যায়নি।",
    colId: "অর্ডার আইডি",
    colDate: "তারিখ",
    colType: "প্রকার / বিবরণ",
    colAdvance: "অগ্রিম পেমেন্ট",
    colCod: "COD ব্যালেন্স",
    colStatus: "স্ট্যাটাস"
  }
};

export default function OrderTracking() {
  const orders = useStore((state) => state.orders);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setIsLoading(true);
    
    try {
      const res = await fetch(`/api/orders?query=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setResults(data.orders);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Live order search failed:", err);
    }

    const lower = trimmed.toLowerCase();
    const foundOrders = orders.filter(o => 
      o.id.toLowerCase().includes(lower) ||
      o.phone.includes(trimmed) ||
      (o.email && o.email.toLowerCase().includes(lower)) ||
      o.fullName.toLowerCase().includes(lower)
    );
    setResults(foundOrders);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending Verification': return 'text-zinc-300 border-zinc-400';
      case 'Processing': return 'text-blue-500 border-blue-500';
      case 'Shipped': return 'text-purple-500 border-purple-500';
      case 'Delivered': return 'text-green-500 border-green-500';
      case 'Cancelled': return 'text-red-500 border-red-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-punk p-6">
        <h3 className="text-xl font-bebas tracking-widest text-primary mb-4">{t.trackTitle}</h3>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder={t.enterPlaceholder} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full industrial-input p-3 pl-10 text-sm" 
              required
            />
          </div>
          <button type="submit" disabled={isLoading} className="md:w-auto p-3 industrial-button whitespace-nowrap font-bold">
            {isLoading ? "Searching..." : t.searchBtn}
          </button>
        </form>
      </div>

      {results !== null && (
        <div className="glass-punk p-6">
          <h4 className="text-lg font-bebas text-accent mb-4">{t.resultsTitle}</h4>
          
          {results.length === 0 ? (
            <p className="text-muted-foreground">{t.noOrders}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
                    <th className="p-3">{t.colId}</th>
                    <th className="p-3">{t.colDate}</th>
                    <th className="p-3">{t.colType}</th>
                    <th className="p-3">{t.colAdvance}</th>
                    <th className="p-3">{t.colCod}</th>
                    <th className="p-3">{t.colStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                      <td className="p-3 font-mono text-sm font-bold text-primary">{order.id}</td>
                      <td className="p-3 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="p-3 text-sm">
                        <div>
                          <span className="font-semibold text-foreground">{order.fullName}</span>
                          {order.email && <span className="block text-xs text-muted-foreground font-mono">{order.email}</span>}
                          <span className="block text-xs text-muted-foreground">{order.type}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm font-mono">{order.advancePaid} TK</td>
                      <td className="p-3 text-sm font-mono">
                        {order.remainingBalance ? `${order.remainingBalance} TK` : '0 TK'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs border ${getStatusColor(order.status)} uppercase font-bold tracking-wider`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
