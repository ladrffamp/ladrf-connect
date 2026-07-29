// gerenciar-acao.js

import { db } from "./firebase.js";

import {
doc,
getDoc,
getDocs,
collection,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// ID DA AÇÃO
// =====================================

const idAcao = new URLSearchParams(
    window.location.search
).get("id");


console.log("ID AÇÃO:", idAcao);



if(!idAcao){

alert("Ação não encontrada.");

throw new Error("ID ausente");

}



// =====================================
// ELEMENTOS
// =====================================

const nomeAcao =
document.getElementById("nomeAcao");


const listaMembros =
document.getElementById("listaMembros");


const botaoSalvar =
document.getElementById("salvar");




// =====================================
// CARREGAR AÇÃO
// =====================================

async function carregarAcao(){


try{


const referencia = doc(
db,
"agenda",
idAcao
);


const resultado = await getDoc(
referencia
);



if(resultado.exists()){


const dados = resultado.data();


nomeAcao.innerHTML = `

${dados.titulo || "Sem título"}

<br>

<small>

📅 ${dados.data || "-"}

<br>

📍 ${dados.local || "-"}

<br>

⏰ ${dados.inicio || "-"} até ${dados.fim || "-"}

</small>

`;



}else{


nomeAcao.innerHTML =
"Ação não encontrada";


}



}catch(error){


console.error(
"Erro ao carregar ação:",
error
);


nomeAcao.innerHTML =
"Erro ao carregar ação";


}


}






// =====================================
// CARREGAR PARTICIPANTES
// =====================================

async function carregarMembros(){


try{


listaMembros.innerHTML = `

<div style="text-align:center">

<i class="fa-solid fa-spinner fa-spin"></i>

Carregando participantes...

</div>

`;



// BUSCAR USUÁRIOS

const usuariosSnapshot = await getDocs(

collection(
db,
"usuarios"
)

);




// BUSCAR ESCALADOS

const participantesSnapshot = await getDocs(

collection(
db,
"agenda",
idAcao,
"participantes"
)

);



const escalados = {};



participantesSnapshot.forEach((item)=>{


escalados[item.id] =
item.data();


});




listaMembros.innerHTML = "";


let total = 0;



usuariosSnapshot.forEach((usuario)=>{


const dados =
usuario.data();



console.log(
"USUARIO:",
dados
);



const idUsuario =
usuario.id;



const perfil =
dados.perfil?.toLowerCase().trim() || "";


const email =
dados.email?.toLowerCase().trim() || "";



// =====================================
// REMOVE SOMENTE ADMIN
// =====================================

if(

perfil === "admin" ||

email === "admin@ladrf.com"

){

return;

}




// =====================================
// DEFINIR CARGO
// =====================================


let cargoEscala = "Membro";



if(

email === "antonio.felipe@ladrf.com"

){

cargoEscala =
"Orientador Responsável";

}





total++;



const escalado =
escalados[idUsuario];



let status = "";



if(escalado){


if(escalado.presenca === "Confirmado"){


status =
"🟢 Confirmado";


}

else if(escalado.presenca === "Recusado"){


status =
"🔴 Recusado";


}

else{


status =
"🟡 Pendente";


}


}






listaMembros.innerHTML += `


<div class="card" style="margin-bottom:10px;">


<label style="

display:flex;

align-items:center;

gap:12px;

cursor:pointer;

">



<input

type="checkbox"

class="membro"

value="${idUsuario}"

data-nome="${dados.nome || ""}"

data-email="${dados.email || ""}"

data-cargo="${cargoEscala}"

${escalado ? "checked" : ""}

>




<div>


<strong>

${dados.nome || "Sem nome"}

</strong>


<br>


<span>

${cargoEscala}

</span>



<br>


<small>

${dados.email || ""}

</small>



${status ? `

<br>

<span>

${status}

</span>

`:""}



</div>



</label>


</div>


`;



});





if(total === 0){


listaMembros.innerHTML = `

<div class="card">

Nenhum participante encontrado.

</div>

`;

}



console.log(

"Participantes carregados:",
total

);



}catch(error){


console.error(

"Erro ao carregar participantes:",
error

);


listaMembros.innerHTML =
"Erro ao carregar participantes.";


}


}






// =====================================
// SALVAR ESCALA
// =====================================


if(botaoSalvar){



botaoSalvar.addEventListener(

"click",

async()=>{



const selecionados =

document.querySelectorAll(

".membro:checked"

);




if(selecionados.length === 0){


alert(

"Selecione pelo menos um participante."

);


return;


}





try{



for(const participante of selecionados){



await setDoc(

doc(

db,

"agenda",

idAcao,

"participantes",

participante.value

),


{


nome:

participante.dataset.nome,


email:

participante.dataset.email,


cargo:

participante.dataset.cargo,


presenca:

"Pendente",


escaladoEm:

serverTimestamp()


},


{

merge:true

}


);



}





alert(

"Escala salva com sucesso!"

);



carregarMembros();



}catch(error){


console.error(

"Erro ao salvar escala:",
error

);



alert(

"Erro ao salvar escala."

);


}



}

);


}






// =====================================
// SELECIONAR TODOS
// =====================================


const selecionarTodos =
document.getElementById("selecionarTodos");


const desmarcarTodos =
document.getElementById("desmarcarTodos");



if(selecionarTodos){


selecionarTodos.addEventListener(

"click",

()=>{


document
.querySelectorAll(".membro")
.forEach((checkbox)=>{


checkbox.checked = true;


});


}

);


}



if(desmarcarTodos){


desmarcarTodos.addEventListener(

"click",

()=>{


document
.querySelectorAll(".membro")
.forEach((checkbox)=>{


checkbox.checked = false;


});


}

);


}






// =====================================
// INICIAR
// =====================================


carregarAcao();

carregarMembros();