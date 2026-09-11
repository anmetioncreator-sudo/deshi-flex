"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store";
import {
  ShieldAlert,
  KeyRound,
  Lock,
  ArrowRight,
  Mail,
  RotateCw,
  Loader2,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import Link from "next/link";

export default function VaultLogin() {
  const [authMethod, setAuthMethod] = useState<"cipher" | "otp">("cipher");

  // Passcode Form State
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");

  // Email OTP State
  const [adminEmail, setAdminEmail] = useState("deshiflex12@gmail.com");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Status & Notifications
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const login = useAdminStore((state) => state.login);
  const loginWithOtp = useAdminStore((state) => state.loginWithOtp);

  // Handle Cooldown Timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Standard Username + Passcode Login
  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const result = await login(username.trim(), code);
      if (result.success) {
        router.push("/df-control-vault");
      } else {
        setError(result.error || "Invalid Credentials or Unauthorized Key.");
      }
    } catch {
      setError("Network or server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dispatch OTP via Resend
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!adminEmail || !adminEmail.includes("@")) {
      setError("Valid administrator email required.");
      return;
    }

    setIsSendingOtp(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail.trim(), purpose: "admin_login" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setCooldown(45);
        setSuccessMsg(`Vault access code dispatched to ${adminEmail.trim()} via Resend.`);
      } else {
        setError(data.error || "Failed to dispatch administrator security code.");
      }
    } catch {
      setError("Network failure while requesting security code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP for Vault Access
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otpCode || otpCode.trim().length < 6) {
      setError("Please enter the 6-digit administrator verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginWithOtp(adminEmail.trim(), otpCode.trim());
      if (result.success) {
        setSuccessMsg("Cipher confirmed. Granting vault clearance...");
        setTimeout(() => {
          router.push("/df-control-vault");
        }, 800);
      } else {
        setError(result.error || "Verification code invalid or expired.");
      }
    } catch {
      setError("Authentication handshake failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 flex flex-col items-center justify-center bg-black text-white selection:bg-white selection:text-black relative overflow-hidden font-sans">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-16 w-16 bg-neutral-900 border border-neutral-700 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
            <Lock className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-bebas text-3xl sm:text-4xl tracking-widest uppercase">
            CONTROL VAULT <span className="text-neutral-400">ACCESS</span>
          </h1>
          <p className="text-[10px] text-neutral-400 font-mono tracking-[0.25em] uppercase mt-2">
            Restricted Operations Gate • Encrypted Auth
          </p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl shadow-2xl space-y-5">
          {/* Header Bar */}
          <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2 font-mono">
              <KeyRound className="h-4 w-4 text-white" /> Security Handshake
            </span>
            <span className="text-[10px] font-mono text-neutral-400">AES / RESEND OTP</span>
          </div>

          {/* Authentication Mode Switcher */}
          <div className="flex items-center gap-2 p-1 bg-neutral-900 rounded-lg text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("cipher");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMethod === "cipher"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Passcode Cipher</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("otp");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMethod === "otp"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Security Email OTP</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-950/40 border border-red-800/60 p-4 rounded-lg flex items-center gap-3 text-red-300 text-xs font-mono font-bold tracking-wider">
              <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-lg flex items-center gap-3 text-emerald-300 text-xs font-mono font-bold tracking-wider">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* METHOD 1: STANDARD PASSCODE CIPHER */}
          {authMethod === "cipher" && (
            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 block font-mono">
                  Operator Identifier
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors font-mono text-white placeholder-neutral-600"
                  required
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 block font-mono">
                  Access Passcode
                </label>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors tracking-[0.2em] font-mono text-white placeholder-neutral-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-neutral-200 py-4 text-xs font-mono tracking-widest font-bold transition-all rounded-lg shadow-lg flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "VERIFYING CIPHER..." : "AUTHENTICATE VAULT"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* METHOD 2: RESEND EMAIL OTP */}
          {authMethod === "otp" && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 block font-mono">
                      Authorized Admin Email
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@deshiflex.com"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-white px-4 py-3 text-sm rounded-lg focus:outline-none transition-colors font-mono text-white placeholder-neutral-600"
                      required
                    />
                    <p className="text-[10px] text-neutral-500 font-mono mt-1">
                      Vault OTP is only delivered to registered operator emails.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full bg-white text-black hover:bg-neutral-200 py-4 text-xs font-mono tracking-widest font-bold transition-all rounded-lg shadow-lg flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> DISPATCHING CODE...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" /> DISPATCH VAULT ACCESS CODE
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block font-mono">Security OTP Dispatched To:</span>
                    <strong className="text-xs text-white font-mono">{adminEmail}</strong>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="block mx-auto text-[10px] text-neutral-400 hover:text-white underline mt-1 font-mono cursor-pointer"
                    >
                      Change Operator Email
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 block font-mono text-center">
                      Enter 6-Digit Vault Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••••"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-white px-4 py-3.5 text-xl font-mono text-center tracking-[0.4em] rounded-lg focus:outline-none transition-colors text-white"
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full bg-white text-black hover:bg-neutral-200 py-4 text-xs font-mono tracking-widest font-bold transition-all rounded-lg shadow-lg flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> VERIFYING ACCESS...
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" /> CONFIRM CLEARANCE
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1 font-mono">
                    <span className="text-neutral-500 text-[10px]">No transmission received?</span>
                    <button
                      type="button"
                      disabled={cooldown > 0 || isSendingOtp}
                      onClick={() => handleSendOtp()}
                      className="text-neutral-400 hover:text-white underline flex items-center gap-1 text-[10px] disabled:opacity-50 cursor-pointer"
                    >
                      <RotateCw className={`h-3 w-3 ${isSendingOtp ? "animate-spin" : ""}`} />
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-[11px] text-neutral-400 hover:text-white transition-colors uppercase tracking-[0.2em] font-mono"
          >
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
