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


const perfil = dadosUsuario.perfil?.toLowerCase();


let paginaAtual = window.location.pathname
.split("/")
.pop();


if(!paginaAtual){

paginaAtual = "index.html";

}





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
"painel.html",

"agenda.html",
"macas.html",
"atendimento.html",
"historico.html",

"materiais.html",
"movimentacoes.html",

"membros.html",
"usuarios.html",

"frequencia.html",

"meu-painel.html",

"relatorios.html",
"certificados.html",
"exportacao.html",

"modalidades.html",

"gerenciar-acao.html"
"avisos.html"

],



membro:[

"index.html",
"dashboard.html",

"fila.html",

"macas.html",

"atendimento.html",

"historico.html",

"agenda.html",

"frequencia.html",

"meu-painel.html",

"materiais.html",

"exportacao.html"

]

};






// =====================================
// PERFIL EXISTE?
// =====================================


if(!permissoes[perfil]){


alert(
"Perfil não reconhecido: " + perfil
);


window.location.href="index.html";


return;


}





// =====================================
// BLOQUEIO DE PÁGINA
// =====================================


if(!permissoes[perfil].includes(paginaAtual)){



alert(
"Sem permissão para acessar esta página."
);



window.location.href="index.html";


return;


}







// =====================================
// CONTROLE DO MENU
// =====================================


document
.querySelectorAll("[data-perfil]")
.forEach((item)=>{


const permitido =
item.dataset.perfil.split(" ");



if(!permitido.includes(perfil)){


item.style.display="none";


}



});







// =====================================
// MOSTRAR USUÁRIO
// =====================================


const nome =
document.getElementById("nomeUsuario");


const perfilTexto =
document.getElementById("perfilUsuario");



if(nome){

nome.innerText =
usuario.displayName || usuario.email;

}



if(perfilTexto){

perfilTexto.innerText =
perfil.toUpperCase();

}




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
