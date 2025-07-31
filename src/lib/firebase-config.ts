
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "data-exporter-b59ih",
  appId: "1:783413603123:web:e4b5f3c6b164e974d06c46",
  storageBucket: "data-exporter-b59ih.firebasestorage.app",
  apiKey: "AIzaSyAv-V2apXjSLB8HIFoi9hPXgfEX4y9g5eo",
  authDomain: "data-exporter-b59ih.firebaseapp.com",
  messagingSenderId: "783413603123",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
