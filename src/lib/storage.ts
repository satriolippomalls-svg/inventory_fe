import { User, Item, StockMovement, ItemCategory, Location } from '@/types';
import { mockUsers, mockItems, mockStockMovements, mockCategories, mockLocations } from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'inventory_current_user',
  USERS: 'inventory_users',
  ITEMS: 'inventory_items',
  MOVEMENTS: 'inventory_movements',
  CATEGORIES: 'inventory_categories',
  LOCATIONS: 'inventory_locations',
};

// Initialize storage with mock data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(mockItems));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MOVEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(mockStockMovements));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(mockLocations));
  }
};

// Auth
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  // Mock password check (in real app, use proper auth)
  if (user && password === 'password') {
    setCurrentUser(user);
    return user;
  }
  return null;
};

export const logout = () => {
  setCurrentUser(null);
};

// Users
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// Items
export const getItems = (): Item[] => {
  const items = localStorage.getItem(STORAGE_KEYS.ITEMS);
  return items ? JSON.parse(items) : [];
};

export const saveItems = (items: Item[]) => {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
};

// Stock Movements
export const getStockMovements = (): StockMovement[] => {
  const movements = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
  return movements ? JSON.parse(movements) : [];
};

export const saveStockMovements = (movements: StockMovement[]) => {
  localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
};

// Categories
export const getCategories = (): ItemCategory[] => {
  const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return categories ? JSON.parse(categories) : [];
};

export const saveCategories = (categories: ItemCategory[]) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

// Locations
export const getLocations = (): Location[] => {
  const locations = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
  return locations ? JSON.parse(locations) : [];
};

export const saveLocations = (locations: Location[]) => {
  localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
};
