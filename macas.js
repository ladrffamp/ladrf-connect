import { db } from "./firebase.js";

import {
collection,
onSnapshot,
doc,
updateDoc,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const area = document.getElementById("macas");


let listaMacas = [];



// Carregar macas

onSnapshot(collection(db,"macas"),(snapshot)=>{


listaMacas=[];


snapshot.forEach((documento)=>{


listaMacas.push({

id: documento.id,

...documento.data()

});


});


mostrarMacas();


});





function mostrarMacas(){


area.innerHTML="";



listaMacas.forEach((maca)=>{


if(maca.status==="Ocupada"){


area.innerHTML += `


<div class="maca ocupada">


<h2>
Maca ${maca.numero}
</h2>


<h3>
🔴 Ocupada
</h3>


<p>
Paciente:
<br>
<b>${maca.paciente}</b>
</p>


<button onclick="finalizarAtendimento('${maca.id}','${maca.paciente}')">

Finalizar Atendimento

</button>


</div>


`;



}else{


area.innerHTML += `


<div class="maca livre">


<h2>
Maca ${maca.numero}
</h2>


<h3>
🟢 Livre
</h3>


<p>
Disponível
</p>


</div>


`;

}


});


}





window.finalizarAtendimento = async function(idMaca,nomePaciente){



// libera a maca

await updateDoc(

doc(db,"macas",idMaca),

{

status:"Livre",

paciente:""

}

);



// finaliza paciente

const buscaPaciente = query(

collection(db,"pacientes"),

where("nome","==",nomePaciente)

);



const resultado = await getDocs(buscaPaciente);



resultado.forEach(async(documento)=>{


await updateDoc(

doc(db,"pacientes",documento.id),

{

status:"Finalizado"

}

);


});



alert("Atendimento finalizado com sucesso!");



}
