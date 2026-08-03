// meu-painel.js


import { auth, db } from "./firebase.js";


import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
collection,
getDocs,
query,
where,
doc,
getDoc
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

const listaCertificadosUsuario =
document.getElementById("listaCertificadosUsuario");





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



console.log(
"Usuário painel:",
usuario.uid
);



if(boasVindas){

boasVindas.innerHTML =

`👋 Bem-vindo ${usuario.email}`;

}



carregarPainel(usuario.uid);



}

);








// =====================================
// CARREGAR PAINEL
// =====================================


async function carregarPainel(uid){


try{


listaEscalas.innerHTML = `

<div class="card">

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





if(!participante){

continue;

}



encontrou = true;



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






// ================================
// CONTABILIZAR PARTICIPAÇÃO
// ================================



if(

dadosParticipante.presenca === "Confirmado" ||

dadosParticipante.presenca === "Confirmada"

){



eventos++;

presencas++;




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








if(!encontrou){


listaEscalas.innerHTML = `


<div class="card">


<h3>

Nenhuma escala encontrada.

</h3>


</div>


`;



}






// ================================
// ATUALIZAR RESUMO
// ================================


if(totalEventos){

totalEventos.innerHTML = eventos;

}



if(totalHoras){

totalHoras.innerHTML = horas + "h";

}



if(totalPresencas){

totalPresencas.innerHTML = presencas;

}




console.log(
"Resumo:",
{
eventos,
horas,
presencas
}
);


// ================================
// MEUS CERTIFICADOS
// ================================

if(listaCertificadosUsuario){


const certificados = await getDocs(

query(

collection(db,"certificados"),

where(
"membroId",
"==",
uid
)

)

);



listaCertificadosUsuario.innerHTML="";



if(certificados.empty){


listaCertificadosUsuario.innerHTML = `

<p>
Nenhum certificado disponível.
</p>

`;


}else{


certificados.forEach((item)=>{


const certificado =
item.data();



listaCertificadosUsuario.innerHTML += `


<div class="card">


<h3>

🏆 ${certificado.evento}

</h3>



<p>

Carga horária:

<strong>

${certificado.cargaHoraria}

</strong>

</p>



<p>

Data:

<strong>

${certificado.dataEmissao}

</strong>

</p>



<button
class="btn-success"
onclick="baixarCertificado('${item.id}')">

<i class="fa-solid fa-file-pdf"></i>

Baixar Certificado

</button>


</div>


`;


});


}


}


}catch(error){


console.error(

"Erro ao carregar painel:",

error

);



listaEscalas.innerHTML = `

<div class="card">

Erro ao carregar painel.

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



const inicioMin =

(Number(inicioPartes[0]) * 60)

+

Number(inicioPartes[1]);





const fimMin =

(Number(fimPartes[0]) * 60)

+

Number(fimPartes[1]);






let resultado =

(fimMin - inicioMin) / 60;




if(resultado < 0){

resultado += 24;

}



return resultado;



}
