export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  locationId: string;
  amount: number;
  minStock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  notes?: string;
  userId: string;
  createdAt: string;
}

export interface DashboardStats {
  totalItems: number;
  totalCategories: number;
  lowStockItems: number;
  recentMovements: number;
}
