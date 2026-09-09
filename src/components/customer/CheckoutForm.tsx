"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store';
import { Order, AdvanceTier } from '@/types';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#111111] border border-border/20 p-8 md:p-12 rounded shadow-2xl text-center max-w-md w-full relative"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bebas tracking-widest text-white mb-2 uppercase" style={{ textShadow: '-2px 0px 0px #ff5500, 2px 0px 0px #00d2ff' }}>Order Placed Successfully</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-8 font-bold">Wear Your Culture, Flex Your Style</p>
              
              <div className="bg-black/50 border border-border/30 rounded text-left mb-6 font-mono">
                <div className="flex justify-between items-center p-4 border-b border-border/30">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Tracking ID:</span>
                  <span className="text-sm font-bold text-white">{submittedOrder.id}</span>
                </div>
                <div className="flex justify-between items-center p-4 border-b border-border/30">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Delivery Address:</span>
                  <span className="text-sm font-bold text-white text-right max-w-[60%] truncate">{submittedOrder.region}</span>
                </div>
                <div className="flex justify-between items-center p-4 border-b border-border/30">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Payment Method:</span>
                  <span className="text-sm font-bold text-white text-right">Advance ({submittedOrder.advancePaid} TK) + COD</span>
                </div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Estimated Delivery:</span>
                  <span className="text-sm font-bold text-white">3-5 Days</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-8 leading-relaxed font-mono">
                <p>We will contact you at <span className="text-white font-bold">{submittedOrder.phone}</span> before delivery.</p>
                <p className="mt-1">Or reach our admin at <span className="text-white font-bold">01710793841</span>.</p>
                <p className="text-[10px] mt-4 uppercase tracking-[0.2em] border-t border-border/30 pt-4 italic opacity-70">
                  "It's not just a cloth, it's a symbol of luxury."
                </p>
              </div>

              <button 
                type="button"
                onClick={() => { setShowPopup(false); window.location.href = '/'; }}
                className="w-full p-4 bg-white text-black hover:bg-neutral-200 transition-colors font-bold uppercase tracking-widest text-sm rounded-none"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </form>
  );
}
