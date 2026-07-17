console.log("LADRF acompanhamento com som carregado");


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


const som =
document.getElementById("somChamada");


const botaoSom =
document.getElementById("ativarSom");



let somLiberado = false;


let statusAnterior = "";







// liberar áudio

botaoSom.onclick = ()=>{


som.play()

.then(()=>{


som.pause();

som.currentTime = 0;


somLiberado = true;


alert("Alerta sonoro ativado!");



})

.catch((erro)=>{


console.log(erro);


});



};









function tocarSom(){



if(!somLiberado){


console.log("Som ainda não liberado");


return;


}




som.currentTime = 0;



som.play()

.then(()=>{


console.log("Som tocando");


})

.catch((erro)=>{


console.log(
"Erro áudio:",
erro
);


});





if(navigator.vibrate){


navigator.vibrate(
[500,200,500]
);


}



}










async function calcularFila(id){



const consulta = query(

collection(db,"pacientes"),

where(
"status",
"==",
"Aguardando"
)

);



const resultado =
await getDocs(consulta);



let lista=[];



resultado.forEach((item)=>{


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





const posicao = lista.findIndex(

(p)=>p.id===id

);





return {

posicao:posicao+1,

frente:posicao

};


}









if(pacienteId){



const referencia = doc(

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



statusTela.className =
"status aguardando";


statusTela.innerHTML =
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



statusTela.className =
"status atendimento";


statusTela.innerHTML =
"🔔 SUA VEZ!";



dadosTela.innerHTML=`


<b>Paciente:</b>

${paciente.nome || "-"}


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









if(paciente.status==="Finalizado"){



statusTela.className =
"status finalizado";


statusTela.innerHTML =
"🟢 Atendimento finalizado";



dadosTela.innerHTML =
"Obrigado pelo atendimento.";



}




statusAnterior =
paciente.status;



}



);



}
