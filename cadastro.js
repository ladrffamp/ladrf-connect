import { db } from "./firebase.js";


import {

collection,
addDoc,
getDocs,
Timestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// Criar código do atendimento

async function gerarCodigo(){


const pacientes = await getDocs(
collection(db,"pacientes")
);


let numero = pacientes.size + 1;


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



await addDoc(

collection(db,"pacientes"),

{


nome:nome,

idade:idade,

whatsapp:whatsapp,

modalidade:modalidade,

queixa:queixa,


codigoAtendimento:codigo,


status:"Aguardando",


maca:"",


criadoEm:Timestamp.now()


}

);



const link =

"https://ladrffamp.github.io/ladrf-connect/paciente.html?codigo="

+ codigo;



gerarQRCode(link,codigo);



alert(

"Paciente cadastrado!\n\nCódigo: "

+ codigo

);



};





function gerarQRCode(link,codigo){



const area =
document.getElementById("qrcode");



area.innerHTML=

`

<h3>

Código:

${codigo}

</h3>

<br>

<div id="qr"></div>

`;



new QRCode(

document.getElementById("qr"),

{

text:link,

width:220,

height:220

}

);



}
