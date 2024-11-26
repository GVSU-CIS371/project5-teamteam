// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC74Eigm54IN2od5nAsVfvwP56tLg37YdY",
  authDomain: "webdevstore.firebaseapp.com",
  projectId: "webdevstore",
  storageBucket: "webdevstore.firebasestorage.app",
  messagingSenderId: "785603543997",
  appId: "1:785603543997:web:546767c64a010ecc7e48d4",
  measurementId: "G-0PBCYY4HG2"
};

// Initialize Firebase
const myApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(myApp);
