"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-32">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl tracking-wider mb-8 border-b border-border pb-4 uppercase">
            PRIVACY POLICY
          </h1>
          
          <div className="space-y-6 text-sm font-light text-muted-foreground leading-relaxed">
            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase">1. INFORMATION WE COLLECT</h3>
            <p>
              When you purchase from Deshi Flex, we collect personal information necessary to fulfill your delivery, including your name, shipping address, email address, and phone number.
            </p>

            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase">2. SECURE PAYMENT PROCESSING</h3>
            <p>
              Your billing and payment card details are never stored on our servers. All credit card, bKash, and Nagad payments are processed through tokenized secure gateways using industry-standard SSL encryption.
            </p>

            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase">3. COOKIE USAGE</h3>
            <p>
              We use functional cookies to save items in your shopping cart, manage wishlist records, track recently viewed products in LocalStorage, and analyze anonymous web traffic for SEO optimization.
            </p>

            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase">4. POLICY UPDATES</h3>
            <p>
              Deshi Flex reserves the right to modify this privacy statement at any time. Changes take effect immediately upon their publication on this page.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
