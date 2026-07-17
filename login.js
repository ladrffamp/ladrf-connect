import { auth } from "./firebase.js";


import {

signInWithEmailAndPassword

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





window.login = async function(){



const email = document

.getElementById("email")

.value

.trim();




const senha = document

.getElementById("senha")

.value;





const mensagem = document

.getElementById("erro");





try {



await signInWithEmailAndPassword(

auth,

email,

senha

);





mensagem.style.color = "green";


mensagem.innerHTML =

"Login realizado!";







setTimeout(()=>{



window.location.href = "index.html";



},1000);







}

catch(error){





console.log("Código do erro:", error.code);


console.log("Mensagem:", error.message);





mensagem.style.color = "red";






if(error.code === "auth/user-not-found"){



mensagem.innerHTML =

"Usuário não encontrado.";



}







else if(error.code === "auth/wrong-password"){



mensagem.innerHTML =

"Senha incorreta.";



}







else if(error.code === "auth/invalid-credential"){



mensagem.innerHTML =

"E-mail ou senha inválidos.";



}







else if(error.code === "auth/operation-not-allowed"){



mensagem.innerHTML =

"Login por e-mail não está ativado no Firebase.";



}







else {



mensagem.innerHTML =

error.code;



}






}



}
