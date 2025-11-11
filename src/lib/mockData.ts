import { User, ItemCategory, Location, Item, StockMovement } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@inventory.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@inventory.com',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

export const mockCategories: ItemCategory[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and components' },
  { id: '2', name: 'Furniture', description: 'Office and home furniture' },
  { id: '3', name: 'Stationery', description: 'Office supplies and stationery' },
  { id: '4', name: 'Tools', description: 'Hardware tools and equipment' },
];

export const mockLocations: Location[] = [
  { id: '1', name: 'Warehouse A', description: 'Main storage facility' },
  { id: '2', name: 'Warehouse B', description: 'Secondary storage' },
  { id: '3', name: 'Store Front', description: 'Retail display area' },
  { id: '4', name: 'Office', description: 'Office storage' },
];

export const mockItems: Item[] = [
  {
    id: '1',
    code: 'ELEC-001',
    name: 'Laptop Dell XPS 15',
    categoryId: '1',
    locationId: '1',
    amount: 15,
    minStock: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'FURN-001',
    name: 'Office Chair Ergonomic',
    categoryId: '2',
    locationId: '2',
    amount: 3,
    minStock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    code: 'STAT-001',
    name: 'A4 Paper (500 sheets)',
    categoryId: '3',
    locationId: '4',
    amount: 25,
    minStock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    itemId: '1',
    type: 'in',
    quantity: 10,
    notes: 'New stock arrival',
    userId: '1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    itemId: '2',
    type: 'out',
    quantity: 5,
    notes: 'Office setup',
    userId: '2',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];
