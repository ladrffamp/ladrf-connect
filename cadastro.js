import { db } from "./firebase.js";

import {
collection,
addDoc,
Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


console.log("cadastro.js carregado");



const form = document.getElementById("formCadastro");

const qrArea = document.getElementById("qrcode");



console.log(
"QRCode disponível:",
typeof QRCode
);






form.addEventListener("submit", async function(e){


e.preventDefault();



const nome =
document.getElementById("nome").value;


const whatsapp =
document.getElementById("whatsapp").value;


const idade =
document.getElementById("idade").value;


const modalidade =
document.getElementById("modalidade").value;


const queixa =
document.getElementById("queixa").value;





try{



console.log("Salvando paciente...");



const paciente = await addDoc(

collection(db,"pacientes"),

{


nome:nome,


whatsapp:whatsapp,


idade:idade,


modalidade:modalidade,


queixa:queixa,


maca:"",


status:"Aguardando",


criadoEm:Timestamp.now()


}

);





console.log(
"Paciente criado:",
paciente.id
);





alert(
"Paciente cadastrado com sucesso!"
);







const link =

"https://ladrffamp.github.io/ladrf-connect/acompanhamento.html?id="

+

paciente.id;





console.log(
"Link QR:",
link
);






if(!qrArea){


alert(
"Elemento qrcode não encontrado"
);


return;

}





if(typeof QRCode === "undefined"){


alert(
"Biblioteca QR Code não carregou"
);


return;


}





qrArea.innerHTML="";





new QRCode(

qrArea,

{

text:link,

width:200,

height:200

}

);





console.log(
"QR Code criado!"
);





}catch(error){


console.error(error);


alert(

"Erro ao cadastrar: "

+

error.message

);


}



});
