import { db, auth } from "./firebase.js";

import {
collection,
query,
where,
onSnapshot,
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

const consulta = query(
collection(db,"pacientes"),
where("status","==","Em atendimento")
);



onSnapshot(consulta,(snapshot)=>{


if(snapshot.empty){

nome.innerHTML="Nenhum paciente em atendimento";

dados.innerHTML="";

pacienteAtual=null;

return;

}



snapshot.forEach((item)=>{


pacienteAtual={

id:item.id,

...item.data()

};



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



});


});





// Buscar nome do membro logado

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

async function liberarMaca(numeroMaca){


if(!numeroMaca){

return;

}



const listaMacas = await getDocs(

collection(db,"macas")

);



listaMacas.forEach(async(item)=>{


const maca = item.data();



if(Number(maca.numero) === Number(numeroMaca)){


await updateDoc(

doc(db,"macas",item.id),

{


paciente:"",

status:"Livre"

}

);


}



});


}







// Finalizar atendimento

window.salvarAtendimento = async function(){



if(!pacienteAtual){

alert("Nenhum paciente em atendimento");

return;

}




const observacoes =

document.getElementById("observacoes").value;



const conduta =

document.getElementById("conduta").value;



const membro = await buscarMembro();






// Salvar atendimento

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


observacoes,


conduta,


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







// Criar QR Code da avaliação


const link =

`${window.location.origin}/ladrf-connect/avaliacao.html?id=${atendimentoCriado.id}`;



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

"Atendimento finalizado! Maca liberada e QR Code gerado."

);





document.getElementById("observacoes").value="";

document.getElementById("conduta").value="";



};
