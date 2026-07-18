// acoes.js

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// ELEMENTOS
// =====================================

const nome = document.getElementById("nome");
const data = document.getElementById("data");
const horaInicio = document.getElementById("horaInicio");
const horaFim = document.getElementById("horaFim");
const local = document.getElementById("local");
const modalidade = document.getElementById("modalidade");

const botaoSalvar =
document.getElementById("salvar");

const lista =
document.getElementById("lista");


// =====================================
// CRIAR AÇÃO
// =====================================

botaoSalvar.addEventListener(
"click",

async()=>{


    if(
        !nome.value ||
        !data.value ||
        !local.value
    ){

        alert(
            "Preencha nome, data e local."
        );

        return;

    }


    try{


        await addDoc(

            collection(
                db,
                "acoes"
            ),

            {

                nome:
                nome.value,

                data:
                data.value,

                horaInicio:
                horaInicio.value,

                horaFim:
                horaFim.value,

                local:
                local.value,

                modalidade:
                modalidade.value,

                status:
                "Aberta",

                criadoEm:
                serverTimestamp()

            }

        );


        alert(
            "Ação criada com sucesso!"
        );


        limparFormulario();

        carregarAcoes();


    }

    catch(error){

        console.error(
            "Erro ao criar ação:",
            error
        );

    }


});


// =====================================
// LISTAR AÇÕES
// =====================================

async function carregarAcoes(){


    lista.innerHTML =
    "Carregando...";


    try{


        const consulta =
        query(

            collection(
                db,
                "acoes"
            ),

            orderBy(
                "criadoEm",
                "desc"
            )

        );


        const resultado =
        await getDocs(
            consulta
        );


        lista.innerHTML="";


        resultado.forEach(

            (documento)=>{


                const acao =
                documento.data();


                const id =
                documento.id;


                lista.innerHTML += `


                <div style="
                border:1px solid #ccc;
                padding:15px;
                margin:10px;
                border-radius:10px;
                ">


                <h3>
                ${acao.nome}
                </h3>


                <p>
                📅 ${acao.data}
                </p>


                <p>
                ⏰ ${acao.horaInicio || "-"}
                até
                ${acao.horaFim || "-"}
                </p>


                <p>
                📍 ${acao.local}
                </p>


                <p>
                🏋️ ${acao.modalidade || "-"}
                </p>


                <p>
                Status:
                ${acao.status}
                </p>


                <button onclick="abrirEscala('${id}')">

                👥 Selecionar membros

                </button>


                </div>


                `;


            }

        );


        if(resultado.empty){

            lista.innerHTML =
            "Nenhuma ação cadastrada.";

        }


    }

    catch(error){

        console.error(
            "Erro ao listar ações:",
            error
        );

    }


}


// =====================================
// ABRIR ESCALA
// =====================================

window.abrirEscala = function(id){


    window.location.href =
    "gerenciar-acao.html?id=" + id;


};


// =====================================
// LIMPAR FORMULÁRIO
// =====================================

function limparFormulario(){

    nome.value="";
    data.value="";
    horaInicio.value="";
    horaFim.value="";
    local.value="";
    modalidade.value="";

}


// =====================================
// INICIAR
// =====================================

carregarAcoes();
