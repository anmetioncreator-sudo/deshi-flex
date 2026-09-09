"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore, useAdminStore } from "@/store";
import { User, Lock, ShieldCheck, UserCheck, ArrowRight, ShieldAlert, KeyRound, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"customer" | "admin">("customer");
  const [customerMode, setCustomerMode] = useState<"login" | "signup">("login");

  // Customer Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customerMsg, setCustomerMsg] = useState("");

  // Admin Form State
  const [adminUsername, setAdminUsername] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [adminError, setAdminError] = useState("");

  const userLogin = useUserStore((state) => state.login);
  const currentUser = useUserStore((state) => state.user);
  const isCustomerLoggedIn = useUserStore((state) => state.isLoggedIn);
  const customerLogout = useUserStore((state) => state.logout);

  const adminLogin = useAdminStore((state) => state.login);

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerMsg("");

    if (!email) {
      setCustomerMsg("Please provide a valid email address.");
      return;
    }

    const displayName = name.trim() || email.split("@")[0];
    userLogin(displayName, email, phone);
    setCustomerMsg("Welcome back! You are now logged in.");

    setTimeout(() => {
      router.push("/shop");
    }, 1200);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");

    const success = adminLogin(adminUsername, adminCode);
    if (success) {
      router.push("/admin");
    } else {
      setAdminError("Invalid Admin Username or Access Code.");
    }
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
            𝐃𝐄𝐒𝐇𝐈 𝐅𝐋𝐄𝐗 <span className="text-primary">PORTAL</span>
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mt-2 font-bold">
            Wear Your Culture • Flex Your Style
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-card border border-border p-1 rounded-xl mb-6 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab("customer")}
            className={`py-3 text-xs font-heading tracking-widest uppercase font-bold transition-all rounded-lg flex items-center justify-center gap-2 ${
              activeTab === "customer"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="h-4 w-4" /> Customer Access
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={`py-3 text-xs font-heading tracking-widest uppercase font-bold transition-all rounded-lg flex items-center justify-center gap-2 ${
              activeTab === "admin"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="h-4 w-4" /> Admin Portal
          </button>
        </div>

        {/* CUSTOMER TAB */}
        {activeTab === "customer" && (
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
                </div>
                <div className="pt-4 flex flex-col gap-3">
                  <Link
                    href="/shop"
                    className="w-full bg-primary text-primary-foreground hover:bg-accent py-3.5 text-xs font-heading tracking-widest font-bold transition-all rounded-lg text-center shadow-lg"
                  >
                    Go To Storefront
                  </Link>
                  <button
                    onClick={customerLogout}
                    className="w-full border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground py-3 text-xs tracking-widest uppercase transition-all rounded-lg"
                  >
                    Sign Out Account
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {customerMode === "login" ? "Sign In to Your Account" : "Create New Account"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomerMode(customerMode === "login" ? "signup" : "login")}
                    className="text-[11px] text-primary hover:underline font-bold uppercase tracking-wider"
                  >
                    {customerMode === "login" ? "+ Create Account" : "Already have account?"}
                  </button>
                </div>

                {customerMsg && (
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-xs font-bold text-primary flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    {customerMsg}
                  </div>
                )}

                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  {customerMode === "signup" && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
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
                      placeholder="customer@example.com"
                      className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 text-xs font-heading tracking-widest font-bold transition-all rounded-lg shadow-lg flex items-center justify-center gap-2 mt-6"
                  >
                    {customerMode === "login" ? "SIGN IN ACCOUNT" : "REGISTER ACCOUNT"} <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === "admin" && (
          <form onSubmit={handleAdminSubmit} className="bg-card border border-border p-8 rounded-2xl shadow-2xl space-y-5">
            <div className="border-b border-border/40 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Authorized Personnel Access
              </span>
            </div>

            {adminError && (
              <div className="bg-red-950/50 border border-red-500/50 p-4 rounded-lg flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                {adminError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">
                  Admin Username
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="owner / admin"
                  className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">
                  Access Code
                </label>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="******"
                  className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors tracking-[0.3em] font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 text-xs font-heading tracking-widest font-bold transition-all rounded-lg shadow-lg mt-6"
            >
              SECURE ADMIN LOGIN
            </button>
          </form>
        )}

        {/* Return link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-[11px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] font-medium">
            ← Return to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
