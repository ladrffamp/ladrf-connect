import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    onSnapshot,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const avisosRef = collection(db, "avisos");

// ===============================
// PUBLICAR AVISO
// ===============================

window.salvarAviso = async function () {

    const titulo = document.getElementById("titulo").value.trim();
    const categoria = document.getElementById("categoria").value;
    const prioridade = document.getElementById("prioridade").value;
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
            mensagem,
            fixado,
            data: Timestamp.now()

        });

        alert("Aviso publicado com sucesso!");

        document.getElementById("titulo").value = "";
        document.getElementById("mensagem").value = "";
        document.getElementById("categoria").selectedIndex = 0;
        document.getElementById("prioridade").selectedIndex = 0;
        document.getElementById("fixado").checked = false;

    } catch (erro) {

        console.error(erro);

        alert("Erro ao publicar aviso.");

    }

};

// ===============================
// LISTAR AVISOS
// ===============================

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

    snapshot.forEach((doc) => {

        const aviso = doc.data();

        let data = "-";

        if (aviso.data?.seconds) {

            data = new Date(
                aviso.data.seconds * 1000
            ).toLocaleString("pt-BR");

        }

        lista.innerHTML += `

        <div class="card">

            <h2>${aviso.fixado ? "📌 " : ""}${aviso.titulo}</h2>

            <p><strong>Categoria:</strong> ${aviso.categoria}</p>

            <p><strong>Prioridade:</strong> ${aviso.prioridade}</p>

            <p>${aviso.mensagem}</p>

            <small>${data}</small>

        </div>

        `;

    });

});
