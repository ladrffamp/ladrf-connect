import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



async function carregarRelatorios(){


const atendimentos = await getDocs(

collection(db,"atendimentos")

);



let total = 0;

let pacientes = new Set();

let modalidades = {};

let regioes = {};

let lesoes = {};

let situacoes = {};

let somaEVA = 0;



atendimentos.forEach((item)=>{


const dados = item.data();



total++;




if(dados.paciente){

pacientes.add(dados.paciente);

}





// Modalidades

if(dados.modalidade){

modalidades[dados.modalidade] =
(modalidades[dados.modalidade] || 0) + 1;

}





// Regiões da queixa

if(Array.isArray(dados.queixa)){


dados.queixa.forEach((q)=>{


regioes[q] =
(regioes[q] || 0) + 1;


});


}





// Lesões

if(Array.isArray(dados.lesao)){


dados.lesao.forEach((l)=>{


lesoes[l] =
(lesoes[l] || 0) + 1;


});


}





// Situação final

if(dados.situacaoFinal){


situacoes[dados.situacaoFinal] =

(situacoes[dados.situacaoFinal] || 0) + 1;


}





// EVA

somaEVA += Number(dados.eva || 0);



});






function maior(obj){


let maiorValor = "-";

let quantidade = 0;



for(const item in obj){


if(obj[item] > quantidade){


quantidade = obj[item];

maiorValor = item;


}


}



return maiorValor;


}






document.getElementById("total").innerHTML =

total;



document.getElementById("pacientes").innerHTML =

pacientes.size;



document.getElementById("modalidade").innerHTML =

maior(modalidades);



document.getElementById("regiao").innerHTML =

maior(regioes);



document.getElementById("lesao").innerHTML =

maior(lesoes);



document.getElementById("eva").innerHTML =

total > 0 ?

(somaEVA / total).toFixed(1)

:

0;



document.getElementById("situacao").innerHTML =

maior(situacoes);



}



carregarRelatorios();
