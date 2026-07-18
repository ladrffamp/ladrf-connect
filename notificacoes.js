// notificacoes.js

import { auth, db, app } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const messaging = getMessaging(app);

// =====================================
// REGISTRAR SERVICE WORKER
// =====================================

async function registrarServiceWorker() {

    if (!("serviceWorker" in navigator)) {
        throw new Error("Service Worker não suportado.");
    }

    try {

        const registration = await navigator.serviceWorker.register(
            "/ladrf-connect/firebase-messaging-sw.js"
        );

        console.log(
            "✅ Service Worker registrado:",
            registration
        );

        await navigator.serviceWorker.ready;

        return registration;

    } catch (error) {

        console.error(
            "❌ Erro ao registrar Service Worker:",
            error
        );

        throw error;
    }

}

// =====================================
// ATIVAR NOTIFICAÇÕES
// =====================================

async function ativarNotificacoes() {

    try {

        const registration = await registrarServiceWorker();

        const permissao = await Notification.requestPermission();

        if (permissao !== "granted") {

            console.log("❌ Permissão negada.");

            return;
        }

        const token = await getToken(
            messaging,
            {
                vapidKey: "BLd1c09XUUZnB4WjZY0XvdCJs_wdLvxxUw_ey-sNTC8f7hUreUwY5x5rOsnWkrRwrj-G4KH1cj8LHtv-oR6jZe0",
                serviceWorkerRegistration: registration
            }
        );

        if (!token) {

            console.log("❌ Nenhum token retornado.");

            return;
        }

        console.log("✅ TOKEN FCM:");
        console.log(token);

        await salvarTokenUsuario(token);

    } catch (error) {

        console.error(
            "❌ Erro FCM:",
            error
        );

    }

}

// =====================================
// SALVAR TOKEN DO USUÁRIO
// =====================================

function salvarTokenUsuario(token) {

    onAuthStateChanged(auth, async (usuario) => {

        if (!usuario) {

            console.log("Usuário não autenticado.");

            return;

        }

        try {

            await updateDoc(
                doc(db, "usuarios", usuario.uid),
                {
                    tokenPush: token
                }
            );

            console.log("✅ Token salvo no Firestore.");

        } catch (error) {

            console.error(
                "Erro ao salvar token:",
                error
            );

        }

    });

}

// =====================================
// RECEBER MENSAGENS COM O SITE ABERTO
// =====================================

onMessage(messaging, (payload) => {

    console.log(
        "📩 Mensagem recebida:",
        payload
    );

    if (Notification.permission === "granted") {

        new Notification(
            payload.notification.title,
            {
                body: payload.notification.body,
                icon: "/ladrf-connect/icon-192.png"
            }
        );

    }

});

// =====================================
// INICIAR
// =====================================

ativarNotificacoes();
