import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Gera código único do atendimento

async function gerarCodigo(){

const pacientes = await getDocs(
collection(db,"pacientes")
);

const numero = pacientes.size + 1;

return "LADRF-" + String(numero).padStart(4,"0");

}



window.cadastrar = async function(){


const nome =
document.getElementById("nome").value;

const idade =
document.getElementById("idade").value;

const whatsapp =
document.getElementById("whatsapp").value;

const modalidade =
document.getElementById("modalidade").value;

const queixa =
document.getElementById("queixa").value;



if(!nome){

alert("Digite o nome do paciente");

return;

}



const codigo =
await gerarCodigo();



const paciente = {

nome:nome,

idade:idade,

whatsapp:whatsapp,

modalidade:modalidade,

queixa:queixa,

codigoAtendimento:codigo,

status:"Aguardando",

maca:"",

criadoEm:Timestamp.now()

};



await addDoc(

collection(db,"pacientes"),

paciente

);



const link =

"https://ladrffamp.github.io/ladrf-connect/paciente.html?codigo="

+ codigo;



mostrarQRCode(link,codigo);



alert(

"Paciente cadastrado!\nCódigo: "

+ codigo

);



};



// Criar QR Code na tela

function mostrarQRCode(link,codigo){


let area =
document.getElementById("qrcode");


if(!area){

area=document.createElement("div");

area.id="qrcode";

document.body.appendChild(area);

}


area.innerHTML=

`

<h3>

Código do atendimento:

<br>

${codigo}

</h3>

<br>

<div id="qr"></div>

`;



new QRCode(

document.getElementById("qr"),

{

text:link,

width:200,

height:200

}

);

}
