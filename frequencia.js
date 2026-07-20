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

// Guarda as presenças carregadas
let registrosPresenca = {};

// Guarda o listener ativo da coleção "presencas"
let unsubscribePresencas = null;

// =====================================================
// CARREGAR EVENTOS
// =====================================================

onSnapshot(collection(db, "agenda"), (snapshot) => {

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

});

// =====================================================
// CARREGAR MEMBROS
// =====================================================

onSnapshot(collection(db, "membros"), (snapshot) => {

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

});

// =====================================================
// CARREGAR PRESENÇAS
// =====================================================

function carregarPresencas() {

    const eventoId = selectEvento.value;

    // Remove o listener anterior
    if (unsubscribePresencas) {
        unsubscribePresencas();
        unsubscribePresencas = null;
    }

    registrosPresenca = {};

    if (!eventoId) {

        atualizarTabela();
        return;

    }

    unsubscribePresencas = onSnapshot(
        collection(db, "presencas"),
        (snapshot) => {

            registrosPresenca = {};

            snapshot.forEach((documento) => {

                const dados = documento.data();

                if (dados.eventoId === eventoId) {
                    registrosPresenca[dados.membroId] = dados.status;
                }

            });

            atualizarTabela();

        }
    );

}

// =====================================================
// SALVAR PRESENÇA
// =====================================================

async function salvarPresenca(membro, status) {

    const eventoId = selectEvento.value;

    if (!eventoId) {

        alert("Selecione um evento primeiro.");
        return;

    }

    const evento = eventos.find(e => e.id === eventoId);

    const idPresenca = `${eventoId}_${membro.id}`;

    await setDoc(
        doc(collection(db, "presencas"), idPresenca),
        {
            eventoId,
            evento: evento?.titulo || "",
            membroId: membro.id,
            membro: membro.nome,
            status,

            horaCheckin:
                status === "Presente"
                    ? new Date().toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit"
                      })
                    : null,

            criadoEm: Timestamp.now()
        }
    );

    console.log("Presença salva:", membro.nome, status);

}

// =====================================================
// ATUALIZAR TABELA
// =====================================================
// =====================================================
// ATUALIZAR TABELA
// =====================================================

function atualizarTabela() {

    listaPresenca.innerHTML = "";

    if (membros.length === 0) {

        listaPresenca.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhum membro encontrado.
                </td>
            </tr>
        `;

        atualizarResumo();
        return;

    }


    membros.forEach((membro) => {

        const status =
            registrosPresenca[membro.id] || "Pendente";


        let classeStatus = "";

        if (status === "Presente") {
            classeStatus = "presente";
        }

        else if (status === "Ausente") {
            classeStatus = "ausente";
        }

        else {
            classeStatus = "pendente";
        }


        listaPresenca.innerHTML += `

            <tr>

                <td>
                    ${membro.nome || "Sem nome"}
                </td>


                <td>
                    <span class="status ${classeStatus}">
                        ${status}
                    </span>
                </td>


                <td>

                    <button
                        class="btn-presente"
                        data-id="${membro.id}">
                        Presente
                    </button>


                    <button
                        class="btn-ausente"
                        data-id="${membro.id}">
                        Ausente
                    </button>

                </td>

            </tr>

        `;

    });


    adicionarEventosBotoes();

    atualizarResumo();

}


// =====================================================
// EVENTOS DOS BOTÕES
// =====================================================

function adicionarEventosBotoes() {


    document
    .querySelectorAll(".btn-presente")
    .forEach((botao) => {


        botao.onclick = () => {


            const membro = membros.find(
                m => m.id === botao.dataset.id
            );


            if (membro) {

                salvarPresenca(
                    membro,
                    "Presente"
                );

            }

        };


    });



    document
    .querySelectorAll(".btn-ausente")
    .forEach((botao) => {


        botao.onclick = () => {


            const membro = membros.find(
                m => m.id === botao.dataset.id
            );


            if (membro) {

                salvarPresenca(
                    membro,
                    "Ausente"
                );

            }

        };


    });


}


// =====================================================
// RESUMO DOS DADOS
// =====================================================

function atualizarResumo() {


    const valores =
        Object.values(registrosPresenca);


    const total =
        membros.length;


    const totalPresentes =
        valores.filter(
            item => item === "Presente"
        ).length;


    const totalAusentes =
        valores.filter(
            item => item === "Ausente"
        ).length;


    const totalPendentes =
        total -
        totalPresentes -
        totalAusentes;



    if (totalMembros) {

        totalMembros.textContent = total;

    }


    if (presentes) {

        presentes.textContent = totalPresentes;

    }


    if (ausentes) {

        ausentes.textContent = totalAusentes;

    }


    if (pendentes) {

        pendentes.textContent = totalPendentes;

    }


}
// =====================================================
// TROCA DE EVENTO
// =====================================================

selectEvento.addEventListener(
    "change",
    () => {

        registrosPresenca = {};

        carregarPresencas();

    }
);


// =====================================================
// INICIALIZAÇÃO
// =====================================================

function iniciarModuloFrequencia() {


    if (!selectEvento) {

        console.error(
            "Elemento evento não encontrado."
        );

        return;

    }


    if (!listaPresenca) {

        console.error(
            "Elemento listaPresenca não encontrado."
        );

        return;

    }


    atualizarTabela();


}




// =====================================================
// EXECUTAR
// =====================================================

iniciarModuloFrequencia();
// =====================================================
// LIMPEZA E SEGURANÇA DO LISTENER
// =====================================================

window.addEventListener(
    "beforeunload",
    () => {

        if (unsubscribePresencas) {

            unsubscribePresencas();

        }

    }
);


// =====================================================
// CORREÇÃO DE RECARREGAMENTO
// =====================================================

selectEvento.addEventListener(
    "change",
    function () {

        carregarPresencas();

    }
);


// =====================================================
// PRIMEIRA CARGA
// =====================================================

if (membros.length > 0) {

    atualizarTabela();

}
