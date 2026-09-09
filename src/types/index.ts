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
  
  // Media support
  mediaFiles?: { name: string; type: 'image' | 'video'; url: string }[];
}

export type ProductColor = any;
export type Review = any;
export type CartItem = any;
export type BlogPost = any;
