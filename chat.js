import { db, auth } from "./firebase.js";


import {

collection,

addDoc,

onSnapshot,

query,

orderBy,

serverTimestamp,

deleteDoc,

doc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const lista =
document.getElementById("listaMensagens");


const campoMensagem =
document.getElementById("mensagem");


const botaoEnviar =
document.getElementById("btnEnviar");


const nomeUsuario =
document.getElementById("nomeUsuario");



let usuarioAtual = null;

let ultimaMensagem = null;



// ===============================
// USUÁRIO LOGADO
// ===============================


onAuthStateChanged(auth,(usuario)=>{


if(!usuario){

window.location.href="login.html";

return;

}



usuarioAtual = usuario;



if(nomeUsuario){

nomeUsuario.innerHTML =
usuario.displayName || usuario.email;

}


});




// ===============================
// CARREGAR MENSAGENS
// ===============================


const mensagensQuery = query(

collection(db,"mensagens"),

orderBy("data","asc")

);



onSnapshot(mensagensQuery,(snapshot)=>{


lista.innerHTML="";



snapshot.forEach((documento)=>{


const msg = documento.data();



const minhaMensagem =
msg.uid === usuarioAtual?.uid;



// NOTIFICAÇÃO NOVA

if(
ultimaMensagem &&
documento.id !== ultimaMensagem &&
!minhaMensagem
){

mostrarNotificacao(
msg.nome + ": " + msg.mensagem
);

}



ultimaMensagem = documento.id;



lista.innerHTML += `


<div class="mensagem-chat">


<div class="cabecalho-msg">


<strong>

<i class="fa-solid fa-user"></i>

${msg.nome || "Membro"}

</strong>


${
minhaMensagem

?

`

<button

class="btn-apagar-msg"

onclick="apagarMensagem('${documento.id}')">

<i class="fa-solid fa-trash"></i>

</button>

`

:

""

}


</div>



<p>

${msg.mensagem}

</p>


<small>

${
msg.data?.seconds

?

new Date(
msg.data.seconds * 1000
)

.toLocaleString("pt-BR")

:

"Enviando..."

}

</small>


</div>


`;



});



lista.scrollTop =
lista.scrollHeight;


});





// ===============================
// ENVIAR MENSAGEM
// ===============================


botaoEnviar.onclick = async()=>{


const texto =
campoMensagem.value.trim();



if(!texto || !usuarioAtual){

return;

}



await addDoc(

collection(db,"mensagens"),

{


uid:

usuarioAtual.uid,


nome:

usuarioAtual.displayName || usuarioAtual.email,


foto:

usuarioAtual.photoURL || "",


mensagem:

texto,


data:

serverTimestamp()


}

);



campoMensagem.value="";


};





// ===============================
// APAGAR MENSAGEM
// ===============================


window.apagarMensagem = async(id)=>{


const confirmar =
confirm(
"Excluir esta mensagem?"
);



if(!confirmar){

return;

}



await deleteDoc(

doc(db,"mensagens",id)

);


};





// ===============================
// NOTIFICAÇÃO
// ===============================


function mostrarNotificacao(texto){


if(
Notification.permission === "granted"
){

new Notification(

"LADRF Chat",

{

body:texto,

icon:"icon-192.png"

}

);


}


}



if(
Notification.permission === "default"
){

Notification.requestPermission();

}
