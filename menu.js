import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


onAuthStateChanged(auth, async(usuario)=>{


if(!usuario){

window.location.href="login.html";

return;

}



const usuarioRef = doc(
db,
"usuarios",
usuario.uid
);



const usuarioDoc = await getDoc(usuarioRef);



if(!usuarioDoc.exists()){

return;

}



const perfil = usuarioDoc.data().perfil;



const botoes = document.querySelectorAll("[data-perfil]");



botoes.forEach(botao=>{


const permitido = botao.dataset.perfil;



if(permitido.includes(perfil)){

botao.style.display="block";

}else{

botao.style.display="none";

}


});


});
