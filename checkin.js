import { auth, db } from "./firebase.js";


import {

doc,

getDoc,

setDoc,

Timestamp

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const eventoId =

new URLSearchParams(

window.location.search

).get("evento");



const nomeEvento =

document.getElementById("nomeEvento");



const botao =

document.getElementById("btnCheckin");



let usuario;



onAuthStateChanged(auth, async(u)=>{


if(!u){

window.location.href="login.html";

return;

}


usuario=u;



const evento = await getDoc(

doc(db,"agenda",eventoId)

);



if(evento.exists()){


nomeEvento.innerHTML =

evento.data().titulo;


}



});





botao.onclick = async()=>{


const membro = await getDoc(

doc(

db,

"membros",

usuario.uid

)

);



await setDoc(

doc(

db,

"agenda",

eventoId,

"participantes",

usuario.uid

),

{


nome:

membro.data().nome,


email:

usuario.email,


presenca:

"Confirmado",


checkin:

Timestamp.now()


}


);



alert(

"Presença confirmada!"

);


};
