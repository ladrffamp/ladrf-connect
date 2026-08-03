import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// =====================================
// LOGIN
// =====================================

async function login(){


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


        mensagem.innerHTML = "";


        await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );


        mensagem.style.color = "green";

        mensagem.innerHTML =
        "Login realizado!";


        setTimeout(() => {


    const parametros =
    new URLSearchParams(
        window.location.search
    );


    const redirect =
    parametros.get("redirect");


    const evento =
    parametros.get("evento");



    if(
        redirect === "checkin" &&
        evento
    ){


        window.location.href =
        "checkin.html?evento=" + evento;


    }else{


        window.location.href =
        "index.html";


    }


}, 1000);



    } catch(error) {


        console.log(
            "Código do erro:",
            error.code
        );


        console.log(
            "Mensagem:",
            error.message
        );


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



// =====================================
// BOTÃO ENTRAR
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const botao =
        document.getElementById("btnEntrar");


        if(!botao){


            console.error(
                "Botão btnEntrar não encontrado"
            );


            return;

        }



        botao.addEventListener(
            "click",
            login
        );


    }
);