// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPgr2ASrQWyLRzoKmSiCGq-WETVTKdR2Y",
  authDomain: "learningdestinyin.firebaseapp.com",
  projectId: "learningdestinyin",
  storageBucket: "learningdestinyin.appspot.com",
  messagingSenderId: "190796637565",
  appId: "1:190796637565:web:407209ce936bdb78645814",
  measurementId: "G-L9N91K4MQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;
