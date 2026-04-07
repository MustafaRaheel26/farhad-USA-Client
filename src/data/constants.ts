import { Order, Category, MenuItem } from '@/types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-101',
    tableNumber: 'T-04',
    customerName: 'Alice Johnson',
    status: 'preparing',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
    items: [
      { id: 'i1', name: 'Classic Burger', quantity: 2 },
      { id: 'i2', name: 'Truffle Fries', quantity: 1, notes: 'Extra crispy' },
      { id: 'i3', name: 'Coke Zero', quantity: 2 }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-102',
    tableNumber: 'T-12',
    customerName: 'Bob Smith',
    status: 'new',
    timestamp: Date.now() - 1000 * 60 * 2, // 2 mins ago
    isUrgent: true,
    items: [
      { id: 'i4', name: 'Margherita Pizza', quantity: 1 },
      { id: 'i5', name: 'Garlic Bread', quantity: 1 }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-103',
    tableNumber: 'T-08',
    customerName: 'Charlie Brown',
    status: 'ready',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    items: [
      { id: 'i6', name: 'Caesar Salad', quantity: 1 },
      { id: 'i7', name: 'Grilled Salmon', quantity: 1 }
    ]
  }
];

export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Drinks', icon: 'Coffee' },
  { id: 'cat2', name: 'Fast Food', icon: 'Pizza' },
  { id: 'cat3', name: 'Pizza', icon: 'Pizza' },
  { id: 'cat4', name: 'Burger', icon: 'Utensils' },
];

export const MENU_ITEMS_DATA: MenuItem[] = [
  {
    id: 'm1',
    name: 'Classic Burger',
    price: 12.99,
    description: 'Juicy beef patty with lettuce, tomato, and our secret sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    categoryId: 'cat4'
  },
  {
    id: 'm2',
    name: 'Truffle Fries',
    price: 6.99,
    description: 'Crispy golden fries tossed in truffle oil and parmesan.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80',
    categoryId: 'cat2'
  },
  {
    id: 'm3',
    name: 'Margherita Pizza',
    price: 14.99,
    description: 'Fresh mozzarella, basil, and our signature tomato sauce.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=300&q=80',
    categoryId: 'cat3'
  },
  {
    id: 'm4',
    name: 'Coke Zero',
    price: 2.50,
    description: 'The classic taste of Coca-Cola with zero sugar.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80',
    categoryId: 'cat1'
  },
  {
    id: 'm5',
    name: 'Pasta Carbonara',
    price: 13.50,
    description: 'Creamy pasta with pancetta, egg, and black pepper.',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=300&q=80',
    categoryId: 'cat2'
  }
];

export const MENU_ITEMS = [
  'Classic Burger',
  'Truffle Fries',
  'Coke Zero',
  'Margherita Pizza',
  'Garlic Bread',
  'Caesar Salad',
  'Grilled Salmon',
  'Pasta Carbonara',
  'Steak Frites',
  'Mushroom Risotto'
];

export const CUSTOMER_NAMES = [
  'David Wilson',
  'Emma Davis',
  'Frank Miller',
  'Grace Taylor',
  'Henry Moore',
  'Isabella Anderson',
  'Jack Thomas',
  'Katherine Jackson'
];
