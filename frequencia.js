import { db } from "./firebase.js";

import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    query,
    where,
    Timestamp,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// ELEMENTOS
// ======================================================

const selectEvento = document.getElementById("evento");
const listaPresenca = document.getElementById("listaPresenca");

const totalMembros = document.getElementById("totalMembros");
const presentes = document.getElementById("presentes");
const pendentes = document.getElementById("pendentes");
const ausentes = document.getElementById("ausentes");


// ======================================================
// VARIÁVEIS
// ======================================================

let membros = [];
let eventos = [];
let presencas = {};

let unsubscribeEventos = null;
let unsubscribeMembros = null;
let unsubscribePresencas = null;


// ======================================================
// INICIALIZAÇÃO
// ======================================================

iniciar();

function iniciar() {

    carregarEventos();

    carregarMembros();

    atualizarTabela();

}


// ======================================================
// EVENTOS
// ======================================================

function carregarEventos() {

    if (unsubscribeEventos) {

        unsubscribeEventos();

    }

    unsubscribeEventos = onSnapshot(

        collection(db, "agenda"),

        (snapshot) => {

            eventos = [];

            selectEvento.innerHTML = `
                <option value="">
                    Selecione um evento
                </option>
            `;

            snapshot.forEach((item) => {

                const evento = item.data();

                eventos.push({

                    id: item.id,

                    ...evento

                });

                selectEvento.innerHTML += `
                    <option value="${item.id}">
                        ${evento.titulo}
                    </option>
                `;

            });

        },

        (erro) => {

            console.error(
                "Erro ao carregar eventos:",
                erro
            );

        }

    );

}


// ======================================================
// MEMBROS
// ======================================================

function carregarMembros() {

    if (unsubscribeMembros) {

        unsubscribeMembros();

    }

    unsubscribeMembros = onSnapshot(

        collection(db, "membros"),

        (snapshot) => {

            membros = [];

            snapshot.forEach((item) => {

                const membro = item.data();

                if (membro.status !== "Ativo") return;

                membros.push({

                    id: item.id,

                    ...membro

                });

            });

            atualizarTabela();

        },

        (erro) => {

            console.error(
                "Erro ao carregar membros:",
                erro
            );

        }

    );

}
// ======================================================
// PRESENÇAS
// ======================================================

function carregarPresencas() {

    const eventoId = selectEvento.value;

    // Remove o listener anterior
    if (unsubscribePresencas) {

        unsubscribePresencas();
        unsubscribePresencas = null;

    }

    presencas = {};

    if (!eventoId) {

        atualizarTabela();
        return;

    }

    const q = query(
        collection(db, "presencas"),
        where("eventoId", "==", eventoId)
    );

    unsubscribePresencas = onSnapshot(

        q,

        (snapshot) => {

            presencas = {};

            snapshot.forEach((item) => {

                const dados = item.data();

                presencas[dados.membroId] = {

                    status: dados.status,

                    hora: dados.horaCheckin || ""

                };

            });

            atualizarTabela();

        },

        (erro) => {

            console.error(
                "Erro ao carregar presenças:",
                erro
            );

        }

    );

}


// ======================================================
// SALVAR PRESENÇA
// ======================================================

async function salvarPresenca(membro, status) {

    const eventoId = selectEvento.value;

    if (!eventoId) {

        alert("Selecione um evento.");

        return;

    }

    const evento = eventos.find(
        e => e.id === eventoId
    );

    const hora = status === "Presente"
        ? new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        })
        : "";

    await setDoc(

        doc(
            db,
            "presencas",
            `${eventoId}_${membro.id}`
        ),

        {

            eventoId,

            evento: evento?.titulo || "",

            membroId: membro.id,

            membro: membro.nome,

            status,

            horaCheckin: hora,

            criadoEm: Timestamp.now()

        }

    );

}


// ======================================================
// ALTERAR STATUS
// ======================================================

async function alterarStatus(membro, status) {

    presencas[membro.id] = {

        status,

        hora: status === "Presente"
            ? new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            })
            : ""

    };

    atualizarTabela();

    await salvarPresenca(
        membro,
        status
    );

}
// ======================================================
// ATUALIZAR TABELA
// ======================================================

function atualizarTabela() {

    listaPresenca.innerHTML = "";

    let qtdPresentes = 0;
    let qtdAusentes = 0;
    let qtdPendentes = 0;

    if (membros.length === 0) {

        listaPresenca.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum membro ativo encontrado.
                </td>
            </tr>
        `;

        atualizarContadores(0, 0, 0, 0);

        return;
    }

    membros.forEach((membro) => {

        const registro = presencas[membro.id] || {};

        const status = registro.status || "Pendente";

        const hora = registro.hora || "—";

        switch (status) {

            case "Presente":
                qtdPresentes++;
                break;

            case "Ausente":
                qtdAusentes++;
                break;

            default:
                qtdPendentes++;

        }

        const linha = document.createElement("tr");

        linha.innerHTML = `

            <td>${membro.nome}</td>

            <td>${membro.curso || "-"}</td>

            <td>
                <span class="status ${status.toLowerCase()}">
                    ${status}
                </span>
            </td>

            <td>${hora}</td>

            <td>

                <button
                    class="presente"
                    ${status === "Presente" ? "disabled" : ""}
                >
                    ✔ Confirmar
                </button>

                <button
                    class="ausente"
                    ${status === "Ausente" ? "disabled" : ""}
                >
                    ❌ Ausente
                </button>

            </td>

        `;

        const btnPresente = linha.querySelector(".presente");
        const btnAusente = linha.querySelector(".ausente");

        btnPresente.addEventListener("click", async () => {

            btnPresente.disabled = true;
            btnAusente.disabled = true;

            try {

                await alterarStatus(
                    membro,
                    "Presente"
                );

            } catch (erro) {

                console.error(erro);

                btnPresente.disabled = false;
                btnAusente.disabled = false;

                alert("Erro ao salvar presença.");

            }

        });

        btnAusente.addEventListener("click", async () => {

            btnPresente.disabled = true;
            btnAusente.disabled = true;

            try {

                await alterarStatus(
                    membro,
                    "Ausente"
                );

            } catch (erro) {

                console.error(erro);

                btnPresente.disabled = false;
                btnAusente.disabled = false;

                alert("Erro ao salvar ausência.");

            }

        });

        listaPresenca.appendChild(linha);

    });

    atualizarContadores(
        membros.length,
        qtdPresentes,
        qtdPendentes,
        qtdAusentes
    );

}


// ======================================================
// CONTADORES
// ======================================================

function atualizarContadores(
    total,
    pres,
    pend,
    aus
) {

    totalMembros.textContent = total;

    presentes.textContent = pres;

    pendentes.textContent = pend;

    ausentes.textContent = aus;

}
// ======================================================
// EVENTOS DA TELA
// ======================================================

selectEvento.addEventListener("change", () => {

    carregarPresencas();

});


// ======================================================
// RESETAR FREQUÊNCIA (OPCIONAL)
// ======================================================

function limparTabela() {

    presencas = {};

    atualizarTabela();

}


// ======================================================
// ENCERRAR LISTENERS
// ======================================================

window.addEventListener("beforeunload", () => {

    if (unsubscribeEventos) {
        unsubscribeEventos();
        unsubscribeEventos = null;
    }

    if (unsubscribeMembros) {
        unsubscribeMembros();
        unsubscribeMembros = null;
    }

    if (unsubscribePresencas) {
        unsubscribePresencas();
        unsubscribePresencas = null;
    }

});


// ======================================================
// RECARREGAR PRESENÇAS CASO JÁ EXISTA UM EVENTO
// ======================================================

if (selectEvento.value) {

    carregarPresencas();

}


// ======================================================
// INICIALIZAÇÃO DOS CONTADORES
// ======================================================

atualizarContadores(
    0,
    0,
    0,
    0
);


// ======================================================
// LOG
// ======================================================

console.log("LADRF Connect - Frequência carregada com sucesso.");
