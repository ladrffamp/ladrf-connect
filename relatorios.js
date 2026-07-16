import { db } from "./firebase.js";


import {

collection,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




const atendimentos = await getDocs(

collection(db,"atendimentos")

);



let total = 0;

let pacientes = [];

let modalidades = {};

let membros = {};





atendimentos.forEach((doc)=>{


const dado = doc.data();



total++;



if(dado.paciente){

pacientes.push(dado.paciente);

}



if(dado.modalidade){


modalidades[dado.modalidade] =

(modalidades[dado.modalidade] || 0)+1;


}



if(dado.membro){


membros[dado.membro] =

(membros[dado.membro] || 0)+1;


}



});





document.getElementById("total").innerHTML = total;



document.getElementById("pacientes").innerHTML =

[...new Set(pacientes)].length;






let maiorModalidade="-";

let valorModalidade=0;



Object.entries(modalidades).forEach(([nome,valor])=>{


if(valor > valorModalidade){

valorModalidade=valor;

maiorModalidade=nome;

}


});



document.getElementById("modalidade").innerHTML =

maiorModalidade;






let maiorMembro="-";

let valorMembro=0;



Object.entries(membros).forEach(([nome,valor])=>{


if(valor > valorMembro){

valorMembro=valor;

maiorMembro=nome;

}


});



document.getElementById("membro").innerHTML =

maiorMembro;
