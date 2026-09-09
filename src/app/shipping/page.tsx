"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ShippingPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-32">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl tracking-wider mb-8 border-b border-border pb-4 uppercase">
            SHIPPING POLICY
          </h1>
          
          <div className="space-y-6 text-sm font-light text-muted-foreground leading-relaxed">
            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase">1. PROCESSING AND DISPATCH</h3>
            <p>
              All orders are processed within 24 hours of successful placement. Orders placed before 4:00 PM are dispatched on the same business day from our warehouse in Banani, Dhaka. We do not dispatch orders on Fridays and national public holidays.
            </p>

            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase">2. DELIVERIES AND RATES</h3>
            <p>
              We operate flat shipping rates across Bangladesh:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>**Dhaka Metro Area:** BDT 100 flat. Estimated delivery: 24 to 48 hours.</li>
              <li>**Outside Dhaka Area (Nationwide):** BDT 150 flat. Estimated delivery: 3 to 5 business days.</li>
            </ul>

            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase">3. LOGISTICS PARTNERS</h3>
            <p>
              To ensure premium delivery handling, Deshi Flex partners with the country's leading courier networks, including Pathao Delivery, Steadfast Courier, and Paperfly. All deliveries require signature verification.
            </p>

            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase">4. ORDER TRACKING</h3>
            <p>
              Once your order is dispatched, a tracking ID and link will be sent to the email address and mobile number provided during checkout. You can check the real-time shipping status directly on our logistics partner's portal.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
