// acompanhamento.js

import { db } from "./firebase.js";

import {
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// ID DO PACIENTE
// =====================================

const idPaciente =
new URLSearchParams(window.location.search).get("id");

const nome = document.getElementById("nome");
const status = document.getElementById("status");
const maca = document.getElementById("maca");
const mensagem = document.getElementById("mensagem");

let jaChamado = false;
let audio;


// =====================================
// SOM
// =====================================

function tocarAlarme() {

    if (audio) return;

    audio = new Audio(
        "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );

    audio.loop = true;

    audio.play().catch(() => {
        console.log("O navegador bloqueou o áudio automático.");
    });

    setTimeout(() => {

        if (audio) {

            audio.pause();
            audio.currentTime = 0;
            audio = null;

        }

    }, 10000);

}


// =====================================
// VIBRAÇÃO
// =====================================

function vibrar() {

    if (navigator.vibrate) {

        navigator.vibrate([
            500,
            300,
            500,
            300,
            500,
            300,
            500
        ]);

    }

}


// =====================================
// NOTIFICAÇÃO
// =====================================

async function mostrarNotificacao(texto) {

    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {

        await Notification.requestPermission();

    }

    if (Notification.permission === "granted") {

        new Notification(
            "LADRF Connect",
            {
                body: texto,
                icon: "/ladrf-connect/icon-192.png"
            }
        );

    }

}


// =====================================
// CHAMAR PACIENTE
// =====================================

async function chamarPaciente(numeroMaca) {

    if (jaChamado) return;

    jaChamado = true;

    document.body.style.background = "#d4edda";

    mensagem.innerHTML =
        "🔔 SUA VEZ! DIRIJA-SE À MACA " + numeroMaca;

    vibrar();

    tocarAlarme();

    await mostrarNotificacao(
        "Chegou sua vez! Dirija-se à MACA " + numeroMaca
    );

}


// =====================================
// VOLTAR AO NORMAL
// =====================================

function voltarNormal() {

    jaChamado = false;

    document.body.style.background = "";

    mensagem.innerHTML = "Aguarde sua vez.";

}


// =====================================
// ACOMPANHAMENTO
// =====================================

async function iniciar() {

    if (!idPaciente) {

        nome.innerHTML = "Paciente não encontrado";

        return;

    }

    const pacienteRef =
        doc(db, "pacientes", idPaciente);

    onSnapshot(

        pacienteRef,

        (snapshot) => {

            if (!snapshot.exists()) {

                nome.innerHTML = "Paciente não encontrado";

                return;

            }

            const paciente = snapshot.data();

            nome.innerHTML =
                paciente.nome || "-";

            status.innerHTML =
                paciente.status || "-";

            maca.innerHTML =
                paciente.maca
                    ? "MACA " + paciente.maca
                    : "-";

            if (paciente.status === "Em atendimento") {

                chamarPaciente(
                    paciente.maca || ""
                );

            } else {

                voltarNormal();

            }

        }

    );

}

iniciar();
