import { db } from "./firebase.js";

import {

collection,
addDoc,
Timestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// Elementos do formulário

const form = document.getElementById("formCadastro");





form.addEventListener("submit", async(e)=>{


e.preventDefault();





const nome = document.getElementById("nome").value;


const whatsapp = document.getElementById("whatsapp").value;


const modalidade = document.getElementById("modalidade").value;


const queixa = document.getElementById("queixa").value;







try{



await addDoc(

collection(db,"pacientes"),

{


nome:nome,


whatsapp:whatsapp,


modalidade:modalidade,


queixa:queixa,



// entra na fila

status:"Aguardando",



// horário de entrada na fila

horarioCadastro:Timestamp.now(),



// sem maca inicialmente

maca:""



}

);





alert(

"Paciente cadastrado com sucesso!"

);





form.reset();





}catch(error){


console.error(error);


alert(

"Erro ao cadastrar paciente"

);


}



});
