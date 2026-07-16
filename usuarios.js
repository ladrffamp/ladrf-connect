import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


window.cadastrarUsuario = async function(){


const nome =
document.getElementById("nome").value;


const email =
document.getElementById("email").value;


const senha =
document.getElementById("senha").value;


const perfil =
document.getElementById("perfil").value;


const mensagem =
document.getElementById("mensagem");


try{


const usuario =
await createUserWithEmailAndPassword(
auth,
email,
senha
);


await setDoc(

doc(
db,
"usuarios",
usuario.user.uid
),

{

nome:nome,

perfil:perfil,

email:email

}

);


mensagem.innerHTML =
"Usuário criado com sucesso";


}catch(error){


mensagem.innerHTML =
error.message;


}


}
