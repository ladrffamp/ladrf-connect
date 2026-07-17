import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
query,
orderBy,
Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ===============================
// SALVAR EVENTO
// ===============================


window.salvarEvento = async function(){


const titulo = document.getElementById("titulo").value;

const tipo = document.getElementById("tipo").value;

const data = document.getElementById("data").value;

const inicio = document.getElementById("inicio").value;

const fim = document.getElementById("fim").value;

const local = document.getElementById("local").value;

const responsavel = document.getElementById("responsavel").value;

const observacoes = document.getElementById("observacoes").value;




if(!titulo || !data){


alert("Preencha o nome e a data do evento.");

return;


}




try{


await addDoc(

collection(db,"agenda"),

{


titulo,

tipo,

data,

horaInicio:inicio,

horaFim:fim,

local,

responsavel,

status:"Programado",

observacoes,

criadoEm:Timestamp.now()


}

);




alert("Evento cadastrado!");



document
.getElementById("titulo")
.value="";


document
.getElementById("observacoes")
.value="";



carregarAgenda();



}catch(error){


console.error(error);


alert(

"Erro ao cadastrar evento: "

+error.message

);


}


};









// ===============================
// LISTAR EVENTOS
// ===============================


async function carregarAgenda(){



const lista = document.getElementById("listaEventos");



lista.innerHTML="Carregando...";



const busca = query(

collection(db,"agenda"),

orderBy("criadoEm","desc")

);




const resultado = await getDocs(busca);




lista.innerHTML="";




if(resultado.empty){


lista.innerHTML=

`

<div class="evento">

Nenhum evento cadastrado.

</div>

`;


return;


}







resultado.forEach((item)=>{


const evento=item.data();




lista.innerHTML += `


<div class="evento">


<h3>

${evento.titulo}

</h3>



<b>Tipo:</b>

${evento.tipo}

<br>



<b>Data:</b>

${evento.data}

<br>



<b>Horário:</b>

${evento.horaInicio}

até

${evento.horaFim}

<br>



<b>Local:</b>

${evento.local || "-"}

<br>



<b>Responsável:</b>

${evento.responsavel || "-"}

<br>



<b>Status:</b>

${evento.status}

<br><br>



<b>Observações:</b>

${evento.observacoes || "-"}



</div>


`;



});



}





carregarAgenda();
