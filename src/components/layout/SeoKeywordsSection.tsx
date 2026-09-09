"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Layers,
  MapPin,
  Flame,
  Search,
  CheckCircle2,
  Tag,
  Shirt,
  HeartHandshake
} from "lucide-react";

interface SeoItem {
  label: string;
  href: string;
  badge?: string;
}

interface SeoGroup {
  id: string;
  title: string;
  bnTitle: string;
  icon: React.ReactNode;
  items: SeoItem[];
}

export default function SeoKeywordsSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const seoGroups: SeoGroup[] = [
    {
      id: "deshiflex-official",
      title: "Deshiflex Brand & Official Queries",
      bnTitle: "দেশিফ্লেক্স অফিসিয়াল ও ব্র্যান্ড সার্চ",
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      items: [
        { label: "Deshiflex", href: "/", badge: "Official" },
        { label: "Deshi Flex", href: "/", badge: "Brand" },
        { label: "Deshiflex BD", href: "/", badge: "Verified" },
        { label: "Deshiflex Bangladesh", href: "/about" },
        { label: "Deshiflex clothing", href: "/shop" },
        { label: "Deshiflex clothing brand", href: "/about" },
        { label: "Deshiflex shop", href: "/shop" },
        { label: "Deshiflex online shop", href: "/shop" },
        { label: "Deshiflex official store", href: "/", badge: "Direct" },
        { label: "Deshiflex website", href: "/" },
        { label: "Deshiflex drop shoulder", href: "/shop?category=drop-shoulder", badge: "Best Seller" },
        { label: "Deshiflex oversized t shirt", href: "/shop?category=over-size-drop-shoulder" },
        { label: "Deshiflex t shirt", href: "/shop" },
        { label: "Deshiflex t shirt price in BD", href: "/shop", badge: "৳850" },
        { label: "Deshiflex polo shirt", href: "/shop" },
        { label: "Deshiflex hoodie", href: "/shop" },
        { label: "Deshiflex collection", href: "/shop" },
        { label: "Deshiflex new arrival", href: "/shop?sort=newest", badge: "New" },
        { label: "Deshiflex streetwear", href: "/shop" },
        { label: "Deshiflex export quality", href: "/about", badge: "Export" },
        { label: "Buy Deshiflex online", href: "/shop" },
        { label: "Deshiflex shop online order", href: "/shop" },
        { label: "Deshiflex price in Bangladesh", href: "/faq" },
        { label: "Deshiflex discount offer", href: "/shop", badge: "Offer" },
        { label: "Deshiflex coupon code", href: "/shop" },
        { label: "Deshiflex cash on delivery", href: "/shipping", badge: "COD" },
        { label: "Deshiflex home delivery BD", href: "/shipping" },
        { label: "Deshiflex delivery charge", href: "/shipping" },
        { label: "Deshiflex review Bangladesh", href: "/about" },
        { label: "Deshiflex customer care number", href: "/contact", badge: "Support" },
        { label: "Deshiflex kaporer dokan", href: "/shop" },
        { label: "Deshiflex t shirt er dam koto", href: "/faq" },
        { label: "Deshiflex theke kapor kinbo", href: "/shop" },
        { label: "Deshiflex drop shoulder dam", href: "/shop" },
        { label: "Deshiflex bhalo quality kina", href: "/about" },
        { label: "Deshiflex online order kivabe kore", href: "/faq" },
        { label: "Deshiflex page BD", href: "/" },
        { label: "Deshiflex er notun collection", href: "/shop" },
        { label: "Deshiflex sosta t shirt", href: "/shop" },
        { label: "Deshiflex delivery koto din lage", href: "/shipping" },
        { label: "দেশিফ্লেক্স", href: "/", badge: "অফিসিয়াল" },
        { label: "দেশিফ্লেক্স বিডি", href: "/" },
        { label: "দেশিফ্লেক্স অনলাইন শপ", href: "/shop" },
        { label: "দেশিফ্লেক্স টি শার্ট", href: "/shop" },
        { label: "দেশিফ্লেক্স ড্রপ শোল্ডার", href: "/shop?category=drop-shoulder" },
        { label: "দেশিফ্লেক্স জামাকাপড়", href: "/shop" },
        { label: "দেশিফ্লেক্স টি শার্টের দাম কত", href: "/faq" }
      ]
    },
    {
      id: "buying-intent",
      title: "Buying Intent & Price Queries",
      bnTitle: "ক্রয় ও দাম সংক্রান্ত",
      icon: <Tag className="w-4 h-4 text-primary" />,
      items: [
        { label: "kom dame bhalo kapor", href: "/shop", badge: "Popular" },
        { label: "kaporer dam koto", href: "/faq", badge: "FAQ" },
        { label: "sobcheye kom dame t shirt", href: "/shop" },
        { label: "drop shoulder t shirt er dam koto", href: "/faq", badge: "Price" },
        { label: "panjabi kinbo online", href: "/shop" },
        { label: "online kapor er dokan", href: "/shop" },
        { label: "bhalo kapor kothay pabo", href: "/about" },
        { label: "kapor kinte chai", href: "/shop" },
        { label: "sosta kaporer dokan dhaka", href: "/shop" },
        { label: "bhalo quality panjabi dam", href: "/shop" },
        { label: "cheap rate e kapor", href: "/shop" },
        { label: "discount offer kaporer dokan", href: "/shop", badge: "Offers" },
        { label: "eid collection dress kinbo", href: "/shop" },
        { label: "cash on delivery dress kinbo", href: "/shipping", badge: "COD" },
        { label: "delivery charge chara kapor", href: "/shipping" },
        { label: "home delivery kaporer dokan", href: "/shipping" },
        { label: "return policy bhalo kaporer page", href: "/refund" },
        { label: "original export quality kapor kinbo", href: "/about", badge: "Export" },
        { label: "brand er kapor kom dame", href: "/shop" },
        { label: "wholesale dame retail kapor", href: "/custom-order", badge: "Wholesale" },
        { label: "Buy drop shoulder T-shirt online BD", href: "/shop" },
        { label: "Drop shoulder T-shirt price in Bangladesh", href: "/shop" },
        { label: "Drop shoulder offer BD", href: "/shop" },
        { label: "Best drop shoulder brand in Bangladesh", href: "/about" },
        { label: "Buy 2 get 1 drop shoulder T-shirt", href: "/shop", badge: "Deal" }
      ]
    },
    {
      id: "streetwear",
      title: "Dropshoulder & Streetwear Specifics",
      bnTitle: "ড্রপ শোল্ডার ও ট্রেন্ড",
      icon: <Flame className="w-4 h-4 text-primary" />,
      items: [
        { label: "drop shoulder t shirt kinbo", href: "/shop", badge: "Trending" },
        { label: "oversized t shirt meyeder", href: "/shop?category=women-drop-shoulder" },
        { label: "oversized t shirt cheleder", href: "/shop?category=over-size-drop-shoulder" },
        { label: "drop shoulder cotton bhalo gsm", href: "/about" },
        { label: "220 gsm drop shoulder dam", href: "/shop?category=drop-shoulder" },
        { label: "aesthetic drop shoulder t shirt", href: "/shop" },
        { label: "streetwear t shirt bd", href: "/shop" },
        { label: "back print drop shoulder kinbo", href: "/custom-order", badge: "Custom" },
        { label: "anime drop shoulder t shirt", href: "/custom-order" },
        { label: "typography print t shirt", href: "/shop" },
        { label: "plain black drop shoulder", href: "/shop" },
        { label: "white drop shoulder bhalo quality", href: "/shop" },
        { label: "loose fit t shirt online", href: "/shop" },
        { label: "boxy fit tee bd", href: "/shop?category=over-size-drop-shoulder" },
        { label: "combo offer drop shoulder", href: "/shop" },
        { label: "3 ta drop shoulder offer", href: "/shop", badge: "Hot" },
        { label: "export drop shoulder wholesale", href: "/contact" },
        { label: "Drop shoulder T-shirt BD", href: "/shop" },
        { label: "Oversized drop shoulder T-shirt", href: "/shop?category=over-size-drop-shoulder" },
        { label: "Vintage drop shoulder T-shirt", href: "/shop?category=acid-wash-drop-shoulder" },
        { label: "Heavyweight drop shoulder tee", href: "/shop?category=over-size-drop-shoulder" },
        { label: "Ribbed neck drop shoulder T-shirt", href: "/shop" },
        { label: "Drop shoulder polo shirt", href: "/shop" }
      ]
    },
    {
      id: "mens-apparel",
      title: "Men's Clothing & Streetwear",
      bnTitle: "ছেলেদের জামাকাপড়",
      icon: <Shirt className="w-4 h-4 text-primary" />,
      items: [
        { label: "cheleder notun t shirt", href: "/shop", badge: "New" },
        { label: "cheleder drop shoulder t shirt", href: "/shop" },
        { label: "bhalo cotton panjabi kinbo", href: "/shop" },
        { label: "semi long panjabi design", href: "/shop" },
        { label: "kabli set er dam koto", href: "/shop" },
        { label: "cheleder formal shirt price", href: "/shop" },
        { label: "cheleder casual shirt bhalo quality", href: "/shop" },
        { label: "jeans pant kom dame", href: "/shop" },
        { label: "baggy jeans cheleder", href: "/shop" },
        { label: "cargo pant 6 pocket", href: "/shop" },
        { label: "chino pant kom dame", href: "/shop" },
        { label: "cheleder polo t shirt online", href: "/shop" },
        { label: "cheleder winter hoodie", href: "/shop" },
        { label: "cheleder jacket dam koto", href: "/shop" },
        { label: "sweat shirt bhalo quality", href: "/shop" },
        { label: "cotton boxer cheleder", href: "/shop" },
        { label: "bhalo lungi online", href: "/shop" },
        { label: "cheleder pajamas panjabi set", href: "/shop" },
        { label: "blazer price cheleder", href: "/shop" },
        { label: "gym t shirt bhalo cotton", href: "/shop" },
        { label: "Men's drop shoulder tee", href: "/shop" },
        { label: "Solid color drop shoulder tee", href: "/shop" }
      ]
    },
    {
      id: "womens-traditional",
      title: "Women's Clothing & Traditional",
      bnTitle: "মেয়েদের পোশাক ও থ্রি-পিস",
      icon: <ShoppingBag className="w-4 h-4 text-primary" />,
      items: [
        { label: "meyeder sundor dress", href: "/shop?category=women-drop-shoulder" },
        { label: "three piece kom dame", href: "/shop" },
        { label: "sunder kurti collection", href: "/shop" },
        { label: "pakistani three piece original", href: "/shop" },
        { label: "indian three piece bhalo quality", href: "/shop" },
        { label: "jamdani sharee online kinbo", href: "/shop" },
        { label: "katan sharee er dam koto", href: "/shop" },
        { label: "cotton sharee daily wear", href: "/shop" },
        { label: "georgette three piece design", href: "/shop" },
        { label: "anarkali dress meyeder", href: "/shop" },
        { label: "lehenga collection dhaka", href: "/shop" },
        { label: "bridal sharee kom dame", href: "/shop" },
        { label: "party dress meyeder", href: "/shop" },
        { label: "lawn dress original", href: "/shop" },
        { label: "stitched salwar kameez kinbo", href: "/shop" },
        { label: "unstitched three piece dokan", href: "/shop" },
        { label: "meyeder palazzo pant", href: "/shop" },
        { label: "leggings bhalo cotton", href: "/shop" },
        { label: "duplicate chara original pakistani dress", href: "/shop" },
        { label: "boutique collection three piece", href: "/shop" },
        { label: "Women's drop shoulder T-shirt", href: "/shop?category=women-drop-shoulder" }
      ]
    },
    {
      id: "modest-borka",
      title: "Modest Fashion & Borka",
      bnTitle: "বোরকা ও হিজাব কালেকশন",
      icon: <HeartHandshake className="w-4 h-4 text-primary" />,
      items: [
        { label: "borka collection dhaka", href: "/shop" },
        { label: "borka kinbo online", href: "/shop" },
        { label: "borka er dam koto", href: "/faq" },
        { label: "dubai borka design", href: "/shop" },
        { label: "abaya collection bd", href: "/shop" },
        { label: "kaporer borka kom dame", href: "/shop" },
        { label: "simple borka design", href: "/shop" },
        { label: "party wear borka", href: "/shop" },
        { label: "front open abaya kinbo", href: "/shop" },
        { label: "hijab collection kom dame", href: "/shop" },
        { label: "georgette hijab price", href: "/shop" },
        { label: "crinkle hijab bhalo quality", href: "/shop" },
        { label: "khimar collection online", href: "/shop" },
        { label: "namaj er chadar kinbo", href: "/shop" },
        { label: "jilbab collection bd", href: "/shop" },
        { label: "modest wear meyeder", href: "/shop" },
        { label: "stylish abaya design", href: "/shop" },
        { label: "two piece borka set", href: "/shop" },
        { label: "kaftan borka price", href: "/shop" },
        { label: "daily wear borka dokan", href: "/shop" }
      ]
    },
    {
      id: "fabric-gsm",
      title: "Fabric, GSM & Quality Standards",
      bnTitle: "ফেব্রিক, জিএসএম ও কোয়ালিটি",
      icon: <Layers className="w-4 h-4 text-primary" />,
      items: [
        { label: "180 GSM drop shoulder T-shirt", href: "/shop" },
        { label: "200 GSM drop shoulder tee", href: "/shop" },
        { label: "220 GSM heavy drop shoulder", href: "/shop?category=drop-shoulder", badge: "Best Seller" },
        { label: "240 GSM drop shoulder BD", href: "/shop?category=acid-wash-drop-shoulder" },
        { label: "100% cotton drop shoulder T-shirt", href: "/shop" },
        { label: "Organic cotton drop shoulder", href: "/shop" },
        { label: "Combed compact cotton drop shoulder", href: "/shop" },
        { label: "Bio-wash drop shoulder T-shirt", href: "/shop" },
        { label: "Drop shoulder export quality BD", href: "/about" },
        { label: "Premium drop shoulder collection", href: "/shop" },
        { label: "Custom drop shoulder printing BD", href: "/custom-order", badge: "Interactive" },
        { label: "Blank drop shoulder T-shirt for printing", href: "/custom-order" }
      ]
    },
    {
      id: "location-trust",
      title: "Location & Trust Signals",
      bnTitle: "লোকেশন ও ট্রাস্ট ডেলিভারি",
      icon: <MapPin className="w-4 h-4 text-primary" />,
      items: [
        { label: "dhakar moddhe delivery", href: "/shipping", badge: "24-48h" },
        { label: "chittagong e kapor delivery", href: "/shipping" },
        { label: "ghor boshe kapor kinun", href: "/shop" },
        { label: "trusted clothing page bd", href: "/about" },
        { label: "facebook kaporer page", href: "https://facebook.com" },
        { label: "verified clothing shop bd", href: "/about", badge: "Verified" },
        { label: "dhaka shopping online", href: "/shop" },
        { label: "mirpur e kaporer dokan", href: "/contact" },
        { label: "uttara clothing shop", href: "/contact" },
        { label: "islampur wholesale cloth market", href: "/contact" },
        { label: "bongo bazar online shopping", href: "/shop" },
        { label: "new market dress collection", href: "/shop" },
        { label: "chawkbazar wholesale kapor", href: "/custom-order" },
        { label: "gazipur export cloth shop", href: "/about" },
        { label: "narayanganj knit clothing wholesale", href: "/about" },
        { label: "Drop shoulder cash on delivery", href: "/shipping", badge: "COD" },
        { label: "Drop shoulder wholesale market Dhaka", href: "/contact" }
      ]
    },
    {
      id: "native-bengali",
      title: "Native Bengali Searches",
      bnTitle: "বাংলা কিওয়ার্ড সার্চ",
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      items: [
        { label: "ড্রপ শোল্ডার টি শার্ট", href: "/shop", badge: "শীর্ষ সার্চ" },
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

  // Total keywords count
  const totalKeywords = useMemo(() => {
    return seoGroups.reduce((acc, g) => acc + g.items.length, 0);
  }, [seoGroups]);

  // Filter groups and items based on search query and active tab
  const filteredGroups = useMemo(() => {
    return seoGroups
      .filter(group => activeTab === "all" || group.id === activeTab)
      .map(group => {
        if (!searchQuery.trim()) return group;
        const lowerQ = searchQuery.toLowerCase();
        const matchedItems = group.items.filter(item =>
          item.label.toLowerCase().includes(lowerQ)
        );
        return {
          ...group,
          items: matchedItems
        };
      })
      .filter(group => group.items.length > 0);
  }, [seoGroups, activeTab, searchQuery]);

  return (
    <section className="border-t border-border/60 bg-muted/15 py-12 text-xs relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h4 className="font-heading text-base md:text-lg tracking-wider uppercase text-foreground">
                Popular Searches & High-Intent Categories
              </h4>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-primary/15 text-primary border border-primary/30">
                {totalKeywords}+ Indexed Terms
              </span>
            </div>
            <p className="text-muted-foreground text-[11px] mt-1">
              Bangla, Banglish, and Streetwear buying queries across Dhaka and all 64 districts in Bangladesh.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time search filter */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search queries (e.g. dam, dhaka, 220 gsm)..."
                className="w-full pl-8 pr-3 py-1.5 bg-background/80 border border-border/60 rounded text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Toggle Visibility */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border/70 hover:border-primary/60 rounded text-[11px] uppercase tracking-wider font-semibold text-foreground transition-all duration-200"
              aria-label="Toggle all keywords"
            >
              <span>{isOpen ? "Collapse" : "Explore All"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none border-b border-border/30">
          <button
            onClick={() => setActiveTab("all")}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] tracking-wider uppercase font-semibold transition-colors ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All Queries ({totalKeywords})
          </button>
          {seoGroups.map(group => (
            <button
              key={group.id}
              onClick={() => setActiveTab(group.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] tracking-wider uppercase font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === group.id
                  ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {group.title}
              <span className="text-[10px] opacity-70">({group.items.length})</span>
            </button>
          ))}
        </div>

        {/* Keyword Grids */}
        <div
          className={`mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ${
            isOpen ? "block opacity-100" : "max-h-[500px] overflow-hidden relative md:max-h-none md:grid"
          }`}
        >
          {filteredGroups.map(group => (
            <div
              key={group.id}
              className="p-4 rounded-lg bg-card/40 border border-border/40 hover:border-border/80 transition-colors space-y-3"
            >
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                {group.icon}
                <div>
                  <h5 className="font-heading tracking-wider uppercase text-foreground text-xs font-bold leading-tight">
                    {group.title}
                  </h5>
                  <span className="text-[10px] text-muted-foreground font-light block">
                    {group.bnTitle}
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5">
                {group.items.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between text-muted-foreground hover:text-primary transition-colors text-[11px] py-0.5 hover:translate-x-1 duration-200"
                    >
                      <span className="truncate pr-2">{item.label}</span>
                      {item.badge && (
                        <span className="shrink-0 px-1.5 py-0.2 text-[9px] uppercase tracking-wider rounded bg-primary/10 text-primary font-mono group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Expand button gradient on mobile when collapsed */}
        {!isOpen && (
          <div className="md:hidden text-center mt-3">
            <button
              onClick={() => setIsOpen(true)}
              className="text-[11px] text-primary underline underline-offset-4 tracking-wider uppercase font-semibold"
            >
              Show all {totalKeywords} keywords & searches &darr;
            </button>
          </div>
        )}

        {/* Trust Signals & Summary text */}
        <div className="mt-8 pt-6 border-t border-border/40 text-muted-foreground/90 leading-relaxed text-[11px] grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              <strong className="text-foreground">Cash on Delivery Across Bangladesh:</strong> Fast home delivery within 24–48 hours in Dhaka, Chittagong, Sylhet, Mirpur, Uttara, Gazipur, Narayanganj, and all 64 districts.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              <strong className="text-foreground">Export Quality 180 to 240 GSM:</strong> 100% combed compact organic cotton, bio-washed fabric, ribbed collars, and anti-fade reactive dyes.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              <strong className="text-foreground">Wholesale & Custom Printing:</strong> Blank dropshoulder tees for printing, interactive live 3D custom order creator, and bulk wholesale rates for retail resellers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
