import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAe8Ry6nzcEIfR72a0GQuEMoRJsyyIj90o",
  authDomain: "nep-tune.firebaseapp.com",
  projectId: "nep-tune",
  storageBucket: "nep-tune.firebasestorage.app",
  messagingSenderId: "740266274961",
  appId: "1:740266274961:web:d45adb8c1a01707b014f30",
  measurementId: "G-W6SJSZQPBZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
