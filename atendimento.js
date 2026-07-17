import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
addDoc,
Timestamp,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let pacienteAtual = null;


const nome = document.getElementById("nome");
const dados = document.getElementById("dados");



// ===============================
// CARREGAR PACIENTE EM ATENDIMENTO
// ===============================

async function carregarPaciente(){


console.log("Carregando paciente...");



const busca = query(

collection(db,"pacientes"),

where("status","==","Em atendimento")

);



const resultado = await getDocs(busca);



if(resultado.empty){


nome.innerHTML =
"Nenhum paciente em atendimento";


dados.innerHTML="";


return;


}



resultado.forEach((item)=>{


pacienteAtual={

id:item.id,

...item.data()

};


});



nome.innerHTML =
pacienteAtual.nome;



dados.innerHTML = `

Modalidade:
<b>${pacienteAtual.modalidade || "-"}</b>

<br><br>

Queixa:
<b>${pacienteAtual.queixa || "-"}</b>

<br><br>

Maca:
<b>${pacienteAtual.maca || "-"}</b>

`;



console.log(
"Paciente:",
pacienteAtual
);


}



carregarPaciente();






// ===============================
// LIBERAR MACA
// ===============================

async function liberarMaca(numero){


if(!numero)
return;



const macas =
await getDocs(collection(db,"macas"));



for(const item of macas.docs){


const dadosMaca =
item.data();



if(
String(dadosMaca.numero) === String(numero)
){


await updateDoc(

doc(db,"macas",item.id),

{

status:"Livre",

paciente:""

}

);


}



}



}







// ===============================
// FINALIZAR ATENDIMENTO
// ===============================

window.salvarAtendimento = async function(){


console.log("Finalizando...");



if(!pacienteAtual){


alert(
"Nenhum paciente em atendimento"
);


return;


}



const conduta =
document.getElementById("conduta").value;



const observacoes =
document.getElementById("observacoes").value;



try{



const atendimento =
await addDoc(

collection(db,"atendimentos"),

{


pacienteId:
pacienteAtual.id,


paciente:
pacienteAtual.nome,


modalidade:
pacienteAtual.modalidade || "",


queixa:
pacienteAtual.queixa || "",


maca:
pacienteAtual.maca || "",


conduta,


observacoes,


data:
Timestamp.now()


}

);




console.log(
"Atendimento criado:",
atendimento.id
);






await updateDoc(

doc(db,"pacientes",pacienteAtual.id),

{

status:"Finalizado"

}

);





await liberarMaca(
pacienteAtual.maca
);






// ===============================
// GERAR QR CODE
// ===============================


const areaQR =
document.getElementById("qrcode");



if(!areaQR){


alert(
"Elemento qrcode não encontrado no HTML"
);


return;


}




if(typeof QRCode === "undefined"){


alert(
"Biblioteca QRCode não carregou"
);


return;


}




const link =

"https://ladrffamp.github.io/ladrf-connect/avaliacao.html?id="

+

atendimento.id;




console.log(
"Link QR:",
link
);



areaQR.innerHTML="";



new QRCode(

areaQR,

{

text:link,

width:200,

height:200

}

);





alert(
"Atendimento finalizado. QR Code gerado!"
);



}catch(erro){


console.error(
erro
);


alert(
"Erro: "+erro.message
);


}



};
