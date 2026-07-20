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


// NOVO:
// Guarda as presenças carregadas do Firestore

let registrosPresenca = {};



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



snapshot.forEach((doc)=>{


const evento = doc.data();


eventos.push({

id:doc.id,

...evento

});



selectEvento.innerHTML += `

<option value="${doc.id}">
${evento.titulo}
</option>

`;


});


}

);



// ==========================
// CARREGAR MEMBROS
// ==========================


onSnapshot(
collection(db,"membros"),
(snapshot)=>{

membros=[];

snapshot.forEach((doc)=>{

const membro = doc.data();

if(membro.status==="Ativo"){

membros.push({

id:doc.id,

...membro

});

}

});

carregarPresencas();

}

);

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



onSnapshot(

collection(db,"presencas"),

(snapshot)=>{


registrosPresenca = {};



snapshot.forEach((doc)=>{


const dados = doc.data();



if(dados.eventoId === eventoId){


registrosPresenca[dados.membroId] = dados.status;


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


const statusAtual =
registrosPresenca[membro.id] || "Pendente";



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


${statusAtual==="Presente"

?

"Registrado"

:

"—"

}


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





btnPresente.onclick = async()=>{


if(registrosPresenca[membro.id]==="Presente"){

return;

}



registrosPresenca[membro.id]="Presente";


atualizarTabela();



await salvarPresenca(
membro,
"Presente"
);


};






btnAusente.onclick = async()=>{


if(registrosPresenca[membro.id]==="Ausente"){

return;

}



registrosPresenca[membro.id]="Ausente";


atualizarTabela();



await salvarPresenca(
membro,
"Ausente"
);


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


carregarPresencas();


}

);




// ==========================
// FINALIZAÇÃO
// ==========================


console.log(

"LADRF Frequência carregado!"

);
