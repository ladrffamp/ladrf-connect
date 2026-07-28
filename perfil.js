import { db, auth } from "./firebase.js";

import {
collection,
doc,
getDoc,
getDocs,
query,
where,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// =====================================
// ELEMENTOS
// =====================================

const foto = document.getElementById("fotoPerfil");

const nome = document.getElementById("nomePerfil");

const funcao = document.getElementById("funcaoPerfil");

const status = document.getElementById("statusPerfil");

const email = document.getElementById("emailPerfil");

const telefone = document.getElementById("telefonePerfil");

const curso = document.getElementById("cursoPerfil");

const periodo = document.getElementById("periodoPerfil");

const presencas = document.getElementById("totalPresencas");

const faltas = document.getElementById("totalFaltas");

const participacoes = document.getElementById("totalParticipacoes");

const certificados = document.getElementById("totalCertificados");

const horas = document.getElementById("totalHoras");

const listaEventos = document.getElementById("listaEventos");

const listaCertificados = document.getElementById("listaCertificados");

const historico = document.getElementById("historicoPerfil");

// =====================================
// IDENTIFICA O MEMBRO
// =====================================

let uid = new URLSearchParams(window.location.search).get("id");

onAuthStateChanged(auth, async(usuario)=>{

    if(!usuario){

        window.location.href="login.html";

        return;

    }

    if(!uid){

        uid = usuario.uid;

    }

    carregarPerfil(uid);

});
// =====================================
// CARREGAR DADOS DO MEMBRO
// =====================================

async function carregarPerfil(uid){

    try{

        const membroRef = doc(db,"membros",uid);

        const membroSnap = await getDoc(membroRef);

        if(!membroSnap.exists()){

            nome.innerHTML = "Membro não encontrado.";

            return;

        }

        const membro = membroSnap.data();

        // FOTO

        if(membro.foto && membro.foto !== ""){

            foto.src = membro.foto;

        }else{

            foto.src =
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(
                membro.nomeCompleto || membro.nome || "Membro"
            ) +
            "&background=0B7A3D&color=ffffff&size=300";

        }

        // DADOS PESSOAIS

        nome.innerHTML =
        membro.nomeCompleto || membro.nome || "-";

        funcao.innerHTML =
        `<i class="fa-solid fa-user-tie"></i> ${membro.funcao || "Membro"}`;

        status.innerHTML =
        `<i class="fa-solid fa-circle-check"></i> ${membro.status || "Ativo"}`;

        email.innerHTML =
        membro.email || "-";

        telefone.innerHTML =
        membro.telefone || "-";

        curso.innerHTML =
        membro.curso || "-";

        periodo.innerHTML =
        membro.periodo || "-";

        // Carrega os demais módulos

        carregarFrequencia(uid);

        carregarEventos();

        carregarCertificados(uid);

        carregarHistorico(uid);

    }

    catch(error){

        console.error(error);

        nome.innerHTML = "Erro ao carregar perfil.";

    }

}
// =====================================
// FREQUÊNCIA
// =====================================

async function carregarFrequencia(uid){

    const q = query(
        collection(db,"frequencias"),
        where("uid","==",uid)
    );

    onSnapshot(q,(snapshot)=>{

        let totalPresencas = 0;
        let totalFaltas = 0;
        let totalHoras = 0;

        snapshot.forEach((doc)=>{

            const item = doc.data();

            if(item.presente === true){

                totalPresencas++;

            }else{

                totalFaltas++;

            }

            totalHoras += Number(item.horas || 0);

        });

        presencas.innerHTML = totalPresencas;
        faltas.innerHTML = totalFaltas;
        horas.innerHTML = totalHoras + "h";

    });

}



// =====================================
// CERTIFICADOS
// =====================================

async function carregarCertificados(uid){

    const q = query(
        collection(db,"certificados"),
        where("uid","==",uid)
    );

    onSnapshot(q,(snapshot)=>{

        certificados.innerHTML = snapshot.size;

        listaCertificados.innerHTML = "";

        if(snapshot.empty){

            listaCertificados.innerHTML = `
            <p style="text-align:center">
            Nenhum certificado encontrado.
            </p>
            `;

            return;

        }

        snapshot.forEach((doc)=>{

            const cert = doc.data();

            listaCertificados.innerHTML += `

            <div class="card">

                <h3>${cert.evento || "Certificado"}</h3>

                <p>Carga horária: ${cert.cargaHoraria || 0}h</p>

                <a href="${cert.arquivo || "#"}"
                class="btn-success"
                target="_blank">

                Baixar PDF

                </a>

            </div>

            `;

        });

    });

}



// =====================================
// EVENTOS
// =====================================

async function carregarEventos(){

    onSnapshot(

        query(collection(db,"agenda")),

        (snapshot)=>{

            listaEventos.innerHTML = "";

            if(snapshot.empty){

                listaEventos.innerHTML = `
                <p style="text-align:center">
                Nenhum evento encontrado.
                </p>
                `;

                return;

            }

            snapshot.forEach((doc)=>{

                const evento = doc.data();

                listaEventos.innerHTML += `

                <div class="card">

                    <h3>${evento.titulo || "-"}</h3>

                    <p>

                    📅 ${evento.data || "-"}

                    </p>

                    <p>

                    🕒 ${evento.inicio || "-"} às ${evento.fim || "-"}

                    </p>

                    <p>

                    📍 ${evento.local || "-"}

                    </p>

                </div>

                `;

            });

        }

    );

}



// =====================================
// HISTÓRICO
// =====================================

async function carregarHistorico(uid){

    const q = query(
        collection(db,"atendimentos"),
        where("uid","==",uid)
    );

    onSnapshot(q,(snapshot)=>{

        participacoes.innerHTML = snapshot.size;

        historico.innerHTML = "";

        if(snapshot.empty){

            historico.innerHTML = `
            <p style="text-align:center">
            Nenhuma participação registrada.
            </p>
            `;

            return;

        }

        snapshot.forEach((doc)=>{

            const item = doc.data();

            historico.innerHTML += `

            <div class="card">

                <strong>${item.evento || "Atendimento"}</strong>

                <br>

                ${item.data || ""}

                <br>

                ${item.local || ""}

            </div>

            `;

        });

    });

}
