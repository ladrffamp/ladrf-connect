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


let eventos = [];
let pacientes = [];
let atendimentos = [];

const tabelaEventos = document.getElementById("tabelaEventos");




// EVENTOS

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

);




// PACIENTES

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




// ATENDIMENTOS

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




// TABELA

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


let totalPacientes = pacientes.filter(
p=>p.evento===evento.nome
).length;


let totalAtendimentos = atendimentos.filter(
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




// PDF

document.getElementById("gerarPDF").onclick=()=>{


const { jsPDF } = window.jspdf;


const pdf = new jsPDF();


pdf.text(
"LADRF Connect 2.0",
20,
20
);


pdf.text(
"Relatório de atendimentos",
20,
35
);


pdf.text(
"Pacientes: " + pacientes.length,
20,
50
);


pdf.text(
"Atendimentos: " + atendimentos.length,
20,
65
);



pdf.save("relatorio_ladrf.pdf");


};





// EXCEL

document.getElementById("gerarExcel").onclick=()=>{


const dados = eventos.map(evento=>({

Evento:evento.nome || "",

Pacientes: pacientes.filter(
p=>p.evento===evento.nome
).length,

Atendimentos: atendimentos.filter(
a=>a.evento===evento.nome
).length

}));


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


};





// ATUALIZAR

document.getElementById("carregarDados").onclick=()=>{

atualizarTabela();

alert("Dados atualizados!");

};
