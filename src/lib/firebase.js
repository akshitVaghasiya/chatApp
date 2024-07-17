// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { API_KEY } from '../config';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    // apiKey: import.meta.env.VITE_API_KEY,
    apiKey: API_KEY,
    authDomain: "chatapp-8d7cb.firebaseapp.com",
    projectId: "chatapp-8d7cb",
    storageBucket: "chatapp-8d7cb.appspot.com",
    messagingSenderId: "144718872937",
    appId: "1:144718872937:web:96a05c65db849723cd3df8",
    measurementId: "G-TSLRLVKDRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();