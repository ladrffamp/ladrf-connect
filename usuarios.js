import {
db,
authSecundario
} from "./firebase.js";

import {

collection,

onSnapshot,

doc,

updateDoc,

deleteDoc,

setDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

createUserWithEmailAndPassword

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ELEMENTOS

const lista = document.getElementById("listaUsuarios");

const botaoCadastro = document.getElementById("btnCadastrarUsuario");





// =====================================
// CARREGAR USUÁRIOS
// =====================================


onSnapshot(

collection(db,"usuarios"),

(snapshot)=>{


lista.innerHTML = "";



snapshot.forEach((documento)=>{


const usuario = documento.data();

const id = documento.id;




lista.innerHTML += `


<tr>


<td>

${usuario.nome || "-"}

</td>



<td>

${usuario.email || "-"}

</td>




<td>


<select onchange="alterarPerfil('${id}', this.value)">


<option value="admin"

${usuario.perfil === "admin" ? "selected" : ""}>

Administrador

</option>



<option value="recepcao"

${usuario.perfil === "recepcao" ? "selected" : ""}>

Recepção

</option>



<option value="membro"

${usuario.perfil === "membro" ? "selected" : ""}>

Membro

</option>



</select>


</td>





<td>


<button

class="btn-danger"

onclick="removerUsuario('${id}')">


<i class="fa-solid fa-trash"></i>

Remover


</button>


</td>



</tr>



`;



});


},

(error)=>{


console.error(
"Erro ao carregar usuários:",
error
);


}

);








// =====================================
// ALTERAR PERFIL
// =====================================


window.alterarPerfil = async(id, perfil)=>{


try{


await updateDoc(

doc(db,"usuarios",id),

{

perfil: perfil

}

);



alert(
"Perfil atualizado."
);



}

catch(error){


console.error(error);


alert(
"Erro ao atualizar perfil."
);


}



};








// =====================================
// REMOVER USUÁRIO
// =====================================


window.removerUsuario = async(id)=>{


const confirmar = confirm(

"Deseja remover este usuário?"

);



if(!confirmar) return;



try{


await deleteDoc(

doc(db,"usuarios",id)

);



alert(
"Usuário removido."
);



}

catch(error){


console.error(error);


alert(
"Erro ao remover usuário."
);


}



};








// =====================================
// BOTÃO CADASTRAR
// =====================================


if(botaoCadastro){


botaoCadastro.addEventListener(

"click",

()=>{


const nome =
document.getElementById("nomeUsuarioNovo").value;


const email =
document.getElementById("emailUsuarioNovo").value;


const senha =
document.getElementById("senhaUsuarioNova").value;


const perfil =
document.getElementById("perfilUsuarioNovo").value;




if(!nome || !email || !senha){


alert(
"Preencha todos os campos."
);


return;


}



alert(
"Formulário pronto. O cadastro precisa ser conectado ao serviço administrativo seguro."
);



}

);


}
