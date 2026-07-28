import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const nomeUsuario = document.getElementById("nomeUsuario");
const perfilUsuario = document.getElementById("perfilUsuario");



onAuthStateChanged(auth, async (usuario)=>{


    if(!usuario){

        window.location.href = "login.html";
        return;

    }



    // mostra provisoriamente o email
    if(nomeUsuario){

        nomeUsuario.innerHTML = usuario.email;

    }



    try{


        const q = query(

            collection(db,"membros"),

            where(
                "email",
                "==",
                usuario.email
            )

        );



        const resultado = await getDocs(q);



        if(!resultado.empty){


            const membro = resultado.docs[0].data();



            if(nomeUsuario){

                nomeUsuario.innerHTML =
                membro.nome || usuario.email;

            }



            if(perfilUsuario){

                perfilUsuario.innerHTML =
                membro.funcao || "Membro";

            }


        }



    }catch(error){

        console.error(
            "Erro ao buscar membro:",
            error
        );

    }



});