import { db } from "./firebase.js";

import {
collection,
query,
where,
onSnapshot,
getDocs,
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lista = document.getElementById("lista");

let pacientesFila = [];

async function encontrarMacaLivre(){

    const snapshot = await getDocs(
        collection(db,"macas")
    );

    let macaLivre = null;

    snapshot.forEach((item)=>{

        const maca = item.data();

        if(
            maca.status === "Livre" &&
            macaLivre === null
        ){

            macaLivre = {
                id:item.id,
                numero:maca.numero
            };

        }

    });

    return macaLivre;

}

const filaQuery = query(

    collection(db,"pacientes"),

    where("status","==","Aguardando")

);

onSnapshot(filaQuery,(snapshot)=>{

    pacientesFila=[];

    snapshot.forEach((item)=>{

        pacientesFila.push({

            id:item.id,

            ...item.data()

        });

    });

    pacientesFila.sort((a,b)=>{

        if(!a.criadoEm) return 1;

        if(!b.criadoEm) return -1;

        return a.criadoEm.seconds-b.criadoEm.seconds;

    });

    desenharTabela();

});

function desenharTabela(){

    lista.innerHTML="";

    if(pacientesFila.length===0){

        lista.innerHTML=`
        <tr>
            <td colspan="5">
                Nenhum paciente aguardando
            </td>
        </tr>
        `;

        return;

    }

    pacientesFila.forEach((paciente)=>{

        lista.innerHTML+=`

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
// ===============================
// CHAMAR PRÓXIMO PACIENTE
// ===============================

window.chamarProximo = async function(){

    if(pacientesFila.length===0){

        alert("Nenhum paciente aguardando.");

        return;

    }

    await chamarPaciente(
        pacientesFila[0].id
    );

};



// ===============================
// CHAMAR PACIENTE ESPECÍFICO
// ===============================

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
// ATUALIZAÇÃO AUTOMÁTICA DA FILA
// ==========================================

window.addEventListener("load", () => {

    console.log("Fila carregada com sucesso.");

});



// ==========================================
// FUNÇÃO PARA ATUALIZAR A TABELA
// ==========================================

function atualizarTabela(){

    lista.innerHTML = "";

    if(pacientesFila.length === 0){

        lista.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum paciente aguardando.
                </td>
            </tr>
        `;

        return;

    }

    pacientesFila.forEach((paciente)=>{

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



// Sempre que a lista mudar no Firestore,
// ela será redesenhada automaticamente.

onSnapshot(filaQuery,(snapshot)=>{

    pacientesFila=[];

    snapshot.forEach((docItem)=>{

        pacientesFila.push({

            id:docItem.id,

            ...docItem.data()

        });

    });

    pacientesFila.sort((a,b)=>{

        if(!a.criadoEm) return 1;
        if(!b.criadoEm) return -1;

        return a.criadoEm.seconds - b.criadoEm.seconds;

    });

    atualizarTabela();

});
