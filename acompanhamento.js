import { db } from "./firebase.js";

import {

doc,
onSnapshot,
collection,
query,
where,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// Pegar ID pela URL

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





onSnapshot(

pacienteRef,

async(snapshot)=>{



if(!snapshot.exists()){


statusTela.innerHTML =
"Paciente não encontrado";


return;

}



const paciente = snapshot.data();





// =========================
// STATUS
// =========================



if(paciente.status === "Aguardando"){



statusTela.className =
"status aguardando";



statusTela.innerHTML =
"🟡 Aguardando atendimento";





const fila = await buscarPosicao(

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







else if(paciente.status === "Em atendimento"){



statusTela.className =
"status atendimento";



statusTela.innerHTML =
"🔵 Em atendimento";



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



}







else if(paciente.status === "Finalizado"){



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



}



);



}









// =================================
// CALCULAR POSIÇÃO NA FILA
// =================================


async function buscarPosicao(id){



const filaQuery = query(

collection(db,"pacientes"),

where("status","==","Aguardando")

);



const resultado = await getDocs(filaQuery);



let lista=[];



resultado.forEach((item)=>{


lista.push({

id:item.id,

...item.data()

});


});





lista.sort((a,b)=>{


const dataA = a.criadoEm?.seconds || 0;

const dataB = b.criadoEm?.seconds || 0;



return dataA - dataB;



});







const indice = lista.findIndex(

(p)=>p.id===id

);





return {


posicao: indice + 1,


frente: indice



};



}
