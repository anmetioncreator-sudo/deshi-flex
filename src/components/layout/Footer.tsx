"use client";

import Link from "next/link";
import { useState } from "react";
import { Send, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useLanguageStore, useCategoryStore } from "@/store";
import { translations } from "@/data/translations";
import SeoKeywordsSection from "./SeoKeywordsSection";

export default function Footer() {
  const categories = useCategoryStore(state => state.categories);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");

  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "anmetioncreator@gmail.com") {
      setShowPinInput(true);
      return;
    }
    
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-card text-foreground border-t border-border mt-auto">
      {/* Brand features trust bar */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-border text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg hover:bg-muted/10 transition-colors">
          <Truck className="h-8 w-8 text-primary" />
          <div>
            <h4 className="font-heading text-lg tracking-wider">{t.fast_delivery}</h4>
            <p className="text-xs text-muted-foreground">{t.fast_delivery_desc}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg hover:bg-muted/10 transition-colors">
          <RotateCcw className="h-8 w-8 text-primary" />
          <div>
            <h4 className="font-heading text-lg tracking-wider">{t.return_policy}</h4>
            <p className="text-xs text-muted-foreground">{t.return_policy_desc}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg hover:bg-muted/10 transition-colors">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <h4 className="font-heading text-lg tracking-wider">{t.secure_payments}</h4>
            <p className="text-xs text-muted-foreground">{t.secure_payments_desc}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-6 text-center border-b border-border/40">
        <Link href="/" className="font-heading text-4xl tracking-[0.2em] text-primary hover:text-accent transition-colors select-none font-bold inline-block">
          𝐃𝐄𝐒𝐇𝐈 𝐅𝐋𝐄𝐗
        </Link>
        <p className="mt-2 text-xs text-muted-foreground tracking-widest font-light">
          Crafting a legacy from Bangladesh to the world.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Info Column */}
        <div>
          <h5 className="font-heading text-lg tracking-wider mb-5 text-foreground ">{t.info}</h5>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors font-light">{t.about_us}</Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors font-light">{t.contact}</Link>
            </li>
            <li>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors font-light">{t.privacy}</Link>
            </li>
            <li>
              <Link href="/refund" className="text-muted-foreground hover:text-primary transition-colors font-light">{t.refund}</Link>
            </li>
            <li>
              <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors font-light">{t.faq}</Link>
            </li>
          </ul>
        </div>

        {/* Shop Column */}
        <div>
          <h5 className="font-heading text-lg tracking-wider mb-5 text-foreground ">{t.shop}</h5>
          <ul className="space-y-3 text-sm">
            {categories.slice(0, 6).map(cat => (
              <li key={cat.id}>
                <Link href={`/shop?category=${cat.slug}`} className="text-muted-foreground hover:text-primary transition-colors font-light font-body">{cat.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors font-light font-body">{t.everything}</Link>
            </li>
          </ul>
        </div>

        {/* Explore Column */}
        <div>
          <h5 className="font-heading text-lg tracking-wider mb-5 text-foreground ">{t.explore}</h5>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors font-light font-body">{t.journal}</Link>
            </li>
            <li>
              <Link href="/shop?wishlist=true" className="text-muted-foreground hover:text-primary transition-colors font-light font-body">{t.my_wishlist}</Link>
            </li>
            <li>
              <Link href="/shop?sort=rating" className="text-muted-foreground hover:text-primary transition-colors font-light font-body">{t.top_rated}</Link>
            </li>
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors font-light font-body">{t.brand_story}</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* SEO Keywords & Popular Searches */}
      <SeoKeywordsSection />

      {/* Bottom Bar */}
      <div className="border-t border-border/50 py-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Copyright */}
          <p className="text-xs text-muted-foreground font-light hover:text-primary hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 cursor-default">
            &copy; {new Date().getFullYear()} Deshi Flex. All rights reserved. Made in Bangladesh.
          </p>
          
          {/* Social Medias with CDN logos */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-primary drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] mr-1">FOLLOW US:</span>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 relative flex items-center justify-center bg-muted border border-border p-1.5 hover:border-primary hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:bg-primary/5 transition-all duration-300 hover:-translate-y-0.5 group" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 relative flex items-center justify-center bg-muted border border-border p-1.5 hover:border-primary hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:bg-primary/5 transition-all duration-300 hover:-translate-y-0.5 group" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 relative flex items-center justify-center bg-muted border border-border p-1.5 hover:border-primary hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:bg-primary/5 transition-all duration-300 hover:-translate-y-0.5 group" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all"><path d="M2.5 7.17c.23-1.4 1.1-2.27 2.5-2.5 3.32-.34 8.68-.34 12 0 1.4.23 2.27 1.1 2.5 2.5.34 3.32.34 8.68 0 12-.23 1.4-1.1 2.27-2.5 2.5-3.32.34-8.68.34-12 0-1.4-.23-2.27-1.1-2.5-2.5-.34-3.32-.34-8.68 0-12z"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
          </div>

          {/* Secure Payment Methods */}
          <div className="flex flex-col items-center lg:items-end gap-2">
            <span className="text-[10px] uppercase tracking-wider text-primary drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">PAY SECURELY VIA:</span>
            <div className="flex items-center gap-3">
              {/* bKash */}
              <div className="relative flex flex-col items-center justify-center px-5 py-2.5 bg-accent border border-border hover:border-white/60 hover:bg-muted hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-default group min-w-[120px]">
                <span className="font-heading tracking-[0.2em] text-foreground text-sm font-bold uppercase">bKash</span>
                <span className="text-[11px] text-foreground/70 font-mono font-semibold mt-0.5 tracking-wider group-hover:text-foreground transition-colors">01852786645</span>
              </div>
              {/* Nagad */}
              <div className="relative flex flex-col items-center justify-center px-5 py-2.5 bg-accent border border-border hover:border-white/60 hover:bg-muted hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-default group min-w-[120px]">
                <span className="font-heading tracking-[0.2em] text-foreground text-sm font-bold uppercase">Nagad</span>
                <span className="text-[11px] text-foreground/70 font-mono font-semibold mt-0.5 tracking-wider group-hover:text-foreground transition-colors">01710793841</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
