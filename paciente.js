import { db } from "./firebase.js";

import {
collection,
query,
where,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const nome = document.getElementById("nome");
const status = document.getElementById("status");
const maca = document.getElementById("maca");


// Pega o código vindo do QR Code

const parametros = new URLSearchParams(window.location.search);

const codigo = parametros.get("codigo");


if(!codigo){

nome.innerHTML="Código inválido";

status.innerHTML="";

}


// Procura o paciente pelo código

const buscaPaciente = query(

collection(db,"pacientes"),

where("codigoAtendimento","==",codigo)

);



onSnapshot(buscaPaciente,(snapshot)=>{


if(snapshot.empty){

nome.innerHTML="Paciente não encontrado";

status.innerHTML="";

return;

}



snapshot.forEach((documento)=>{


const paciente=documento.data();



nome.innerHTML=paciente.nome;



if(paciente.status==="Aguardando"){

status.innerHTML="🟡 Aguardando atendimento";

}



if(paciente.status==="Em atendimento"){

status.innerHTML="🟢 Em atendimento";

maca.innerHTML="Maca: "+paciente.maca;

}



if(paciente.status==="Finalizado"){

status.innerHTML="✅ Atendimento finalizado";

}



});

});
