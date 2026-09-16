"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store";
import {
  User,
  ShieldCheck,
  Package,
  LogOut,
  Mail,
  KeyRound,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  MapPin,
  Truck,
  MessageSquare,
  Sparkles,
  X,
  Clock,
  Calendar,
  CreditCard,
  Copy,
  Check,
  ShoppingBag,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface OrderItem {
  id?: string;
  name?: string;
  title?: string;
  size?: string;
  selectedSize?: string;
  color?: string | { name: string; hex: string };
  selectedColor?: { name: string; hex: string };
  quantity: number;
  price: number;
  image?: string;
  product?: {
    id: string;
    name: string;
    images?: string[];
    price?: number;
  };
}

interface CustomerOrder {
  id: string;
  date: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  advancePaid: number;
  remainingBalance: number;
  status: string;
  trxId?: string;
  specialNotes?: string;
  cartItems?: OrderItem[];
  description?: string;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "login" | "signup"
  const [customerMode, setCustomerMode] = useState<"login" | "signup">("login");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // OTP State (6 individual digit inputs)
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Notifications
  const [customerMsg, setCustomerMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Customer Dashboard State
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "support">("orders");
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // Profile Edit State
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileRegion, setProfileRegion] = useState("Dhaka");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const userLogin = useUserStore((state) => state.login);
  const updateUser = useUserStore((state) => state.updateUser);
  const currentUser = useUserStore((state) => state.user);
  const isCustomerLoggedIn = useUserStore((state) => state.isLoggedIn);
  const customerLogout = useUserStore((state) => state.logout);
  const syncAdminStatus = useUserStore((state) => state.syncAdminStatus);

  // Sync admin clearance from database when logged in
  useEffect(() => {
    if (isCustomerLoggedIn && currentUser?.email) {
      syncAdminStatus();
    }
  }, [isCustomerLoggedIn, currentUser?.email, syncAdminStatus]);

  // Populate profile fields when user is logged in
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || "");
      setProfilePhone(currentUser.phone || "");
      setProfileAddress(currentUser.address || "");
      setProfileRegion(currentUser.region || "Dhaka");
    }
  }, [currentUser]);

  // Fetch Customer Orders when logged in
  useEffect(() => {
    if (!isCustomerLoggedIn || !currentUser?.email) return;

    let isMounted = true;
    setIsLoadingOrders(true);

    const fetchOrders = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("email", currentUser.email);
        if (currentUser.phone) {
          queryParams.set("phone", currentUser.phone);
        }

        const res = await fetch(`/api/orders?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();

        if (isMounted && data.success && Array.isArray(data.orders)) {
          setCustomerOrders(data.orders);
        }
      } catch (err) {
        console.error("[Fetch Orders Error]", err);
      } finally {
        if (isMounted) setIsLoadingOrders(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [isCustomerLoggedIn, currentUser?.email, currentUser?.phone]);

  // Handle Google OAuth Redirects & URL Query Parameters
  useEffect(() => {
    const googleAuth = searchParams.get("google_auth");
    const googleName = searchParams.get("name");
    const googleEmail = searchParams.get("email");
    const googleRole = searchParams.get("role") || "customer";
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setErrorMsg(decodeURIComponent(errorParam));
    }

    if (googleAuth === "success" && googleEmail) {
      const displayName = googleName ? decodeURIComponent(googleName) : googleEmail.split("@")[0];
      userLogin(displayName, googleEmail, undefined, googleRole);
      setCustomerMsg(`Signed in with Google as ${displayName}!`);
    }
  }, [searchParams, userLogin]);

  // Handle Cooldown Timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle OTP digit input changes with auto-advance & backspace
  const handleDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

    // Single digit entry
    const char = cleanValue.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (index < 5 && char) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || "";
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pastedData.length, 5);
    otpInputsRef.current[nextIndex]?.focus();
  };

  // Request 6-digit OTP code via email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setCustomerMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please provide a valid email address to receive your verification code.");
      return;
    }

    if (customerMode === "signup" && !name.trim()) {
      setErrorMsg("Please enter your name to register.");
      return;
    }

    setIsSendingOtp(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), purpose: "customer_login" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setCooldown(45);
        setOtpDigits(["", "", "", "", "", ""]);
        if (data.challengeToken) {
          setChallengeToken(data.challengeToken);
        }
        setCustomerMsg(`Verification code dispatched to ${email.trim()}! Check your inbox.`);
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 200);
      } else {
        setErrorMsg(data.error || "Failed to dispatch verification email.");
      }
    } catch {
      setErrorMsg("Network error connecting to email dispatch server.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify entered OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setCustomerMsg("");

    const fullCode = otpDigits.join("").trim();
    if (fullCode.length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: fullCode,
          purpose: "customer_login",
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          isNewRegistration: customerMode === "signup",
          challengeToken: challengeToken || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const user = data.user;
        userLogin(user.name, user.email, user.phone, user.role, user.id);
        setCustomerMsg(data.message || "Verified! Welcome to Deshi Flex.");
      } else {
        setErrorMsg(data.error || "Verification failed. Check your code and try again.");
      }
    } catch {
      setErrorMsg("Network error verifying code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Save profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    updateUser({
      name: profileName.trim(),
      phone: profilePhone.trim(),
      address: profileAddress.trim(),
      region: profileRegion.trim(),
    });

    setTimeout(() => {
      setIsSavingProfile(false);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    }, 400);
  };

  const copyVoucherCode = () => {
    navigator.clipboard.writeText("FLEXDROP");
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Status color pill helper
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-[0.2em] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="h-3.5 w-3.5" /> Delivered
        </span>
      );
    }
    if (s.includes("ship") || s.includes("route") || s.includes("transit")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-[0.2em] bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <Truck className="h-3.5 w-3.5" /> In Transit
        </span>
      );
    }
    if (s.includes("confirm")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-[0.2em] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
          <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
        </span>
      );
    }
    if (s.includes("cancel")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-[0.2em] bg-red-500/15 text-red-400 border border-red-500/30">
          <X className="h-3.5 w-3.5" /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-[0.2em] bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <Clock className="h-3.5 w-3.5" /> Pending Verification
      </span>
    );
  };

  // Metrics
  const totalOrdersCount = customerOrders.length;
  const totalSpent = customerOrders.reduce((sum, o) => sum + (o.advancePaid + o.remainingBalance), 0);
  const activeOrdersCount = customerOrders.filter(
    (o) => !o.status.toLowerCase().includes("delivered") && !o.status.toLowerCase().includes("cancel")
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden font-cinzel-roman">
      <Navbar />
      <main className="flex-1 py-10 px-4 sm:px-6 relative z-10">
        {/* Background luxury ambient glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] bg-white/[0.03] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/[0.05] rounded-full blur-[140px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. LOGGED-IN CUSTOMER PORTAL VIEW (HIGH LUXURY STREETWEAR THEME) */}
      {/* ========================================================================= */}
      {isCustomerLoggedIn && currentUser ? (
        <div className="max-w-5xl w-full mx-auto relative z-10 space-y-8 animate-in fade-in duration-500">
          {/* HIGH PRIORITY OPERATOR CLEARANCE ACTIVE BANNER */}
          {(currentUser.role === "admin" || currentUser.role === "owner") && (
            <div className="bg-gradient-to-r from-red-950/70 via-neutral-900/90 to-amber-950/70 border border-red-500/50 rounded-3xl p-6 sm:p-7 shadow-[0_0_40px_rgba(239,68,68,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden backdrop-blur-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500/30 to-rose-600/20 border border-red-500/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <ShieldCheck className="h-7 w-7 text-red-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                      OPERATOR CLEARANCE GRANTED
                    </span>
                    <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="font-cinzel-roman text-xs text-zinc-300 tracking-[0.1em] max-w-xl leading-relaxed">
                    This registered account (<strong className="text-white font-bold">{currentUser.email}</strong>) has administrator authorization. Enter the management vault directly without typing secret URLs.
                  </p>
                </div>
              </div>

              <Link
                href="/df-control-vault"
                className="w-full sm:w-auto font-cinzel font-bold text-xs tracking-[0.25em] uppercase rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-8 py-4 shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_40px_rgba(239,68,68,0.85)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 whitespace-nowrap relative z-10 shrink-0 cursor-pointer"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
                ENTER ADMIN DASHBOARD &rarr;
              </Link>
            </div>
          )}

          {/* PROFILE HERO HEADER CARD */}
          <div className="bg-card/90 border border-white/10 rounded-3xl p-6 sm:p-9 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              {/* Left info: Luxury Avatar, Customer Name, Email, VIP Badge */}
              <div className="flex items-center gap-5 sm:gap-6">
                <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/25 flex items-center justify-center font-cinzel text-2xl sm:text-3xl font-bold tracking-wider glowing-silver-text shadow-[0_0_35px_rgba(255,255,255,0.18)] shrink-0">
                  {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : "DF"}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-[0.22em] uppercase glowing-silver-text">
                      {currentUser.name || "Customer Member"}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-[0.25em] bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-emerald-500/20 text-amber-200 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <Sparkles className="h-3 w-3 text-amber-400" /> VIP Culture Member
                    </span>
                  </div>
                  <p className="font-cinzel-roman text-xs tracking-[0.14em] text-zinc-400 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" /> {currentUser.email}
                  </p>
                  {currentUser.phone && (
                    <p className="font-cinzel-roman text-xs tracking-[0.14em] text-zinc-400 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-zinc-400" /> {currentUser.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Right actions: Luxury Continue Shopping & Sign Out */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <Link
                  href="/shop"
                  className="flex-1 md:flex-initial font-cinzel font-bold text-xs tracking-[0.25em] uppercase rounded-full bg-gradient-to-r from-white via-zinc-100 to-zinc-300 text-black px-7 py-3.5 shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" /> Continue Shopping
                </Link>
                <button
                  onClick={customerLogout}
                  className="font-cinzel font-semibold text-xs tracking-[0.2em] uppercase rounded-full border border-white/20 hover:border-red-500/60 bg-white/5 hover:bg-red-500/10 text-zinc-300 hover:text-red-400 px-5 py-3.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  title="Sign Out of Account"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>

            {/* STATS METRIC BAR (LUXURY REGAL CARD SYSTEM) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-7 border-t border-white/10">
              {/* Stat 1: Total Orders */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 transition-all hover:border-white/30 hover:bg-black/60">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase">
                    Total Orders
                  </span>
                  <Package className="h-4 w-4 text-zinc-300" />
                </div>
                <div className="font-cinzel text-2xl sm:text-3xl font-bold tracking-[0.1em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                  {totalOrdersCount}
                </div>
                <div className="font-cinzel-roman text-[10px] sm:text-[11px] tracking-[0.14em] text-zinc-400 mt-1">
                  Lifetime Streetwear Orders
                </div>
              </div>

              {/* Stat 2: Total Spent */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 transition-all hover:border-white/30 hover:bg-black/60">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase">
                    Total Spent
                  </span>
                  <CreditCard className="h-4 w-4 text-zinc-300" />
                </div>
                <div className="font-cinzel text-2xl sm:text-3xl font-bold tracking-[0.1em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                  {totalSpent.toLocaleString()} BDT
                </div>
                <div className="font-cinzel-roman text-[10px] sm:text-[11px] tracking-[0.14em] text-zinc-400 mt-1">
                  Across All Checkouts
                </div>
              </div>

              {/* Stat 3: Active Deliveries */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 transition-all hover:border-white/30 hover:bg-black/60">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase">
                    In Transit
                  </span>
                  <Truck className="h-4 w-4 text-zinc-300" />
                </div>
                <div className="font-cinzel text-2xl sm:text-3xl font-bold tracking-[0.1em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                  {activeOrdersCount}
                </div>
                <div className="font-cinzel-roman text-[10px] sm:text-[11px] tracking-[0.14em] text-zinc-400 mt-1">
                  Active Deliveries
                </div>
              </div>

              {/* Stat 4: VIP Voucher */}
              <div className="bg-black/40 border border-white/20 rounded-2xl p-4.5 transition-all hover:border-amber-400/40 relative group">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-amber-200">
                    VIP Privilege
                  </span>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.2em] text-white glowing-silver-text">
                    FLEXDROP
                  </div>
                  <button
                    onClick={copyVoucherCode}
                    className="p-1.5 hover:bg-white/15 rounded-lg text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy 15% VIP Coupon"
                  >
                    {copiedVoucher ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="font-cinzel-roman text-[10px] sm:text-[11px] tracking-[0.14em] text-zinc-400 mt-1">
                  15% Off Your First Order
                </div>
              </div>
            </div>
          </div>

          {/* DASHBOARD TABS (LUXURY ROMAN TYPOGRAPHY) */}
          <div className="flex border-b border-white/10 space-x-3 sm:space-x-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-3.5 px-2 text-xs sm:text-sm font-cinzel tracking-[0.24em] uppercase font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "orders"
                  ? "border-white text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Package className="h-4 w-4" /> Recent Orders ({totalOrdersCount})
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-3.5 px-2 text-xs sm:text-sm font-cinzel tracking-[0.24em] uppercase font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "profile"
                  ? "border-white text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <User className="h-4 w-4" /> Profile &amp; Address
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`pb-3.5 px-2 text-xs sm:text-sm font-cinzel tracking-[0.24em] uppercase font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "support"
                  ? "border-white text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <MessageSquare className="h-4 w-4" /> VIP Concierge Support
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: RECENT ORDERS */}
          {/* ========================================================================= */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              {isLoadingOrders ? (
                <div className="space-y-4">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="h-44 bg-card/60 border border-white/10 rounded-3xl animate-pulse p-6 space-y-4"
                    >
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="h-16 bg-muted/60 rounded-xl" />
                      <div className="h-8 bg-muted rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : customerOrders.length === 0 ? (
                /* LUXURY EMPTY STATE */
                <div className="bg-card/70 border border-white/10 rounded-3xl p-12 sm:p-16 text-center space-y-6 shadow-2xl backdrop-blur-xl">
                  <div className="h-18 w-18 rounded-3xl bg-white/5 border border-white/15 flex items-center justify-center mx-auto text-zinc-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <Package className="h-9 w-9 text-zinc-200" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.28em] uppercase glowing-silver-text">
                      No Orders On Record
                    </h3>
                    <p className="font-cinzel-roman text-xs sm:text-sm tracking-[0.14em] text-zinc-300 max-w-lg mx-auto leading-relaxed">
                      You have not placed any orders yet with <strong className="text-white font-bold">{currentUser.email}</strong>. Once you checkout, your items, delivery progress, and Steadfast consignment code will be tracked right here.
                    </p>
                  </div>
                  <div className="pt-3">
                    <Link
                      href="/shop"
                      className="font-cinzel font-bold text-xs tracking-[0.28em] uppercase rounded-full bg-gradient-to-r from-white via-zinc-100 to-zinc-300 text-black px-10 py-4 shadow-[0_0_35px_rgba(255,255,255,0.5)] hover:shadow-[0_0_55px_rgba(255,255,255,0.85)] hover:scale-[1.03] transition-all inline-flex items-center gap-2"
                    >
                      EXPLORE THE LATEST DROPS &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map((order) => {
                    const totalVal = order.advancePaid + order.remainingBalance;
                    const parsedItems = Array.isArray(order.cartItems) ? order.cartItems : [];

                    return (
                      <div
                        key={order.id}
                        className="bg-card/90 border border-white/10 hover:border-white/30 rounded-3xl p-6 sm:p-7 transition-all shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-y-4 backdrop-blur-xl"
                      >
                        {/* Order Top Bar: ID, Date, Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-white/10">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="font-cinzel font-bold text-sm sm:text-base tracking-[0.18em] text-white flex items-center gap-1.5">
                              #{order.id}
                              <button
                                onClick={() => copyOrderId(order.id)}
                                className="text-zinc-400 hover:text-white transition-colors p-1"
                                title="Copy Order ID"
                              >
                                {copiedOrderId === order.id ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                            <span className="font-cinzel-roman text-xs tracking-[0.12em] text-zinc-400 flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" /> {formatDate(order.date)}
                            </span>
                          </div>

                          <div>{getStatusBadge(order.status)}</div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-2.5">
                          {parsedItems.length > 0 ? (
                            parsedItems.slice(0, 3).map((item, idx) => {
                              const itemName = item.name || item.title || item.product?.name || "Deshi Flex Streetwear";
                              const itemSize = item.size || item.selectedSize || "Standard";
                              const itemPrice = item.price || item.product?.price || 0;
                              const itemImg = item.image || item.product?.images?.[0];

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between gap-4 p-3.5 bg-black/40 rounded-2xl border border-white/5 text-xs"
                                >
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="h-12 w-12 rounded-xl bg-muted border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                      {itemImg ? (
                                        <img src={itemImg} alt={itemName} className="h-full w-full object-cover" />
                                      ) : (
                                        <Package className="h-5 w-5 text-zinc-300" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-cinzel font-bold text-sm tracking-[0.08em] text-white truncate">
                                        {itemName}
                                      </div>
                                      <div className="font-cinzel-roman text-[11px] tracking-[0.12em] text-zinc-400 mt-0.5">
                                        Size: <strong className="text-white font-bold">{itemSize}</strong> • Qty:{" "}
                                        <strong className="text-white font-bold">{item.quantity}</strong>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="font-cinzel font-bold text-sm tracking-[0.1em] text-white">
                                      {(itemPrice * item.quantity).toLocaleString()} BDT
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-3.5 bg-black/40 rounded-2xl text-xs font-cinzel-roman text-zinc-400 italic">
                              {order.description ? order.description.slice(0, 100) + "..." : "Custom Apparel Order"}
                            </div>
                          )}

                          {parsedItems.length > 3 && (
                            <p className="font-cinzel-roman text-[11px] tracking-[0.1em] text-zinc-400 italic text-center">
                              +{parsedItems.length - 3} more item(s) in this package
                            </p>
                          )}
                        </div>

                        {/* Order Summary & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-white/10">
                          <div className="space-y-1">
                            <div className="font-cinzel-roman text-xs tracking-[0.12em] text-zinc-300">
                              Total Value:{" "}
                              <strong className="font-cinzel text-sm sm:text-base font-bold text-white ml-1">
                                {totalVal.toLocaleString()} BDT
                              </strong>
                              {order.advancePaid > 0 && (
                                <span className="font-cinzel text-emerald-400 text-xs ml-2 font-bold">
                                  (Paid: {order.advancePaid} BDT)
                                </span>
                              )}
                            </div>
                            <div className="font-cinzel text-xs tracking-[0.12em] text-amber-300 font-bold">
                              Payable on Handover (COD):{" "}
                              <strong className="font-bold">{order.remainingBalance.toLocaleString()} BDT</strong>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="font-cinzel font-bold text-xs tracking-[0.2em] uppercase rounded-full px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" /> View Details
                            </button>
                            <Link
                              href={`/track-order?id=${order.id}`}
                              className="font-cinzel font-bold text-xs tracking-[0.22em] uppercase rounded-full px-5 py-2.5 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] transition-all flex items-center gap-1.5"
                            >
                              <Truck className="h-3.5 w-3.5" /> Track Live
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PROFILE & ADDRESS */}
          {/* ========================================================================= */}
          {activeTab === "profile" && (
            <div className="bg-card/90 border border-white/10 rounded-3xl p-6 sm:p-9 space-y-6 backdrop-blur-xl shadow-2xl">
              <div className="space-y-1">
                <h3 className="font-cinzel text-xl sm:text-2xl uppercase tracking-[0.24em] font-bold glowing-silver-text">
                  Saved Profile &amp; Shipping Details
                </h3>
                <p className="font-cinzel-roman text-xs tracking-[0.14em] text-zinc-400">
                  Keep your delivery address and contact phone updated so your streetwear reservations arrive without delay.
                </p>
              </div>

              {profileSaveSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-emerald-300 text-xs font-cinzel font-bold tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Your profile and delivery preferences have been updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
                <div>
                  <label className="font-cinzel text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400 mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/15 focus:border-white px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors font-cinzel-roman tracking-wider"
                  />
                </div>

                <div>
                  <label className="font-cinzel text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400 mb-1.5 block">
                    Email Address (Account Credential)
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full bg-white/5 border border-white/10 text-zinc-400 px-4 py-3.5 text-sm rounded-xl cursor-not-allowed font-mono"
                  />
                  <span className="font-cinzel-roman text-[10px] text-zinc-500 mt-1 block tracking-wider">
                    Verified through one-time authentication code.
                  </span>
                </div>

                <div>
                  <label className="font-cinzel text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400 mb-1.5 block">
                    Contact Phone Number (For Courier Rider)
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-black/40 border border-white/15 focus:border-white px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="font-cinzel text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400 mb-1.5 block">
                    Preferred Division / Region
                  </label>
                  <select
                    value={profileRegion}
                    onChange={(e) => setProfileRegion(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 focus:border-white px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors font-cinzel-roman tracking-wider"
                  >
                    <option value="Dhaka">Dhaka (24 - 48 Hours Delivery)</option>
                    <option value="Chittagong">Chittagong (3 - 5 Days Nationwide)</option>
                    <option value="Sylhet">Sylhet (3 - 5 Days Nationwide)</option>
                    <option value="Rajshahi">Rajshahi (3 - 5 Days Nationwide)</option>
                    <option value="Khulna">Khulna (3 - 5 Days Nationwide)</option>
                    <option value="Barisal">Barisal (3 - 5 Days Nationwide)</option>
                    <option value="Rangpur">Rangpur (3 - 5 Days Nationwide)</option>
                    <option value="Mymensingh">Mymensingh (3 - 5 Days Nationwide)</option>
                  </select>
                </div>

                <div>
                  <label className="font-cinzel text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400 mb-1.5 block">
                    Delivery Street Address
                  </label>
                  <textarea
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder="House number, road number, area, landmark..."
                    rows={3}
                    className="w-full bg-black/40 border border-white/15 focus:border-white px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors font-cinzel-roman tracking-wider"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="font-cinzel font-bold text-xs tracking-[0.25em] uppercase rounded-full bg-gradient-to-r from-white via-zinc-100 to-zinc-300 text-black px-9 py-4 shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> SAVING CHANGES...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> SAVE PROFILE DETAILS
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CONCIERGE & SUPPORT */}
          {/* ========================================================================= */}
          {activeTab === "support" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp Concierge */}
              <div className="bg-card/90 border border-white/10 rounded-3xl p-7 sm:p-9 space-y-5 backdrop-blur-xl shadow-2xl">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg sm:text-xl tracking-[0.22em] uppercase font-bold text-white">
                    Instant WhatsApp Concierge
                  </h3>
                  <p className="font-cinzel-roman text-xs tracking-[0.12em] text-zinc-400 mt-1.5 leading-relaxed">
                    Connect directly with our Dhaka streetwear &amp; fulfillment specialists for size advice, fabric GSM queries, or active dispatch status.
                  </p>
                </div>
                <div className="space-y-2 text-xs font-cinzel-roman tracking-wider">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="h-4 w-4 text-emerald-400" /> Active Hours: 10:00 AM – 11:00 PM Daily
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Phone className="h-4 w-4 text-emerald-400" /> Official Hotline: 01710793841
                  </div>
                </div>
                <a
                  href="https://wa.me/8801710793841?text=Hello%20Deshi%20Flex%20Concierge,%20I%20need%20assistance%20with%20my%20account."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-4 px-6 rounded-full font-cinzel tracking-[0.25em] text-xs font-bold uppercase transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                >
                  START WHATSAPP CHAT &rarr;
                </a>
              </div>

              {/* Delivery Guidelines */}
              <div className="bg-card/90 border border-white/10 rounded-3xl p-7 sm:p-9 space-y-5 backdrop-blur-xl shadow-2xl">
                <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                  <Truck className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg sm:text-xl tracking-[0.22em] uppercase font-bold text-white">
                    Nationwide Logistics &amp; COD
                  </h3>
                  <p className="font-cinzel-roman text-xs tracking-[0.12em] text-zinc-400 mt-1.5 leading-relaxed">
                    Dispatched via Steadfast Courier Express across all 64 districts of Bangladesh.
                  </p>
                </div>
                <ul className="text-xs font-cinzel-roman tracking-[0.12em] text-zinc-300 space-y-3">
                  <li className="flex items-start gap-2.5">
                    <span className="text-white font-bold">•</span>
                    <span><strong>Dhaka Metro:</strong> 24 to 48 Hours home delivery.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-white font-bold">•</span>
                    <span><strong>Outside Dhaka:</strong> 3 to 5 business days nationwide.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-white font-bold">•</span>
                    <span><strong>Advance Confirmation:</strong> Nominal 120-300 BDT advance secures booking; balance is payable via Cash on Delivery.</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/faq"
                    className="font-cinzel text-xs text-white hover:underline font-bold tracking-[0.2em] uppercase flex items-center gap-1"
                  >
                    View Sizing Charts &amp; Policies &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ORDER DETAILS MODAL (LUXURY REGAL STREETWEAR THEME) */}
          {/* ========================================================================= */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-200">
              <div
                className="bg-card border border-white/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] p-6 sm:p-8 relative space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="font-cinzel text-[10px] text-zinc-400 uppercase tracking-[0.25em] block">
                      Order Breakdown
                    </span>
                    <h2 className="font-cinzel text-2xl sm:text-3xl uppercase tracking-[0.2em] font-bold text-white glowing-silver-text mt-1">
                      #{selectedOrder.id}
                    </h2>
                    <span className="font-cinzel-roman text-xs tracking-[0.12em] text-zinc-400">
                      Placed on {formatDate(selectedOrder.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedOrder.status)}
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-4 gap-2 text-center font-cinzel text-[10px] uppercase font-bold tracking-[0.2em] py-2">
                  <div className="p-2.5 bg-white/10 border border-white/20 rounded-2xl text-white">
                    1. Placed
                  </div>
                  <div className="p-2.5 bg-white/10 border border-white/20 rounded-2xl text-white">
                    2. Confirmed
                  </div>
                  <div
                    className={`p-2.5 rounded-2xl border ${
                      selectedOrder.status.toLowerCase().includes("ship") ||
                      selectedOrder.status.toLowerCase().includes("deliv")
                        ? "bg-white/15 border-white/30 text-white"
                        : "bg-black/30 border-white/5 text-zinc-500"
                    }`}
                  >
                    3. Shipped
                  </div>
                  <div
                    className={`p-2.5 rounded-2xl border ${
                      selectedOrder.status.toLowerCase().includes("deliv")
                        ? "bg-white/15 border-white/30 text-white"
                        : "bg-black/30 border-white/5 text-zinc-500"
                    }`}
                  >
                    4. Delivered
                  </div>
                </div>

                {/* Itemized Table */}
                <div>
                  <h4 className="font-cinzel text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400 mb-2.5">
                    Reserved Streetwear Pieces
                  </h4>
                  <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                    {Array.isArray(selectedOrder.cartItems) && selectedOrder.cartItems.length > 0 ? (
                      selectedOrder.cartItems.map((item, idx) => {
                        const itemName = item.name || item.title || item.product?.name || "Deshi Flex Streetwear";
                        const itemSize = item.size || item.selectedSize || "Standard";
                        const itemPrice = item.price || item.product?.price || 0;
                        const itemImg = item.image || item.product?.images?.[0];

                        return (
                          <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs bg-black/30">
                            <div className="flex items-center gap-3.5">
                              <div className="h-12 w-12 rounded-xl bg-muted border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                {itemImg ? (
                                  <img src={itemImg} alt={itemName} className="h-full w-full object-cover" />
                                ) : (
                                  <Package className="h-5 w-5 text-zinc-300" />
                                )}
                              </div>
                              <div>
                                <div className="font-cinzel font-bold text-sm tracking-[0.08em] text-white">
                                  {itemName}
                                </div>
                                <div className="font-cinzel-roman text-[11px] tracking-[0.12em] text-zinc-400 mt-0.5">
                                  Size: <strong className="text-white font-bold">{itemSize}</strong> • Qty:{" "}
                                  <strong className="text-white font-bold">{item.quantity}</strong>
                                </div>
                              </div>
                            </div>
                            <div className="font-cinzel font-bold text-sm tracking-[0.1em] text-white">
                              {(itemPrice * item.quantity).toLocaleString()} BDT
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-xs font-cinzel-roman text-zinc-400 italic">
                        {selectedOrder.description || "Custom Order Details"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping & Payment Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Shipping Destination */}
                  <div className="p-4.5 bg-black/40 border border-white/10 rounded-2xl space-y-2">
                    <div className="font-cinzel text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-300 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-200" /> Shipping Address
                    </div>
                    <div className="font-cinzel font-bold text-sm text-white tracking-wider">
                      {selectedOrder.fullName}
                    </div>
                    <div className="font-cinzel-roman text-zinc-300 tracking-wider">{selectedOrder.phone}</div>
                    <div className="font-cinzel-roman text-zinc-400 tracking-wide">{selectedOrder.address}</div>
                    <div className="font-cinzel-roman text-zinc-400 tracking-wide">Region: {selectedOrder.region}</div>
                    {selectedOrder.specialNotes && (
                      <div className="font-cinzel-roman text-[11px] text-zinc-500 italic pt-1">
                        Note: &ldquo;{selectedOrder.specialNotes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Payment Breakdown */}
                  <div className="p-4.5 bg-black/40 border border-white/10 rounded-2xl space-y-2">
                    <div className="font-cinzel text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-300 flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-zinc-200" /> Payment Split
                    </div>
                    <div className="flex justify-between font-cinzel-roman text-zinc-400 tracking-wider">
                      <span>Total Valuation:</span>
                      <span className="font-cinzel font-bold text-white">
                        {(selectedOrder.advancePaid + selectedOrder.remainingBalance).toLocaleString()} BDT
                      </span>
                    </div>
                    <div className="flex justify-between font-cinzel-roman text-zinc-400 tracking-wider">
                      <span>Advance Received:</span>
                      <span className="font-cinzel font-bold text-emerald-400">
                        - {selectedOrder.advancePaid.toLocaleString()} BDT
                      </span>
                    </div>
                    {selectedOrder.trxId && (
                      <div className="flex justify-between font-cinzel-roman text-[11px] text-zinc-400 tracking-wider">
                        <span>TrxID:</span>
                        <span className="font-mono">{selectedOrder.trxId}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-cinzel text-amber-300 font-bold pt-2 border-t border-white/10 tracking-wider">
                      <span>Payable on Handover:</span>
                      <span className="text-sm">
                        {selectedOrder.remainingBalance.toLocaleString()} BDT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <a
                    href={`https://wa.me/8801710793841?text=Hi%20Deshi%20Flex,%20I%20have%20a%20question%20regarding%20Order%20%23${selectedOrder.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-cinzel text-xs text-zinc-300 hover:text-white font-bold tracking-[0.2em] uppercase flex items-center gap-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Order Support
                  </a>

                  <Link
                    href={`/track-order?id=${selectedOrder.id}`}
                    className="font-cinzel font-bold text-xs tracking-[0.24em] uppercase rounded-full bg-gradient-to-r from-white via-zinc-100 to-zinc-300 text-black px-7 py-3 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] transition-all"
                  >
                    OPEN LIVE TRACKER &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. SIGN IN & VERIFICATION VIEW (LUXURY REGAL THEME) */
        /* ========================================================================= */
        <div className="max-w-md w-full mx-auto relative z-10 animate-in fade-in duration-500">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-9 text-center">
            <div className="h-18 w-18 bg-white/5 border border-white/20 rounded-3xl flex items-center justify-center mb-4 shadow-[0_0_35px_rgba(255,255,255,0.15)]">
              {otpSent ? (
                <ShieldCheck className="h-8 w-8 text-white" />
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </div>
            <h1 className="font-cinzel text-3xl sm:text-5xl tracking-[0.32em] uppercase font-bold glowing-silver-text">
              DESHI FLEX ACCOUNT
            </h1>
            <p className="font-cinzel text-[10px] sm:text-xs text-zinc-400 tracking-[0.45em] uppercase mt-2.5 font-bold">
              Wear Your Culture • Flex Your Style
            </p>
          </div>

          {/* SIGN IN / OTP CARD */}
          <div className="bg-card/90 border border-white/15 p-7 sm:p-9 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl space-y-6">
            {/* Top Toggle (only if OTP not yet sent) */}
            {!otpSent && (
              <div className="flex border-b border-white/10 pb-3 justify-between items-center">
                <span className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-white">
                  {customerMode === "login" ? "Sign In to Account" : "Create Member Account"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMode(customerMode === "login" ? "signup" : "login");
                    setErrorMsg("");
                    setCustomerMsg("");
                  }}
                  className="font-cinzel text-xs text-zinc-300 hover:text-white font-bold tracking-[0.18em] uppercase underline cursor-pointer"
                >
                  {customerMode === "login" ? "New? Register" : "Have account? Login"}
                </button>
              </div>
            )}

            {/* Notification Alerts */}
            {customerMsg && (
              <div className="bg-white/10 border border-white/25 p-4 rounded-2xl text-white font-cinzel text-xs font-bold tracking-wider text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                {customerMsg}
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-300 font-cinzel text-xs font-bold tracking-wider text-center flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                {errorMsg}
              </div>
            )}

            {/* FORM CONTAINER */}
            <div>
              {!otpSent ? (
                /* STEP 1: ENTER EMAIL OR REGISTER */
                <form onSubmit={handleSendOtp} className="space-y-5">
                  {customerMode === "signup" && (
                    <div>
                      <label className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-bold mb-1.5 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full bg-black/40 border border-white/15 focus:border-white px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors font-cinzel-roman tracking-wider"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-bold mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-black/40 border border-white/15 focus:border-white px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors font-mono"
                      required
                    />
                  </div>

                  {customerMode === "signup" && (
                    <div>
                      <label className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-bold mb-1.5 block">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full bg-black/40 border border-white/15 focus:border-white px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full font-cinzel font-bold text-xs tracking-[0.25em] uppercase rounded-full bg-gradient-to-r from-white via-zinc-100 to-zinc-300 text-black py-4 shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> DISPATCHING CODE...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" /> SEND VERIFICATION CODE
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STEP 2: REDESIGNED LUXURY 6-DIGIT CODE ENTRY */
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* Code destination indicator */}
                  <div className="text-center p-4.5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                    <span className="font-cinzel text-[11px] text-zinc-400 uppercase font-bold tracking-[0.2em] block">
                      Code Dispatched To
                    </span>
                    <strong className="text-sm text-white font-mono block tracking-wider">{email}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpDigits(["", "", "", "", "", ""]);
                        setErrorMsg("");
                      }}
                      className="font-cinzel text-[11px] text-zinc-400 hover:text-white underline mt-1 font-bold tracking-wider cursor-pointer inline-block"
                    >
                      Wrong email? Change
                    </button>
                  </div>

                  {/* 6 Segmented PIN boxes */}
                  <div>
                    <label className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-bold mb-3.5 block text-center">
                      Enter 6-Digit Verification Code
                    </label>

                    <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handleDigitPaste}>
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputsRef.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                          className="w-11 h-14 sm:w-12 sm:h-16 text-2xl font-bold font-cinzel text-center rounded-2xl bg-black/50 border-2 border-white/15 focus:border-white focus:shadow-[0_0_20px_rgba(255,255,255,0.4)] focus:outline-none text-white transition-all"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    <div className="text-center mt-3.5">
                      <span className="font-cinzel-roman text-[11px] tracking-wider text-zinc-400">
                        Code valid for <strong className="text-white">10 minutes</strong>
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpDigits.join("").length < 6}
                    className="w-full font-cinzel font-bold text-xs tracking-[0.25em] uppercase rounded-full bg-gradient-to-r from-white via-zinc-100 to-zinc-300 text-black py-4 shadow-[0_0_30px_rgba(255,255,255,0.45)] hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> VERIFYING CODE...
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" /> VERIFY &amp; ACCESS ACCOUNT &rarr;
                      </>
                    )}
                  </button>

                  {/* Resend Cooldown */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                    <span className="font-cinzel-roman text-zinc-400 text-[11px] tracking-wider">Didn&apos;t get the code?</span>
                    <button
                      type="button"
                      disabled={cooldown > 0 || isSendingOtp}
                      onClick={() => handleSendOtp()}
                      className="font-cinzel text-zinc-300 hover:text-white font-bold tracking-[0.18em] uppercase flex items-center gap-1.5 text-[11px] disabled:opacity-50 cursor-pointer"
                    >
                      <RotateCw className={`h-3 w-3 ${isSendingOtp ? "animate-spin" : ""}`} />
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* OR GOOGLE SIGN IN (Only when not entering OTP) */}
            {!otpSent && (
              <>
                <div className="relative flex items-center justify-center pt-2">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-card px-3.5 font-cinzel text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-bold shrink-0">
                    Or with Google
                  </span>
                  <div className="border-t border-white/10 w-full" />
                </div>

                <div>
                  <a
                    href="/api/auth/google"
                    className="w-full bg-black/40 hover:bg-white/10 border border-white/15 hover:border-white text-white py-3.5 px-4 rounded-full font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all shadow-sm group cursor-pointer"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Return link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="font-cinzel text-[11px] text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.28em] font-bold"
            >
              ← Return to Storefront
            </Link>
          </div>
        </div>
      )}
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-background text-foreground">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
