"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store";
import {
  User,
  ShieldCheck,
  ArrowRight,
  Package,
  LogOut,
  Heart,
  Mail,
  KeyRound,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  MapPin,
  Truck,
  ExternalLink,
  MessageSquare,
  Sparkles,
  X,
  Clock,
  Calendar,
  CreditCard,
  ChevronRight,
  Copy,
  Check,
  ShoppingBag,
  Shield,
  FileText,
} from "lucide-react";
import Link from "next/link";

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
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setErrorMsg(decodeURIComponent(errorParam));
    }

    if (googleAuth === "success" && googleEmail) {
      const displayName = googleName ? decodeURIComponent(googleName) : googleEmail.split("@")[0];
      userLogin(displayName, googleEmail);
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
        setCustomerMsg(`Verification code sent to ${email.trim()}! Check your inbox.`);
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
        userLogin(user.name, user.email, user.phone);
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="h-3.5 w-3.5" /> Delivered
        </span>
      );
    }
    if (s.includes("ship") || s.includes("route") || s.includes("transit")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <Truck className="h-3.5 w-3.5" /> In Transit
        </span>
      );
    }
    if (s.includes("confirm")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
          <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
        </span>
      );
    }
    if (s.includes("cancel")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
          <X className="h-3.5 w-3.5" /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
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
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 bg-background text-foreground relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. LOGGED-IN CUSTOMER PORTAL VIEW */}
      {/* ========================================================================= */}
      {isCustomerLoggedIn && currentUser ? (
        <div className="max-w-5xl w-full mx-auto relative z-10 space-y-8 animate-in fade-in duration-500">
          {/* PROFILE HERO HEADER CARD */}
          <div className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              {/* Left info: Avatar, Name, Email, VIP Badge */}
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent border-2 border-primary/40 flex items-center justify-center font-heading text-3xl font-black text-primary shadow-[0_0_30px_rgba(5,150,105,0.25)] shrink-0">
                  {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : "DF"}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-heading text-2xl sm:text-3xl tracking-wide uppercase text-foreground">
                      {currentUser.name || "Customer Member"}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/15 text-primary border border-primary/30 shadow-sm">
                      <Sparkles className="h-3 w-3" /> VIP Culture Member
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" /> {currentUser.email}
                  </p>
                  {currentUser.phone && (
                    <p className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-primary" /> {currentUser.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Right actions: Continue Shopping & Sign Out */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <Link
                  href="/shop"
                  className="flex-1 md:flex-initial bg-primary hover:bg-accent text-primary-foreground font-heading tracking-widest font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 text-xs uppercase"
                >
                  <ShoppingBag className="h-4 w-4" /> Continue Shopping
                </Link>
                <button
                  onClick={customerLogout}
                  className="bg-muted/60 hover:bg-red-500/10 border border-border hover:border-red-500/30 text-muted-foreground hover:text-red-400 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  title="Sign Out of Account"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>

            {/* STATS METRIC BAR */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border/60">
              {/* Stat 1: Total Orders */}
              <div className="bg-background/60 border border-border/80 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest">Total Orders</span>
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-black font-mono text-foreground">{totalOrdersCount}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Lifetime Streetwear Orders</div>
              </div>

              {/* Stat 2: Total Spent */}
              <div className="bg-background/60 border border-border/80 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest">Total Spent</span>
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-black font-mono text-foreground">{totalSpent.toLocaleString()} BDT</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Across All Checkouts</div>
              </div>

              {/* Stat 3: Active Orders */}
              <div className="bg-background/60 border border-border/80 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest">In Transit</span>
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-black font-mono text-foreground">{activeOrdersCount}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Active Deliveries</div>
              </div>

              {/* Stat 4: VIP Voucher */}
              <div className="bg-background/60 border border-primary/30 rounded-2xl p-4 transition-transform hover:-translate-y-0.5 relative group">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary">VIP Privilege</span>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-black font-mono text-primary">FLEXDROP</div>
                  <button
                    onClick={copyVoucherCode}
                    className="p-1.5 hover:bg-primary/20 rounded-lg text-primary transition-colors cursor-pointer"
                    title="Copy 15% VIP Coupon"
                  >
                    {copiedVoucher ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">15% Off Your First Order</div>
              </div>
            </div>
          </div>

          {/* DASHBOARD TABS */}
          <div className="flex border-b border-border space-x-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-3 px-4 text-xs font-heading tracking-widest uppercase font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                activeTab === "orders"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="h-4 w-4" /> Recent Orders ({totalOrdersCount})
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-3 px-4 text-xs font-heading tracking-widest uppercase font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" /> Profile &amp; Address
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`pb-3 px-4 text-xs font-heading tracking-widest uppercase font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                activeTab === "support"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-4 w-4" /> VIP Concierge Support
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: RECENT ORDERS */}
          {/* ========================================================================= */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {isLoadingOrders ? (
                <div className="space-y-4">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="h-44 bg-card/60 border border-border rounded-2xl animate-pulse p-6 space-y-4"
                    >
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="h-16 bg-muted/60 rounded-xl" />
                      <div className="h-8 bg-muted rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="bg-card/70 border border-border rounded-3xl p-12 text-center space-y-5">
                  <div className="h-16 w-16 bg-muted/60 border border-border rounded-2xl flex items-center justify-center mx-auto text-muted-foreground">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl tracking-wider uppercase text-foreground">
                      No Orders On Record
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                      You have not placed any orders yet with <strong className="text-foreground">{currentUser.email}</strong>. Once you checkout, your items, delivery progress, and Steadfast consignment code will be tracked right here.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-primary-foreground font-heading tracking-widest font-bold px-8 py-4 rounded-xl shadow-lg uppercase text-xs transition-all"
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
                        className="bg-card border border-border hover:border-primary/50 rounded-2xl p-5 sm:p-6 transition-all shadow-md hover:shadow-xl space-y-4"
                      >
                        {/* Order Top Bar: ID, Date, Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80">
                          <div className="flex items-center gap-3">
                            <div className="font-mono font-bold text-sm sm:text-base text-foreground flex items-center gap-1.5">
                              #{order.id}
                              <button
                                onClick={() => copyOrderId(order.id)}
                                className="text-muted-foreground hover:text-primary transition-colors p-1"
                                title="Copy Order ID"
                              >
                                {copiedOrderId === order.id ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {formatDate(order.date)}
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
                                  className="flex items-center justify-between gap-4 p-3 bg-muted/30 rounded-xl border border-border/50 text-xs"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-12 w-12 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                      {itemImg ? (
                                        <img src={itemImg} alt={itemName} className="h-full w-full object-cover" />
                                      ) : (
                                        <Package className="h-5 w-5 text-primary" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-bold text-foreground truncate">{itemName}</div>
                                      <div className="text-[11px] text-muted-foreground mt-0.5">
                                        Size: <strong className="text-foreground">{itemSize}</strong> • Qty:{" "}
                                        <strong className="text-foreground">{item.quantity}</strong>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="font-mono font-bold text-foreground">
                                      {(itemPrice * item.quantity).toLocaleString()} BDT
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-3 bg-muted/20 rounded-xl text-xs text-muted-foreground italic">
                              {order.description ? order.description.slice(0, 100) + "..." : "Custom Apparel Order"}
                            </div>
                          )}

                          {parsedItems.length > 3 && (
                            <p className="text-[11px] text-muted-foreground italic text-center">
                              +{parsedItems.length - 3} more item(s) in this package
                            </p>
                          )}
                        </div>

                        {/* Order Summary & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border/80">
                          <div className="text-xs space-y-1">
                            <div>
                              Total Value:{" "}
                              <strong className="font-mono text-sm text-foreground">
                                {totalVal.toLocaleString()} BDT
                              </strong>
                              {order.advancePaid > 0 && (
                                <span className="text-primary font-mono text-[11px] ml-2">
                                  (Paid: {order.advancePaid} BDT)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-amber-400 font-medium">
                              Payable on Delivery (COD):{" "}
                              <strong className="font-mono text-xs">{order.remainingBalance.toLocaleString()} BDT</strong>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5 text-primary" /> View Details
                            </button>
                            <Link
                              href={`/track-order?id=${order.id}`}
                              className="px-4 py-2.5 bg-primary hover:bg-accent text-primary-foreground rounded-xl text-xs font-heading font-bold uppercase tracking-widest transition-all shadow flex items-center gap-1.5"
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
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-heading text-xl uppercase tracking-wider text-foreground">
                  Saved Profile &amp; Shipping Details
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep your delivery address and phone updated so your streetwear reservations arrive without delay.
                </p>
              </div>

              {profileSaveSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Your profile and delivery preferences have been updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 block">
                    Email Address (Account Credential)
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full bg-muted/40 border border-border text-muted-foreground px-4 py-3 text-sm rounded-xl cursor-not-allowed font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Verified through one-time authentication code.
                  </span>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 block">
                    Contact Phone Number (For Courier Rider)
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 block">
                    Preferred Division / Region
                  </label>
                  <select
                    value={profileRegion}
                    onChange={(e) => setProfileRegion(e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors"
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
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 block">
                    Delivery Street Address
                  </label>
                  <textarea
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder="House number, road number, area, landmark..."
                    rows={3}
                    className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-primary hover:bg-accent text-primary-foreground font-heading tracking-widest font-bold px-8 py-3.5 rounded-xl text-xs uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg tracking-wider uppercase text-foreground">
                    Instant WhatsApp Concierge
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect directly with our Dhaka design &amp; fulfillment specialists for size advice, fabric GSM queries, or active dispatch status.
                  </p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-emerald-400" /> Active Hours: 10:00 AM – 11:00 PM Daily
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-emerald-400" /> Official Hotline: 01710793841
                  </div>
                </div>
                <a
                  href="https://wa.me/8801710793841?text=Hello%20Deshi%20Flex%20Concierge,%20I%20need%20assistance%20with%20my%20account."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-6 rounded-xl font-heading tracking-widest text-xs font-bold uppercase transition-all shadow-md"
                >
                  START WHATSAPP CHAT (01710793841) &rarr;
                </a>
              </div>

              {/* Delivery Guidelines */}
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg tracking-wider uppercase text-foreground">
                    Nationwide Logistics &amp; COD
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Delivered via Steadfast Courier Express across all 64 districts of Bangladesh.
                  </p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Dhaka Metro:</strong> 24 to 48 Hours home delivery.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Outside Dhaka:</strong> 3 to 5 business days nationwide.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Advance Confirmation:</strong> Nominal 120-300 BDT advance secures booking; balance is payable via Cash on Delivery.</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/faq"
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    View All Customer Policies &amp; Sizing Charts &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ORDER DETAILS MODAL */}
          {/* ========================================================================= */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <div
                className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 relative space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                      Order Breakdown
                    </span>
                    <h2 className="font-heading text-2xl uppercase tracking-wide text-foreground mt-0.5">
                      #{selectedOrder.id}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      Placed on {formatDate(selectedOrder.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedOrder.status)}
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase font-bold tracking-wider py-2">
                  <div className="p-2 bg-primary/10 border border-primary/30 rounded-xl text-primary">
                    1. Placed
                  </div>
                  <div className="p-2 bg-primary/10 border border-primary/30 rounded-xl text-primary">
                    2. Confirmed
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      selectedOrder.status.toLowerCase().includes("ship") ||
                      selectedOrder.status.toLowerCase().includes("deliv")
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-muted/40 border-border text-muted-foreground"
                    }`}
                  >
                    3. Shipped
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      selectedOrder.status.toLowerCase().includes("deliv")
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-muted/40 border-border text-muted-foreground"
                    }`}
                  >
                    4. Delivered
                  </div>
                </div>

                {/* Itemized Table */}
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-2">
                    Reserved Apparel Items
                  </h4>
                  <div className="border border-border/80 rounded-2xl overflow-hidden divide-y divide-border/60">
                    {Array.isArray(selectedOrder.cartItems) && selectedOrder.cartItems.length > 0 ? (
                      selectedOrder.cartItems.map((item, idx) => {
                        const itemName = item.name || item.title || item.product?.name || "Deshi Flex Streetwear";
                        const itemSize = item.size || item.selectedSize || "Standard";
                        const itemPrice = item.price || item.product?.price || 0;
                        const itemImg = item.image || item.product?.images?.[0];

                        return (
                          <div key={idx} className="p-3.5 flex items-center justify-between gap-4 text-xs bg-muted/10">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                {itemImg ? (
                                  <img src={itemImg} alt={itemName} className="h-full w-full object-cover" />
                                ) : (
                                  <Package className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-foreground">{itemName}</div>
                                <div className="text-[11px] text-muted-foreground">
                                  Size: <strong className="text-foreground">{itemSize}</strong> • Qty:{" "}
                                  <strong className="text-foreground">{item.quantity}</strong>
                                </div>
                              </div>
                            </div>
                            <div className="font-mono font-bold text-foreground">
                              {(itemPrice * item.quantity).toLocaleString()} BDT
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-xs text-muted-foreground italic">
                        {selectedOrder.description || "Custom Order Details"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping & Payment Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Shipping Destination */}
                  <div className="p-4 bg-muted/20 border border-border/80 rounded-2xl space-y-2">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Shipping Address
                    </div>
                    <div className="font-bold text-foreground">{selectedOrder.fullName}</div>
                    <div className="text-muted-foreground">{selectedOrder.phone}</div>
                    <div className="text-muted-foreground">{selectedOrder.address}</div>
                    <div className="text-muted-foreground">Region: {selectedOrder.region}</div>
                    {selectedOrder.specialNotes && (
                      <div className="text-[11px] text-muted-foreground italic pt-1">
                        Note: &ldquo;{selectedOrder.specialNotes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Payment Breakdown */}
                  <div className="p-4 bg-muted/20 border border-border/80 rounded-2xl space-y-2">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5" /> Payment Split
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Total Valuation:</span>
                      <span className="font-mono font-bold text-foreground">
                        {(selectedOrder.advancePaid + selectedOrder.remainingBalance).toLocaleString()} BDT
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Advance Received:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        - {selectedOrder.advancePaid.toLocaleString()} BDT
                      </span>
                    </div>
                    {selectedOrder.trxId && (
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>TrxID:</span>
                        <span className="font-mono">{selectedOrder.trxId}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-amber-400 font-bold pt-2 border-t border-border/60">
                      <span>Payable on Handover:</span>
                      <span className="font-mono text-sm">
                        {selectedOrder.remainingBalance.toLocaleString()} BDT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                  <a
                    href={`https://wa.me/8801710793841?text=Hi%20Deshi%20Flex,%20I%20have%20a%20question%20regarding%20Order%20%23${selectedOrder.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Chat with Concierge About This Order
                  </a>

                  <Link
                    href={`/track-order?id=${selectedOrder.id}`}
                    className="bg-primary hover:bg-accent text-primary-foreground font-heading tracking-widest text-xs font-bold uppercase px-6 py-2.5 rounded-xl transition-all shadow"
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
        /* 2. SIGN IN & VERIFICATION VIEW (REDESIGNED LUXURY CODE THEME) */
        /* ========================================================================= */
        <div className="max-w-md w-full mx-auto relative z-10 animate-in fade-in duration-500">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="h-16 w-16 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(5,150,105,0.2)]">
              {otpSent ? (
                <ShieldCheck className="h-8 w-8 text-primary" />
              ) : (
                <User className="h-8 w-8 text-primary" />
              )}
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl tracking-widest uppercase text-foreground">
              DESHI FLEX <span className="text-primary">ACCOUNT</span>
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mt-2 font-bold">
              Wear Your Culture • Flex Your Style
            </p>
          </div>

          {/* SIGN IN / OTP CARD */}
          <div className="bg-card/95 border border-border/80 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl space-y-6">
            {/* Top Toggle (only if OTP not yet sent) */}
            {!otpSent && (
              <div className="flex border-b border-border pb-3 justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {customerMode === "login" ? "Sign In to Your Account" : "Create Member Account"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMode(customerMode === "login" ? "signup" : "login");
                    setErrorMsg("");
                    setCustomerMsg("");
                  }}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  {customerMode === "login" ? "New? Register" : "Have account? Login"}
                </button>
              </div>
            )}

            {/* Notification Alerts */}
            {customerMsg && (
              <div className="bg-primary/10 border border-primary/30 p-3.5 rounded-xl text-primary text-xs font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {customerMsg}
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl text-red-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* FORM CONTAINER */}
            <div>
              {!otpSent ? (
                /* STEP 1: ENTER EMAIL OR REGISTER */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {customerMode === "signup" && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full bg-background border border-border focus:border-primary px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-background border border-border focus:border-primary px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {customerMode === "signup" && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full bg-background border border-border focus:border-primary px-4 py-3.5 text-sm rounded-xl focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full bg-primary hover:bg-accent text-primary-foreground py-4 text-xs font-heading tracking-widest font-bold transition-all rounded-xl shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
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
                /* STEP 2: REDESIGNED LUXURY 6-DIGIT CODE ENTRY (WEBSITE THEME) */
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* Code destination indicator */}
                  <div className="text-center p-4 bg-muted/40 rounded-2xl border border-border/80 space-y-1">
                    <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">
                      Code Sent To
                    </span>
                    <strong className="text-sm text-primary font-mono block">{email}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpDigits(["", "", "", "", "", ""]);
                        setErrorMsg("");
                      }}
                      className="text-[11px] text-muted-foreground hover:text-primary underline mt-1 font-semibold cursor-pointer inline-block"
                    >
                      Wrong email? Change
                    </button>
                  </div>

                  {/* 6 Segmented PIN boxes */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3 block text-center">
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
                          className="w-11 h-14 sm:w-12 sm:h-16 text-2xl font-bold font-mono text-center rounded-xl bg-background border-2 border-border focus:border-primary focus:bg-background focus:shadow-[0_0_15px_rgba(5,150,105,0.3)] focus:outline-none transition-all"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    <div className="text-center mt-3">
                      <span className="text-[11px] text-muted-foreground">
                        Code expires in <strong className="text-foreground">10 minutes</strong>
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpDigits.join("").length < 6}
                    className="w-full bg-primary hover:bg-accent text-primary-foreground py-4 text-xs font-heading tracking-widest font-bold transition-all rounded-xl shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                    <span className="text-muted-foreground text-[11px]">Didn&apos;t get the email?</span>
                    <button
                      type="button"
                      disabled={cooldown > 0 || isSendingOtp}
                      onClick={() => handleSendOtp()}
                      className="text-primary hover:underline font-semibold flex items-center gap-1.5 text-[11px] disabled:opacity-50 cursor-pointer"
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
                  <div className="border-t border-border w-full" />
                  <span className="bg-card px-3 text-[10px] uppercase tracking-widest text-muted-foreground font-mono font-bold shrink-0">
                    Or with Google
                  </span>
                  <div className="border-t border-border w-full" />
                </div>

                <div>
                  <a
                    href="/api/auth/google"
                    className="w-full bg-background hover:bg-muted/80 border border-border hover:border-primary/60 text-foreground py-3.5 px-4 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-3 transition-all shadow-sm group cursor-pointer"
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
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] font-medium"
            >
              ← Return to Storefront
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-background text-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
