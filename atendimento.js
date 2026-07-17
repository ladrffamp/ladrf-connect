import { db, auth } from "./firebase.js";

import {

collection,
addDoc,
Timestamp,
doc,
getDoc,
getDocs,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let pacienteAtual = null;



const nome = document.getElementById("nome");

const dados = document.getElementById("dados");





// Buscar paciente em atendimento

const pacientesRef = collection(db,"pacientes");



const consulta = await getDocs(pacientesRef);



consulta.forEach((item)=>{


const paciente = item.data();



if(paciente.status === "Em atendimento"){


pacienteAtual={

id:item.id,

...paciente

};


}


});






if(pacienteAtual){


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



}else{


nome.innerHTML="Nenhum paciente em atendimento";


dados.innerHTML="";

}





// Buscar membro logado

async function buscarMembro(){


const usuario = auth.currentUser;



if(!usuario){

return "Não informado";

}



const usuarioRef = doc(

db,

"usuarios",

usuario.uid

);



const usuarioDoc = await getDoc(usuarioRef);



if(usuarioDoc.exists()){


return usuarioDoc.data().nome || usuario.email;


}



return usuario.email;



}








// Liberar maca

async function liberarMaca(numero){



if(!numero){

return;

}



const macas = await getDocs(

collection(db,"macas")

);



macas.forEach(async(item)=>{


const maca=item.data();



if(Number(maca.numero) === Number(numero)){



await updateDoc(

doc(db,"macas",item.id),

{


status:"Livre",

paciente:""


}

);



}



});



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



const membro = await buscarMembro();





try{



// Criar atendimento


const atendimentoCriado = await addDoc(

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


membro,


data:

Timestamp.now()


}

);






// Atualizar paciente


await updateDoc(

doc(db,"pacientes",pacienteAtual.id),

{


status:"Finalizado"


}

);






// Liberar maca


await liberarMaca(

pacienteAtual.maca

);







// Gerar QR Code


const link =

`https://ladrffamp.github.io/ladrf-connect/avaliacao.html?id=${atendimentoCriado.id}`;





const qr = document.getElementById("qrcode");



if(qr){


qr.innerHTML="";



new QRCode(qr,{


text:link,


width:200,


height:200


});


}







alert(

"Atendimento finalizado! QR Code gerado."

);



}catch(error){


console.error(error);


alert(

"Erro ao finalizar atendimento."

);


}



};
