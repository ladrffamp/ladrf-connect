import { db } from "./firebase.js";

import {
doc,
getDoc,
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================================
// PEGAR ID DO ATENDIMENTO PELA URL
// =====================================================

const parametros = new URLSearchParams(
window.location.search
);

const atendimentoId = parametros.get("id");


let nota = 0;



// =====================================================
// CONTROLE DAS ESTRELAS
// =====================================================

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




// =====================================================
// CARREGAR DADOS DO ATENDIMENTO
// =====================================================

async function carregarAtendimento(){


if(!atendimentoId){


document.getElementById("paciente").innerHTML =
"Atendimento não identificado";


document.getElementById("membro").innerHTML =
"Não informado";


return;

}



try{


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



}catch(erro){


console.error(

"Erro ao carregar atendimento:",

erro

);



}



}



carregarAtendimento();






// =====================================================
// ENVIAR AVALIAÇÃO
// =====================================================


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



const indicaria = document.querySelector(
'input[name="indicaria"]:checked'
);





if(nota === 0){


alert(
"Selecione uma nota de 1 a 5 estrelas."
);


return;


}




if(
!espera ||
!equipe ||
!resolucao ||
!indicaria
){


alert(
"Responda todas as perguntas."
);


return;


}






const avaliacao = {


atendimentoId,


nota,


espera: espera.value,


equipe: equipe.value,


resolucao: resolucao.value,


indicaria: indicaria.value,


comentario:

document.getElementById("comentario").value.trim(),



data:

serverTimestamp()



};







try{



await addDoc(

collection(db,"avaliacoes"),

avaliacao

);






document.querySelector(".card").innerHTML = `


<div style="text-align:center;padding:40px 20px;">


<i class="fa-solid fa-circle-check"

style="font-size:70px;color:#16a34a;">

</i>



<h2 style="

margin-top:20px;

color:#0B7A3B;

">

Avaliação enviada com sucesso!

</h2>



<p style="

margin-top:20px;

line-height:1.8;

color:#555;

">


Obrigado por contribuir com a nossa formação.


<br><br>


Sua opinião ajuda a LADRF a melhorar cada atendimento.


<br><br>


Acompanhe nossas ações e eventos.


</p>





<a

href="https://instagram.com/ladrf.famp"

target="_blank"

style="

display:inline-flex;

align-items:center;

gap:10px;

margin-top:30px;

padding:14px 24px;

background:#0B7A3B;

color:white;

border-radius:12px;

text-decoration:none;

font-weight:600;

">


<i class="fa-brands fa-instagram"></i>


Seguir @ladrf.famp


</a>



</div>


`;





}catch(erro){



console.error(

"Erro ao salvar avaliação:",

erro

);



alert(

"Erro ao enviar avaliação."

);



}



});
