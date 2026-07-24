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


window.location.href =
"login.html";


return;


}



boasVindas.innerHTML =

`👋 Bem-vindo ${usuario.email}`;



carregarPainel(
usuario.uid
);



}

);









// =====================================
// CARREGAR PAINEL
// =====================================


async function carregarPainel(uid){



try{



listaEscalas.innerHTML = `


<div class="card">

<i class="fa-solid fa-spinner fa-spin"></i>

Carregando escalas...

</div>


`;






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



let escalasMostradas = new Set();






listaEscalas.innerHTML = "";







for(const acao of agendaSnapshot.docs){



const dadosAcao =
acao.data();






const participantesSnapshot = await getDocs(

collection(

db,

"agenda",

acao.id,

"participantes"

)

);






const participante =

participantesSnapshot.docs.find(

(item)=>item.id === uid

);







if(participante){



encontrou = true;





// evita aparecer duas vezes

if(escalasMostradas.has(acao.id)){

continue;

}



escalasMostradas.add(
acao.id
);






const dadosParticipante =
participante.data();







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





</div>



`;








// =====================================
// CONTAGEM DE PARTICIPAÇÃO
// =====================================



if(

dadosParticipante.presenca === "Confirmado"

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


<h3>

Nenhuma escala encontrada.

</h3>


<p>

Você ainda não possui ações atribuídas.

</p>


</div>


`;



}







// atualizar resumo


totalEventos.innerHTML =
eventos;


totalHoras.innerHTML =
horas + "h";


totalPresencas.innerHTML =
presencas;






}catch(error){



console.error(
"Erro ao carregar painel:",
error
);



listaEscalas.innerHTML = `


<div class="card">

Erro ao carregar escalas.

</div>


`;



}



}









// =====================================
// CALCULAR HORAS
// =====================================


function calcularHoras(
inicio,
fim
){



const inicioPartes =
inicio.split(":");



const fimPartes =
fim.split(":");




const inicioMinutos =

(Number(inicioPartes[0]) * 60)

+

Number(inicioPartes[1]);





const fimMinutos =

(Number(fimPartes[0]) * 60)

+

Number(fimPartes[1]);





return (

fimMinutos - inicioMinutos

) / 60;



}
