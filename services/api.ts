import { OrderItem } from "../types";

// Using relative path to leverage Vite Proxy
const API_URL = '/api/pedidos';
const STORAGE_KEY = 'pizzaone_offline_orders';

// Helper to check if backend is reachable
const isBackendAvailable = async () => {
  try {
    const res = await fetch(API_URL, { method: 'HEAD' });
    return res.ok || res.status === 404; // 404 means route exists but maybe empty, connection is OK
  } catch {
    return false;
  }
};

// --- FALLBACK LOCAL STORAGE IMPLEMENTATION ---
const localApi = {
  getOrders: async (): Promise<OrderItem[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  createOrder: async (order: any) => {
    const current = await localApi.getOrders();
    const newOrder = { ...order, id: Date.now(), criadoEm: new Date().toISOString() };
    const updated = [newOrder, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newOrder;
  },
  updateOrder: async (id: number, updates: any) => {
    const current = await localApi.getOrders();
    const updated = current.map(o => o.id === id ? { ...o, ...updates } : o);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find(o => o.id === id) || null;
  },
  deleteOrder: async (id: number) => {
    const current = await localApi.getOrders();
    const updated = current.filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  },
  clearOrders: async () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// --- MAIN EXPORT ---
export const api = {
  getOrders: async (): Promise<OrderItem[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Falha API');
      return await response.json();
    } catch (error) {
      console.warn('Backend offline, usando LocalStorage');
      return localApi.getOrders();
    }
  },

  createOrder: async (orderData: Omit<OrderItem, 'id' | 'criadoEm'>): Promise<OrderItem> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Falha API');
      return await response.json();
    } catch (error) {
      return localApi.createOrder(orderData);
    }
  },

  deleteOrder: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Falha API');
      return true;
    } catch (error) {
      return localApi.deleteOrder(id);
    }
  },

  updateOrder: async (id: number, updates: Partial<OrderItem>): Promise<OrderItem | null> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Falha API');
      return await response.json();
    } catch (error) {
      return localApi.updateOrder(id, updates);
    }
  },

  clearOrders: async (): Promise<void> => {
    try {
      await fetch(API_URL, { method: 'DELETE' });
    } catch (error) {
      await localApi.clearOrders();
    }
  }
};