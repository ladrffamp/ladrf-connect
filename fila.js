import { db } from "./firebase.js";

import {

collection,
query,
where,
onSnapshot,
getDocs,
doc,
updateDoc,
orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const lista = document.getElementById("lista");




// Mostrar fila

const filaQuery = query(

collection(db,"pacientes"),

where("status","==","Aguardando")

);



onSnapshot(filaQuery,(snapshot)=>{


lista.innerHTML="";



if(snapshot.empty){

lista.innerHTML=`

<tr>

<td colspan="5">

Nenhum paciente aguardando

</td>

</tr>

`;

return;

}





snapshot.forEach((item)=>{


const paciente = item.data();



lista.innerHTML += `

<tr>

<td>

${paciente.nome || "-"}

</td>


<td>

${paciente.modalidade || "-"}

</td>


<td>

${paciente.status}

</td>


<td>

${paciente.maca || "-"}

</td>


<td>

<button class="chamar"

onclick="chamarPaciente('${item.id}')">

Chamar

</button>

</td>


</tr>

`;



});


});









// Encontrar maca livre

async function encontrarMacaLivre(){



const macas = await getDocs(

collection(db,"macas")

);



let macaLivre = null;



macas.forEach((item)=>{


const maca = item.data();



if(

maca.status === "Livre"

&& macaLivre === null

){

macaLivre={

id:item.id,

numero:maca.numero

};


}



});



return macaLivre;


}









// Chamar próximo automaticamente

window.chamarProximo = async function(){



const pacientes = await getDocs(

query(

collection(db,"pacientes"),

where("status","==","Aguardando")

)

);




if(pacientes.empty){

alert("Não existem pacientes aguardando.");

return;

}




let primeiro = null;



pacientes.forEach((item)=>{


if(!primeiro){

primeiro={

id:item.id,

...item.data()

};

}


});






await chamarPaciente(

primeiro.id

);



}









// Chamar paciente específico

window.chamarPaciente = async function(idPaciente){



const maca = await encontrarMacaLivre();



if(!maca){


alert(

"Não existe maca livre."

);


return;

}






// atualizar paciente


await updateDoc(

doc(db,"pacientes",idPaciente),

{


status:"Em atendimento",

maca:maca.numero


}

);








// atualizar maca


await updateDoc(

doc(db,"macas",maca.id),

{


status:"Ocupada",

paciente:idPaciente


}

);






alert(

"Paciente chamado para a maca " + maca.numero

);



};
