import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7hogEzFpAOzPiKsc7FkQnFrCOveZOfos",
  authDomain: "ladrf-connect.firebaseapp.com",
  projectId: "ladrf-connect",
  storageBucket: "ladrf-connect.firebasestorage.app",
  messagingSenderId: "863498841924",
  appId: "1:863498841924:web:f3d97064e13cbdda893111"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
