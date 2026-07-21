import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
collection,
getDocs,
addDoc,
Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const boasVindas =
document.getElementById("boasVindas");

const listaEscalas =
document.getElementById("listaEscalas");

onAuthStateChanged(

auth,

async(usuario)=>{

if(!usuario){

window.location.href="login.html";

return;

}

boasVindas.innerHTML =
`👋 Bem-vindo`;

carregarEscalas();

}

);

async function carregarEscalas(){

listaEscalas.innerHTML="";

const eventos =
await getDocs(

collection(
db,
"agenda"
)

);

if(eventos.empty){

listaEscalas.innerHTML=`

<div class="card">

Nenhuma escala disponível.

</div>

`;

return;

}

eventos.forEach((evento)=>{

const dados = evento.data();

listaEscalas.innerHTML += `

<div class="escala">

<h3>${dados.titulo || "Evento"}</h3>

<p>📅 ${dados.data || "-"}</p>

<p>📍 ${dados.local || "-"}</p>

<p>⏰ ${dados.inicio || "-"} às ${dados.fim || "-"}</p>

<button
class="confirmar"
data-id="${evento.id}">

✅ Confirmar Presença

</button>

</div>

`;

});

document.querySelectorAll(".confirmar")
.forEach((botao)=>{

botao.addEventListener("click", async()=>{

await addDoc(collection(db,"presencas"),{

evento: botao.dataset.id,

usuario: auth.currentUser.email,

data: Timestamp.now()

});

botao.innerHTML = "✅ Presença Confirmada";

botao.disabled = true;

});

});

}
