"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  CreditCard,
  Plus,
  Trash2,
  RefreshCw,
  PieChart,
  Calendar,
  X,
  FileText,
  Boxes,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { ExpenseLog, FinancialSummary } from "@/types";

export default function FinanceManager() {
  const [summary, setSummary] = useState<
    Omit<FinancialSummary, "recentExpenses" | "expensesByCategory"> & { totalStockUnits: number }
  >({
    totalRevenue: 0,
    totalCOGS: 0,
    grossProfit: 0,
    totalExpenses: 0,
    netProfit: 0,
    netMargin: 0,
    stockValuationCost: 0,
    stockValuationRetail: 0,
    totalStockUnits: 0,
  });

  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "month" | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Add Expense Modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Fabric/Materials");
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expensePaymentMethod, setExpensePaymentMethod] = useState("Cash");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [submittingExpense, setSubmittingExpense] = useState(false);

  const fetchFinances = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (period !== "all") params.set("period", period);
      if (selectedCategory !== "All") params.set("category", selectedCategory);

      const res = await fetch(`/api/finances?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSummary(json.summary);
          setExpenses(json.expenses);
          setExpensesByCategory(json.expensesByCategory || {});
        }
      }
    } catch (err) {
      console.error("Failed to load financial data:", err);
    } finally {
      setLoading(false);
    }
  }, [period, selectedCategory]);

  useEffect(() => {
    fetchFinances();
  }, [fetchFinances]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    try {
      setSubmittingExpense(true);
      const res = await fetch("/api/finances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: expenseTitle,
          category: expenseCategory,
          amount: expenseAmount,
          paymentMethod: expensePaymentMethod,
          date: expenseDate ? new Date(expenseDate) : new Date(),
          note: expenseNote,
        }),
      });

      if (res.ok) {
        setShowExpenseModal(false);
        setExpenseTitle("");
        setExpenseAmount(0);
        setExpenseNote("");
        fetchFinances();
      }
    } catch (err) {
      console.error("Failed to record expense:", err);
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense record?")) return;
    try {
      const res = await fetch(`/api/finances?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchFinances();
      }
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  const categories = [
    "Fabric/Materials",
    "Printing/Dyeing",
    "Packaging",
    "Marketing/Ads",
    "Delivery/Courier",
    "Operational/Rent",
    "Other",
  ];

  return (
    <div className="space-y-6">
      {/* P&L Executive Statement Card */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
          <div>
            <h3 className="text-2xl font-bebas tracking-widest text-foreground uppercase m-0 flex items-center gap-2.5">
              <Wallet className="w-6 h-6 text-primary" />
              FINANCIAL STATEMENT & PROFIT & LOSS (P&L)
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Net income ledger calculating gross margins against operational expenditures
            </p>
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
                  { key: "all", label: "All" },
                ] as const
              ).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                    period === p.key
                      ? "bg-primary text-primary-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchFinances}
              className="p-2.5 border border-border bg-background hover:bg-muted/40 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh Finances"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
            </button>
          </div>
        </div>

        {/* P&L Flow Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-mono">
          {/* Revenue */}
          <div className="p-4 bg-background border border-border rounded-xl">
            <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider block mb-1">
              [+] Gross Revenue
            </span>
            <span className="text-2xl font-bold font-mono text-foreground tracking-tight block">
              ৳ {summary.totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-sans mt-1 block">100% Topline Sales</span>
          </div>

          {/* Cost of Goods Sold */}
          <div className="p-4 bg-background border border-border rounded-xl">
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-400 tracking-wider block mb-1">
              [-] Product Cost (COGS)
            </span>
            <span className="text-2xl font-bold font-mono text-rose-400 tracking-tight block">
              ৳ {summary.totalCOGS.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 font-mono mt-1 block">Garment blanks & fabric</span>
          </div>

          {/* Gross Margin */}
          <div className="p-4 bg-background border border-border rounded-xl">
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-400 tracking-wider block mb-1">
              [=] Gross Margin
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight block">
              ৳ {summary.grossProfit.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-bold font-mono mt-1 block">
              {summary.totalRevenue > 0 ? Math.round((summary.grossProfit / summary.totalRevenue) * 100) : 0}% Gross
            </span>
          </div>

          {/* Operating Expenses */}
          <div className="p-4 bg-background border border-border rounded-xl">
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-400 tracking-wider block mb-1">
              [-] Operating Expenses
            </span>
            <span className="text-2xl font-bold font-mono text-amber-400 tracking-tight block">
              ৳ {summary.totalExpenses.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 font-mono mt-1 block">Packaging, Courier, Ads</span>
          </div>

          {/* Net Profit */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-400 tracking-wider block mb-1">
              [=] Net Profit
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight block">
              ৳ {summary.netProfit.toLocaleString()}
            </span>
            <span className="text-xs bg-emerald-500 text-black px-2.5 py-0.5 rounded font-bold font-mono uppercase inline-block mt-1">
              {summary.netMargin}% Net Margin
            </span>
          </div>
        </div>
      </div>

      {/* Capital & Warehouse Asset Valuation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase font-bold text-neutral-400 tracking-wider">
              Capital in Warehouse
            </span>
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <span className="text-3xl font-bold font-mono text-white block">
            ৳ {summary.stockValuationCost.toLocaleString()}
          </span>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Cash locked in present physical inventory ({summary.totalStockUnits} total garments).
          </p>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase font-bold text-neutral-400 tracking-wider">
              Projected Retail Return
            </span>
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <span className="text-3xl font-bold font-mono text-white block">
            ৳ {summary.stockValuationRetail.toLocaleString()}
          </span>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Expected gross revenue once entire on-hand inventory is sold at store prices.
          </p>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase font-bold text-neutral-400 tracking-wider">
              Unrealized Inventory Profit
            </span>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-3xl font-bold font-mono text-white block">
            ৳ {(summary.stockValuationRetail - summary.stockValuationCost).toLocaleString()}
          </span>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Potential margin waiting in warehouse stock ready to be converted to cash.
          </p>
        </div>
      </div>

      {/* Expense Tracker Header & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Progress */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bebas tracking-widest text-foreground uppercase mb-1">
            EXPENDITURE ALLOCATION
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">
            Where your company money is being spent
          </p>

          <div className="space-y-3.5 font-mono">
            {categories.map((cat) => {
              const amount = expensesByCategory[cat] || 0;
              const pct = summary.totalExpenses > 0 ? Math.round((amount / summary.totalExpenses) * 100) : 0;

              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-sans font-medium">{cat}</span>
                    <span className="font-bold text-foreground">
                      ৳ {amount.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h3 className="text-lg font-bebas tracking-widest text-foreground uppercase m-0">
                OPERATIONAL EXPENSES LEDGER
              </h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                Log purchases, material batches, courier fees, and advertising bills
              </p>
            </div>

            <button
              id="btn-log-expense-modal"
              onClick={() => setShowExpenseModal(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-bold uppercase text-xs tracking-wider rounded-lg flex items-center gap-2 hover:opacity-90 shadow-sm transition-opacity"
            >
              <Plus className="w-4 h-4" /> + Log Expense
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground uppercase text-xs tracking-wider font-semibold font-sans">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Title & Memo</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Payment Channel</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono text-sm">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground font-sans uppercase text-xs">
                      No expenses logged for this period. Click &apos;+ Log Expense&apos; to add one.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3.5 px-4 text-muted-foreground text-xs font-sans">
                        {new Date(exp.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="font-bold text-foreground block text-sm">{exp.title}</span>
                        {exp.note && <span className="text-xs text-muted-foreground block mt-0.5">{exp.note}</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 text-xs uppercase font-semibold rounded border border-border bg-muted/30 text-muted-foreground">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-xs uppercase font-sans font-medium">
                        {exp.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-rose-400 font-mono text-sm">
                        -৳ {exp.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-neutral-700 p-6 sm:p-8 rounded-3xl max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowExpenseModal(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bebas tracking-widest text-white m-0 uppercase">
                RECORD BUSINESS EXPENDITURE
              </h3>
            </div>
            <p className="text-xs text-neutral-400 uppercase tracking-wider mb-6 font-sans">
              Track manufacturing, logistics, marketing, or overhead costs
            </p>

            <form onSubmit={handleAddExpense} className="space-y-4 font-sans">
              <div>
                <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                  Expense Title *
                </label>
                <input
                  type="text"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. 50m Heavyweight French Terry Cotton"
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Amount (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    value={expenseAmount || ""}
                    onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
                    placeholder="5000"
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white font-mono rounded-xl focus:outline-none focus:border-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Payment Channel
                  </label>
                  <select
                    value={expensePaymentMethod}
                    onChange={(e) => setExpensePaymentMethod(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                  >
                    <option value="Cash">Cash on Hand</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank">Bank Wire Transfer</option>
                    <option value="Card">Corporate Card</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                    Date of Expense
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase font-semibold text-neutral-300 block mb-1.5">
                  Vendor Memo / Invoice #
                </label>
                <input
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  placeholder="e.g. Memo #INV-8839 from Narayanganj textile mill"
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white rounded-xl focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-5 py-2.5 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold uppercase rounded-xl hover:bg-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingExpense}
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-bold uppercase text-xs tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {submittingExpense ? "RECORDING..." : "CONFIRM EXPENSE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
