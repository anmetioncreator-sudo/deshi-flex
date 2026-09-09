"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Tag, Sparkles, Layers, ShoppingBag, Globe2 } from "lucide-react";

export default function SeoKeywordsSection() {
  const [isOpen, setIsOpen] = useState(false);

  const seoGroups = [
    {
      title: "Core Products & Streetwear Fits",
      icon: <ShoppingBag className="w-4 h-4 text-primary" />,
      items: [
        { label: "Drop shoulder T-shirt BD", href: "/shop" },
        { label: "Oversized drop shoulder T-shirt", href: "/shop?category=over-size-drop-shoulder" },
        { label: "Men's drop shoulder tee", href: "/shop" },
        { label: "Women's drop shoulder T-shirt", href: "/shop?category=women-drop-shoulder" },
        { label: "Unisex drop shoulder shirt", href: "/shop" },
        { label: "Plain drop shoulder T-shirt", href: "/shop" },
        { label: "Solid color drop shoulder tee", href: "/shop" },
        { label: "Graphic drop shoulder T-shirt", href: "/shop" },
        { label: "Typography drop shoulder T-shirt", href: "/shop" },
        { label: "Back print drop shoulder T-shirt", href: "/custom-order" },
        { label: "Minimal drop shoulder tee", href: "/shop" },
        { label: "Anime drop shoulder T-shirt BD", href: "/custom-order" },
        { label: "Vintage drop shoulder T-shirt", href: "/shop?category=acid-wash-drop-shoulder" },
        { label: "Streetwear drop shoulder BD", href: "/shop" },
        { label: "Heavyweight drop shoulder tee", href: "/shop?category=over-size-drop-shoulder" },
        { label: "Boxy fit drop shoulder T-shirt", href: "/shop?category=over-size-drop-shoulder" },
        { label: "Loose fit drop shoulder shirt", href: "/shop" },
        { label: "Crew neck drop shoulder tee", href: "/shop" },
        { label: "Ribbed neck drop shoulder T-shirt", href: "/shop" },
        { label: "Drop shoulder polo shirt", href: "/shop" }
      ]
    },
    {
      title: "Fabric, GSM & Quality Standards",
      icon: <Layers className="w-4 h-4 text-primary" />,
      items: [
        { label: "180 GSM drop shoulder T-shirt", href: "/shop" },
        { label: "200 GSM drop shoulder tee", href: "/shop" },
        { label: "220 GSM heavy drop shoulder", href: "/shop?category=drop-shoulder" },
        { label: "240 GSM drop shoulder BD", href: "/shop?category=acid-wash-drop-shoulder" },
        { label: "100% cotton drop shoulder T-shirt", href: "/shop" },
        { label: "Organic cotton drop shoulder", href: "/shop" },
        { label: "Combed compact cotton drop shoulder", href: "/shop" },
        { label: "Bio-wash drop shoulder T-shirt", href: "/shop" },
        { label: "Drop shoulder export quality BD", href: "/about" },
        { label: "Premium drop shoulder collection", href: "/shop" }
      ]
    },
    {
      title: "Buyer Intent, Pricing & Delivery",
      icon: <Tag className="w-4 h-4 text-primary" />,
      items: [
        { label: "Buy drop shoulder T-shirt online BD", href: "/shop" },
        { label: "Drop shoulder T-shirt price in Bangladesh", href: "/shop" },
        { label: "Cheap drop shoulder T-shirt Dhaka", href: "/shop" },
        { label: "Drop shoulder offer BD", href: "/shop" },
        { label: "Best drop shoulder brand in Bangladesh", href: "/about" },
        { label: "Drop shoulder cash on delivery", href: "/shipping" },
        { label: "Custom drop shoulder printing BD", href: "/custom-order" },
        { label: "Blank drop shoulder T-shirt for printing", href: "/custom-order" },
        { label: "Drop shoulder wholesale market Dhaka", href: "/contact" },
        { label: "Buy 2 get 1 drop shoulder T-shirt", href: "/shop" }
      ]
    },
    {
      title: "বাংলা ও বাংলিশ সার্চ (Bangla & Banglish)",
      icon: <Globe2 className="w-4 h-4 text-primary" />,
      items: [
        { label: "ড্রপ শোল্ডার টি শার্ট", href: "/shop" },
        { label: "ছেলেদের ড্রপ শোল্ডার টি শার্ট", href: "/shop" },
        { label: "কম দামে ড্রপ শোল্ডার", href: "/shop" },
        { label: "ড্রপ শোল্ডার কালেকশন ঢাকা", href: "/shop" },
        { label: "সুতি ড্রপ শোল্ডার টি শার্ট", href: "/shop" },
        { label: "Drop shoulder t shirt dam koto", href: "/faq" },
        { label: "Kom dame drop shoulder t shirt", href: "/shop" },
        { label: "Bhalo quality drop shoulder", href: "/about" },
        { label: "Drop shoulder t shirt kinbo", href: "/shop" },
        { label: "Natun design drop shoulder", href: "/shop" }
      ]
    }
  ];

  return (
    <section className="border-t border-border/60 bg-muted/10 py-10 text-xs">
      <div className="max-w-7xl mx-auto px-4">
        {/* Toggle header */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between cursor-pointer group py-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h4 className="font-heading text-sm md:text-base tracking-widest uppercase text-foreground group-hover:text-primary transition-colors">
              Popular Streetwear Searches & Categories in Bangladesh
            </h4>
          </div>
          <button 
            className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground text-[11px] uppercase tracking-wider font-semibold"
            aria-label="Toggle popular searches"
          >
            <span>{isOpen ? "Hide Keywords" : "View All Searches"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Content list */}
        <div className={`mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-500 ${isOpen ? "block opacity-100" : "hidden md:grid opacity-90"}`}>
          {seoGroups.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                {group.icon}
                <h5 className="font-heading tracking-wider uppercase text-foreground text-xs font-bold">
                  {group.title}
                </h5>
              </div>
              <ul className="space-y-1.5">
                {group.items.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-[11px] block hover:translate-x-1 duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Summary text */}
        <div className="mt-8 pt-6 border-t border-border/30 text-muted-foreground/80 leading-relaxed text-[11px] space-y-2">
          <p>
            <strong>Deshi Flex</strong> is Bangladesh&apos;s premier online streetwear destination for authentic, high-GSM drop-shoulder tees, oversized streetwear, acid-wash retro shirts, and custom apparel printing. Dispatched across all 64 districts with Cash on Delivery (COD) in Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, and Mymensingh.
          </p>
        </div>
      </div>
    </section>
  );
}
