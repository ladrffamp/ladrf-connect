// controle-acao.js


import { db } from "./firebase.js";


import {

doc,
getDoc,
collection,
getDocs,
updateDoc,
setDoc,
serverTimestamp

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// =====================================
// ID DA AÇÃO
// =====================================


const idAcao =

new URLSearchParams(window.location.search)

.get("id");





if(!idAcao){


alert("Ação não encontrada.");

throw new Error("ID da ação ausente");


}






// =====================================
// ELEMENTOS
// =====================================


const nomeAcao =

document.getElementById("nomeAcao");



const dadosAcao =

document.getElementById("dadosAcao");



const listaParticipantes =

document.getElementById("listaParticipantes");



const finalizar =

document.getElementById("finalizar");








// =====================================
// CARREGAR AÇÃO
// =====================================


async function carregar(){


try{


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

`

${dados.titulo}

`;






dadosAcao.innerHTML =

`

<p>

📅 ${dados.data || "-"}

</p>


<p>

📍 ${dados.local || "-"}

</p>


<p>

⏰ ${dados.inicio || "-"} até ${dados.fim || "-"}

</p>


<p>

👤 Responsável:

${dados.responsavel || "-"}

</p>


<p>

📌 Tipo:

${dados.tipo || "-"}

</p>


<p>

Status:

<b>

${dados.status || "-"}

</b>

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





let status = "🟡 Pendente";



if(membro.presenca === "Confirmado"){


status = "🟢 Confirmado";


}



if(membro.presenca === "Recusado"){


status = "🔴 Recusado";


}






listaParticipantes.innerHTML +=


`

<div class="card">


<h3>

${membro.nome || "Sem nome"}

</h3>


<p>

${membro.email || ""}

</p>


<strong>

${status}

</strong>


</div>


`;



});






}catch(error){


console.error(

"Erro ao carregar ação:",

error

);



}



}








// =====================================
// FINALIZAR AÇÃO + FREQUÊNCIA
// =====================================


if(finalizar){



finalizar.addEventListener(

"click",

async()=>{



const confirmar = confirm(

"Deseja finalizar esta ação e lançar a frequência?"

);





if(!confirmar){


return;


}







try{





const participantes = await getDocs(

collection(

db,

"agenda",

idAcao,

"participantes"

)

);







const presentes = [];






participantes.forEach((item)=>{



const membro = item.data();





if(membro.presenca === "Confirmado"){



presentes.push({


uid:item.id,


nome:membro.nome,


email:membro.email


});



}



});








if(presentes.length === 0){


alert(

"Nenhum membro confirmou presença."

);


return;


}








// =====================================
// SALVAR FREQUÊNCIA
// =====================================


await setDoc(

doc(

db,

"frequencia",

idAcao

),

{


acaoId:idAcao,


presentes:presentes,


totalPresentes:presentes.length,


status:"Finalizado",


criadoEm:serverTimestamp()


}

);








// =====================================
// ATUALIZAR STATUS DA AÇÃO
// =====================================


await updateDoc(

doc(

db,

"agenda",

idAcao

),

{


status:"Concluído",


finalizadoEm:serverTimestamp()


}

);







alert(

"Ação finalizada e frequência registrada!"

);






carregar();





}catch(error){



console.error(

"Erro ao finalizar ação:",

error

);



alert(

"Erro ao finalizar ação."

);



}



});



}







// =====================================
// INICIAR
// =====================================


carregar();
