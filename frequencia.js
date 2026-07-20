import { db } from "./firebase.js";

import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const selectEvento = document.getElementById("evento");
const listaPresenca = document.getElementById("listaPresenca");

const totalMembros = document.getElementById("totalMembros");
const presentes = document.getElementById("presentes");
const pendentes = document.getElementById("pendentes");
const ausentes = document.getElementById("ausentes");

let membros = [];
let eventos = [];

let registrosPresenca = {};

// Impede múltiplos listeners da coleção presenças
let unsubscribePresencas = null;

// ==========================
// CARREGAR EVENTOS
// ==========================

onSnapshot(
    collection(db, "agenda"),
    (snapshot) => {

        eventos = [];

        selectEvento.innerHTML = `
            <option value="">
                Selecione um evento
            </option>
        `;

        snapshot.forEach((documento) => {

            const evento = documento.data();

            eventos.push({
                id: documento.id,
                ...evento
            });

            selectEvento.innerHTML += `
                <option value="${documento.id}">
                    ${evento.titulo}
                </option>
            `;

        });

    }
);

// ==========================
// CARREGAR MEMBROS
// ==========================

onSnapshot(
    collection(db, "membros"),
    (snapshot) => {

        membros = [];

        snapshot.forEach((documento) => {

            const membro = documento.data();

            if (membro.status === "Ativo") {

                membros.push({
                    id: documento.id,
                    ...membro
                });

            }

        });

        carregarPresencas();

    }
);

// ==========================
// CARREGAR PRESENÇAS
// ==========================

function carregarPresencas() {

    const eventoId = selectEvento.value;

    if (!eventoId) {

        registrosPresenca = {};

        atualizarTabela();

        return;

    }

    // Remove listener antigo
    if (unsubscribePresencas) {
        unsubscribePresencas();
    }

    unsubscribePresencas = onSnapshot(
        collection(db, "presencas"),
        (snapshot) => {

            registrosPresenca = {};

            snapshot.forEach((documento) => {

                const dados = documento.data();

                if (dados.eventoId === eventoId) {

                    registrosPresenca[dados.membroId] = dados;

                }

            });

            atualizarTabela();

        }
    );

  // ==========================
// SALVAR PRESENÇA
// ==========================

async function salvarPresenca(membro, status) {

    const eventoId = selectEvento.value;

    if (!eventoId) {

        alert("Selecione um evento primeiro.");

        return false;

    }

    const evento = eventos.find(e => e.id === eventoId);

    const idPresenca = `${eventoId}_${membro.id}`;

    const hora = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    try {

        await setDoc(
            doc(db, "presencas", idPresenca),
            {

                eventoId: eventoId,

                evento: evento?.titulo || "",

                membroId: membro.id,

                membro: membro.nome,

                status: status,

                horaCheckin: status === "Presente" ? hora : null,

                criadoEm: Timestamp.now()

            },
            { merge: true }
        );

        return true;

    } catch (erro) {

        console.error("Erro ao salvar presença:", erro);

        alert("Erro ao registrar presença.");

        return false;

    }

}
  // ==========================
// ATUALIZAR TABELA
// ==========================

function atualizarTabela() {

    listaPresenca.innerHTML = "";

    if (membros.length === 0) {

        listaPresenca.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum membro encontrado.
                </td>
            </tr>
        `;

        totalMembros.textContent = 0;
        presentes.textContent = 0;
        pendentes.textContent = 0;
        ausentes.textContent = 0;

        return;
    }

    let qtdPresentes = 0;
    let qtdAusentes = 0;
    let qtdPendentes = 0;

    membros.forEach((membro) => {

        const registro = registrosPresenca[membro.id];

        const statusAtual = registro?.status || "Pendente";

        const hora = registro?.horaCheckin || "—";

        if (statusAtual === "Presente") {
            qtdPresentes++;
        } else if (statusAtual === "Ausente") {
            qtdAusentes++;
        } else {
            qtdPendentes++;
        }

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${membro.nome}</td>

            <td>${membro.curso || "-"}</td>

            <td>
                <span class="status ${statusAtual.toLowerCase()}">
                    ${statusAtual}
                </span>
            </td>

            <td>${hora}</td>

            <td>
                <button
                    class="presente"
                    ${statusAtual === "Presente" ? "disabled" : ""}
                    style="
                        background:#16a34a;
                        color:white;
                        border:none;
                        padding:8px 12px;
                        border-radius:8px;
                        cursor:pointer;
                    ">
                    ✔ Confirmar
                </button>

                <button
                    class="ausente"
                    ${statusAtual === "Ausente" ? "disabled" : ""}
                    style="
                        background:#dc2626;
                        color:white;
                        border:none;
                        padding:8px 12px;
                        border-radius:8px;
                        cursor:pointer;
                    ">
                    ❌ Ausente
                </button>
            </td>
        `;

        const btnPresente = linha.querySelector(".presente");
        const btnAusente = linha.querySelector(".ausente");

        btnPresente.onclick = async () => {

            btnPresente.disabled = true;
            btnAusente.disabled = true;

            await salvarPresenca(membro, "Presente");

        };

        btnAusente.onclick = async () => {

            btnPresente.disabled = true;
            btnAusente.disabled = true;

            await salvarPresenca(membro, "Ausente");

        };

        listaPresenca.appendChild(linha);

    });

    totalMembros.textContent = membros.length;
    presentes.textContent = qtdPresentes;
    pendentes.textContent = qtdPendentes;
    ausentes.textContent = qtdAusentes;

}
  // ==========================
// TROCAR EVENTO
// ==========================

selectEvento.addEventListener(
    "change",
    () => {

        carregarPresencas();

    }
);


// ==========================
// FINALIZAÇÃO
// ==========================

console.log(
    "LADRF Frequência carregado!"
);
}
