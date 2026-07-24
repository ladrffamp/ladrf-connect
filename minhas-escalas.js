// minhas-escalas.js


console.log("MINHAS ESCALAS JS CARREGADO");



import { db, auth } from "./firebase.js";


import {

collection,
getDocs,
doc,
updateDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





const lista = document.getElementById("listaEscalas");









// =====================================
// CARREGAR ESCALAS
// =====================================


async function carregarEscalas(uid){



if(!lista){

console.error(
"listaEscalas não encontrada"
);

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





lista.innerHTML = "";



let encontrou = false;






for(const acaoDoc of agendaSnapshot.docs){



const dadosAcao = acaoDoc.data();





const participantesSnapshot = await getDocs(

collection(

db,

"agenda",

acaoDoc.id,

"participantes"

)

);





const participanteDoc = participantesSnapshot.docs.find(

(item)=>item.id === uid

);





if(!participanteDoc){

continue;

}





encontrou = true;



const dadosParticipante = participanteDoc.data();







let areaResposta = "";





if(

dadosParticipante.presenca === "Pendente"

){


areaResposta = `


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


`;



}

else if(

dadosParticipante.presenca === "Confirmado"

){



areaResposta = `


<div class="card">


🟢 Presença confirmada


</div>


`;



}

else if(

dadosParticipante.presenca === "Recusado"

){



areaResposta = `


<div class="card">


🔴 Você informou que não poderá comparecer.


</div>


`;



}









lista.innerHTML += `



<div class="card">


<h2>

<i class="fa-solid fa-calendar-check"></i>

${dadosAcao.titulo || "Ação sem título"}

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

${dadosAcao.inicio || "-"}

até

${dadosAcao.fim || "-"}

</strong>

</p>





<p>

👤 Responsável:

<strong>

${dadosAcao.responsavel || "-"}

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

<strong>

${dadosParticipante.presenca || "Pendente"}

</strong>

</p>





${areaResposta}



</div>



`;




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



const usuario = auth.currentUser;



if(!usuario){

alert(

"Usuário não autenticado"

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


presenca:"Confirmado",


confirmadoEm:serverTimestamp()


}

);





alert(

"Presença confirmada!"

);





carregarEscalas(

usuario.uid

);






}catch(error){



console.error(

"Erro ao confirmar presença:",

error

);



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

"Usuário não autenticado"

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


presenca:"Recusado",


respondidoEm:serverTimestamp()


}

);





alert(

"Resposta enviada!"

);





carregarEscalas(

usuario.uid

);






}catch(error){



console.error(

"Erro ao recusar presença:",

error

);



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



console.log(

"Usuário logado:",

usuario.uid

);



carregarEscalas(

usuario.uid

);



}else{



if(lista){

lista.innerHTML =

"Usuário não logado.";

}



}



});
