import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, ProductColor, Category } from "@/types";
import { PRODUCTS } from "@/data/products";

interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [
        {
          id: "cat-1",
          name: "Drop Shoulder",
          slug: "drop-shoulder",
          desc: "The essential classic fit",
          bg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
        },
        {
          id: "cat-2",
          name: "Custom Drop Shoulder",
          slug: "custom-drop-shoulder",
          desc: "Wear your imagination",
          bg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
        },
        {
          id: "cat-3",
          name: "Over Size Drop Shoulder",
          slug: "over-size-drop-shoulder",
          desc: "Maximum volume streetwear",
          bg: "https://images.unsplash.com/photo-1580087442658-005d5fb5f0c0?q=80&w=800&auto=format&fit=crop",
        },
        {
          id: "cat-4",
          name: "Women Drop Shoulder",
          slug: "women-drop-shoulder",
          desc: "Relaxed feminine elegance",
          bg: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
        },
        {
          id: "cat-5",
          name: "Acid Wash Drop Shoulder",
          slug: "acid-wash-drop-shoulder",
          desc: "Unique vintage fades",
          bg: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
        },
        {
          id: "cat-6",
          name: "Custom Acid Wash",
          slug: "custom-acid-wash-drop-shoulder",
          desc: "Vintage blanks, your art",
          bg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        },
      ],
      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      }))
    }),
    {
      name: "deshiflex-category-storage",
      version: 2,
    }
  )
);

interface CartState {
  items: CartItem[];
  addItem: (product: Product, selectedSize: string, selectedColor: ProductColor, quantity?: number) => void;
  removeItem: (productId: string, selectedSize: string, colorHex: string) => void;
  updateQuantity: (productId: string, selectedSize: string, colorHex: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, selectedSize, selectedColor, quantity = 1) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor.hex === selectedColor.hex
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({
            items: [...currentItems, { product, selectedSize, selectedColor, quantity }],
          });
        }
      },
      removeItem: (productId, selectedSize, colorHex) => {
        const filteredItems = get().items.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.selectedSize === selectedSize &&
              item.selectedColor.hex === colorHex
            )
        );
        set({ items: filteredItems });
      },
      updateQuantity: (productId, selectedSize, colorHex, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedSize, colorHex);
          return;
        }
        const updatedItems = get().items.map((item) =>
          item.product.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor.hex === colorHex
            ? { ...item, quantity }
            : item
        );
        set({ items: updatedItems });
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "deshiflex-cart-storage",
    }
  )
);

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        const currentItems = get().items;
        const isExist = currentItems.some((item) => item.id === product.id);

        if (isExist) {
          set({
            items: currentItems.filter((item) => item.id !== product.id),
          });
        } else {
          set({
            items: [...currentItems, product],
          });
        }
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: "deshiflex-wishlist-storage",
    }
  )
);

interface LanguageState {
  language: "en" | "bn";
  setLanguage: (lang: "en" | "bn") => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "deshiflex-language-storage",
    }
  )
);

interface RecentlyViewedState {
  items: Product[];
  addProduct: (product: Product) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addProduct: (product) => {
        const currentItems = get().items;
        const filteredItems = currentItems.filter((item) => item.id !== product.id);
        // Keep only top 8 recently viewed items
        const updatedItems = [product, ...filteredItems].slice(0, 8);
        set({ items: updatedItems });
      },
    }),
    {
      name: "deshiflex-recently-viewed-storage",
    }
  )
);

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  resetProducts: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: PRODUCTS,
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      resetProducts: () => set({ products: PRODUCTS })
    }),
    {
      name: "deshiflex-products-storage",
      version: 5,
      migrate: (persistedState: any, version: number) => {
        if (version < 5) {
          // Discard old state and use the new PRODUCTS array with the oversize items
          return { products: PRODUCTS };
        }
        return persistedState;
      }
    }
  )
);

interface AdminState {
  isAdmin: boolean;
  role: 'owner' | 'admin' | null;
  username: string | null;
  isLoading: boolean;
  login: (username: string, code: string) => Promise<{ success: boolean; error?: string }>;
  elevateToOwner: (code: string) => Promise<{ success: boolean; error?: string }>;
  checkSession: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      role: null,
      username: null,
      isLoading: false,
      login: async (username, code) => {
        try {
          const res = await fetch('/api/auth/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: code }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            set({ isAdmin: true, role: data.role, username: data.username });
            return { success: true };
          }
          return { success: false, error: data.error || 'Invalid credentials' };
        } catch (err: any) {
          return { success: false, error: err.message || 'Authentication error' };
        }
      },
      elevateToOwner: async (code) => {
        try {
          const res = await fetch('/api/auth/elevate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passcode: code }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            set({ isAdmin: true, role: 'owner' });
            return { success: true };
          }
          return { success: false, error: data.error || 'Invalid Owner Passcode' };
        } catch (err: any) {
          return { success: false, error: err.message || 'Elevation error' };
        }
      },
      checkSession: async () => {
        try {
          const res = await fetch('/api/auth/verify-session');
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated) {
              set({ isAdmin: true, role: data.role, username: data.username });
              return true;
            }
          }
          set({ isAdmin: false, role: null, username: null });
          return false;
        } catch {
          set({ isAdmin: false, role: null, username: null });
          return false;
        }
      },
      logout: async () => {
        try {
          await fetch('/api/auth/admin-logout', { method: 'POST' });
        } catch (e) {
          console.error(e);
        } finally {
          set({ isAdmin: false, role: null, username: null });
        }
      }
    }),
    {
      name: "deshiflex-admin-storage",
    }
  )
);

interface SiteSettingsState {
  heroImages: string[];
  forHimImage: string;
  forHerImage: string;
  updateSettings: (updates: Partial<SiteSettingsState>) => void;
}

export const useSiteSettingsStore = create<SiteSettingsState>()(
  persist(
    (set) => ({
      heroImages: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop",
      ],
      forHimImage: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop",
      forHerImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop",
      updateSettings: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: "deshiflex-site-settings",
    }
  )
);

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

interface UserState {
  isLoggedIn: boolean;
  user: UserAccount | null;
  login: (name: string, email: string, phone?: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (name, email, phone) => set({
        isLoggedIn: true,
        user: {
          id: `usr-${Date.now()}`,
          name,
          email,
          phone,
          createdAt: new Date().toISOString(),
        }
      }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    {
      name: "deshiflex-user-session",
    }
  )
);

