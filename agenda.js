import { db } from "./firebase.js";

import {
collection,
addDoc,
updateDoc,
deleteDoc,
doc,
getDoc,
onSnapshot,
query,
orderBy,
Timestamp,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// REFERÊNCIA FIRESTORE
// =====================================

const eventosRef = collection(
    db,
    "agenda"
);


let editando = null;



// =====================================
// ELEMENTOS
// =====================================

const titulo =
document.getElementById("titulo");

const tipo =
document.getElementById("tipo");

const data =
document.getElementById("data");

const inicio =
document.getElementById("inicio");

const fim =
document.getElementById("fim");

const local =
document.getElementById("local");

const responsavel =
document.getElementById("responsavel");

const observacoes =
document.getElementById("observacoes");

const listaEventos =
document.getElementById("listaEventos");




// =====================================
// SALVAR EVENTO
// =====================================


window.salvarEvento = async function(){


try{


const evento = {


titulo:
titulo.value.trim(),


tipo:
tipo.value,


data:
data.value,


inicio:
inicio.value,


fim:
fim.value,


local:
local.value.trim(),


responsavel:
responsavel.value.trim(),


observacoes:
observacoes.value.trim(),


status:
"Programado",


criadoEm:
Timestamp.now()


};





if(
!evento.titulo ||
!evento.data ||
!evento.inicio
){


alert(
"Preencha título, data e horário."
);


return;


}



if(editando){


await updateDoc(

doc(
db,
"agenda",
editando
),

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



alert(
"Evento salvo com sucesso!"
);



}

catch(error){


console.error(
"Erro ao salvar:",
error
);


alert(
"Erro ao salvar evento."
);


}


};





// =====================================
// LIMPAR FORMULÁRIO
// =====================================


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
// =====================================
// LISTAR EVENTOS TEMPO REAL
// =====================================


const consulta = query(

    eventosRef,

    orderBy(
        "data"
    )

);



onSnapshot(

consulta,

async(snapshot)=>{


listaEventos.innerHTML="";



if(snapshot.empty){


listaEventos.innerHTML=`

<div class="evento">

<h2>

Nenhum evento cadastrado

</h2>

</div>

`;


return;


}





for(const item of snapshot.docs){


listaEventos.innerHTML +=

await renderizarEvento(item);



}



}



);






// =====================================
// RENDERIZAÇÃO DOS EVENTOS
// =====================================


async function renderizarEvento(item){


const evento =
item.data();



// =====================================
// BUSCAR PARTICIPANTES
// =====================================


const participantesSnapshot = await getDocs(

collection(

db,

"agenda",

item.id,

"participantes"

)

);



let total = 0;

let confirmados = 0;

let pendentes = 0;

let recusados = 0;



participantesSnapshot.forEach((membro)=>{


total++;


const dados =
membro.data();



if(
dados.presenca === "Confirmado" ||
dados.presenca === "Confirmada"
){


confirmados++;


}

else if(
dados.presenca === "Recusado"
){


recusados++;


}

else{


pendentes++;


}


});






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

<b>Observações:</b>

<br>

${escaparTexto(evento.observacoes)}

</p>






<span class="status ${classe}">

${evento.status}

</span>






<div style="

margin-top:15px;

padding:15px;

border-radius:12px;

background:#f2f2f2;

color:#222;

">


<h3>

👥 Equipe escalada

</h3>



<p>

Total:

<b>${total}</b>

</p>



<p>

🟢 Confirmados:

<b>${confirmados}</b>

</p>



<p>

🟡 Pendentes:

<b>${pendentes}</b>

</p>



<p>

🔴 Recusados:

<b>${recusados}</b>

</p>



</div>







<div class="botoes">



<button

class="salvar"

onclick="abrirEscala('${item.id}')"

>

👥 Escalar equipe

</button>




<button

class="salvar"

onclick="gerarQRCode('${item.id}')"

>

<i class="fa-solid fa-qrcode"></i>

Gerar QR Code

</button>



<button

class="editar"

onclick="editarEvento('${item.id}')"

>

✏️ Editar

</button>





<button

class="concluir"

onclick="concluirEvento('${item.id}')"

>

✅ Concluir

</button>





<button

class="excluir"

onclick="excluirEvento('${item.id}')"

>

🗑️ Excluir

</button>



</div>



</div>


`;



}
// =====================================
// FORMATAR DATA
// =====================================


function formatarData(dataTexto){


if(!dataTexto){

return "-";

}



const partes =

dataTexto.split("-");



if(partes.length !== 3){

return dataTexto;

}



return `${partes[2]}/${partes[1]}/${partes[0]}`;


}






// =====================================
// PROTEGER TEXTO
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
// STATUS
// =====================================


function corStatus(status){


switch(status){


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
// ABRIR ESCALA
// =====================================


window.abrirEscala = function(id){


console.log(

"Abrindo escala:",

id

);



window.location.href =

"gerenciar-acao.html?id="+id;



};







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



const resultado = await getDoc(

referencia

);



if(!resultado.exists()){


alert(

"Evento não encontrado."

);


return;


}



const evento = resultado.data();



editando=id;



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



}

catch(error){


console.error(

"Erro editar:",

error

);



alert(

"Erro ao carregar evento."

);



}



};








// =====================================
// CONCLUIR EVENTO
// =====================================


window.concluirEvento = async function(id){



const confirmar = confirm(

"Marcar este evento como concluído?"

);



if(!confirmar){

return;

}



try{



await updateDoc(

doc(

db,

"agenda",

id

),

{


status:

"Concluído"


}

);



alert(

"Evento concluído."

);



}

catch(error){



console.error(error);



alert(

"Erro ao concluir."

);



}



};








// =====================================
// EXCLUIR EVENTO
// =====================================


window.excluirEvento = async function(id){



const confirmar = confirm(

"Deseja excluir este evento?"

);



if(!confirmar){

return;

}



try{



await deleteDoc(

doc(

db,

"agenda",

id

)

);



alert(

"Evento excluído."

);



}

catch(error){


console.error(error);



alert(

"Erro ao excluir evento."

);



}



};
// =====================================
// CANCELAR EDIÇÃO
// =====================================


window.cancelarEdicao = function(){


editando = null;


limparFormulario();


};








// =====================================
// ALTERAR STATUS MANUALMENTE
// =====================================


window.alterarStatus = async function(id,status){


try{


await updateDoc(

doc(

db,

"agenda",

id

),

{

status:status

}

);



}

catch(error){


console.error(

"Erro ao alterar status:",

error

);



}



};








// =====================================
// FILTRAR EVENTOS
// =====================================


window.filtrarEventos = function(statusSelecionado){



const eventos = document.querySelectorAll(

".evento"

);





eventos.forEach((evento)=>{



const status =

evento.querySelector(".status")?.innerText;





if(

statusSelecionado === "Todos"

){


evento.style.display="block";


}

else if(

status === statusSelecionado

){


evento.style.display="block";


}

else{


evento.style.display="none";


}



});



};








// =====================================
// BUSCAR EVENTO
// =====================================


window.buscarEvento = function(texto){



const eventos = document.querySelectorAll(

".evento"

);




eventos.forEach((evento)=>{



const conteudo =

evento.innerText.toLowerCase();





if(

conteudo.includes(

texto.toLowerCase()

)

){


evento.style.display="block";


}

else{


evento.style.display="none";


}



});



};








// =====================================
// VERIFICAR EVENTOS DE HOJE
// =====================================


function verificarEventosHoje(){



const hoje = new Date();



const ano = hoje.getFullYear();



const mes = String(

hoje.getMonth()+1

).padStart(2,"0");



const dia = String(

hoje.getDate()

).padStart(2,"0");



const dataAtual =

`${ano}-${mes}-${dia}`;






document

.querySelectorAll(".evento")

.forEach((evento)=>{



if(

evento.innerText.includes(

dataAtual

)

){



evento.classList.add(

"evento-hoje"

);



}



});



}









// =====================================
// ESC PARA CANCELAR EDIÇÃO
// =====================================


document.addEventListener(

"keydown",

(event)=>{


if(event.key === "Escape"){



editando=null;



limparFormulario();



}



}

);








// =====================================
// INICIALIZAÇÃO
// =====================================


setTimeout(()=>{


verificarEventosHoje();


},1000);






console.log(

"LADRF Connect Agenda carregada com sucesso."

);
