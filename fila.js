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




// Buscar fila

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




let pacientes = [];



snapshot.forEach((item)=>{


pacientes.push({

id:item.id,

...item.data()

});


});




// ordenar pelo horário quando existir

pacientes.sort((a,b)=>{


if(!a.horarioCadastro){

return 1;

}


if(!b.horarioCadastro){

return -1;

}


return a.horarioCadastro.seconds - b.horarioCadastro.seconds;


});







pacientes.forEach((paciente)=>{


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

onclick="chamarPaciente('${paciente.id}')">

Chamar

</button>


</td>


</tr>

`;



});



});










async function encontrarMacaLivre(){


const macas = await getDocs(

collection(db,"macas")

);



let livre = null;



macas.forEach((item)=>{


const maca = item.data();



if(

maca.status === "Livre"

&& !livre

){


livre={

id:item.id,

numero:maca.numero

};


}



});



return livre;


}







window.chamarProximo = async function(){



const pacientes = await getDocs(

query(

collection(db,"pacientes"),

where("status","==","Aguardando")

)

);



if(pacientes.empty){

alert("Nenhum paciente aguardando.");

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



await chamarPaciente(primeiro.id);



};








window.chamarPaciente = async function(idPaciente){



const maca = await encontrarMacaLivre();



if(!maca){


alert("Nenhuma maca livre.");

return;

}



await updateDoc(

doc(db,"pacientes",idPaciente),

{

status:"Em atendimento",

maca:maca.numero

}

);





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
