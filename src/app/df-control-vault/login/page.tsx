"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store";
import { Shield, ShieldAlert, KeyRound, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function VaultLogin() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAdminStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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

        <form onSubmit={handleSubmit} className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl shadow-2xl space-y-5">
          <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2 font-mono">
              <KeyRound className="h-4 w-4 text-white" /> Security Handshake
            </span>
            <span className="text-[10px] font-mono text-neutral-400">AES / HMAC</span>
          </div>

          {error && (
            <div className="bg-neutral-900 border border-neutral-700 p-4 rounded-lg flex items-center gap-3 text-white text-xs font-mono font-bold tracking-wider">
              <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-neutral-200 py-4 text-xs font-mono tracking-widest font-bold transition-all rounded-lg shadow-lg flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "VERIFYING CIPHER..." : "AUTHENTICATE VAULT"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[11px] text-neutral-400 hover:text-white transition-colors uppercase tracking-[0.2em] font-mono">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
