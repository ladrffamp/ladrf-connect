import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
doc,
deleteDoc,
updateDoc,
Timestamp,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lista = document.getElementById("listaMembros");

let idEdicao = null;

const membrosRef = collection(db, "membros");

carregarMembros();

function carregarMembros(){

onSnapshot(membrosRef,(snapshot)=>{

lista.innerHTML="";

snapshot.forEach((documento)=>{

const membro = documento.data();

lista.innerHTML += `

<tr>

<td>${membro.nome}</td>

<td>${membro.funcao}</td>

<td>${membro.status}</td>

<td>

<div class="acao">

<button class="editar"
onclick="editarMembro('${documento.id}')">

Editar

</button>

<button class="excluir"
onclick="excluirMembro('${documento.id}')">

Excluir

</button>

</div>

</td>

</tr>

`;

});

});

}

window.salvarMembro = async function(){

const nome = document.getElementById("nome").value.trim();

const email = document.getElementById("email").value.trim();

const telefone = document.getElementById("telefone").value.trim();

const curso = document.getElementById("curso").value.trim();

const periodo = document.getElementById("periodo").value.trim();

const funcao = document.getElementById("funcao").value;

const status = document.getElementById("status").value;

if(nome===""){

alert("Informe o nome.");

return;

}

const dados = {

nome,
email,
telefone,
curso,
periodo,
funcao,
status,
dataCadastro: Timestamp.now()

};
  if(idEdicao){

await updateDoc(

doc(db,"membros",idEdicao),

dados

);

alert("Membro atualizado com sucesso!");

idEdicao = null;

}else{

await addDoc(

membrosRef,

dados

);

alert("Membro cadastrado com sucesso!");

}

document.getElementById("nome").value="";

document.getElementById("email").value="";

document.getElementById("telefone").value="";

document.getElementById("curso").value="";

document.getElementById("periodo").value="";

document.getElementById("funcao").selectedIndex=0;

document.getElementById("status").selectedIndex=0;

}



window.editarMembro = async function(id){

const consulta = await getDocs(membrosRef);

consulta.forEach((documento)=>{

if(documento.id===id){

const membro=documento.data();

document.getElementById("nome").value=membro.nome;

document.getElementById("email").value=membro.email;

document.getElementById("telefone").value=membro.telefone;

document.getElementById("curso").value=membro.curso;

document.getElementById("periodo").value=membro.periodo;

document.getElementById("funcao").value=membro.funcao;

document.getElementById("status").value=membro.status;

idEdicao=id;

}

});

}
window.excluirMembro = async function(id){

const confirmar = confirm(
"Deseja realmente excluir este membro?"
);

if(!confirmar){

return;

}

try{

await deleteDoc(

doc(db,"membros",id)

);

alert("Membro excluído com sucesso!");

}catch(erro){

console.error(erro);

alert("Erro ao excluir o membro.");

}

}
