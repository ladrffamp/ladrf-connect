import { db, auth } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const lista = document.getElementById("listaEscalas");



// =====================================
// CARREGAR ESCALAS
// =====================================

async function carregarEscalas(uid){


if(!lista) return;



lista.innerHTML = `
<div style="text-align:center">
<i class="fa-solid fa-spinner fa-spin"></i>
Carregando escalas...
</div>
`;



try{


const agenda = await getDocs(

collection(
db,
"agenda"
)

);



lista.innerHTML = "";

let encontrou = false;



for(const acaoDoc of agenda.docs){


const dadosAcao = acaoDoc.data();



const participantes = await getDocs(

collection(
db,
"agenda",
acaoDoc.id,
"participantes"
)

);



const meuRegistro = participantes.docs.find(

(item)=>item.id === uid

);



if(meuRegistro){


encontrou = true;


const dadosParticipante =
meuRegistro.data();



lista.innerHTML += `


<div class="card">


<h2>

<i class="fa-solid fa-calendar-check"></i>

${dadosAcao.titulo || "Ação"}

</h2>



<p>

📅 Data:

<b>

${dadosAcao.data || "-"}

</b>

</p>



<p>

📍 Local:

<b>

${dadosAcao.local || "-"}

</b>

</p>



<p>

⏰ Horário:

<b>

${dadosAcao.inicio || "-"}

até

${dadosAcao.fim || "-"}

</b>

</p>



<p>

Status:

<b>

${dadosParticipante.presenca || "Pendente"}

</b>

</p>



<button

class="btn-success"

onclick="confirmarPresenca('${acaoDoc.id}')"

>

✅ Confirmar presença

</button>



<button

class="btn-danger"

onclick="recusarPresenca('${acaoDoc.id}')"

>

❌ Não poderei comparecer

</button>



</div>


`;



}



}



if(!encontrou){


lista.innerHTML = `

<div class="card">

<h3>
Nenhuma escala encontrada.
</h3>

<p>
Você ainda não possui ações atribuídas.
</p>

</div>

`;

}



}catch(error){


console.error(
"Erro ao carregar escalas:",
error
);


lista.innerHTML =
"Erro ao carregar escalas.";


}



}




// =====================================
// CONFIRMAR
// =====================================


window.confirmarPresenca = async function(id){


const usuario = auth.currentUser;


if(!usuario) return;



await updateDoc(

doc(

db,

"agenda",

id,

"participantes",

usuario.uid

),

{

presenca:"Confirmado"

}

);



alert(
"Presença confirmada!"
);



carregarEscalas(usuario.uid);


};





// =====================================
// RECUSAR
// =====================================


window.recusarPresenca = async function(id){


const usuario = auth.currentUser;


if(!usuario) return;



await updateDoc(

doc(

db,

"agenda",

id,

"participantes",

usuario.uid

),

{

presenca:"Recusado"

}

);



alert(
"Resposta enviada!"
);



carregarEscalas(usuario.uid);


};





// =====================================
// LOGIN
// =====================================


onAuthStateChanged(

auth,

(usuario)=>{


if(usuario){


carregarEscalas(
usuario.uid
);


}else{


lista.innerHTML =
"Usuário não logado.";


}


});
