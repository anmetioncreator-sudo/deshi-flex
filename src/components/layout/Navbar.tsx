"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore, useWishlistStore, useLanguageStore, useProductStore, useUserStore } from "@/store";
import { translations } from "@/data/translations";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Heart, Search, Menu, X, Plus, Minus, Trash2, Sun, Moon, ArrowRight, Sparkles, Truck, User
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const PRODUCTS = useProductStore((state) => state.products);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const [isEverythingActive, setIsEverythingActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const getCartCount = useCartStore((state) => state.getCartCount);
  
  const wishlistItems = useWishlistStore((state) => state.items);
  const isCustomerLoggedIn = useUserStore((state) => state.isLoggedIn);
  const currentUser = useUserStore((state) => state.user);

  // Sync scroll state and mounted state
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setTheme(isDark ? "dark" : "light");
    localStorage.setItem("deshiflex-theme", isDark ? "dark" : "light");
  };

  // Close menus on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsEverythingActive(pathname === "/shop" && !window.location.search);
  }, [pathname]);

  const isHomePage = pathname === "/";
  const isDarkBg = isHomePage && !isScrolled;

  // Filtered search results (limit to top 4)
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md py-4 shadow-lg"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 relative">
          
          {/* Logo (Desktop: left-aligned, Mobile: centered) */}
          <div className="flex items-center lg:absolute lg:left-4 lg:top-1/2 lg:-translate-y-1/2 z-10 w-full justify-center lg:justify-start px-16 lg:px-0">
            {/* Hamburger on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden absolute left-4 p-1 hover:text-primary transition-colors ${isDarkBg ? "text-foreground" : "text-foreground"}`}
              aria-label="Mobile Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-4 group select-none"
            >
              <div className="relative h-9 w-16 sm:h-11 sm:w-20 md:h-12 md:w-24 shrink-0 transition-all duration-300">
                <Image
                  src="/df-logo.png"
                  alt="Deshiflex Official Logo"
                  fill
                  priority
                  className="object-contain filter drop-shadow-[0_2px_14px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_4px_22px_rgba(255,255,255,0.7)] group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <span className={`font-heading text-xl sm:text-2xl md:text-3xl tracking-widest group-hover:text-accent transition-colors font-bold whitespace-nowrap ${isDarkBg ? "text-foreground" : "text-primary"}`}>
                𝐃𝐄𝐒𝐇𝐈 𝐅𝐋𝐄𝐗
              </span>
            </Link>
          </div>

          {/* Centered Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-8 text-xs tracking-[0.25em] font-medium z-10">
            {/* Removed outdated categories per request */}
          </nav>

          {/* Action Icons (Desktop: right-aligned, Mobile: right-aligned) */}
          <div className="flex items-center gap-3 md:gap-4 absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {/* User Account / Login */}
            <Link
              href="/login"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border/60 hover:border-primary/80 transition-all group ${
                isDarkBg ? "text-foreground bg-white/5" : "text-foreground bg-muted/40"
              }`}
              aria-label="Customer Login & Account"
            >
              <User className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold tracking-wider hidden sm:inline">
                {mounted && isCustomerLoggedIn && currentUser ? (
                  <span className="text-primary truncate max-w-[90px] inline-block font-mono text-[11px]">{currentUser.name.split(" ")[0]}</span>
                ) : (
                  "Login"
                )}
              </span>
            </Link>

            {/* Track Delivery */}
            <Link
              href="/track-order"
              className={`p-1 hover:text-primary transition-colors relative hidden sm:block ${isDarkBg ? "text-foreground" : "text-foreground"}`}
              aria-label="Track Delivery"
            >
              <Truck className="h-6 w-6" />
            </Link>


            {/* Wishlist */}
            <Link
              href="/shop?wishlist=true"
              className={`p-1 hover:text-primary transition-colors relative hidden sm:block ${isDarkBg ? "text-foreground" : "text-foreground"}`}
              aria-label="Wishlist"
            >
              <Heart className="h-6 w-6" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`p-1 hover:text-primary transition-colors relative ${isDarkBg ? "text-foreground" : "text-foreground"}`}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {mounted && getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1 hover:text-primary transition-colors ${isDarkBg ? "text-foreground" : "text-foreground"}`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 w-full h-screen bg-background/95 backdrop-blur-md z-30 pt-24 px-6 flex flex-col justify-between pb-10"
          >
            <nav className="flex flex-col gap-6 font-heading text-2xl tracking-widest text-center mt-8">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">{t.home}</Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">{t.shop_all}</Link>
              {/* Removed old categories */}
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">{t.about_us}</Link>
              <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">TRACK PRODUCTS</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">{t.contact}</Link>
            </nav>

            {/* Mobile Account Access */}
            <div className="px-4 my-6">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-accent transition-colors"
              >
                <User className="h-4 w-4" />
                {mounted && isCustomerLoggedIn && currentUser ? `Account (${currentUser.name})` : "Customer Sign In / Register"}
              </Link>
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-6 items-center">
              <Link href="/shop?wishlist=true" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Heart className="h-4 w-4 text-primary" /> {t.wishlist} ({wishlistItems.length})
              </Link>
              <p className="text-[10px] text-muted-foreground font-light">Bangladesh heritage engineered into high-end fashion.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-background z-50 cursor-pointer"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col justify-between shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-heading text-xl tracking-wider flex items-center gap-2">
                  {t.shopping_cart} <span className="text-sm font-body font-light text-muted-foreground">({getCartCount()})</span>
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:text-primary transition-colors text-foreground"
                  aria-label="Close Cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                    <p className="text-sm text-muted-foreground font-light">{t.cart_empty}</p>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-xs tracking-widest font-semibold transition-all"
                    >
                      {t.continue_shopping}
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`} className="flex gap-4 border-b border-border/40 pb-4">
                      {/* Product Mini Visual */}
                      <div className="h-20 w-16 bg-muted border border-border flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : (item.product.photoUrl || "https://placehold.co/400x500/1a1a1a/cccccc?text=No+Image")}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-montserrat font-bold text-xs sm:text-sm tracking-wider uppercase text-foreground light-mode:text-foreground truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {t.size}: {item.selectedSize} | {t.color}: {item.selectedColor.name}
                        </p>
                        
                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity - 1)}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity + 1)}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <span className="text-xs font-semibold text-primary">
                            ৳{(item.product.price * item.quantity).toLocaleString()} BDT
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor.hex)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        aria-label="Delete item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs tracking-wider text-muted-foreground">{t.subtotal}:</span>
                    <span className="text-lg font-bold text-primary">
                      ৳{getCartTotal().toLocaleString()} BDT
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-light mb-4">
                    {t.shipping_calc}
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push("/checkout");
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 text-xs font-heading tracking-widest font-bold transition-colors shadow-lg"
                  >
                    {t.secure_checkout}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sliding Search Dropdown */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-background/50 backdrop-blur-xs z-40 cursor-pointer"
            />
            {/* Dropdown panel */}
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed top-0 left-0 w-full bg-card border-b border-border shadow-2xl z-50 pt-20 pb-12"
            >
              <div className="max-w-4xl mx-auto px-6">
                {/* Search Row */}
                <div className="flex items-center gap-4 border-b border-border pb-4 mb-8">
                  <Search className="h-6 w-6 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t.search_placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-grow bg-transparent text-lg font-light tracking-wide focus:outline-none uppercase text-foreground placeholder-muted-foreground"
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 text-2xl font-light hover:text-primary transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Close Search"
                  >
                    ×
                  </button>
                </div>

                {/* Search Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Suggestions Column (Left) */}
                  <div className="md:col-span-4 space-y-4">
                    <h4 className="text-[10px] tracking-widest text-muted-foreground font-bold uppercase">{t.suggestions}</h4>
                    <div className="flex flex-col gap-2.5 text-xs text-left items-start">
                      {["Oversized", "Hoodie", "Jersey", "Cargo", "Signature"].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="text-left font-light hover:text-primary transition-colors uppercase text-muted-foreground hover:text-foreground"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Matching Products Column (Right) */}
                  <div className="md:col-span-8 space-y-4">
                    <h4 className="text-[10px] tracking-widest text-muted-foreground font-bold uppercase">{t.products}</h4>
                    {searchQuery.trim() === "" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PRODUCTS.slice(0, 2).map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              setIsSearchOpen(false);
                              router.push(`/shop/${product.id}`);
                            }}
                            className="flex gap-3 p-2 border border-border/60 hover:border-primary/50 bg-muted cursor-pointer group transition-all"
                          >
                              <img src={product.images && product.images.length > 0 ? product.images[0] : (product.photoUrl || "https://placehold.co/400x500/1a1a1a/cccccc?text=No+Image")} alt={product.name} className="h-14 w-11 object-cover border border-border/40" />
                            <div className="min-w-0 flex flex-col justify-center">
                              <h5 className="font-heading text-xs tracking-wide group-hover:text-primary transition-colors truncate text-foreground">{product.name}</h5>
                              <p className="text-[10px] text-primary mt-1">৳{product.price.toLocaleString()} BDT</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {searchResults.length === 0 ? (
                          <p className="text-xs text-muted-foreground font-light py-2">No matching products found.</p>
                        ) : (
                          searchResults.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => {
                                setIsSearchOpen(false);
                                router.push(`/shop/${product.id}`);
                              }}
                              className="flex gap-3 p-2 border border-border/60 hover:border-primary/50 bg-muted cursor-pointer group transition-all"
                            >
                                <img src={product.images && product.images.length > 0 ? product.images[0] : (product.photoUrl || "https://placehold.co/400x500/1a1a1a/cccccc?text=No+Image")} alt={product.name} className="h-14 w-11 object-cover border border-border/40" />
                              <div className="min-w-0 flex flex-col justify-center">
                                <h5 className="font-heading text-xs tracking-wide group-hover:text-primary transition-colors truncate text-foreground">{product.name}</h5>
                                <p className="text-[10px] text-primary mt-1">৳{product.price.toLocaleString()} BDT</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
