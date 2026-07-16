import { db } from "./firebase.js";

import {

collection,
onSnapshot,
doc,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const fila =
document.getElementById("fila");


const macas =
document.getElementById("macas");


let pacientes = {};

let listaMacas = {};

let pacienteSelecionado = null;



// ==========================
// CARREGAR PACIENTES
// ==========================


onSnapshot(

collection(db,"pacientes"),

(snapshot)=>{


fila.innerHTML="";


snapshot.forEach((documento)=>{


const paciente =
documento.data();


pacientes[documento.id]=paciente;



if(paciente.status==="Aguardando"){


fila.innerHTML += `

<tr>

<td>
${paciente.nome}
</td>


<td>
${paciente.modalidade || "-"}
</td>


<td>

<button onclick="selecionarPaciente('${documento.id}')">

Chamar

</button>

</td>


</tr>

`;


}



});


}

);



// ==========================
// CARREGAR MACAS
// ==========================


onSnapshot(

collection(db,"macas"),

(snapshot)=>{


macas.innerHTML="";


listaMacas={};


snapshot.forEach((documento)=>{


const maca =
documento.data();


listaMacas[documento.id]=maca;



macas.innerHTML += `


<button

style="

margin:10px;

padding:20px;

background:${maca.status==="Livre" ? "#4CAF50":"#E53935"};

color:white;

border:none;

border-radius:10px;

"

onclick="escolherMaca('${documento.id}')"

>

Maca ${maca.numero}

<br>

${maca.status}

</button>


`;


});


}

);



// ==========================
// SELECIONAR PACIENTE
// ==========================


window.selecionarPaciente=function(id){


pacienteSelecionado=id;


alert(

"Paciente selecionado. Agora escolha uma maca livre."

);


};



// ==========================
// ESCOLHER MACA
// ==========================


window.escolherMaca=async function(idMaca){



if(!pacienteSelecionado){


alert(

"Primeiro selecione um paciente."

);


return;


}



const maca =
listaMacas[idMaca];



if(maca.status!=="Livre"){


alert(

"Esta maca está ocupada."

);


return;

}



const paciente =
pacientes[pacienteSelecionado];



// Atualiza paciente

await updateDoc(

doc(db,"pacientes",pacienteSelecionado),

{


status:"Em atendimento",

maca:maca.numero


}

);



// Atualiza maca

await updateDoc(

doc(db,"macas",idMaca),

{


status:"Ocupada",

paciente:paciente.nome


}

);



pacienteSelecionado=null;



alert(

"Paciente encaminhado para atendimento."

);



};
