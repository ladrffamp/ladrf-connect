importScripts(
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
"https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);


firebase.initializeApp({

apiKey: "AIzaSyC7hogEzFpAOzPiKsc7FkQnFrCOveZOfos",

authDomain: "ladrf-connect.firebaseapp.com",

projectId: "ladrf-connect",

storageBucket: "ladrf-connect.firebasestorage.app",

messagingSenderId: "863498841924",

appId: "1:863498841924:web:f3d97064e13cbdda893111"

});


const messaging = firebase.messaging();



messaging.onBackgroundMessage((payload)=>{


self.registration.showNotification(

payload.notification.title,

{

body: payload.notification.body,

icon: "/favicon.ico"

}

);


});
