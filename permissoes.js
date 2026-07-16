import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


async function verificarPerfil(){

onAuthStateChanged(auth, async (usuario)=>{


if(!usuario){

window.location.href="login.html";

return;

}


const ref = doc(
db,
"usuarios",
usuario.uid
);


const dados = await getDoc(ref);


if(!dados.exists()){

alert("Usuário sem permissão cadastrada");

return;

}


const perfil = dados.data().perfil;


console.log("Acesso:", perfil);


// Esconde funções conforme perfil


if(perfil === "recepcao"){

document
.querySelectorAll(".admin")
.forEach(item=>{

item.style.display="none";

});

}



if(perfil === "fisioterapeuta"){

document
.querySelectorAll(".cadastro")
.forEach(item=>{

item.style.display="none";

});

}


});


}


verificarPerfil();
