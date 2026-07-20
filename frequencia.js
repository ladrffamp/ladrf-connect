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


atualizarTabela();


}

);



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


status:
status,


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


qtdPendentes++;



const linha = document.createElement("tr");



linha.innerHTML = `


<td style="display:flex;gap:10px;">

<button 
class="presente"
style="
background:#16a34a;
color:white;
border:none;
padding:8px 12px;
border-radius:8px;
cursor:pointer;
font-weight:bold;
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
font-weight:bold;
">

❌ Recusar

</button>

</td>

${membro.curso || "-"}

</td>


<td class="status">

<span class="status pendente">

Pendente

</span>

</td>


<td class="hora">

—

</td>


<td>

<button
type="button"
class="presente"
>
✔ Confirmar
</button>


<button
type="button"
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


console.log(
"Botões encontrados:",
btnPresente,
btnAusente
);


const status =
linha.querySelector(".status span");


const hora =
linha.querySelector(".hora");




// ==========================
// BOTÃO PRESENTE
// ==========================


btnPresente.onclick = async()=>{


if(membro.statusPresenca==="Pendente"){

qtdPendentes--;

}


if(membro.statusPresenca==="Ausente"){

qtdAusentes--;

}



if(membro.statusPresenca!=="Presente"){

qtdPresentes++;

}



membro.statusPresenca="Presente";



status.innerHTML="Presente";

status.className="status presente";


const horario =
new Date().toLocaleTimeString(
"pt-BR",
{
hour:"2-digit",
minute:"2-digit"
}
);



hora.innerHTML=horario;



presentes.innerHTML=qtdPresentes;

ausentes.innerHTML=qtdAusentes;

pendentes.innerHTML=qtdPendentes;



await salvarPresenca(
membro,
"Presente"
);



};





// ==========================
// BOTÃO AUSENTE
// ==========================


btnAusente.onclick = async()=>{


if(membro.statusPresenca==="Pendente"){

qtdPendentes--;

}



if(membro.statusPresenca==="Presente"){

qtdPresentes--;

}



if(membro.statusPresenca!=="Ausente"){

qtdAusentes++;

}



membro.statusPresenca="Ausente";



status.innerHTML="Ausente";

status.className="status ausente";


hora.innerHTML="—";



presentes.innerHTML=qtdPresentes;

ausentes.innerHTML=qtdAusentes;

pendentes.innerHTML=qtdPendentes;



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
// ATUALIZAÇÃO AO TROCAR EVENTO
// ==========================


selectEvento.addEventListener(
"change",
()=>{


atualizarTabela();


}
);



console.log(
"LADRF Frequência carregado!"
);
}
// ==========================
// ATUALIZAR TABELA
// ==========================

function atualizarTabela(){

listaPresenca.innerHTML = "";


if(membros.length === 0){

listaPresenca.innerHTML = `

<tr>

<td colspan="5">

Nenhum membro encontrado.

</td>

</tr>

`;

return;

}



membros.forEach((membro)=>{


const linha = document.createElement("tr");


linha.innerHTML = `

<td>
${membro.nome}
</td>


<td>
${membro.curso || "-"}
</td>


<td>

<span class="status pendente">
Pendente
</span>

</td>


<td>
—
</td>


<td>


<button
type="button"
class="presente"
style="
background:#16a34a;
color:white;
padding:8px;
border:none;
border-radius:8px;
cursor:pointer;
">

✔ Confirmar

</button>



<button
type="button"
class="ausente"
style="
background:#dc2626;
color:white;
padding:8px;
border:none;
border-radius:8px;
cursor:pointer;
">

❌ Ausente

</button>


</td>

`;



linha.querySelector(".presente").onclick = ()=>{

salvarPresenca(
membro,
"Presente"
);


};



linha.querySelector(".ausente").onclick = ()=>{

salvarPresenca(
membro,
"Ausente"
);


};



listaPresenca.appendChild(linha);


});



totalMembros.innerHTML = membros.length;

presentes.innerHTML = 0;

pendentes.innerHTML = membros.length;

ausentes.innerHTML = 0;


}
