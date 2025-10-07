import { Product } from '@/types';

const API_BASE = '/api';

export const api = {
  products: {

    getAll: (category?: string): Promise<{ success: boolean; data: Product[] }> => {
      const url = category ? `${API_BASE}/products?category=${category}` : `${API_BASE}/products`;
      return fetch(url).then(res => res.json());
    },

    getById: (id: number): Promise<{ success: boolean; data: Product }> => 
      fetch(`${API_BASE}/products/${id}`).then(res => res.json()),

    create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => 
      fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),

    update: (id: number, data: Partial<Product>) => 
      fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
      
    delete: (id: number) => 
      fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' }).then(res => res.json()),
  },
};