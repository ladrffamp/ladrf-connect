// relatorios.js

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// ELEMENTOS
// =====================================

const totalPacientes = document.getElementById("totalPacientes");
const totalAtendimentos = document.getElementById("totalAtendimentos");
const totalEventos = document.getElementById("totalEventos");
const totalMembros = document.getElementById("totalMembros");

const notaMediaTopo = document.getElementById("notaMediaTopo");
const taxaRecomendacao = document.getElementById("taxaRecomendacao");
const problemasResolvidos = document.getElementById("problemasResolvidos");

const tempoEspera = document.getElementById("tempoEspera");

const resumoAtendimentos =
document.getElementById("resumoAtendimentos");

const listaEventos =
document.getElementById("listaEventos");


// =====================================
// DADOS GLOBAIS
// =====================================

let graficoAvaliacoes = null;
let graficoMes = null;
let graficoModalidades = null;
let graficoResolucao = null;


// =====================================
// CARREGAR RELATÓRIOS
// =====================================

async function carregarRelatorios(){

try{


// =============================
// PACIENTES
// =============================

const pacientesSnapshot =
await getDocs(
    collection(db,"pacientes")
);


totalPacientes.innerHTML =
pacientesSnapshot.size;



// =============================
// ATENDIMENTOS
// =============================

const atendimentosSnapshot =
await getDocs(
    collection(db,"atendimentos")
);


listaAtendimentos =
atendimentosSnapshot.docs.map(doc=>({
    id: doc.id,
    ...doc.data()
}));


console.log(
"ATENDIMENTOS ENCONTRADOS:",
listaAtendimentos.length
);


totalAtendimentos.innerHTML =
listaAtendimentos.length;



// =============================
// EVENTOS
// =============================

const eventosSnapshot =
await getDocs(
    collection(db,"agenda")
);


totalEventos.innerHTML =
eventosSnapshot.size;


listaEventos.innerHTML = "";



for(const evento of eventosSnapshot.docs){


const dados = evento.data();



listaEventos.innerHTML += `

<tr>

<td>
${dados.titulo || "-"}
</td>

<td>
${dados.data || "-"}
</td>

<td>
-

</td>

</tr>

`;

}



if(!listaEventos.innerHTML){

listaEventos.innerHTML = `

<tr>

<td colspan="3">

Nenhum evento encontrado.

</td>

</tr>

`;

}



// =============================
// MEMBROS
// =============================

const usuariosSnapshot =
await getDocs(
collection(db,"usuarios")
);


let membros = 0;


usuariosSnapshot.forEach(doc=>{

const dados = doc.data();


if(
dados.perfil?.toLowerCase()
===
"membro"
){

membros++;

}

});


totalMembros.innerHTML =
membros;



// =============================
// RESUMO ATENDIMENTOS
// =============================


const resumo = {};



listaAtendimentos.forEach(atendimento=>{


const modalidade =
atendimento.modalidade || "Outros";


if(!resumo[modalidade]){

resumo[modalidade]=0;

}


resumo[modalidade]++;


});



resumoAtendimentos.innerHTML="";



Object.keys(resumo).forEach(item=>{


resumoAtendimentos.innerHTML += `

<tr>

<td>
${item}
</td>

<td>
${resumo[item]}
</td>

</tr>

`;

});



calcularTempoEspera();



}catch(error){

console.error(
"Erro ao carregar relatórios:",
error
);

}


}



// =====================================
// TEMPO DE ESPERA
// =====================================

function calcularTempoEspera(){


let totalMinutos = 0;

let quantidade = 0;



listaAtendimentos.forEach(atendimento=>{


if(
!atendimento.pacienteId ||
!atendimento.inicio
){

return;

}



quantidade++;


});



tempoEspera.innerHTML =
quantidade
?
Math.round(totalMinutos / quantidade)
+
" min"
:
"0 min";


}




// =====================================
// AVALIAÇÕES
// =====================================

async function carregarAvaliacoes(){

try{


const avaliacoesSnapshot =
await getDocs(
    collection(db,"avaliacoes")
);


listaAvaliacoes =
avaliacoesSnapshot.docs.map(doc=>({
    id:doc.id,
    ...doc.data()
}));



let total = listaAvaliacoes.length;

let somaNotas = 0;

let indicados = 0;

let resolvidos = 0;



listaAvaliacoes.forEach(avaliacao=>{


somaNotas +=
Number(avaliacao.nota || 0);



if(avaliacao.indicaria === "Sim"){

indicados++;

}



if(avaliacao.resolucao === "Sim"){

resolvidos++;

}


});



const media =
total
?
(somaNotas / total).toFixed(1)
:
"0,0";



const percentualIndicacao =
total
?
Math.round((indicados / total)*100)
:
0;



const percentualResolvido =
total
?
Math.round((resolvidos / total)*100)
:
0;



// painel inferior

document.getElementById("totalAvaliacoes").innerHTML =
total;


document.getElementById("notaMedia").innerHTML =
media;


document.getElementById("percentualIndicacao").innerHTML =
percentualIndicacao + "%";


document.getElementById("percentualResolvido").innerHTML =
percentualResolvido + "%";



// cards superiores

if(notaMediaTopo){

notaMediaTopo.innerHTML =
media;

}


if(taxaRecomendacao){

taxaRecomendacao.innerHTML =
percentualIndicacao + "%";

}


if(problemasResolvidos){

problemasResolvidos.innerHTML =
percentualResolvido + "%";

}



carregarUltimasAvaliacoes();



criarGraficoAvaliacoes();



}catch(error){

console.error(
"Erro avaliações:",
error
);

}


}





// =====================================
// ÚLTIMAS AVALIAÇÕES
// =====================================

function carregarUltimasAvaliacoes(){


const area =
document.getElementById("ultimasAvaliacoes");



if(!area) return;



area.innerHTML="";



listaAvaliacoes
.slice(-5)
.reverse()
.forEach(avaliacao=>{


area.innerHTML += `

<div class="avaliacao-item">


<strong>
⭐ ${avaliacao.nota || 0}/5
</strong>

<p>
${avaliacao.comentario || "Sem comentário"}
</p>


<small>

Equipe:
${avaliacao.equipe || "-"}

|
Espera:
${avaliacao.espera || "-"}

</small>


</div>

`;

});


}




// =====================================
// RANKING DOS MEMBROS
// =====================================

async function carregarRanking(){


const tabela =
document.getElementById("rankingMembros");


if(!tabela) return;



const ranking = {};



listaAtendimentos.forEach(atendimento=>{


const membro =
atendimento.membro || "Não informado";



if(!ranking[membro]){

ranking[membro]=0;

}


ranking[membro]++;


});



const lista =
Object.entries(ranking)
.sort((a,b)=>b[1]-a[1]);



tabela.innerHTML="";



lista.forEach((item,index)=>{


tabela.innerHTML += `

<tr>

<td>
${index+1}
</td>

<td>
${item[0]}
</td>

<td>
${item[1]}
</td>

<td>
-
</td>

</tr>

`;

});


}



// =====================================
// GRÁFICO AVALIAÇÕES
// =====================================

function criarGraficoAvaliacoes(){


const canvas =
document.getElementById("graficoAvaliacoes");


if(!canvas) return;



let notas = {

"1":0,
"2":0,
"3":0,
"4":0,
"5":0

};



listaAvaliacoes.forEach(avaliacao=>{


const nota =
String(avaliacao.nota || 0);


if(notas[nota] !== undefined){

notas[nota]++;

}

});


if(graficoAvaliacoes){
    graficoAvaliacoes.destroy();
}

graficoAvaliacoes = new Chart(canvas,{

type:"bar",

data:{


labels:[
"1 estrela",
"2 estrelas",
"3 estrelas",
"4 estrelas",
"5 estrelas"
],


datasets:[{

label:"Avaliações",

data:[
notas["1"],
notas["2"],
notas["3"],
notas["4"],
notas["5"]
]

}]


},


options:{

responsive:true

}


});


}




// =====================================
// INICIAR COMPLEMENTOS
// =====================================

carregarAvaliacoes();

carregarRanking();
// =====================================
// GRÁFICO ATENDIMENTOS POR MÊS
// =====================================

function criarGraficoMes(){


const canvas =
document.getElementById("graficoMes");


if(!canvas) return;



const meses = {

"Jan":0,
"Fev":0,
"Mar":0,
"Abr":0,
"Mai":0,
"Jun":0,
"Jul":0,
"Ago":0,
"Set":0,
"Out":0,
"Nov":0,
"Dez":0

};



listaAtendimentos.forEach(atendimento=>{


let data;


if(atendimento.data){

data = new Date(atendimento.data);

}


if(data && !isNaN(data)){


const nomeMes =
data.toLocaleString(
"pt-BR",
{
month:"short"
}
);


Object.keys(meses).forEach(mes=>{


if(
nomeMes
.substring(0,3)
.toLowerCase()
===
mes
.substring(0,3)
.toLowerCase()
){

meses[mes]++;

}

});


}


});



new Chart(canvas,{

type:"line",

data:{


labels:Object.keys(meses),


datasets:[{

label:"Atendimentos",

data:Object.values(meses)

}]


},


options:{

responsive:true

}


});


}





// =====================================
// GRÁFICO MODALIDADES
// =====================================

function criarGraficoModalidades(){


const canvas =
document.getElementById("graficoModalidades");


if(!canvas) return;



const modalidades = {};



listaAtendimentos.forEach(atendimento=>{


const modalidade =
atendimento.modalidade || "Outros";


if(!modalidades[modalidade]){

modalidades[modalidade]=0;

}


modalidades[modalidade]++;


});



new Chart(canvas,{

type:"doughnut",

data:{


labels:Object.keys(modalidades),


datasets:[{

label:"Modalidades",

data:Object.values(modalidades)

}]


},


options:{

responsive:true

}


});


}




// =====================================
// GRÁFICO RESOLUÇÃO
// =====================================

function criarGraficoResolucao(){


const canvas =
document.getElementById("graficoResolucao");


if(!canvas) return;



let sim = 0;

let nao = 0;



listaAvaliacoes.forEach(avaliacao=>{


if(avaliacao.resolucao === "Sim"){

sim++;

}else{

nao++;

}


});



new Chart(canvas,{

type:"pie",

data:{


labels:[

"Resolvido",
"Não resolvido"

],


datasets:[{

data:[sim,nao]

}]


},


options:{

responsive:true

}


});


}




// =====================================
// FILTROS
// =====================================

const botaoFiltro =
document.getElementById("aplicarFiltros");



if(botaoFiltro){


botaoFiltro.addEventListener(
"click",
()=>{


const periodo =
document.getElementById(
"filtroPeriodo"
).value;



const evento =
document.getElementById(
"filtroEvento"
).value;



const membro =
document.getElementById(
"filtroMembro"
).value;



console.log(
"Filtros:",
{
periodo,
evento,
membro
}
);


});

}




// =====================================
// INICIAR SISTEMA
// =====================================

carregarRelatorios()
.then(()=>{

    carregarAvaliacoes();

    carregarRanking();

    criarGraficoMes();

    criarGraficoModalidades();

    criarGraficoResolucao();

});