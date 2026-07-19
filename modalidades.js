import { db } from "./firebase.js";

import {
collection,
addDoc,
onSnapshot,
deleteDoc,
doc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const modalidadesRef = collection(db,"modalidades");


const nomeModalidade = document.getElementById("nomeModalidade");

const salvarModalidade = document.getElementById("salvarModalidade");

const listaModalidades = document.getElementById("listaModalidades");



let modalidadeEditando = null;




// ===============================
// SALVAR / EDITAR
// ===============================


salvarModalidade.onclick = async()=>{


const nome = nomeModalidade.value.trim();



if(nome===""){

alert("Digite uma modalidade");

return;

}



try{


if(modalidadeEditando){



await updateDoc(

doc(db,"modalidades",modalidadeEditando),

{

nome:nome

}

);



modalidadeEditando=null;



}

else{



await addDoc(

modalidadesRef,

{

nome:nome,

criadoEm:new Date()

}

);


}



nomeModalidade.value="";



alert("Modalidade salva com sucesso!");



}

catch(erro){


console.log(erro);

alert("Erro ao salvar modalidade");


}



};





// ===============================
// LISTAR MODALIDADES
// ===============================


onSnapshot(

modalidadesRef,

(snapshot)=>{


listaModalidades.innerHTML="";



snapshot.forEach((item)=>{



const dados=item.data();



listaModalidades.innerHTML += `


<tr>


<td>

${dados.nome}

</td>



<td>


<button onclick="editarModalidade('${item.id}','${dados.nome}')">

Editar

</button>



<button onclick="excluirModalidade('${item.id}')">

Excluir

</button>


</td>


</tr>


`;



});


}



);






// ===============================
// EDITAR
// ===============================


window.editarModalidade=(id,nome)=>{


nomeModalidade.value=nome;


modalidadeEditando=id;



};






// ===============================
// EXCLUIR
// ===============================


window.excluirModalidade=async(id)=>{


const confirmar = confirm(
"Deseja excluir esta modalidade?"
);



if(!confirmar){

return;

}



await deleteDoc(

doc(db,"modalidades",id)

);



};
