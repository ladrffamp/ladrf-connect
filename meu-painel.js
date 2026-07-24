// meu-painel.js


import { auth, db } from "./firebase.js";


import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const boasVindas =
document.getElementById("boasVindas");


const totalEventos =
document.getElementById("totalEventos");


const totalHoras =
document.getElementById("totalHoras");


const totalPresencas =
document.getElementById("totalPresencas");






onAuthStateChanged(

auth,

async(usuario)=>{


if(!usuario){

window.location.href="login.html";

return;

}



if(boasVindas){

boasVindas.innerHTML =
`👋 Bem-vindo ${usuario.email}`;

}



carregarResumo(usuario.uid);



}

);









async function carregarResumo(uid){


try{


let eventos = 0;

let presencas = 0;

let horas = 0;



const agenda =
await getDocs(

collection(
db,
"agenda"
)

);






for(const acao of agenda.docs){



const participantes =
await getDocs(

collection(

db,

"agenda",

acao.id,

"participantes"

)

);





const membro =
participantes.docs.find(

(item)=>item.id === uid

);





if(membro){



const dados =
membro.data();



if(
dados.presenca === "Confirmado" ||
dados.presenca === "Confirmada"
){


eventos++;

presencas++;



const inicio =
acao.data().inicio;


const fim =
acao.data().fim;



if(inicio && fim){


const h1 =
Number(inicio.split(":")[0]);


const h2 =
Number(fim.split(":")[0]);


horas += h2 - h1;


}


}



}



}





if(totalEventos){

totalEventos.innerHTML =
eventos;

}



if(totalPresencas){

totalPresencas.innerHTML =
presencas;

}



if(totalHoras){

totalHoras.innerHTML =
horas + "h";

}



}catch(error){


console.error(
"Erro ao carregar resumo:",
error
);



}



}
