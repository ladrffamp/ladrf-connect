import { db } from "./firebase.js";

import {
collection,
addDoc,
updateDoc,
deleteDoc,
doc,
onSnapshot,
query,
orderBy,
Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const eventosRef = collection(db,"agenda");

let editando = null;

const titulo = document.getElementById("titulo");
const tipo = document.getElementById("tipo");
const data = document.getElementById("data");
const inicio = document.getElementById("inicio");
const fim = document.getElementById("fim");
const local = document.getElementById("local");
const responsavel = document.getElementById("responsavel");
const observacoes = document.getElementById("observacoes");
const listaEventos = document.getElementById("listaEventos");

window.salvarEvento = async function(){

try{

const evento={

titulo:titulo.value,

tipo:tipo.value,

data:data.value,

inicio:inicio.value,

fim:fim.value,

local:local.value,

responsavel:responsavel.value,

observacoes:observacoes.value,

status:"Programado",

criadoEm:Timestamp.now()

};

if(
!evento.titulo ||
!evento.data ||
!evento.inicio
){

alert("Preencha os campos obrigatórios.");

return;

}

if(editando){

await updateDoc(

doc(db,"agenda",editando),

evento

);

editando=null;

}else{

await addDoc(

eventosRef,

evento

);

}

limparFormulario();

}catch(e){

console.error(e);

alert(e.message);

}

};

function limparFormulario(){

titulo.value="";
tipo.selectedIndex=0;
data.value="";
inicio.value="";
fim.value="";
local.value="";
responsavel.value="";
observacoes.value="";

}

const consulta=query(

eventosRef,

orderBy("data")

);

onSnapshot(consulta,(snapshot)=>{

listaEventos.innerHTML="";

if(snapshot.empty){

listaEventos.innerHTML=`

<div class="evento">

<h2>Nenhum evento cadastrado</h2>

</div>

`;

return;

}

snapshot.forEach((item)=>{

const evento=item.data();

let classe="programado";

if(evento.status==="Em andamento")
classe="andamento";

if(evento.status==="Concluído")
classe="concluido";

if(evento.status==="Cancelado")
classe="cancelado";

listaEventos.innerHTML+=`

<div class="evento">

<h2>${evento.titulo}</h2>

<p><b>Tipo:</b> ${evento.tipo}</p>

<p><b>Data:</b> ${evento.data}</p>

<p><b>Horário:</b> ${evento.inicio} às ${evento.fim}</p>

<p><b>Local:</b> ${evento.local}</p>

<p><b>Responsável:</b> ${evento.responsavel}</p>

<p><b>Observações:</b><br>${evento.observacoes}</p>

<span class="status ${classe}">

${evento.status}

</span>

<div class="botoes">

<button
class="editar"
onclick="editarEvento('${item.id}')">

✏️ Editar

</button>

<button
class="concluir"
onclick="concluirEvento('${item.id}')">

✅ Concluir

</button>

<button
class="excluir"
onclick="excluirEvento('${item.id}')">

🗑️ Excluir

</button>

</div>

</div>

`;

});
  // =====================================
// EDITAR EVENTO
// =====================================

window.editarEvento = async function(id){

try{


const referencia = doc(
db,
"agenda",
id
);


// Busca os dados atuais do evento

// Necessário importar getDoc na Parte 1


const dados = await getDoc(referencia);


if(!dados.exists()){

alert("Evento não encontrado.");

return;

}


const evento = dados.data();


editando = id;



titulo.value =
evento.titulo || "";



tipo.value =
evento.tipo || "";



data.value =
evento.data || "";



inicio.value =
evento.inicio || "";



fim.value =
evento.fim || "";



local.value =
evento.local || "";



responsavel.value =
evento.responsavel || "";



observacoes.value =
evento.observacoes || "";



window.scrollTo({

top:0,

behavior:"smooth"

});



alert(
"Evento carregado para edição."
);



}catch(error){


console.error(error);


alert(
"Erro ao editar evento."
);


}


};




// =====================================
// CONCLUIR EVENTO
// =====================================


window.concluirEvento = async function(id){


const confirmar = confirm(

"Finalizar este evento?"

);



if(!confirmar){

return;

}



try{


await updateDoc(

doc(db,"agenda",id),

{

status:"Concluído"

}

);



alert(
"Evento concluído."
);



}catch(error){


console.error(error);


alert(
"Erro ao concluir evento."
);


}



};





// =====================================
// EXCLUIR EVENTO
// =====================================


window.excluirEvento = async function(id){


const confirmar = confirm(

"Deseja realmente excluir este evento?"

);



if(!confirmar){

return;

}



try{


await deleteDoc(

doc(db,"agenda",id)

);



alert(
"Evento excluído."
);



}catch(error){


console.error(error);


alert(
"Erro ao excluir evento."
);


}


};
// =====================================
// ALTERAR STATUS DO EVENTO
// =====================================

window.alterarStatus = async function(id, novoStatus){


try{


await updateDoc(

doc(db,"agenda",id),

{

status:novoStatus

}

);



}catch(error){


console.error(
"Erro ao alterar status:",
error
);


alert(
"Não foi possível alterar o status."
);


}



};





// =====================================
// VERIFICAR EVENTOS VENCIDOS
// =====================================


function verificarEventosVencidos(){


const hoje = new Date();

hoje.setHours(0,0,0,0);



const eventos = document.querySelectorAll(".evento");



eventos.forEach((elemento)=>{



const dataTexto = elemento
.querySelector("p")
?.innerText;



if(!dataTexto){

return;

}



});



}





// =====================================
// FILTRO DE EVENTOS
// =====================================


window.filtrarEventos = function(status){



const eventos = document.querySelectorAll(
".evento"
);



eventos.forEach((evento)=>{



const texto =
evento.querySelector(".status")
.innerText;



if(status==="Todos"){

evento.style.display="block";

return;

}



if(texto===status){

evento.style.display="block";

}else{

evento.style.display="none";

}



});


};





// =====================================
// LIMPAR EDIÇÃO
// =====================================


window.cancelarEdicao = function(){



editando=null;


limparFormulario();



alert(
"Edição cancelada."
);



};





// =====================================
// CRIAR STATUS INICIAL
// =====================================


window.iniciarAgenda = function(){


console.log(
"Agenda LADRF iniciada."
);


};



iniciarAgenda();
// =====================================
// TRATAMENTO DE DATAS
// =====================================


function formatarData(dataTexto){


if(!dataTexto){

return "-";

}



const partes = dataTexto.split("-");



if(partes.length !== 3){

return dataTexto;

}



return `${partes[2]}/${partes[1]}/${partes[0]}`;


}





// =====================================
// PROTEÇÃO DE TEXTO (SEGURANÇA)
// =====================================


function escaparTexto(texto){


if(!texto){

return "";

}


return texto

.replaceAll("&","&amp;")

.replaceAll("<","&lt;")

.replaceAll(">","&gt;")

.replaceAll('"',"&quot;")

.replaceAll("'","&#039;");


}





// =====================================
// MELHORAR RENDERIZAÇÃO DOS EVENTOS
// =====================================


function corStatus(status){


switch(status){


case "Programado":

return "programado";


case "Em andamento":

return "andamento";


case "Concluído":

return "concluido";


case "Cancelado":

return "cancelado";


default:

return "programado";


}


}





// =====================================
// ATUALIZAR LISTAGEM SEGURA
// =====================================


function renderizarEvento(item){


const evento=item.data();



const classe =
corStatus(evento.status);



return `

<div class="evento">


<h2>

${escaparTexto(evento.titulo)}

</h2>



<p>

<b>Tipo:</b>

${escaparTexto(evento.tipo)}

</p>



<p>

<b>Data:</b>

${formatarData(evento.data)}

</p>



<p>

<b>Horário:</b>

${evento.inicio || "-"}

às

${evento.fim || "-"}

</p>



<p>

<b>Local:</b>

${escaparTexto(evento.local)}

</p>



<p>

<b>Responsável:</b>

${escaparTexto(evento.responsavel)}

</p>



<p>

<b>Observações:</b><br>

${escaparTexto(evento.observacoes)}

</p>



<span class="status ${classe}">

${evento.status}

</span>



<div class="botoes">



<button

class="editar"

onclick="editarEvento('${item.id}')">

✏️ Editar

</button>



<button

class="concluir"

onclick="concluirEvento('${item.id}')">

✅ Concluir

</button>



<button

class="excluir"

onclick="excluirEvento('${item.id}')">

🗑️ Excluir

</button>



</div>



</div>

`;



}





// =====================================
// ATUALIZAÇÃO AUTOMÁTICA DO STATUS
// =====================================


window.colocarEmAndamento = async function(id){


await alterarStatus(

id,

"Em andamento"

);


};





// =====================================
// LIMPEZA AUTOMÁTICA DE EDIÇÃO
// =====================================


window.addEventListener(

"beforeunload",

()=>{


editando=null;


}

);





console.log(
"LADRF Agenda carregada com sucesso."
);

});
