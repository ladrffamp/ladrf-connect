// acompanhamento.js

import { db, messaging } from "./firebase.js";

import {
    doc,
    onSnapshot,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";


// =====================================
// ID DO PACIENTE
// =====================================

const idPaciente =
new URLSearchParams(window.location.search).get("id");


const nome = document.getElementById("nome");
const status = document.getElementById("status");
const maca = document.getElementById("maca");
const mensagem = document.getElementById("mensagem");


// =====================================
// REGISTRAR SERVICE WORKER
// =====================================

async function registrarServiceWorker(){

    if(!("serviceWorker" in navigator)){
        throw new Error("Service Worker não suportado.");
    }

    const registration =
    await navigator.serviceWorker.register(
        "/ladrf-connect/firebase-messaging-sw.js"
    );

    await navigator.serviceWorker.ready;

    console.log("Service Worker registrado:", registration);

    return registration;

}


// =====================================
// SALVAR TOKEN DO PACIENTE
// =====================================

async function salvarTokenPaciente(){

    try{

        const registration =
        await registrarServiceWorker();

        const permissao =
        await Notification.requestPermission();

        if(permissao !== "granted"){

            console.log("Permissão negada.");

            return;

        }

        const token =
        await getToken(

            messaging,

            {

                vapidKey:
                "BLd1c09XUUZnB4WjZY0XvdCJs_wdLvxxUw_ey-sNTC8f7hUreUwY5x5rOsnWkrRwrj-G4KH1cj8LHtv-oR6jZe0",

                serviceWorkerRegistration: registration

            }

        );

        if(!token){

            console.log("Nenhum token recebido.");

            return;

        }

        console.log("TOKEN:", token);

        await updateDoc(

            doc(db,"pacientes",idPaciente),

            {

                fcmToken: token

            }

        );

        console.log("Token salvo com sucesso.");

    }

    catch(error){

        console.error("Erro FCM paciente:", error);

    }

}


// =====================================
// RECEBER NOTIFICAÇÃO COM SITE ABERTO
// =====================================

onMessage(

    messaging,

    (payload)=>{

        console.log(payload);

        if(Notification.permission==="granted"){

            new Notification(

                payload.notification.title,

                {

                    body: payload.notification.body,

                    icon: "/ladrf-connect/icon-192.png"

                }

            );

        }

    }

);


// =====================================
// ACOMPANHAMENTO EM TEMPO REAL
// =====================================

async function iniciar(){

    if(!idPaciente){

        nome.innerHTML="Paciente não encontrado";

        return;

    }

    await salvarTokenPaciente();

    const pacienteRef =
    doc(db,"pacientes",idPaciente);

    onSnapshot(

        pacienteRef,

        (snapshot)=>{

            if(!snapshot.exists()){

                nome.innerHTML="Paciente não encontrado";

                return;

            }

            const paciente =
            snapshot.data();

            nome.innerHTML =
            paciente.nome || "-";

            status.innerHTML =
            paciente.status || "-";

            maca.innerHTML =
            paciente.maca
            ? "MACA " + paciente.maca
            : "-";

            if(paciente.status==="Em atendimento"){

                mensagem.innerHTML =
                "🔔 Chegou sua vez! Dirija-se ao atendimento.";

            }else{

                mensagem.innerHTML =
                "Aguarde sua vez.";

            }

        }

    );

}

iniciar();
