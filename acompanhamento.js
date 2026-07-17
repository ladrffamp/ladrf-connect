console.log("Acompanhamento carregado");


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



let statusAnterior="";


let audioLiberado=false;


let audioContext=null;







// ======================
// LIBERAR SOM
// ======================


document
.getElementById("ativarSom")
.onclick=function(){



audioContext = new (

window.AudioContext ||

window.webkitAudioContext

)();



audioContext.resume();



audioLiberado=true;



alert(
"Alerta sonoro ativado!"
);



};









// ======================
// SOM
// ======================


function tocarSom(){



if(!audioLiberado){

console.log(
"Som bloqueado"
);

return;

}





const oscilador =
audioContext.createOscillator();



const ganho =
audioContext.createGain();





oscilador.type="sine";


oscilador.frequency.value=900;



ganho.gain.value=0.5;



oscilador.connect(ganho);


ganho.connect(audioContext.destination);



oscilador.start();



setTimeout(()=>{


oscilador.stop();



},700);



}









// ======================
// FILA
// ======================


async function calcularFila(id){



const consulta=query(

collection(db,"pacientes"),

where(
"status",
"==",
"Aguardando"
)

);



const snap=await getDocs(consulta);



let lista=[];




snap.forEach(item=>{


lista.push({

id:item.id,

...item.data()

});


});






lista.sort((a,b)=>{


return (

(a.criadoEm?.seconds || 0)

-

(b.criadoEm?.seconds || 0)

);


});





const posicao =
lista.findIndex(

p=>p.id===id

);




return {

posicao:posicao+1,

frente:posicao

};



}










// ======================
// TEMPO REAL
// ======================


if(pacienteId){



const referencia =
doc(

db,

"pacientes",

pacienteId

);






onSnapshot(

referencia,

async(snapshot)=>{



if(!snapshot.exists()) return;




const paciente =
snapshot.data();







if(paciente.status==="Aguardando"){



statusTela.className=
"status aguardando";


statusTela.innerHTML=
"🟡 Aguardando atendimento";



const fila =
await calcularFila(pacienteId);





dadosTela.innerHTML=`


<b>Paciente:</b>

${paciente.nome || "-"}


<br><br>


<b>Modalidade:</b>

${paciente.modalidade || "-"}


<br><br>


<b>Posição:</b>

${fila.posicao}º


<br><br>


<b>Pessoas antes:</b>

${fila.frente}


`;



}










if(paciente.status==="Em atendimento"){



statusTela.className=
"status atendimento";


statusTela.innerHTML=
"🔔 SUA VEZ!";



dadosTela.innerHTML=`


<b>Paciente:</b>

${paciente.nome}


<br><br>


<b>Maca:</b>

${paciente.maca}


<br><br>


Dirija-se ao atendimento.

`;






if(statusAnterior!=="Em atendimento"){


tocarSom();


}



}










if(paciente.status==="Finalizado"){



statusTela.className=
"status finalizado";


statusTela.innerHTML=
"🟢 Atendimento finalizado";



dadosTela.innerHTML=
"Obrigado pelo atendimento.";


}




statusAnterior =
paciente.status;



}



);



}
