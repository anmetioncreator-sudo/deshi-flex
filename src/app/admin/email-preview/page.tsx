"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, Send, Smartphone, Monitor, CheckCircle, AlertCircle, 
  RefreshCw, ArrowLeft, ShieldCheck, ShoppingBag, Truck, Key, LifeBuoy, Bell
} from 'lucide-react';

const TEMPLATES = [
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    category: 'E-Commerce',
    icon: ShoppingBag,
    sender: 'orders@deshiflex.com',
    description: 'Sent immediately when customer places an order. Contains item breakdown, advance payment, and COD balance.',
  },
  {
    id: 'welcome',
    name: 'VIP Welcome Reward',
    category: 'Marketing',
    icon: Mail,
    sender: 'orders@deshiflex.com',
    description: 'Sent when customer registers or subscribes. Contains 15% discount voucher code (FLEXDROP).',
  },
  {
    id: 'shipment-tracking',
    name: 'Shipment & Parcel Location',
    category: 'Logistics',
    icon: Truck,
    sender: 'orders@deshiflex.com',
    description: 'Live courier dispatch update with tracking number, destination district, and live tracking CTA.',
  },
  {
    id: 'reset-code',
    name: 'Password Reset OTP',
    category: 'Security',
    icon: Key,
    sender: 'orders@deshiflex.com',
    description: '6-digit one-time passcode with glowing security box and 15-minute expiration warning.',
  },
  {
    id: 'support-inquiry',
    name: 'Support Ticket Received',
    category: 'Support Desk',
    icon: LifeBuoy,
    sender: 'support@deshiflex.com',
    description: 'Customer inquiry receipt with ticket reference number, expected turnaround, and WhatsApp hotline link.',
  },
  {
    id: 'admin-alert',
    name: 'Store Owner Order Alert',
    category: 'Internal',
    icon: Bell,
    sender: 'orders@deshiflex.com',
    description: 'Instant notification dispatched to deshiflex12@gmail.com with customer contact, address, and advance TrxID.',
  },
];

export default function EmailPreviewPage() {
  const [activeTemplate, setActiveTemplate] = useState('order-confirmation');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [testEmail, setTestEmail] = useState('');
  const [senderType, setSenderType] = useState<'orders' | 'support'>('orders');
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

  const currentTemplate = TEMPLATES.find(t => t.id === activeTemplate) || TEMPLATES[0];

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setIsSending(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmail,
          template: activeTemplate,
          senderType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          type: 'success',
          text: data.simulated
            ? `[Simulated] Dispatched "${currentTemplate.name}" to ${testEmail}. Add RESEND_API_KEY to .env for live inbox delivery.`
            : `Live email delivered successfully to ${testEmail}! (ID: ${data.id || 'N/A'})`,
        });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to dispatch email.' });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMsg({ type: 'error', text: error.message || 'Network error sending email.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/df-control-vault"
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Vault
          </Link>
          <div className="h-4 w-[1px] bg-neutral-800" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                RESEND ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE DOMAIN: deshiflex.com
              </span>
            </div>
            <h1 className="text-lg font-black tracking-wider uppercase font-montserrat">
              EMAIL TEMPLATES &amp; DISPATCH SUITE
            </h1>
          </div>
        </div>

        {/* Sender Badges */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-400">Support:</span>
            <span className="text-white font-bold">support@deshiflex.com</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-400">Orders:</span>
            <span className="text-white font-bold">orders@deshiflex.com</span>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-73px)]">
        
        {/* Left Sidebar: Templates & Test Form */}
        <div className="lg:col-span-4 border-r border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-3">
                Select Template ({TEMPLATES.length})
              </h2>
              <div className="space-y-2">
                {TEMPLATES.map((tpl) => {
                  const Icon = tpl.icon;
                  const isSelected = activeTemplate === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        setActiveTemplate(tpl.id);
                        setStatusMsg(null);
                        setSenderType(tpl.id === 'support-inquiry' ? 'support' : 'orders');
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                          : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/70'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold tracking-wide text-white">
                            {tpl.name}
                          </span>
                          <span className="text-[10px] font-mono uppercase text-neutral-500 px-1.5 py-0.5 rounded bg-neutral-800">
                            {tpl.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {tpl.description}
                        </p>
                        <div className="text-[10px] font-mono text-emerald-400/80 mt-1.5">
                          From: {tpl.sender}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Test Sender Box */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <Send className="w-4 h-4 text-emerald-400" />
                Live Test Dispatch
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Test-deliver <strong className="text-white">{currentTemplate.name}</strong> to your inbox via Resend.
              </p>

              <form onSubmit={handleSendTest} className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your-email@gmail.com"
                    required
                    className="w-full bg-black border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                    Sender Identity
                  </label>
                  <select
                    value={senderType}
                    onChange={(e) => setSenderType(e.target.value as 'orders' | 'support')}
                    className="w-full bg-black border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="orders">orders@deshiflex.com (Orders / Tracking / OTP)</option>
                    <option value="support">support@deshiflex.com (Customer Support Desk)</option>
                  </select>
                </div>

                {statusMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-mono flex items-start gap-2 ${
                      statusMsg.type === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : 'bg-red-950/60 border border-red-500/40 text-red-300'
                    }`}
                  >
                    {statusMsg.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{statusMsg.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Test Email
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-900 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
            <span>Resend SDK v4.x</span>
            <span className="text-emerald-500 font-bold">DKIM / SPF Verified</span>
          </div>
        </div>

        {/* Right Area: Interactive Device Frame Preview */}
        <div className="lg:col-span-8 bg-neutral-900/30 p-6 flex flex-col">
          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Viewing:
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {currentTemplate.name}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-1 rounded-xl">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceView === 'desktop'
                    ? 'bg-neutral-800 text-white shadow'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop (640px)
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceView === 'mobile'
                    ? 'bg-neutral-800 text-white shadow'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile (380px)
              </button>
              <button
                onClick={() => setPreviewKey(k => k + 1)}
                title="Refresh Preview"
                className="p-1.5 text-neutral-500 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Device Frame Viewport */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div
              className={`transition-all duration-300 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-black ${
                deviceView === 'desktop' ? 'w-full max-w-[660px] h-[720px]' : 'w-[400px] h-[720px]'
              }`}
            >
              {/* Browser/Client Header Chrome */}
              <div className="bg-neutral-950 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] text-neutral-500 truncate max-w-[300px]">
                  Subject: {currentTemplate.name} • {currentTemplate.sender}
                </div>
                <div className="w-4" />
              </div>

              {/* Iframe rendering live server HTML */}
              <iframe
                key={`${activeTemplate}-${previewKey}`}
                src={`/api/email/test?template=${activeTemplate}`}
                title="Email Preview"
                className="w-full h-[calc(100%-37px)] bg-[#050505] border-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
