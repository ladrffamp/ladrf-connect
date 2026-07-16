import { auth } from "./firebase.js";

import {

signInWithEmailAndPassword

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.login = async function(){

const email =
document.getElementById("email").value;

const senha =
document.getElementById("senha").value;

try{

await signInWithEmailAndPassword(
auth,
email,
senha
);

window.location.href="dashboard.html";

}catch(e){

document.getElementById("erro").innerHTML=
"E-mail ou senha inválidos.";

}

}
