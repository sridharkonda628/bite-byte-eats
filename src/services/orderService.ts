
import { 
  collection, 
  addDoc, 
  Timestamp, 
  doc, 
  updateDoc, 
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
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
  try {
    console.log('Placing order in Firestore...', orderData);
    
    // Validate order data
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    if (!orderData.customerInfo?.name || !orderData.customerInfo?.phone || !orderData.customerInfo?.address) {
      throw new Error('Customer information is required');
    }
    
    if (orderData.total <= 0) {
      throw new Error('Order total must be greater than 0');
    }
    
    // Prepare order document
    const orderDocument = {
      ...orderData,
      createdAt: Timestamp.now(),
      status: 'pending' as const,
      // Add additional tracking fields
      updatedAt: Timestamp.now(),
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    };
    
    // Add order to Firestore
    const docRef = await addDoc(collection(db, 'orders'), orderDocument);
    
    console.log('Order placed successfully with ID:', docRef.id);
    
    // Simulate order confirmation after a short delay
    setTimeout(async () => {
      try {
        await updateOrderStatus(docRef.id, 'confirmed');
        console.log('Order automatically confirmed:', docRef.id);
      } catch (error) {
        console.error('Error auto-confirming order:', error);
      }
    }, 2000);
    
    return docRef.id;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    console.log(`Updating order ${orderId} status to ${status}`);
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now()
    });
    console.log('Order status updated successfully');
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    console.log('Fetching order:', orderId);
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      const data = orderSnap.data();
      return {
        id: orderSnap.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as Order;
    } else {
      console.log('Order not found:', orderId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const streamOrderUpdates = (orderId: string, callback: (order: Order | null) => void) => {
  try {
    console.log('Setting up real-time order updates for:', orderId);
    const orderRef = doc(db, 'orders', orderId);
    
    const unsubscribe = onSnapshot(
      orderRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const order: Order = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate()
          } as Order;
          console.log('Order update received:', order);
          callback(order);
        } else {
          console.log('Order not found in real-time update:', orderId);
          callback(null);
        }
      },
      (error) => {
        console.error('Error in order listener:', error);
        callback(null);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up order listener:', error);
    return () => {}; // Return empty cleanup function
  }
};

export const getRecentOrders = async (limitCount: number = 10): Promise<Order[]> => {
  try {
    console.log(`Fetching ${limitCount} recent orders...`);
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Order));
    
    console.log(`Fetched ${orders.length} recent orders`);
    return orders;
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }
};
