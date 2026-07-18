// acompanhamento.js


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




// ================================
// ID DO PACIENTE PELO QR CODE
// ================================


const idPaciente =

new URLSearchParams(window.location.search).get("id");





// ================================
// ELEMENTOS DA TELA
// ================================


const nome =

document.getElementById("nome");


const status =

document.getElementById("status");


const maca =

document.getElementById("maca");


const mensagem =

document.getElementById("mensagem");






// ================================
// SALVAR TOKEN PUSH DO PACIENTE
// ================================


async function salvarTokenPush(){


try{


if(!idPaciente){

console.log("Paciente sem ID");

return;

}




const permissao =

await Notification.requestPermission();




if(permissao !== "granted"){


console.log("Permissão negada");


return;


}




const messaging = getMessaging(app);




// Registrar service worker correto do GitHub Pages

const registroSW =

await navigator.serviceWorker.register(

"/ladrf-connect/firebase-messaging-sw.js"

);





const token = await getToken(

messaging,

{


vapidKey:

"BLd1c09XUUZnB4WjZY0XvdCJs_wdLvxxUw_ey-sNTC8f7hUreUwY5x5rOsnWkrRwrj-G4KH1cj8LHtv-oR6jZe0",


serviceWorkerRegistration:

registroSW


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


tokenPush: token


}

);



console.log(

"Token salvo com sucesso"

);



}else{


console.log(

"Token não gerado"

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
// CARREGAR PACIENTE
// ================================


async function carregarPaciente(){



try{



if(!idPaciente){


nome.innerHTML =

"Paciente não identificado";


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





if(paciente.maca){


maca.innerHTML =

"MACA " + paciente.maca;


}else{


maca.innerHTML = "-";


}





if(

paciente.status === "Em atendimento"

){



mensagem.innerHTML =

"🔔 Chegou sua vez! Dirija-se ao atendimento.";



}else{



mensagem.innerHTML =

"Aguarde sua vez.";



}






}catch(erro){


console.error(

"Erro carregando paciente:",

erro

);


}



}








// ================================
// INICIAR
// ================================


salvarTokenPush();


carregarPaciente();
