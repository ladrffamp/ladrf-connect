// meu-painel.js

import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const boasVindas =
document.getElementById("boasVindas");


const listaEscalas =
document.getElementById("listaEscalas");


const totalEventos =
document.getElementById("totalEventos");


const totalHoras =
document.getElementById("totalHoras");


const totalPresencas =
document.getElementById("totalPresencas");





// =====================================
// LOGIN
// =====================================


onAuthStateChanged(

auth,

(usuario)=>{


if(!usuario){

window.location.href="login.html";

return;

}



boasVindas.innerHTML =

`👋 Bem-vindo ${usuario.email}`;



carregarPainel(usuario.uid);


}

);







// =====================================
// CARREGAR PAINEL
// =====================================


async function carregarPainel(uid){


try{


listaEscalas.innerHTML =

"Carregando escalas...";



const agendaSnapshot = await getDocs(

collection(
db,
"agenda"
)

);




let eventos = 0;

let horas = 0;

let presencas = 0;

let encontrou = false;




listaEscalas.innerHTML = "";





for(const acao of agendaSnapshot.docs){



const dadosAcao = acao.data();




const participantes = await getDocs(

collection(

db,

"agenda",

acao.id,

"participantes"

)

);





const participante = participantes.docs.find(

(item)=>item.id === uid

);





if(participante){



encontrou = true;



const dadosParticipante = participante.data();




listaEscalas.innerHTML += `


<div class="card">


<h3>

<i class="fa-solid fa-calendar-check"></i>

${dadosAcao.titulo || "Sem título"}

</h3>


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

Status:

<strong>

${dadosParticipante.presenca || "Pendente"}

</strong>

</p>



</div>

`;





if(

dadosParticipante.presenca === "Confirmada"

){



presencas++;



eventos++;




if(

dadosAcao.inicio &&

dadosAcao.fim

){


horas += calcularHoras(

dadosAcao.inicio,

dadosAcao.fim

);


}



}



}





}







if(!encontrou){



listaEscalas.innerHTML = `


<div class="card">


Nenhuma escala encontrada.


</div>


`;



}







totalEventos.innerHTML = eventos;


totalHoras.innerHTML = horas + "h";


totalPresencas.innerHTML = presencas;





}catch(error){


console.error(

"Erro painel:",

error

);



listaEscalas.innerHTML =

"Erro ao carregar painel.";





}



}







// =====================================
// CALCULAR HORAS
// =====================================


function calcularHoras(inicio,fim){



const inicioPartes = inicio.split(":");


const fimPartes = fim.split(":");



const inicioMin =

(Number(inicioPartes[0])*60)

+

Number(inicioPartes[1]);




const fimMin =

(Number(fimPartes[0])*60)

+

Number(fimPartes[1]);




return (

fimMin - inicioMin

) / 60;



}
