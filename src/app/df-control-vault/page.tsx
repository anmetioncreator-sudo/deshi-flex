"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import StockManager from "@/components/admin/StockManager";
import SalesLedger from "@/components/admin/SalesLedger";
import FinanceManager from "@/components/admin/FinanceManager";
import CatalogManager from "@/components/admin/CatalogManager";
import OrderQueue from "@/components/admin/OrderQueue";
import LogisticsMap from "@/components/admin/LogisticsMap";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";
import OwnerLogConsole from "@/components/admin/OwnerLogConsole";
import {
  Settings,
  Package,
  Map,
  LayoutDashboard,
  LogOut,
  Sliders,
  BarChart3,
  Boxes,
  Receipt,
  Wallet,
  ExternalLink,
  ShieldCheck,
  Crown,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useAdminStore } from "@/store";
import { useRouter } from "next/navigation";

export type AdminTab =
  | "analytics"
  | "queue"
  | "stock"
  | "sales"
  | "finances"
  | "catalog"
  | "map"
  | "settings"
  | "owner-logs";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("stock");
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const role = useAdminStore((state) => state.role);
  const logout = useAdminStore((state) => state.logout);
  const checkSession = useAdminStore((state) => state.checkSession);
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let mounted = true;
    checkSession().then((authenticated) => {
      if (mounted) {
        setIsVerifying(false);
        if (!authenticated) {
          router.push("/df-control-vault/login");
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [checkSession, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/df-control-vault/login");
  };

  if (isVerifying || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-mono tracking-widest text-sm space-y-4">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <p className="uppercase tracking-[0.3em] text-neutral-400 text-xs">Authenticating Vault Access...</p>
      </div>
    );
  }

  interface NavItem {
    id: AdminTab;
    label: string;
    icon: any;
    badge?: string;
    isOwner?: boolean;
  }

  const navItems: NavItem[] = [
    { id: "analytics", label: "Analytics Terminal", icon: BarChart3, badge: "Live" },
    { id: "queue", label: "Order Queue", icon: Package },
    { id: "stock", label: "Present Stock & Inventory", icon: Boxes, badge: "Stock" },
    { id: "sales", label: "Sales Log & POS", icon: Receipt },
    { id: "finances", label: "Money & Finances", icon: Wallet },
    { id: "catalog", label: "Catalog Manager", icon: Settings },
    { id: "map", label: "Logistics Map", icon: Map },
    { id: "settings", label: "Site Settings", icon: Sliders },
    { id: "owner-logs", label: "Owner Log Console", icon: Crown, badge: "Owner", isOwner: true },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50 px-6 py-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bebas text-2xl sm:text-3xl tracking-widest text-white m-0 leading-none">
                DF CONTROL VAULT
              </h1>
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">
                DESHI FLEX ERP 2.0 • MONOCHROME EDITION
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === "owner" ? (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black text-xs font-mono font-bold tracking-wider shadow-sm">
                <Crown className="w-3.5 h-3.5" />
                <span>OWNER ACCESS</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>STAFF SESSION</span>
              </div>
            )}

            <Link
              href="/admin/email-preview"
              className="text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:border-emerald-500"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Engine</span>
            </Link>

            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:border-neutral-500"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 lg:w-80 flex-shrink-0 bg-neutral-950 border-r border-neutral-800 hidden md:flex flex-col p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4 px-3">
            <span className="text-[11px] text-neutral-400 uppercase font-bold tracking-widest font-mono">
              Operations & Control
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-white bg-neutral-900 px-2.5 py-0.5 rounded-full border border-neutral-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Live
            </span>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-[13px] font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-white text-black font-bold shadow-md"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4.5 h-4.5 flex-shrink-0 ${
                        isActive ? "text-black" : "text-neutral-300"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase ml-2 flex-shrink-0 ${
                        isActive
                          ? "bg-neutral-200 text-black"
                          : "bg-neutral-900 text-neutral-300 border border-neutral-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/80">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-[11px] uppercase font-bold text-white tracking-wider font-mono">
                Encrypted Core Online
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono">HMAC_SHA256_SESSION_VERIFIED</p>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 border-t border-border z-50 flex overflow-x-auto py-2 px-2 gap-1 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-1.5 text-[10px] font-bold tracking-wider whitespace-nowrap rounded-md transition-colors ${
                  isActive ? "bg-white text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 pb-24 md:pb-10 bg-background">
          <div className="max-w-[1650px] w-full mx-auto">
            <AnimatePresence mode="wait">
              {/* 1. Analytics Dashboard */}
              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <AnalyticsDashboard onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />
                </motion.div>
              )}

              {/* 2. Order Queue */}
              {activeTab === "queue" && (
                <motion.div
                  key="queue"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">
                      Order Queue Management
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">
                      Verify customer payments, update delivery statuses, and dispatch garments.
                    </p>
                  </div>
                  <OrderQueue />
                </motion.div>
              )}

              {/* 3. Present Stock & Inventory */}
              {activeTab === "stock" && (
                <motion.div
                  key="stock"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">
                      Present Stock & Inventory Hub
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">
                      Track live stock levels, unit manufacturing costs, warehouse asset valuation, and restock logs.
                    </p>
                  </div>
                  <StockManager />
                </motion.div>
              )}

              {/* 4. Sales Log & POS */}
              {activeTab === "sales" && (
                <motion.div
                  key="sales"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">
                      Sales Log & Cashflow Ledger
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">
                      Detailed ledger of online orders and manual counter/POS sales with automatic stock deduction.
                    </p>
                  </div>
                  <SalesLedger />
                </motion.div>
              )}

              {/* 5. Money & Finances */}
              {activeTab === "finances" && (
                <motion.div
                  key="finances"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">
                      Money Management & Profit & Loss
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">
                      P&L calculations, capital invested in warehouse blanks, and operational expense tracking.
                    </p>
                  </div>
                  <FinanceManager />
                </motion.div>
              )}

              {/* 6. Catalog Manager */}
              {activeTab === "catalog" && (
                <motion.div
                  key="catalog"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">
                      Catalog & Product Management
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">
                      Add new apparel collections, media galleries, categories, and descriptions.
                    </p>
                  </div>
                  <CatalogManager />
                </motion.div>
              )}

              {/* 7. Logistics Map */}
              {activeTab === "map" && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">
                      Logistics & Geographic Map
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">
                      Visualize delivery distributions across Bangladesh.
                    </p>
                  </div>
                  <LogisticsMap />
                </motion.div>
              )}

              {/* 8. Site Settings */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bebas tracking-widest text-foreground uppercase">
                      Site Configuration
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">
                      Configure hero banners and landing page content.
                    </p>
                  </div>
                  <SiteSettingsManager />
                </motion.div>
              )}

              {/* 9. Owner Master Log Console */}
              {activeTab === "owner-logs" && (
                <motion.div
                  key="owner-logs"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <OwnerLogConsole />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
