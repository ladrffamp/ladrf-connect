import { db, auth } from "./firebase.js";

import {

collection,
query,
where,
onSnapshot,
addDoc,
Timestamp,
doc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let pacienteAtual = null;


const nome =
document.getElementById("nome");


const dados =
document.getElementById("dados");




// Buscar paciente em atendimento

const consulta = query(

collection(db,"pacientes"),

where("status","==","Em atendimento")

);



onSnapshot(consulta,(snapshot)=>{


if(snapshot.empty){

nome.innerHTML="Nenhum paciente em atendimento";

dados.innerHTML="";

return;

}



snapshot.forEach((documento)=>{


pacienteAtual={

id:documento.id,

...documento.data()

};



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






// Salvar atendimento

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





const atendimento = {


pacienteId:

pacienteAtual.id,


paciente:

pacienteAtual.nome,


modalidade:

pacienteAtual.modalidade || "",


queixa:

pacienteAtual.queixa || "",


maca:

pacienteAtual.maca,


observacoes,


conduta,


membro,


data:

Timestamp.now()


};




// Criar atendimento e pegar ID

const atendimentoRef = await addDoc(

collection(db,"atendimentos"),

atendimento

);





const idAtendimento = atendimentoRef.id;



// Link da avaliação

const link =

`${window.location.origin}/ladrf-connect/avaliacao.html?id=${idAtendimento}`;




// Mostrar QR Code

const qr =

document.getElementById("qrcode");



if(qr){


qr.innerHTML = "";


new QRCode(qr,{

text:link,

width:180,

height:180

});


}




alert(

"Atendimento salvo! QR Code de avaliação gerado."

);



document.getElementById("observacoes").value="";

document.getElementById("conduta").value="";



}
