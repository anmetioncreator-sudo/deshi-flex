"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductZoom from "@/components/product/ProductZoom";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore, useWishlistStore, useRecentlyViewedStore, useProductStore } from "@/store";
import { 
  Heart, ShoppingBag, Plus, Minus, Check, Star, Truck, RefreshCw, ShieldCheck, ChevronRight 
} from "lucide-react";
import { PRODUCTS } from "@/data/products";

interface PageProps {
  id: string;
}

export default function ProductPageClient({ id }: PageProps) {
  const router = useRouter();
  const allProducts = useProductStore((state) => state.products);

  // Find product
  const product = allProducts.find((p) => p.id === id);

  // Find sibling products (same category = color variants of the same product family)
  const siblingProducts = allProducts.filter(p => p.category === product?.category);

  if (!product) {
    notFound();
  }

  // State
  const [activeImage, setActiveImage] = useState(product.images && product.images.length > 0 ? product.images?.[0] : (product.photoUrl || "https://placehold.co/400x500/1a1a1a/cccccc?text=No+Image"));
  const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes.length > 0 ? product.sizes?.[0] : "Default");
  const [selectedColor, setSelectedColor] = useState<any>(product.colors && product.colors.length > 0 ? product.colors?.[0] : { name: "Default", hex: "#000000" });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "reviews" | "size & support">("details");
  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (dir: number) => {
    if (galleryRef.current) {
      const { scrollLeft, clientWidth } = galleryRef.current;
      galleryRef.current.scrollTo({ left: scrollLeft + dir * (clientWidth * 0.85), behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (galleryRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          galleryRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          galleryRef.current.scrollTo({ left: scrollLeft + (clientWidth * 0.85), behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Local Review Form States
  const [reviewsList, setReviewsList] = useState<any[]>(product.reviews || []);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerComment, setReviewerComment] = useState("");
  const [reviewerRating, setReviewerRating] = useState(5);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  
  const recentlyViewed = useRecentlyViewedStore((state) => state.items);
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct);

  // Sync active image if route changes
  useEffect(() => {
    setActiveImage(product.images && product.images.length > 0 ? product.images?.[0] : (product.photoUrl || "https://placehold.co/400x500/1a1a1a/cccccc?text=No+Image"));
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes?.[0] : "Default");
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors?.[0] : { name: "Default", hex: "#000000" });
    setQuantity(1);
    setReviewsList(product.reviews || []);

    // Save to recently viewed list
    addRecentlyViewed(product);
  }, [id]);

  const handleAddToCart = () => {
    if (product.inStock) {
      addItem(product, selectedSize, selectedColor, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product.inStock) {
      addItem(product, selectedSize, selectedColor, quantity);
      router.push("/checkout");
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewerName.trim() && reviewerComment.trim()) {
      const newReview: any = {
        id: `r-local-${Date.now()}`,
        name: reviewerName,
        rating: reviewerRating,
        comment: reviewerComment,
        date: new Date().toISOString().split("T")[0],
      };
      setReviewsList([newReview, ...reviewsList]);
      setReviewerName("");
      setReviewerComment("");
      setReviewerRating(5);
    }
  };

  // Recommendations: products in same category (excl current) or adjacent ones
  const recommendations = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // If no same-category products exist, show first 4 items
  const finalRecommendations = recommendations.length > 0 
    ? recommendations 
    : allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  // Filter recently viewed (exclude current product)
  const filteredRecentlyViewed = recentlyViewed.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.description,
            "sku": product.id,
            "mpn": product.id,
            "brand": {
              "@type": "Brand",
              "name": "Deshi Flex"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://deshiflex.vercel.app/shop/${product.id}`,
              "priceCurrency": "BDT",
              "price": product.price,
              "priceValidUntil": "2027-12-31",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": product.inStock 
                ? "https://schema.org/InStock" 
                : "https://schema.org/OutOfStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": product.reviewsCount
            }
          })
        }}
      />
      <Navbar />

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center flex-nowrap overflow-x-auto scrollbar-none gap-1.5 text-[10px] tracking-widest text-muted-foreground uppercase mb-10 whitespace-nowrap">
            <Link href="/" className="hover:text-primary transition-colors shrink-0">HOME</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/shop" className="hover:text-primary transition-colors shrink-0">SHOP</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors shrink-0">
              {product.category.replace("-", " ")}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-foreground shrink-0">{product.name}</span>
          </nav>

          {/* Core Product Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-border pb-16">
            
            {/* Left Column: Visual Gallery */}
            <div className="lg:col-span-7 relative group">
              {/* Visual badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
                {product.isNew && (
                  <span className="bg-background text-foreground text-[9px] font-heading font-bold tracking-widest px-3 py-1.5 uppercase shadow-xl">
                    NEW DROP
                  </span>
                )}
                {product.isSale && (
                  <span className="bg-primary text-primary-foreground text-[9px] font-heading font-bold tracking-widest px-3 py-1.5 uppercase shadow-xl">
                    SALE RATE
                  </span>
                )}
              </div>

              {/* Scrollable Gallery */}
              <div 
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-2 pb-4 h-[60vh] lg:h-[800px] cursor-grab active:cursor-grabbing"
                ref={galleryRef}
              >
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, index) => (
                    <div 
                      key={index} 
                      className="min-w-full lg:min-w-[85%] snap-center h-full bg-white relative border border-border shrink-0"
                    >
                      <ProductZoom src={img} alt={`${product.name} - view ${index + 1}`} />
                      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur text-foreground text-[9px] tracking-widest px-2 py-1 uppercase font-bold pointer-events-none">
                        {index + 1} / {product.images?.length || 0}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="min-w-full lg:min-w-[85%] snap-center h-full bg-white relative border border-border shrink-0">
                    <ProductZoom src={product.photoUrl || "https://placehold.co/400x500/1a1a1a/cccccc?text=No+Image"} alt={product.name} />
                  </div>
                )}
              </div>
              
              {/* Left/Right controls (desktop) */}
              <button 
                onClick={() => scrollGallery(-1)} 
                className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 bg-background/80 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10 border border-border hidden lg:flex"
              >
                ←
              </button>
              <button 
                onClick={() => scrollGallery(1)} 
                className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 bg-background/80 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10 border border-border hidden lg:flex"
              >
                →
              </button>
            </div>

            {/* Right Column: E-commerce Details */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Brand Tagline or Category */}
                <span className="text-[10px] text-primary font-bold tracking-widest uppercase mb-2 block">
                  {product.category.replace("-", " ")}
                </span>
                
                {/* Product Name */}
                <h1 className="font-montserrat font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase leading-tight text-foreground light-mode:text-foreground">
                  {product.name}
                </h1>

                {/* Star rating summary */}
                <div className="flex items-center gap-1.5 mt-4">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4.5 w-4.5 ${
                          i < Math.floor(product.rating || 0)
                            ? "fill-primary"
                            : "opacity-40"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-light">
                    {product.rating} ({reviewsList.length} reviews)
                  </span>
                </div>

                {/* Price tag */}
                <div className="flex items-center gap-4 mt-6 mb-8">
                  <span className="text-2xl font-bold text-primary">
                    ৳{product.price.toLocaleString()} BDT
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-muted-foreground/50 line-through">
                      ৳{product.originalPrice.toLocaleString()} BDT
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Sizing selection */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] tracking-widest text-muted-foreground font-semibold">SELECT SIZE</span>
                    <span className="text-[10px] underline cursor-pointer text-primary hover:text-foreground font-light">SIZE CHART</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-10 px-5 border text-xs tracking-wider transition-all rounded-none ${
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

                {/* Color swatches - show all color variants */}
                <div className="mb-8">
                  <span className="text-[10px] tracking-widest text-muted-foreground font-semibold mb-3 block">
                    COLOR: {selectedColor.name}
                  </span>
                  <div className="flex items-center gap-3 flex-wrap">
                    {siblingProducts.map((sibling) => {
                      const color = sibling.colors?.[0];
                      if (!color) return null;
                      const isActive = sibling.id === product.id;
                      return (
                        <button
                          key={sibling.id}
                          onClick={() => {
                            if (!isActive) router.push(`/shop/${sibling.id}`);
                          }}
                          className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${
                            isActive
                              ? "border-primary scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background"
                              : "border-border hover:scale-105 hover:border-muted-foreground"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isActive && (
                            <Check className={`h-3.5 w-3.5 ${color.hex === "#f5f5f7" || color.hex === "#fffdd0" || color.hex === "#f8f4e6" || color.hex === "#e6e6fa" || color.hex === "#d6b5b5" || color.hex === "#9dc183" ? "text-black" : "text-white"}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity & Stock Details */}
                <div className="mb-8 flex items-center gap-8">
                  <div>
                    <span className="text-[10px] tracking-widest text-muted-foreground font-semibold mb-3 block">QUANTITY</span>
                    <div className="flex items-center border border-border h-11 bg-background">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3.5 h-full text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3.5 h-full text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] tracking-widest text-muted-foreground font-semibold mb-3 block">AVAILABILITY</span>
                    <div className="flex items-center gap-2 h-11">
                      <span className={`h-2.5 w-2.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-600"}`} />
                      <span className="text-xs font-light">
                        {product.inStock ? `In Stock (${product.stockCount} items left)` : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Buying Triggers */}
              <div className="flex gap-2 sm:gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || added}
                  className={`flex-1 py-4 text-[10px] sm:text-xs font-heading tracking-widest font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 rounded-none whitespace-nowrap ${
                    added
                      ? "bg-green-600 text-foreground"
                      : product.inStock
                      ? "bg-primary text-primary-foreground hover:bg-accent shadow-lg"
                      : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" /> ADDED TO BAG
                    </>
                  ) : product.inStock ? (
                    <>
                      <ShoppingBag className="h-4 w-4" /> ADD TO BAG
                    </>
                  ) : (
                    "SOLD OUT"
                  )}
                </button>

                {product.inStock && (
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-4 text-[10px] sm:text-xs font-heading tracking-widest font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 rounded-none bg-background text-foreground hover:bg-neutral-200 border border-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)] whitespace-nowrap"
                  >
                    BUY NOW
                  </button>
                )}

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`px-3 sm:px-4 py-4 border transition-all rounded-none shrink-0 ${
                    isInWishlist
                      ? "border-primary text-primary bg-primary/5"
                      : "border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? "fill-primary" : ""}`} />
                </button>
              </div>

              {/* Details & Info Tabs */}
              <div className="mt-12 border-t border-border pt-6">
                <div className="flex gap-6 border-b border-border/40 pb-3 mb-4">
                  {(["details", "shipping", "reviews", "size & support"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[10px] tracking-widest font-heading font-bold uppercase transition-colors relative ${
                        activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute -bottom-3.5 left-0 right-0 h-[1.5px] bg-primary" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="text-xs text-muted-foreground font-light leading-relaxed">
                  {activeTab === "details" && (
                     <ul className="space-y-2 list-disc list-inside">
                       {product.details?.map((detail, idx) => (
                         <li key={idx}>{detail}</li>
                       ))}
                     </ul>
                  )}

                  {activeTab === "shipping" && (
                    <div className="space-y-4">
                      <p>All Deshi Flex apparel are processed and dispatched from our local fulfillment center in Dhaka.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/40 pt-4">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <span className="font-semibold block text-foreground light-mode:text-foreground">Dhaka</span>
                            24-48 Hours delivery
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <span className="font-semibold block text-foreground light-mode:text-foreground">Returns</span>
                            7-Day easy returns
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <span className="font-semibold block text-foreground light-mode:text-foreground">Secure</span>
                            SSL secure gateway
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "size & support" && (
                    <div className="space-y-4">
                      <p>The size will be rechecked by phone call and message after you place your order.</p>
                      <p>If somehow the size delivered is different from what was confirmed and it is our error, we will replace it completely free of charge.</p>
                      <p>If it is a customer error (e.g., ordered the wrong size), as long as the t-shirt quality is not damaged or used, we can replace it for just the delivery charge (conditions may apply).</p>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      
                      {/* Review submission Form */}
                      <form onSubmit={handleAddReview} className="border border-border p-4 bg-background">
                        <h4 className="font-heading text-sm text-foreground light-mode:text-foreground tracking-wide mb-3">WRITE A REVIEW</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            placeholder="YOUR NAME"
                            required
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="bg-card border border-border focus:border-primary px-3 py-2 text-xs focus:outline-none uppercase font-light"
                          />
                          <select
                            value={reviewerRating}
                            onChange={(e) => setReviewerRating(Number(e.target.value))}
                            className="bg-card border border-border focus:border-primary px-3 py-2 text-xs focus:outline-none uppercase font-light"
                          >
                            <option value="5">5 Stars (Excellent)</option>
                            <option value="4">4 Stars (Good)</option>
                            <option value="3">3 Stars (Average)</option>
                            <option value="2">2 Stars (Poor)</option>
                            <option value="1">1 Star (Terrible)</option>
                          </select>
                        </div>
                        <textarea
                          placeholder="WRITE YOUR FEEDBACK HERE..."
                          required
                          value={reviewerComment}
                          onChange={(e) => setReviewerComment(e.target.value)}
                          rows={3}
                          className="w-full bg-card border border-border focus:border-primary px-3 py-2 text-xs focus:outline-none mb-3 font-light uppercase"
                        />
                        <button
                          type="submit"
                          className="bg-primary text-primary-foreground hover:bg-accent px-6 py-2.5 text-xs font-heading tracking-widest font-bold transition-all"
                        >
                          SUBMIT REVIEW
                        </button>
                      </form>

                      {/* Reviews List */}
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {reviewsList.length === 0 ? (
                          <p className="text-center text-[10px] text-muted-foreground py-4 font-light">No reviews yet. Be the first to review this product!</p>
                        ) : (
                          reviewsList.map((rev) => (
                            <div key={rev.id} className="border-b border-border/40 pb-4">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-heading text-sm text-foreground light-mode:text-foreground uppercase">{rev.name}</span>
                                <span className="text-[9px] text-muted-foreground font-light">{rev.date}</span>
                              </div>
                              <div className="flex text-primary gap-0.5 my-1">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-primary" />
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground font-light mt-1.5">{rev.comment}</p>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* AI Recommended Products Section */}
          <section className="py-20 border-b border-border">
            <h3 className="font-heading text-3xl tracking-wider mb-10">AI RECOMMENDATIONS</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {finalRecommendations.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>

          {/* Recently Viewed Products */}
          {filteredRecentlyViewed.length > 0 && (
            <section className="py-20">
              <h3 className="font-heading text-3xl tracking-wider mb-10">RECENTLY VIEWED</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredRecentlyViewed.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
