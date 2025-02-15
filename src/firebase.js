// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD8S5-mlS_rse1yTEwS4wod55PfJpKKR8Y",
    authDomain: "rifa-online-881b6.firebaseapp.com",
    projectId: "rifa-online-881b6",
    storageBucket: "rifa-online-881b6.firebasestorage.app",
    messagingSenderId: "119181647013",
    appId: "1:119181647013:web:5036fafbbc567492ac814c",
    measurementId: "G-Y50SN0CZTC"
  };

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Firestore
const db = getFirestore(app);

export { db };