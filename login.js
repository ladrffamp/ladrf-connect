import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


window.login = async function(){

  const email = document.getElementById("email").value.trim();

  const senha = document.getElementById("senha").value;


  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );


    alert("Login realizado com sucesso!");

    window.location.href = "dashboard.html";


  } catch(error) {

    console.log(error);

    document.getElementById("erro").innerHTML =
    "E-mail ou senha inválidos.";

  }

}
