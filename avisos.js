import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    onSnapshot,
    Timestamp,
    doc,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const avisosRef = collection(db, "avisos");

// ======================================
// PUBLICAR AVISO
// ======================================

window.salvarAviso = async function () {

    const titulo = document.getElementById("titulo").value.trim();
    const categoria = document.getElementById("categoria").value;
    const prioridade = document.getElementById("prioridade").value;

    const dataEvento = document.getElementById("dataEvento").value;
    const horaEvento = document.getElementById("horaEvento").value;
    const localEvento = document.getElementById("localEvento").value.trim();

    const mensagem = document.getElementById("mensagem").value.trim();
    const fixado = document.getElementById("fixado").checked;

    if (!titulo || !mensagem) {

        alert("Preencha o título e a mensagem.");

        return;

    }

    try {

        await addDoc(avisosRef, {

            titulo,
            categoria,
            prioridade,
            dataEvento,
            horaEvento,
            localEvento,
            mensagem,
            fixado,
            dataPublicacao: Timestamp.now()

        });

        alert("Aviso publicado com sucesso!");

        document.getElementById("titulo").value = "";
        document.getElementById("categoria").selectedIndex = 0;
        document.getElementById("prioridade").selectedIndex = 0;
        document.getElementById("dataEvento").value = "";
        document.getElementById("horaEvento").value = "";
        document.getElementById("localEvento").value = "";
        document.getElementById("mensagem").value = "";
        document.getElementById("fixado").checked = false;

    } catch (erro) {

        console.error(erro);

        alert("Erro ao publicar aviso.");

    }

};

// ======================================
// LISTAR AVISOS
// ======================================

onSnapshot(avisosRef, (snapshot) => {

    const lista = document.getElementById("listaAvisos");

    lista.innerHTML = "";

    if (snapshot.empty) {

        lista.innerHTML = `
            <p style="text-align:center;">
                Nenhum aviso publicado.
            </p>
        `;

        return;

    }

    const avisos = [];

    snapshot.forEach((doc) => {

        avisos.push({
            id: doc.id,
            ...doc.data()
        });

    });

    // Avisos fixados aparecem primeiro
    avisos.sort((a, b) => {

        if (a.fixado && !b.fixado) return -1;
        if (!a.fixado && b.fixado) return 1;

        const dataA = a.dataPublicacao?.seconds || 0;
        const dataB = b.dataPublicacao?.seconds || 0;

        return dataB - dataA;

    });

    avisos.forEach((aviso) => {

        let dataPublicacao = "-";

        if (aviso.dataPublicacao?.seconds) {

            dataPublicacao = new Date(
                aviso.dataPublicacao.seconds * 1000
            ).toLocaleString("pt-BR");

        }

        lista.innerHTML += `

        <div class="card">

            <h2>${aviso.fixado ? "📌 " : ""}${aviso.titulo}</h2>

            <p><strong>Categoria:</strong> ${aviso.categoria}</p>

            <p><strong>Prioridade:</strong> ${aviso.prioridade}</p>

            <p><strong>📅 Data:</strong> ${aviso.dataEvento || "-"}</p>

            <p><strong>🕒 Horário:</strong> ${aviso.horaEvento || "-"}</p>

            <p><strong>📍 Local:</strong> ${aviso.localEvento || "-"}</p>

            <hr>

            <p>${aviso.mensagem}</p>

            <small>
                Publicado em ${dataPublicacao}
            </small>

        </div>

        `;

    });

});
