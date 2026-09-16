"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useCartStore, useWishlistStore, useLanguageStore } from "@/store";
import { translations } from "@/data/translations";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  // Compute discount percentage if original price is given
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.isSale ? 20 : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "L";
      const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : { name: "Black", hex: "#000000" };
      addItem(product, defaultSize, defaultColor, 1);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1500);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const frontImg = product.images?.[0] || product.photoUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800";
  const backImg = product.images && product.images.length > 1 ? product.images[1] : frontImg;

  return (
    <>
      <div className="group relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-300">
        
        {/* TOP-LEFT RECTANGULAR BADGES (Woodmart style) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          {discountPercent && discountPercent > 0 && (
            <span className="bg-[#e53935] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
              Hot
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* TOP-RIGHT ACTION ICONS (Appears smoothly on hover) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="w-8 h-8 rounded-full bg-white text-gray-700 hover:text-red-600 shadow-md border border-gray-100 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            aria-label="Add to Wishlist"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? "fill-red-600 text-red-600" : ""}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="w-8 h-8 rounded-full bg-white text-gray-700 hover:text-black shadow-md border border-gray-100 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            aria-label="Quick View"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Quick Add To Cart Button */}
          {product.inStock && (
            <button
              onClick={handleQuickAdd}
              className="w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800 shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              aria-label="Quick Add to Cart"
              title="Add to Cart"
            >
              {addedAnimation ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* IMAGE FRAME WITH DUAL-IMAGE HOVER (Woodmart Style) */}
        <Link href={`/shop/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
          {/* Front Image */}
          <Image
            src={frontImg}
            alt={product.name || "Product"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          {/* Back Image (Shown on hover) */}
          <Image
            src={backImg}
            alt={`${product.name} back view`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105"
          />
        </Link>

        {/* PRODUCT DETAILS (Below image, Woodmart style) */}
        <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
          <div>
            {/* Title */}
            <h3 className="font-heading font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-black line-clamp-2 leading-snug transition-colors">
              <Link href={`/shop/${product.id}`}>
                {product.name}
              </Link>
            </h3>

            {/* Color Swatch Dots */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                {product.colors.slice(0, 5).map((color, idx) => (
                  <span
                    key={idx}
                    className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-xs inline-block"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 5 && (
                  <span className="text-[10px] text-gray-400 font-mono">+{product.colors.length - 5}</span>
                )}
              </div>
            )}
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mt-2 pt-1">
            {product.originalPrice && product.originalPrice > product.price ? (
              <del className="text-xs text-gray-400 font-mono">
                ৳{product.originalPrice.toLocaleString()}
              </del>
            ) : null}
            <ins className="no-underline text-xs sm:text-sm font-bold text-gray-950 font-mono">
              ৳{product.price.toLocaleString()}
            </ins>
          </div>
        </div>

      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </>
  );
}
