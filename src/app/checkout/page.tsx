"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCartStore, useLanguageStore } from "@/store";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  CreditCard, ShieldCheck, ShoppingBag, CheckCircle, Ticket, Truck, Phone, ArrowLeft, ArrowRight, ChevronDown, Plus, Minus, Check, MessageCircle, Sparkles
} from "lucide-react";
import { Order, AdvanceTier, DIVISIONS } from '@/types';

const translations = {
  en: {
    secureCheckout: "SECURE CHECKOUT",
    cartEmptyTitle: "YOUR CART IS EMPTY",
    cartEmptyDesc: "You must add some items to your shopping cart to checkout.",
    browseProducts: "BROWSE PRODUCTS",
    contactInfo: "CONTACT INFO",
    emailAddress: "EMAIL ADDRESS",
    enterEmail: "ENTER YOUR EMAIL",
    phoneNumber: "PHONE NUMBER",
    shippingAddress: "SHIPPING ADDRESS",
    firstName: "FIRST NAME",
    lastName: "LAST NAME",
    deliveryAddress: "DELIVERY ADDRESS",
    addressPlaceholder: "HOUSE NO, STREET, AREA, ROAD",
    city: "DIVISION / CITY",
    district: "DISTRICT (JELA)",
    paymentDetails: "PAYMENT DETAILS",
    cardStripe: "CARD (STRIPE)",
    bkashNagad: "BKASH / NAGAD",
    advancePayment: "ADVANCE PAYMENT",
    trxId: "TRANSACTION ID (TRXID)",
    trxIdPh: "ENTER BKASH/NAGAD TRXID",
    codNotice: "Remaining balance will be paid via Cash on Delivery.",
    securePaymentText: "All payments are manually verified before shipping.",
    discountCode: "DISCOUNT CODE",
    enterCode: "ENTER CODE (e.g. FLEXDROP)",
    apply: "APPLY",
    orderSummary: "ORDER SUMMARY",
    qty: "QTY",
    itemsTotal: "ITEMS TOTAL",
    discount: "DISCOUNT",
    shippingFee: "SHIPPING FEE",
    orderTotal: "ORDER TOTAL",
    processingPayment: "PROCESSING PAYMENT...",
    placeOrder: "PLACE SECURE ORDER",
    backToShopping: "BACK TO SHOPPING",
    orderSuccess: "ORDER PLACED SUCCESSFULLY",
    tagline: "WEAR YOUR CULTURE, FLEX YOUR STYLE",
    trackingId: "TRACKING ID",
    paymentMethod: "PAYMENT METHOD",
    estimatedDelivery: "ESTIMATED DELIVERY",
    emailSent: "A confirmation email has been sent to",
    willContact: "We will contact you at",
    beforeDelivery: "before delivery.",
    continueShopping: "CONTINUE SHOPPING",
    invalidCoupon: "Invalid coupon code. Try 'FLEXDROP'.",
    couponApplied: "Coupon applied! 15% discount applied to items.",
    dhakaDelivery: "24-48 Hours",
    outsideDhaka: "3-5 Days"
  },
  bn: {
    secureCheckout: "নিরাপদ চেকআউট",
    cartEmptyTitle: "আপনার কার্ট খালি",
    cartEmptyDesc: "চেকআউট করার জন্য আপনাকে শপিং কার্টে কিছু আইটেম যোগ করতে হবে।",
    browseProducts: "পণ্য ব্রাউজ করুন",
    contactInfo: "যোগাযোগের তথ্য",
    emailAddress: "ইমেইল ঠিকানা",
    enterEmail: "আপনার ইমেইল লিখুন",
    phoneNumber: "ফোন নম্বর",
    shippingAddress: "শিপিং ঠিকানা",
    firstName: "নামের প্রথমাংশ",
    lastName: "নামের শেষাংশ",
    deliveryAddress: "ডেলিভারি ঠিকানা",
    addressPlaceholder: "বাসা নং, রাস্তা, এলাকা",
    city: "বিভাগ / শহর",
    district: "জেলা (JELA)",
    paymentDetails: "পেমেন্ট বিস্তারিত",
    cardStripe: "কার্ড (স্ট্রাইপ)",
    bkashNagad: "বিকাশ / নগদ",
    advancePayment: "অগ্রিম পেমেন্ট",
    trxId: "ট্রানজ্যাকশন আইডি (TrxID)",
    trxIdPh: "বিকাশ/নগদ TrxID দিন",
    codNotice: "অবশিষ্ট ব্যালেন্স ক্যাশ অন ডেলিভারি (COD) এর মাধ্যমে দিতে হবে।",
    securePaymentText: "শিপিংয়ের আগে সমস্ত পেমেন্ট ম্যানুয়ালি যাচাই করা হয়।",
    discountCode: "ডিসকাউন্ট কোড",
    enterCode: "কোড লিখুন (যেমন: FLEXDROP)",
    apply: "প্রয়োগ করুন",
    orderSummary: "অর্ডারের সারসংক্ষেপ",
    qty: "পরিমাণ",
    itemsTotal: "সর্বমোট আইটেম",
    discount: "ডিসকাউন্ট",
    shippingFee: "শিপিং ফি",
    orderTotal: "সর্বমোট অর্ডার",
    processingPayment: "পেমেন্ট প্রক্রিয়া করা হচ্ছে...",
    placeOrder: "নিরাপদ অর্ডার দিন",
    backToShopping: "শপিং এ ফিরে যান",
    orderSuccess: "অর্ডার সফলভাবে দেওয়া হয়েছে",
    tagline: "আপনার সংস্কৃতি পরিধান করুন, আপনার শৈলী প্রদর্শন করুন",
    trackingId: "ট্র্যাকিং আইডি",
    paymentMethod: "পেমেন্ট পদ্ধতি",
    estimatedDelivery: "আনুমানিক ডেলিভারি",
    emailSent: "একটি কনফার্মেশন ইমেইল পাঠানো হয়েছে",
    willContact: "আমরা যোগাযোগ করব",
    beforeDelivery: "ডেলিভারির পূর্বে।",
    continueShopping: "কেনাকাটা চালিয়ে যান",
    invalidCoupon: "অবৈধ কুপন কোড। 'FLEXDROP' চেষ্টা করুন।",
    couponApplied: "কুপন প্রয়োগ করা হয়েছে! ১৫% ছাড় যুক্ত হয়েছে।",
    dhakaDelivery: "২৪-৪৮ ঘন্টা",
    outsideDhaka: "৩-৫ দিন"
  }
};

export default function Checkout() {
  const cartItems = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  // Form states
  const [email, setEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [area, setArea] = useState("");
  const [deliveryType, setDeliveryType] = useState("Home");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [districtSearchQuery, setDistrictSearchQuery] = useState("");
  const [customRequest, setCustomRequest] = useState("");
  const addOrder = useStore((state) => state.addOrder);
  
  // Mobile banking inputs
  const [advancePaid, setAdvancePaid] = useState<number | string>(120);
  const [customAdvanceAmount, setCustomAdvanceAmount] = useState("");
  const [trxId, setTrxId] = useState("");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Checkout sequence state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Celebratory congratulation animation
  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#e2e8f0', '#94a3b8', '#cbd5e1', '#10b981', '#f8fafc', '#d4d4d8'],
      zIndex: 9999
    });

    const duration = 2200;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.75 },
        colors: ['#ffffff', '#cbd5e1', '#94a3b8', '#10b981'],
        zIndex: 9999
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.75 },
        colors: ['#ffffff', '#cbd5e1', '#94a3b8', '#10b981'],
        zIndex: 9999
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preview") === "success") {
        setOrderPlaced(true);
        setOrderNumber("DF-303667-BD");
        setEmail("gourobshaha@gmail.com");
        setPhone("01771075444");
        setAddress("asdasdasdasd");
        setDistrict("Dhaka");
        setCity("Dhaka");
        setAdvancePaid(132);
      }
    }
  }, []);

  useEffect(() => {
    if (orderPlaced) {
      triggerCelebration();
    }
  }, [orderPlaced, triggerCelebration]);

  // Shipping cost: Flat BDT 100 inside Dhaka, BDT 150 outside
  const shippingCost = district.toLowerCase() === "dhaka" ? 100 : 150;
  
  const subtotal = getCartTotal();
  const discountAmount = subtotal * (appliedDiscount / 100);
  const totalAmount = subtotal - discountAmount + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    
    if (couponCode.toUpperCase() === "FLEXDROP") {
      setAppliedDiscount(15);
      setCouponSuccess(t.couponApplied);
    } else {
      setCouponError(t.invalidCoupon);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    const trackingId = `DF-${Date.now().toString().slice(-6)}-BD`;

    const newOrder = {
      id: trackingId,
      type: 'Direct Checkout' as const,
      date: new Date().toISOString(),
      fullName: recipientName,
      email,
      phone,
      address: `${address}, ${area ? area + ', ' : ''}${city} (${deliveryType} Delivery)`,
      region: district,
      specialNotes: customRequest,
      advancePaid: advancePaid === 'Custom' ? Number(customAdvanceAmount) : Number(advancePaid),
      trxId,
      remainingBalance: totalAmount - (advancePaid === 'Custom' ? Number(customAdvanceAmount) : Number(advancePaid)),
      status: 'Pending Verification' as const,
      cartItems: cartItems
    };

    try {
      await addOrder(newOrder as any);
    } catch (err) {
      console.error("Error saving order:", err);
    }

    // Brief processing animation for polish
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderPlaced(true);
      setOrderNumber(trackingId);
      clearCart();
    }, 1200);
  };

  if (orderPlaced) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Navbar />
        <main className="flex-grow py-28 sm:py-36 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg w-full mx-auto px-6 sm:px-8 text-center border border-zinc-700/80 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.06),0_25px_60px_-15px_rgba(0,0,0,0.95)]"
          >
            {/* Top metallic silver hairline */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-zinc-200/70 to-transparent" />

            {/* Subtle silver radial highlights */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-zinc-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            {/* Normal Green Sign at the Top */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 20, delay: 0.15 }}
              onClick={triggerCelebration}
              className="relative mx-auto mb-5 flex items-center justify-center cursor-pointer group"
              title="Click to celebrate again!"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center p-1.5 shadow-[0_0_25px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
              </div>
            </motion.div>
            
            {/* Silver & White Black Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-200 mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>ORDER REGISTERED SUCCESSFULLY</span>
            </div>

            <h1 className="font-montserrat font-black text-2xl sm:text-3xl tracking-wider mb-2 text-white uppercase">{t.orderSuccess}</h1>
            <p className="text-xs tracking-[0.25em] text-zinc-400 uppercase font-semibold mb-6 font-montserrat">{t.tagline}</p>
            
            {/* Silver & Black Details Container */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-left space-y-3.5 mb-6 font-mono divide-y divide-zinc-800/80 shadow-2xl">
              <div className="flex justify-between items-center text-xs pb-2">
                <span className="text-zinc-400 uppercase tracking-wider">{t.trackingId}:</span>
                <span className="font-bold text-white bg-zinc-800/90 px-3 py-1 rounded-lg border border-zinc-600/70 font-mono tracking-wider shadow-sm">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-3 pb-2">
                <span className="text-zinc-400 uppercase tracking-wider">{t.deliveryAddress}:</span>
                <span className="font-semibold text-zinc-100 text-right max-w-[60%] truncate">{address}, {district}, {city}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-3 pb-2">
                <span className="text-zinc-400 uppercase tracking-wider">{t.paymentMethod}:</span>
                <span className="font-bold text-white uppercase text-right">Advance ({advancePaid === 'Custom' ? customAdvanceAmount : advancePaid} BDT) + COD</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-3">
                <span className="text-zinc-400 uppercase tracking-wider">{t.estimatedDelivery}:</span>
                <span className="font-bold text-zinc-200">{district.toLowerCase() === "dhaka" ? t.dhakaDelivery : t.outsideDhaka}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6 font-sans">
              {t.emailSent} <strong className="text-white font-mono">{email}</strong>. {t.willContact} <strong className="text-white font-mono">{phone}</strong> {t.beforeDelivery}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/8801710793841"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-zinc-500 transition-all font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 font-mono cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 text-zinc-300" />
                WhatsApp Concierge
              </a>
              <Link
                href="/shop"
                className="flex-1 py-3.5 px-4 bg-white hover:bg-zinc-200 text-black transition-all font-bold uppercase tracking-wider text-xs rounded-xl shadow-xl hover:scale-[1.01] active:scale-[0.99] block text-center font-mono cursor-pointer"
              >
                {t.continueShopping}
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          
          <h1 className="font-heading text-4xl md:text-5xl tracking-wider mb-10 text-foreground light-mode:text-foreground">
            {t.secureCheckout}
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border flex flex-col items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
              <h3 className="font-heading text-lg tracking-wider mb-2">{t.cartEmptyTitle}</h3>
              <p className="text-xs text-muted-foreground font-light mb-6">{t.cartEmptyDesc}</p>
              <Link
                href="/shop"
                className="bg-primary text-primary-foreground hover:bg-accent px-8 py-3 text-xs font-heading tracking-widest font-bold transition-all"
              >
                {t.browseProducts}
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Shipping and Payment Info */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Contact Information */}
                <div className="bg-card border border-border shadow-xl rounded-xl p-8">
                  <h3 className="font-heading text-xl tracking-widest mb-6 text-foreground uppercase">{t.contactInfo}</h3>
                  <div className="space-y-5">
                    <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
                      <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">{t.emailAddress}</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.enterEmail}
                        className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none transition-colors font-semibold text-foreground"
                      />
                    </div>
                    <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
                      <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">{t.phoneNumber}</label>
                      <div className="relative">
                        <Phone className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 017XXXXXXXX"
                          className="w-full bg-transparent border-b border-border focus:border-primary pl-6 pb-2 text-sm focus:outline-none transition-colors font-semibold text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-card border border-border shadow-xl rounded-xl p-8 mt-8">
                  <h3 className="font-heading text-xl tracking-widest mb-6 text-foreground uppercase">{t.shippingAddress}</h3>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
                        <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Recipient Name *</label>
                        <input type="text" required value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Full Name" className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none transition-colors font-semibold text-foreground" />
                      </div>
                      <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
                        <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Country</label>
                        <div className="w-full border-b border-border pb-2 text-sm font-semibold text-foreground">
                          Bangladesh
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg relative">
                         <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Division *</label>
                         <div onClick={() => { setIsDistrictDropdownOpen(!isDistrictDropdownOpen); setDistrictSearchQuery(""); }} className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none transition-colors font-semibold text-foreground flex justify-between items-center cursor-pointer min-h-[36px]">
                            <span>{district}</span>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground/60 transition-transform ${isDistrictDropdownOpen ? 'rotate-180' : ''}`} />
                         </div>
                         {isDistrictDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsDistrictDropdownOpen(false)} />
                              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border max-h-80 overflow-hidden shadow-2xl flex flex-col rounded-md">
                                <div className="p-2 border-b border-border bg-background">
                                  <input type="text" autoFocus placeholder="Search division..." value={districtSearchQuery} onChange={(e) => setDistrictSearchQuery(e.target.value)} className="w-full bg-muted/20 text-foreground p-2 text-xs outline-none border border-border focus:border-primary transition-colors uppercase font-light" />
                                </div>
                                <div className="overflow-y-auto max-h-60">
                                  {DIVISIONS.filter(d => d.toLowerCase().includes(districtSearchQuery.toLowerCase())).map((d) => (
                                    <div key={d} onClick={() => { setDistrict(d); setCity(d); setIsDistrictDropdownOpen(false); setDistrictSearchQuery(""); }} className={`p-3 text-xs cursor-pointer transition-colors hover:bg-muted/40 uppercase font-light ${district === d ? 'bg-primary/20 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>{d}</div>
                                  ))}
                                </div>
                              </div>
                            </>
                         )}
                       </div>
                       <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
                         <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Area/Thana/Upazilla *</label>
                         <input type="text" required value={area} onChange={(e) => setArea(e.target.value)} placeholder="Enter Area / Thana / Upazila" className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none font-semibold text-foreground" />
                       </div>
                    </div>

                    <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
                      <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-3">Give The Full Address *</label>
                      <textarea required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Division / District / Upazila / Area / House No." className="w-full bg-black/20 border border-border/50 focus:border-primary p-3 text-sm focus:outline-none transition-colors font-semibold min-h-[80px] text-foreground rounded-md resize-y shadow-inner" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
                         <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">Select Effective Delivery *</label>
                         <div className="flex items-center gap-4 mt-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
                              <input type="radio" name="deliveryType" value="Home" checked={deliveryType === 'Home'} onChange={() => setDeliveryType('Home')} className="accent-primary w-4 h-4" /> Home
                            </label>
                            <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
                              <input type="radio" name="deliveryType" value="Office" checked={deliveryType === 'Office'} onChange={() => setDeliveryType('Office')} className="accent-primary w-4 h-4" /> Office
                            </label>
                         </div>
                       </div>
                       <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
                         <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-3">Details & Custom Request (Optional)</label>
                         <textarea value={customRequest} onChange={(e) => setCustomRequest(e.target.value)} placeholder="Any specific instructions..." className="w-full bg-black/20 border border-border/50 focus:border-primary p-3 text-sm focus:outline-none transition-colors font-semibold min-h-[80px] text-foreground rounded-md resize-y shadow-inner" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-card border border-border shadow-xl rounded-xl p-8 mt-8">
                  <h3 className="font-heading text-xl tracking-widest mb-6 text-foreground uppercase">{t.paymentDetails}</h3>
                  
                  <div className="space-y-6 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#E2136E]/10 border border-[#E2136E]/20 p-4 text-center">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">Send bKash Advance To</p>
                          <p className="text-2xl font-heading tracking-widest text-[#E2136E]">01852786645</p>
                        </div>
                        <div className="bg-[#ED1C24]/10 border border-[#ED1C24]/20 p-4 text-center">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">Send Nagad Advance To</p>
                          <p className="text-2xl font-heading tracking-widest text-[#ED1C24]">01710793841</p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 border border-border/50 p-5 bg-background/50">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="radio" name="checkoutAdvance" value={120} checked={advancePaid === 120} onChange={() => setAdvancePaid(120)} className="accent-primary w-4 h-4" />
                          <span className="font-semibold text-xs tracking-wider text-foreground">Delivery Charge Advance: 120 TK</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="radio" name="checkoutAdvance" value={400} checked={advancePaid === 400} onChange={() => setAdvancePaid(400)} className="accent-primary w-4 h-4" />
                          <span className="font-semibold text-xs tracking-wider text-foreground">Full Image Customization: 400 TK Advance</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="radio" name="checkoutAdvance" value="Custom" checked={advancePaid === 'Custom'} onChange={() => setAdvancePaid('Custom')} className="accent-primary w-4 h-4" />
                          <span className="font-semibold text-xs tracking-wider text-foreground">Custom Advance (Must be verified by Admin)</span>
                        </label>
                        {advancePaid === 'Custom' && (
                          <div className="ml-7 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                            <input
                              type="number"
                              min="1"
                              required
                              value={customAdvanceAmount}
                              onChange={(e) => setCustomAdvanceAmount(e.target.value)}
                              placeholder="Enter Custom Amount (BDT)"
                              className="w-full max-w-[200px] bg-background border border-border focus:border-primary px-3 py-2 text-xs focus:outline-none transition-colors uppercase font-light text-foreground"
                            />
                          </div>
                        )}
                      </div>

                      <div className="bg-background border border-border/50 shadow-inner p-4 rounded-lg">
                        <label className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase block mb-2">{t.trxId}</label>
                        <input
                          type="text"
                          required
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder={t.trxIdPh}
                          className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none transition-colors font-semibold text-foreground"
                        />
                      </div>

                      <p className="text-[10px] text-primary/80 leading-relaxed font-semibold uppercase tracking-wider">
                        {t.codNotice}
                      </p>
                    </div>

                  <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground font-light">
                    <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                    {t.securePaymentText}
                  </div>
                </div>

              </div>

              {/* Right Column: Summary Panel */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* Coupon Code Section */}
                <div className="bg-card border border-border shadow-xl rounded-xl p-8">
                  <h3 className="font-heading text-xl tracking-widest mb-6 text-foreground uppercase">{t.discountCode}</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.enterCode}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-background border border-border focus:border-primary px-4 py-2 text-xs focus:outline-none transition-colors uppercase tracking-wider font-light"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-primary text-primary-foreground hover:bg-accent px-4 py-2 text-xs font-heading tracking-widest font-bold transition-all"
                    >
                      {t.apply}
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 mt-2 font-medium">{couponError}</p>}
                  {couponSuccess && <p className="text-[10px] text-primary mt-2 font-medium">{couponSuccess}</p>}
                </div>

                {/* Cart summary list */}
                <div className="bg-card border border-border shadow-xl rounded-xl p-8 mt-8">
                  <h3 className="font-heading text-xl tracking-widest mb-6 text-foreground uppercase">{t.orderSummary}</h3>
                  
                  <div className="space-y-4 max-h-[240px] overflow-y-auto pr-2 mb-6">
                    {cartItems.map((item) => (
                      <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`} className="flex gap-4 border-b border-border/20 pb-3">
                        <div className="h-14 w-11 bg-neutral-900 border border-border flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading text-xs tracking-wide text-foreground light-mode:text-foreground truncate">{item.product.name}</h4>
                          <div className="flex items-center justify-between mt-0.5 pr-2">
                            <p className="text-[9px] text-muted-foreground uppercase font-light">{item.selectedSize} | {item.selectedColor.name}</p>
                            <div className="flex items-center border border-border/60">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity - 1)}
                                className="px-1.5 py-0.5 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-[10px] w-4 text-center font-semibold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity + 1)}
                                className="px-1.5 py-0.5 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-primary block mt-1">৳{(item.product.price * item.quantity).toLocaleString()} BDT</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="border-t border-border/60 pt-4 space-y-2.5 text-xs">
                    <div className="flex justify-between text-muted-foreground font-light">
                      <span>{t.itemsTotal}:</span>
                      <span className="text-foreground font-normal">৳{subtotal.toLocaleString()} BDT</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-primary font-medium">
                        <span className="flex items-center gap-1"><Ticket className="h-3.5 w-3.5" /> {t.discount} ({appliedDiscount}%):</span>
                        <span>- ৳{discountAmount.toLocaleString()} BDT</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground font-light">
                      <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> {t.shippingFee} ({district}):</span>
                      <span className="text-foreground font-normal">৳{shippingCost} BDT</span>
                    </div>
                    
                    <div className="flex justify-between text-sm font-semibold border-t border-border/60 pt-4 text-foreground light-mode:text-foreground">
                      <span>{t.orderTotal}:</span>
                      <span className="text-primary text-base">৳{totalAmount.toLocaleString()} BDT</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 text-xs font-heading tracking-widest font-bold transition-all mt-8 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        {t.processingPayment}
                      </>
                    ) : (
                      <>
                        {t.placeOrder} <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="mt-4 text-center">
                    <Link href="/shop" className="text-[10px] tracking-wider text-muted-foreground hover:text-primary transition-colors underline uppercase font-light">
                      &larr; {t.backToShopping}
                    </Link>
                  </div>
                </div>

              </div>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
