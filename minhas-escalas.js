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


console.log("Buscando escalas para UID:");
console.log(uid);



if(!lista){

console.error("Elemento listaEscalas não encontrado");

return;

}



lista.innerHTML = `

<div style="text-align:center">

<i class="fa-solid fa-spinner fa-spin"></i>

Carregando escalas...

</div>

`;



try{


const agendaSnapshot = await getDocs(

collection(
db,
"agenda"
)

);



console.log(
"Quantidade de ações encontradas:",
agendaSnapshot.size
);



lista.innerHTML = "";


let encontrou = false;




for(const acaoDoc of agendaSnapshot.docs){



console.log(
"Verificando ação:",
acaoDoc.id
);



const dadosAcao = acaoDoc.data();



console.log(
"Dados da ação:",
dadosAcao
);




const participantesSnapshot = await getDocs(

collection(

db,

"agenda",

acaoDoc.id,

"participantes"

)

);



console.log(

"Participantes da ação:",

participantesSnapshot.size

);




participantesSnapshot.forEach((item)=>{


console.log(
"UID participante:",
item.id
);


});





const participante = participantesSnapshot.docs.find(

(item)=>item.id === uid

);




if(participante){


encontrou = true;



const dadosParticipante =
participante.data();




lista.innerHTML += `


<div class="card">


<h2>

<i class="fa-solid fa-calendar-check"></i>

${dadosAcao.titulo || "Ação sem título"}

</h2>



<p>

📅 Data:

<b>

${dadosAcao.data || "-"}

</b>

</p>



<p>

📍 Local:

<b>

${dadosAcao.local || "-"}

</b>

</p>



<p>

⏰ Horário:

<b>

${dadosAcao.inicio || "-"}

até

${dadosAcao.fim || "-"}

</b>

</p>



<p>

Status:

<strong>

${dadosParticipante.presenca || "Pendente"}

</strong>

</p>




<div style="
display:flex;
gap:10px;
margin-top:15px;
flex-wrap:wrap;
">


<button

class="btn-success"

onclick="confirmarPresenca('${acaoDoc.id}')"

>

✅ Confirmar presença

</button>




<button

class="btn-danger"

onclick="recusarPresenca('${acaoDoc.id}')"

>

❌ Não poderei comparecer

</button>



</div>



</div>



`;



}



}




if(!encontrou){


console.warn(
"Nenhuma escala encontrada para este UID"
);



lista.innerHTML = `


<div class="card">


<h3>

Nenhuma escala encontrada.

</h3>


<p>

UID pesquisado:

<br>

${uid}

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


const usuario = auth.currentUser;


if(!usuario){

alert(
"Usuário não logado."
);

return;

}



try{


await updateDoc(

doc(

db,

"agenda",

idAcao,

"participantes",

usuario.uid

),

{

presenca:"Confirmado"

}

);



alert(
"Presença confirmada!"
);



carregarEscalas(usuario.uid);



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


const usuario = auth.currentUser;


if(!usuario){

alert(
"Usuário não logado."
);

return;

}



try{


await updateDoc(

doc(

db,

"agenda",

idAcao,

"participantes",

usuario.uid

),

{

presenca:"Recusado"

}

);



alert(
"Resposta enviada!"
);



carregarEscalas(usuario.uid);



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



console.log("====================");

console.log("USUÁRIO LOGADO");

console.log("UID:", usuario.uid);

console.log("EMAIL:", usuario.email);

console.log("====================");



carregarEscalas(

usuario.uid

);



}else{


lista.innerHTML =

"Usuário não logado.";


}



});
