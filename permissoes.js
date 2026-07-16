import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



onAuthStateChanged(auth, async (usuario)=>{


if(!usuario){

window.location.href = "login.html";

return;

}



const usuarioRef = doc(

db,

"usuarios",

usuario.uid

);



const usuarioDoc = await getDoc(usuarioRef);



if(!usuarioDoc.exists()){


alert("Usuário sem perfil cadastrado.");

await signOut(auth);

window.location.href="login.html";

return;


}



const perfil = usuarioDoc.data().perfil;



const pagina = window.location.pathname.split("/").pop();





const permissoes = {



admin:[

"index.html",

"dashboard.html",

"cadastro.html",

"fila.html",

"recepcao.html",

"macas.html",

"atendimento.html",

"historico.html",

"usuarios.html",

"relatorios.html"

],





recepcao:[

"index.html",

"dashboard.html",

"cadastro.html",

"fila.html",

"recepcao.html",

"painel.html"

],





membro:[

"index.html",

"dashboard.html",

"fila.html",

"macas.html",

"atendimento.html",

"historico.html"

]



};





if(!permissoes[perfil]){


alert("Perfil inválido.");

await signOut(auth);

window.location.href="login.html";

return;

}




if(!permissoes[perfil].includes(pagina)){


alert("Você não possui permissão para acessar esta página.");


window.location.href="index.html";


}



});
