"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { OrderStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const getColorName = (hex: string) => {
  const COLORS = [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#f5f5f7' },
    { name: 'Navy Blue', hex: '#1e293b' },
    { name: 'Cream', hex: '#fffdd0' },
    { name: 'Off-White', hex: '#f8f4e6' },
    { name: 'Mocha', hex: '#493628' },
    { name: 'Olive Green', hex: '#4b5320' },
    { name: 'Sage Green', hex: '#9dc183' },
    { name: 'Dark Grey', hex: '#333333' },
    { name: 'Lavender', hex: '#e6e6fa' },
  ];
  const color = COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  return color ? color.name : hex;
};

export default function OrderQueue() {
  const orders = useStore((state) => state.orders);
  const fetchOrders = useStore((state) => state.fetchOrders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  const updateOrderStatusNote = useStore((state) => state.updateOrderStatusNote);
  const deleteOrder = useStore((state) => state.deleteOrder);
  const restoreOrder = useStore((state) => state.restoreOrder);
  const permanentDeleteOrder = useStore((state) => state.permanentDeleteOrder);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const [filter, setFilter] = useState<string>('All');
  const [ignoredOrderIds, setIgnoredOrderIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('deshiflex_ignored_order_popups');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [disablePopups, setDisablePopups] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('deshiflex_disable_popups') === 'true';
    }
    return false;
  });
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => {
    if (filter === 'Deleted') return o.deleted;
    if (o.deleted) return false;
    if (filter === 'All') return o.status !== 'Delivered';
    return o.status === filter;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const statuses: OrderStatus[] = ['Pending Verification', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending Verification': return 'text-zinc-300 border-zinc-400';
      case 'Processing': return 'text-blue-500 border-blue-500';
      case 'Shipped': return 'text-purple-500 border-purple-500';
      case 'Delivered': return 'text-green-500 border-green-500';
      case 'Cancelled': return 'text-red-500 border-red-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  // Find the first pending order to show in the popup
  const pendingOrder = disablePopups ? null : orders.find(o => o.status === 'Pending Verification' && !ignoredOrderIds.includes(o.id));

  const handleConfirm = (id: string) => {
    updateOrderStatus(id, 'Processing');
    handleIgnore(id);
  };

  const handleDeny = (id: string) => {
    updateOrderStatus(id, 'Cancelled');
    handleIgnore(id);
  };

  const handleIgnore = (id: string) => {
    setIgnoredOrderIds((prev) => {
      const updated = Array.from(new Set([...prev, id]));
      try {
        localStorage.setItem('deshiflex_ignored_order_popups', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleTogglePopups = (disable: boolean) => {
    setDisablePopups(disable);
    try {
      localStorage.setItem('deshiflex_disable_popups', disable ? 'true' : 'false');
    } catch (e) {}
  };

  const handleDetails = (id: string) => {
    handleIgnore(id);
    setSelectedOrderId(id);
  };

  return (
    <>
      {/* New Order Verification Popup */}
      <AnimatePresence>
        {pendingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-primary max-w-lg w-full shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
              
              {/* Close Button */}
              <button
                onClick={() => handleIgnore(pendingOrder.id)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 transition-colors z-20"
                title="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4 pr-8">
                  <AlertTriangle className="text-primary h-8 w-8 animate-pulse" />
                  <div>
                    <h3 className="font-bebas text-2xl tracking-widest text-foreground m-0 leading-none">NEW INCOMING ORDER</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">Action Required</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-900 p-3 border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase">Order ID</p>
                      <p className="font-mono text-sm text-foreground">{pendingOrder.id}</p>
                    </div>
                    <div className="bg-neutral-900 p-3 border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase">TrxID</p>
                      <p className="font-mono text-sm text-accent">{pendingOrder.trxId || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-3 border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase">Customer</p>
                    <p className="font-bold text-foreground">{pendingOrder.fullName}</p>
                    <p className="text-xs font-mono text-muted-foreground">{pendingOrder.phone}</p>
                  </div>

                  <div className="bg-neutral-900 p-3 border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase">Details</p>
                    <p className="text-sm text-foreground">{pendingOrder.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">Advance: <span className="text-primary font-bold">{pendingOrder.advancePaid} TK</span></p>
                    {pendingOrder.frontImageName && <p className="text-xs text-accent mt-1">📎 Front: {pendingOrder.frontImageName}</p>}
                    {pendingOrder.backImageName && <p className="text-xs text-accent mt-1">📎 Back: {pendingOrder.backImageName}</p>}
                    {pendingOrder.color && (
                      <p className="text-xs mt-1 flex items-center gap-2">
                        <span className="text-muted-foreground">Color:</span>
                        <span className="w-4 h-4 inline-block rounded-full border border-border" style={{ backgroundColor: pendingOrder.color }}></span>
                        <span className="font-bold text-[10px]">{getColorName(pendingOrder.color)}</span>
                      </p>
                    )}
                    {pendingOrder.designType && <p className="text-xs text-muted-foreground mt-1">Style: {pendingOrder.designType}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => handleConfirm(pendingOrder.id)}
                    className="flex items-center justify-center gap-1 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-foreground border border-green-500 p-2 transition-colors text-[10px] font-bold uppercase tracking-wider"
                  >
                    <Check className="h-3 w-3" /> Confirm
                  </button>
                  <button
                    onClick={() => handleDeny(pendingOrder.id)}
                    className="flex items-center justify-center gap-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-foreground border border-red-500 p-2 transition-colors text-[10px] font-bold uppercase tracking-wider"
                  >
                    <X className="h-3 w-3" /> Deny
                  </button>

                  <button
                    onClick={() => handleDetails(pendingOrder.id)}
                    className="flex items-center justify-center gap-1 bg-primary/20 text-primary hover:bg-primary hover:text-foreground border border-primary p-2 transition-colors text-[10px] font-bold uppercase tracking-wider"
                  >
                    <Eye className="h-3 w-3" /> Details
                  </button>
                  <button
                    onClick={() => handleIgnore(pendingOrder.id)}
                    className="flex items-center justify-center gap-1 bg-muted/20 text-muted-foreground hover:bg-muted hover:text-foreground border border-muted-foreground p-2 transition-colors text-[10px] font-bold uppercase tracking-wider"
                  >
                    <EyeOff className="h-3 w-3" /> Ignore
                  </button>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={disablePopups}
                      onChange={(e) => handleTogglePopups(e.target.checked)}
                      className="accent-primary h-3.5 w-3.5"
                    />
                    <span>Don't show auto-popups for incoming orders</span>
                  </label>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Order Details Modal */}
      <AnimatePresence>
        {selectedOrderId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
            onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedOrderId(null); }}
          >
            <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass-punk max-w-4xl w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative my-8 rounded-xl overflow-hidden border border-border/50 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                <button 
                  onClick={() => setSelectedOrderId(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-red-500/20 hover:text-red-400 transition-all border border-border/30 z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {(() => {
                  const order = orders.find(o => o.id === selectedOrderId);
                  if (!order) return null;
                  
                  return (
                    <div className="p-8 md:p-10 space-y-10">
                      {/* Header */}
                      <div className="border-b border-border/30 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-primary uppercase tracking-[0.3em] font-bold">Order Details</span>
                          <span className={`text-[11px] px-3 py-1 rounded-full border uppercase tracking-wider font-bold ${
                            order.status === 'Pending Verification' ? 'border-zinc-500/30 text-zinc-300 bg-zinc-500/10' :
                            order.status === 'Processing' ? 'border-blue-500/30 text-blue-500 bg-blue-500/10' :
                            order.status === 'Shipped' ? 'border-purple-500/30 text-purple-500 bg-purple-500/10' :
                            order.status === 'Delivered' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                            'border-red-500/30 text-red-500 bg-red-500/10'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div>
                            <h2 className="text-4xl font-bebas tracking-widest text-foreground flex items-center gap-4">
                              {order.id} <span className="text-xl text-primary hidden sm:inline-block">[{order.type}]</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mt-2 font-mono">{new Date(order.date).toLocaleString()}</p>
                          </div>
                          
                          <div className="flex gap-5 text-sm font-bold bg-black/20 p-4 rounded-lg border border-border/30">
                            <div className="flex flex-col border-r border-border/30 pr-5">
                              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">Phone Number</span>
                              <span className="text-foreground tracking-wider mt-1 font-mono">{order.phone}</span>
                            </div>
                            <div className="flex flex-col border-r border-border/30 pr-5">
                              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">Total Amount</span>
                              <span className="text-foreground tracking-wider mt-1">{Number(order.advancePaid) + Number(order.remainingBalance || 0)} TK</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">Advance Paid</span>
                              <span className="text-primary tracking-wider mt-1">{order.advancePaid} TK</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Column: Customer & Basic Info */}
                        <div className="space-y-8 order-2 md:order-2">
                          {/* Customer Info */}
                          <div className="space-y-4">
                            <h3 className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary/50"></span> Customer Profile
                            </h3>
                            <div className="bg-black/20 p-5 rounded-lg border border-border/30 space-y-4 chrome-border">
                              <div className="flex justify-between items-center border-b border-border/10 pb-3">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider">Name</span>
                                <span className="text-base font-semibold text-foreground">{order.fullName}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-border/10 pb-3">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider">Phone</span>
                                <span className="text-base font-mono text-foreground">{order.phone}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-border/10 pb-3">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider">Location</span>
                                <span className="text-base text-foreground">{order.region}</span>
                              </div>
                              <div className="pt-2">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Full Address</span>
                                <span className="text-sm text-foreground/90 leading-relaxed">{order.address}</span>
                              </div>
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div className="space-y-4">
                            <h3 className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary/50"></span> Payment Details
                            </h3>
                            <div className="bg-black/20 p-5 rounded-lg border border-border/30 space-y-4 chrome-border">
                              <div className="flex justify-between items-center border-b border-border/10 pb-3">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider">Advance Paid</span>
                                <span className="text-base font-mono text-primary font-bold bg-primary/10 px-3 py-1 rounded border border-primary/20">{order.advancePaid} TK</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider">TrxID</span>
                                <span className="text-base font-mono text-foreground">{order.trxId || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Order Desc */}
                          <div className="space-y-4">
                            <h3 className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary/50"></span> Specifications
                            </h3>
                            <div className="bg-black/20 p-5 rounded-lg border border-border/30 space-y-4 chrome-border">
                              <div className="flex justify-between items-center border-b border-border/10 pb-3">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider">Type</span>
                                <span className="text-xs uppercase font-bold text-foreground px-3 py-1 bg-muted/50 rounded">{order.type}</span>
                              </div>
                              {order.designType && (
                                <div className="flex justify-between items-center border-b border-border/10 pb-3">
                                  <span className="text-sm text-muted-foreground uppercase tracking-wider">Design Style</span>
                                  <span className="text-base text-foreground">{order.designType}</span>
                                </div>
                              )}
                              {order.materials && (
                                <div className="flex justify-between items-center border-b border-border/10 pb-3">
                                  <span className="text-sm text-muted-foreground uppercase tracking-wider">Materials</span>
                                  <span className="text-sm text-foreground text-right max-w-[60%] truncate" title={order.materials}>{order.materials}</span>
                                </div>
                              )}
                              {order.color && (
                                <div className="flex justify-between items-center border-b border-border/10 pb-3">
                                  <span className="text-sm text-muted-foreground uppercase tracking-wider">Base Color</span>
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-sm text-foreground">{getColorName(order.color)} <span className="font-mono text-xs text-muted-foreground ml-1">({order.color})</span></span>
                                    <span className="w-5 h-5 rounded-full border border-border shadow-sm" style={{ backgroundColor: order.color }}></span>
                                  </div>
                                </div>
                              )}
                              {(order.description || order.specialNotes) && (
                                <div className="pt-3">
                                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">Notes / Description</span>
                                  <div className="p-4 bg-background/50 rounded border border-border/30 text-sm italic text-foreground/90 whitespace-pre-wrap">
                                    {order.description || order.specialNotes}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Update Status */}
                          <div className="space-y-4">
                            <h3 className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary/50"></span> Update Status
                            </h3>
                            <div className="bg-black/20 p-5 rounded-lg border border-border/30 chrome-border">
                              <div className="grid grid-cols-2 gap-3">
                                {statuses.map(s => (
                                  <button
                                    key={s}
                                    onClick={() => updateOrderStatus(order.id, s)}
                                    disabled={order.status === s}
                                    className={`p-3 text-xs uppercase font-extrabold border rounded-md transition-all ${
                                      order.status === s 
                                        ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--color-primary),0.5)] cursor-default' 
                                        : 'border-neutral-700 bg-black/40 text-foreground/60 hover:border-primary hover:text-primary hover:bg-primary/10'
                                    }`}
                                  >
                                    {s.split(' ')[0]}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Admin Notes */}
                          <div className="space-y-4">
                            <h3 className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary/50"></span> Admin Notes / Reason
                            </h3>
                            <div className="bg-black/20 p-5 rounded-lg border border-border/30 chrome-border">
                              <textarea
                                value={order.statusNote || ''}
                                onChange={(e) => updateOrderStatusNote(order.id, e.target.value)}
                                placeholder="Cancel reason, in-way date, delivery instructions..."
                                className="w-full min-h-[100px] p-3 text-sm bg-black/50 border border-neutral-800 rounded-md focus:border-primary/50 focus:outline-none resize-y text-foreground/90 placeholder:text-muted-foreground/50"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Design Assets */}
                        <div className="space-y-4 order-1 md:order-1">
                          {order.type === 'Direct Checkout' && (
                            <div className="space-y-4">
                              <h3 className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary/50"></span> Cart Items
                              </h3>
                              <div className="bg-black/20 p-5 rounded-lg border border-border/30 chrome-border">
                                <div className="space-y-4">
                                  {((order as any).cartItems || []).map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 items-center bg-background/40 p-4 rounded-md border border-border/30">
                                      {item.product?.images?.[0] && (
                                        <div className="h-20 w-16 bg-neutral-900 flex-shrink-0 border border-border/50 rounded overflow-hidden">
                                          <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <p className="font-heading tracking-wide text-foreground text-lg">{item.product?.name || 'Unknown Item'}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                          <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground uppercase">Size: {item.selectedSize}</span>
                                          <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground uppercase flex items-center gap-1.5">
                                            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: item.selectedColor?.hex || '#000' }}></span>
                                            {item.selectedColor?.name}
                                          </span>
                                        </div>
                                        <p className="text-sm mt-3 text-muted-foreground">Qty: <span className="font-bold text-primary">{item.quantity}</span> × <span className="text-foreground">৳{item.product?.price}</span></p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {order.type !== 'Direct Checkout' && (
                            <h3 className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary/50"></span> Visual Assets
                            </h3>
                          )}
                          
                          {order.referenceImage && !order.frontImageName && !order.backImageName && (
                            <div className="bg-black/20 p-6 rounded-lg border border-border/30 text-center chrome-border flex flex-col items-center justify-center min-h-[12rem]">
                              <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 text-xl">📎</span>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Legacy Attachment</p>
                              <p className="text-primary text-base font-medium mb-4">{order.referenceImage}</p>
                              <a href={`/uploads/${order.referenceImage}`} download={order.referenceImage} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/50 transition-colors rounded font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(var(--color-primary),0.2)]">
                                <span>⬇️</span> Download Original File
                              </a>
                            </div>
                          )}

                          {order.frontImageName && (
                            <div className="bg-black/20 p-5 rounded-lg border border-border/30 chrome-border">
                              <div className="flex justify-between items-center mb-4">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">Front Design</p>
                                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded font-mono">
                                  X:{Math.round(order.frontImagePos?.x || 0)} Y:{Math.round(order.frontImagePos?.y || 0)} S:{order.frontImagePos?.scale || 1}x
                                </span>
                              </div>
                              <div className="relative w-full h-[400px] rounded-md border border-border/50 flex items-center justify-center overflow-hidden bg-neutral-950">
                                 <img src="/mockup-front.png?v=2" alt="Front Mockup" className="absolute inset-0 w-full h-full object-contain opacity-60 pointer-events-none" />
                                 <div className="absolute z-10 flex items-center justify-center font-bold text-center border border-primary/50 text-primary px-4 py-2 bg-background/80 backdrop-blur-md shadow-lg rounded text-sm" style={{ 
                                   transform: `translate(${(order.frontImagePos?.x || 0)}px, ${(order.frontImagePos?.y || 0)}px) scale(${order.frontImagePos?.scale || 1})`
                                 }}>
                                   📎 {order.frontImageName}
                                 </div>
                              </div>
                              <div className="mt-5 flex justify-center">
                                <a href={`/uploads/${order.frontImageName}`} download={order.frontImageName} className="inline-flex w-full justify-center items-center gap-2 px-5 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded font-bold text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(var(--color-primary),0.4)]">
                                  <span>⬇️</span> Download High-Res Front Design
                                </a>
                              </div>
                            </div>
                          )}

                          {order.backImageName && (
                            <div className="bg-black/20 p-5 rounded-lg border border-border/30 chrome-border mt-5">
                              <div className="flex justify-between items-center mb-4">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">Back Design</p>
                                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded font-mono">
                                  X:{Math.round(order.backImagePos?.x || 0)} Y:{Math.round(order.backImagePos?.y || 0)} S:{order.backImagePos?.scale || 1}x
                                </span>
                              </div>
                              <div className="relative w-full h-[400px] rounded-md border border-border/50 flex items-center justify-center overflow-hidden bg-neutral-950">
                                 <img src="/mockup-back.png?v=2" alt="Back Mockup" className="absolute inset-0 w-full h-full object-contain opacity-60 pointer-events-none" />
                                 <div className="absolute z-10 flex items-center justify-center font-bold text-center border border-primary/50 text-primary px-4 py-2 bg-background/80 backdrop-blur-md shadow-lg rounded text-sm" style={{ 
                                   transform: `translate(${(order.backImagePos?.x || 0)}px, ${(order.backImagePos?.y || 0)}px) scale(${order.backImagePos?.scale || 1})`
                                 }}>
                                   📎 {order.backImageName}
                                 </div>
                              </div>
                              <div className="mt-5 flex justify-center">
                                <a href={`/uploads/${order.backImageName}`} download={order.backImageName} className="inline-flex w-full justify-center items-center gap-2 px-5 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded font-bold text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(var(--color-primary),0.4)]">
                                  <span>⬇️</span> Download High-Res Back Design
                                </a>
                              </div>
                            </div>
                          )}


                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Order Queue UI */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center bg-background p-4 chrome-border">
          <h3 className="text-xl font-bebas tracking-widest text-primary">Order Queue</h3>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto mt-4 md:mt-0 pb-2 md:pb-0">
            <button 
              onClick={() => setFilter('All')}
              className={`px-3 py-1 text-xs font-bold uppercase transition-colors border ${filter === 'All' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              All ({orders.filter(o => !o.deleted && o.status !== 'Delivered').length})
            </button>
            {statuses.map(s => (
              <button 
                key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1 text-xs font-bold uppercase transition-colors border whitespace-nowrap ${filter === s ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}
              >
                {s} ({orders.filter(o => o.status === s && !o.deleted).length})
              </button>
            ))}
            <button 
              onClick={() => setFilter('Deleted')}
              className={`px-3 py-1 text-xs font-bold uppercase transition-colors border whitespace-nowrap ${filter === 'Deleted' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-border text-red-500/50 hover:border-red-500/50 hover:text-red-500'}`}
            >
              Deleted ({orders.filter(o => o.deleted).length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="glass-punk p-8 text-center text-muted-foreground text-lg">
              No orders found matching the filter.
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-neutral-900/95 border border-neutral-800 shadow-xl p-8 flex flex-col md:flex-row gap-8 rounded-xl">
                
                <div className="flex-1 space-y-6">
                  <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
                    <div>
                      <span className="text-base font-mono text-foreground/70 font-semibold">{new Date(order.date).toLocaleString()}</span>
                      <h4 className="text-3xl font-bebas text-foreground tracking-widest mt-2">
                        {order.id} <span className="text-primary text-xl">[{order.type}]</span>
                      </h4>
                    </div>
                    <span className={`px-4 py-2 text-sm border rounded-full ${getStatusColor(order.status)} uppercase font-bold tracking-wider whitespace-nowrap shadow-md`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                    <div className="bg-neutral-950/80 p-5 rounded-lg border border-neutral-800/50 shadow-inner">
                      <p className="text-sm text-foreground/60 uppercase mb-2 font-bold tracking-widest">Customer</p>
                      <p className="text-foreground font-bold text-xl">{order.fullName}</p>
                      <p className="text-foreground/80 font-mono mt-1">{order.phone}</p>
                    </div>
                    <div className="bg-neutral-950/80 p-5 rounded-lg border border-neutral-800/50 shadow-inner">
                      <p className="text-sm text-foreground/60 uppercase mb-2 font-bold tracking-widest">Location</p>
                      <p className="text-foreground font-bold text-xl">{order.region}</p>
                      <p className="text-foreground/80 text-base truncate mt-1" title={order.address}>{order.address}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-800 pt-6 md:pt-0 md:pl-8">
                  <div className="space-y-4 mb-6">
                    <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 shadow-inner">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-foreground/70 font-bold uppercase tracking-widest text-sm">Advance Paid</span>
                        <span className="text-primary font-mono font-bold text-2xl">{order.advancePaid} TK</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-neutral-800 pt-4">
                        <span className="text-foreground/70 font-bold uppercase tracking-widest text-sm">TrxID</span>
                        <span className="text-foreground font-mono font-bold text-lg">{order.trxId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button onClick={() => setSelectedOrderId(order.id)} className="w-full p-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-base font-bold uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(var(--color-primary),0.4)]">
                      View Full Details
                    </button>
                    {order.deleted ? (
                      <>
                        <button onClick={() => restoreOrder(order.id)} className="w-full p-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/50 transition-all text-sm font-bold uppercase tracking-widest rounded-lg">
                          Restore Order
                        </button>
                        <button onClick={() => setDeleteConfirmId(order.id)} className="w-full p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 transition-all text-sm font-bold uppercase tracking-widest rounded-lg mt-2">
                          Permanently Delete
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(order.id)} className="w-full p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 transition-all text-sm font-bold uppercase tracking-widest rounded-lg">
                        Delete Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] bg-background/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-950 border border-neutral-800 p-8 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bebas tracking-widest text-foreground mb-2">
              {orders.find(o => o.id === deleteConfirmId)?.deleted ? 'PERMANENTLY DELETE?' : 'DELETE ORDER?'}
            </h3>
            <p className="text-muted-foreground mb-8 text-sm">
              {orders.find(o => o.id === deleteConfirmId)?.deleted 
                ? 'This action cannot be undone. The order will be permanently erased.'
                : 'Are you sure you want to move this order to the deleted log? You can restore it later.'}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 p-3 border border-border text-foreground hover:bg-white/5 transition-colors rounded font-bold uppercase text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const o = orders.find(x => x.id === deleteConfirmId);
                  if (o?.deleted) permanentDeleteOrder(deleteConfirmId);
                  else deleteOrder(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 p-3 bg-red-500 text-white hover:bg-red-600 transition-colors rounded font-bold uppercase text-sm shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              >
                {orders.find(o => o.id === deleteConfirmId)?.deleted ? 'Erase Forever' : 'Move to Trash'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
