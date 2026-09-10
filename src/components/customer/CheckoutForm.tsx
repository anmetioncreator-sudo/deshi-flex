"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store';
import { Order, AdvanceTier } from '@/types';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const translations = {
  en: {
    title1: "1. Order Details",
    itemId: "Item ID / Product Name",
    itemIdPh: "e.g., RG-001 or Skull Ring",
    qty: "Quantity",
    specialNotes: "Special Delivery Notes",
    specialNotesPh: "Optional notes for delivery",
    title2: "2. Delivery Info",
    fullName: "Full Name",
    phone: "Phone Number (11 digits)",
    address: "Detailed Address",
    title3: "3. Payment Split",
    trxId: "Transaction ID (TrxID)",
    trxIdPh: "Enter bKash/Nagad TrxID",
    notice: "Notice: Remaining Balance is Payable via Cash on Delivery (COD) upon product arrival.",
    submit: "[Confirm Order]",
    success: "Order successfully submitted! ID:"
  },
  bn: {
    title1: "১. অর্ডারের বিবরণ",
    itemId: "আইটেম আইডি / পণ্যের নাম",
    itemIdPh: "যেমন: RG-001 বা Skull Ring",
    qty: "পরিমাণ",
    specialNotes: "বিশেষ ডেলিভারি নোট",
    specialNotesPh: "ডেলিভারির জন্য ঐচ্ছিক নোট",
    title2: "২. ডেলিভারি তথ্য",
    fullName: "সম্পূর্ণ নাম",
    phone: "ফোন নম্বর (১১ ডিজিট)",
    address: "বিস্তারিত ঠিকানা",
    title3: "৩. পেমেন্ট স্প্লিট",
    trxId: "ট্রানজ্যাকশন আইডি (TrxID)",
    trxIdPh: "বিকাশ/নগদ TrxID দিন",
    notice: "বিঃদ্রঃ: পণ্য পৌঁছানোর পর অবশিষ্ট ব্যালেন্স ক্যাশ অন ডেলিভারি (COD) এর মাধ্যমে দিতে হবে।",
    submit: "[অর্ডার নিশ্চিত করুন]",
    success: "অর্ডার সফলভাবে জমা দেওয়া হয়েছে! আইডি:"
  }
};

export default function CheckoutForm() {
  const addOrder = useStore((state) => state.addOrder);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState<Order['region']>('Dhaka');
  
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  
  const [advancePaid, setAdvancePaid] = useState<AdvanceTier>(300);
  const [trxId, setTrxId] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      type: 'Direct Checkout',
      date: new Date().toISOString(),
      fullName,
      phone,
      address,
      region,
      itemId,
      quantity,
      specialNotes,
      advancePaid,
      trxId,
      remainingBalance: 0, // In a real app this would be Item Price * Qty - Advance
      status: 'Pending Verification',
    };
    
    try {
      await addOrder(newOrder);
      setSuccessMsg(`${t.success} ${newOrder.id}`);
      setSubmittedOrder(newOrder);
      setShowPopup(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      // Reset basic fields
      setItemId('');
      setQuantity(1);
      setSpecialNotes('');
      setTrxId('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit order. Please try again.');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-punk p-6 space-y-4">
        <h3 className="text-xl font-bebas tracking-widest text-primary">{t.title1}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">{t.itemId}</label>
            <input 
              type="text" placeholder={t.itemIdPh} value={itemId} onChange={(e) => setItemId(e.target.value)}
              className="w-full industrial-input p-3" required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">{t.qty}</label>
            <input 
              type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full industrial-input p-3" required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase tracking-wider">{t.specialNotes}</label>
          <input 
            type="text" placeholder={t.specialNotesPh} value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)}
            className="w-full industrial-input p-3"
          />
        </div>
      </div>

      <div className="glass-punk p-6 space-y-4">
        <h3 className="text-xl font-bebas tracking-widest text-primary">{t.title2}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" placeholder={t.fullName} value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="w-full industrial-input p-3" required
          />
          <input 
            type="tel" placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)}
            pattern="[0-9]{11}"
            className="w-full industrial-input p-3" required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" placeholder={t.address} value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full industrial-input p-3" required
          />
          <select 
            value={region} onChange={(e) => setRegion(e.target.value as any)}
            className="w-full industrial-input p-3" required
          >
            {['Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Mymensingh', 'Gazipur'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-punk p-6 border-l-4 border-l-primary space-y-4">
        <h3 className="text-xl font-bebas tracking-widest text-primary">{t.title3}</h3>
        
        <div className="flex gap-4 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer bg-card p-3 chrome-border flex-1 justify-center">
            <input type="radio" name="checkoutAdvance" value={300} checked={advancePaid === 300} onChange={() => setAdvancePaid(300)} className="accent-primary w-4 h-4" />
            <span className="font-bold">300 TK</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer bg-card p-3 chrome-border flex-1 justify-center">
            <input type="radio" name="checkoutAdvance" value={400} checked={advancePaid === 400} onChange={() => setAdvancePaid(400)} className="accent-primary w-4 h-4" />
            <span className="font-bold">400 TK</span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase tracking-wider">{t.trxId}</label>
          <input 
            type="text" placeholder={t.trxIdPh} value={trxId} onChange={(e) => setTrxId(e.target.value)}
            className="w-full industrial-input p-3" required
          />
        </div>
        
        <p className="text-accent text-sm font-bold uppercase tracking-widest border-t border-border pt-4">
          {t.notice}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/70 border border-red-500 text-red-400 font-bold rounded flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-900/50 border border-green-500 text-green-400 font-bold">
          {successMsg}
        </div>
      )}

      <button type="submit" className="w-full p-5 industrial-button text-xl">
        {t.submit}
      </button>

      <AnimatePresence>
        {showPopup && submittedOrder && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-xl">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-neutral-950 border border-emerald-500/30 p-6 sm:p-10 rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.15)] text-center max-w-lg w-full relative my-8"
              >
                {/* Glowing Luxury Seal Icon */}
                <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.35)]">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                </div>

                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 mb-3">
                  ✓ ORDER REGISTERED SUCCESSFULLY
                </div>

                <h2 className="text-2xl sm:text-3xl font-montserrat font-black tracking-wider text-white mb-2 uppercase leading-tight">
                  ORDER PLACED SUCCESSFULLY
                </h2>
                <p className="text-xs text-neutral-400 font-montserrat uppercase tracking-[0.2em] mb-6 font-semibold">
                  Wear Your Culture • Flex Your Style
                </p>

                {/* VIP Order Receipt Details */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 text-left mb-6 font-mono divide-y divide-neutral-800/80 shadow-2xl">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Tracking ID:</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-400 bg-black px-3 py-1 rounded border border-emerald-500/30 font-mono tracking-wider">
                      {submittedOrder.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Delivery Region:</span>
                    <span className="text-xs sm:text-sm font-bold text-white text-right max-w-[60%] truncate">
                      {submittedOrder.region}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Payment Method:</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-400 text-right">
                      Advance ({submittedOrder.advancePaid} TK) + COD
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Estimated Delivery:</span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      3-5 Days Nationwide
                    </span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 mb-6 leading-relaxed font-sans">
                  <p>Our concierge team will reach you at <strong className="text-white font-mono">{submittedOrder.phone}</strong> before dispatch.</p>
                  <p className="text-[11px] font-mono text-neutral-500 mt-1">Official Hotline: <span className="text-white font-bold">01710793841</span></p>
                  <p className="text-[10px] mt-4 uppercase tracking-[0.25em] border-t border-neutral-800 pt-3 italic text-neutral-400 font-montserrat">
                    &ldquo;It&apos;s not just a cloth, it&apos;s a symbol of luxury.&rdquo;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/8801710793841"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 px-4 bg-emerald-500 hover:bg-emerald-400 text-black transition-all font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 font-mono cursor-pointer"
                  >
                    WhatsApp Concierge
                  </a>
                  <button 
                    type="button"
                    onClick={() => { setShowPopup(false); window.location.href = '/'; }}
                    className="flex-1 py-4 px-4 bg-white hover:bg-neutral-200 text-black transition-all font-bold uppercase tracking-wider text-xs rounded-xl shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer font-mono"
                  >
                    Continue Shopping
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </form>
  );
}
