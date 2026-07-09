// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { browser } from '$app/environment';

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

let analytics: any = null;
if (browser) {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch((err) => {
    console.warn('Firebase analytics not loaded:', err);
  });
}

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);