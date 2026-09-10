"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Package,
  Boxes,
  AlertTriangle,
  ShoppingBag,
  ArrowUpRight,
  RefreshCw,
  Plus,
  CreditCard,
  BarChart3,
  Calendar,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { AnalyticsData } from "@/types";

interface Props {
  onNavigateTab?: (tab: string) => void;
}

export default function AnalyticsDashboard({ onNavigateTab }: Props) {
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "month" | "all">("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [activeChartMetric, setActiveChartMetric] = useState<"revenue" | "profit">("revenue");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const summary = data?.summary || {
    totalRevenue: 0,
    grossProfit: 0,
    netProfit: 0,
    profitMargin: 0,
    totalUnitsSold: 0,
    totalOrdersCount: 0,
    totalStockUnits: 0,
    stockValuationCost: 0,
    stockValuationRetail: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalExpenses: 0,
  };

  const salesTrend = data?.salesTrend || [];
  const maxTrendVal = Math.max(
    ...salesTrend.map((t) => (activeChartMetric === "revenue" ? t.revenue : t.profit)),
    1
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase m-0 leading-none">
                EXECUTIVE ANALYTICS TERMINAL
              </h2>
              <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 font-mono uppercase font-bold rounded-full border border-primary/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-medium">
              Real-time revenue, gross & net margins, stock valuation, and demand forecast
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center bg-background border border-border p-1 rounded-lg">
            {(
              [
                { key: "today", label: "Today" },
                { key: "7d", label: "7D" },
                { key: "30d", label: "30D" },
                { key: "month", label: "Month" },
                { key: "all", label: "All Time" },
              ] as const
            ).map((p) => (
              <button
                key={p.key}
                id={`btn-period-${p.key}`}
                onClick={() => setPeriod(p.key)}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                  period === p.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            id="btn-refresh-analytics"
            onClick={fetchAnalytics}
            className="p-2.5 border border-border bg-background hover:bg-muted/40 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Primary KPI Ribbon - Spacious and High Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-neutral-600 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">
              ৳ {summary.totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-neutral-400 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 border-t border-border pt-2.5 font-mono">
            <span>Orders: {summary.totalOrdersCount}</span>
            <span>AOV: ৳ {summary.totalOrdersCount > 0 ? Math.round(summary.totalRevenue / summary.totalOrdersCount).toLocaleString() : 0}</span>
          </div>
        </motion.div>

        {/* Net Profit */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-emerald-500/30 p-5 rounded-xl shadow-sm hover:border-emerald-500/60 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Net Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-emerald-400">
              ৳ {summary.netProfit.toLocaleString()}
            </span>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
              {summary.profitMargin}% Margin
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 border-t border-border pt-2.5 font-mono">
            <span>Gross: <strong className="text-emerald-300">৳ {summary.grossProfit.toLocaleString()}</strong></span>
            <span>Expenses: <strong className="text-rose-400">৳ {(summary.totalExpenses || 0).toLocaleString()}</strong></span>
          </div>
        </motion.div>

        {/* Stock Valuation */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-neutral-600 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400">
              Stock Asset Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">
              ৳ {summary.stockValuationCost.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-neutral-400 font-semibold">
              Cost Basis
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 border-t border-border pt-2.5 font-mono">
            <span>On Hand: {summary.totalStockUnits} pcs</span>
            <span className="text-white font-bold">Retail: ৳ {summary.stockValuationRetail.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Volume & Health */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-neutral-600 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400">
              Volume & Health
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-3xl font-bold font-mono tracking-tight text-white">
                {summary.totalUnitsSold}
              </span>
              <span className="text-xs text-neutral-400 ml-1.5 uppercase font-mono font-bold">Units Sold</span>
            </div>
            {summary.lowStockCount > 0 && (
              <span className="text-xs bg-neutral-900 text-white border border-neutral-700 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3 h-3" /> {summary.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 border-t border-border pt-2.5 font-mono">
            <span>Out of Stock: {summary.outOfStockCount}</span>
            <span className="text-white font-bold">In Stock: {summary.totalStockUnits > 0 ? "Active" : "Depleted"}</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-card border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" /> Rapid Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateTab && (
            <>
              <button
                id="quick-action-stock"
                onClick={() => onNavigateTab("stock")}
                className="px-4 py-2 bg-background hover:bg-neutral-900 border border-border hover:border-neutral-500 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Boxes className="w-3.5 h-3.5 text-white" /> Present Stock & Restock
              </button>
              <button
                id="quick-action-sales"
                onClick={() => onNavigateTab("sales")}
                className="px-4 py-2 bg-background hover:bg-neutral-900 border border-border hover:border-neutral-500 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5 text-white" /> Record Offline / POS Sale
              </button>
              <button
                id="quick-action-finances"
                onClick={() => onNavigateTab("finances")}
                className="px-4 py-2 bg-background hover:bg-neutral-900 border border-border hover:border-neutral-500 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-3.5 h-3.5 text-white" /> Add Expense
              </button>
            </>
          )}
        </div>
      </div>

      {/* Interactive Sales & Profit Trend Chart */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border pb-4">
          <div>
            <h3 className="text-xl font-bebas tracking-widest text-foreground uppercase m-0 flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-white" />
              FINANCIAL TRAJECTORY & REVENUE TIMELINE
            </h3>
            <p className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5 font-mono">
              Interactive timeline visualizing income stream and margin performance
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-background border border-border rounded-lg">
            <button
              id="chart-metric-rev"
              onClick={() => setActiveChartMetric("revenue")}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                activeChartMetric === "revenue"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Revenue View
            </button>
            <button
              id="chart-metric-profit"
              onClick={() => setActiveChartMetric("profit")}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                activeChartMetric === "profit"
                  ? "bg-emerald-500 text-black shadow-lg font-bold"
                  : "text-neutral-400 hover:text-emerald-400"
              }`}
            >
              Net Profit View
            </button>
          </div>
        </div>

        {/* Visual Trend Bars */}
        {salesTrend.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 text-sm uppercase font-mono tracking-wider">
            No sales recorded in the selected period.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-64 sm:h-72 flex items-end gap-2 sm:gap-4 pt-10 pb-2 px-2 border-b border-border/60 overflow-x-auto">
              {salesTrend.map((bar, idx) => {
                const val = activeChartMetric === "revenue" ? bar.revenue : bar.profit;
                const heightPercent = maxTrendVal > 0 ? Math.max(10, Math.round((val / maxTrendVal) * 100)) : 10;
                return (
                  <div
                    key={idx}
                    className="flex-1 min-w-[36px] sm:min-w-[52px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-3 py-1.5 text-xs font-mono whitespace-nowrap pointer-events-none z-20 border border-neutral-700 rounded-md shadow-2xl">
                      <div className="font-bold">{bar.label}</div>
                      <div>Rev: ৳ {bar.revenue.toLocaleString()}</div>
                      <div className="text-emerald-400 font-bold">Profit: ৳ {bar.profit.toLocaleString()}</div>
                    </div>

                    {/* Bar Value Indicator */}
                    <span className="text-[10px] font-mono text-neutral-400 mb-1.5 group-hover:text-white transition-colors">
                      {val > 0 ? `৳${Math.round(val / 1000)}k` : "0"}
                    </span>

                    {/* Bar Element */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 relative ${
                        activeChartMetric === "revenue"
                          ? "bg-white group-hover:bg-neutral-200"
                          : "bg-emerald-500 group-hover:bg-emerald-400"
                      }`}
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-md" />
                    </div>

                    {/* Label below bar */}
                    <span className="text-[11px] font-mono text-neutral-400 uppercase mt-2.5 group-hover:text-white font-semibold">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono pt-1">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-white rounded-sm inline-block" /> Revenue Trend
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" /> Net Profit
                </span>
              </div>
              <span className="font-semibold text-white">Peak: ৳ {maxTrendVal.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Top-Selling Products & Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-Selling Products Leaderboard */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h3 className="text-lg font-bebas tracking-widest text-foreground uppercase m-0 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-white" />
              TOP PERFORMING STREETWEAR
            </h3>
            <span className="text-xs font-mono text-neutral-400 uppercase font-semibold">By Sales Volume</span>
          </div>

          <div className="flex-1 space-y-3">
            {(!data?.topProducts || data.topProducts.length === 0) ? (
              <p className="text-sm text-neutral-400 py-10 text-center font-mono">No sales data recorded yet.</p>
            ) : (
              data.topProducts.map((p, idx) => {
                const maxSold = Math.max(...data.topProducts.map((i) => i.unitsSold), 1);
                const progressPct = Math.min(100, Math.round((p.unitsSold / maxSold) * 100));

                return (
                  <div key={p.id || idx} className="p-4 bg-muted/20 border border-border rounded-xl hover:border-neutral-500 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 bg-neutral-900 border border-neutral-700 rounded flex items-center justify-center text-xs font-mono font-bold text-white">
                          0{idx + 1}
                        </span>
                        <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[280px]">
                          {p.name}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-sm font-bold text-white">৳ {p.revenue.toLocaleString()}</span>
                        <span className="text-xs text-emerald-400 block font-semibold">+৳ {p.profit.toLocaleString()} profit</span>
                      </div>
                    </div>

                    <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden my-2 border border-neutral-800">
                      <div
                        style={{ width: `${progressPct}%` }}
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                      <span>Volume: <strong className="text-white">{p.unitsSold} pcs sold</strong></span>
                      <span>Stock on Hand: <strong className={p.currentStock <= 5 ? "text-amber-400 underline font-bold" : "text-white"}>{p.currentStock} pcs</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Low Stock Watchlist & Order Status */}
        <div className="space-y-6">
          {/* Low Stock Watchlist */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-lg font-bebas tracking-widest text-white uppercase m-0 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                CRITICAL INVENTORY WATCHLIST
              </h3>
              <span className="text-xs font-mono text-amber-400/80 uppercase font-semibold">
                Threshold: ≤ 5 units
              </span>
            </div>

            {(!data?.lowStockItems || data.lowStockItems.length === 0) ? (
              <div className="py-8 text-center text-sm font-mono text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> All product stock levels healthy.
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.lowStockItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-background border border-border hover:border-neutral-500 rounded-lg transition-colors shadow-sm"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5">
                        Price: ৳ {item.price} | Cost: ৳ {item.costPrice}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                          item.totalStock <= 0
                            ? "bg-rose-950/60 text-rose-400 border-rose-800"
                            : "bg-amber-950/60 text-amber-400 border-amber-800"
                        }`}
                      >
                        {item.totalStock <= 0 ? "OUT OF STOCK" : `${item.totalStock} LEFT`}
                      </span>
                      {onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab("stock")}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase rounded transition-colors font-mono cursor-pointer"
                        >
                          Restock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Status Distribution */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-lg font-bebas tracking-widest text-white uppercase m-0 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                PIPELINE STATUS DISTRIBUTION
              </h3>
              <span className="text-xs font-mono text-neutral-400 uppercase font-semibold">Fulfillment</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(data?.orderStatusCounts || {}).map(([st, count]) => {
                const isDelivered = st.toLowerCase().includes("delivered");
                const isProcessing = st.toLowerCase().includes("processing");
                const isShipped = st.toLowerCase().includes("shipped");
                const isCancelled = st.toLowerCase().includes("cancel");
                const colorClass = isDelivered
                  ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-400"
                  : isProcessing
                  ? "border-blue-500/30 bg-blue-950/40 text-blue-400"
                  : isShipped
                  ? "border-purple-500/30 bg-purple-950/40 text-purple-400"
                  : isCancelled
                  ? "border-rose-500/30 bg-rose-950/40 text-rose-400"
                  : "border-amber-500/30 bg-amber-950/40 text-amber-400";

                return (
                  <div key={st} className={`p-3.5 border rounded-lg text-center ${colorClass}`}>
                    <div className="text-2xl font-bebas tracking-wider leading-none mb-1">{count}</div>
                    <div className="text-[11px] uppercase font-mono font-bold tracking-wider truncate opacity-90">{st}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
