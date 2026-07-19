import { db } from "./firebase.js";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const selectEvento = document.getElementById("evento");
const listaPresenca = document.getElementById("listaPresenca");

const totalMembros = document.getElementById("totalMembros");
const presentes = document.getElementById("presentes");
const pendentes = document.getElementById("pendentes");
const ausentes = document.getElementById("ausentes");

let membros = [];
let eventos = [];

// ==========================
// CARREGAR EVENTOS
// ==========================

onSnapshot(
collection(db,"agenda"),
(snapshot)=>{

eventos=[];

selectEvento.innerHTML=`
<option value="">
Selecione um evento
</option>
`;

snapshot.forEach((doc)=>{

const evento=doc.data();

eventos.push({
id:doc.id,
...evento
});

selectEvento.innerHTML+=`
<option value="${doc.id}">
${evento.titulo}
</option>
`;

});

}
);

// ==========================
// CARREGAR MEMBROS
// ==========================

onSnapshot(
collection(db,"membros"),
(snapshot)=>{

membros=[];

snapshot.forEach((doc)=>{

const membro=doc.data();

if(membro.status==="Ativo"){

membros.push({

id:doc.id,
...membro

});

}

});

atualizarTabela();

}
);

// ==========================
// ATUALIZAR TABELA
// ==========================

function atualizarTabela(){

listaPresenca.innerHTML="";

if(membros.length===0){

listaPresenca.innerHTML=`
<tr>
<td colspan="5">
Nenhum membro encontrado.
</td>
</tr>
`;

return;

}

membros.forEach((membro)=>{

listaPresenca.innerHTML+=`

<tr>

<td>

${membro.nome}

</td>

<td>

${membro.curso}

</td>

<td>

<span class="status pendente">

Pendente

</span>

</td>

<td>

—

</td>

<td>

<button class="presente">

✔ Presente

</button>

<button class="ausente">

❌ Ausente

</button>

</td>

</tr>

`;

});

totalMembros.innerHTML=membros.length;
presentes.innerHTML=0;
pendentes.innerHTML=membros.length;
ausentes.innerHTML=0;

}
