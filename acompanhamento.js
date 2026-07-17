console.log("ACOMPANHAMENTO NOVO CARREGADO");


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


<b>Sua posição:</b>

${fila.posicao}º


<br><br>


<b>Pessoas antes:</b>

${fila.frente}



<br><br>


Aguarde o chamado da equipe LADRF.

`;



}






if(paciente.status === "Em atendimento"){



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


Seu atendimento começou.

`;



}







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



}



);



}









async function calcularFila(id){



const consulta = query(

collection(db,"pacientes"),

where("status","==","Aguardando")

);



const resultado = await getDocs(consulta);



let pacientes = [];



resultado.forEach((item)=>{


pacientes.push({

id:item.id,

...item.data()

});


});





pacientes.sort((a,b)=>{


const aData =

a.criadoEm?.seconds || 0;



const bData =

b.criadoEm?.seconds || 0;



return aData - bData;


});





const posicao = pacientes.findIndex(

(p)=>p.id === id

);



return {


posicao:posicao + 1,


frente:posicao



};


}
