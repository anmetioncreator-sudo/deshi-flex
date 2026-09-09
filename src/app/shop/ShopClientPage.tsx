"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useWishlistStore, useProductStore, useCategoryStore } from "@/store";
import { Filter, X, Grid, SlidersHorizontal, Search, ArrowLeft } from "lucide-react";
import { Product } from "@/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const PRODUCTS = useProductStore((state) => state.products);
  const categories = useCategoryStore((state) => state.categories);
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialWishlistOnly = searchParams.get("wishlist") === "true";

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [wishlistOnly, setWishlistOnly] = useState(initialWishlistOnly);
  const [sortBy, setSortBy] = useState("featured");
  
  // Mobile filter sidebar toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const wishlist = useWishlistStore((state) => state.items);

  // Sync state if search params change
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSearchQuery(searchParams.get("search") || "");
    setWishlistOnly(searchParams.get("wishlist") === "true");
  }, [searchParams]);

  // Extract all unique colors and sizes for dynamic filter listings
  const allSizes = Array.from(new Set(PRODUCTS.flatMap((p) => p.sizes || [])));
  const allColors = Array.from(
    new Map(PRODUCTS.flatMap((p) => p.colors || []).filter(c => c && c.name && c.hex).map((c) => [c.hex, c])).values()
  );

  // Apply filters
  let filteredProducts = PRODUCTS.filter((product) => {
    // 1. Category Filter
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }
    
    // 2. Size Filter
    if (selectedSize !== "all" && !(product.sizes || []).includes(selectedSize)) {
      return false;
    }

    // 3. Color Filter
    if (selectedColor !== "all" && !(product.colors || []).some((c) => c?.name === selectedColor)) {
      return false;
    }

    // 4. Search Filter
    if (
      searchQuery.trim() !== "" &&
      !(product.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) &&
      !(product.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 5. Wishlist Filter
    if (wishlistOnly && !wishlist.some((w) => w.id === product.id)) {
      return false;
    }

    return true;
  });

  // Apply Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    }
    if (sortBy === "price-high") {
      return b.price - a.price;
    }
    if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    // Default Featured: sort new items first, then sale, then by stock count
    const scoreA = (a.isNew ? 3 : 0) + (a.isSale ? 2 : 0) + (a.inStock ? 1 : 0);
    const scoreB = (b.isNew ? 3 : 0) + (b.isSale ? 2 : 0) + (b.inStock ? 1 : 0);
    return scoreB - scoreA;
  });

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("all");
    setSelectedColor("all");
    setSearchQuery("");
    setWishlistOnly(false);
    setSortBy("featured");
  };

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSize !== "all" ? 1 : 0) +
    (selectedColor !== "all" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0) +
    (wishlistOnly ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-32">
      {/* Page Title & Back Button */}
      <div className="border-b border-border pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-widest font-light mb-4 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> BACK
          </button>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wider uppercase">
            {wishlistOnly ? "MY WISHLIST" : selectedCategory !== "all" ? selectedCategory.replace("-", " ") : "SHOP ALL"}
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-1.5 uppercase tracking-widest">
            {wishlistOnly ? `${filteredProducts.length} items saved` : `${filteredProducts.length} premium apparel drops`}
          </p>
        </div>

        {/* Search bar within catalog */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border focus:border-primary text-xs px-4 py-3 pr-10 focus:outline-none transition-colors uppercase tracking-wider font-light"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Grid structure */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
            
            {/* Header filters details */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-heading text-lg tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-primary" /> FILTERS
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] text-primary hover:text-foreground transition-colors underline font-light"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-[10px] tracking-widest text-muted-foreground font-bold mb-3 uppercase">CATEGORIES</h4>
              <div className="flex flex-col gap-2">
                {[{slug: "all", name: "All"}, ...categories].map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-left text-sm py-1.5 font-sans capitalize hover:text-primary transition-colors focus:outline-none ${
                      selectedCategory === cat.slug ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h4 className="text-[10px] tracking-widest text-muted-foreground font-bold mb-3 uppercase">SIZES</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSize("all")}
                  className={`h-8 px-3 border text-[10px] tracking-wider transition-all rounded-none uppercase focus:outline-none ${
                    selectedSize === "all"
                      ? "border-primary text-primary bg-primary/5 font-semibold"
                      : "border-border text-foreground hover:border-muted-foreground font-light"
                  }`}
                >
                  ALL
                </button>
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-8 px-3 border text-[10px] tracking-wider transition-all rounded-none uppercase focus:outline-none ${
                      selectedSize === size
                        ? "border-primary text-primary bg-primary/5 font-semibold"
                        : "border-border text-foreground hover:border-muted-foreground font-light"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h4 className="text-[10px] tracking-widest text-muted-foreground font-bold mb-3 uppercase">COLORS</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedColor("all")}
                  className={`text-left text-sm py-1.5 font-sans capitalize hover:text-primary transition-colors focus:outline-none ${
                    selectedColor === "all" ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  All Colors
                </button>
                {allColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.name)}
                    className={`text-left text-sm py-1.5 font-sans capitalize hover:text-primary transition-colors flex items-center gap-3 focus:outline-none ${
                      selectedColor === color.name ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    <span className="h-4 w-4 rounded-full border border-border flex-shrink-0" style={{ backgroundColor: color.hex }} />
                    {color.name.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Wishlist only filter (for desktop) */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={wishlistOnly}
                  onChange={(e) => setWishlistOnly(e.target.checked)}
                  className="rounded-none border-border bg-background text-primary focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-primary"
                />
                <span className="text-xs text-muted-foreground font-light uppercase tracking-wider">SHOW WISHLIST ONLY</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            
            {/* Filter Toggle Mobile */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 text-xs tracking-wider border border-border px-4 py-2 hover:border-primary hover:text-primary transition-colors"
            >
              <Filter className="h-4 w-4" /> FILTERS {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            <div className="hidden lg:block text-xs text-muted-foreground font-light uppercase tracking-wider">
              SHOWING {filteredProducts.length} PRODUCTS
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-light uppercase tracking-wider hidden sm:inline">SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border border-border text-xs px-3 py-2 focus:outline-none focus:border-primary uppercase tracking-wider font-light"
              >
                <option value="featured">Featured Drop</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border flex flex-col items-center justify-center">
              <SlidersHorizontal className="h-10 w-10 text-muted-foreground mb-4 opacity-40" />
              <h3 className="font-heading text-lg tracking-wider mb-2">NO PRODUCTS FOUND</h3>
              <p className="text-xs text-muted-foreground font-light max-w-xs leading-relaxed">
                We couldn't find any products matching your active filters. Try resetting search queries or changing options.
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-6 bg-primary text-primary-foreground hover:bg-accent px-6 py-2.5 text-xs font-heading tracking-widest font-bold transition-all"
                >
                  RESET ALL FILTERS
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Sidebar Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setShowMobileFilters(false)}
            className="absolute inset-0 bg-background/60"
          />
          
          {/* Drawer container */}
          <div className="relative w-full max-w-xs bg-card h-full p-6 flex flex-col justify-between overflow-y-auto border-l border-border shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <span className="font-heading text-xl tracking-wider">FILTER BY</span>
                <button onClick={() => setShowMobileFilters(false)} className="p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Categories mobile */}
              <div className="mb-6">
                <h4 className="text-[10px] tracking-widest text-muted-foreground font-bold mb-3 uppercase">CATEGORIES</h4>
                <div className="flex flex-col gap-2">
                  {[{slug: "all", name: "All"}, ...categories].map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setShowMobileFilters(false);
                      }}
                      className={`text-left text-sm py-1.5 font-sans capitalize hover:text-primary transition-colors focus:outline-none ${
                        selectedCategory === cat.slug ? "text-primary font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes mobile */}
              <div className="mb-6">
                <h4 className="text-[10px] tracking-widest text-muted-foreground font-bold mb-3 uppercase">SIZES</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSize("all")}
                    className={`h-8 px-3 border text-[10px] tracking-wider transition-all rounded-none uppercase focus:outline-none ${
                      selectedSize === "all"
                        ? "border-primary text-primary bg-primary/5 font-semibold"
                        : "border-border text-foreground"
                    }`}
                  >
                    ALL
                  </button>
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-8 px-3 border text-[10px] tracking-wider transition-all rounded-none uppercase focus:outline-none ${
                        selectedSize === size
                          ? "border-primary text-primary bg-primary/5 font-semibold"
                          : "border-border text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors mobile */}
              <div className="mb-6">
                <h4 className="text-[10px] tracking-widest text-muted-foreground font-bold mb-3 uppercase">COLORS</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedColor("all")}
                    className={`text-left text-sm py-1.5 font-sans capitalize focus:outline-none ${
                      selectedColor === "all" ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    All Colors
                  </button>
                  {allColors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color.name)}
                      className={`text-left text-sm py-1.5 font-sans capitalize flex items-center gap-3 focus:outline-none ${
                        selectedColor === color.name ? "text-primary font-medium" : "text-muted-foreground"
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full border border-border flex-shrink-0" style={{ backgroundColor: color.hex }} />
                      {color.name.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wishlist only mobile */}
              <div className="mb-6">
                <label className="flex items-center gap-2.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={wishlistOnly}
                    onChange={(e) => setWishlistOnly(e.target.checked)}
                    className="rounded-none border-border bg-background text-primary focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-primary"
                  />
                  <span className="text-xs text-muted-foreground font-light uppercase tracking-wider">SHOW WISHLIST ONLY</span>
                </label>
              </div>

            </div>

            {/* Clear filters mobile */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  clearAllFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full bg-primary text-primary-foreground py-3 text-xs font-heading tracking-widest font-bold transition-all text-center"
              >
                RESET ALL FILTERS
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopClientPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-background text-primary font-heading text-xl tracking-widest">
            LOADING SHOP...
          </div>
        }>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
