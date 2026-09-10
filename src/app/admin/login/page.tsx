"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store";
import { Lock, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAdminStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(username, code);
    if (success) {
      router.push("/admin");
    } else {
      setError("Invalid Username or Access Code.");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center bg-background text-foreground">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-heading text-4xl tracking-widest uppercase">Admin Portal</h1>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-punk p-8 space-y-6">
          {error && (
            <div className="bg-neutral-900 border border-neutral-700 p-4 flex items-center gap-3 text-white text-xs font-mono uppercase tracking-wider font-bold rounded-lg">
              <ShieldAlert className="h-5 w-5 text-white flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Admin Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="owner / admin"
                className="w-full bg-card border border-border focus:border-primary px-4 py-3 text-sm focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Access Code</label>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="******"
                className="w-full bg-card border border-border focus:border-primary px-4 py-3 text-sm focus:outline-none transition-colors tracking-[0.3em]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 text-xs font-heading tracking-widest font-bold transition-all shadow-lg"
          >
            SECURE LOGIN
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]">
            Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
