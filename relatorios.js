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

let listaAtendimentos = [];
let listaAvaliacoes = [];

let graficoAvaliacoes = null;
let graficoMes = null;
let graficoModalidades = null;
let graficoResolucao = null;


// =====================================
// CARREGAR RELATÓRIOS
// =====================================

async function carregarRelatorios(){

try{


// =====================================
// PACIENTES
// =====================================

const pacientesSnapshot =
await getDocs(
    collection(db,"pacientes")
);


totalPacientes.innerHTML =
pacientesSnapshot.size;



// =====================================
// ATENDIMENTOS
// =====================================

const atendimentosSnapshot =
await getDocs(
    collection(db,"atendimentos")
);


listaAtendimentos =
atendimentosSnapshot.docs.map(doc=>({
    id:doc.id,
    ...doc.data()
}));


console.log(
"ATENDIMENTOS ENCONTRADOS:",
listaAtendimentos.length
);


totalAtendimentos.innerHTML =
listaAtendimentos.length;



// =====================================
// EVENTOS
// =====================================

const eventosSnapshot =
await getDocs(
    collection(db,"agenda")
);


let eventosRealizados = [];



eventosSnapshot.forEach(doc=>{

const dados = doc.data();

let dataEvento = new Date(dados.data);

let hoje = new Date();


if(
    !isNaN(dataEvento) &&
    dataEvento <= hoje
){

    eventosRealizados.push({
        id:doc.id,
        ...dados
    });

}


});



totalEventos.innerHTML =
eventosRealizados.length;



listaEventos.innerHTML="";



eventosRealizados.forEach(evento=>{


listaEventos.innerHTML += `

<tr>

<td>
${evento.titulo || evento.nome || "-"}
</td>

<td>
${evento.data || "-"}
</td>

<td>
${evento.participantes || 0}
</td>

</tr>

`;

});



if(eventosRealizados.length === 0){

listaEventos.innerHTML = `

<tr>

<td colspan="3">

Nenhum evento realizado.

</td>

</tr>

`;

}



// =====================================
// MEMBROS
// =====================================

const usuariosSnapshot =
await getDocs(
    collection(db,"usuarios")
);


let membros = 0;



usuariosSnapshot.forEach(doc=>{

const dados = doc.data();



if(
dados.perfil?.toLowerCase() === "membro"
){

membros++;

}

});



totalMembros.innerHTML =
membros;



// =====================================
// RESUMO ATENDIMENTOS
// =====================================

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



Object.entries(resumo).forEach(([nome,quantidade])=>{


resumoAtendimentos.innerHTML += `

<tr>

<td>
${nome}
</td>

<td>
${quantidade}
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
atendimento.inicio &&
atendimento.termino
){


const inicio =
atendimento.inicio.split(":");


const fim =
atendimento.termino.split(":");


const minutosInicio =
Number(inicio[0])*60 + Number(inicio[1]);


const minutosFim =
Number(fim[0])*60 + Number(fim[1]);


totalMinutos +=
(minutosFim-minutosInicio);


quantidade++;


}


});



tempoEspera.innerHTML =
quantidade
?
Math.round(totalMinutos/quantidade)+" min"
:
"0 min";


}
// =====================================
// AVALIAÇÕES
// =====================================

async function carregarAvaliacoes(){

try{


const snapshot =
await getDocs(
    collection(db,"avaliacoes")
);



listaAvaliacoes =
snapshot.docs.map(doc=>({

id:doc.id,
...doc.data()

}));



let total = listaAvaliacoes.length;

let somaNotas = 0;

let indicados = 0;

let resolvidos = 0;



listaAvaliacoes.forEach(avaliacao=>{


somaNotas += Number(
avaliacao.nota || 0
);



if(
avaliacao.indicaria === "Sim"
){

indicados++;

}



if(
avaliacao.resolucao === "Sim"
){

resolvidos++;

}


});



const media = total
?
(somaNotas / total).toFixed(1)
:
"0,0";



const recomendacao = total
?
Math.round(
(indicados / total) * 100
)
:
0;



const resolucao = total
?
Math.round(
(resolvidos / total) * 100
)
:
0;



// painel inferior

const totalAvaliacoes =
document.getElementById("totalAvaliacoes");


const notaMedia =
document.getElementById("notaMedia");


const percentualIndicacao =
document.getElementById("percentualIndicacao");


const percentualResolvido =
document.getElementById("percentualResolvido");



if(totalAvaliacoes)
totalAvaliacoes.innerHTML =
total;



if(notaMedia)
notaMedia.innerHTML =
media;



if(percentualIndicacao)
percentualIndicacao.innerHTML =
recomendacao+"%";



if(percentualResolvido)
percentualResolvido.innerHTML =
resolucao+"%";




// cards superiores

if(notaMediaTopo)
notaMediaTopo.innerHTML =
media;



if(taxaRecomendacao)
taxaRecomendacao.innerHTML =
recomendacao+"%";



if(problemasResolvidos)
problemasResolvidos.innerHTML =
resolucao+"%";



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
document.getElementById(
"ultimasAvaliacoes"
);



if(!area)
return;



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

<br>

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

function carregarRanking(){


const tabela =
document.getElementById(
"rankingMembros"
);



if(!tabela)
return;



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
.sort(
(a,b)=>b[1]-a[1]
);



tabela.innerHTML="";



if(lista.length===0){

tabela.innerHTML = `

<tr>

<td colspan="4">

Nenhum atendimento encontrado.

</td>

</tr>

`;

return;

}




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


if(!canvas)
return;



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



graficoAvaliacoes =
new Chart(canvas,{

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
// GRÁFICO ATENDIMENTOS POR MÊS
// =====================================

function criarGraficoMes(){

const canvas =
document.getElementById("graficoMes");


if(!canvas)
return;



const meses = {

Jan:0,
Fev:0,
Mar:0,
Abr:0,
Mai:0,
Jun:0,
Jul:0,
Ago:0,
Set:0,
Out:0,
Nov:0,
Dez:0

};



listaAtendimentos.forEach(atendimento=>{


if(!atendimento.data)
return;



const data =
new Date(
atendimento.data.seconds
?
atendimento.data.seconds*1000
:
atendimento.data
);



if(isNaN(data))
return;



const mes =
data.toLocaleString(
"pt-BR",
{
month:"short"
}
)
.substring(0,3);



Object.keys(meses)
.forEach(nome=>{


if(
nome.toLowerCase()
===
mes.toLowerCase()
){

meses[nome]++;

}

});


});



if(graficoMes){

graficoMes.destroy();

}



graficoMes =
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
document.getElementById(
"graficoModalidades"
);



if(!canvas)
return;



const dados = {};



listaAtendimentos.forEach(atendimento=>{


const modalidade =
atendimento.modalidade || "Outros";



dados[modalidade] =
(dados[modalidade] || 0)+1;


});



if(graficoModalidades){

graficoModalidades.destroy();

}



graficoModalidades =
new Chart(canvas,{

type:"doughnut",

data:{

labels:Object.keys(dados),

datasets:[{

label:"Modalidades",

data:Object.values(dados)

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
document.getElementById(
"graficoResolucao"
);



if(!canvas)
return;



let sim = 0;

let nao = 0;



listaAvaliacoes.forEach(avaliacao=>{


if(
avaliacao.resolucao === "Sim"
){

sim++;

}else{

nao++;

}

});



if(graficoResolucao){

graficoResolucao.destroy();

}



graficoResolucao =
new Chart(canvas,{

type:"pie",

data:{

labels:[

"Resolvido",
"Não resolvido"

],

datasets:[{

data:[

sim,
nao

]

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
document.getElementById(
"aplicarFiltros"
);



if(botaoFiltro){


botaoFiltro.addEventListener(
"click",
()=>{


console.log({

periodo:
document.getElementById(
"filtroPeriodo"
).value,


evento:
document.getElementById(
"filtroEvento"
).value,


membro:
document.getElementById(
"filtroMembro"
).value


});


});


}





// =====================================
// INICIALIZAÇÃO FINAL
// =====================================

async function iniciarRelatorios(){


await carregarRelatorios();


await carregarAvaliacoes();



carregarRanking();



criarGraficoMes();


criarGraficoModalidades();


criarGraficoResolucao();


}



iniciarRelatorios();