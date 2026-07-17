import { db } from "./firebase.js";

import {
collection,
query,
where,
onSnapshot,
orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const nome = document.getElementById("nome");

const maca = document.getElementById("maca");

const fila = document.getElementById("fila");



let ultimoPaciente = "";

let audioContext;





// ==========================
// SOM DE CHAMADA
// ==========================


function tocarSom(){


if(!audioContext){

audioContext = new (window.AudioContext || window.webkitAudioContext)();

}



const osc = audioContext.createOscillator();

const ganho = audioContext.createGain();



osc.connect(ganho);

ganho.connect(audioContext.destination);



osc.type="sine";

osc.frequency.value=900;


ganho.gain.value=0.15;



osc.start();



setTimeout(()=>{


osc.stop();


},300);



}







// ==========================
// PACIENTE EM ATENDIMENTO
// ==========================


const atendimento = query(

collection(db,"pacientes"),

where("status","==","Em atendimento")

);



onSnapshot(atendimento,(snapshot)=>{



if(snapshot.empty){


nome.innerHTML="Nenhum paciente";


maca.innerHTML="-";


return;


}



const paciente = snapshot.docs[0].data();





nome.innerHTML =

paciente.nome || "-";





maca.innerHTML =

paciente.maca

?

"MACA " + paciente.maca

:

"Sem maca";





if(ultimoPaciente !== paciente.nome){


ultimoPaciente = paciente.nome;


tocarSom();


}



});









// ==========================
// FILA DE ESPERA
// ==========================



const aguardando = query(

collection(db,"pacientes"),

where("status","==","Aguardando")

);





onSnapshot(aguardando,(snapshot)=>{


fila.innerHTML="";



if(snapshot.empty){


fila.innerHTML=

"<li>Nenhum paciente aguardando</li>";


return;


}





snapshot.forEach((item)=>{


const paciente=item.data();



fila.innerHTML += `

<li>

${paciente.nome}

<br>

<small>

${paciente.modalidade || ""}

</small>

</li>

`;


});



});
