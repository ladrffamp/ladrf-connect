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
// COLEÇÕES
// ===============================


const eventosRef = collection(db,"eventos");

const pacientesRef = collection(db,"pacientes");

const atendimentosRef = collection(db,"atendimentos");



// ===============================
// VARIÁVEIS
// ===============================


let eventos = [];

let pacientes = [];

let atendimentos = [];




// ===============================
// ELEMENTOS
// ===============================


const tabelaEventos = document.getElementById("tabelaEventos");





// ===============================
// EVENTOS FIREBASE
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


atualizarTabela();


}

// ===============================
// PACIENTES FIREBASE
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


atualizarTabela();


}

);






// ===============================
// ATENDIMENTOS FIREBASE
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


atualizarTabela();


}

);







// ===============================
// TABELA DE EVENTOS
// ===============================


function atualizarTabela(){


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


const quantidadePacientes = pacientes.filter(

(p)=>p.evento === evento.nome

).length;



const quantidadeAtendimentos = atendimentos.filter(

(a)=>a.evento === evento.nome

).length;




tabelaEventos.innerHTML += `

<tr>


<td>

${evento.nome || "Sem nome"}

</td>


<td>

${quantidadePacientes}

</td>


<td>

${quantidadeAtendimentos}

</td>


</tr>

`;



});


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

"Total de eventos: " + eventos.length,

20,

65

);



pdf.text(

"Total de pacientes: " + pacientes.length,

20,

80

);



pdf.text(

"Total de atendimentos: " + atendimentos.length,

20,

95

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



const dados = eventos.map((evento)=>{


return {


Evento:evento.nome || "",


Data:evento.data || "",


Pacientes: pacientes.filter(

p=>p.evento === evento.nome

).length,


Atendimentos: atendimentos.filter(

a=>a.evento === evento.nome

).length


};


});



const planilha = XLSX.utils.json_to_sheet(dados);



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
// BOTÃO ATUALIZAR
// ===============================


document.getElementById("carregarDados")
.addEventListener("click",()=>{


atualizarTabela();


alert(

"Dados atualizados com sucesso!"

);


});




// ===============================
// FINALIZAÇÃO
// ===============================


// O Firebase mantém os dados
// atualizados automaticamente
// através do onSnapshot().
);
