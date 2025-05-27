
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Note: These are demo values. In production, use environment variables
  apiKey: "demo-api-key",
  authDomain: "food-ordering-demo.firebaseapp.com",
  projectId: "food-ordering-demo",
  storageBucket: "food-ordering-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
