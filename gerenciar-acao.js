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
// ID DA AÇÃO
// =====================================

const idAcao =

new URLSearchParams(window.location.search)

.get("id");




// =====================================
// ELEMENTOS
// =====================================

const nomeAcao =
document.getElementById("nomeAcao");


const listaMembros =
document.getElementById("listaMembros");


const botaoSalvar =
document.getElementById("salvar");



// membros selecionados

let membrosSelecionados = [];



// =====================================
// BUSCAR AÇÃO
// =====================================

async function carregarAcao(){


const referencia =

doc(
db,
"acoes",
idAcao
);


const resultado =

await getDoc(
referencia
);



if(resultado.exists()){


nomeAcao.innerHTML =

resultado.data().nome;


}


}





// =====================================
// BUSCAR MEMBROS
// =====================================

async function carregarMembros(){


const usuarios =

await getDocs(

collection(
db,
"usuarios"
)

);



listaMembros.innerHTML="";



usuarios.forEach(

(usuario)=>{


const dados =
usuario.data();



if(dados.perfil === "membro"){



listaMembros.innerHTML += `


<div>

<input

type="checkbox"

value="${usuario.id}"

data-nome="${dados.nome}"

>


${dados.nome}


</div>


`;



}



}


);



}





// =====================================
// SALVAR ESCALA
// =====================================

botaoSalvar.onclick = async()=>{


const selecionados =

document.querySelectorAll(
"input[type='checkbox']:checked"
);



for(const item of selecionados){



const uid =
item.value;


const nome =
item.dataset.nome;



await setDoc(


doc(

db,

"acoes",

idAcao,

"participantes",

uid

),


{


nome:nome,


presenca:"Pendente",


escaladoEm:
serverTimestamp()


}


);



}



alert(
"Escala salva com sucesso!"
);



};




// =====================================
// INICIAR
// =====================================

carregarAcao();

carregarMembros();
