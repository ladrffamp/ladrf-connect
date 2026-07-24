import { db } from "./firebase.js";


import {

collection,

onSnapshot,

doc,

updateDoc,

deleteDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const lista =
document.getElementById("listaUsuarios");





// =====================================
// CARREGAR USUÁRIOS
// =====================================


onSnapshot(

collection(db,"usuarios"),

(snapshot)=>{


lista.innerHTML="";



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


<select onchange="alterarPerfil('${id}',this.value)">


<option value="admin"

${usuario.perfil==="admin"?"selected":""}>

Administrador

</option>



<option value="recepcao"

${usuario.perfil==="recepcao"?"selected":""}>

Recepção

</option>



<option value="membro"

${usuario.perfil==="membro"?"selected":""}>

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


window.alterarPerfil = async(id,perfil)=>{


try{


await updateDoc(

doc(db,"usuarios",id),

{

perfil:perfil

}

);



console.log(
"Perfil atualizado:",
perfil
);



}

catch(error){


console.error(
"Erro ao atualizar perfil:",
error
);


alert(
"Erro ao atualizar perfil."
);


}



};







// =====================================
// REMOVER PERFIL
// =====================================


window.removerUsuario = async(id)=>{


const confirmar = confirm(

"Remover este usuário do sistema?"

);



if(!confirmar)return;



try{


await deleteDoc(

doc(db,"usuarios",id)

);



}

catch(error){


console.error(
"Erro ao remover:",
error
);


alert(
"Erro ao remover usuário."
);


}



};
