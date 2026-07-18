import { auth, db } from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,

getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =====================================
// VERIFICAÇÃO DE PERMISSÕES
// =====================================


onAuthStateChanged(auth, async(usuario)=>{


if(!usuario){


window.location.href="login.html";


return;


}




try{


const usuarioRef = doc(

db,

"usuarios",

usuario.uid

);



const usuarioDoc = await getDoc(usuarioRef);





if(!usuarioDoc.exists()){


alert(

"Usuário sem perfil cadastrado."

);



window.location.href="login.html";


return;


}






const dadosUsuario = usuarioDoc.data();



const perfil = dadosUsuario.perfil;



const paginaAtual = window.location.pathname

.split("/")

.pop();






// =====================================
// MAPA DE PERMISSÕES
// =====================================


const permissoes = {




admin:[


"index.html",

"dashboard.html",

"cadastro.html",

"fila.html",

"recepcao.html",

"macas.html",

"atendimento.html",

"historico.html",

"usuarios.html",

"membros.html",

"relatorios.html",

"painel.html",

"agenda.html"


],






recepcao:[


"index.html",

"dashboard.html",

"cadastro.html",

"fila.html",

"recepcao.html",

"painel.html"


],






membro:[


"index.html",

"dashboard.html",

"fila.html",

"macas.html",

"atendimento.html",

"historico.html",

"painel.html",

"agenda.html"


]



};







// =====================================
// VERIFICA PERFIL
// =====================================


if(!permissoes[perfil]){


alert(

"Perfil não reconhecido: "

+ perfil

);



window.location.href="index.html";


return;


}






// =====================================
// BLOQUEIO DE PÁGINA
// =====================================


if(!permissoes[perfil].includes(paginaAtual)){



alert(

"Sem permissão para: "

+ paginaAtual

);



window.location.href="index.html";


return;


}







// =====================================
// ESCONDER BOTÕES DO MENU
// =====================================


document

.querySelectorAll("[data-perfil]")

.forEach((item)=>{



const permitido = item.dataset.perfil.split(" ");





if(!permitido.includes(perfil)){


item.style.display="none";


}



});







console.log(

"Permissão liberada:",

perfil,

paginaAtual

);






}catch(error){



console.error(

"Erro nas permissões:",

error

);



alert(

"Erro ao validar permissões."

);



}



});
