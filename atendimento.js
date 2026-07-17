import { db, auth } from "./firebase.js";

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




// Buscar paciente em atendimento

async function carregarPaciente(){


const consulta = query(

collection(db,"pacientes"),

where("status","==","Em atendimento")

);



const resultado = await getDocs(consulta);



if(resultado.empty){


nome.innerHTML="Nenhum paciente em atendimento";

dados.innerHTML="";

return;


}



resultado.forEach((item)=>{


pacienteAtual={

id:item.id,

...item.data()

};


});



nome.innerHTML = pacienteAtual.nome;



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



}



carregarPaciente();







// Liberar maca

async function liberarMaca(numero){


if(!numero){

return;

}



const macas = await getDocs(

collection(db,"macas")

);



for(const item of macas.docs){


const maca=item.data();



if(String(maca.numero) === String(numero)){


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








// Finalizar atendimento

window.salvarAtendimento = async function(){



if(!pacienteAtual){


alert("Nenhum paciente em atendimento.");

return;

}




const conduta =
document.getElementById("conduta").value;



const observacoes =
document.getElementById("observacoes").value;





try{



const atendimento = await addDoc(

collection(db,"atendimentos"),

{


pacienteId:pacienteAtual.id,


paciente:pacienteAtual.nome,


modalidade:pacienteAtual.modalidade || "",


queixa:pacienteAtual.queixa || "",


maca:pacienteAtual.maca || "",


conduta,


observacoes,


data:Timestamp.now()


}

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







// GERAR QR CODE


const qr = document.getElementById("qrcode");



if(!qr){


alert("Área do QR Code não encontrada.");

return;

}




qr.innerHTML="";




const link =

"https://ladrffamp.github.io/ladrf-connect/avaliacao.html?id="

+

atendimento.id;





if(typeof QRCode === "undefined"){


alert("Biblioteca QR Code não carregada.");

return;

}




new QRCode(qr,{

text:link,

width:200,

height:200

});





alert(

"Atendimento finalizado e QR Code criado!"

);



}catch(error){


console.error(error);


alert(

"Erro ao finalizar atendimento: "

+

error.message

);


}



};
