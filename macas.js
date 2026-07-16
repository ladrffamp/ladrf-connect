import { db } from "./firebase.js";

import {

collection,
onSnapshot,
doc,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const area = document.getElementById("macas");



let pacientes = {};


// Buscar pacientes

onSnapshot(

collection(db,"pacientes"),

(snapshot)=>{


pacientes={};


snapshot.forEach((documento)=>{


pacientes[documento.id]=documento.data();


});


mostrarMacas();

}

);



// Buscar macas

onSnapshot(

collection(db,"macas"),

(snapshot)=>{


window.listaMacas={};


snapshot.forEach((documento)=>{


window.listaMacas[documento.id]={

...documento.data(),

id:documento.id

};


});


mostrarMacas();


}

);





function mostrarMacas(){


if(!window.listaMacas) return;



area.innerHTML="";



Object.values(window.listaMacas).forEach((maca)=>{



let botao="";



if(maca.status==="Ocupada"){



botao=

`

<br>

<button onclick="finalizar('${maca.id}')">

Finalizar Atendimento

</button>

`;



}



area.innerHTML +=


`

<div class="maca ${maca.status==="Livre" ? "livre":"ocupada"}">


<h2>

Maca ${maca.numero}

</h2>


<h3>

${maca.status}

</h3>


<p>

${maca.paciente || "Disponível"}

</p>


${botao}


</div>

`;



});


}






window.finalizar = async function(idMaca){



const maca =
window.listaMacas[idMaca];



if(!maca.paciente){

alert("Paciente não encontrado");

return;

}



// localizar paciente

let idPaciente=null;



Object.entries(pacientes).forEach(([id,p])=>{


if(p.nome===maca.paciente){

idPaciente=id;

}


});




if(idPaciente){



await updateDoc(

doc(db,"pacientes",idPaciente),

{

status:"Finalizado"

}

);


}




await updateDoc(

doc(db,"macas",idMaca),

{

status:"Livre",

paciente:""

}

);



alert(

"Atendimento finalizado e maca liberada."

);



}
