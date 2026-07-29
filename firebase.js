// =====================================
// IMPORTAÇÕES FIREBASE
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// CONFIGURAÇÃO FIREBASE LADRF CONNECT
// =====================================

const firebaseConfig = {

  apiKey: "AIzaSyC7hogEzFpAOzPiKsc7FkQnFrCOveZOfos",

  authDomain: "ladrf-connect.firebaseapp.com",

  projectId: "ladrf-connect",

  storageBucket: "ladrf-connect.firebasestorage.app",

  messagingSenderId: "863498841924",

  appId: "1:863498841924:web:f3d97064e13cbdda893111",

  measurementId: "G-0Q9WM2KH35"

};


// =====================================
// APLICAÇÃO PRINCIPAL
// =====================================

const app = initializeApp(firebaseConfig);


// =====================================
// APLICAÇÃO SECUNDÁRIA
// Usada para criação de usuários
// =====================================

const appSecundario = initializeApp(
  firebaseConfig,
  "cadastroUsuarios"
);


// =====================================
// SERVIÇOS FIREBASE
// =====================================

const auth = getAuth(app);

const authSecundario = getAuth(appSecundario);

const db = getFirestore(app);


// =====================================
// FIREBASE MESSAGING
// Temporariamente desativado
// para corrigir carregamento do login
// =====================================

const messaging = null;


// =====================================
// EXPORTAÇÕES
// =====================================

export {

  app,

  auth,

  authSecundario,

  db,

  messaging

};
