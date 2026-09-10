"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useCartStore } from "@/store";
import { X, ShoppingBag, Plus, Minus, Check } from "lucide-react";
import { motion } from "framer-motion";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Default");
  const [selectedColor, setSelectedColor] = useState<any>(product.colors && product.colors.length > 0 ? product.colors[0] : { name: "Default", hex: "#000000" });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (product.inStock) {
      addItem(product, selectedSize, selectedColor, quantity);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        onClose();
      }, 1200);
    }
  };

  const handleBuyNow = () => {
    if (product.inStock) {
      addItem(product, selectedSize, selectedColor, quantity);
      router.push("/checkout");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-4xl bg-card border border-border rounded-none shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 glass rounded-full hover:text-primary transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 bg-muted aspect-[4/5] md:aspect-auto flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border">
          <div className="relative w-full h-full max-h-[400px] flex items-center justify-center">
            {(() => {
              const src = product.images && product.images.length > 0 ? product.images[0] : (product.photoUrl || "https://placehold.co/400x500/1a1a1a/cccccc?text=No+Image");
              if (src.toLowerCase().endsWith('.mp4')) {
                return <video src={src} autoPlay loop muted playsInline className="max-h-full max-w-full object-contain" />;
              }
              return <img src={src} alt={product.name} className="max-h-full max-w-full object-contain" />;
            })()}
          </div>
        </div>

        {/* Right: Detailed Info */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Category / Badge */}
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 block">
              {product.category?.replace("-", " ") || "Uncategorized"}
            </span>
            
            {/* Title */}
            <h3 className="font-montserrat font-bold text-xl md:text-2xl tracking-wider uppercase text-foreground">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-3 mt-2 mb-6">
              <span className="text-xl font-bold text-primary">
                ৳{product.price.toLocaleString()} BDT
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground/60 line-through">
                  ৳{product.originalPrice.toLocaleString()} BDT
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] tracking-widest text-muted-foreground font-semibold">SELECT SIZE</span>
                <span className="text-[10px] underline cursor-pointer text-primary hover:text-foreground font-light">SIZE GUIDE</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.sizes || []).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-9 px-4 border text-xs tracking-wider transition-all rounded-none ${
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

            {/* Color Selector */}
            <div className="mb-6">
              <span className="text-[10px] tracking-widest text-muted-foreground font-semibold mb-2 block">SELECT COLOR: {selectedColor.name}</span>
              <div className="flex items-center gap-3">
                {(product.colors || []).map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color)}
                    className={`h-7 w-7 rounded-full border flex items-center justify-center transition-all ${
                      selectedColor.hex === color.hex
                        ? "border-primary scale-110"
                        : "border-border hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor.hex === color.hex && (
                      <Check className={`h-3 w-3 ${color.hex === "#f5f5f7" || color.hex === "#eeeae3" ? "text-foreground" : "text-foreground"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Stock Indicator */}
            <div className="mb-6 flex items-center gap-6">
              <div>
                <span className="text-[10px] tracking-widest text-muted-foreground font-semibold mb-2 block">QUANTITY</span>
                <div className="flex items-center border border-border h-10 bg-background">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 h-full text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-3 text-xs font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 h-full text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] tracking-widest text-muted-foreground font-semibold mb-2 block">AVAILABILITY</span>
                <div className="flex items-center gap-1.5 h-10">
                  <span className={`h-2 w-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-600"}`} />
                  <span className="text-xs font-light">
                    {product.inStock ? `In Stock (${product.stockCount} left)` : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || added}
              className={`w-full py-4 text-xs font-heading tracking-widest font-bold transition-all flex items-center justify-center gap-2 rounded-none ${
                added
                  ? "bg-green-600 text-foreground"
                  : product.inStock
                  ? "bg-primary text-primary-foreground hover:bg-accent shadow-lg"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> ADDED TO CART
                </>
              ) : product.inStock ? (
                <>
                  <ShoppingBag className="h-4 w-4" /> ADD TO CART
                </>
              ) : (
                "OUT OF STOCK"
              )}
            </button>

            {product.inStock && (
              <button
                onClick={handleBuyNow}
                className="w-full py-4 text-xs font-heading tracking-widest font-bold transition-all flex items-center justify-center gap-2 rounded-none bg-background text-foreground hover:bg-neutral-200 border border-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                BUY NOW
              </button>
            )}

            <Link
              href={`/shop/${product.id}`}
              onClick={onClose}
              className="text-center text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors underline font-light py-2"
            >
              VIEW FULL DETAILS
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
