"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store";
import {
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Package,
  LogOut,
  Heart,
  Mail,
  KeyRound,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customerMode, setCustomerMode] = useState<"login" | "signup">("login");
  const [authMethod, setAuthMethod] = useState<"otp" | "direct">("otp");

  // Customer Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // OTP State
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [simulatedNotice, setSimulatedNotice] = useState(false);

  // Status & Notifications
  const [customerMsg, setCustomerMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const userLogin = useUserStore((state) => state.login);
  const currentUser = useUserStore((state) => state.user);
  const isCustomerLoggedIn = useUserStore((state) => state.isLoggedIn);
  const customerLogout = useUserStore((state) => state.logout);

  // Handle Google OAuth Redirects & URL Query Parameters
  useEffect(() => {
    const googleAuth = searchParams.get("google_auth");
    const googleName = searchParams.get("name");
    const googleEmail = searchParams.get("email");
    const googleStatus = searchParams.get("google_status");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setErrorMsg(decodeURIComponent(errorParam));
    }

    if (googleAuth === "success" && googleEmail) {
      const displayName = googleName ? decodeURIComponent(googleName) : googleEmail.split("@")[0];
      userLogin(displayName, googleEmail);
      setCustomerMsg(`Signed in with Google as ${displayName}!`);
      setTimeout(() => {
        router.push("/shop");
      }, 1200);
    } else if (googleStatus === "demo_ready") {
      setCustomerMsg("Google OAuth Preview: Connect live credentials in .env, or use 1-click sign in below.");
    }
  }, [searchParams, userLogin, router]);

  // Handle Resend Cooldown Timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Request 6-digit OTP code via Resend
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
        setCooldown(45); // 45-second cooldown before resend
        setSimulatedNotice(!!data.simulated);
        setCustomerMsg(`Verification code sent to ${email.trim()}! Check your inbox.`);
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

    if (!otpCode || otpCode.trim().length < 6) {
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
          code: otpCode.trim(),
          purpose: "customer_login",
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          isNewRegistration: customerMode === "signup",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const user = data.user;
        userLogin(user.name, user.email, user.phone);
        setCustomerMsg(data.message || "Verified! Welcome to Deshi Flex.");

        setTimeout(() => {
          router.push("/shop");
        }, 1200);
      } else {
        setErrorMsg(data.error || "Verification failed. Check your code and try again.");
      }
    } catch {
      setErrorMsg("Network error verifying code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Direct fast sign in without OTP (for dev / instant testing)
  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setCustomerMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }

    const displayName = name.trim() || email.split("@")[0];
    userLogin(displayName, email.trim(), phone.trim());
    setCustomerMsg("Signed in successfully! Redirecting...");

    setTimeout(() => {
      router.push("/shop");
    }, 1000);
  };

  // Demo Google 1-click test login
  const handleGoogleDemoLogin = () => {
    userLogin("Tanvir Flex (Google)", "tanvir.flex@gmail.com", "01711223344");
    setCustomerMsg("Welcome! Signed in with Google Account.");
    setTimeout(() => {
      router.push("/shop");
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-16 w-16 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(var(--color-primary),0.2)]">
            <User className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-widest uppercase">
            𝐃𝐄𝐒𝐇𝐈 𝐅𝐋𝐄𝐗 <span className="text-primary">ACCOUNT</span>
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mt-2 font-bold">
            Wear Your Culture • Flex Your Style
          </p>
        </div>

        {/* CUSTOMER PORTAL */}
        <div className="bg-card border border-border p-8 rounded-2xl shadow-2xl space-y-6">
          {isCustomerLoggedIn && currentUser ? (
            <div className="text-center space-y-5 py-4">
              <div className="h-14 w-14 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-heading tracking-wider">Logged In As</h3>
                <p className="text-sm font-semibold text-primary mt-1">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                {currentUser.phone && (
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{currentUser.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/track-order"
                  className="bg-muted hover:bg-muted/80 text-foreground py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-border transition-colors"
                >
                  <Package className="h-4 w-4 text-primary" /> My Orders
                </Link>
                <Link
                  href="/shop?wishlist=true"
                  className="bg-muted hover:bg-muted/80 text-foreground py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-border transition-colors"
                >
                  <Heart className="h-4 w-4 text-primary" /> Wishlist
                </Link>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link
                  href="/shop"
                  className="w-full bg-primary text-primary-foreground hover:bg-accent py-3.5 text-xs font-heading tracking-widest font-bold transition-all rounded-lg shadow-md flex items-center justify-center gap-2"
                >
                  CONTINUE SHOPPING <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={customerLogout}
                  className="w-full bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* GOOGLE SIGN IN BUTTON */}
              <div>
                <a
                  href="/api/auth/google"
                  className="w-full bg-background hover:bg-muted/80 border border-border hover:border-primary/60 text-foreground py-3.5 px-4 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-3 transition-all shadow-sm group cursor-pointer"
                >
                  {/* Official Google G Logo */}
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

                {/* Google Demo Quick-Test Shortcut */}
                {searchParams.get("google_status") === "demo_ready" && (
                  <div className="mt-2.5 p-3 rounded-lg border border-primary/30 bg-primary/5 text-center">
                    <p className="text-[11px] text-muted-foreground mb-2">
                      Google OAuth Preview Mode active
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleDemoLogin}
                      className="text-[11px] text-primary hover:underline font-bold uppercase tracking-wider"
                    >
                      Click to Test with Instant Google Profile &rarr;
                    </button>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-border w-full" />
                <span className="bg-card px-3 text-[10px] uppercase tracking-widest text-muted-foreground font-mono font-bold shrink-0">
                  Or with Email
                </span>
                <div className="border-t border-border w-full" />
              </div>

              {/* Login vs Signup toggle */}
              <div className="flex border-b border-border pb-3 justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {customerMode === "login" ? "Sign In to Your Account" : "Create a Member Account"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMode(customerMode === "login" ? "signup" : "login");
                    setOtpSent(false);
                    setOtpCode("");
                    setErrorMsg("");
                    setCustomerMsg("");
                  }}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  {customerMode === "login" ? "New? Register" : "Have account? Login"}
                </button>
              </div>

              {/* Auth Mode Tabs (Email OTP via Resend vs Quick Local) */}
              <div className="flex items-center gap-2 p-1 bg-muted/60 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMethod("otp")}
                  className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === "otp"
                      ? "bg-background text-foreground shadow-sm font-bold border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>Resend Email OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod("direct")}
                  className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === "direct"
                      ? "bg-background text-foreground shadow-sm font-bold border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Direct Sign In</span>
                </button>
              </div>

              {/* Alerts */}
              {customerMsg && (
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg text-primary text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {customerMsg}
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {simulatedNotice && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg text-[11px] text-amber-300">
                  ⚡ <strong>Notice:</strong> Running in Resend Simulation Mode. Set <code>RESEND_API_KEY</code> in <code>.env</code> for live inbox delivery.
                </div>
              )}

              {/* METHOD 1: RESEND EMAIL OTP */}
              {authMethod === "otp" && (
                <div className="space-y-4">
                  {!otpSent ? (
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
                            className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
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
                          className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
                          required
                        />
                      </div>

                      {customerMode === "signup" && (
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="017XXXXXXXX"
                            className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors font-mono"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 text-xs font-heading tracking-widest font-bold transition-all rounded-lg shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
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
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="text-center p-3 bg-muted/40 rounded-xl border border-border/80">
                        <span className="text-[11px] text-muted-foreground block">Code sent to</span>
                        <strong className="text-xs text-foreground font-mono">{email}</strong>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="block mx-auto text-[10px] text-primary hover:underline mt-1 font-semibold"
                        >
                          Change Email Address
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block text-center">
                          Enter 6-Digit Verification Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="••••••"
                          className="w-full bg-background border border-border focus:border-primary px-4 py-3.5 text-xl font-mono text-center tracking-[0.4em] rounded-lg focus:outline-none transition-colors"
                          required
                          autoFocus
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifyingOtp || otpCode.length < 6}
                        className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 text-xs font-heading tracking-widest font-bold transition-all rounded-lg shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
                      >
                        {isVerifyingOtp ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> VERIFYING CODE...
                          </>
                        ) : (
                          <>
                            <KeyRound className="h-4 w-4" /> VERIFY & SIGN IN
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-muted-foreground text-[11px]">Didn&apos;t get the code?</span>
                        <button
                          type="button"
                          disabled={cooldown > 0 || isSendingOtp}
                          onClick={() => handleSendOtp()}
                          className="text-primary hover:underline font-semibold flex items-center gap-1 text-[11px] disabled:opacity-50 cursor-pointer"
                        >
                          <RotateCw className={`h-3 w-3 ${isSendingOtp ? "animate-spin" : ""}`} />
                          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* METHOD 2: DIRECT FAST SIGN IN (PASSWORDLESS / DEV) */}
              {authMethod === "direct" && (
                <form onSubmit={handleDirectSubmit} className="space-y-4">
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
                        className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
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
                      className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">
                      Phone Number {customerMode === "login" && "(Optional)"}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors font-mono"
                      required={customerMode === "signup"}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 text-xs font-heading tracking-widest font-bold transition-all rounded-lg shadow-lg flex items-center justify-center gap-2 mt-6 cursor-pointer"
                  >
                    {customerMode === "login" ? "SIGN IN ACCOUNT" : "CREATE ACCOUNT"} <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
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
