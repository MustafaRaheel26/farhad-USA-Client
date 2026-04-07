export type OrderStatus = 'new' | 'preparing' | 'ready';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: string;
  discount?: number; // percentage
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: number;
  isUrgent?: boolean;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  averagePrepTime: string;
}
