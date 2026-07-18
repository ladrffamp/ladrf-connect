// acompanhamento.js


import { db, messaging } from "./firebase.js";


import {
    doc,
    onSnapshot,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";



// =====================================
// ID DO PACIENTE PELO QR CODE
// =====================================

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




// =====================================
// REGISTRAR SERVICE WORKER
// =====================================

async function registrarServiceWorker(){


console.log("2 - Registrando Service Worker");


if("serviceWorker" in navigator){


const registro =
await navigator.serviceWorker.register(

"/ladrf-connect/firebase-messaging-sw.js"

);



console.log(
"Service Worker registrado:",
registro
);



return registro;


}


console.log(
"Navegador sem suporte a Service Worker"
);


}




// =====================================
// ATIVAR NOTIFICAÇÕES DO PACIENTE
// =====================================

async function salvarTokenPaciente(){


console.log(
"1 - Iniciando FCM"
);



try{


await registrarServiceWorker();



console.log(
"3 - Service Worker OK"
);



console.log(

"Permissão atual:",

Notification.permission

);




const permissao =
await Notification.requestPermission();



console.log(

"Permissão retornada:",

permissao

);



if(permissao !== "granted"){


console.log(
"Usuário não permitiu notificações"
);


return;


}




console.log(
"4 - Buscando token"
);




const token =
await getToken(

messaging,

{


vapidKey:

"BLd1c09XUUZnB4WjZY0XvdCJs_wdLvxxUw_ey-sNTC8f7hUreUwY5x5rOsnWkrRwrj-G4KH1cj8LHtv-oR6jZe0"

}

);





console.log(

"Token FCM gerado:",

token

);




if(token){



await updateDoc(

doc(

db,

"pacientes",

idPaciente

),

{


fcmToken:token


}

);



console.log(

"Token salvo no paciente"

);



}



}catch(error){


console.error(

"Erro FCM paciente:",

error

);


}


}







// =====================================
// RECEBER MENSAGEM COM SITE ABERTO
// =====================================

onMessage(

messaging,

(payload)=>{


console.log(

"Mensagem recebida:",

payload

);



new Notification(

payload.notification.title,

{


body:

payload.notification.body


}

);



}

);







// =====================================
// ACOMPANHAMENTO EM TEMPO REAL
// =====================================

async function iniciar(){



if(!idPaciente){


nome.innerHTML =
"Paciente não encontrado";


return;


}




await salvarTokenPaciente();





const pacienteRef =

doc(

db,

"pacientes",

idPaciente

);





onSnapshot(

pacienteRef,

(snapshot)=>{


if(!snapshot.exists()){


nome.innerHTML =
"Paciente não encontrado";


return;


}





const paciente =
snapshot.data();





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



}else{


mensagem.innerHTML =

"Aguarde sua vez.";



}



}


);



}





iniciar();
