// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm8X22Q8j2nK6IV9nfmyS_SBLD431ykLk",
  authDomain: "react-chat-76f80.firebaseapp.com",
  projectId: "react-chat-76f80",
  storageBucket: "react-chat-76f80.appspot.com",
  messagingSenderId: "1085702154038",
  appId: "1:1085702154038:web:afc6f881a64368942fb597",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

// Create a root reference
export const storage = getStorage();

// Create database
export const db = getFirestore();
