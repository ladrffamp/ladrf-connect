import { db } from "./firebase.js";

import {
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const idPaciente = new URLSearchParams(window.location.search).get("id");

const nome = document.getElementById("nome");
const status = document.getElementById("status");
const maca = document.getElementById("maca");
const mensagem = document.getElementById("mensagem");

let notificacaoEnviada = false;

// Som simples gerado pelo navegador
function tocarSom() {
    try {
        const audio = new Audio(
            "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        );
        audio.play().catch(() => {});
    } catch (e) {}
}

async function pedirPermissao() {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
}

function mostrarNotificacao(paciente) {

    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted") return;

    if (notificacaoEnviada) return;

    notificacaoEnviada = true;

    new Notification("LADRF Connect", {
        body: `${paciente.nome}, chegou sua vez! Dirija-se ao atendimento.`,
        icon: "https://ladrffamp.github.io/ladrf-connect/icon.png"
    });

    tocarSom();
}

async function iniciar() {

    await pedirPermissao();

    if (!idPaciente) {

        nome.innerHTML = "Paciente não encontrado";
        return;

    }

    const pacienteRef = doc(db, "pacientes", idPaciente);

    onSnapshot(pacienteRef, (snapshot) => {

        if (!snapshot.exists()) {

            nome.innerHTML = "Paciente não encontrado";
            return;

        }

        const paciente = snapshot.data();

        nome.innerHTML = paciente.nome || "-";

        status.innerHTML = paciente.status || "-";

        maca.innerHTML = paciente.maca
            ? "MACA " + paciente.maca
            : "-";

        if (paciente.status === "Em atendimento") {

            mensagem.innerHTML =
                "🔔 Chegou sua vez! Dirija-se ao atendimento.";

            mostrarNotificacao(paciente);

        } else {

            notificacaoEnviada = false;

            mensagem.innerHTML = "Aguarde sua vez.";

        }

    });

}

iniciar();
