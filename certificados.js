import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ELEMENTOS

const selectMembro = document.getElementById("membro");
const selectEvento = document.getElementById("evento");
const cargaHoraria = document.getElementById("cargaHoraria");
const gerarCertificado = document.getElementById("gerarCertificado");
const emitirTodos = document.getElementById("emitirTodos");
const listaCertificados = document.getElementById("listaCertificados");


// DADOS

let membros = [];
let eventos = [];


// ===============================
// CARREGAR MEMBROS
// ===============================

onSnapshot(
  collection(db,"membros"),
  (snapshot)=>{


    membros = [];


    selectMembro.innerHTML = `
      <option value="">
        Selecione o membro
      </option>
    `;



    snapshot.forEach((doc)=>{


      const dados = doc.data();


      membros.push({
        id:doc.id,
        ...dados
      });



      selectMembro.innerHTML += `
        <option value="${doc.id}">
          ${dados.nome}
        </option>
      `;


    });


  }
);



// ===============================
// CARREGAR EVENTOS
// ===============================

onSnapshot(
  collection(db,"agenda"),
  (snapshot)=>{


    eventos = [];


    selectEvento.innerHTML = `
      <option value="">
        Selecione o evento
      </option>
    `;



    snapshot.forEach((doc)=>{


      const dados = doc.data();


      eventos.push({
        id:doc.id,
        ...dados
      });



      selectEvento.innerHTML += `
        <option value="${doc.id}">
          ${dados.titulo}
        </option>
      `;


    });


  }
  // ===============================
// CARGA HORÁRIA AUTOMÁTICA
// ===============================

selectEvento.addEventListener(
"change",
()=>{


const evento =
eventos.find(
e=>e.id===selectEvento.value
);



if(!evento){

cargaHoraria.value="";

return;

}



if(
evento.inicio &&
evento.fim
){


const inicio =
evento.inicio.split(":");


const fim =
evento.fim.split(":");



const inicioMinutos =
Number(inicio[0])*60+
Number(inicio[1]);



const fimMinutos =
Number(fim[0])*60+
Number(fim[1]);



const total =
fimMinutos-inicioMinutos;



if(total>0){


cargaHoraria.value =
(total/60)+" horas";


}


}



});



// ===============================
// GERAR NÚMERO CERTIFICADO
// ===============================

async function gerarNumero(){


const ano =
new Date().getFullYear();



const certificados =
await getDocs(
collection(db,"certificados")
);



return (
"LADRF-" +
ano +
"-" +
String(certificados.size+1)
.padStart(4,"0")
);


}



// ===============================
// GERAR CERTIFICADO INDIVIDUAL
// ===============================

gerarCertificado.addEventListener(
"click",
async()=>{


const membroId =
selectMembro.value;


const eventoId =
selectEvento.value;


const carga =
cargaHoraria.value;



if(
!membroId ||
!eventoId ||
!carga
){


alert(
"Preencha todos os campos."
);


return;

}



const membro =
membros.find(
m=>m.id===membroId
);



const evento =
eventos.find(
e=>e.id===eventoId
);



const numero =
await gerarNumero();



const data =
new Date()
.toLocaleDateString("pt-BR");



await addDoc(
collection(db,"certificados"),
{

numeroCertificado:
numero,

membro:
membro.nome,

evento:
evento.titulo,

cargaHoraria:
carga,

dataEmissao:
data,

criadoEm:
Timestamp.now()

}

);



const {jsPDF} =
window.jspdf;



const pdf =
new jsPDF({

orientation:"landscape",

unit:"mm",

format:"a4"

});


const largura =
297;


pdf.setLineWidth(1);


pdf.rect(
10,
10,
277,
190
);



pdf.setFontSize(28);


pdf.text(
"LADRF",
largura/2,
45,
{
align:"center"
}
);



pdf.setFontSize(24);


pdf.text(
"CERTIFICADO",
largura/2,
65,
{
align:"center"
}
);



pdf.setFontSize(12);


pdf.text(
`Certificado nº ${numero}`,
largura/2,
80,
{
align:"center"
}
);



pdf.setFontSize(16);


pdf.text(
"Certificamos que",
largura/2,
100,
{
align:"center"
}
);
  pdf.setFont(
"helvetica",
"bold"
);


pdf.setFontSize(22);


pdf.text(
membro.nome,
largura/2,
120,
{
align:"center"
}
);



pdf.setFont(
"helvetica",
"normal"
);


pdf.setFontSize(16);


pdf.text(
"participou da atividade:",
largura/2,
140,
{
align:"center"
}
);



pdf.setFont(
"helvetica",
"bold"
);


pdf.setFontSize(18);


pdf.text(
evento.titulo,
largura/2,
155,
{
align:"center"
}
);



pdf.setFont(
"helvetica",
"normal"
);


pdf.setFontSize(14);


pdf.text(
`Carga horária: ${carga}`,
largura/2,
170,
{
align:"center"
}
);



pdf.text(
`Emitido em: ${data}`,
60,
190
);



pdf.line(
190,
185,
260,
185
);



pdf.text(
"Coordenação LADRF",
225,
195,
{
align:"center"
}
);



pdf.save(
`Certificado_${membro.nome}.pdf`
);



alert(
"Certificado gerado com sucesso!"
);



}
);



// ===============================
// EMITIR PARA TODOS OS MEMBROS
// ===============================

if(emitirTodos){


emitirTodos.addEventListener(
"click",
async()=>{


const eventoId =
selectEvento.value;


const carga =
cargaHoraria.value;



if(
!eventoId ||
!carga
){

alert(
"Selecione um evento."
);

return;

}



const evento =
eventos.find(
e=>e.id===eventoId
);



const membrosAtivos =
membros.filter(
m=>m.status==="Ativo"
);



if(membrosAtivos.length===0){

alert(
"Nenhum membro ativo encontrado."
);

return;

}



const certificados =
await getDocs(
collection(db,"certificados")
);



let numero =
certificados.size+1;



for(
const membro of membrosAtivos
){


const existe =
await getDocs(
query(
collection(db,"certificados"),
where(
"membro",
"==",
membro.nome
),
where(
"evento",
"==",
evento.titulo
)
)
);



if(existe.empty){


await addDoc(
collection(db,"certificados"),
{

numeroCertificado:
`LADRF-${new Date().getFullYear()}-${String(numero).padStart(4,"0")}`,

membro:
membro.nome,

evento:
evento.titulo,

cargaHoraria:
carga,

dataEmissao:
new Date()
.toLocaleDateString("pt-BR"),

criadoEm:
Timestamp.now()

}

);



numero++;


}



}



alert(
"Certificados emitidos para os membros ativos!"
);



}
);


}
  // ===============================
// LISTAR CERTIFICADOS
// ===============================

onSnapshot(
collection(db,"certificados"),
(snapshot)=>{


listaCertificados.innerHTML = "";



if(snapshot.empty){


listaCertificados.innerHTML = `

<tr>

<td colspan="4">

Nenhum certificado emitido.

</td>

</tr>

`;

return;

}



snapshot.forEach((doc)=>{


const certificado =
doc.data();



listaCertificados.innerHTML += `

<tr>

<td>
${certificado.numeroCertificado || "-"}
</td>


<td>
${certificado.membro || "-"}
</td>


<td>
${certificado.evento || "-"}
</td>


<td>
${certificado.dataEmissao || "-"}
</td>


</tr>

`;



});


}
);



console.log(
"LADRF Certificados atualizado com sucesso!"
);
);
