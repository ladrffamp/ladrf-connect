import { db } from "./firebase.js";

import {
collection,
onSnapshot,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const eventosRef = collection(db,"eventos");
const pacientesRef = collection(db,"pacientes");
const atendimentosRef = collection(db,"atendimentos");
const materiaisRef = collection(db,"materiais");



let eventos = [];
let pacientes = [];
let atendimentos = [];
let materiais = [];



const tabelaEventos = document.getElementById("tabelaEventos");




// ===============================
// EVENTOS
// ===============================


onSnapshot(
query(eventosRef,orderBy("data")),
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

);




// ===============================
// PACIENTES
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
// ATENDIMENTOS
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
// MATERIAIS
// ===============================


onSnapshot(
materiaisRef,
(snapshot)=>{


materiais=[];


snapshot.forEach((doc)=>{


materiais.push({

id:doc.id,

...doc.data()

});


});


}

);
// ===============================
// ATUALIZAR TABELA DE EVENTOS
// ===============================


function atualizarTabela(){


if(!tabelaEventos){

return;

}


tabelaEventos.innerHTML="";



if(eventos.length===0){


tabelaEventos.innerHTML=`

<tr>

<td colspan="3" style="text-align:center;padding:20px">

Nenhum evento encontrado

</td>

</tr>

`;

return;

}




eventos.forEach((evento)=>{


const totalPacientes = pacientes.filter(

p=>p.evento===evento.nome

).length;



const totalAtendimentos = atendimentos.filter(

a=>a.evento===evento.nome

).length;




tabelaEventos.innerHTML += `

<tr>

<td>${evento.nome || "Evento"}</td>

<td>${totalPacientes}</td>

<td>${totalAtendimentos}</td>

</tr>

`;



});


}




// ===============================
// GERAR PDF PROFISSIONAL
// ===============================


document.getElementById("gerarPDF").onclick=()=>{


const { jsPDF } = window.jspdf;



const pdf = new jsPDF();




pdf.setFontSize(20);


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



pdf.setFontSize(11);


pdf.text(
"Liga Acadêmica de Desporto e Reabilitação na Fisioterapia",
20,
48
);



pdf.line(
20,
55,
190,
55
);




pdf.setFontSize(13);


pdf.text(
"Resumo Geral",
20,
70
);



pdf.setFontSize(12);


pdf.text(
"Data: "+new Date().toLocaleDateString(),
20,
85
);



pdf.text(
"Eventos: "+eventos.length,
20,
100
);



pdf.text(
"Pacientes: "+pacientes.length,
20,
115
);



pdf.text(
"Atendimentos: "+atendimentos.length,
20,
130
);



pdf.text(
"Estatísticas por modalidade",
20,
170
);


let yModalidade = 185;


const modalidades = [...new Set(
pacientes.map(p=>p.modalidade)
)];


modalidades.forEach((modalidade)=>{


const total = pacientes.filter(

p=>p.modalidade===modalidade

).length;



pdf.text(

`${modalidade}: ${total} pacientes`,

20,

yModalidade

);



yModalidade += 10;


});



let y=170;



eventos.forEach((evento)=>{


const qtdPacientes = pacientes.filter(

p=>p.evento===evento.nome

).length;



const qtdAtendimentos = atendimentos.filter(

a=>a.evento===evento.nome

).length;



pdf.text(

`${evento.nome}: ${qtdPacientes} pacientes | ${qtdAtendimentos} atendimentos`,

20,

y

);



y+=10;



if(y>280){

pdf.addPage();

y=20;

}


});



pdf.save(
"Relatorio_LADRF_Connect.pdf"
);



};
// ===============================
// GERAR EXCEL COMPLETO
// ===============================


document.getElementById("gerarExcel").onclick=()=>{



const arquivo = XLSX.utils.book_new();




// ===============================
// ABA EVENTOS
// ===============================


const dadosEventos = eventos.map((evento)=>{


return {


Evento:evento.nome || "",

Data:evento.data || "",

Pacientes:pacientes.filter(

p=>p.evento===evento.nome

).length,

Atendimentos:atendimentos.filter(

a=>a.evento===evento.nome

).length


};


});



const abaEventos = XLSX.utils.json_to_sheet(dadosEventos);



XLSX.utils.book_append_sheet(

arquivo,

abaEventos,

"Eventos"

);






// ===============================
// ABA PACIENTES
// ===============================


const dadosPacientes = pacientes.map((p)=>{


return {


Nome:p.nome || "",

WhatsApp:p.whatsapp || "",

Idade:p.idade || "",

Modalidade:p.modalidade || "",

Queixa:p.queixa || "",

Status:p.status || "",

Evento:p.evento || ""


};


});


return {


Nome:p.nome || "",

WhatsApp:p.whatsapp || "",

Modalidade:p.modalidade || "",

Queixa:p.queixa || "",

Status:p.status || "",

Evento:p.evento || ""


};


});



const abaPacientes = XLSX.utils.json_to_sheet(dadosPacientes);



XLSX.utils.book_append_sheet(

arquivo,

abaPacientes,

"Pacientes"

);






// ===============================
// ABA ATENDIMENTOS
// ===============================


const dadosAtendimentos = atendimentos.map((a)=>{


return {


Paciente:a.paciente || "",

Evento:a.evento || "",

Data:a.data || "",

Membro:a.membro || "",

Observacao:a.observacao || ""


};


});



const abaAtendimentos = XLSX.utils.json_to_sheet(dadosAtendimentos);



XLSX.utils.book_append_sheet(

arquivo,

abaAtendimentos,

"Atendimentos"

);






// ===============================
// ABA MATERIAIS
// ===============================


const dadosMateriais = materiais.map((m)=>{


return {


Material:m.nome || "",

Categoria:m.categoria || "",

Quantidade:m.quantidade || 0,

Unidade:m.unidade || "",

EstoqueMinimo:m.minimo || 0


};


});



const abaMateriais = XLSX.utils.json_to_sheet(dadosMateriais);



XLSX.utils.book_append_sheet(

arquivo,

abaMateriais,

"Materiais"

);




XLSX.writeFile(

arquivo,

"Relatorio_LADRF_Completo.xlsx"

);



};
// ===============================
// ATUALIZAR ESTATÍSTICAS
// ===============================


document.getElementById("carregarDados").onclick=()=>{


atualizarTabela();


alert("Dados atualizados com sucesso!");



};
