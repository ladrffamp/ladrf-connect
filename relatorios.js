import { db } from "./firebase.js";

import {

collection,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const total = document.getElementById("total");

const aguardando = document.getElementById("aguardando");

const atendimento = document.getElementById("atendimento");

const finalizados = document.getElementById("finalizados");

const modalidades = document.getElementById("modalidades");



onSnapshot(collection(db,"pacientes"),(snapshot)=>{


let totalPacientes=0;

let espera=0;

let atendendo=0;

let concluido=0;


let listaModalidades={};



snapshot.forEach((doc)=>{


const paciente=doc.data();


totalPacientes++;


if(paciente.status==="Aguardando"){

espera++;

}


if(paciente.status==="Em atendimento"){

atendendo++;

}


if(paciente.status==="Finalizado"){

concluido++;

}



const modalidade =
paciente.modalidade || "Não informado";


if(!listaModalidades[modalidade]){

listaModalidades[modalidade]=0;

}


listaModalidades[modalidade]++;


});



total.innerHTML=totalPacientes;

aguardando.innerHTML=espera;

atendimento.innerHTML=atendendo;

finalizados.innerHTML=concluido;



modalidades.innerHTML="";


Object.entries(listaModalidades).forEach(([nome,quantidade])=>{


modalidades.innerHTML += `

<li>

${nome}: ${quantidade} atendimento(s)

</li>

`;

});


});
