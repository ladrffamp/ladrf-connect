import { db } from "./firebase.js";


import {

doc,
getDoc,
collection,
getDocs,
updateDoc,
serverTimestamp

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const idAcao =

new URLSearchParams(window.location.search)

.get("id");





const nomeAcao =

document.getElementById("nomeAcao");



const dadosAcao =

document.getElementById("dadosAcao");



const listaParticipantes =

document.getElementById("listaParticipantes");



const finalizar =

document.getElementById("finalizar");







async function carregar(){



const acao = await getDoc(

doc(

db,

"agenda",

idAcao

)

);




if(!acao.exists()){

nomeAcao.innerHTML =

"Ação não encontrada";

return;

}




const dados = acao.data();



nomeAcao.innerHTML =

dados.titulo;



dadosAcao.innerHTML = `

<p>
📅 ${dados.data}
</p>

<p>
📍 ${dados.local}
</p>

<p>
⏰ ${dados.inicio} até ${dados.fim}
</p>

<p>
Status:
<b>${dados.status}</b>
</p>

`;





const participantes = await getDocs(

collection(

db,

"agenda",

idAcao,

"participantes"

)

);




listaParticipantes.innerHTML = "";




if(participantes.empty){


listaParticipantes.innerHTML =

"Nenhum membro escalado.";

return;


}





participantes.forEach((item)=>{



const membro = item.data();



let status =

"🟡 Pendente";



if(membro.presenca === "Confirmado"){

status =

"🟢 Confirmado";

}


if(membro.presenca === "Recusado"){

status =

"🔴 Recusado";

}





listaParticipantes.innerHTML += `


<div class="card">


<h3>

${membro.nome}

</h3>


<p>

${membro.email}

</p>


<strong>

${status}

</strong>


</div>


`;



});



}








finalizar.addEventListener(

"click",

async()=>{


const confirmar = confirm(

"Deseja finalizar esta ação?"

);



if(!confirmar){

return;

}



await updateDoc(

doc(

db,

"agenda",

idAcao

),

{


status:

"Concluído",


finalizadoEm:

serverTimestamp()


}

);



alert(

"Ação finalizada!"

);



carregar();


});







carregar();
