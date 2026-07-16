import { db } from "./firebase.js";

import {
collection,
query,
where,
onSnapshot,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const painel = document.getElementById("macas");

function carregar(){

const q = query(
collection(db,"pacientes"),
where("status","==","Chamado")
);

onSnapshot(q,(snapshot)=>{

let html="";

for(let i=1;i<=4;i++){

const paciente = snapshot.docs.find(
d => d.data().maca === `Maca ${i}`
);

if(paciente){

const dados = paciente.data();

html += `

<div class="card">

<h2>🔴 Maca ${i}</h2>

<p><b>${dados.senha}</b></p>

<p>${dados.nome}</p>

<p>${dados.modalidade}</p>

<button onclick="finalizar('${paciente.id}')">

Finalizar Atendimento

</button>

</div>

`;

}else{

html += `

<div class="card">

<h2>🟢 Maca ${i}</h2>

<p>Livre</p>

</div>

`;

}

}

painel.innerHTML = html;

});

}

window.finalizar = async function(id){

await updateDoc(doc(db,"pacientes",id),{

status:"Finalizado"

});

}

carregar();
