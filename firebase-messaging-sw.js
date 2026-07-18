importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC7hogEzFpAOzPiKsc7FkQnFrCOveZOfos",
  authDomain: "ladrf-connect.firebaseapp.com",
  projectId: "ladrf-connect",
  storageBucket: "ladrf-connect.firebasestorage.app",
  messagingSenderId: "863498841924",
  appId: "1:863498841924:web:f3d97064e13cbdda893111"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Mensagem recebida:", payload);

  const notificationTitle =
    payload.notification?.title || "LADRF Connect";

  const notificationOptions = {
    body: payload.notification?.body || "Chegou sua vez!",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: payload.data || {},
    requireInteraction: true
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("/")
  );
});
