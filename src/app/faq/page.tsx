"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is your return and exchange policy?",
      a: "If an exchange is required due to a customer error, the refund value may be reduced by up to 50% of the original price. Custom printed items are strictly non-returnable and non-refundable (though a discount on your next order may be offered). If the fault lies with our team, we guarantee a 90% to 100% money-back refund, including delivery charges."
    },
    {
      q: "What is an 'Oversized Boxy Fit' and how should I select my size?",
      a: "Our oversized collections are engineered with drop shoulders, wide chests, and slightly cropped lengths. You do NOT need to size up to get an oversized look; buy your standard regular size for the exact streetwear drop profile."
    },
    {
      q: "Are the graphics printed or embroidered?",
      a: "We utilize both premium high-density screen inks for robust textures, and high-stitch silver and metallic embroidery for luxury brand emblems. Check individual product descriptions for specific design specifications."
    },
    {
      q: "What payment gateways are supported?",
      a: "We support bKash and Nagad payments at checkout. All payment transactions are verified manually to ensure security."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Header */}
          <div className="border-b border-border pb-6 mb-12">
            <h1 className="font-heading text-5xl md:text-6xl tracking-wider">FAQ & SIZING</h1>
            <p className="text-xs text-muted-foreground font-light mt-1.5 uppercase tracking-widest">
              Find answers to order management, delivery schedules, and size fits.
            </p>
          </div>

          {/* Sizing Chart Section */}
          <section className="mb-16 border border-border bg-card p-6">
            <h3 className="font-heading text-2xl tracking-wide text-foreground light-mode:text-foreground mb-4">
              SIGNATURE OVERSIZED SIZING GUIDE
            </h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6">
              Our oversized tees are designed with relaxed shoulders and chest dimensions. Measurements are listed in inches.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-primary font-semibold">
                    <th className="py-3 px-4 uppercase">SIZE</th>
                    <th className="py-3 px-4 uppercase">CHEST (INCHES)</th>
                    <th className="py-3 px-4 uppercase">LENGTH (INCHES)</th>
                    <th className="py-3 px-4 uppercase">SLEEVE LENGTH (INCHES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-muted-foreground font-light">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-foreground">S</td>
                    <td className="py-3.5 px-4">44</td>
                    <td className="py-3.5 px-4">27</td>
                    <td className="py-3.5 px-4">9.5</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-foreground">M</td>
                    <td className="py-3.5 px-4">46</td>
                    <td className="py-3.5 px-4">28</td>
                    <td className="py-3.5 px-4">10</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-foreground">L</td>
                    <td className="py-3.5 px-4">48</td>
                    <td className="py-3.5 px-4">29</td>
                    <td className="py-3.5 px-4">10.5</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-foreground">XL</td>
                    <td className="py-3.5 px-4">50</td>
                    <td className="py-3.5 px-4">30</td>
                    <td className="py-3.5 px-4">11</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-foreground">XXL</td>
                    <td className="py-3.5 px-4">52</td>
                    <td className="py-3.5 px-4">31</td>
                    <td className="py-3.5 px-4">11.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Accordion FAQ questions */}
          <section className="space-y-4">
            <h3 className="font-heading text-2xl tracking-wide text-foreground light-mode:text-foreground mb-6">
              FREQUENTLY ASKED QUESTIONS
            </h3>
            
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border border-border bg-card">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-heading text-sm sm:text-base tracking-wide text-foreground light-mode:text-foreground uppercase flex items-center gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? <Minus className="h-4.5 w-4.5 text-primary flex-shrink-0" /> : <Plus className="h-4.5 w-4.5 text-primary flex-shrink-0" />}
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 border-t border-border/40 text-xs md:text-sm text-muted-foreground font-light leading-relaxed">
                      <p className="mt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
