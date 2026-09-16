"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Star, 
  MessageCircle, 
  Flame,
  CheckCircle2,
  Layers,
  ShoppingBag
} from "lucide-react";
import { useLanguageStore, useProductStore, useCategoryStore } from "@/store";
import { translations } from "@/data/translations";

export default function Home() {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const PRODUCTS = useProductStore((state) => state.products);
  const categories = useCategoryStore((state) => state.categories);

  const [heroIndex, setHeroIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("all");

  const heroSlides = [
    {
      badge: "SEASONAL SALE",
      title: "BIG SEASONAL SALE",
      subtitle: "UP TO 50% OFF - LIMITED TIME ONLY!",
      cta: "SHOP NOW",
      link: "/shop?category=drop-shoulder",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1600&auto=format&fit=crop",
      tagline: "Authentic 220 GSM Combed Compact Cotton Drop Shoulders"
    },
    {
      badge: "RACING APPAREL",
      title: "BORN FOR SPEED",
      subtitle: "PREMIUM RACING APPAREL & VINTAGE ACID WASH",
      cta: "EXPLORE RACING",
      link: "/shop?search=racing",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
      tagline: "Heavyweight 240 GSM bio-washed street blanks"
    },
    {
      badge: "STREET CULTURE",
      title: "WEAR YOUR CULTURE",
      subtitle: "ELEVATED STREETWEAR ESSENTIALS FOR EVERYDAY LIFE",
      cta: "VIEW COLLECTION",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1600&auto=format&fit=crop",
      tagline: "Designed with purpose &bull; Blending style, comfort, and quality"
    }
  ];

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Tab filtering
  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "anime") return p.name.toLowerCase().includes("anime") || (p.description?.toLowerCase().includes("anime") ?? false);
    if (activeTab === "racing") return p.name.toLowerCase().includes("racing") || (p.description?.toLowerCase().includes("racing") ?? false);
    if (activeTab === "oversized") return p.category === "drop-shoulder" || p.category === "over-size-drop-shoulder" || p.category?.toLowerCase().includes("drop");
    if (activeTab === "acid-wash") return p.category === "acid-wash-drop-shoulder" || p.category?.toLowerCase().includes("acid");
    return true;
  });

  const trendingProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFC] text-gray-900 font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* 1. HERO BANNER SLIDER (Wear.com.bd / Woodmart style) */}
        <section className="relative w-full h-[460px] sm:h-[540px] md:h-[620px] bg-black overflow-hidden select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image */}
              <Image
                src={heroSlides[heroIndex].image}
                alt={heroSlides[heroIndex].title}
                fill
                priority
                className="object-cover object-center brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              
              {/* Slide Content */}
              <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-10 flex flex-col justify-center text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block px-3 py-1 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-sm mb-4 w-fit"
                >
                  {heroSlides[heroIndex].badge}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-heading font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase leading-[0.95] max-w-2xl"
                >
                  {heroSlides[heroIndex].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-xs sm:text-sm md:text-base font-semibold tracking-wider text-gray-200 uppercase mt-3 mb-2 font-mono"
                >
                  {heroSlides[heroIndex].subtitle}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="text-xs text-gray-300 font-light max-w-md mb-7 hidden sm:block"
                >
                  {heroSlides[heroIndex].tagline}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <Link
                    href={heroSlides[heroIndex].link}
                    className="px-8 py-3.5 bg-white hover:bg-gray-200 text-black text-xs font-bold tracking-widest uppercase rounded shadow-lg transition-all transform hover:scale-105"
                  >
                    {heroSlides[heroIndex].cta}
                  </Link>
                  <Link
                    href="/custom-order"
                    className="px-7 py-3.5 bg-black/60 hover:bg-black text-white border border-white/30 text-xs font-bold tracking-widest uppercase rounded transition-all backdrop-blur-sm"
                  >
                    Bespoke Studio
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Prev / Next Arrows */}
          <button
            onClick={() => setHeroIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-5 inset-x-0 z-20 flex justify-center gap-2.5">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  heroIndex === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* 2. TRENDING NOW SECTION (Woodmart style with center divider title) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-10">
            <div className="title-line-divider max-w-xl mx-auto">
              <h2 className="font-heading font-black text-xl sm:text-2xl tracking-wider text-gray-950 uppercase px-4 flex items-center gap-2 justify-center">
                <Flame className="w-5 h-5 text-red-600" />
                <span>Trending Now</span>
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-sans">
              Our most coveted drop shoulder fits & limited graphic series this week
            </p>
          </div>

          {/* Product Cards Grid: 4 cols on desktop, 2 cols on mobile (Woodmart Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-950 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm transition-all hover:scale-105"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 3. CATEGORY SHOWCASE PROMO BANNERS (Woodmart 3-grid) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Banner 1: Oversized */}
            <Link
              href="/shop?category=drop-shoulder"
              className="group relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-md flex items-end p-6 border border-gray-200"
            >
              <Image
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
                alt="Oversized Streetwear"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 text-white">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-300">
                  ESSENTIAL DROPS
                </span>
                <h3 className="font-heading font-black text-2xl uppercase tracking-tight mt-0.5 mb-2">
                  Oversized T-Shirts
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider underline underline-offset-4 group-hover:text-amber-400 transition-colors">
                  Shop Drop Shoulders &rarr;
                </span>
              </div>
            </Link>

            {/* Banner 2: Anime Series */}
            <Link
              href="/shop?search=anime"
              className="group relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-md flex items-end p-6 border border-gray-200"
            >
              <Image
                src="https://images.unsplash.com/photo-1580087442658-005d5fb5f0c0?q=80&w=800&auto=format&fit=crop"
                alt="Anime Streetwear Series"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 text-white">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
                  CULT FAVORITES
                </span>
                <h3 className="font-heading font-black text-2xl uppercase tracking-tight mt-0.5 mb-2">
                  WEAR Anime Series
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider underline underline-offset-4 group-hover:text-amber-400 transition-colors">
                  Explore Anime Drops &rarr;
                </span>
              </div>
            </Link>

            {/* Banner 3: Bespoke Custom Apparel */}
            <Link
              href="/custom-order"
              className="group relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-md flex items-end p-6 border border-gray-200"
            >
              <Image
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
                alt="Bespoke Custom Apparel"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 text-white">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  CUSTOM STUDIO
                </span>
                <h3 className="font-heading font-black text-2xl uppercase tracking-tight mt-0.5 mb-2">
                  Bespoke Printing
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider underline underline-offset-4 group-hover:text-emerald-400 transition-colors">
                  Design Your Shirt &rarr;
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* 4. TABBED PRODUCT SHOWCASE (Woodmart wd_products_tabs) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-8">
            <div className="title-line-divider max-w-xl mx-auto mb-5">
              <h2 className="font-heading font-black text-xl sm:text-2xl tracking-wider text-gray-950 uppercase px-4">
                Collections & Series
              </h2>
            </div>

            {/* Filter Tabs matching wear.com.bd */}
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
              {[
                { id: "all", label: "All Items" },
                { id: "oversized", label: "Oversized Tees" },
                { id: "anime", label: "Anime Series" },
                { id: "racing", label: "Racing Series" },
                { id: "acid-wash", label: "Acid Wash" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-black text-white shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 5. TRUST BADGES & SERVICE HIGHLIGHTS (Wear.com.bd 4-column bar) */}
        <section className="border-y border-gray-200 bg-white py-10 my-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="flex items-center gap-4 p-2">
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-black">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900">
                    Free Delivery
                  </h4>
                  <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                    On orders over ৳2000 nationwide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-2">
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-black">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900">
                    100% Combed Cotton
                  </h4>
                  <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                    180 - 240 GSM organic bio-washed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-2">
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-black">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900">
                    Cash on Delivery
                  </h4>
                  <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                    Check your parcel at doorstep
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-2">
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-black">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900">
                    7-Day Exchange
                  </h4>
                  <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                    Hassle-free size or fit replacement
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. COMMUNITY FLEX & WHATSAPP CONCIERGE FLOAT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                NEED INSTANT STYLING ADVICE?
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight mt-1 mb-3">
                Chat with WhatsApp Concierge
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-sans font-light mb-6">
                Connect with our product specialists for sizing assistance, custom design proofs, and priority dispatch.
              </p>
              <a
                href="https://wa.me/8801710793841"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer font-mono"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Open WhatsApp (01710793841)</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
