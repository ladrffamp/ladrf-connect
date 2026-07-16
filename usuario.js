import { db } from "./firebase.js";

import {

collection,
addDoc,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


window.criarUsuario = async function(){


const nome =
document.getElementById("nome").value;


const email =
document.getElementById("email").value;


const perfil =
document.getElementById("perfil").value;



if(!nome || !email){

alert("Preencha nome e email");

return;

}


await addDoc(

collection(db,"usuarios"),

{

nome:nome,

email:email,

perfil:perfil

}

);


alert("Usuário cadastrado!");


document.getElementById("nome").value="";

document.getElementById("email").value="";


carregarUsuarios();


}



async function carregarUsuarios(){


const lista =
document.getElementById("lista");


lista.innerHTML="";


const usuarios =
await getDocs(collection(db,"usuarios"));


usuarios.forEach((doc)=>{


const u=doc.data();


lista.innerHTML+=`

<div class="usuario">

<b>${u.nome}</b>

<br>

${u.email}

<br>

Perfil:
${u.perfil}

</div>

`;

});


}


carregarUsuarios();
