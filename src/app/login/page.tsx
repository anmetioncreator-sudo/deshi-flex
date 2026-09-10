"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store";
import { User, ShieldCheck, UserCheck, ArrowRight, Sparkles, Package, LogOut, Heart } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [customerMode, setCustomerMode] = useState<"login" | "signup">("login");

  // Customer Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customerMsg, setCustomerMsg] = useState("");

  const userLogin = useUserStore((state) => state.login);
  const currentUser = useUserStore((state) => state.user);
  const isCustomerLoggedIn = useUserStore((state) => state.isLoggedIn);
  const customerLogout = useUserStore((state) => state.logout);

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
                  className="w-full bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Login vs Signup toggle */}
              <div className="flex border-b border-border pb-3 justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {customerMode === "login" ? "Sign In to Your Account" : "Create a Member Account"}
                </span>
                <button
                  type="button"
                  onClick={() => setCustomerMode(customerMode === "login" ? "signup" : "login")}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  {customerMode === "login" ? "New? Register" : "Have account? Login"}
                </button>
              </div>

              {customerMsg && (
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg text-primary text-xs font-semibold text-center flex items-center justify-center gap-2">
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
            </>
          )}
        </div>

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
