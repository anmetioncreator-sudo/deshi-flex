"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCarousel from "@/components/product/ProductCarousel";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRight, Sparkles, Star, Mail, ChevronRight, ShoppingBag, MessageSquare, Send, X, Globe, Camera, MessageCircle, MapPin, Phone } from "lucide-react";
import { useLanguageStore, useProductStore, useCategoryStore, useSiteSettingsStore } from "@/store";
import { translations } from "@/data/translations";

export default function Home() {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const PRODUCTS = useProductStore((state) => state.products);
  const categories = useCategoryStore((state) => state.categories);

  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [homeEmail, setHomeEmail] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const { heroImages, forHimImage, forHerImage } = useSiteSettingsStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("deshiflex-language")) {
      const timer = setTimeout(() => setShowLanguageModal(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const selectLanguage = (lang: string) => {
    localStorage.setItem("deshiflex-language", lang);
    setShowLanguageModal(false);
  };

  useEffect(() => {
    if (loading || heroImages.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [loading, heroImages.length]);

  const newInProducts = PRODUCTS.filter((p) => p.isNew).slice(0, 4);

  const handleCategoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const width = target.offsetWidth || 1;
    const index = Math.min(
      categories.length,
      Math.max(1, Math.round(target.scrollLeft / (width * 0.65)) + 1)
    );
    setCurrentCategoryIndex(index);
  };



  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center"
          >
            <motion.h1
              initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-4xl md:text-5xl lg:text-6xl tracking-[0.2em] sm:tracking-[0.4em] text-foreground font-thin uppercase text-center px-4"
            >
              DESHI FLEX
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="text-[9px] md:text-[10px] tracking-[0.15em] sm:tracking-[0.5em] font-light text-foreground/70 uppercase mt-8 text-center px-4"
            >
              Jamalpur Heritage. High-End Fashion.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card text-card-foreground w-full max-w-md p-8 border border-border shadow-2xl relative text-center"
            >
              <h2 className="font-heading text-3xl tracking-widest mb-2 uppercase text-foreground">Select Language</h2>
              <p className="text-xs text-muted-foreground font-light mb-8">Choose your preferred language / আপনার পছন্দের ভাষা নির্বাচন করুন</p>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => selectLanguage("en")}
                  className="w-full py-4 border border-primary text-foreground hover:bg-primary hover:text-primary-foreground font-heading tracking-widest transition-colors uppercase"
                >
                  English
                </button>
                <button
                  onClick={() => selectLanguage("bn")}
                  className="w-full py-4 border border-primary text-foreground hover:bg-primary hover:text-primary-foreground font-heading tracking-widest transition-colors uppercase"
                >
                  বাংলা (Bangla)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />

        <main className="flex-grow pt-0">
          {/* Editorial / Magazine Style Hero */}
          <section className="relative h-[88vh] w-full bg-background overflow-hidden flex items-center">
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full lg:w-[65%] lg:right-0 lg:left-auto">
              <AnimatePresence>
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={heroImages[heroIndex] || "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop"}
                    alt="Editorial Fashion Banner"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                  {/* Subtle gradient to blend left side for desktop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent hidden lg:block" />
                  {/* Gradient for mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent lg:hidden" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Giant Background Outline Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-[0.03] lg:opacity-5">
              <span className="text-[15rem] md:text-[25rem] font-sans whitespace-nowrap leading-none tracking-widest font-thin" style={{ WebkitTextStroke: "1px var(--color-foreground)", color: "transparent" }}>
                DF-26
              </span>
            </div>

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col justify-end lg:justify-center h-full pb-20 lg:pb-0 overflow-x-hidden">
              <div className="max-w-4xl mx-auto flex flex-col items-center text-center w-full px-2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mb-8"
                >
                  <span className="text-xs md:text-sm tracking-[0.4em] font-montserrat font-medium text-foreground uppercase">
                    {t.hero_subtitle}
                  </span>
                  <div className="w-16 h-[1px] bg-foreground/40 mx-auto mt-4"></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.9 }}
                  className="space-y-1 sm:space-y-2 mb-8 w-full"
                >
                  {/* Main headline using Cinzel's native small caps for the rest of the word */}
                  <h2 className="font-cinzel text-[14vw] sm:text-[11vw] md:text-[100px] lg:text-[150px] tracking-normal sm:tracking-[0.05em] leading-[1.0] sm:leading-[0.85] text-foreground font-bold whitespace-nowrap pt-3 sm:pt-0">
                    <span className="text-[1.2em]">J</span><span className="lowercase">amalpurs</span>
                  </h2>
                  <h2 className="font-cinzel text-[11vw] sm:text-[9vw] md:text-8xl lg:text-[110px] tracking-normal sm:tracking-[0.05em] leading-[1.1] sm:leading-[0.9] text-foreground font-bold whitespace-nowrap pt-3 sm:pt-0">
                    <span className="text-[1.2em]">H</span><span className="lowercase">eritage</span>
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {/* Clean, geometric sans-serif for the subtitle */}
                  <h2 className="font-montserrat text-sm md:text-base tracking-[0.4em] text-foreground uppercase font-medium mb-5">
                    {t.hero_title_2}
                  </h2>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-sm md:text-lg text-foreground/60 max-w-xl font-serif italic tracking-wide leading-relaxed normal-case px-4 sm:px-8 break-words"
                >
                  {t.hero_desc}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="flex flex-row items-center justify-center gap-3 sm:gap-6 mt-12 w-full sm:max-w-none max-w-sm mx-auto"
                >
                  <Link
                    href="/shop"
                    className="bg-foreground text-background px-4 py-4 sm:px-10 sm:py-5 text-[9px] sm:text-xs font-heading tracking-[0.2em] w-1/2 sm:w-auto hover:bg-transparent hover:text-foreground border border-foreground transition-all duration-300 shadow-xl text-center"
                  >
                    {t.explore_now}
                  </Link>
                  <Link
                    href="/custom-order"
                    className="bg-transparent text-foreground border border-foreground px-4 py-4 sm:px-10 sm:py-5 text-[9px] sm:text-xs font-heading tracking-[0.2em] w-1/2 sm:w-auto hover:bg-foreground hover:text-background transition-all duration-300 text-center"
                  >
                    {t.custom_orders}
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Editorial Navigation / Slider Controls */}
            <div className="absolute bottom-8 right-8 z-30 flex items-center gap-6 hidden md:flex">
              <div className="text-xs font-mono tracking-widest text-foreground/50">
                0{heroIndex + 1} <span className="mx-2">/</span> 0{heroImages.length}
              </div>
              <div className="flex gap-2">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`h-[2px] transition-all duration-500 ease-out ${
                      heroIndex === i ? "bg-foreground w-12" : "bg-muted-foreground w-4 hover:w-8"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2 md:hidden">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`h-[2px] transition-all duration-500 ease-out ${
                      heroIndex === i ? "bg-foreground w-8" : "bg-muted-foreground w-4"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
            </div>
          </section>

          {/* New In Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="py-20 max-w-[1600px] mx-auto px-4 lg:px-12 border-b border-border"
          >
            <div className="text-center mb-16">
              <h4 className="text-foreground/70 font-sans tracking-[0.3em] text-[10px] uppercase mb-4">Latest Arrivals</h4>
              <h3 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
                {t.new_in}
              </h3>
              <div className="w-16 h-[1px] bg-foreground/20 mx-auto mb-6" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {t.new_in_desc}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 lg:gap-12">
              {newInProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link
                href="/shop"
                className="text-xs text-muted-foreground hover:text-primary tracking-widest uppercase transition-colors underline font-light underline-offset-4"
              >
                {t.view_all}
              </Link>
            </div>
          </motion.section>

          {/* Explore Section (Him / Her columns) */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="py-20 max-w-7xl mx-auto px-4 border-b border-border"
          >
            <div className="text-center mb-16">
              <h4 className="silver-text-gradient font-sans font-semibold tracking-[0.3em] text-[10px] uppercase mb-4">Curated Style</h4>
              <h3 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
                {t.explore}
              </h3>
              <div className="w-16 h-[1px] bg-foreground/20 mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-0 border border-border">
              {/* For Him */}
              <Link
                href="/shop?gender=men"
                className="relative flex items-center justify-center h-[250px] sm:h-[400px] md:h-[650px] group overflow-hidden bg-neutral-950 border-r border-border"
              >
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={forHimImage || "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop"}
                    alt="Men Streetwear Fit"
                    fill
                    className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-background/60 transition-colors duration-1000" />
                </div>
                <div className="relative z-20 flex flex-col items-center gap-2 sm:gap-4 text-center p-2 sm:p-6">
                  <span className="font-sans text-[7px] sm:text-[9px] md:text-xs tracking-[0.4em] text-foreground/70 uppercase">Explore Collection</span>
                  <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground group-hover:text-primary transition-colors duration-500 tracking-wide drop-shadow-2xl">
                    {t.for_him}
                  </h3>
                  <div className="w-0 h-[1px] bg-primary group-hover:w-16 md:group-hover:w-24 transition-all duration-1000 ease-out mt-2 sm:mt-4" />
                </div>
              </Link>

              {/* For Her */}
              <Link
                href="/shop?gender=women"
                className="relative flex items-center justify-center h-[250px] sm:h-[400px] md:h-[650px] group overflow-hidden bg-neutral-950"
              >
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={forHerImage || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop"}
                    alt="Women Streetwear Fit"
                    fill
                    className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-background/60 transition-colors duration-1000" />
                </div>
                <div className="relative z-20 flex flex-col items-center gap-2 sm:gap-4 text-center p-2 sm:p-6">
                  <span className="font-sans text-[7px] sm:text-[9px] md:text-xs tracking-[0.4em] text-foreground/70 uppercase">Explore Collection</span>
                  <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground group-hover:text-primary transition-colors duration-500 tracking-wide drop-shadow-2xl">
                    {t.for_her}
                  </h3>
                  <div className="w-0 h-[1px] bg-primary group-hover:w-16 md:group-hover:w-24 transition-all duration-1000 ease-out mt-2 sm:mt-4" />
                </div>
              </Link>
            </div>
          </motion.section>

          {/* Categories Section (Tall 650px desktop layouts / Touch snap horizontal scroll on mobile) */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="py-20 max-w-7xl mx-auto px-4 border-b border-border"
          >
            <div className="text-center mb-16">
              <h4 className="silver-text-gradient font-sans font-semibold tracking-[0.3em] text-[10px] uppercase mb-4">Discover</h4>
              <h3 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
                {t.categories}
              </h3>
              <div className="w-16 h-[1px] bg-foreground/20 mx-auto" />
            </div>

            {/* Mobile Scroll Pager */}
            <div className="hidden text-center text-xs text-muted-foreground uppercase tracking-widest mb-4 font-light">
              {currentCategoryIndex} / {categories.length}
            </div>

            {/* Premium Grid display layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full px-4">
              {categories.map((cat, idx) => (
                <div key={cat.slug} className="w-full">
                  {/* PC Animated Version */}
                  <div className="hidden md:block">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                    >
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className="relative flex items-end justify-start h-[450px] group overflow-hidden bg-neutral-950 rounded-sm shadow-xl border border-white/5"
                      >
                        <Image
                          src={cat.bg || ''}
                          alt={cat.name}
                          fill
                          className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                        
                        {/* Glassmorphic info box */}
                        <div className="relative z-20 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <div className="bg-black/30 backdrop-blur-md border border-white/10 p-5 rounded-sm overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h4 className="font-heading text-3xl tracking-widest text-white group-hover:text-primary transition-colors uppercase leading-tight mb-2 drop-shadow-lg relative z-10">
                              {cat.name}
                            </h4>
                            <p className="text-xs text-white/70 font-light tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 relative z-10">
                              {cat.desc}
                            </p>
                            
                            {/* Animated underline */}
                            <div className="absolute bottom-0 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                  
                  {/* Mobile Simple Version */}
                  <div className="block md:hidden">
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className="relative flex items-end justify-start h-[200px] overflow-hidden bg-neutral-900 rounded-lg shadow-md border border-white/10"
                    >
                      <Image
                        src={cat.bg || ''}
                        alt={cat.name}
                        fill
                        className="object-cover opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                      
                      <div className="relative z-20 p-4 w-full">
                        <h4 className="font-heading text-xl tracking-widest text-white uppercase leading-tight drop-shadow-md">
                          {cat.name}
                        </h4>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>



          {/* Newsletter / Drops Registration */}
          <section className="py-24 bg-card border-b border-border relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

            <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
              <Mail className="h-8 w-8 text-primary mx-auto mb-6" />
              <h3 className="font-heading text-4xl md:text-5xl tracking-wide mb-4">
                {t.get_first_access}
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed mb-8 max-w-sm mx-auto">
                {t.newsletter_desc}
              </p>

              {isAdminUnlocked ? (
                <div className="flex flex-col gap-4 mt-6">
                  <div className="p-4 border border-primary bg-primary/10 animate-pulse text-center">
                    <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">{t.admin_access}</p>
                    <Link href="/admin" className="inline-block bg-primary text-foreground font-bold uppercase text-xs py-3 px-8 hover:bg-background transition-colors">
                      {t.enter_admin}
                    </Link>
                  </div>
                </div>
              ) : showPinInput ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Require bcrypt dynamically here since it's a client component
                    const bcrypt = require('bcryptjs');
                    if (bcrypt.compareSync(pin, "$2b$10$Tzq906wlqtqOtfk6LLoz6uX6qympx67uTEaoqHD6qVWxiSiOvpcB.")) {
                      setIsAdminUnlocked(true);
                      setShowPinInput(false);
                    } else {
                      alert("Incorrect PIN. Access Denied.");
                      setPin("");
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-2 mt-6"
                >
                  <input
                    type="password"
                    placeholder={t.secret_pin}
                    aria-label="Secret PIN"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="flex-1 bg-background border border-primary focus:border-white px-5 py-4 text-xs font-light tracking-widest rounded-none focus:outline-none transition-colors uppercase text-foreground text-center"
                    maxLength={4}
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-accent py-4 px-8 text-xs font-heading tracking-widest font-bold transition-colors"
                  >
                    {t.verify}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (homeEmail.trim() === "anmetioncreator@gmail.com") {
                      setShowPinInput(true);
                      return;
                    }
                    alert("Successfully signed up for drop notifications!");
                    setHomeEmail("");
                  }}
                  className="flex flex-col sm:flex-row gap-2 mt-6"
                >
                  <input
                    type="email"
                    placeholder={t.email_placeholder}
                    aria-label="Email Address"
                    required
                    value={homeEmail}
                    onChange={(e) => setHomeEmail(e.target.value)}
                    className="flex-1 bg-background border border-border focus:border-primary px-5 py-4 text-xs font-light tracking-wide rounded-none focus:outline-none transition-colors uppercase text-foreground"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-accent py-4 px-8 text-xs font-heading tracking-widest font-bold transition-colors"
                  >
                    {t.subscribe}
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Floating Chat Support FAB */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full flex items-center justify-center bg-background text-foreground hover:bg-background hover:text-foreground border border-primary/40 shadow-2xl hover:border-black transition-all duration-300 z-40"
        aria-label="Live Chat Support"
      >
        {isChatOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 text-primary hover:text-foreground" />}
      </button>

      {/* Chat Box Drawer Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-6 bottom-24 w-[360px] max-w-[90vw] bg-card border border-border shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col h-[480px]"
          >
            {/* Header */}
            <div className="bg-muted p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <h4 className="font-heading text-sm text-foreground tracking-wide leading-none">DF SUPPORT</h4>
                  <span className="text-[9px] text-muted-foreground font-light">Online · Local time BD</span>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contact Details Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-card">
              <p className="text-xs text-muted-foreground font-light leading-relaxed mb-4">
                Reach out to us directly through any of our official channels below:
              </p>

              <div className="space-y-5 text-sm font-light text-foreground">
                <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors border border-border">
                  <MessageCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-primary text-[10px] tracking-widest uppercase mb-1">WhatsApp</span>
                    01710793841
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors border border-border">
                  <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-primary text-[10px] tracking-widest uppercase mb-1">Facebook</span>
                    <a href="https://www.facebook.com/deshiflex12" target="_blank" rel="noreferrer" className="hover:underline transition-all">
                      facebook.com/deshiflex12
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors border border-border">
                  <Camera className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-primary text-[10px] tracking-widest uppercase mb-1">Instagram</span>
                    <a href="https://www.instagram.com/deshiflex12/" target="_blank" rel="noreferrer" className="hover:underline transition-all">
                      @deshiflex12
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors border border-border">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-primary text-[10px] tracking-widest uppercase mb-1">Email</span>
                    deshiflex12@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
