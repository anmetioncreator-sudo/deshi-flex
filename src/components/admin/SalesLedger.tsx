"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Receipt,
  Search,
  Filter,
  RefreshCw,
  Plus,
  DollarSign,
  TrendingUp,
  Download,
  X,
  Trash2,
  CheckCircle2,
  Calendar,
  Smartphone,
  CreditCard,
  Layers,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { SaleLog } from "@/types";

export default function SalesLedger() {
  const [sales, setSales] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalSalesCount: 0,
    totalUnitsSold: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    marginPercent: 0,
    aov: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "month" | "all">("all");
  const [channel, setChannel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Record Sale Modal
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [saleChannel, setSaleChannel] = useState("Store Counter / POS");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Partial" | "Due">("Paid");
  const [saleNote, setSaleNote] = useState("");
  const [submittingSale, setSubmittingSale] = useState(false);

  // Line items in modal
  const [saleLines, setSaleLines] = useState<
    { productId: string; name: string; size: string; color: string; quantity: number; unitPrice: number; costPrice: number }[]
  >([]);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (period !== "all") params.set("period", period);
      if (channel !== "All") params.set("channel", channel);
      if (searchQuery.trim()) params.set("query", searchQuery.trim());

      const res = await fetch(`/api/sales?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSales(json.sales);
          setSummary(json.summary);
        }
      }
    } catch (err) {
      console.error("Failed to load sales:", err);
    } finally {
      setLoading(false);
    }
  }, [period, channel, searchQuery]);

  const loadCatalog = async () => {
    try {
      const res = await fetch("/api/stock");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.items) {
          setCatalogProducts(json.items);
          if (saleLines.length === 0 && json.items.length > 0) {
            const first = json.items[0];
            const firstColor = first.colors?.[0]?.name || first.colors?.[0] || "Black";
            const firstSize = first.sizes?.[0] || "M";
            setSaleLines([
              {
                productId: first.id,
                name: first.name,
                size: firstSize,
                color: firstColor,
                quantity: 1,
                unitPrice: first.price,
                costPrice: first.costPrice || Math.round(first.price * 0.52),
              },
            ]);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load catalog:", e);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const openRecordSale = () => {
    loadCatalog();
    setCustomerName("");
    setCustomerPhone("");
    setSaleNote("");
    setPaymentMethod("Cash");
    setPaymentStatus("Paid");
    setShowRecordModal(true);
  };

  const addSaleLine = () => {
    if (catalogProducts.length === 0) return;
    const first = catalogProducts[0];
    const firstColor = first.colors?.[0]?.name || first.colors?.[0] || "Black";
    const firstSize = first.sizes?.[0] || "M";
    setSaleLines([
      ...saleLines,
      {
        productId: first.id,
        name: first.name,
        size: firstSize,
        color: firstColor,
        quantity: 1,
        unitPrice: first.price,
        costPrice: first.costPrice || Math.round(first.price * 0.52),
      },
    ]);
  };

  const updateSaleLine = (index: number, updates: Partial<typeof saleLines[0]>) => {
    setSaleLines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const removeSaleLine = (index: number) => {
    setSaleLines((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleProductSelect = (index: number, prodId: string) => {
    const prod = catalogProducts.find((p) => p.id === prodId);
    if (!prod) return;
    const firstColor = prod.colors?.[0]?.name || prod.colors?.[0] || "Black";
    const firstSize = prod.sizes?.[0] || "M";
    updateSaleLine(index, {
      productId: prod.id,
      name: prod.name,
      unitPrice: prod.price,
      costPrice: prod.costPrice || Math.round(prod.price * 0.52),
      color: firstColor,
      size: firstSize,
    });
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || saleLines.length === 0) return;

    try {
      setSubmittingSale(true);
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          channel: saleChannel,
          paymentMethod,
          paymentStatus,
          note: saleNote,
          items: saleLines,
        }),
      });

      if (res.ok) {
        setShowRecordModal(false);
        fetchSales();
      }
    } catch (err) {
      console.error("Failed to record sale:", err);
    } finally {
      setSubmittingSale(false);
    }
  };

  const exportCSV = () => {
    if (sales.length === 0) return;
    const headers = ["Date", "ID", "Channel", "Customer", "Phone", "Items", "Revenue_BDT", "Cost_BDT", "Profit_BDT", "Payment_Method", "Status"];
    const rows = sales.map((s) => [
      new Date(s.date).toISOString().split("T")[0],
      s.id,
      s.channel,
      `"${s.customerName.replace(/"/g, '""')}"`,
      s.customerPhone || "",
      `"${s.items.map((i: any) => `${i.name} (${i.quantity}x)`).join(", ")}"`,
      s.totalAmount,
      s.costAmount,
      s.profitAmount,
      s.paymentMethod,
      s.paymentStatus,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `deshi-flex-sales-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modalTotal = saleLines.reduce((acc, l) => acc + (l.unitPrice || 0) * (l.quantity || 1), 0);
  const modalCost = saleLines.reduce((acc, l) => acc + (l.costPrice || 0) * (l.quantity || 1), 0);
  const modalProfit = modalTotal - modalCost;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Total Sales Count
          </span>
          <span className="text-3xl font-bold font-mono text-foreground">{summary.totalSalesCount}</span>
          <span className="text-xs text-muted-foreground block mt-1">Orders processed</span>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Items / Units Sold
          </span>
          <span className="text-3xl font-bold font-mono text-primary">{summary.totalUnitsSold} PCS</span>
          <span className="text-xs text-muted-foreground block mt-1">Physical garment volume</span>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Sales Revenue
          </span>
          <span className="text-3xl font-bold font-mono text-foreground">
            ৳ {summary.totalRevenue.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground block mt-1">Gross sales collected</span>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Product Cost (COGS)
          </span>
          <span className="text-3xl font-bold font-mono text-muted-foreground">
            ৳ {summary.totalCost.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground block mt-1">Blanks manufacturing</span>
        </div>

        <div className="bg-card border border-emerald-500/30 p-5 rounded-xl shadow-sm sm:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            Gross Margin Profit
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              ৳ {summary.totalProfit.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              {summary.marginPercent}%
            </span>
          </div>
          <span className="text-xs text-neutral-400 block mt-1 font-mono">Net gross markup</span>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center bg-background border border-border p-1 rounded-lg">
            {(
              [
                { key: "today", label: "Today" },
                { key: "7d", label: "7D" },
                { key: "30d", label: "30D" },
                { key: "month", label: "Month" },
                { key: "all", label: "All" },
              ] as const
            ).map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                  period === p.key
                    ? "bg-white text-black shadow-sm font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Channel Filter */}
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="bg-background border border-border text-white text-xs font-semibold px-4 py-2 rounded-lg uppercase focus:outline-none focus:border-white font-mono"
          >
            <option value="All">All Channels</option>
            <option value="Online Store">Online Store</option>
            <option value="Store Counter / POS">Store Counter / POS</option>
            <option value="Facebook / WhatsApp">Facebook / WhatsApp</option>
            <option value="Wholesale">Wholesale</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-record-sale-modal"
            onClick={openRecordSale}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-wider rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Sale / POS</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 border border-border bg-background hover:bg-muted/40 text-foreground text-xs font-semibold uppercase rounded-lg flex items-center gap-2 transition-colors"
            title="Download CSV Ledger"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchSales}
            className="p-2.5 border border-border bg-background hover:bg-muted/40 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone number, or sale ID..."
            className="w-full bg-background border border-border/80 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Sales Log Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-xs tracking-wider font-semibold">
                <th className="py-4 px-5">Date & Time</th>
                <th className="py-4 px-4">Sale ID & Channel</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Items Sold</th>
                <th className="py-4 px-4 text-right">Revenue</th>
                <th className="py-4 px-4 text-right">Cost (COGS)</th>
                <th className="py-4 px-4 text-right">Net Profit</th>
                <th className="py-4 px-4 text-center">Payment</th>
                <th className="py-4 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono text-sm">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-muted-foreground font-sans uppercase text-sm">
                    No sales found in this period. Click &apos;+ Record Sale / POS&apos; to register one.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => {
                  const isOnline = sale.channel === "Online Store";

                  return (
                    <tr key={sale.id} className="hover:bg-muted/20 transition-colors">
                      {/* Date */}
                      <td className="py-4 px-5 text-muted-foreground text-xs font-sans">
                        {new Date(sale.date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* ID & Channel */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-white block text-sm font-mono">{sale.orderId || sale.id}</span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border inline-block mt-1 font-mono ${
                            isOnline
                              ? "bg-neutral-900 text-white border-neutral-700"
                              : "bg-neutral-800 text-neutral-300 border-neutral-600"
                          }`}
                        >
                          {sale.channel}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4 font-sans">
                        <span className="font-bold text-white block text-sm">{sale.customerName}</span>
                        <span className="text-xs text-neutral-400 font-mono mt-0.5 block">
                          {sale.customerPhone || "Walk-in Buyer"}
                        </span>
                      </td>

                      {/* Items Sold */}
                      <td className="py-4 px-4 font-sans">
                        <div className="space-y-1 max-w-[240px]">
                          {sale.items?.map((it: any, idx: number) => (
                            <div key={idx} className="text-xs text-neutral-200 truncate flex items-center gap-1.5">
                              <span className="font-mono font-bold text-black bg-white px-1.5 py-0.2 rounded text-[11px]">
                                {it.quantity}x
                              </span>
                              <span className="truncate">{it.name} {it.size ? `(${it.size})` : ""}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="py-4 px-4 text-right font-bold text-white font-mono text-sm">
                        ৳ {sale.totalAmount.toLocaleString()}
                      </td>

                      {/* Cost */}
                      <td className="py-4 px-4 text-right text-neutral-400 font-mono text-sm">
                        ৳ {sale.costAmount.toLocaleString()}
                      </td>

                      {/* Profit */}
                      <td className="py-4 px-4 text-right font-mono">
                        <span className="text-emerald-400 font-bold block text-sm">
                          +৳ {sale.profitAmount.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-emerald-400/80 font-mono">
                          {sale.totalAmount > 0
                            ? `${Math.round((sale.profitAmount / sale.totalAmount) * 100)}% margin`
                            : "0%"}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-4 text-center text-xs text-neutral-300 uppercase font-mono font-semibold">
                        {sale.paymentMethod || "Cash"}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-5 text-center">
                        <span
                          className={`px-3 py-1 text-xs uppercase font-bold rounded-md border font-mono ${
                            sale.paymentStatus === "Paid"
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                              : sale.paymentStatus === "Partial"
                              ? "bg-amber-950/60 text-amber-400 border-amber-800"
                              : "bg-rose-950/60 text-rose-400 border-rose-800"
                          }`}
                        >
                          {sale.paymentStatus || "Paid"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Counter / POS Sale Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-neutral-700 p-6 sm:p-8 rounded-3xl max-w-2xl w-full relative shadow-2xl my-8">
            <button
              onClick={() => setShowRecordModal(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bebas tracking-widest text-white m-0 uppercase">
                RECORD OFFLINE / COUNTER SALE
              </h3>
            </div>
            <p className="text-xs text-neutral-400 uppercase tracking-wider mb-6 font-sans">
              Instantly register customer purchase, log revenue & deduct inventory
            </p>

            <form onSubmit={handleRecordSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Shakib Al Hasan"
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white font-mono rounded-xl focus:outline-none focus:border-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Sales Channel
                  </label>
                  <select
                    value={saleChannel}
                    onChange={(e) => setSaleChannel(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white transition-all"
                  >
                    <option value="Store Counter / POS">Store Counter / POS</option>
                    <option value="Facebook / WhatsApp">Facebook / WhatsApp</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Exhibition / Pop-up">Exhibition / Pop-up</option>
                  </select>
                </div>
              </div>

              {/* Items Line Builder */}
              <div className="space-y-3 border border-neutral-800 p-4 bg-neutral-900/60 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-white font-mono">Items Purchased</span>
                  <button
                    type="button"
                    onClick={addSaleLine}
                    className="text-xs font-bold uppercase bg-white hover:bg-neutral-200 text-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-mono"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item Line
                  </button>
                </div>

                {saleLines.map((line, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-2.5 border-b border-neutral-800 pb-3 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-[200px]">
                      <select
                        value={line.productId}
                        onChange={(e) => handleProductSelect(idx, e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-xs sm:text-sm text-white rounded-lg focus:outline-none focus:border-white"
                      >
                        {catalogProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (৳{p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-20">
                      <input
                        type="text"
                        value={line.size}
                        onChange={(e) => updateSaleLine(idx, { size: e.target.value })}
                        placeholder="Size"
                        className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-xs text-white uppercase font-mono text-center rounded-lg focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="w-24">
                      <input
                        type="text"
                        value={line.color}
                        onChange={(e) => updateSaleLine(idx, { color: e.target.value })}
                        placeholder="Color"
                        className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-xs text-white font-mono text-center rounded-lg focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => updateSaleLine(idx, { quantity: parseInt(e.target.value) || 1 })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-xs font-mono text-center rounded-lg focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="w-28">
                      <input
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) => updateSaleLine(idx, { unitPrice: parseFloat(e.target.value) || 0 })}
                        placeholder="Price"
                        className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-xs font-mono text-right rounded-lg focus:outline-none focus:border-white"
                      />
                    </div>

                    {saleLines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSaleLine(idx)}
                        className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Payment Channel
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                  >
                    <option value="Cash">Cash at Counter</option>
                    <option value="bKash">bKash Merchant / Personal</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Card">POS Card Swipe</option>
                    <option value="COD">Cash on Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                  >
                    <option value="Paid">Fully Paid</option>
                    <option value="Partial">Partial Advance</option>
                    <option value="Due">Payment Due</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                  Sale Memo / Reference
                </label>
                <input
                  type="text"
                  value={saleNote}
                  onChange={(e) => setSaleNote(e.target.value)}
                  placeholder="e.g. Receipt #5021 or Instagram DM reference"
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                />
              </div>

              {/* Financial Calculation Bar */}
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between font-mono text-sm">
                <div>
                  <span className="text-neutral-400 text-xs block">Total Cost:</span>
                  <span className="font-bold text-white">৳ {modalCost.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-xs block">Total Sale:</span>
                  <span className="text-lg font-bold text-white">৳ {modalTotal.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-xs block">Projected Profit:</span>
                  <span className="font-bold text-white">+৳ {modalProfit.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-5 py-2.5 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold uppercase rounded-xl hover:bg-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSale}
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-bold uppercase text-xs tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {submittingSale ? "RECORDING..." : "COMPLETE SALE & DEDUCT STOCK"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
