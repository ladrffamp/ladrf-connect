import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {

  apiKey: "SUA_API_KEY",

  authDomain: "SEU_PROJETO.firebaseapp.com",

  projectId: "SEU_PROJETO",

  storageBucket: "SEU_PROJETO.firebasestorage.app",

  messagingSenderId: "SEU_MESSAGING_SENDER_ID",

  appId: "SEU_APP_ID"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
