"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-36 flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-auto px-6 text-center border border-border bg-card p-12 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          <div className="h-16 w-16 bg-neutral-900 border border-border/80 flex items-center justify-center mx-auto mb-6 rounded-full text-primary">
            <Compass className="h-8 w-8" />
          </div>

          <h1 className="font-heading text-8xl tracking-widest text-primary leading-none">404</h1>
          <h2 className="font-heading text-2xl tracking-wider mb-4 text-foreground">DROP CLOSED OR PAGE NOT FOUND</h2>
          
          <p className="text-xs text-muted-foreground font-light leading-relaxed mb-8">
            The collection drop you are looking for has either closed, expired, or the page URL was entered incorrectly. Flex back to our active shop.
          </p>

          <Link
            href="/shop"
            className="w-full bg-primary text-primary-foreground hover:bg-accent py-4 text-xs font-heading tracking-widest font-bold transition-colors block text-center shadow-lg"
          >
            RETURN TO SHOP <ArrowRight className="h-3.5 w-3.5 inline ml-1" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
