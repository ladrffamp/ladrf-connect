import { db } from "./firebase.js";

import {
doc,
getDoc,
collection,
getDocs,
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
// BUSCAR AÇÃO
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


console.log(
"Ação encontrada:",
dados
);



nomeAcao.innerHTML = `

${dados.titulo || "Sem título"}

<br>

<small>

📅 ${dados.data || ""}

<br>

📍 ${dados.local || ""}

</small>

`;



}else{


console.error(
"Ação inexistente:",
idAcao
);



nomeAcao.innerHTML =
"Ação não encontrada";


}



}catch(error){


console.error(
error
);


nomeAcao.innerHTML =
"Erro ao carregar ação";


}



}






// =====================================
// CARREGAR MEMBROS
// =====================================

async function carregarMembros(){


try{


const usuarios = await getDocs(

collection(
db,
"usuarios"
)

);



listaMembros.innerHTML = "";



usuarios.forEach((usuario)=>{


const dados = usuario.data();



if(
dados.perfil?.toLowerCase() === "membro"
){


listaMembros.innerHTML += `

<div class="card">


<label>

<input

type="checkbox"

class="membro"

value="${usuario.id}"

data-nome="${dados.nome || ""}"

data-email="${dados.email || ""}"

>


<strong>

${dados.nome || "Sem nome"}

</strong>

<br>

${dados.email || ""}


</label>


</div>

`;



}



});



}catch(error){


console.error(
"Erro membros:",
error
);


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
"Selecione um membro."
);


return;


}




try{


for(const membro of selecionados){



await setDoc(


doc(

db,

"agenda",

idAcao,

"participantes",

membro.value

),



{


nome:
membro.dataset.nome,


email:
membro.dataset.email,


presenca:
"Pendente",


escaladoEm:
serverTimestamp()


}



);



}



alert(
"Escala salva!"
);



}catch(error){


console.error(
error
);


alert(
"Erro ao salvar escala"
);



}



}

);


}




// =====================================
// INICIAR
// =====================================


carregarAcao();

carregarMembros();
