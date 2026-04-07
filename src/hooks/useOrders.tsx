import { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/types';
import { INITIAL_ORDERS, MENU_ITEMS, CUSTOMER_NAMES } from '@/data/constants';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isAutoGenerating, setIsAutoGenerating] = useState(true);

  const handleStatusChange = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => {
      const newOrders = prev.map(order => 
        order.id === id ? { ...order, status } : order
      );
      
      const order = prev.find(o => o.id === id);
      if (order) {
        toast.success(`Order #${order.orderNumber.split('-')[1]} moved to ${status}`);
      }
      
      return newOrders;
    });
  }, []);

  const generateNewOrder = useCallback(() => {
    const id = Math.random().toString(36).substring(7);
    const orderNum = Math.floor(Math.random() * 900) + 100;
    const tableNum = Math.floor(Math.random() * 20) + 1;
    const customer = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
    
    const itemsCount = Math.floor(Math.random() * 3) + 1;
    const items = Array.from({ length: itemsCount }).map((_, i) => ({
      id: `item-${id}-${i}`,
      name: MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)],
      quantity: Math.floor(Math.random() * 2) + 1,
      notes: Math.random() > 0.7 ? 'No onions' : undefined
    }));

    const newOrder: Order = {
      id,
      orderNumber: `ORD-${orderNum}`,
      tableNumber: `T-${tableNum.toString().padStart(2, '0')}`,
      customerName: customer,
      items,
      status: 'new',
      timestamp: Date.now(),
      isUrgent: Math.random() > 0.8
    };

    setOrders(prev => [newOrder, ...prev]);
    
    toast(`New Order Received: #${orderNum}`, {
      description: `${customer} at Table T-${tableNum}`,
      icon: <Bell className="w-4 h-4 text-blue-500" />,
      duration: 5000,
    });

    const notificationElement = document.getElementById('notification-ping');
    if (notificationElement) {
      notificationElement.classList.add('animate-ping');
      setTimeout(() => notificationElement.classList.remove('animate-ping'), 1000);
    }
  }, []);

  useEffect(() => {
    if (!isAutoGenerating) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        generateNewOrder();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoGenerating, generateNewOrder]);

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  return {
    orders,
    setOrders,
    isAutoGenerating,
    setIsAutoGenerating,
    handleStatusChange,
    generateNewOrder,
    stats
  };
}
