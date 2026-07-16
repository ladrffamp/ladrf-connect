import { db } from "./firebase.js";

import {

collection,

onSnapshot,

doc,

updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const lista=document.getElementById("lista");


onSnapshot(collection(db,"pacientes"),(snapshot)=>{

lista.innerHTML="";


snapshot.forEach((documento)=>{

const paciente=documento.data();

const id=documento.id;

lista.innerHTML+=`

<tr>

<td>${paciente.nome}</td>

<td>${paciente.modalidade}</td>

<td>${paciente.status}</td>

<td>${paciente.maca || "-"}</td>

<td>

<button
class="chamar"
onclick="chamar('${id}')">

Chamar

</button>

<button
class="finalizar"
onclick="finalizar('${id}')">

Finalizar

</button>

</td>

</tr>

`;

});

});


window.chamar=async(id)=>{

const maca=prompt("Número da maca:");

if(!maca) return;

await updateDoc(

doc(db,"pacientes",id),

{

status:"Em atendimento",

maca:maca

}

);

}


window.finalizar=async(id)=>{

await updateDoc(

doc(db,"pacientes",id),

{

status:"Finalizado"

}

);

}
