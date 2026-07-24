// gerenciar-acao.js


import { db } from "./firebase.js";


import {
doc,
getDoc,
collection,
getDocs,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =====================================
// ID DA AÇÃO
// =====================================


const idAcao =
new URLSearchParams(window.location.search)
.get("id");



console.log(
"ID AÇÃO:",
idAcao
);



if(!idAcao){

alert(
"Ação não encontrada."
);

throw new Error(
"ID ausente"
);

}






// =====================================
// ELEMENTOS
// =====================================


const nomeAcao =
document.getElementById("nomeAcao");


const listaMembros =
document.getElementById("listaMembros");


const botaoSalvar =
document.getElementById("salvar");







// =====================================
// CARREGAR AÇÃO
// =====================================


async function carregarAcao(){


const referencia =
doc(
db,
"agenda",
idAcao
);



const resultado =
await getDoc(
referencia
);



if(resultado.exists()){


const dados =
resultado.data();



nomeAcao.innerHTML = `

${dados.titulo || "Sem título"}

<br>

<small>

📅 ${dados.data || "-"}

<br>

📍 ${dados.local || "-"}

<br>

⏰ ${dados.inicio || "-"} até ${dados.fim || "-"}

</small>

`;



}else{


nomeAcao.innerHTML =
"Ação não encontrada";


}



}








// =====================================
// CARREGAR MEMBROS E ESCALADOS
// =====================================


async function carregarMembros(){


try{


const usuarios =
await getDocs(

collection(
db,
"usuarios"
)

);





const participantes =
await getDocs(

collection(

db,

"agenda",

idAcao,

"participantes"

)

);





const escalados = {};



participantes.forEach((item)=>{


escalados[item.id] =
item.data();


});







listaMembros.innerHTML = "";






usuarios.forEach((usuario)=>{


const dados =
usuario.data();



if(
dados.perfil?.toLowerCase()
===
"membro"
){



const escalado =
escalados[usuario.id];




listaMembros.innerHTML += `


<div class="card" style="margin-bottom:10px;">



<label style="
display:flex;
align-items:center;
gap:10px;
cursor:pointer;
">



<input

type="checkbox"

class="membro"

value="${usuario.id}"

data-nome="${dados.nome || ""}"

data-email="${dados.email || ""}"

${escalado ? "checked" : ""}

>



<div>


<strong>

${dados.nome || "Sem nome"}

</strong>


<br>


<small>

${dados.email || ""}

</small>



${
escalado
?

`

<br>

<span>

Status:

${

escalado.presenca === "Confirmado"

?

"🟢 Confirmado"

:

escalado.presenca === "Recusado"

?

"🔴 Recusado"

:

"🟡 Pendente"

}

</span>

`

:

""

}



</div>



</label>



</div>



`;



}



});





}catch(error){


console.error(
"Erro ao carregar membros:",
error
);


}



}









// =====================================
// SALVAR ESCALA
// =====================================


botaoSalvar.addEventListener(

"click",

async()=>{



const selecionados =
document.querySelectorAll(
".membro:checked"
);





if(selecionados.length===0){


alert(
"Selecione pelo menos um membro."
);


return;


}





try{


for(const membro of selecionados){



await setDoc(

doc(

db,

"agenda",

idAcao,

"participantes",

membro.value

),


{


nome:
membro.dataset.nome,


email:
membro.dataset.email,


presenca:
"Pendente",


escaladoEm:
serverTimestamp()


},


{

merge:true

}


);



}





alert(
"Escala salva com sucesso!"
);



carregarMembros();



}catch(error){


console.error(
"Erro ao salvar:",
error
);


alert(
"Erro ao salvar escala."
);



}



});








// =====================================
// INICIAR
// =====================================


carregarAcao();

carregarMembros();
