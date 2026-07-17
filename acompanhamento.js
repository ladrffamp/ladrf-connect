console.log("LADRF acompanhamento carregado");


import { db } from "./firebase.js";


import {

doc,
onSnapshot,
collection,
query,
where,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const pacienteId =
new URLSearchParams(window.location.search).get("id");



const statusTela =
document.getElementById("status");


const dadosTela =
document.getElementById("dados");



let statusAnterior = "";







// =====================
// FUNÇÃO SOM
// =====================


function tocarSom(){


try{


const AudioContext =

window.AudioContext ||

window.webkitAudioContext;



const audio = new AudioContext();



const oscilador =

audio.createOscillator();



const ganho =

audio.createGain();



oscilador.type = "sine";


oscilador.frequency.value = 900;



ganho.gain.value = 0.5;



oscilador.connect(ganho);


ganho.connect(audio.destination);



oscilador.start();



setTimeout(()=>{


oscilador.stop();



},600);



}

catch(e){


console.log(
"Erro no som",
e
);


}



}









// =====================
// BUSCAR FILA
// =====================


async function pegarPosicao(id){



const consulta = query(

collection(db,"pacientes"),

where(

"status",

"==",

"Aguardando"

)

);





const resultado = await getDocs(consulta);



let pacientes=[];





resultado.forEach((item)=>{



pacientes.push({


id:item.id,


...item.data()



});


});







pacientes.sort((a,b)=>{



const aTempo =

a.criadoEm?.seconds || 0;



const bTempo =

b.criadoEm?.seconds || 0;



return aTempo - bTempo;



});







const indice = pacientes.findIndex(


(p)=>p.id===id


);





return {



posicao:

indice + 1,



frente:

indice



};



}









// =====================
// INICIAR
// =====================


if(!pacienteId){


statusTela.innerHTML =
"QR Code inválido";


}

else{



const pacienteRef = doc(

db,

"pacientes",

pacienteId

);






onSnapshot(

pacienteRef,

async(snapshot)=>{



if(!snapshot.exists()){


statusTela.innerHTML =
"Paciente não encontrado";


return;

}




const paciente =
snapshot.data();







// =====================
// AGUARDANDO
// =====================


if(paciente.status==="Aguardando"){



statusTela.className =
"status aguardando";



statusTela.innerHTML =
"🟡 Aguardando atendimento";




const fila =
await pegarPosicao(pacienteId);





dadosTela.innerHTML = `


<b>Paciente:</b>

${paciente.nome || "-"}



<br><br>



<b>Modalidade:</b>

${paciente.modalidade || "-"}



<br><br>



<b>Posição na fila:</b>

${fila.posicao}º



<br><br>



<b>Pessoas antes:</b>

${fila.frente}



<br><br>



Aguarde o chamado da equipe LADRF.

`;



}










// =====================
// CHAMADO
// =====================


if(paciente.status==="Em atendimento"){



statusTela.className =
"status atendimento";



statusTela.innerHTML =
"🔔 SUA VEZ!";





dadosTela.innerHTML = `


<b>Paciente:</b>

${paciente.nome || "-"}



<br><br>



<b>Modalidade:</b>

${paciente.modalidade || "-"}



<br><br>



<b>Maca:</b>

${paciente.maca || "-"}



<br><br>



Dirija-se ao atendimento.

`;






if(statusAnterior!=="Em atendimento"){


tocarSom();



}



}










// =====================
// FINALIZADO
// =====================


if(paciente.status==="Finalizado"){



statusTela.className =
"status finalizado";



statusTela.innerHTML =
"🟢 Atendimento finalizado";





dadosTela.innerHTML = `


<b>Paciente:</b>

${paciente.nome || "-"}



<br><br>



Obrigado por utilizar o LADRF Connect.

`;



}







statusAnterior =
paciente.status;



}



);



}
