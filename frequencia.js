import { db } from "./firebase.js";

import {
collection,
doc,
setDoc,
onSnapshot,
Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const selectEvento = document.getElementById("evento");
const listaPresenca = document.getElementById("listaPresenca");

const totalMembros = document.getElementById("totalMembros");
const presentes = document.getElementById("presentes");
const pendentes = document.getElementById("pendentes");
const ausentes = document.getElementById("ausentes");


let membros = [];
let eventos = [];

let registrosPresenca = {};


// controla o listener das presenças
let cancelarPresencas = null;


// guarda evento selecionado
let eventoAtual = localStorage.getItem("eventoSelecionado") || "";



// ==========================
// CARREGAR EVENTOS
// ==========================

onSnapshot(
collection(db,"agenda"),
(snapshot)=>{


eventos=[];


selectEvento.innerHTML=`

<option value="">
Selecione um evento
</option>

`;



snapshot.forEach((documento)=>{


const evento = documento.data();


eventos.push({

id:documento.id,

...evento

});



selectEvento.innerHTML += `

<option value="${documento.id}">
${evento.titulo}
</option>

`;



});


// recupera evento após atualizar página

if(eventoAtual){

selectEvento.value = eventoAtual;

carregarPresencas();

}


}

);



// ==========================
// CARREGAR MEMBROS
// ==========================


onSnapshot(
collection(db,"membros"),
(snapshot)=>{


membros=[];


snapshot.forEach((documento)=>{


const membro = documento.data();



if(membro.status==="Ativo"){


membros.push({

id:documento.id,

...membro

});


}


});


atualizarTabela();


}

// ==========================
// CARREGAR PRESENÇAS DO FIRESTORE
// ==========================

function carregarPresencas(){


const eventoId = selectEvento.value;



if(!eventoId){


registrosPresenca = {};

atualizarTabela();

return;

}



// salva evento escolhido

localStorage.setItem(
"eventoSelecionado",
eventoId
);



// remove listener antigo

if(cancelarPresencas){

cancelarPresencas();

}




cancelarPresencas = onSnapshot(

collection(db,"presencas"),

(snapshot)=>{


registrosPresenca = {};



snapshot.forEach((documento)=>{


const dados = documento.data();



if(dados.eventoId === eventoId){


registrosPresenca[dados.membroId] = dados;


}


});



atualizarTabela();



}

);


}
// ==========================
// SALVAR PRESENÇA
// ==========================

async function salvarPresenca(
membro,
status
){


const eventoId = selectEvento.value;



if(!eventoId){


alert(
"Selecione um evento primeiro."
);


return;

}



const evento = eventos.find(
e=>e.id===eventoId
);



const idPresenca =

eventoId + "_" + membro.id;



await setDoc(

doc(
collection(db,"presencas"),
idPresenca
),

{


eventoId:eventoId,


evento:
evento?.titulo || "",



membroId:
membro.id,



membro:
membro.nome,



status:status,



horaCheckin:

status==="Presente"

?

new Date().toLocaleTimeString(
"pt-BR",
{
hour:"2-digit",
minute:"2-digit"
}
)

:

null,



criadoEm:
Timestamp.now()


},

{
merge:true
}

);



console.log(

"Presença salva",

membro.nome,

status

);


}
// ==========================
// ATUALIZAR TABELA
// ==========================

function atualizarTabela(){


listaPresenca.innerHTML="";



if(membros.length===0){


listaPresenca.innerHTML=`

<tr>

<td colspan="5">

Nenhum membro encontrado.

</td>

</tr>

`;


return;

}



let qtdPresentes = 0;
let qtdAusentes = 0;
let qtdPendentes = 0;



membros.forEach((membro)=>{


const registro = registrosPresenca[membro.id];


const statusAtual =

registro?.status || "Pendente";



if(statusAtual==="Presente"){

qtdPresentes++;

}

else if(statusAtual==="Ausente"){

qtdAusentes++;

}

else{

qtdPendentes++;

}



const linha = document.createElement("tr");



linha.innerHTML = `


<td>

${membro.nome}

</td>



<td>

${membro.curso || "-"}

</td>



<td class="status">


<span class="status ${statusAtual.toLowerCase()}">

${statusAtual}

</span>


</td>



<td class="hora">


${registro?.horaCheckin || "—"}


</td>



<td>


<button

class="presente"

style="

background:#16a34a;

color:white;

border:none;

padding:8px 12px;

border-radius:8px;

cursor:pointer;

">

✔ Confirmar

</button>



<button

class="ausente"

style="

background:#dc2626;

color:white;

border:none;

padding:8px 12px;

border-radius:8px;

cursor:pointer;

">

❌ Ausente

</button>



</td>


`;



const btnPresente =
linha.querySelector(".presente");


const btnAusente =
linha.querySelector(".ausente");



let salvando = false;



btnPresente.onclick = async()=>{


if(salvando){

return;

}


salvando = true;


btnPresente.disabled = true;

btnAusente.disabled = true;



await salvarPresenca(
membro,
"Presente"
);



salvando = false;


};



btnAusente.onclick = async()=>{


if(salvando){

return;

}


salvando = true;


btnPresente.disabled = true;

btnAusente.disabled = true;



await salvarPresenca(
membro,
"Ausente"
);



salvando = false;


};



listaPresenca.appendChild(linha);


});



totalMembros.innerHTML =
membros.length;


presentes.innerHTML =
qtdPresentes;


pendentes.innerHTML =
qtdPendentes;


ausentes.innerHTML =
qtdAusentes;


}



// ==========================
// TROCAR EVENTO
// ==========================


selectEvento.addEventListener(

"change",

()=>{


eventoAtual = selectEvento.value;


localStorage.setItem(
"eventoSelecionado",
eventoAtual
);


carregarPresencas();


}

);



// ==========================
// FINALIZAÇÃO
// ==========================


console.log(

"LADRF Frequência carregado!"

);
