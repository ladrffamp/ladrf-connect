import { db } from "./firebase.js";

import {

doc,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// Pegar ID do paciente pela URL

const parametros = new URLSearchParams(

window.location.search

);


const pacienteId = parametros.get("id");



const statusTela = document.getElementById("status");

const dadosTela = document.getElementById("dados");





if(!pacienteId){


statusTela.innerHTML =
"Paciente não encontrado";


}else{



const pacienteRef = doc(

db,

"pacientes",

pacienteId

);





// Atualização em tempo real

onSnapshot(

pacienteRef,

(snapshot)=>{



if(!snapshot.exists()){


statusTela.innerHTML =
"Paciente não encontrado";


return;


}




const dados = snapshot.data();






// STATUS

if(dados.status === "Aguardando"){


statusTela.className =
"status aguardando";


statusTela.innerHTML =
"🟡 Aguardando atendimento";


}





else if(dados.status === "Em atendimento"){



statusTela.className =
"status atendimento";


statusTela.innerHTML =
"🔵 Em atendimento";



}





else if(dados.status === "Finalizado"){



statusTela.className =
"status finalizado";


statusTela.innerHTML =
"🟢 Atendimento finalizado";



}







dadosTela.innerHTML = `


<b>Paciente:</b>

${dados.nome || "-"}


<br><br>


<b>Modalidade:</b>

${dados.modalidade || "-"}


<br><br>


<b>Maca:</b>

${dados.maca || "-"}



`;





}

);



}
