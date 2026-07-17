import { db } from "./firebase.js";

import {
doc,
getDoc,
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Pegar ID do atendimento pela URL

const parametros = new URLSearchParams(
window.location.search
);

const atendimentoId = parametros.get("id");

let nota = 0;


// Controle das estrelas

const estrelas = document.querySelectorAll(".star");


estrelas.forEach((estrela)=>{


estrela.addEventListener("click",()=>{


nota = Number(
estrela.dataset.star
);



estrelas.forEach((s)=>{


if(Number(s.dataset.star) <= nota){

s.classList.add("ativa");

}else{

s.classList.remove("ativa");

}


});


});


});



// Buscar atendimento

async function carregarAtendimento(){


if(!atendimentoId){

alert("Atendimento não encontrado.");

return;

}



const atendimentoRef = doc(

db,

"atendimentos",

atendimentoId

);



const atendimentoDoc = await getDoc(

atendimentoRef

);



if(atendimentoDoc.exists()){


const dados = atendimentoDoc.data();



document.getElementById("paciente").innerHTML =

dados.paciente || "Não informado";



document.getElementById("membro").innerHTML =

dados.membro || "Não informado";



}else{


document.getElementById("paciente").innerHTML =
"Não encontrado";


document.getElementById("membro").innerHTML =
"Não encontrado";


}


}



carregarAtendimento();




// Salvar avaliação


document.getElementById("btnEnviar")
.addEventListener("click", async()=>{



const espera = document.querySelector(
'input[name="espera"]:checked'
);



const equipe = document.querySelector(
'input[name="equipe"]:checked'
);



const resolucao = document.querySelector(
'input[name="resolucao"]:checked'
);



if(nota === 0){

alert("Selecione uma nota de 1 a 5 estrelas.");

return;

}



if(!espera || !equipe || !resolucao){

alert("Responda todas as perguntas.");

return;

}



const avaliacao = {


atendimentoId,

nota,

espera: espera.value,

equipe: equipe.value,

resolucao: resolucao.value,

comentario:

document.getElementById("comentario").value,


data:

serverTimestamp()


};



try{


await addDoc(

collection(db,"avaliacoes"),

avaliacao

);



alert(
"Avaliação enviada com sucesso! Obrigado."
);



window.location.href="index.html";



}catch(erro){


console.error(erro);


alert(
"Erro ao enviar avaliação."
);


}



});
