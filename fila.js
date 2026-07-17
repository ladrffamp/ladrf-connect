import { db } from "./firebase.js";

import {
collection,
query,
where,
onSnapshot,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lista = document.getElementById("lista");

let pacientesFila = [];

const filaQuery = query(
    collection(db, "pacientes"),
    where("status", "==", "Aguardando")
);

// Atualiza a fila em tempo real
onSnapshot(filaQuery, (snapshot) => {

    pacientesFila = [];

    snapshot.forEach((item) => {

        pacientesFila.push({
            id: item.id,
            ...item.data()
        });

    });

    // Ordena pelo horário de cadastro
    pacientesFila.sort((a, b) => {

        if (!a.criadoEm) return 1;
        if (!b.criadoEm) return -1;

        return a.criadoEm.seconds - b.criadoEm.seconds;

    });

    atualizarTabela();

});

// Atualiza tabela
function atualizarTabela() {

    lista.innerHTML = "";

    if (pacientesFila.length === 0) {

        lista.innerHTML = `
        <tr>
            <td colspan="5">
                Nenhum paciente aguardando
            </td>
        </tr>
        `;

        return;

    }

    pacientesFila.forEach((paciente) => {

        lista.innerHTML += `

        <tr>

            <td>${paciente.nome}</td>

            <td>${paciente.modalidade || "-"}</td>

            <td>${paciente.status}</td>

            <td>${paciente.maca || "-"}</td>

            <td>

                <button
                    class="chamar"
                    onclick="chamarPaciente('${paciente.id}')">

                    Chamar

                </button>

            </td>

        </tr>

        `;

    });

}
// ======================================
// ENCONTRAR A PRIMEIRA MACA LIVRE
// ======================================

async function encontrarMacaLivre() {

    const snapshot = await getDocs(
        collection(db, "macas")
    );

    let macaLivre = null;

    snapshot.forEach((item) => {

        const maca = item.data();

        if (
            maca.status === "Livre" &&
            macaLivre === null
        ) {

            macaLivre = {
                id: item.id,
                numero: maca.numero
            };

        }

    });

    return macaLivre;

}



// ======================================
// CHAMAR O PRIMEIRO PACIENTE DA FILA
// ======================================

window.chamarProximo = async function () {

    if (pacientesFila.length === 0) {

        alert("Nenhum paciente aguardando.");

        return;

    }

    await chamarPaciente(
        pacientesFila[0].id
    );

};
// ======================================
// CHAMAR PACIENTE
// ======================================

window.chamarPaciente = async function(idPaciente){

    const maca = await encontrarMacaLivre();

    if(!maca){

        alert("Nenhuma maca livre disponível.");

        return;

    }

    const paciente = pacientesFila.find(
        p => p.id === idPaciente
    );

    if(!paciente){

        alert("Paciente não encontrado.");

        return;

    }

    // Atualiza paciente

    await updateDoc(

        doc(db,"pacientes",idPaciente),

        {

            status:"Em atendimento",

            maca:maca.numero

        }

    );



    // Atualiza maca

    await updateDoc(

        doc(db,"macas",maca.id),

        {

            status:"Ocupada",

            paciente:paciente.nome

        }

    );



    alert(

        `${paciente.nome} foi chamado para a maca ${maca.numero}.`

    );

};
// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Atualiza automaticamente a fila quando
// um paciente é chamado ou finalizado.
// O onSnapshot já faz isso, então aqui
// apenas deixamos uma função para futuras melhorias.

function atualizarFila() {
    console.log("Fila sincronizada.");
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

window.addEventListener("load", () => {

    console.log("LADRF Connect - Fila iniciada.");

});


// Deixa as funções disponíveis para o HTML

window.atualizarFila = atualizarFila;
