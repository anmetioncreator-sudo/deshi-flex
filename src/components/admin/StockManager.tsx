"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Boxes,
  Search,
  RefreshCw,
  Plus,
  AlertTriangle,
  Check,
  Edit2,
  X,
  History,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  DollarSign,
  Tag,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { StockLog } from "@/types";

interface StockItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug?: string;
  photoUrl?: string | null;
  costPrice: number;
  price: number;
  originalPrice?: number | null;
  totalStock: number;
  stockCount: number;
  lowStockAlert: number;
  unitProfit: number;
  marginPercent: number;
  valuationCost: number;
  valuationRetail: number;
  inStock: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  inventory?: Record<string, Record<string, number>>;
  colors?: any[];
  sizes?: string[];
  updatedAt: string;
}

export default function StockManager() {
  const [activeSubTab, setActiveSubTab] = useState<"present" | "history">("present");
  const [items, setItems] = useState<StockItem[]>([]);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalUnitsInStock: 0,
    totalValuationCost: 0,
    totalValuationRetail: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCostPrice, setEditCostPrice] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editLowAlert, setEditLowAlert] = useState<number>(5);
  const [savingEdit, setSavingEdit] = useState(false);

  // Restock / Adjust Modal
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null);
  const [changeType, setChangeType] = useState<"RESTOCK" | "CORRECTION" | "DAMAGE" | "RETURN">("RESTOCK");
  const [quantityChange, setQuantityChange] = useState<number>(10);
  const [modalCostPerUnit, setModalCostPerUnit] = useState<number>(0);
  const [modalNote, setModalNote] = useState("");
  const [modalColor, setModalColor] = useState<string>("");
  const [modalSize, setModalSize] = useState<string>("");
  const [submittingRestock, setSubmittingRestock] = useState(false);

  // View Variants Modal
  const [variantProduct, setVariantProduct] = useState<StockItem | null>(null);

  const fetchStock = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("query", searchQuery.trim());
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (lowStockOnly) params.set("lowStock", "true");

      const res = await fetch(`/api/stock?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setItems(json.items);
          setSummary(json.summary);
        }
      }
    } catch (err) {
      console.error("Failed to load stock data:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, lowStockOnly]);

  const fetchLogs = useCallback(async () => {
    try {
      setLogsLoading(true);
      const res = await fetch("/api/stock/logs?limit=80");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLogs(json.logs);
        }
      }
    } catch (err) {
      console.error("Failed to load stock logs:", err);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  useEffect(() => {
    if (activeSubTab === "history") {
      fetchLogs();
    }
  }, [activeSubTab, fetchLogs]);

  const startEditing = (item: StockItem) => {
    setEditingId(item.id);
    setEditCostPrice(item.costPrice);
    setEditPrice(item.price);
    setEditLowAlert(item.lowStockAlert);
  };

  const saveInlineEdit = async (productId: string) => {
    try {
      setSavingEdit(true);
      const res = await fetch("/api/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          costPrice: editCostPrice,
          price: editPrice,
          lowStockAlert: editLowAlert,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchStock();
      }
    } catch (err) {
      console.error("Failed to save stock edit:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  const openRestock = (item?: StockItem) => {
    const target = item || items[0] || null;
    setSelectedProduct(target);
    if (target) {
      setModalCostPerUnit(target.costPrice);
      const colors = target.colors?.map((c) => (typeof c === "string" ? c : c.name)) || [];
      const sizes = target.sizes || [];
      setModalColor(colors[0] || "");
      setModalSize(sizes[0] || "");
    }
    setQuantityChange(10);
    setChangeType("RESTOCK");
    setModalNote("");
    setShowRestockModal(true);
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setSubmittingRestock(true);
      const isDeduction = changeType === "DAMAGE" || (changeType === "CORRECTION" && quantityChange < 0);
      const finalQty = isDeduction ? -Math.abs(quantityChange) : Math.abs(quantityChange);

      const payload: any = {
        productId: selectedProduct.id,
        changeType,
        quantity: finalQty,
        costPerUnit: modalCostPerUnit,
        note: modalNote || `${changeType}: ${finalQty > 0 ? "+" : ""}${finalQty} units`,
      };

      if (modalColor && modalSize) {
        payload.variant = { color: modalColor, size: modalSize };
      }

      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowRestockModal(false);
        fetchStock();
        if (activeSubTab === "history") fetchLogs();
      }
    } catch (err) {
      console.error("Failed to adjust stock:", err);
    } finally {
      setSubmittingRestock(false);
    }
  };

  const categoriesList = Array.from(new Set(items.map((i) => i.categorySlug || i.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Top Metric Cards - Spacious & Clear */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total SKUs */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Streetwear SKUs
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
            {summary.totalProducts}
          </div>
          <span className="text-xs text-muted-foreground mt-1.5 block">Active catalog designs</span>
        </div>

        {/* Warehouse Units */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Warehouse Units
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
            {summary.totalUnitsInStock} <span className="text-base text-primary font-sans font-semibold">PCS</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1.5 block">Physical units in stock</span>
        </div>

        {/* Capital Invested */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Capital Invested (Cost)
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
            ৳ {summary.totalValuationCost.toLocaleString()}
          </div>
          <span className="text-xs text-muted-foreground mt-1.5 block">Manufacturing cost basis</span>
        </div>

        {/* Retail Asset Value */}
        <div className="bg-card border border-emerald-500/30 p-5 rounded-xl shadow-sm hover:border-emerald-500/60 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Retail Asset Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">
            ৳ {summary.totalValuationRetail.toLocaleString()}
          </div>
          <span className="text-xs text-neutral-400 mt-1.5 block font-mono">Gross sales potential</span>
        </div>

        {/* Low / Out of Stock */}
        <div className="bg-card border border-amber-500/30 p-5 rounded-xl shadow-sm hover:border-amber-500/60 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
              Low / Out of Stock
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-400 tracking-tight">
              {summary.lowStockCount + summary.outOfStockCount}
            </span>
            <span className="text-xs text-rose-400 font-mono font-bold">
              ({summary.outOfStockCount} depleted)
            </span>
          </div>
          <span className="text-xs text-neutral-400 mt-1.5 block font-mono">Requires factory restock</span>
        </div>
      </div>

      {/* Main Subtabs & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        {/* Subtabs */}
        <div className="flex items-center p-1 bg-background border border-border rounded-lg">
          <button
            id="subtab-present-stock"
            onClick={() => setActiveSubTab("present")}
            className={`px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide rounded-md transition-all flex items-center gap-2 ${
              activeSubTab === "present"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Present Stock</span>
            <span className={`text-xs px-2 py-0.2 rounded-full font-mono font-bold ${activeSubTab === 'present' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {items.length}
            </span>
          </button>
          <button
            id="subtab-stock-logs"
            onClick={() => setActiveSubTab("history")}
            className={`px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide rounded-md transition-all flex items-center gap-2 ${
              activeSubTab === "history"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Stock Movement Log</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            id="btn-open-restock-modal"
            onClick={() => openRestock()}
            className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-bold uppercase text-xs tracking-wider rounded-lg shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Restock / Adjust</span>
          </button>
          <button
            id="btn-refresh-stock"
            onClick={fetchStock}
            className="p-2.5 border border-border bg-background hover:bg-neutral-900 rounded-lg text-neutral-400 hover:text-white transition-colors"
            title="Refresh Stock"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-white" : ""}`} />
          </button>
        </div>
      </div>

      {/* Subtab 1: Present Stock Table */}
      {activeSubTab === "present" && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                id="stock-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, category, or SKU..."
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors font-sans"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                id="stock-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-background border border-border rounded-lg px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white uppercase tracking-wider font-mono"
              >
                <option value="All">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button
                id="stock-low-filter-toggle"
                onClick={() => setLowStockOnly(!lowStockOnly)}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all flex items-center gap-2 ${
                  lowStockOnly
                    ? "bg-white text-black border-white font-bold shadow-sm"
                    : "bg-background text-neutral-400 border-border hover:text-white hover:bg-neutral-900"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Low Stock Only</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-xs tracking-wider font-semibold">
                    <th className="py-4 px-5">Product Details</th>
                    <th className="py-4 px-4 text-center">Present Stock</th>
                    <th className="py-4 px-4 text-right">Cost Price</th>
                    <th className="py-4 px-4 text-right">Selling Price</th>
                    <th className="py-4 px-4 text-right">Unit Profit</th>
                    <th className="py-4 px-4 text-right">Valuation (Cost)</th>
                    <th className="py-4 px-4 text-right">Valuation (Retail)</th>
                    <th className="py-4 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center text-muted-foreground text-sm uppercase tracking-wider">
                        No stock items found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const isEditing = editingId === item.id;

                      return (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                          {/* Product Image & Title */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3.5">
                              {item.photoUrl ? (
                                <img
                                  src={item.photoUrl}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0 bg-muted"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground flex-shrink-0">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-bold text-foreground text-sm block truncate max-w-[260px] hover:text-primary transition-colors">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded font-mono uppercase inline-block mt-1 font-semibold">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Present Stock Count */}
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex flex-col items-center gap-1">
                              <span
                                className={`px-3 py-1 text-sm font-bold font-mono rounded-md border ${
                                  item.isOutOfStock
                                    ? "bg-rose-950/60 text-rose-400 border-rose-800 font-bold"
                                    : item.isLowStock
                                    ? "bg-amber-950/60 text-amber-400 border-amber-800 font-bold"
                                    : "bg-neutral-900 text-neutral-200 border-neutral-800"
                                }`}
                              >
                                {item.totalStock} pcs
                              </span>
                              {item.isLowStock && (
                                <span className="text-[10px] text-amber-400 uppercase font-mono font-bold tracking-tight">
                                  Alert: ≤ {item.lowStockAlert}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Cost Price (Inline Editable) */}
                          <td className="py-4 px-4 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editCostPrice}
                                onChange={(e) => setEditCostPrice(parseFloat(e.target.value) || 0)}
                                className="w-24 bg-neutral-900 border border-white px-2 py-1 text-right font-mono text-sm text-white rounded focus:outline-none"
                              />
                            ) : (
                              <span className="text-sm font-semibold font-mono text-white">
                                ৳ {item.costPrice.toLocaleString()}
                              </span>
                            )}
                          </td>

                          {/* Selling Price (Inline Editable) */}
                          <td className="py-4 px-4 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                                className="w-24 bg-neutral-900 border border-white px-2 py-1 text-right font-mono text-sm text-white rounded focus:outline-none"
                              />
                            ) : (
                              <span className="text-sm font-bold font-mono text-white">
                                ৳ {item.price.toLocaleString()}
                              </span>
                            )}
                          </td>

                          {/* Unit Profit */}
                          <td className="py-4 px-4 text-right font-mono">
                            <span className="text-sm font-bold text-emerald-400 block">
                              +৳ {(item.price - (isEditing ? editCostPrice : item.costPrice)).toLocaleString()}
                            </span>
                            <span className="text-xs text-emerald-400/80">
                              {item.marginPercent}% margin
                            </span>
                          </td>

                          {/* Valuation Cost */}
                          <td className="py-4 px-4 text-right font-mono text-sm text-neutral-400 font-semibold">
                            ৳ {item.valuationCost.toLocaleString()}
                          </td>

                          {/* Valuation Retail */}
                          <td className="py-4 px-4 text-right font-mono text-sm font-bold text-emerald-400">
                            ৳ {item.valuationRetail.toLocaleString()}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isEditing ? (
                                <button
                                  onClick={() => saveInlineEdit(item.id)}
                                  disabled={savingEdit}
                                  className="p-2 bg-white text-black hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
                                  title="Save Changes"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => startEditing(item)}
                                  className="p-2 bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 rounded-md transition-colors cursor-pointer"
                                  title="Edit Cost & Prices"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => openRestock(item)}
                                className="px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-bold uppercase rounded-md transition-colors"
                              >
                                Restock
                              </button>

                              {item.inventory && Object.keys(item.inventory).length > 0 && (
                                <button
                                  onClick={() => setVariantProduct(item)}
                                  className="px-2.5 py-1.5 bg-muted/30 border border-border text-muted-foreground hover:text-foreground text-xs uppercase rounded-md transition-colors font-medium"
                                  title="View Sizes & Colors breakdown"
                                >
                                  Sizes
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Stock Movement Audit Log */}
      {activeSubTab === "history" && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-lg font-bebas tracking-widest text-foreground uppercase m-0">
                AUDIT LOG OF STOCK MOVEMENTS
              </h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                Every intake, deduction, offline sale, and correction recorded with timestamps
              </p>
            </div>
            <button
              onClick={fetchLogs}
              className="p-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${logsLoading ? "animate-spin text-primary" : ""}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground uppercase text-xs tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4 text-center">Movement Type</th>
                  <th className="py-3.5 px-4 text-center">Delta Quantity</th>
                  <th className="py-3.5 px-4 text-center">Previous → New</th>
                  <th className="py-3.5 px-4 text-right">Cost Basis</th>
                  <th className="py-3.5 px-4">Audit Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono text-sm">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-muted-foreground font-sans uppercase text-xs">
                      No stock movement entries recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isPositive = log.quantity > 0;

                    let typeBadge = "bg-neutral-900 text-neutral-400 border-neutral-700";
                    if (log.type === "RESTOCK") typeBadge = "bg-white text-black font-bold border-white";
                    if (log.type === "SALE") typeBadge = "bg-neutral-900 text-white border-neutral-700";
                    if (log.type === "DAMAGE") typeBadge = "bg-neutral-800 text-neutral-300 border-neutral-600 line-through";
                    if (log.type === "RETURN") typeBadge = "bg-neutral-900 text-white border-neutral-700";

                    return (
                      <tr key={log.id} className="hover:bg-neutral-900/30 transition-colors">
                        <td className="py-3.5 px-4 text-neutral-400 text-xs">
                          {new Date(log.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-sans font-bold text-white">{log.productName}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold rounded border ${typeBadge}`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`font-bold font-mono ${
                              isPositive ? "text-white" : "text-neutral-400"
                            }`}
                          >
                            {isPositive ? `+${log.quantity}` : log.quantity} pcs
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-muted-foreground">
                          {log.previousStock} → <strong className="text-foreground">{log.newStock}</strong>
                        </td>
                        <td className="py-3.5 px-4 text-right text-muted-foreground">
                          {log.costPerUnit ? `৳ ${log.costPerUnit.toLocaleString()}` : "-"}
                        </td>
                        <td className="py-3.5 px-4 font-sans text-muted-foreground text-xs truncate max-w-[240px]">
                          {log.note || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock & Adjustment Modal */}
      {showRestockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-neutral-700 p-6 sm:p-8 rounded-3xl max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowRestockModal(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bebas tracking-widest text-white m-0 uppercase">
                INVENTORY RESTOCK & ADJUSTMENT
              </h3>
            </div>
            <p className="text-xs text-neutral-400 uppercase tracking-wider mb-6 font-sans">
              Record incoming stock shipments or correct on-hand counts
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4 font-sans">
              <div>
                <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                  Product Selection
                </label>
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const p = items.find((it) => it.id === e.target.value);
                    if (p) {
                      setSelectedProduct(p);
                      setModalCostPerUnit(p.costPrice);
                    }
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                >
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.name} (Current: {it.totalStock} pcs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Adjustment Type
                  </label>
                  <select
                    value={changeType}
                    onChange={(e) => setChangeType(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                  >
                    <option value="RESTOCK">Supplier Restock (+)</option>
                    <option value="RETURN">Customer Return (+)</option>
                    <option value="DAMAGE">Damaged / Defect (-)</option>
                    <option value="CORRECTION">Manual Correction</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Quantity Delta
                  </label>
                  <input
                    type="number"
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(parseInt(e.target.value) || 0)}
                    placeholder="10"
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white font-mono rounded-xl focus:outline-none focus:border-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                  Unit Cost Price (৳ BDT)
                </label>
                <input
                  type="number"
                  value={modalCostPerUnit}
                  onChange={(e) => setModalCostPerUnit(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white font-mono rounded-xl focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                  Audit Memo / Supplier Batch
                </label>
                <input
                  type="text"
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="e.g. Received shipment from Gazipur factory batch #402"
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-5 py-2.5 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold uppercase rounded-xl hover:bg-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRestock}
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-bold uppercase text-xs tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {submittingRestock ? "RECORDING..." : "CONFIRM ADJUSTMENT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Variants Breakdown Modal */}
      {variantProduct && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-2xl max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setVariantProduct(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bebas tracking-widest text-white mb-1 uppercase">
              VARIANT BREAKDOWN: {variantProduct.name}
            </h3>
            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider mb-6">
              Total Units: {variantProduct.totalStock} pcs across sizes and colors
            </p>

            <div className="space-y-4">
              {variantProduct.inventory && Object.keys(variantProduct.inventory).length > 0 ? (
                Object.entries(variantProduct.inventory).map(([color, sizesMap]) => (
                  <div key={color} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                    <span className="text-sm font-bold text-white block mb-2 font-sans">{color}</span>
                    <div className="grid grid-cols-4 gap-2.5">
                      {Object.entries(sizesMap as Record<string, number>).map(([sz, qty]) => (
                        <div key={sz} className="bg-black border border-neutral-800 p-2.5 rounded-lg text-center font-mono">
                          <span className="text-[10px] text-neutral-400 block uppercase font-bold">{sz}</span>
                          <span className={`text-base font-bold ${qty <= 0 ? "text-neutral-500 line-through" : "text-white"}`}>
                            {qty} pcs
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-400 text-center py-4 font-mono">No variant matrix configured.</p>
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setVariantProduct(null)}
                className="px-6 py-2.5 bg-white text-black hover:bg-neutral-200 font-bold uppercase text-xs tracking-wider rounded-lg transition-colors cursor-pointer font-sans"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
