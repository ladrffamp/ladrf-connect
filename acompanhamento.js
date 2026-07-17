console.log("ACOMPANHAMENTO SISTEMA OK");


import { db } from "./firebase.js";


import {

doc,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const parametros = new URLSearchParams(

window.location.search

);



const pacienteId = parametros.get("id");



const statusTela =
document.getElementById("status");



const dadosTela =
document.getElementById("dados");



const som =
document.getElementById("somChamada");





if(!pacienteId){


statusTela.innerHTML =
"Paciente não encontrado";


}





else{



const pacienteRef = doc(

db,

"pacientes",

pacienteId

);





onSnapshot(

pacienteRef,

(snapshot)=>{



if(!snapshot.exists()){

return;

}



const paciente = snapshot.data();






if(paciente.status === "Aguardando"){



statusTela.className =
"status aguardando";



statusTela.innerHTML =

"🟡 Aguardando atendimento";




dadosTela.innerHTML = `


<b>Paciente:</b>

${paciente.nome}



<br><br>


Aguarde o chamado da equipe LADRF.

`;



}








if(paciente.status === "Em atendimento"){



statusTela.className =
"status atendimento";



statusTela.innerHTML =

"🔔 SUA VEZ!";





dadosTela.innerHTML = `


<h2>

Dirija-se ao atendimento

</h2>


<br>


<b>Maca:</b>

${paciente.maca}



`;







// TOCAR ALERTA

if(

som &&

window.audioLiberado

){



som.currentTime = 0;


som.play();



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




}



);



}
