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


console.log("ID DA AÇÃO:", idAcao);



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


const ref = doc(
db,
"agenda",
idAcao
);


const snap = await getDoc(ref);



if(snap.exists()){


const dados = snap.data();



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
"Erro ação:",
error
);


}


}






// =====================================
// CARREGAR USUÁRIOS
// =====================================

async function carregarMembros(){


try{


listaMembros.innerHTML = `

<div style="text-align:center">

<i class="fa-solid fa-spinner fa-spin"></i>

Carregando participantes...

</div>

`;



// TODOS OS USUÁRIOS

const usuariosSnapshot = await getDocs(

collection(
db,
"usuarios"
)

);



// PARTICIPANTES JÁ ESCALADOS

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
dados.nome,
dados.email,
dados.perfil
);



const idUsuario =
usuario.id;



const email =
dados.email?.toLowerCase().trim() || "";



// =====================================
// REMOVE SOMENTE ADMINISTRADOR
// =====================================

if(
email === "admin@ladrf.com"
){

return;

}



// =====================================
// DEFINIR CARGO
// =====================================

let cargo =
"Membro";



if(
email === "antonio.felipe@ladrf.com"
){

cargo =
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

data-cargo="${cargo}"

${escalado ? "checked" : ""}

>




<div>


<strong>

${dados.nome || "Sem nome"}

</strong>


<br>


<span>

${cargo}

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

Nenhum usuário encontrado.

</div>

`;

}



console.log(
"TOTAL MOSTRADO:",
total
);



}catch(error){


console.error(
"Erro ao carregar usuários:",
error
);



listaMembros.innerHTML =
"Erro ao carregar usuários.";


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


for(const pessoa of selecionados){



await setDoc(

doc(

db,

"agenda",

idAcao,

"participantes",

pessoa.value

),


{


nome:
pessoa.dataset.nome,


email:
pessoa.dataset.email,


cargo:
pessoa.dataset.cargo,


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
"Erro salvar escala:",
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
// SELECIONAR TODOS / DESMARCAR TODOS
// =====================================


document
.getElementById("selecionarTodos")
?.addEventListener(
"click",
()=>{


const checkboxes =
document.querySelectorAll(".membro");


checkboxes.forEach((checkbox)=>{

checkbox.checked = true;

});


console.log(
"Selecionados:",
checkboxes.length
);


}

);




document
.getElementById("desmarcarTodos")
?.addEventListener(
"click",
()=>{


const checkboxes =
document.querySelectorAll(".membro");


checkboxes.forEach((checkbox)=>{

checkbox.checked = false;

});


console.log(
"Desmarcados:",
checkboxes.length
);


}

);



// =====================================
// INICIAR
// =====================================

carregarAcao();

carregarMembros();