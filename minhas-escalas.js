// minhas-escalas.js

import { db, auth } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const lista = document.getElementById("listaEscalas");




// =====================================
// CARREGAR ESCALAS DO MEMBRO
// =====================================

async function carregarEscalas(uid){


if(!lista) return;



lista.innerHTML = `

<div style="text-align:center">

<i class="fa-solid fa-spinner fa-spin"></i>

Buscando escalas...

</div>

`;



try{


const acoesSnapshot = await getDocs(

collection(db,"agenda")

);



lista.innerHTML = "";



let encontrou = false;



for(const acaoDoc of acoesSnapshot.docs){


const dadosAcao = acaoDoc.data();




const participantesSnapshot = await getDocs(

collection(

db,

"acoes",

acaoDoc.id,

"participantes"

)

);




const participanteDoc = participantesSnapshot.docs.find(

(doc)=>doc.id === uid

);




if(participanteDoc){


encontrou = true;



const participante = participanteDoc.data();




lista.innerHTML += `

<div class="card" style="margin-bottom:20px;">



<h2>

<i class="fa-solid fa-calendar-check"></i>

${dadosAcao.titulo || dadosAcao.nome || "Ação sem nome"}

</h2>




<p>

📅 Data:

<strong>

${dadosAcao.data || "-"}

</strong>

</p>




<p>

📍 Local:

<strong>

${dadosAcao.local || "-"}

</strong>

</p>




<p>

⏰ Horário:

<strong>

${dadosAcao.inicio || dadosAcao.horaInicio || "-"}

até

${dadosAcao.fim || dadosAcao.horaFim || "-"}

</strong>

</p>




<p>

📌 Tipo:

<strong>

${dadosAcao.tipo || "-"}

</strong>

</p>




<p>

Status:

<b>

${participante.presenca || "Pendente"}

</b>

</p>





<div style="
display:flex;
gap:10px;
flex-wrap:wrap;
margin-top:15px;
">



<button

class="btn-success"

onclick="confirmarPresenca('${acaoDoc.id}')"

>

<i class="fa-solid fa-check"></i>

Confirmar presença

</button>





<button

class="btn-danger"

onclick="recusarPresenca('${acaoDoc.id}')"

>

<i class="fa-solid fa-xmark"></i>

Não poderei comparecer

</button>



</div>



</div>

`;



}



}




if(!encontrou){


lista.innerHTML = `

<div class="card">


<h3>

Nenhuma escala encontrada.

</h3>


<p>

Você ainda não possui ações atribuídas.

</p>


</div>

`;



}



}catch(error){


console.error(
"Erro ao carregar escalas:",
error
);



lista.innerHTML = `

<div class="card">

Erro ao carregar escalas.

</div>

`;



}



}







// =====================================
// CONFIRMAR PRESENÇA
// =====================================


window.confirmarPresenca = async function(idAcao){


if(!auth.currentUser){

alert(
"Usuário não autenticado."
);

return;

}



const uid = auth.currentUser.uid;



try{


await updateDoc(

doc(

db,

"acoes",

idAcao,

"participantes",

uid

),

{

presenca:"Confirmado"

}

);



alert(
"Presença confirmada!"
);



carregarEscalas(uid);



}catch(error){


console.error(error);


alert(
"Erro ao confirmar presença."
);


}



};







// =====================================
// RECUSAR PRESENÇA
// =====================================


window.recusarPresenca = async function(idAcao){



if(!auth.currentUser){

alert(
"Usuário não autenticado."
);

return;

}



const uid = auth.currentUser.uid;



try{


await updateDoc(

doc(

db,

"acoes",

idAcao,

"participantes",

uid

),

{

presenca:"Recusado"

}

);



alert(
"Resposta enviada!"
);



carregarEscalas(uid);



}catch(error){


console.error(error);


alert(
"Erro ao enviar resposta."
);


}



};








// =====================================
// LOGIN
// =====================================


onAuthStateChanged(

auth,

(usuario)=>{


if(usuario){


carregarEscalas(usuario.uid);



}else{


if(lista){

lista.innerHTML = `

<div class="card">

Usuário não logado.

</div>

`;

}


}



}

);
