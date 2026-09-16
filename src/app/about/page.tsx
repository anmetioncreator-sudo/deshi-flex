import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Sparkles, Shirt, Shield, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Deshi Flex, the leading premium streetwear and drop-shoulder fashion brand in Bangladesh.",
};

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Header */}
          <div className="border-b border-border pb-6 mb-12 text-center sm:text-left">
            <h1 className="font-heading text-5xl md:text-6xl tracking-wider">ABOUT DESHI FLEX</h1>
            <p className="text-xs text-muted-foreground font-light mt-1.5 uppercase tracking-widest">
              The story behind modern Bangladeshi streetwear
            </p>
          </div>

          {/* Hero Banner Visual */}
          <div className="min-h-[300px] py-16 w-full bg-neutral-950 border border-border flex flex-col justify-center items-center p-8 text-center relative overflow-hidden mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            <h2 className="font-heading text-4xl md:text-6xl tracking-wider z-10 text-foreground leading-tight">
              BANGLADESH HERITAGE <span className="silver-text-gradient">ENGINEERED</span>.
            </h2>
            <h2 className="font-heading text-4xl md:text-6xl tracking-wider z-10 text-primary leading-tight mt-2">
              INTO HIGH-END FASHION.
            </h2>
          </div>

          {/* Story Paragraphs */}
          <div className="space-y-8 text-sm md:text-base font-light text-muted-foreground leading-relaxed">
            <p>
              Starting in June 2026, <strong>Deshi Flex</strong> is dedicated to providing luxury clothing for people who want quality and a customized brand, not quantity. We build this brand for legacy, not for money.
            </p>
            <p>
              Crafting a legacy from Bangladesh to the world — Bangladesh heritage engineered into high-end fashion. We take the rich cultural roots of Bangladesh and forge them into premium garments that speak to a global audience.
            </p>
            <p>
              Our design laboratory works directly with local artisans and technical engineers to create custom patterns, high-density prints, and rich organic dyes. We do not mass-produce; we build limited collection drops designed to be worn as personal statements.
            </p>

            {/* Core Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 pb-4">
              <div className="border border-border p-5 bg-card">
                <Shirt className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-heading text-lg text-foreground tracking-wide mb-2">PREMIUM QUALITY</h3>
                <p className="text-xs text-muted-foreground font-light">
                  We use combed heavyweight cotton (up to 420 GSM) with silicone soft-washes, ensuring items feel comfortable and hold their shape for years.
                </p>
              </div>
              <div className="border border-border p-5 bg-card">
                <Heart className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-heading text-lg text-foreground tracking-wide mb-2">CULTURAL PRIDE</h3>
                <p className="text-xs text-muted-foreground font-light">
                  From vintage rickshaw art line configurations to regional national sports themes, we integrate historical pride into global trends.
                </p>
              </div>
              <div className="border border-border p-5 bg-card">
                <Shield className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-heading text-lg text-foreground tracking-wide mb-2">ETHICAL SOURCING</h3>
                <p className="text-xs text-muted-foreground font-light">
                  All products are designed, manufactured, and embroidered locally in Dhaka under fair trade wages and strict quality regulations.
                </p>
              </div>
            </div>

            <p>
              Deshi Flex represents more than clothes; it represents a cultural movement. It is for the university students hustle, the sneaker collector, and the streetwear lover who wants to wear their identity proudly.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-heading text-xl text-foreground light-mode:text-foreground">READY TO FLEX?</h4>
              <p className="text-xs text-muted-foreground font-light">Explore our latest limited-run oversized collections and apparel.</p>
            </div>
            <Link
              href="/shop"
              className="bg-primary text-primary-foreground hover:bg-accent px-8 py-3.5 text-xs font-heading tracking-widest font-bold transition-all flex items-center gap-1.5"
            >
              SHOP NEW DROP <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
