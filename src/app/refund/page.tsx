"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RefundPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-32">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl tracking-wider mb-8 border-b border-border pb-4 uppercase">
            RETURN & REFUND POLICY
          </h1>
          
          <div className="space-y-6 text-sm font-light text-muted-foreground leading-relaxed">
            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase">1. FAULT & CUSTOM ORDER POLICY</h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong className="text-foreground">Customer Error:</strong> If a return or exchange is required due to a customer fault, the refund value will be reduced by up to 50% of the original price.</li>
              <li><strong className="text-foreground">Custom Printed Orders:</strong> Custom printed items are strictly non-returnable and non-refundable. However, we may offer a special discount on your next order if there are concerns.</li>
              <li><strong className="text-foreground">Deshi Flex Error:</strong> If the fault lies with our team (e.g., manufacturing defect or wrong item delivered), we guarantee a 90% to 100% full money-back refund, including the delivery charge.</li>
            </ul>

            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase mt-8">2. REFUND CHANNELS</h3>
            <p>
              Once your returned garment is received at our Banani lab and passes our quality check, refunds will be initiated within 3 business days. Refunds will be credited back via bKash, Nagad, or bank transfer depending on the original payment channel.
            </p>

            <h3 className="font-heading text-xl text-foreground light-mode:text-foreground mb-2 uppercase mt-8">3. HOW TO INITIATE A RETURN</h3>
            <p>
              To start a return, email us at **deshiflex12@gmail.com** or WhatsApp us at **01710793841** with your Order tracking ID, images of the product condition, and your replacement requests.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
