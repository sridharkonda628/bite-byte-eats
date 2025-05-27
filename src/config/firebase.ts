
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  // Note: Replace these with your actual Firebase project configuration
  // Get these from Firebase Console -> Project Settings -> General -> Your apps
  apiKey: "AIzaSyBvOkBwLdLDexlqDaiMySDfdsT_G_3VVnc",
  authDomain: "food-ordering-app-demo.firebaseapp.com",
  projectId: "food-ordering-app-demo",
  storageBucket: "food-ordering-app-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// For development: uncomment to use Firestore emulator
// if (location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

console.log('Firebase initialized successfully');
