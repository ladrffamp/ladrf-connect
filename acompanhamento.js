import { db, app } from "./firebase.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
getMessaging,
getToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";



const idPaciente =
new URLSearchParams(window.location.search).get("id");



const nome =
document.getElementById("nome");


const status =
document.getElementById("status");


const maca =
document.getElementById("maca");


const mensagem =
document.getElementById("mensagem");




// ================================
// SALVAR TOKEN DO PACIENTE
// ================================


async function salvarTokenPush(){


try{


const permissao =
await Notification.requestPermission();



if(permissao !== "granted"){

console.log("Notificação recusada");

return;

}



const messaging = getMessaging(app);



const token = await getToken(
messaging,
{

vapidKey:
"SUA_CHAVE_VAPID"

}
);



if(token){


await updateDoc(

doc(
db,
"pacientes",
idPaciente
),

{

tokenPush:token

}

);



console.log(
"Token do paciente salvo"
);


}



}catch(erro){


console.error(
"Erro token:",
erro
);


}



}








// ================================
// ACOMPANHAR PACIENTE
// ================================


async function carregarPaciente(){


if(!idPaciente){

nome.innerHTML="ID não encontrado";

return;

}



const pacienteDoc =
await getDoc(

doc(
db,
"pacientes",
idPaciente

)

);




if(!pacienteDoc.exists()){


nome.innerHTML =
"Paciente não encontrado";


return;


}




const paciente =
pacienteDoc.data();





nome.innerHTML =
paciente.nome || "-";



status.innerHTML =
paciente.status || "-";



maca.innerHTML =
paciente.maca
?
"MACA " + paciente.maca
:
"-";





if(
paciente.status === "Em atendimento"
){


mensagem.innerHTML =

"🔔 Chegou sua vez! Dirija-se ao atendimento.";


}
else{


mensagem.innerHTML =

"Aguarde sua vez.";


}



}





// iniciar


salvarTokenPush();


carregarPaciente();
