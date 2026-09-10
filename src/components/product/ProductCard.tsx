"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useCartStore, useWishlistStore, useLanguageStore } from "@/store";
import { translations } from "@/data/translations";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first size and first color for quick-add
    if (product.inStock) {
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Default";
      const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : { name: "Default", hex: "#000000" };
      addItem(product, defaultSize, defaultColor, 1);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges Container */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-background text-foreground text-[9px] font-heading font-bold tracking-widest px-2.5 py-1 uppercase">
              {t.new}
            </span>
          )}
          {product.isSale && (
            <span className="bg-primary text-primary-foreground text-[9px] font-heading font-bold tracking-widest px-2.5 py-1 uppercase">
              {t.sale}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-red-600 text-foreground text-[9px] font-heading font-bold tracking-widest px-2.5 py-1 uppercase">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 p-2 glass rounded-full hover:text-primary transition-all duration-300"
          aria-label="Add to Wishlist"
        >
          <Heart className={`h-4.5 w-4.5 transition-colors ${isInWishlist ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>

        {/* Product Visual Frame */}
        <Link href={`/shop/${product.id}`} className="block relative aspect-[4/5] bg-muted overflow-hidden flex items-center justify-center">
          {(() => {
            const src = isHovered && product.images && product.images.length > 1 ? product.images[1] : (product.images?.[0] || product.photoUrl || "https://placehold.co/400x500/1a1a1a/cccccc?text=No+Image");
            if (src.toLowerCase().endsWith('.mp4')) {
              return (
                <video
                  src={src}
                  autoPlay loop muted playsInline
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              );
            }
            return (
              <Image
                src={src}
                alt={product.name || "Product"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            );
          })()}

          {/* Interactive Actions Overlay */}
          <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            {product.inStock && (
              <button
                onClick={handleQuickAdd}
                className="p-3 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded-full shadow-lg transition-transform duration-300 translate-y-4 group-hover:translate-y-0"
                title="Quick Add To Cart"
              >
                <ShoppingBag className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsQuickViewOpen(true);
              }}
              className="p-3 bg-background text-foreground hover:bg-primary hover:text-primary-foreground rounded-full shadow-lg transition-transform duration-300 translate-y-4 group-hover:translate-y-0 delay-75"
              title="Quick View"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </Link>

        {/* Product Information */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Tagline / Category */}
          <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-[0.2em] mb-1.5 block font-bold">
            {product.category?.replace("-", " ") || "Uncategorized"}
          </span>

          {/* Title - Rich Luxury Streetwear Typography */}
          <Link href={`/shop/${product.id}`} className="font-montserrat font-bold text-sm tracking-wider uppercase text-white group-hover:text-neutral-300 transition-colors line-clamp-1">
            {product.name}
          </Link>

          {/* Prices */}
          <div className="flex items-center gap-3 mt-2 font-mono">
            <span className="text-sm font-bold text-white tracking-tight">
              ৳{product.price.toLocaleString()} {t.bdt}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-500 line-through">
                ৳{product.originalPrice.toLocaleString()} {t.bdt}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal container */}
      {isQuickViewOpen && (
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </>
  );
}
