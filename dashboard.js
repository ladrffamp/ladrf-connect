import { db } from "./firebase.js";

import {

collection,
query,
where,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// Elementos do painel

const aguardando =
document.getElementById("aguardando");

const atendimento =
document.getElementById("atendimento");

const livres =
document.getElementById("livres");

const ocupadas =
document.getElementById("ocupadas");

const listaAtendimento =
document.getElementById("listaAtendimento");





// ===============================
// PACIENTES AGUARDANDO
// ===============================


const filaQuery = query(

collection(db,"pacientes"),

where("status","==","Aguardando")

);



onSnapshot(filaQuery,(snapshot)=>{


aguardando.innerHTML =
snapshot.size;


});






// ===============================
// PACIENTES EM ATENDIMENTO
// ===============================


const atendimentoQuery = query(

collection(db,"pacientes"),

where("status","==","Em atendimento")

);



onSnapshot(atendimentoQuery,(snapshot)=>{


atendimento.innerHTML =
snapshot.size;



listaAtendimento.innerHTML="";



if(snapshot.empty){


listaAtendimento.innerHTML=`

<tr>

<td colspan="3">

Nenhum paciente em atendimento

</td>

</tr>

`;

return;

}





snapshot.forEach((item)=>{


const paciente=item.data();



listaAtendimento.innerHTML += `

<tr>

<td>

${paciente.nome || "-"}

</td>


<td>

${paciente.maca || "-"}

</td>


<td>

${paciente.modalidade || "-"}

</td>


</tr>

`;



});



});







// ===============================
// MACAS
// ===============================


const macasQuery = collection(db,"macas");



onSnapshot(macasQuery,(snapshot)=>{


let livresTotal=0;

let ocupadasTotal=0;



snapshot.forEach((item)=>{


const maca=item.data();



if(maca.status==="Livre"){

livresTotal++;

}


if(maca.status==="Ocupada"){

ocupadasTotal++;

}



});



livres.innerHTML =
livresTotal;


ocupadas.innerHTML =
ocupadasTotal;



});
