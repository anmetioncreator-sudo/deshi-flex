export type OrderStatus = 'Pending Verification' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type AdvanceTier = number | 'Custom';
export type DesignType = 'Drop Shoulder' | 'Custom Design Drop Shoulder';
export const DIVISIONS = [
  'Barishal', 'Chattogram', 'Dhaka', 'Khulna', 'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet'
] as const;

export type Region = typeof DIVISIONS[number] | string;

export interface Order {
  id: string; // e.g., "ORD-1234"
  type: 'Standard Custom' | 'Full Image Custom' | 'Direct Checkout';
  date: string; // ISO string
  
  // Customer Info
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  region: Region;
  
  // Custom Design Specific
  designType?: DesignType;
  referenceImage?: string; // base64 or URL
  frontImageName?: string;
  backImageName?: string;
  frontImagePos?: { x: number; y: number; scale: number };
  backImagePos?: { x: number; y: number; scale: number };
  frontPrintSize?: string;
  backPrintSize?: string;
  color?: string; // T-shirt color
  materials?: string;
  description?: string;
  
  // Direct Checkout Specific
  itemId?: string;
  quantity?: number;
  specialNotes?: string;
  
  // Payment
  advancePaid: AdvanceTier;
  trxId: string;
  remainingBalance: number; // COD
  
  // Status
  status: OrderStatus;
  statusNote?: string;
  deleted?: boolean;

  // Anti-Spam / Anti-Cheat
  ipAddress?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'customer' | 'admin' | 'owner';
  createdAt?: string;
}


export interface Category {
  id: string;
  name: string;
  slug: string;
  desc: string;
  bg?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  photoUrl?: string; // legacy
  images?: string[]; // new format
  
  // New fields for Colors, Sizes, and Inventory
  colors?: any[];
  sizes?: string[];
  // inventory[color][size] = quantity
  inventory?: Record<string, Record<string, number>>;
  totalStock?: number;
  
  // Additional fields from products.ts
  slug?: string;
  originalPrice?: number;
  description?: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  stockCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  tagline?: string;
  details?: string[];
  reviews?: any[];
  
  // Cost price & alert threshold
  costPrice?: number;
  lowStockAlert?: number;

  // Media support
  mediaFiles?: { name: string; type: 'image' | 'video'; url: string }[];
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  type: 'RESTOCK' | 'SALE' | 'DAMAGE' | 'RETURN' | 'CORRECTION';
  quantity: number;
  previousStock: number;
  newStock: number;
  costPerUnit?: number | null;
  note?: string | null;
  createdAt: string;
}

export interface ExpenseLog {
  id: string;
  title: string;
  category: 'Fabric/Materials' | 'Printing/Dyeing' | 'Packaging' | 'Marketing/Ads' | 'Delivery/Courier' | 'Operational/Rent' | 'Other' | string;
  amount: number;
  paymentMethod: string;
  date: string;
  note?: string | null;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  costPrice?: number;
}

export interface SaleLog {
  id: string;
  orderId?: string | null;
  channel: string;
  customerName: string;
  customerPhone?: string | null;
  items: SaleItem[];
  totalAmount: number;
  costAmount: number;
  profitAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Partial' | 'Due';
  note?: string | null;
  date: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalCOGS: number;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  netMargin: number;
  stockValuationCost: number;
  stockValuationRetail: number;
  expensesByCategory: Record<string, number>;
  recentExpenses: ExpenseLog[];
}

export interface AnalyticsData {
  summary: {
    totalRevenue: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    totalUnitsSold: number;
    totalOrdersCount: number;
    totalStockUnits: number;
    stockValuationCost: number;
    stockValuationRetail: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalExpenses?: number;
  };
  salesTrend: {
    label: string;
    revenue: number;
    profit: number;
    orders: number;
  }[];
  orderStatusCounts: Record<string, number>;
  topProducts: {
    id: string;
    name: string;
    unitsSold: number;
    revenue: number;
    profit: number;
    image?: string;
    currentStock: number;
  }[];
  lowStockItems: {
    id: string;
    name: string;
    totalStock: number;
    lowStockAlert: number;
    price: number;
    costPrice: number;
    category?: string;
  }[];
  recentSales: SaleLog[];
}

export type ProductColor = any;
export type Review = any;
export type CartItem = any;
export type BlogPost = any;
