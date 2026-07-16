import { db } from "./firebase.js";

import {
collection,
onSnapshot,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const fila = document.getElementById("fila");
const macas = document.getElementById("macas");

let listaMacas = {};
let listaPacientes = {};


// ===== CARREGA AS MACAS =====

onSnapshot(collection(db,"macas"),(snapshot)=>{

listaMacas = {};

macas.innerHTML="";

snapshot.forEach((documento)=>{

const maca=documento.data();

listaMacas[documento.id]=maca;

macas.innerHTML+=`

<div class="maca ${maca.status==="Livre"?"livre":"ocupada"}">

<h3>Maca ${maca.numero}</h3>

<p>${maca.status}</p>

<p>${maca.paciente || "-"}</p>

${
maca.status==="Ocupada"
?
`<br>
<button onclick="liberarMaca('${documento.id}')">
Liberar
</button>`
:
""
}

</div>

`;

});

});



// ===== CARREGA FILA =====

onSnapshot(collection(db,"pacientes"),(snapshot)=>{

fila.innerHTML="";

listaPacientes={};

snapshot.forEach((documento)=>{

const paciente=documento.data();

listaPacientes[documento.id]=paciente;

if(paciente.status==="Aguardando"){

fila.innerHTML+=`

<tr>

<td>${paciente.nome}</td>

<td>${paciente.modalidade}</td>

<td>

<button
onclick="chamarPaciente('${documento.id}')">

Chamar

</button>

</td>

</tr>

`;

}

});

});



// ===== CHAMAR PACIENTE =====

window.chamarPaciente = async(idPaciente)=>{

const livres = Object.entries(listaMacas)

.filter(([id,m])=>m.status==="Livre");

if(livres.length===0){

alert("Não existe maca livre.");

return;

}

let texto="Escolha uma maca:\n\n";

livres.forEach(([id,m])=>{

texto+=`${m.numero} - Maca ${m.numero}\n`;

});

const escolha=prompt(texto);

if(!escolha) return;

const macaEscolhida=livres.find(([id,m])=>

String(m.numero)===escolha

);

if(!macaEscolhida){

alert("Maca inválida.");

return;

}

const idMaca=macaEscolhida[0];

const maca=macaEscolhida[1];

const paciente=listaPacientes[idPaciente];

await updateDoc(doc(db,"pacientes",idPaciente),{

status:"Em atendimento",

maca:maca.numero

});

await updateDoc(doc(db,"macas",idMaca),{

status:"Ocupada",

paciente:paciente.nome

});

};



// ===== LIBERAR MACA =====

window.liberarMaca = async(idMaca)=>{

await updateDoc(doc(db,"macas",idMaca),{

status:"Livre",

paciente:""

});

};
