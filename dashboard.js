import { db } from "./firebase.js";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cards = document.getElementById("cards");

onSnapshot(collection(db,"pacientes"),(snapshot)=>{

let aguardando=0;
let chamado=0;
let finalizado=0;

snapshot.forEach((doc)=>{

const p=doc.data();

if(p.status==="Aguardando") aguardando++;

if(p.status==="Chamado") chamado++;

if(p.status==="Finalizado") finalizado++;

});

cards.innerHTML=`

<div class="card">

<h2>🟡 ${aguardando}</h2>

<p>Aguardando</p>

</div>

<div class="card">

<h2>🔴 ${chamado}</h2>

<p>Em Atendimento</p>

</div>

<div class="card">

<h2>✅ ${finalizado}</h2>

<p>Finalizados</p>

</div>

`;

});
