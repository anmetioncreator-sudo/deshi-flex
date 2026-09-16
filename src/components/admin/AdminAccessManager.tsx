"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Search,
  Crown,
  User,
  Mail,
  RotateCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Users,
  Sparkles,
} from "lucide-react";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
}

export default function AdminAccessManager() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");

  // Form state for granting admin access
  const [targetEmail, setTargetEmail] = useState("");
  const [targetName, setTargetName] = useState("");
  const [targetRole, setTargetRole] = useState<"admin" | "customer">("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Copied email state
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users || []);
      } else {
        console.error("Failed to load users:", data.error);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Granting/Revoking Role
  const handleUpdateRole = async (email: string, newRole: "admin" | "customer", name?: string) => {
    setIsSubmitting(true);
    setFormMsg(null);

    try {
      const res = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role: newRole, name: name?.trim() || undefined }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormMsg({
          type: "success",
          text: `Success! ${email} is now updated to '${newRole}' role. They can now enter the dashboard directly via the button.`,
        });
        setTargetEmail("");
        setTargetName("");
        await fetchUsers();
      } else {
        setFormMsg({
          type: "error",
          text: data.error || "Failed to update account role.",
        });
      }
    } catch {
      setFormMsg({
        type: "error",
        text: "Network failure while updating account privileges.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q));

    if (roleFilter === "admin") {
      return matchesSearch && (u.role === "admin" || u.role === "owner");
    }
    if (roleFilter === "customer") {
      return matchesSearch && u.role === "customer";
    }
    return matchesSearch;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin" || u.role === "owner").length;
  const customerCount = users.filter((u) => u.role === "customer").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title & Description */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bebas tracking-widest text-white uppercase flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-white" />
          ADMIN ACCESS &amp; TEAM PERMISSIONS
        </h2>
        <p className="text-neutral-400 text-xs mt-1 font-mono uppercase tracking-wider">
          Grant administrator clearance to registered Gmail / customer accounts. Authorized admins can enter the Control Vault directly via the storefront navigation button.
        </p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        {/* Total Accounts */}
        <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1 font-bold uppercase">
            <span>Total Registered</span>
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="text-3xl font-bold text-white font-bebas tracking-wider">{totalUsers}</div>
          <div className="text-[11px] text-neutral-500 mt-1">Accounts in database</div>
        </div>

        {/* Total Admins */}
        <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-1 font-bold uppercase">
            <span>Active Administrators</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-bebas tracking-wider">{adminCount}</div>
          <div className="text-[11px] text-neutral-500 mt-1">Full vault dashboard clearance</div>
        </div>

        {/* Regular Customers */}
        <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1 font-bold uppercase">
            <span>Storefront Customers</span>
            <User className="h-4 w-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold text-white font-bebas tracking-wider">{customerCount}</div>
          <div className="text-[11px] text-neutral-500 mt-1">Standard customer accounts</div>
        </div>
      </div>

      {/* SECTION 1: GRANT ACCESS FORM CARD */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-7 rounded-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Grant Admin Access to Gmail Account
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Enter the email address of any registered account or partner to immediately upgrade their privileges.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300">
            <Sparkles className="w-3 h-3 text-amber-400" /> Instant Access Sync
          </span>
        </div>

        {/* Status Message */}
        {formMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-mono font-semibold flex items-center gap-3 ${
              formMsg.type === "success"
                ? "bg-emerald-950/40 border border-emerald-800/60 text-emerald-300"
                : "bg-red-950/40 border border-red-800/60 text-red-300"
            }`}
          >
            {formMsg.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            )}
            <span>{formMsg.text}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateRole(targetEmail, targetRole, targetName);
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4"
        >
          {/* Target Email */}
          <div className="sm:col-span-5">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono font-bold mb-1.5 block">
              Registered Account Gmail / Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="e.g. partner@gmail.com"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-white px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors font-mono text-white placeholder-neutral-600"
              />
            </div>
          </div>

          {/* Target Name (Optional) */}
          <div className="sm:col-span-3">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono font-bold mb-1.5 block">
              Full Name (Optional)
            </label>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g. Tanvir Ahmed"
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-white px-4 py-3 text-sm rounded-xl focus:outline-none transition-colors font-mono text-white placeholder-neutral-600"
            />
          </div>

          {/* Role Choice */}
          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono font-bold mb-1.5 block">
              Assign Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as "admin" | "customer")}
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-white px-3 py-3 text-sm rounded-xl focus:outline-none transition-colors font-mono text-white"
            >
              <option value="admin">Administrator</option>
              <option value="customer">Customer (Revoke)</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isSubmitting || !targetEmail}
              className="w-full bg-white text-black hover:bg-neutral-200 py-3.5 px-4 text-xs font-mono tracking-wider font-bold transition-all rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" /> Grant Access
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-neutral-500 font-mono">
          💡 <strong>Pro Tip:</strong> Even if this Gmail hasn&apos;t registered yet, granting access will pre-authorize the email in the system. As soon as the user logs in via Google or Email OTP, they will instantly see the <strong>&quot;Admin Vault&quot;</strong> button on the storefront.
        </p>
      </div>

      {/* SECTION 2: REGISTERED ACCOUNTS ROSTER */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-400" />
              Registered User Accounts Roster ({filteredUsers.length})
            </h3>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
              Click &quot;Grant Admin&quot; to give vault access or &quot;Revoke Admin&quot; to restore customer-only view.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="self-start sm:self-auto text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Roster</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Gmail, name, or phone..."
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-white pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none transition-colors font-mono text-white placeholder-neutral-600"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                roleFilter === "all"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              All ({totalUsers})
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                roleFilter === "admin"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              Admins Only ({adminCount})
            </button>
            <button
              onClick={() => setRoleFilter("customer")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                roleFilter === "customer"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              Customers ({customerCount})
            </button>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-neutral-900 text-neutral-400 text-[10px] uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">User Account</th>
                <th className="py-3 px-4">Email / Gmail</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 bg-neutral-950">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-white" />
                    <span>Loading registered accounts...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isOwner = user.role === "owner";
                  const isAdmin = user.role === "admin";
                  const isCustomer = user.role === "customer";

                  return (
                    <tr key={user.id} className="hover:bg-neutral-900/60 transition-colors">
                      {/* Name & Initials */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-white shrink-0">
                            {user.name ? user.name.slice(0, 2).toUpperCase() : "DF"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate max-w-[180px]">{user.name}</div>
                            <div className="text-[10px] text-neutral-500 truncate max-w-[180px]">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span className="truncate max-w-[220px]">{user.email}</span>
                          <button
                            onClick={() => copyToClipboard(user.email)}
                            className="p-1 text-neutral-500 hover:text-white transition-colors"
                            title="Copy email"
                          >
                            {copiedEmail === user.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-neutral-400">
                        {user.phone || "—"}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        {isOwner ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-black shadow-sm">
                            <Crown className="w-3 h-3 text-black" />
                            <span>System Owner</span>
                          </span>
                        ) : isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Administrator</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-700">
                            <User className="w-3 h-3" />
                            <span>Customer</span>
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        {isOwner ? (
                          <span className="text-[10px] text-neutral-500 italic">Protected Master</span>
                        ) : isCustomer ? (
                          <button
                            onClick={() => handleUpdateRole(user.email, "admin", user.name)}
                            disabled={isSubmitting}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-[11px] font-bold transition-all shadow-sm flex items-center gap-1.5 ml-auto cursor-pointer disabled:opacity-50"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Make Admin</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateRole(user.email, "customer", user.name)}
                            disabled={isSubmitting}
                            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/40 border border-neutral-700 hover:border-red-600/60 text-neutral-300 hover:text-red-400 text-[11px] font-bold transition-all flex items-center gap-1.5 ml-auto cursor-pointer disabled:opacity-50"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Revoke Admin</span>
                          </button>
                        )}
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
  );
}
