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

let unsubscribePresencas = null;


// guarda evento escolhido mesmo após recarregar
let eventoSelecionado =
localStorage.getItem("eventoFrequencia") || "";



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



selectEvento.innerHTML +=`

<option value="${documento.id}">
${evento.titulo}
</option>

`;



});


// restaura evento escolhido

if(eventoSelecionado){

selectEvento.value = eventoSelecionado;

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


const membro=documento.data();


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
// CARREGAR PRESENÇAS
// ==========================

function carregarPresencas(){

const eventoId = selectEvento.value;


if(!eventoId){

registrosPresenca = {};

atualizarTabela();

return;

}


// salva o evento escolhido
localStorage.setItem(
"eventoFrequencia",
eventoId
);



if(unsubscribePresencas){

unsubscribePresencas();

}



unsubscribePresencas = onSnapshot(

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
// TROCAR EVENTO
// ==========================


selectEvento.addEventListener(

"change",

()=>{


eventoSelecionado = selectEvento.value;


localStorage.setItem(
"eventoFrequencia",
eventoSelecionado
);


carregarPresencas();


}

);
// ==========================
// SALVAR PRESENÇA
// ==========================

async function salvarPresenca(membro, status){


const eventoId = selectEvento.value;


if(!eventoId){

alert("Selecione um evento primeiro.");

return;

}



const evento = eventos.find(
e=>e.id===eventoId
);



const idPresenca =

eventoId + "_" + membro.id;



try{


await setDoc(

doc(
db,
"presencas",
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
"Presença salva:",
membro.nome,
status
);



}

catch(erro){


console.error(
"Erro ao salvar presença:",
erro
);


alert(
"Erro ao registrar presença."
);


}


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


const registro =
registrosPresenca[membro.id];



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



const linha=document.createElement("tr");



linha.innerHTML=`

<td>

${membro.nome}

</td>


<td>

${membro.curso || "-"}

</td>


<td>

<span class="status ${statusAtual.toLowerCase()}">

${statusAtual}

</span>

</td>


<td>

${registro?.horaCheckin || "—"}

</td>


<td>


<button

class="presente"

>

✔ Confirmar

</button>


<button

class="ausente"

>

❌ Ausente

</button>


</td>

`;



const btnPresente =
linha.querySelector(".presente");


const btnAusente =
linha.querySelector(".ausente");



btnPresente.onclick = async()=>{


btnPresente.disabled = true;
btnAusente.disabled = true;


await salvarPresenca(
membro,
"Presente"
);


btnPresente.disabled = false;
btnAusente.disabled = false;


};



btnAusente.onclick = async()=>{


btnPresente.disabled = true;
btnAusente.disabled = true;


await salvarPresenca(
membro,
"Ausente"
);


btnPresente.disabled = false;
btnAusente.disabled = false;


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
);
