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



snapshot.forEach((doc)=>{


pacienteAtual={

id:doc.id,

...doc.data()

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

alert("Nenhum paciente em atendimento");

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

pacienteAtual.modalidade || "",


queixa:

pacienteAtual.queixa || "",


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




alert("Atendimento salvo!");



document.getElementById("observacoes").value="";

document.getElementById("conduta").value="";


}
