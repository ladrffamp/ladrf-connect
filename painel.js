import { db } from "./firebase.js";

import {
collection,
query,
where,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const nome = document.getElementById("nome");
const maca = document.getElementById("maca");
const fila = document.getElementById("fila");

// Guarda o último paciente mostrado para tocar o som apenas quando mudar
let ultimoPaciente = "";

// Som simples usando a Web Audio API
function tocarSom(){

const audio = new (window.AudioContext || window.webkitAudioContext)();

const osc = audio.createOscillator();

const ganho = audio.createGain();

osc.connect(ganho);

ganho.connect(audio.destination);

osc.type = "sine";

osc.frequency.value = 900;

ganho.gain.value = 0.1;

osc.start();

setTimeout(()=>{

osc.stop();

audio.close();

},250);

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

nome.innerHTML="Nenhum";

maca.innerHTML="-";

return;

}

const paciente = snapshot.docs[0].data();

nome.innerHTML = paciente.nome;

maca.innerHTML = "MACA " + paciente.maca;

if(ultimoPaciente !== paciente.nome){

ultimoPaciente = paciente.nome;

tocarSom();

}

});


// ==========================
// FILA
// ==========================

const aguardando = query(
collection(db,"pacientes"),
where("status","==","Aguardando")
);

onSnapshot(aguardando,(snapshot)=>{

fila.innerHTML="";

snapshot.forEach((doc)=>{

const paciente = doc.data();

fila.innerHTML += `
<li>${paciente.nome}</li>
`;

});

});
