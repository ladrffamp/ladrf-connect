import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    onSnapshot,
    Timestamp,
    doc,
    deleteDoc,
    updateDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const avisosRef = collection(db, "avisos");

let avisoEditando = null;


// ======================================
// SALVAR / ATUALIZAR AVISO
// ======================================

window.salvarAviso = async function(){

    const titulo =
    document.getElementById("titulo").value.trim();

    const categoria =
    document.getElementById("categoria").value;

    const prioridade =
    document.getElementById("prioridade").value;

    const dataEvento =
    document.getElementById("dataEvento").value;

    const horaEvento =
    document.getElementById("horaEvento").value;

    const localEvento =
    document.getElementById("localEvento").value.trim();

    const mensagem =
    document.getElementById("mensagem").value.trim();

    const fixado =
    document.getElementById("fixado").checked;

    if(!titulo || !mensagem){

        alert("Preencha o título e a mensagem.");

        return;

    }

    try{

        if(avisoEditando){

            await updateDoc(

                doc(db,"avisos",avisoEditando),

                {

                    titulo,
                    categoria,
                    prioridade,
                    dataEvento,
                    horaEvento,
                    localEvento,
                    mensagem,
                    fixado

                }

            );

            alert("Aviso atualizado com sucesso!");

            avisoEditando = null;

        }else{

            await addDoc(

    avisosRef,

    {

        titulo,
        categoria,
        prioridade,
        dataEvento,
        horaEvento,
        localEvento,
        mensagem,
        fixado,
        status:"Ativo",
        dataPublicacao: Timestamp.now()

    }

);

            alert("Aviso publicado com sucesso!");

        }

        limparFormulario();

        document.getElementById("tituloFormulario").innerHTML =
        `
        <i class="fa-solid fa-plus"></i>
        Novo Aviso
        `;

        document.getElementById("btnSalvarAviso").innerHTML =
        `
        <i class="fa-solid fa-paper-plane"></i>
        Publicar Aviso
        `;

        document.getElementById("btnCancelarEdicao").style.display =
        "none";

    }catch(erro){

        console.error(erro);

        alert("Erro ao salvar aviso.");

    }

};


// ======================================
// LIMPAR FORMULÁRIO
// ======================================

function limparFormulario(){

    document.getElementById("titulo").value="";

    document.getElementById("categoria").selectedIndex=0;

    document.getElementById("prioridade").selectedIndex=0;

    document.getElementById("dataEvento").value="";

    document.getElementById("horaEvento").value="";

    document.getElementById("localEvento").value="";

    document.getElementById("mensagem").value="";

    document.getElementById("fixado").checked=false;

}
// ======================================
// LISTAR AVISOS
// ======================================

onSnapshot(avisosRef,(snapshot)=>{

    const lista =
    document.getElementById("listaAvisos");

    lista.innerHTML="";

    if(snapshot.empty){

        lista.innerHTML=`

        <p style="text-align:center">

        Nenhum aviso publicado.

        </p>

        `;

        return;

    }

    let avisos=[];

    snapshot.forEach((documento)=>{

        avisos.push({

            id:documento.id,

            ...documento.data()

        });

    });

    // Fixados primeiro e depois por data de publicação
    avisos.sort((a,b)=>{

        if(a.fixado && !b.fixado){

            return -1;

        }

        if(!a.fixado && b.fixado){

            return 1;

        }

        const dataA =
        a.dataPublicacao?.seconds || 0;

        const dataB =
        b.dataPublicacao?.seconds || 0;

        return dataB - dataA;

    });

    avisos.forEach((aviso)=>{

        let dataPublicacao="-";

        if(aviso.dataPublicacao?.seconds){

            dataPublicacao =

            new Date(

                aviso.dataPublicacao.seconds * 1000

            ).toLocaleString("pt-BR");

        }

        lista.innerHTML += `

        <div class="card">

            <h2>

                ${aviso.fixado ? "📌 " : ""}

                ${aviso.titulo}

            </h2>

            <p>

                <strong>Categoria:</strong>

                ${aviso.categoria}

            </p>

            <p>

                <strong>Prioridade:</strong>

                ${aviso.prioridade}

            </p>

            <p>

                📅 <strong>Data:</strong>

                ${aviso.dataEvento || "-"}

            </p>

            <p>

                🕒 <strong>Horário:</strong>

                ${aviso.horaEvento || "-"}

            </p>

            <p>

                📍 <strong>Local:</strong>

                ${aviso.localEvento || "-"}

            </p>

            <hr>

            <p>

                ${aviso.mensagem}

            </p>

            <small>

    Publicado em:

    ${dataPublicacao}

</small>

<p>

<strong>Status:</strong>

<span class="${
    aviso.status === "Concluído"
        ? "status concluido"
        : "status programado"
}">

${aviso.status || "Ativo"}

</span>

</p>

<br><br>

<button
class="btn-primary"
onclick="editarAviso('${aviso.id}')">

<i class="fa-solid fa-pen"></i>

Editar

</button>

${
aviso.status !== "Concluído"
?
`
<button
class="btn-success"
onclick="concluirAviso('${aviso.id}')">

<i class="fa-solid fa-check"></i>

Concluir

</button>
`
:
""
}

<button
class="btn-danger"
onclick="excluirAviso('${aviso.id}')">


            <i class="fa-solid fa-trash"></i>

            Excluir

            </button>

        </div>

        `;

    });

});
// ======================================
// EDITAR AVISO
// ======================================

window.editarAviso = async function(id){

    try{

        const documento = await getDoc(
            doc(db,"avisos",id)
        );

        if(!documento.exists()){

            alert("Aviso não encontrado.");

            return;

        }

        const aviso = documento.data();

        avisoEditando = id;

        document.getElementById("titulo").value =
        aviso.titulo || "";

        document.getElementById("categoria").value =
        aviso.categoria || "Comunicado";

        document.getElementById("prioridade").value =
        aviso.prioridade || "Baixa";

        document.getElementById("dataEvento").value =
        aviso.dataEvento || "";

        document.getElementById("horaEvento").value =
        aviso.horaEvento || "";

        document.getElementById("localEvento").value =
        aviso.localEvento || "";

        document.getElementById("mensagem").value =
        aviso.mensagem || "";

        document.getElementById("fixado").checked =
        aviso.fixado || false;

        document.getElementById("tituloFormulario").innerHTML =
        `
        <i class="fa-solid fa-pen"></i>
        Editar Aviso
        `;

        document.getElementById("btnSalvarAviso").innerHTML =
        `
        <i class="fa-solid fa-save"></i>
        Salvar Alteração
        `;

        document.getElementById("btnCancelarEdicao").style.display =
        "inline-block";

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }catch(erro){

        console.error(erro);

        alert("Erro ao carregar aviso.");

    }

};


// ======================================
// CANCELAR EDIÇÃO
// ======================================

window.cancelarEdicao = function(){

    avisoEditando = null;

    limparFormulario();

    document.getElementById("tituloFormulario").innerHTML =
    `
    <i class="fa-solid fa-plus"></i>
    Novo Aviso
    `;

    document.getElementById("btnSalvarAviso").innerHTML =
    `
    <i class="fa-solid fa-paper-plane"></i>
    Publicar Aviso
    `;

    document.getElementById("btnCancelarEdicao").style.display =
    "none";

};


// ======================================
// EXCLUIR AVISO
// ======================================

window.excluirAviso = async function(id){

    const confirmar = confirm(
        "Deseja realmente excluir este aviso?"
    );

    if(!confirmar){

        return;

    }

    try{

        await deleteDoc(
            doc(db,"avisos",id)
        );

        if(avisoEditando === id){

            cancelarEdicao();

        }

        alert("Aviso excluído com sucesso!");

    }catch(erro){

        console.error(erro);

        alert("Erro ao excluir aviso.");

    }

};

// ======================================
// CONCLUIR AVISO
// ======================================

window.concluirAviso = async function(id){

    const confirmar = confirm(
        "Marcar este aviso como concluído?"
    );

    if(!confirmar){
        return;
    }

    try{

        await updateDoc(
            doc(db,"avisos",id),
            {
                status:"Concluído"
            }
        );

        alert("Aviso concluído com sucesso!");

    }catch(erro){

        console.error(erro);

        alert("Erro ao concluir aviso.");

    }

};