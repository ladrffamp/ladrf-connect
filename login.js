import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// =====================================
// LOGIN
// =====================================

async function login(){


const email =
document.getElementById("email")
.value
.trim();


const senha =
document.getElementById("senha")
.value;


const mensagem =
document.getElementById("erro");



try{


mensagem.innerHTML = "";



await signInWithEmailAndPassword(
    auth,
    email,
    senha
);



// pega informações do QR Code

const parametros =
new URLSearchParams(
    window.location.search
);


const evento =
parametros.get("evento");



mensagem.style.color = "green";

mensagem.innerHTML =
"Login realizado!";




// volta para confirmação do evento

setTimeout(()=>{


if(evento){


window.location.href =
"checkin.html?evento=" + evento;


}else{


window.location.href =
"index.html";


}


},1000);



}
catch(error){


console.log(error.code);


mensagem.style.color = "red";


if(error.code === "auth/invalid-credential"){


mensagem.innerHTML =
"E-mail ou senha inválidos.";


}

else if(error.code === "auth/user-not-found"){


mensagem.innerHTML =
"Usuário não encontrado.";


}

else{


mensagem.innerHTML =
error.code;


}


}


}




// =====================================
// BOTÃO LOGIN
// =====================================


document.addEventListener(
"DOMContentLoaded",
()=>{


const botao =
document.getElementById("btnEntrar");


if(botao){


botao.addEventListener(
"click",
login
);


}


}
);