// firebase-messaging-sw.js


importScripts(
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);


importScripts(
"https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);



// Configuração Firebase LADRF Connect

const firebaseConfig = {


apiKey: "AIzaSyC7hogEzFpAOzPiKsc7FkQnFrCOveZOfos",

authDomain: "ladrf-connect.firebaseapp.com",

projectId: "ladrf-connect",

storageBucket: "ladrf-connect.firebasestorage.app",

messagingSenderId: "863498841924",

appId: "1:863498841924:web:f3d97064e13cbdda893111",

measurementId: "G-0Q9WM2KH35"


};




// Inicializar Firebase

firebase.initializeApp(firebaseConfig);



const messaging = firebase.messaging();




// Receber notificações com navegador fechado

messaging.onBackgroundMessage(

(payload)=>{


console.log(

"Notificação recebida em segundo plano:",

payload

);



const titulo =

payload.notification.title || "LADRF Connect";



const opcoes = {


body:

payload.notification.body || "Nova atualização",


icon:

"/icon.png"


};



self.registration.showNotification(

titulo,

opcoes

);



}

);
