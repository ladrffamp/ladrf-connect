import { db } from "./firebase.js";

import {
collection,
addDoc,
Timestamp,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


console.log("cadastro.js carregado");



const form = document.getElementById("formCadastro");

const qrArea = document.getElementById("qrcode");

const selectModalidade = document.getElementById("modalidade");




// =====================================
// CARREGAR MODALIDADES
// =====================================

if(selectModalidade){


onSnapshot(

collection(db,"modalidades"),

(snapshot)=>{


selectModalidade.innerHTML = `

<option value="">
Selecione
</option>

`;



snapshot.forEach((item)=>{


const modalidade = item.data();



selectModalidade.innerHTML += `

<option value="${modalidade.nome}">
${modalidade.nome}
</option>

`;



});


}


);


}






// =====================================
// CADASTRAR PACIENTE
// =====================================


if(form){


form.addEventListener("submit", async function(e){


e.preventDefault();




const dados = {


nome:

document.getElementById("nome").value.trim(),



whatsapp:

document.getElementById("whatsapp").value.trim(),



idade:

document.getElementById("idade").value.trim(),



modalidade:

document.getElementById("modalidade").value,



queixa:

document.getElementById("queixa").value.trim(),



status:

"Aguardando",



maca:

"",



criadoEm:

Timestamp.now()



};






if(!dados.nome){


alert("Digite o nome do paciente.");

return;


}







try{



const paciente = await addDoc(

collection(db,"pacientes"),

dados

);





console.log(

"Paciente criado:",

paciente.id

);






alert(

"Paciente cadastrado com sucesso!"

);







// GERAR QR CODE



const link =

"https://ladrffamp.github.io/ladrf-connect/acompanhamento.html?id="

+

paciente.id;






if(qrArea){


qrArea.innerHTML="";



new QRCode(

qrArea,

{

text:link,

width:200,

height:200

}

);


}






// MOSTRAR BOTÃO NOVO CADASTRO


const botao = document.getElementById("btnNovoCadastro");



if(botao){


botao.style.display="inline-flex";


}





}catch(error){



console.error(error);



alert(

"Erro ao cadastrar: "

+

error.message

);



}



});


}








// =====================================
// NOVO CADASTRO
// =====================================


window.novoCadastro = function(){



const formulario = document.getElementById("formCadastro");



if(formulario){


formulario.reset();


}




if(qrArea){


qrArea.innerHTML="";


}




const modalidade = document.getElementById("modalidade");


if(modalidade){


modalidade.value="";


}





document.getElementById("nome")?.focus();




alert(

"Novo cadastro iniciado."

);



};
