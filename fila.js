import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
onSnapshot,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const lista = document.getElementById("lista");
const contador = document.getElementById("contador");


const filaQuery = query(
collection(db,"pacientes"),
orderBy("horario")
);


onSnapshot(filaQuery,(snapshot)=>{


lista.innerHTML="";


let aguardando = 0;
let posicao = 1;


snapshot.forEach((item)=>{


const paciente = item.data();


if(
paciente.status === "Aguardando" ||
paciente.status === "Chamado"
){


if(paciente.status === "Aguardando"){
aguardando++;
}


const card=document.createElement("div");


card.className="paciente";


card.innerHTML=`

<div>

<h3>${paciente.senha}</h3>

<p><b>${paciente.nome}</b></p>

<p>${paciente.modalidade}</p>

<p>Posição: ${posicao}º</p>

<p>Status: ${paciente.status}</p>

</div>


<div>


<select id="maca-${item.id}">

<option value="Maca 1">
Maca 1
</option>

<option value="Maca 2">
Maca 2
</option>

<option value="Maca 3">
Maca 3
</option>

<option value="Maca 4">
Maca 4
</option>

</select>


<button onclick="chamar('${item.id}')">

Chamar

</button>


</div>

`;


lista.appendChild(card);


posicao++;


}


});


contador.innerHTML = 
`🟡 ${aguardando} pacientes aguardando`;


});




window.chamar = async function(id){


const maca =
document.getElementById(`maca-${id}`).value;



await updateDoc(

doc(db,"pacientes",id),

{

status:"Chamado",

maca:maca

}

);


}
