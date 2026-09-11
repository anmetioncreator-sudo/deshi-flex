"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MessageCircle, Globe, Camera, Send, CheckCircle, AlertCircle, Loader2, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactClientPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Order Inquiry / Sizing Help",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; email: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const contactLinks = [
    {
      title: "WhatsApp Hotline",
      value: "01710793841",
      icon: MessageCircle,
      href: "https://wa.me/8801710793841",
    },
    {
      title: "Facebook Page",
      value: "facebook.com/deshiflex12",
      icon: Globe,
      href: "https://www.facebook.com/deshiflex12",
    },
    {
      title: "Instagram",
      value: "@deshiflex12",
      icon: Camera,
      href: "https://www.instagram.com/deshiflex12/",
    },
    {
      title: "Email Support",
      value: "deshiflex12@gmail.com",
      icon: Mail,
      href: "mailto:deshiflex12@gmail.com",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedTicket({
          id: data.ticketId || `TCK-${Date.now().toString().slice(-6)}`,
          email: formData.email,
        });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "Order Inquiry / Sizing Help",
          message: "",
        });
      } else {
        setErrorMsg(data.error || "Failed to submit ticket. Please reach out via WhatsApp.");
      }
    } catch {
      setErrorMsg("Network error. Please try again or reach out on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <Navbar />

      <main className="flex-grow py-32 md:py-40 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h4 className="text-primary font-sans tracking-[0.3em] text-[10px] uppercase mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> 24/7 Priority Concierge
            </h4>
            <h1 className="font-serif text-5xl md:text-7xl tracking-wider text-foreground mb-6">
              CONTACT US
            </h1>
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
            <p className="text-xs md:text-sm text-muted-foreground font-light mt-1.5 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
              Have questions about sizing, your parcel tracking, or custom streetwear drops in Bangladesh? Connect with our crew directly below.
            </p>
          </motion.div>

          {/* Quick Contact Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-16">
            {contactLinks.map((link, idx) => (
              <motion.a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-md p-6 transition-all duration-500 hover:border-primary/50 hover:bg-card hover:shadow-[0_0_35px_-15px_rgba(212,175,55,0.25)] hover:-translate-y-1 flex items-center gap-5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative w-14 h-14 rounded-full border border-border/50 bg-background/50 flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 group-hover:scale-105 transition-all duration-500">
                  <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                </div>

                <div className="relative z-10 flex flex-col justify-center">
                  <span className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-1 group-hover:text-primary transition-colors duration-300">
                    {link.title}
                  </span>
                  <span className="font-light text-sm md:text-base text-foreground tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                    {link.value}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Interactive Support Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-3xl mx-auto rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-8 md:p-12 shadow-2xl relative"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6 mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold block mb-1">
                  Direct Support Desk
                </span>
                <h2 className="text-xl md:text-2xl font-heading tracking-wider text-foreground">
                  SEND US AN INQUIRY
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Avg. Response: &lt; 2 Hours</span>
              </div>
            </div>

            {submittedTicket ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading tracking-wider text-foreground">Ticket Created</h3>
                <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Your message has been assigned Ticket ID{" "}
                  <span className="font-mono text-primary font-bold">#{submittedTicket.id}</span>. 
                  A confirmation email has been dispatched to{" "}
                  <span className="text-foreground font-medium">{submittedTicket.email}</span>.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="px-6 py-2.5 rounded-lg border border-border hover:border-primary text-xs uppercase tracking-wider font-semibold transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                  <a
                    href="https://wa.me/8801710793841"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Message on WhatsApp
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Tanzid Ahmed"
                      className="w-full bg-background/80 border border-border focus:border-primary px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full bg-background/80 border border-border focus:border-primary px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-background/80 border border-border focus:border-primary px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
                      Topic / Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-background/80 border border-border focus:border-primary px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors text-foreground"
                    >
                      <option value="Order Inquiry / Sizing Help">Order Inquiry / Sizing Help</option>
                      <option value="Delivery / Courier Status">Delivery / Courier Status</option>
                      <option value="Exchange / Return Request">Exchange / Return Request</option>
                      <option value="Custom Bulk Drop Shoulder Order">Custom Bulk Drop Shoulder Order</option>
                      <option value="General Brand Question">General Brand Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need help with (include order number if applicable)..."
                    className="w-full bg-background/80 border border-border focus:border-primary px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Your details are kept strictly private & confidential</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground hover:bg-accent disabled:opacity-50 text-xs font-heading tracking-widest font-bold transition-all rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> DISPATCHING...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> SUBMIT TICKET
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
