import { db, auth } from "./firebase.js";


import {

collection,
doc,
getDoc,
query,
where,
onSnapshot,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

onAuthStateChanged,
updatePassword,
signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// =====================================
// ELEMENTOS
// =====================================


const foto =
document.getElementById("fotoPerfil");


const nome =
document.getElementById("nomePerfil");


const funcao =
document.getElementById("funcaoPerfil");


const status =
document.getElementById("statusPerfil");


const email =
document.getElementById("emailPerfil");


const telefone =
document.getElementById("telefonePerfil");


const curso =
document.getElementById("cursoPerfil");


const periodo =
document.getElementById("periodoPerfil");



const presencas =
document.getElementById("totalPresencas");


const faltas =
document.getElementById("totalFaltas");


const participacoes =
document.getElementById("totalParticipacoes");


const certificados =
document.getElementById("totalCertificados");


const horas =
document.getElementById("totalHoras");



const listaEventos =
document.getElementById("listaEventos");


const listaCertificados =
document.getElementById("listaCertificados");


const historico =
document.getElementById("historicoPerfil");


const listaConquistas =
document.getElementById("listaConquistas");





// MODAIS


const modalEditar =
document.getElementById("modalEditar");


const modalSenha =
document.getElementById("modalSenha");





let usuarioAtual = null;


let uid =
new URLSearchParams(
window.location.search
).get("id");







// =====================================
// LOGIN
// =====================================


onAuthStateChanged(
auth,
async(usuario)=>{


if(!usuario){


window.location.href =
"login.html";


return;


}



usuarioAtual = usuario;



if(!uid){


uid = usuario.uid;


}



carregarPerfil(uid);


observarPerfil(uid);



});








// =====================================
// CARREGAR PERFIL
// =====================================


async function carregarPerfil(id){



try{


const ref =
doc(
db,
"membros",
id
);



const snap =
await getDoc(ref);




if(!snap.exists()){


nome.innerHTML =
"Membro não encontrado.";


return;


}




const membro =
snap.data();





foto.src =

membro.foto ||

"https://ui-avatars.com/api/?name="+

encodeURIComponent(
membro.nomeCompleto ||
"Membro"
)

+"&background=0B7A3D&color=fff";







nome.innerHTML =

membro.nomeCompleto ||
membro.nome ||
"-";





funcao.innerHTML =

`

<i class="fa-solid fa-user-tie"></i>

${membro.funcao || "Membro"}

`;





status.innerHTML =

`

<i class="fa-solid fa-circle-check"></i>

${membro.status || "Ativo"}

`;





email.innerHTML =
membro.email || "-";




telefone.innerHTML =
membro.telefone || "-";




curso.innerHTML =
membro.curso || "-";




periodo.innerHTML =
membro.periodo || "-";






carregarFrequencia(id);

carregarEventos();

carregarCertificados(id);

carregarHistorico(id);

carregarConquistas();





}



catch(error){


console.error(error);


nome.innerHTML =
"Erro ao carregar perfil.";


}



}
// =====================================
// FREQUÊNCIA
// =====================================


function carregarFrequencia(id){


const ref =
collection(
db,
"frequencia"
);



const q =
query(
ref,
where(
"membroId",
"==",
id
)
);




onSnapshot(
q,
(snapshot)=>{


let totalPresencas = 0;

let totalFaltas = 0;



snapshot.forEach((item)=>{


const dados =
item.data();



if(dados.presente){

totalPresencas++;


}else{


totalFaltas++;


}



});




presencas.innerHTML =
totalPresencas;



faltas.innerHTML =
totalFaltas;



participacoes.innerHTML =
snapshot.size;



}

);



}







// =====================================
// EVENTOS
// =====================================


function carregarEventos(){



const ref =
collection(
db,
"eventos"
);




onSnapshot(
ref,
(snapshot)=>{


listaEventos.innerHTML = "";




if(snapshot.empty){


listaEventos.innerHTML =

"<p>Nenhum evento encontrado.</p>";

return;


}





snapshot.forEach((item)=>{


const evento =
item.data();



const div =
document.createElement("div");



div.className =
"itemPerfil";



div.innerHTML =

`

<h4>

<i class="fa-solid fa-calendar"></i>

${evento.nome || "Evento"}

</h4>


<p>

${evento.data || ""}

</p>


<span>

${evento.local || ""}

</span>


`;



listaEventos.appendChild(div);



});



}

);



}








// =====================================
// CERTIFICADOS
// =====================================


function carregarCertificados(id){



const ref =
collection(
db,
"certificados"
);



const q =
query(
ref,
where(
"membroId",
"==",
id
)
);





onSnapshot(
q,
(snapshot)=>{


listaCertificados.innerHTML = "";



certificados.innerHTML =
snapshot.size;



let totalHoras = 0;





if(snapshot.empty){


listaCertificados.innerHTML =

"<p>Nenhum certificado disponível.</p>";



horas.innerHTML =
"0h";



return;



}






snapshot.forEach((item)=>{



const cert =
item.data();





totalHoras +=
Number(
cert.horas || 0
);





const div =
document.createElement("div");



div.className =
"itemPerfil";





div.innerHTML =

`

<h4>

<i class="fa-solid fa-certificate"></i>

${cert.nome || "Certificado"}

</h4>



<p>

${cert.horas || 0} horas

</p>

`;



listaCertificados.appendChild(div);



});




horas.innerHTML =
totalHoras+"h";




}

);



}









// =====================================
// HISTÓRICO
// =====================================


function carregarHistorico(id){



const ref =
collection(
db,
"historico"
);




const q =
query(
ref,
where(
"membroId",
"==",
id
)
);





onSnapshot(
q,
(snapshot)=>{


historico.innerHTML="";




if(snapshot.empty){


historico.innerHTML =

"<p>Nenhuma participação registrada.</p>";

return;


}






snapshot.forEach((item)=>{


const dado =
item.data();




const div =
document.createElement("div");



div.className =
"itemPerfil";





div.innerHTML =

`

<h4>

<i class="fa-solid fa-clock-rotate-left"></i>

${dado.titulo || "Atividade"}

</h4>


<p>

${dado.data || ""}

</p>



<small>

${dado.descricao || ""}

</small>

`;




historico.appendChild(div);



});



}

);



}








// =====================================
// CONQUISTAS
// =====================================


function carregarConquistas(){



listaConquistas.innerHTML = "";



const conquistas = [


{

icone:"fa-star",

titulo:"Membro LADRF"

},


{

icone:"fa-hand-holding-medical",

titulo:"Participação em ações"

},


{

icone:"fa-certificate",

titulo:"Certificados conquistados"

}


];






conquistas.forEach((item)=>{


const div =
document.createElement("div");



div.className =
"card";



div.innerHTML =


`

<i class="fa-solid ${item.icone}"></i>


<h3>

${item.titulo}

</h3>


`;



listaConquistas.appendChild(div);



});



}
// =====================================
// OBSERVAR ALTERAÇÕES DO PERFIL
// =====================================


function observarPerfil(id){


const ref =
doc(
db,
"membros",
id
);



onSnapshot(
ref,
(snapshot)=>{


if(!snapshot.exists()) return;



const dados =
snapshot.data();



if(dados.foto){

foto.src =
dados.foto;

}



nome.innerHTML =
dados.nomeCompleto ||
dados.nome ||
"-";



funcao.innerHTML =

`

<i class="fa-solid fa-user-tie"></i>

${dados.funcao || "Membro"}

`;



status.innerHTML =

`

<i class="fa-solid fa-circle-check"></i>

${dados.status || "Ativo"}

`;



}

);



}









// =====================================
// ABRIR MODAL EDITAR
// =====================================


document
.getElementById("btnEditarPerfil")
?.addEventListener(
"click",
()=>{


document.getElementById("editarTelefone").value =
telefone.innerText;


document.getElementById("editarCurso").value =
curso.innerText;


document.getElementById("editarPeriodo").value =
periodo.innerText;



modalEditar.style.display =
"flex";


}

);








// =====================================
// SALVAR PERFIL
// =====================================


document
.getElementById("btnSalvarPerfil")
?.addEventListener(
"click",
async()=>{


try{


await updateDoc(

doc(
db,
"membros",
uid
),

{


telefone:

document.getElementById(
"editarTelefone"
).value,



curso:

document.getElementById(
"editarCurso"
).value,



periodo:

document.getElementById(
"editarPeriodo"
).value


}

);




modalEditar.style.display =
"none";



alert(
"Perfil atualizado!"
);



carregarPerfil(uid);



}



catch(error){


console.error(error);


alert(
"Erro ao atualizar perfil."
);



}


}

);









// =====================================
// CANCELAR EDITAR
// =====================================


document
.getElementById("btnCancelarPerfil")
?.addEventListener(
"click",
()=>{


modalEditar.style.display =
"none";


}

);








// =====================================
// ABRIR MODAL SENHA
// =====================================


document
.getElementById("btnAlterarSenha")
?.addEventListener(
"click",
()=>{


modalSenha.style.display =
"flex";


}

);








// =====================================
// SALVAR NOVA SENHA
// =====================================


document
.getElementById("btnSalvarSenha")
?.addEventListener(
"click",
async()=>{



const senha =
document.getElementById(
"novaSenha"
).value;



const confirmar =
document.getElementById(
"confirmarSenha"
).value;





if(senha !== confirmar){


alert(
"As senhas não coincidem."
);


return;


}





if(senha.length < 6){


alert(
"A senha deve ter no mínimo 6 caracteres."
);


return;


}




try{


await updatePassword(
usuarioAtual,
senha
);




modalSenha.style.display =
"none";



document.getElementById(
"novaSenha"
).value="";



document.getElementById(
"confirmarSenha"
).value="";



alert(
"Senha alterada com sucesso!"
);



}



catch(error){


console.error(error);


alert(
"Faça login novamente para alterar a senha."
);



}



}

);








// =====================================
// CANCELAR SENHA
// =====================================


document
.getElementById("btnCancelarSenha")
?.addEventListener(
"click",
()=>{


modalSenha.style.display =
"none";


}

);








// =====================================
// ALTERAR FOTO
// =====================================


document
.getElementById("btnAlterarFoto")
?.addEventListener(
"click",
()=>{


const novaFoto =
prompt(
"Digite o link da nova foto:"
);



if(!novaFoto) return;




updateDoc(

doc(
db,
"membros",
uid
),

{

foto:novaFoto

}

)
.then(()=>{


foto.src =
novaFoto;


alert(
"Foto atualizada!"
);



})
.catch((erro)=>{


console.error(erro);


alert(
"Erro ao atualizar foto."
);



});



}

);








// =====================================
// SAIR
// =====================================


document
.getElementById("btnSair")
?.addEventListener(
"click",
async()=>{


await signOut(auth);



window.location.href =
"login.html";



}

);
