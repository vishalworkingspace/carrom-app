import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC43NkBBH3JP97DRnPR3xHxwrYLNgZ8Dzg",
  authDomain: "carrom-master-33ae8.firebaseapp.com",
  projectId: "carrom-master-33ae8",
  storageBucket: "carrom-master-33ae8.firebasestorage.app",
  messagingSenderId: "285779539325",
  appId: "1:285779539325:web:ab76dc01d7b4d6edba0814"
};

const app = initializeApp(firebaseConfig);

// 👉 YE LINE ADD KARO
export const db = getFirestore(app);