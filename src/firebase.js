import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot 
} from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALyaZUnbyYj0FZK-1Y9d1qizFI1NSK5WY",
  authDomain: "metro-delivery-app.firebaseapp.com",
  projectId: "metro-delivery-app",
  storageBucket: "metro-delivery-app.firebasestorage.app",
  messagingSenderId: "654583576427",
  appId: "1:654583576427:web:5f995bb849f6f969b97e2e",
  measurementId: "G-EGF7P8KSSW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginConGoogle = () => signInWithPopup(auth, googleProvider);
export const cerrarSesion = () => signOut(auth);

export { doc, setDoc, getDoc, onSnapshot, onAuthStateChanged };