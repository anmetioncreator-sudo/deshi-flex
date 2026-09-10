"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Shield,
  ShieldAlert,
  Search,
  RefreshCw,
  Plus,
  Boxes,
  Receipt,
  Wallet,
  Package,
  Clock,
  Eye,
  X,
  FileSpreadsheet,
  FileCode,
  Lock,
  Unlock,
  KeyRound,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useAdminStore } from "@/store";
import { UnifiedLogItem } from "@/app/api/logs/all/route";

export default function OwnerLogConsole() {
  const role = useAdminStore((state) => state.role);
  const elevateToOwner = useAdminStore((state) => state.elevateToOwner);

  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [isElevating, setIsElevating] = useState(false);

  // Filter & Search states
  const [category, setCategory] = useState<string>("all");
  const [period, setPeriod] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data states
  const [logs, setLogs] = useState<UnifiedLogItem[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    grossRevenueLogged: 0,
    totalProfitLogged: 0,
    totalExpensesLogged: 0,
    totalStockUnitsMoved: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [inspectedLog, setInspectedLog] = useState<UnifiedLogItem | null>(null);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [memoForm, setMemoForm] = useState({ title: "", action: "AUDIT_MEMO", note: "" });
  const [submittingMemo, setSubmittingMemo] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (period !== "all") params.set("period", period);
      if (searchQuery.trim()) params.set("query", searchQuery.trim());
      params.set("limit", "300");

      const res = await fetch(`/api/logs/all?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Error loading master logs:", err);
    } finally {
      setLoading(false);
    }
  }, [category, period, searchQuery]);

  useEffect(() => {
    if (role === "owner") {
      fetchLogs();
    }
  }, [role, fetchLogs]);

  // Handle Passcode elevation
  const handleElevate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError("");
    if (!passcode.trim()) {
      setPasscodeError("Please enter the Owner Passcode");
      return;
    }
    setIsElevating(true);
    setTimeout(() => {
      const success = elevateToOwner(passcode.trim());
      setIsElevating(false);
      if (!success) {
        setPasscodeError("Access Denied: Invalid Owner Passcode");
      } else {
        setPasscode("");
      }
    }, 300);
  };

  // Submit Owner Audit Memo
  const handleCreateMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoForm.note.trim()) return;
    setSubmittingMemo(true);
    try {
      const res = await fetch("/api/logs/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memoForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowMemoModal(false);
        setMemoForm({ title: "", action: "AUDIT_MEMO", note: "" });
        fetchLogs();
      } else {
        alert("Failed to create audit memo: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingMemo(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert("No log records to export.");
      return;
    }

    const headers = [
      "ID",
      "Timestamp",
      "Category",
      "Action",
      "Actor",
      "Title",
      "Description",
      "Amount (BDT)",
      "Profit (BDT)",
      "Quantity",
      "Direction",
      "Reference ID",
    ];

    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.category}"`,
      `"${l.action}"`,
      `"${l.actor || ""}"`,
      `"${(l.title || "").replace(/"/g, '""')}"`,
      `"${(l.description || "").replace(/"/g, '""')}"`,
      l.amount !== undefined ? l.amount : "",
      l.profit !== undefined ? l.profit : "",
      l.quantity !== undefined ? l.quantity : "",
      `"${l.direction}"`,
      `"${l.referenceId || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `deshiflex_owner_master_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (logs.length === 0) {
      alert("No log records to export.");
      return;
    }

    const exportPayload = {
      exportDate: new Date().toISOString(),
      exporter: "Owner Console",
      stats,
      totalRecords: logs.length,
      logs,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `deshiflex_owner_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // STRICT MONOCHROME LOCK SCREEN (BLACK & WHITE ONLY)
  if (role !== "owner") {
    return (
      <div className="min-h-[680px] flex items-center justify-center p-4 sm:p-6 bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-white text-black flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Crown className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs font-mono font-bold uppercase tracking-widest mb-4">
            <Lock className="w-3.5 h-3.5" />
            Owner Security Clearance Required
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bebas tracking-widest text-white uppercase mb-3 leading-none">
            Classified Owner Audit Console
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-8 font-sans">
            This master terminal aggregates live financial cashflow, customer identities, warehouse stock deductions, and executive audit records reserved exclusively for the platform Owner.
          </p>

          <form onSubmit={handleElevate} className="space-y-5">
            <div className="text-left">
              <label className="text-xs font-mono uppercase tracking-widest text-neutral-300 block mb-2 font-bold">
                Owner Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  placeholder="Enter Owner Passcode (e.g. owner or 123456)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-white focus:ring-1 focus:ring-white text-white text-base rounded-2xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-neutral-600 font-mono"
                />
              </div>
              {passcodeError && (
                <p className="text-white bg-neutral-900 border border-neutral-700 p-2 rounded-lg text-xs mt-3 flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 text-white flex-shrink-0" /> {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isElevating}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold uppercase text-xs sm:text-sm tracking-widest transition-all shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              {isElevating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" /> Verifying Passcode...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" /> Unlock Master Log Console
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800 text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-neutral-400" />
            <span>Session encrypted & audited with HMAC SHA-256</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // STRICT MONOCHROME OWNER CONSOLE (BLACK & WHITE ONLY)
  return (
    <div className="space-y-6 text-white bg-black">
      {/* Top Banner & Quick Actions */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                <Crown className="w-3.5 h-3.5" />
                Verified Owner Active
              </div>
              <span className="flex items-center gap-2 text-xs font-mono text-neutral-300 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Central Audit Hub Online
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bebas tracking-widest text-white uppercase m-0 leading-none">
              Owner Master Log Console
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm uppercase tracking-wider mt-2 font-sans">
              Live audit stream of all inventory movements, customer sales, operating expenses, and platform actions.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowMemoModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md font-sans"
            >
              <Plus className="w-4 h-4" /> Post Audit Memo
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer font-sans"
              title="Export all logs to spreadsheet CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" /> Download CSV
            </button>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer font-sans"
              title="Export raw JSON backup"
            >
              <FileCode className="w-4 h-4 text-white" /> Export JSON
            </button>

            <button
              onClick={fetchLogs}
              disabled={loading}
              className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white transition-all cursor-pointer"
              title="Refresh Stream"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-white" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Ribbon - Clean Monochrome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2 font-mono">
            <span className="text-xs uppercase font-bold tracking-wider">Total Audit Events</span>
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            {stats.totalEvents.toLocaleString()}
          </div>
          <span className="text-xs text-neutral-500 font-mono">Platform operations</span>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2 font-mono">
            <span className="text-xs uppercase font-bold tracking-wider">Gross Sales Volume</span>
            <Receipt className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            ৳ {stats.grossRevenueLogged.toLocaleString()}
          </div>
          <span className="text-xs text-neutral-500 font-mono">Recorded store revenue</span>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2 font-mono">
            <span className="text-xs uppercase font-bold tracking-wider">Gross Margin Profit</span>
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            +৳ {stats.totalProfitLogged.toLocaleString()}
          </div>
          <span className="text-xs text-neutral-500 font-mono">Net logged margins</span>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2 font-mono">
            <span className="text-xs uppercase font-bold tracking-wider">Stock Units Moved</span>
            <Boxes className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            {stats.totalStockUnitsMoved.toLocaleString()} <span className="text-xs text-neutral-500">pcs</span>
          </div>
          <span className="text-xs text-neutral-500 font-mono">Restocked & deducted</span>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2 font-mono">
            <span className="text-xs uppercase font-bold tracking-wider">Operational Outflows</span>
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            ৳ {stats.totalExpensesLogged.toLocaleString()}
          </div>
          <span className="text-xs text-neutral-500 font-mono">Logged expenditures</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by customer, phone, product name, order ID, or memo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-white text-white text-xs sm:text-sm rounded-xl pl-11 pr-4 py-3 outline-none transition-all placeholder:text-neutral-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Time range pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: "all", label: "All Time" },
              { id: "today", label: "Today" },
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  period === p.id
                    ? "bg-white text-black font-bold shadow-sm"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-sans">
          {[
            { id: "all", label: "All Operations", icon: Filter },
            { id: "stock", label: "Stock & Inventory", icon: Boxes },
            { id: "sales", label: "Sales & POS", icon: Receipt },
            { id: "finances", label: "Operating Expenses", icon: Wallet },
            { id: "orders", label: "Customer Orders", icon: Package },
            { id: "security", label: "Audit & Security", icon: Shield },
          ].map((c) => {
            const Icon = c.icon;
            const isActive = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Audit Log Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <span className="font-bebas text-2xl tracking-widest uppercase text-white">
              Audit Stream ({logs.length} Events)
            </span>
            {category !== "all" && (
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white text-black uppercase font-bold">
                Filtered: {category}
              </span>
            )}
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            Showing latest entries • Realtime sync
          </span>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-neutral-400 gap-3 font-mono">
            <RefreshCw className="w-8 h-8 animate-spin text-white" />
            <span className="text-xs uppercase tracking-wider">Streaming database audit logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-24 text-center text-neutral-400 font-sans">
            <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
            <p className="text-base font-bold text-white">No audit logs match current filters</p>
            <p className="text-xs text-neutral-500 mt-1">Try clearing your search query or selecting a broader time range.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-xs font-mono uppercase tracking-wider text-neutral-400 bg-neutral-900/80">
                  <th className="py-3.5 px-5">Time & Event ID</th>
                  <th className="py-3.5 px-5">Category / Action</th>
                  <th className="py-3.5 px-6">Title & Operation Details</th>
                  <th className="py-3.5 px-5 text-right">Impact / Amount</th>
                  <th className="py-3.5 px-5">Actor / Origin</th>
                  <th className="py-3.5 px-5 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-mono">
                {logs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  const formattedTime = dateObj.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-neutral-900/60 transition-colors group cursor-pointer"
                      onClick={() => setInspectedLog(log)}
                    >
                      {/* Timestamp */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-bold text-white text-sm">{formattedTime}</div>
                        <div className="text-xs text-neutral-400">{formattedDate}</div>
                        <div className="text-[10px] text-neutral-500 uppercase">{log.id.slice(0, 10)}</div>
                      </td>

                      {/* Category & Action */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border border-neutral-700 bg-neutral-900 text-white">
                          {log.action}
                        </span>
                        <div className="text-[11px] text-neutral-400 uppercase mt-1">
                          {log.category}
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-4 px-6 font-sans">
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{log.title}</span>
                          {log.referenceId && (
                            <span className="text-[10px] font-mono text-neutral-300 bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded">
                              #{log.referenceId.slice(-6)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-1 mt-1">
                          {log.description}
                        </p>
                      </td>

                      {/* Financial / Volume Impact */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        {log.amount !== undefined && (
                          <div className="font-bold text-white text-sm">
                            {log.direction === "inflow" ? "+" : log.direction === "outflow" ? "-" : ""}৳{" "}
                            {log.amount.toLocaleString()}
                          </div>
                        )}
                        {log.profit !== undefined && log.profit > 0 && (
                          <div className="text-xs text-neutral-400 font-medium">
                            Margin: +৳{log.profit.toLocaleString()}
                          </div>
                        )}
                        {log.quantity !== undefined && (
                          <div className="text-xs text-neutral-300 font-bold">
                            {log.quantity} units
                          </div>
                        )}
                      </td>

                      {/* Actor / Origin */}
                      <td className="py-4 px-5 whitespace-nowrap font-sans">
                        <div className="font-medium text-white text-xs sm:text-sm">{log.actor || "System"}</div>
                        <div className="text-xs text-neutral-500 font-mono">
                          {log.category === "sales" ? "POS / Web" : "Admin Core"}
                        </div>
                      </td>

                      {/* Inspect */}
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedLog(log);
                          }}
                          className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                          title="Inspect raw audit record"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Log Modal */}
      <AnimatePresence>
        {inspectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-neutral-950 border border-neutral-700 rounded-3xl p-7 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bebas tracking-wider uppercase text-white m-0">
                      Audit Record Inspector
                    </h3>
                    <span className="text-xs text-neutral-400 font-mono">
                      LOG ID: {inspectedLog.id}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setInspectedLog(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 font-sans">
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 uppercase text-[10px] block mb-1">Timestamp</span>
                    <span className="text-white font-bold">
                      {new Date(inspectedLog.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 uppercase text-[10px] block mb-1">Category & Action</span>
                    <span className="text-white font-bold uppercase">
                      {inspectedLog.category} • {inspectedLog.action}
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                  <span className="text-neutral-400 font-mono uppercase text-[10px] block mb-1">Title & Details</span>
                  <div className="text-white font-bold text-sm mb-1">{inspectedLog.title}</div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{inspectedLog.description}</p>
                </div>

                {inspectedLog.metadata && (
                  <div>
                    <span className="text-neutral-400 font-mono uppercase text-[10px] block mb-1.5">
                      Raw Transaction Payload
                    </span>
                    <pre className="bg-black p-4 rounded-2xl border border-neutral-800 text-xs font-mono text-neutral-200 overflow-x-auto max-h-60 leading-relaxed">
                      {JSON.stringify(inspectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => setInspectedLog(null)}
                  className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Owner Audit Memo Modal */}
      <AnimatePresence>
        {showMemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-neutral-950 border border-neutral-700 rounded-3xl p-7 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <Crown className="w-5 h-5 text-white" />
                  <h3 className="text-2xl font-bebas tracking-wider uppercase text-white m-0">
                    Record Owner Audit Memo
                  </h3>
                </div>
                <button onClick={() => setShowMemoModal(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMemo} className="space-y-4 font-sans">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-1.5 font-bold">
                    Memo Subject / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Warehouse Inventory Verification Check"
                    value={memoForm.title}
                    onChange={(e) => setMemoForm({ ...memoForm, title: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-white text-white text-sm rounded-xl p-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-1.5 font-bold">
                    Action Classification
                  </label>
                  <select
                    value={memoForm.action}
                    onChange={(e) => setMemoForm({ ...memoForm, action: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-white text-white text-sm rounded-xl p-3 outline-none font-mono"
                  >
                    <option value="AUDIT_MEMO">Executive Audit Memo</option>
                    <option value="STOCK_AUDIT">Physical Stock Verification</option>
                    <option value="CASHFLOW_AUDIT">Cashflow & Bank Reconciliation</option>
                    <option value="SECURITY_NOTICE">Security & Access Authorization</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-1.5 font-bold">
                    Detailed Audit Observation / Instructions
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter permanent executive note to be logged into system ledger..."
                    value={memoForm.note}
                    onChange={(e) => setMemoForm({ ...memoForm, note: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-white text-white text-sm rounded-xl p-3 outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMemoModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-semibold uppercase text-neutral-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingMemo}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {submittingMemo ? "Recording..." : "Save to Permanent Ledger"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
