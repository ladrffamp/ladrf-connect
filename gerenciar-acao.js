// gerenciar-acao.js

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
// PEGAR ID DA AÇÃO
// =====================================

const idAcao = new URLSearchParams(
window.location.search
).get("id");



console.log("ID DA AÇÃO:", idAcao);



if(!idAcao){

alert("Erro: ação não encontrada.");

throw new Error("ID da ação ausente");

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
// CARREGAR AÇÃO (AGENDAS)
// =====================================


async function carregarAcao(){

try{


console.log("Buscando em agendas:");
console.log(idAcao);



const referencia = doc(
db,
"agenda",
idAcao
);



const resultado = await getDoc(
referencia
);



console.log(
"Documento existe:",
resultado.exists()
);



if(resultado.exists()){


const dados = resultado.data();


console.log(
"DADOS DA AÇÃO:",
dados
);



nomeAcao.innerHTML = `

${dados.titulo || "Sem título"}

<br>

<small>

${dados.local || ""}

</small>

`;



}else{


nomeAcao.innerHTML =
"Ação não encontrada";


}



}catch(error){


console.error(
"ERRO FIREBASE:",
error
);



nomeAcao.innerHTML =
"Erro ao buscar ação";


}


}



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
"Erro ao carregar ação:",
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


<div class="card" style="
margin-bottom:10px;
">


<label style="
display:flex;
align-items:center;
gap:10px;
cursor:pointer;
">


<input

type="checkbox"

class="membro"

value="${usuario.id}"

data-nome="${dados.nome || ""}"

data-email="${dados.email || ""}"

>



<div>


<strong>

${dados.nome || "Sem nome"}

</strong>


<br>


<small>

${dados.email || ""}

</small>


</div>


</label>


</div>


`;



}



});





if(listaMembros.innerHTML === ""){


listaMembros.innerHTML =
"Nenhum membro encontrado.";


}



}catch(error){


console.error(
"Erro ao carregar membros:",
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


try{


const selecionados =
document.querySelectorAll(
".membro:checked"
);



if(selecionados.length === 0){


alert(
"Selecione pelo menos um membro."
);


return;


}





for(
const membro of selecionados
){



await setDoc(


doc(

db,

"agenda",

idAcao,

"participantes",

membro.value

),



{


id:
membro.value,


nome:
membro.dataset.nome,


email:
membro.dataset.email,


presenca:
"Pendente",


confirmadoEm:
null,


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
// INICIAR
// =====================================


carregarAcao();

carregarMembros();
