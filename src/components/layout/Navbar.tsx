"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  useCartStore, 
  useWishlistStore, 
  useLanguageStore, 
  useProductStore, 
  useUserStore, 
  useAdminStore,
  useCategoryStore
} from "@/store";
import { translations } from "@/data/translations";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Truck, 
  User, 
  ShieldCheck, 
  ChevronDown, 
  Layers,
  Sparkles,
  PhoneCall
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const PRODUCTS = useProductStore((state) => state.products);
  const categories = useCategoryStore((state) => state.categories);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [isSearchCategoryDropdown, setIsSearchCategoryDropdown] = useState(false);
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
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const checkSession = useAdminStore((state) => state.checkSession);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const searchCategoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync admin clearance
  useEffect(() => {
    if (currentUser?.email) {
      checkSession(currentUser.email);
    }
  }, [currentUser?.email, checkSession]);

  const isUserAdmin = mounted && (isAdmin || currentUser?.role === "admin" || currentUser?.role === "owner");

  // Close menus on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsCategoryOpen(false);
  }, [pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (searchCategoryRef.current && !searchCategoryRef.current.contains(event.target as Node)) {
        setIsSearchCategoryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const catQuery = selectedCat !== "all" ? `&category=${selectedCat}` : "";
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}${catQuery}`);
  };

  // Instant live search matches
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter((p) => {
        const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCat === "all" || p.category === selectedCat || p.category.toLowerCase().includes(selectedCat.toLowerCase());
        return matchesQuery && matchesCat;
      }).slice(0, 5)
    : [];

  return (
    <>
      <header className="w-full z-40 bg-white sticky top-0 shadow-sm transition-all">
        {/* WEAR.COM.BD STYLE TOP ANNOUNCEMENT TICKER */}
        <div className="bg-[#111113] text-white py-1.5 px-4 overflow-hidden text-[11px] font-medium tracking-wider select-none border-b border-white/10">
          <div className="animate-marquee-scroll flex items-center whitespace-nowrap gap-12">
            <span className="flex items-center gap-1.5 font-sans">
              <span className="text-amber-400">🔥</span> Enjoy FREE SHIPPING on orders over ৳2000 across Bangladesh!
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <span className="text-emerald-400">⚡</span> 24-48 Hours Express Delivery in Dhaka City
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <span className="text-sky-400">✨</span> 100% Combed Compact Cotton • Heavyweight 180 to 240 GSM
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <span className="text-rose-400">🔄</span> 7-Day Easy Exchange & Return Policy
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <span className="text-amber-400">🔥</span> Enjoy FREE SHIPPING on orders over ৳2000 across Bangladesh!
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <span className="text-emerald-400">⚡</span> 24-48 Hours Express Delivery in Dhaka City
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <span className="text-sky-400">✨</span> 100% Combed Compact Cotton • Heavyweight 180 to 240 GSM
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <span className="text-rose-400">🔄</span> 7-Day Easy Exchange & Return Policy
            </span>
          </div>
        </div>

        {/* MAIN HEADER ROW */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* LEFT: Category Opener & Brand Logo */}
            <div className="flex items-center gap-4 lg:gap-6 shrink-0">
              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Category Dropdown Opener (Woodmart style) */}
              <div className="relative hidden lg:block" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200/80 text-gray-900 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-gray-200 shadow-sm"
                >
                  <Menu className="w-4 h-4" />
                  <span>Category</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Category Dropdown Menu */}
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 divide-y divide-gray-100"
                    >
                      <div className="py-1">
                        <Link
                          href="/shop?category=hoodie"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                        >
                          <span>Hoodie</span>
                          <span className="text-[10px] text-gray-400 font-mono">Premium</span>
                        </Link>
                        <Link
                          href="/shop?category=drop-shoulder"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                        >
                          <span>Oversized T-Shirts</span>
                          <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-bold">HOT</span>
                        </Link>
                        <Link
                          href="/shop?category=acid-wash-drop-shoulder"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                        >
                          <span>Washed Oversized T-Shirts</span>
                        </Link>
                        <Link
                          href="/shop?category=over-size-drop-shoulder"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                        >
                          <span>Streetwear Essentials</span>
                        </Link>
                        <Link
                          href="/shop?search=anime"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                        >
                          <span>WEAR Anime Series</span>
                          <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">POPULAR</span>
                        </Link>
                        <Link
                          href="/shop?search=racing"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                        >
                          <span>Racing Series</span>
                        </Link>
                        <Link
                          href="/custom-order"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                        >
                          <span>Bespoke Custom Apparel</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold">STUDIO</span>
                        </Link>
                      </div>
                      <div className="py-1 bg-gray-50">
                        <Link
                          href="/shop"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-900 font-bold hover:bg-gray-100 transition-colors uppercase tracking-wider"
                        >
                          <span>All Products</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/track-order"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:text-black font-medium transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Your Order</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-3 select-none group">
                <div className="relative h-10 w-12 sm:h-11 sm:w-14 shrink-0 transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src="/df-logo.png"
                    alt="DESHI FLEX Official Logo"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-black text-xl sm:text-2xl tracking-wider text-gray-950 uppercase leading-none">
                    DESHI FLEX
                  </span>
                  <span className="text-[9px] tracking-[0.25em] text-gray-500 uppercase font-semibold font-mono mt-0.5">
                    STREETWEAR BD
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: Woodmart Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <form onSubmit={handleSearchSubmit} className="w-full flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden focus-within:border-black focus-within:bg-white transition-all shadow-inner">
                {/* Category Dropdown Picker inside search */}
                <div className="relative shrink-0" ref={searchCategoryRef}>
                  <button
                    type="button"
                    onClick={() => setIsSearchCategoryDropdown(!isSearchCategoryDropdown)}
                    className="flex items-center gap-1 px-3.5 py-2.5 text-[11px] font-semibold text-gray-700 hover:text-black border-r border-gray-200 bg-gray-100/60 select-none cursor-pointer"
                  >
                    <span className="max-w-[110px] truncate uppercase">
                      {selectedCat === "all" ? "Categories" : selectedCat}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  <AnimatePresence>
                    {isSearchCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-xs text-gray-700"
                      >
                        <button
                          type="button"
                          onClick={() => { setSelectedCat("all"); setIsSearchCategoryDropdown(false); }}
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-100 font-medium"
                        >
                          All Categories
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedCat("drop-shoulder"); setIsSearchCategoryDropdown(false); }}
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-100"
                        >
                          Drop Shoulder
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedCat("over-size-drop-shoulder"); setIsSearchCategoryDropdown(false); }}
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-100"
                        >
                          Oversize Streetwear
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedCat("acid-wash-drop-shoulder"); setIsSearchCategoryDropdown(false); }}
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-100"
                        >
                          Acid Wash
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input Text */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, drop shoulders, anime..."
                  className="w-full px-4 py-2.5 text-xs text-gray-900 bg-transparent outline-none placeholder:text-gray-400 font-sans"
                />

                {/* Search Action Button */}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gray-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </form>

              {/* Instant Search Suggestions Results */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 divide-y divide-gray-100"
                  >
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Matching Products ({searchResults.length})
                    </div>
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/shop/${item.id}`}
                        onClick={() => setSearchQuery("")}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img
                            src={item.images?.[0] || item.photoUrl || ""}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-500 font-mono">৳{item.price} {item.originalPrice ? <span className="line-through text-gray-400">৳{item.originalPrice}</span> : null}</p>
                        </div>
                      </Link>
                    ))}
                    <div className="px-4 py-2 bg-gray-50 text-right">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-black hover:underline uppercase tracking-wider"
                      >
                        View all results &rarr;
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT: Actions (Login, Wishlist, Cart) */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* ADMIN VAULT ENTRY BUTTON (if admin/owner) */}
              {isUserAdmin && (
                <Link
                  href="/df-control-vault"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-[11px] font-bold tracking-wider transition-all shadow-sm"
                  title="Admin ERP Vault"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline uppercase">Vault</span>
                </Link>
              )}

              {/* Login / Register Account */}
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 text-gray-700 hover:text-black text-xs font-semibold tracking-wider transition-colors"
              >
                <User className="h-5 w-5 text-gray-700" />
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] text-gray-400 font-normal uppercase">Account</span>
                  <span className="truncate max-w-[80px]">
                    {mounted && isCustomerLoggedIn && currentUser ? currentUser.name.split(" ")[0] : "Sign In"}
                  </span>
                </div>
              </Link>

              {/* Wishlist Button */}
              <Link
                href="/shop?wishlist=true"
                className="p-2 text-gray-700 hover:text-black relative transition-colors"
                title="My Wishlist"
              >
                <Heart className="h-5 w-5" />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute 0 top-0.5 right-0.5 bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Button with Count & Subtotal */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 bg-gray-100 hover:bg-gray-200/80 rounded-lg text-gray-900 border border-gray-200 transition-colors cursor-pointer"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5 text-gray-900" />
                  {mounted && getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">My Cart</span>
                  <span className="text-xs font-bold text-gray-950 font-mono mt-0.5">
                    ৳{mounted ? getCartTotal().toLocaleString() : 0}
                  </span>
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* SECONDARY CATEGORY NAVIGATION ROW (Woodmart / Wear.com.bd Style) */}
        <div className="hidden lg:block border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 h-11">
              <div className="flex items-center gap-7">
                <Link href="/shop?category=hoodie" className="hover:text-black transition-colors">
                  Hoodie
                </Link>
                <Link href="/shop?category=drop-shoulder" className="hover:text-black transition-colors">
                  Oversized T-Shirts
                </Link>
                <Link href="/shop?category=acid-wash-drop-shoulder" className="hover:text-black transition-colors">
                  Washed Oversized
                </Link>
                <Link href="/shop?search=anime" className="hover:text-black transition-colors flex items-center gap-1">
                  <span>Anime Series</span>
                  <span className="text-[8px] bg-black text-white px-1 py-0.2 rounded font-mono">NEW</span>
                </Link>
                <Link href="/shop?search=racing" className="hover:text-black transition-colors">
                  Racing Series
                </Link>
                <Link href="/shop?category=over-size-drop-shoulder" className="hover:text-black transition-colors">
                  Streetwear Essentials
                </Link>
                <Link href="/custom-order" className="hover:text-black transition-colors text-emerald-600">
                  Custom Apparel Studio
                </Link>
                <Link href="/shop" className="hover:text-black transition-colors text-black font-extrabold">
                  All Products
                </Link>
              </div>

              <div className="flex items-center gap-5 text-gray-500">
                <Link href="/track-order" className="hover:text-black transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gray-700" />
                  <span>Track Your Order</span>
                </Link>
                <a href="tel:+8801710793841" className="hover:text-black transition-colors flex items-center gap-1 text-[11px] font-mono">
                  <PhoneCall className="w-3 h-3" />
                  <span>01710793841</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl flex flex-col justify-between"
            >
              <div className="overflow-y-auto">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Image src="/df-logo.png" alt="Logo" width={32} height={32} />
                    <span className="font-heading font-black text-lg text-gray-900">DESHI FLEX</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="p-4 border-b border-gray-100">
                  <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search streetwear..."
                      className="w-full px-3 py-2 text-xs bg-transparent outline-none"
                    />
                    <button type="submit" className="p-2 bg-black text-white">
                      <Search className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Mobile Navigation Links */}
                <div className="p-4 space-y-1 text-xs font-bold uppercase tracking-wider text-gray-800 divide-y divide-gray-100">
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 text-black font-black">
                    All Products
                  </Link>
                  <Link href="/shop?category=drop-shoulder" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5">
                    Oversized T-Shirts
                  </Link>
                  <Link href="/shop?category=acid-wash-drop-shoulder" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5">
                    Washed Oversized
                  </Link>
                  <Link href="/shop?search=anime" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 text-amber-700">
                    WEAR Anime Series
                  </Link>
                  <Link href="/shop?search=racing" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5">
                    Racing Series
                  </Link>
                  <Link href="/shop?category=hoodie" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5">
                    Hoodies & Sweatshirts
                  </Link>
                  <Link href="/custom-order" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 text-emerald-600">
                    Custom Apparel Studio
                  </Link>
                  <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-2.5 text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Track Your Order</span>
                  </Link>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 text-gray-500">
                    About Brand
                  </Link>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 text-gray-500">
                    Contact & Concierge
                  </Link>
                </div>
              </div>

              {/* Bottom login CTA */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{isCustomerLoggedIn && currentUser ? currentUser.name : "Sign In / Register"}</span>
                </Link>
                <div className="text-[11px] text-center text-gray-500 font-mono">
                  Official Concierge: 01710793841
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SHOPPING CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 z-50 flex flex-col justify-between shadow-2xl"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="font-heading text-lg font-bold tracking-wider flex items-center gap-2 text-gray-900 uppercase">
                  <span>Shopping Cart</span>
                  <span className="text-xs font-mono font-normal text-gray-500">({getCartCount()})</span>
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-200 transition-colors"
                  aria-label="Close Cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-700 mb-1">Your cart is currently empty</p>
                    <p className="text-xs text-gray-400 mb-6">Discover the newest oversized drops and anime tees.</p>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`} className="flex gap-3.5 border-b border-gray-100 pb-4">
                      {/* Image */}
                      <div className="h-20 w-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                        <img
                          src={item.product.images?.[0] || item.product.photoUrl || ""}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Size: <span className="font-semibold text-gray-700">{item.selectedSize}</span> | Color: <span className="font-semibold text-gray-700">{item.selectedColor.name}</span>
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          {/* Qty Adjuster */}
                          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity - 1)}
                              className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold font-mono text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity + 1)}
                              className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price & Delete */}
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-xs text-gray-950">
                              ৳{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                            <button
                              onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor.hex)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-sm text-gray-950">
                      ৳{getCartTotal().toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Shipping & taxes calculated at checkout. Free shipping on orders over ৳2000.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="py-3 px-4 bg-black hover:bg-gray-900 text-white text-center text-xs font-bold tracking-wider uppercase rounded-lg shadow transition-all hover:scale-[1.01]"
                    >
                      Checkout Now
                    </Link>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="py-3 px-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 text-center text-xs font-bold tracking-wider uppercase rounded-lg transition-colors"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
