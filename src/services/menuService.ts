
import { 
  collection, 
  getDocs, 
  onSnapshot, 
  DocumentData, 
  QuerySnapshot,
  addDoc,
  writeBatch,
  doc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
}

// Demo data to populate Firestore if empty
const demoMenuItems: Omit<MenuItem, 'id'>[] = [
  {
    name: 'Margherita Pizza',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'Pizza',
    description: 'Classic margherita with fresh mozzarella and basil'
  },
  {
    name: 'Chicken Burger',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'Burgers',
    description: 'Grilled chicken breast with lettuce and tomato'
  },
  {
    name: 'Caesar Salad',
    price: 8.99,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    category: 'Salads',
    description: 'Crisp romaine lettuce with parmesan and croutons'
  },
  {
    name: 'Pepperoni Pizza',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'Pizza',
    description: 'Classic pepperoni with mozzarella cheese'
  },
  {
    name: 'Beef Burger',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
    category: 'Burgers',
    description: 'Juicy beef patty with cheese and special sauce'
  },
  {
    name: 'Greek Salad',
    price: 10.99,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    category: 'Salads',
    description: 'Fresh vegetables with feta cheese and olives'
  }
];

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    console.log('Fetching menu items from Firestore...');
    const querySnapshot = await getDocs(collection(db, 'menuItems'));
    
    if (querySnapshot.empty) {
      console.log('No menu items found, populating with demo data...');
      await populateMenuItems();
      // Fetch again after populating
      const newQuerySnapshot = await getDocs(collection(db, 'menuItems'));
      return newQuerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MenuItem));
    }
    
    const menuItems = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MenuItem));
    
    console.log(`Fetched ${menuItems.length} menu items from Firestore`);
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Fallback to demo data if Firestore fails
    console.log('Falling back to demo data...');
    return demoMenuItems.map((item, index) => ({
      ...item,
      id: (index + 1).toString()
    }));
  }
};

export const streamMenuItems = (callback: (items: MenuItem[]) => void) => {
  try {
    console.log('Setting up real-time menu items listener...');
    const unsubscribe = onSnapshot(
      collection(db, 'menuItems'),
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const menuItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as MenuItem));
        
        console.log(`Real-time update: ${menuItems.length} menu items`);
        callback(menuItems);
      },
      (error) => {
        console.error('Error in menu items listener:', error);
        // Fallback to demo data on error
        const fallbackItems = demoMenuItems.map((item, index) => ({
          ...item,
          id: (index + 1).toString()
        }));
        callback(fallbackItems);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up menu items listener:', error);
    // Return demo data immediately if listener setup fails
    setTimeout(() => {
      const fallbackItems = demoMenuItems.map((item, index) => ({
        ...item,
        id: (index + 1).toString()
      }));
      callback(fallbackItems);
    }, 500);
    return () => {}; // Return empty cleanup function
  }
};

// Helper function to populate Firestore with demo data
const populateMenuItems = async (): Promise<void> => {
  try {
    console.log('Populating Firestore with demo menu items...');
    const batch = writeBatch(db);
    const menuItemsRef = collection(db, 'menuItems');
    
    demoMenuItems.forEach((item) => {
      const docRef = doc(menuItemsRef);
      batch.set(docRef, item);
    });
    
    await batch.commit();
    console.log('Demo menu items added to Firestore successfully');
  } catch (error) {
    console.error('Error populating menu items:', error);
    throw error;
  }
};
