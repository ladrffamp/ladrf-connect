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

import {
  getMessaging
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";


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
// (usada apenas para criar usuários)
// =====================================

const appSecundario = initializeApp(
  firebaseConfig,
  "cadastroUsuarios"
);


// =====================================
// SERVIÇOS
// =====================================

const auth = getAuth(app);

const authSecundario = getAuth(appSecundario);

const db = getFirestore(app);

let messaging = null;

try{

    messaging = getMessaging(app);

}
catch(error){

    console.log(
        "Firebase Messaging não inicializado:",
        error
    );

}


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
