import { db } from "./firebase.js";


import {

collection,

onSnapshot,

query,

orderBy

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ===============================
// COLEÇÕES FIREBASE
// ===============================


const eventosRef = collection(db,"eventos");

const pacientesRef = collection(db,"pacientes");

const atendimentosRef = collection(db,"atendimentos");

const movimentacoesRef = collection(db,"movimentacoes");




// ===============================
// VARIÁVEIS GLOBAIS
// ===============================


let eventos = [];

let pacientes = [];

let atendimentos = [];

let movimentacoes = [];




// ===============================
// ELEMENTOS DA PÁGINA
// ===============================


const tabelaEventos = document.getElementById(
"tabelaEventos"
);


const totalEventos = document.getElementById(
"totalEventos"
);


const totalPacientes = document.getElementById(
"totalPacientes"
);


const totalAtendimentos = document.getElementById(
"totalAtendimentos"
);


// ===============================
// CARREGAR EVENTOS
// ===============================


onSnapshot(

query(eventosRef, orderBy("data")),

(snapshot)=>{


eventos=[];


snapshot.forEach((doc)=>{


eventos.push({

id:doc.id,

...doc.data()

});


});


atualizarTabelaEventos();


atualizarResumo();


}

);






// ===============================
// CARREGAR PACIENTES
// ===============================


onSnapshot(

pacientesRef,

(snapshot)=>{


pacientes=[];


snapshot.forEach((doc)=>{


pacientes.push({

id:doc.id,

...doc.data()

});


});


atualizarTabelaEventos();


atualizarResumo();


}

);






// ===============================
// CARREGAR ATENDIMENTOS
// ===============================


onSnapshot(

atendimentosRef,

(snapshot)=>{


atendimentos=[];


snapshot.forEach((doc)=>{


atendimentos.push({

id:doc.id,

...doc.data()

});


});


atualizarTabelaEventos();


atualizarResumo();


}

);






// ===============================
// CARREGAR MOVIMENTAÇÕES
// ===============================


onSnapshot(

movimentacoesRef,

(snapshot)=>{


movimentacoes=[];


snapshot.forEach((doc)=>{


movimentacoes.push({

id:doc.id,

...doc.data()

});


});


atualizarResumo();


}

);
// ===============================
// ATUALIZAR TABELA DE EVENTOS
// ===============================


function atualizarTabelaEventos(){


if(!tabelaEventos){

return;

}



tabelaEventos.innerHTML="";



if(eventos.length===0){


tabelaEventos.innerHTML=`

<tr>

<td colspan="3" style="padding:20px;text-align:center">

Nenhum evento encontrado

</td>

</tr>

`;

return;


}



eventos.forEach((evento)=>{


const qtdPacientes = pacientes.filter(

(p)=>p.evento === evento.nome

).length;



const qtdAtendimentos = atendimentos.filter(

(a)=>a.evento === evento.nome

).length;



tabelaEventos.innerHTML += `


<tr>


<td>

${evento.nome || "Sem nome"}

</td>



<td>

${qtdPacientes}

</td>



<td>

${qtdAtendimentos}

</td>


</tr>


`;


});


}




// ===============================
// ATUALIZAR RESUMO
// ===============================


function atualizarResumo(){



if(totalEventos){

totalEventos.innerText = eventos.length;

}



if(totalPacientes){

totalPacientes.innerText = pacientes.length;

}



if(totalAtendimentos){

totalAtendimentos.innerText = atendimentos.length;

}



}
// ===============================
// GERAR PDF
// ===============================


document.getElementById("gerarPDF")
.addEventListener("click",()=>{


const { jsPDF } = window.jspdf;


const pdf = new jsPDF();



pdf.setFontSize(18);


pdf.text(

"LADRF Connect 2.0",

20,

20

);



pdf.setFontSize(14);


pdf.text(

"Relatório de Atividades",

20,

35

);



pdf.setFontSize(12);


pdf.text(

"Data: " + new Date().toLocaleDateString(),

20,

50

);



pdf.text(

"Eventos: " + eventos.length,

20,

65

);



pdf.text(

"Pacientes: " + pacientes.length,

20,

80

);



pdf.text(

"Atendimentos: " + atendimentos.length,

20,

95

);



pdf.text(

"Movimentações de estoque: " + movimentacoes.length,

20,

110

);



pdf.save(

"relatorio_ladrf.pdf"

);



});






// ===============================
// GERAR EXCEL
// ===============================


document.getElementById("gerarExcel")
.addEventListener("click",()=>{


const dadosEventos = eventos.map((evento)=>{


return {


Evento:evento.nome || "",

Data:evento.data || "",


Pacientes: pacientes.filter(

p=>p.evento===evento.nome

).length,


Atendimentos: atendimentos.filter(

a=>a.evento===evento.nome

).length


};


});



const planilha = XLSX.utils.json_to_sheet(

dadosEventos

);



const arquivo = XLSX.utils.book_new();



XLSX.utils.book_append_sheet(

arquivo,

planilha,

"Eventos"

);



XLSX.writeFile(

arquivo,

"relatorio_ladrf.xlsx"

);



});





// ===============================
// ATUALIZAR DADOS
// ===============================


document.getElementById("carregarDados")
.addEventListener("click",()=>{


atualizarTabelaEventos();

atualizarResumo();


alert(

"Dados atualizados com sucesso!"

);


});
