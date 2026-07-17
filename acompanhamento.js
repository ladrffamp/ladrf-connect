console.log("LADRF acompanhamento completo carregado");


import { db } from "./firebase.js";


import {

doc,
onSnapshot,
collection,
query,
where,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const parametros = new URLSearchParams(
window.location.search
);


const pacienteId = parametros.get("id");



const statusTela = document.getElementById("status");

const dadosTela = document.getElementById("dados");



let statusAnterior = "";







// ==========================
// SOM DE CHAMADA
// ==========================


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


},700);



}catch(error){


console.log(error);


}



}









// ==========================
// POSIÇÃO NA FILA
// ==========================


async function calcularFila(id){



const filaQuery = query(

collection(db,"pacientes"),

where("status","==","Aguardando")

);



const resultado = await getDocs(filaQuery);



let lista = [];





resultado.forEach((item)=>{


lista.push({

id:item.id,

...item.data()

});


});







lista.sort((a,b)=>{


const dataA =

a.criadoEm?.seconds || 0;



const dataB =

b.criadoEm?.seconds || 0;



return dataA - dataB;



});







const posicao = lista.findIndex(

(paciente)=>

paciente.id === id

);





return {

posicao: posicao + 1,

frente: posicao

};



}










// ==========================
// ACOMPANHAMENTO
// ==========================


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





const paciente = snapshot.data();







// ==========================
// AGUARDANDO
// ==========================


if(paciente.status === "Aguardando"){



statusTela.className =

"status aguardando";



statusTela.innerHTML =

"🟡 Aguardando atendimento";





const fila = await calcularFila(

pacienteId

);






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


<b>Pessoas na frente:</b>

${fila.frente}



<br><br>


Aguarde o chamado da equipe LADRF.

`;



}










// ==========================
// EM ATENDIMENTO
// ==========================


if(paciente.status === "Em atendimento"){



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







if(statusAnterior !== "Em atendimento"){


tocarSom();


}



}









// ==========================
// FINALIZADO
// ==========================


if(paciente.status === "Finalizado"){



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







statusAnterior = paciente.status;



}



);



}
