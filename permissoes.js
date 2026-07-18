import { auth, db } from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,

getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





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




const perfil = usuarioDoc.data().perfil;



const paginaAtual = window.location.pathname

.split("/")

.pop();






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






if(!permissoes[perfil]){


alert(

"Perfil não reconhecido."

);


window.location.href="index.html";


return;


}







if(!permissoes[perfil].includes(paginaAtual)){


alert(

"Sem permissão para: "

+ paginaAtual

);



window.location.href="index.html";


return;


}




console.log(

"Acesso liberado:",

perfil,

paginaAtual

);





}catch(error){


console.error(error);


alert(

"Erro ao validar permissão."

);


}



});
