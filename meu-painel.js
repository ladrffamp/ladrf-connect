// meu-painel.js


import { auth, db } from "./firebase.js";


import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const boasVindas =
document.getElementById("boasVindas");


const listaEscalas =
document.getElementById("listaEscalas");


const totalEventos =
document.getElementById("totalEventos");


const totalHoras =
document.getElementById("totalHoras");


const totalPresencas =
document.getElementById("totalPresencas");







onAuthStateChanged(

auth,

(usuario)=>{


if(!usuario){

window.location.href="login.html";

return;

}



boasVindas.innerHTML =

`👋 Bem-vindo ${usuario.email}`;



carregarPainel(usuario.uid);


}

);








async function carregarPainel(uid){


try{



listaEscalas.innerHTML =
"Carregando...";



let eventos = 0;

let horas = 0;

let presencas = 0;





// ================================
// ESCALAS
// ================================


const agendaSnapshot = await getDocs(

collection(
db,
"agenda"
)

);



listaEscalas.innerHTML = "";

let encontrou = false;





for(const acao of agendaSnapshot.docs){



const dadosAcao = acao.data();



const participantes = await getDocs(

collection(

db,

"agenda",

acao.id,

"participantes"

)

);




const participante = participantes.docs.find(

(item)=>item.id === uid

);





if(participante){



encontrou = true;



const dados = participante.data();





listaEscalas.innerHTML += `


<div class="card">


<h3>

<i class="fa-solid fa-calendar-check"></i>

${dadosAcao.titulo || "Sem título"}

</h3>



<p>

📅 ${dadosAcao.data || "-"}

</p>



<p>

📍 ${dadosAcao.local || "-"}

</p>



<p>

⏰ ${dadosAcao.inicio || "-"} até ${dadosAcao.fim || "-"}

</p>



<p>

Status:

<strong>

${dados.presenca || "Pendente"}

</strong>


</p>



</div>


`;



}




}







if(!encontrou){


listaEscalas.innerHTML =

`

<div class="card">

Nenhuma escala encontrada.

</div>

`;


}







// ================================
// BUSCAR FREQUÊNCIA FINALIZADA
// ================================



const frequencias = await getDocs(

collection(

db,

"frequencia"

)

);







frequencias.forEach((item)=>{


const dados = item.data();





if(!dados.presentes){

return;

}




const participou = dados.presentes.find(

(membro)=>membro.uid === uid

);





if(participou){



eventos++;


presencas++;





}






});









// ================================
// CALCULAR HORAS PELAS AÇÕES
// ================================



for(const acao of agendaSnapshot.docs){


const dados = acao.data();



const frequencia = frequencias.docs.find(

(item)=>item.id === acao.id

);



if(!frequencia){

continue;

}




const lista = frequencia.data().presentes || [];



const participou = lista.find(

(membro)=>membro.uid === uid

);





if(

participou &&

dados.inicio &&

dados.fim

){



horas += calcularHoras(

dados.inicio,

dados.fim

);



}




}








totalEventos.innerHTML = eventos;


totalHoras.innerHTML = horas + "h";


totalPresencas.innerHTML = presencas;





}catch(error){



console.error(

"Erro painel:",

error

);



listaEscalas.innerHTML =

"Erro ao carregar painel.";



}



}








function calcularHoras(inicio,fim){



const inicioMin =

(Number(inicio.split(":")[0])*60)

+

Number(inicio.split(":")[1]);




const fimMin =

(Number(fim.split(":")[0])*60)

+

Number(fim.split(":")[1]);




return (

fimMin - inicioMin

) / 60;



}
