import { db } from "./firebase.js";

import {

collection,
addDoc,
Timestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




const form = document.getElementById("formCadastro");

const qr = document.getElementById("qrcode");





form.addEventListener("submit", async(e)=>{


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



// Criar paciente

const pacienteCriado = await addDoc(

collection(db,"pacientes"),

{


nome,


whatsapp,


idade,


modalidade,


queixa,


maca:"",


status:"Aguardando",


criadoEm:

Timestamp.now()


}

);







alert(
"Paciente cadastrado com sucesso!"
);








// Gerar QR Code

if(qr && typeof QRCode !== "undefined"){



const link =

`https://ladrffamp.github.io/ladrf-connect/acompanhamento.html?id=${pacienteCriado.id}`;





qr.innerHTML="";




new QRCode(

qr,

{


text:link,


width:200,


height:200


}

);




}







form.reset();





}catch(error){



console.error(error);



alert(

"Erro ao cadastrar paciente: "

+

error.message

);



}



});
