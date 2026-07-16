import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


export let perfilUsuario = null;


onAuthStateChanged(auth, async (user)=>{


if(!user){

window.location.href="login.html";

return;

}


const referencia = doc(
db,
"usuarios",
user.uid
);


const dados = await getDoc(referencia);


if(dados.exists()){


perfilUsuario = dados.data().perfil;


console.log(
"Perfil:",
perfilUsuario
);


}else{


console.log(
"Usuário sem perfil cadastrado"
);


}


});
