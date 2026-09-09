import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, Product, OrderStatus } from '../types';

interface AppState {
  orders: Order[];
  products: Product[];
  isLoadingOrders: boolean;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updateOrderStatusNote: (id: string, note: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  restoreOrder: (id: string) => Promise<void>;
  permanentDeleteOrder: (id: string) => Promise<void>;
  addProduct: (product: Product) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      orders: [],
      products: [],
      isLoadingOrders: false,

      fetchOrders: async () => {
        try {
          set({ isLoadingOrders: true });
          const res = await fetch('/api/orders?deleted=true');
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.orders)) {
              set({ orders: data.orders });
            }
          }
        } catch (err) {
          console.error('Failed to fetch orders from database:', err);
        } finally {
          set({ isLoadingOrders: false });
        }
      },

      addOrder: async (order) => {
        // Optimistically add to state
        set((state) => ({ orders: [order, ...state.orders.filter(o => o.id !== order.id)] }));

        // Persist to Prisma Database
        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            // Revert optimistic add
            set((state) => ({ orders: state.orders.filter(o => o.id !== order.id) }));
            throw new Error(data.error || 'Failed to submit order');
          }
        } catch (err: any) {
          console.error('Failed to save order to database:', err);
          set((state) => ({ orders: state.orders.filter(o => o.id !== order.id) }));
          throw err;
        }
      },


      updateOrderStatus: async (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }));

        try {
          await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          });
        } catch (err) {
          console.error('Failed to update order status in database:', err);
        }
      },

      updateOrderStatusNote: async (id, note) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, statusNote: note } : o)),
        }));

        try {
          await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statusNote: note }),
          });
        } catch (err) {
          console.error('Failed to update order note in database:', err);
        }
      },

      deleteOrder: async (id) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, deleted: true } : o)),
        }));

        try {
          await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deleted: true }),
          });
        } catch (err) {
          console.error('Failed to mark order deleted in database:', err);
        }
      },

      restoreOrder: async (id) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, deleted: false } : o)),
        }));

        try {
          await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deleted: false }),
          });
        } catch (err) {
          console.error('Failed to restore order in database:', err);
        }
      },

      permanentDeleteOrder: async (id) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        }));

        try {
          await fetch(`/api/orders/${id}`, {
            method: 'DELETE',
          });
        } catch (err) {
          console.error('Failed to delete order from database:', err);
        }
      },

      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
    }),
    {
      name: 'deshi-flex-storage',
    }
  )
);
