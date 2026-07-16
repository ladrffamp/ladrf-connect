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


onSnapshot(collection(db,"usuarios"),(snapshot)=>{


lista.innerHTML="";


snapshot.forEach((documento)=>{


const usuario=documento.data();

const id=documento.id;


lista.innerHTML += `

<tr>

<td>${usuario.nome || "-"}</td>

<td>${usuario.email || "-"}</td>


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

<button class="excluir"
onclick="removerUsuario('${id}')">

Remover

</button>

</td>


</tr>

`;

});


});



window.alterarPerfil = async(id,perfil)=>{


await updateDoc(

doc(db,"usuarios",id),

{

perfil:perfil

}

);


alert("Perfil atualizado!");

}



window.removerUsuario = async(id)=>{


const confirmar =
confirm("Remover perfil deste usuário?");


if(!confirmar)return;


await deleteDoc(

doc(db,"usuarios",id)

);


}
