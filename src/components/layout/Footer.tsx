"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Phone, Mail, Send, MessageCircle, Truck } from "lucide-react";
import SeoKeywordsSection from "./SeoKeywordsSection";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#111114] text-gray-300 border-t border-white/10 mt-auto select-none">
      {/* MAIN 3-COLUMN FOOTER MATCHING WEAR.COM.BD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          
          {/* COLUMN 1: BRAND INFO & CONTACT (MD:col-span-5) */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 shrink-0">
                <Image src="/df-logo.png" alt="DESHI FLEX" fill className="object-contain" />
              </div>
              <h3 className="font-heading font-black text-2xl text-white tracking-wider uppercase">
                DESHI FLEX
              </h3>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-sans pr-4">
              <strong className="text-white">DESHI FLEX</strong> is a contemporary streetwear brand based in Bangladesh, committed to creating elevated essentials for everyday life. Our collections are designed with purpose—blending culture, comfort, and uncompromising cotton quality.
            </p>

            {/* Contact details list matching wear.com.bd */}
            <div className="space-y-3 pt-2 text-xs font-sans">
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                <span>House 11, Road 15, Block A, Mirpur - 11, Dhaka, Bangladesh</span>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-gray-300 shrink-0" />
                <div className="flex items-center gap-2 font-mono">
                  <a href="tel:+8801710793841" className="hover:text-white transition-colors">+880 1710 793841</a>,
                  <a href="tel:+8801852786645" className="hover:text-white transition-colors">+880 1852 786645</a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-gray-300 shrink-0" />
                <a href="mailto:support@deshiflex.shop" className="hover:text-white font-mono transition-colors">
                  support@deshiflex.shop
                </a>
              </div>
            </div>

            {/* Social Follow Links */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 font-mono">
                Connect With Us:
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/15 transition-all"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/15 transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/8801710793841"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                  aria-label="WhatsApp Concierge"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: POPULAR CATEGORIES (MD:col-span-3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-white/10 pb-2.5">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li>
                <Link href="/shop?category=over-size-drop-shoulder" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Streetwear Essentials
                </Link>
              </li>
              <li>
                <Link href="/shop?search=anime" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  WEAR Anime Series
                </Link>
              </li>
              <li>
                <Link href="/shop?category=acid-wash-drop-shoulder" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Washed Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=drop-shoulder" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Signature Drop Shoulder
                </Link>
              </li>
              <li>
                <Link href="/shop?search=racing" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Racing Series T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all">
                  Bespoke Custom Apparel
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: USEFUL LINKS & NEWSLETTER (MD:col-span-4) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-white/10 pb-2.5">
              Useful Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 font-sans">
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    Shipping Policy
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/refund" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    Return & Refund
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="hover:text-white hover:translate-x-1 inline-block transition-all flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Join the VIP Flex Club
              </p>
              <p className="text-[11px] text-gray-400 mb-3">
                Subscribe for exclusive drop announcements and secret seasonal voucher codes.
              </p>
              <form onSubmit={handleSubscribe} className="flex rounded-lg overflow-hidden border border-white/15 bg-white/5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 text-xs text-white bg-transparent outline-none placeholder:text-gray-500 font-sans"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-1.5 font-mono">
                  ✓ You have been subscribed successfully!
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SEO KEYWORDS CONTAINER (Subtle & Indexable) */}
      <div className="border-t border-white/5 bg-[#0b0b0d]">
        <SeoKeywordsSection />
      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="border-t border-white/10 bg-[#09090b] py-5 px-4 text-center text-xs text-gray-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Copyright ©️ 2025 <strong className="text-gray-300">DESHI FLEX</strong>. All Right Reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            <span>Cash on Delivery (COD) Available</span>
            <span>•</span>
            <span>Home Delivery Across Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
