"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MessageCircle, Globe, Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactClientPage() {
  const contactLinks = [
    {
      title: "WhatsApp",
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

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <Navbar />

      <main className="flex-grow py-32 md:py-48 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <h4 className="text-primary font-sans tracking-[0.3em] text-[10px] uppercase mb-4">Get In Touch</h4>
            <h1 className="font-serif text-5xl md:text-7xl tracking-wider text-foreground mb-6">
              CONTACT US
            </h1>
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
            <p className="text-xs md:text-sm text-muted-foreground font-light mt-1.5 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
              Have questions about your order, sizing, or collection drops? Reach out to us directly through any of our official channels below.
            </p>
          </motion.div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {contactLinks.map((link, idx) => (
              <motion.a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-md p-8 transition-all duration-500 hover:border-primary/50 hover:bg-card hover:shadow-[0_0_40px_-15px_rgba(212,175,55,0.2)] hover:-translate-y-1 flex items-center gap-6"
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon Box */}
                <div className="relative w-16 h-16 rounded-full border border-border/50 bg-background/50 flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 group-hover:scale-110 transition-all duration-500">
                  <link.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center">
                  <span className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-1.5 group-hover:text-primary transition-colors duration-300">
                    {link.title}
                  </span>
                  <span className="font-light text-sm md:text-base text-foreground tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                    {link.value}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
