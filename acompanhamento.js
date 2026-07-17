console.log("Acompanhamento carregado");



import { db } from "./firebase.js";

import {

doc,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const url = new URLSearchParams(
window.location.search
);


const pacienteId = url.get("id");



const statusTela =
document.getElementById("status");


const dadosTela =
document.getElementById("dados");



let statusAnterior = "";





function tocarSom(){



const AudioContext =
window.AudioContext ||
window.webkitAudioContext;



const audio =
new AudioContext();



const beep =
audio.createOscillator();



const volume =
audio.createGain();



beep.type="sine";


beep.frequency.value=900;



volume.gain.value=0.5;



beep.connect(volume);


volume.connect(audio.destination);



beep.start();





setTimeout(()=>{


beep.stop();


},700);



}









if(!pacienteId){


statusTela.innerHTML =
"QR Code inválido";


}else{





const referencia = doc(

db,

"pacientes",

pacienteId

);





onSnapshot(

referencia,

(snapshot)=>{



if(!snapshot.exists()){


statusTela.innerHTML =
"Paciente não encontrado";


return;

}




const paciente =
snapshot.data();








if(paciente.status === "Aguardando"){



statusTela.className =
"status aguardando";


statusTela.innerHTML =
"🟡 Aguardando atendimento";



dadosTela.innerHTML = `


<b>Paciente:</b>

${paciente.nome}


<br><br>


Aguarde o chamado da equipe.

`;



}









if(paciente.status === "Em atendimento"){



statusTela.className =
"status atendimento";


statusTela.innerHTML =
"🔔 SUA VEZ!";



dadosTela.innerHTML = `


<b>Paciente:</b>

${paciente.nome}


<br><br>


<b>Maca:</b>

${paciente.maca}


<br><br>


Dirija-se ao atendimento.

`;





if(statusAnterior !== "Em atendimento"){


tocarSom();


}



}








if(paciente.status === "Finalizado"){



statusTela.className =
"status finalizado";


statusTela.innerHTML =
"🟢 Atendimento finalizado";



dadosTela.innerHTML = `


Obrigado por utilizar o LADRF Connect.

`;



}






statusAnterior =
paciente.status;



}



);



}
