import { db, auth } from "./firebase.js";


import {

collection,
query,
where,
onSnapshot,
addDoc,
Timestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let pacienteAtual = null;



const nome =
document.getElementById("nome");


const dados =
document.getElementById("dados");


const semPaciente =
document.getElementById("semPaciente");





// Buscar paciente em atendimento


const busca = query(

collection(db,"pacientes"),

where("status","==","Em atendimento")

);



onSnapshot(busca,(snapshot)=>{


if(snapshot.empty){


document.getElementById("pacienteArea").style.display="none";

semPaciente.style.display="block";


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
<b>${pacienteAtual.maca}</b>

`;



});



});







window.salvarAtendimento = async function(){



if(!pacienteAtual){


alert("Nenhum paciente selecionado.");

return;


}



const observacoes =

document.getElementById("observacoes").value;



const conduta =

document.getElementById("conduta").value;





await addDoc(

collection(db,"atendimentos"),

{


pacienteId:

pacienteAtual.id,


paciente:

pacienteAtual.nome,


modalidade:

pacienteAtual.modalidade,


queixa:

pacienteAtual.queixa,


maca:

pacienteAtual.maca,


observacoes:

observacoes,


conduta:

conduta,


membro:

auth.currentUser.email,


data:

Timestamp.now()


}

);




alert(

"Atendimento salvo com sucesso!"

);



document.getElementById("observacoes").value="";

document.getElementById("conduta").value="";



}
