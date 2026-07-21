import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
collection,
getDocs,
doc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const boasVindas =
document.getElementById("boasVindas");


const listaEscalas =
document.getElementById("listaEscalas");



onAuthStateChanged(auth, async(usuario)=>{


if(!usuario){

window.location.href="login.html";

return;

}


boasVindas.innerHTML =
`👋 Bem-vindo ${usuario.email}`;


carregarEscalas(usuario.email);


});





async function carregarEscalas(emailUsuario){


listaEscalas.innerHTML="";


const acoes =
await getDocs(

collection(
db,
"acoes"

)

);



let encontrou = false;



for(
const acao of acoes.docs
){


const participantes =

await getDocs(

collection(

db,

"acoes",

acao.id,

"participantes"

)

);



for(
const participante of participantes.docs
){


const dados =
participante.data();



if(
dados.email === emailUsuario
){


encontrou = true;



listaEscalas.innerHTML += `

<div class="escala">


<h3>

${acao.id}

</h3>


<p>

👤 ${dados.nome}

</p>


<p>

Status:

<strong>

${dados.presenca}

</strong>

</p>


<button

class="confirmar"

data-acao="${acao.id}"

data-membro="${participante.id}"

>

${dados.presenca === "Confirmada"

? "✅ Presença Confirmada"

: "✅ Confirmar Presença"}

</button>


</div>

`;



}


}


}



if(!encontrou){


listaEscalas.innerHTML=`

<div class="card">

Nenhuma escala encontrada.

</div>

`;

return;

}



document.querySelectorAll(".confirmar")

.forEach((botao)=>{


botao.addEventListener("click", async()=>{


const referencia =

doc(

db,

"acoes",

botao.dataset.acao,

"participantes",

botao.dataset.membro

);



await updateDoc(

referencia,

{

presenca:"Confirmada",

confirmadoEm:serverTimestamp()

}

);



botao.innerHTML =
"✅ Presença Confirmada";


botao.disabled = true;



});


});


}
