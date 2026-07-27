import { db, auth } from "./firebase.js";


import {

collection,

addDoc,

onSnapshot,

query,

orderBy,

serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// ELEMENTOS

const lista =
document.getElementById("listaMensagens");


const campoMensagem =
document.getElementById("mensagem");


const botaoEnviar =
document.getElementById("btnEnviar");


const nomeUsuario =
document.getElementById("nomeUsuario");




// USUÁRIO ATUAL

let usuarioAtual = null;



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







// =====================================
// CARREGAR MENSAGENS
// =====================================


const mensagensQuery = query(

collection(db,"mensagens"),

orderBy("data","asc")

);



onSnapshot(mensagensQuery,(snapshot)=>{


lista.innerHTML="";



if(snapshot.empty){


lista.innerHTML = `

<p style="text-align:center">

Nenhuma mensagem ainda.

</p>

`;


return;

}





snapshot.forEach((documento)=>{


const msg = documento.data();



lista.innerHTML += `

<div class="mensagem-chat">


<strong>

${msg.nome || "Membro"}

</strong>


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

""

}

</small>


</div>

`;



});



// jogar para última mensagem

lista.scrollTop =
lista.scrollHeight;



});








// =====================================
// ENVIAR MENSAGEM
// =====================================


botaoEnviar.onclick = async()=>{


const texto =
campoMensagem.value.trim();



if(!texto){

return;

}



if(!usuarioAtual){

alert(
"Usuário não identificado."
);

return;

}




try{


await addDoc(

collection(db,"mensagens"),

{


uid:
usuarioAtual.uid,


nome:
usuarioAtual.displayName || usuarioAtual.email,


mensagem:
texto,


data:
serverTimestamp()


}

);



campoMensagem.value="";



}

catch(error){


console.error(
"Erro ao enviar mensagem:",
error
);



alert(
"Erro ao enviar mensagem."
);



}



};
