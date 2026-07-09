// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD83Ik5xCUKDpLSvqvzYUkJnnk9sIocM-c",
  authDomain: "club-merch.firebaseapp.com",
  projectId: "club-merch",
  storageBucket: "club-merch.firebasestorage.app",
  messagingSenderId: "6154687733",
  appId: "1:6154687733:web:681812a16d59cb19c061bc",
  measurementId: "G-VZCM1DXW3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics only in the browser (avoid SSR "window is not defined")
let analytics: any = undefined;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    // Analytics may be unsupported (e.g., during SSR or in test envs)
    // keep it non-fatal and continue without analytics
    // eslint-disable-next-line no-console
    console.warn('Firebase analytics not initialized:', err?.message || err);
  }
}

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };