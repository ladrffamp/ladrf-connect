import { db } from "./firebase.js";

import {
collection,
addDoc,
Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.cadastrar = async function(){

const paciente={

nome:document.getElementById("nome").value,

idade:document.getElementById("idade").value,

whatsapp:document.getElementById("whatsapp").value,

modalidade:document.getElementById("modalidade").value,

queixa:document.getElementById("queixa").value,

status:"Aguardando",

maca:"",

criadoEm:Timestamp.now()

};

try{

await addDoc(

collection(db,"pacientes"),

paciente

);

alert("Paciente cadastrado com sucesso!");

document.getElementById("nome").value="";
document.getElementById("idade").value="";
document.getElementById("whatsapp").value="";
document.getElementById("queixa").value="";

}catch(error){

alert(error.message);

}

}
