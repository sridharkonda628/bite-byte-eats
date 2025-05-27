
import { collection, getDocs, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
}

// Demo data to simulate Firebase
const demoMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'Pizza',
    description: 'Classic margherita with fresh mozzarella and basil'
  },
  {
    id: '2',
    name: 'Chicken Burger',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'Burgers',
    description: 'Grilled chicken breast with lettuce and tomato'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    price: 8.99,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    category: 'Salads',
    description: 'Crisp romaine lettuce with parmesan and croutons'
  },
  {
    id: '4',
    name: 'Pepperoni Pizza',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'Pizza',
    description: 'Classic pepperoni with mozzarella cheese'
  },
  {
    id: '5',
    name: 'Beef Burger',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
    category: 'Burgers',
    description: 'Juicy beef patty with cheese and special sauce'
  },
  {
    id: '6',
    name: 'Greek Salad',
    price: 10.99,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    category: 'Salads',
    description: 'Fresh vegetables with feta cheese and olives'
  }
];

export const getMenuItems = async (): Promise<MenuItem[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return demoMenuItems;
};

export const streamMenuItems = (callback: (items: MenuItem[]) => void) => {
  // Simulate real-time updates
  setTimeout(() => callback(demoMenuItems), 500);
  return () => {}; // Cleanup function
};
