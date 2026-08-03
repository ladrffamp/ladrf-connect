import { auth, db } from "./firebase.js";


import {

doc,

getDoc,

setDoc,

Timestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const eventoId =

new URLSearchParams(

window.location.search

).get("evento");



const nomeEvento =

document.getElementById("nomeEvento");



const eventoConfirmado =

document.getElementById("eventoConfirmado");



const horaCheckin =

document.getElementById("horaCheckin");



const resultadoCheckin =

document.getElementById("resultadoCheckin");



const botao =

document.getElementById("btnCheckin");



let usuario;

let eventoAtual;



// ================================
// CARREGAR EVENTO E USUÁRIO
// ================================


onAuthStateChanged(auth, async(u)=>{


if(!u){

window.location.href =
"login.html?redirect=checkin&evento=" + eventoId;

return;

}



usuario=u;



const evento = await getDoc(

doc(

db,

"agenda",

eventoId

)

);



if(evento.exists()){


eventoAtual = evento.data();



if(nomeEvento){

nomeEvento.innerHTML =

eventoAtual.titulo;

}



if(eventoConfirmado){

eventoConfirmado.innerHTML =

"🟢 " + eventoAtual.titulo;

}



}



});







// ================================
// CONFIRMAR PRESENÇA
// ================================


botao.onclick = async()=>{


if(!usuario){

return;

}



const membro = await getDoc(

doc(

db,

"membros",

usuario.uid

)

);



const nome =

membro.exists()

?

membro.data().nome

:

usuario.email;





await setDoc(

doc(
db,
"agenda",
eventoId,
"participantes",
usuario.uid
),

{

nome:nome,

email:usuario.email,

presenca:"Confirmado",

metodo:"QR Code",

checkin:Timestamp.now()

}

);




// esconder botão

botao.style.display="none";



// mostrar confirmação

if(resultadoCheckin){

resultadoCheckin.style.display="block";

}



if(nomeEvento){

nomeEvento.style.display="none";

}



if(horaCheckin){


horaCheckin.innerHTML =

new Date()

.toLocaleTimeString("pt-BR");


}



};
