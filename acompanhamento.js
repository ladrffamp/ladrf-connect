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



const idPaciente = new URLSearchParams(window.location.search).get("id");


const nome = document.getElementById("nome");
const status = document.getElementById("status");
const maca = document.getElementById("maca");
const mensagem = document.getElementById("mensagem");


let notificacaoEnviada = false;



// =====================================
// REGISTRAR SERVICE WORKER
// =====================================

async function registrarServiceWorker(){

    if("serviceWorker" in navigator){

        const registro =
        await navigator.serviceWorker.register(
            "/ladrf-connect/firebase-messaging-sw.js"
        );

        console.log(
            "Service Worker:",
            registro
        );

    }

}




// =====================================
// GERAR TOKEN DO PACIENTE
// =====================================

async function salvarTokenPaciente(){


try{


await registrarServiceWorker();



const permissao =
await Notification.requestPermission();



if(permissao !== "granted"){

console.log(
"Notificação recusada"
);

return;

}



const token = await getToken(

messaging,

{

vapidKey:
"BLd1c09XUUZnB4WjZY0XvdCJs_wdLvxxUw_ey-sNTC8f7hUreUwY5x5rOsnWkrRwrj-G4KH1cj8LHtv-oR6jZe0"

}

);



if(token){


console.log(
"Token paciente:",
token
);



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
// MENSAGEM COM SITE ABERTO
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
// ACOMPANHAMENTO
// =====================================

async function iniciar(){


if(!idPaciente){

nome.innerHTML =
"Paciente não encontrado";

return;

}



await salvarTokenPaciente();



const pacienteRef =
doc(db,"pacientes",idPaciente);



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





if(paciente.status === "Em atendimento"){


mensagem.innerHTML =
"🔔 Chegou sua vez! Dirija-se ao atendimento.";



notificacaoEnviada = true;



}else{


notificacaoEnviada = false;


mensagem.innerHTML =
"Aguarde sua vez.";

}



}


);


}



iniciar();
