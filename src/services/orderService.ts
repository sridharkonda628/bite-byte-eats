
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem } from '../store/cartSlice';

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
  customerInfo?: {
    name: string;
    phone: string;
    address: string;
  };
}

export const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const orderId = Math.random().toString(36).substr(2, 9);
  console.log('Order placed:', { ...orderData, id: orderId, createdAt: new Date() });
  
  return orderId;
};
