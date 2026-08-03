import { db } from "./firebase.js";


import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp,
  getDocs,
  deleteDoc,
  doc
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
  collection(db, "membros"),
  (snapshot) => {

    membros = [];

    selectMembro.innerHTML = `
      <option value="">
        Selecione o membro
      </option>
    `;


    snapshot.forEach((doc) => {

      const dados = doc.data();


      membros.push({
        id: doc.id,
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
  collection(db, "agenda"),
  (snapshot) => {

    eventos = [];


    selectEvento.innerHTML = `
      <option value="">
        Selecione o evento
      </option>
    `;


    snapshot.forEach((doc) => {

      const dados = doc.data();


      eventos.push({
        id: doc.id,
        ...dados
      });


      selectEvento.innerHTML += `
        <option value="${doc.id}">
          ${dados.titulo}
        </option>
      `;


    });

  }
);


// ===============================
// CARGA HORÁRIA AUTOMÁTICA
// ===============================

selectEvento.addEventListener(
"change",
()=>{


const evento = eventos.find(
e => e.id === selectEvento.value
);


if(!evento){

cargaHoraria.value="";
return;

}


if(evento.inicio && evento.fim){


const inicio = evento.inicio.split(":");
const fim = evento.fim.split(":");


const minutosInicio =
Number(inicio[0]) * 60 +
Number(inicio[1]);


const minutosFim =
Number(fim[0]) * 60 +
Number(fim[1]);


const total =
minutosFim - minutosInicio;


if(total > 0){

cargaHoraria.value =
(total / 60) + " horas";

}

}


}
);


  // ===============================
// GERAR NÚMERO DO CERTIFICADO
// ===============================

async function gerarNumeroCertificado(){

  const ano = new Date().getFullYear();


  const certificados =
  await getDocs(
    collection(db,"certificados")
  );


  let maior = 0;


  certificados.forEach((doc)=>{

    const dados = doc.data();


    if(dados.numeroCertificado){

      const partes =
      dados.numeroCertificado.split("-");


      const numero =
      Number(partes[2]);


      if(numero > maior){

        maior = numero;

      }

    }

  });



  const proximo =
  maior + 1;



  return `LADRF-${ano}-${String(proximo).padStart(4,"0")}`;

}



// ===============================
// GERAR CERTIFICADO
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



if(!membro || !evento){


alert(
"Erro ao localizar dados."
);


return;


}



const data =
new Date()
.toLocaleDateString("pt-BR");



const numeroCertificado =
await gerarNumeroCertificado();




// ===============================
// SALVAR FIRESTORE
// ===============================

await addDoc(

collection(db,"certificados"),

{

numeroCertificado,

membroId:
membro.id,

membro:
membro.nome,

eventoId:
evento.id,

evento:
evento.titulo,

cargaHoraria:
carga,

dataEmissao:
data,

criadoEm:
Timestamp.now(),

status:
"Disponível"

}

);


// ===============================
// CRIAR PDF HORIZONTAL
// ===============================


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


const altura =
210;



pdf.setLineWidth(1);


pdf.rect(
10,
10,
277,
190
);



// TÍTULO

pdf.setFont(
"helvetica",
"bold"
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



// NÚMERO

pdf.setFont(
"helvetica",
"normal"
);


pdf.setFontSize(12);


pdf.text(
`Certificado nº ${numeroCertificado}`,
largura/2,
78,
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




// BAIXAR PDF

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

emitirTodos.addEventListener(
"click",
async()=>{


const eventoId =
selectEvento.value;


const carga =
cargaHoraria.value;



if(!eventoId || !carga){

alert(
"Selecione um evento e aguarde a carga horária."
);

return;

}



const evento =
eventos.find(
e=>e.id===eventoId
);



if(!evento){

alert(
"Evento não encontrado."
);

return;

}



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



const ano =
new Date().getFullYear();



const certificados =
await getDocs(
collection(db,"certificados")
);



let contador =
certificados.size + 1;



for(
const membro of membrosAtivos
){


const numero =
`LADRF-${ano}-${String(contador).padStart(4,"0")}`;



await addDoc(
collection(db,"certificados"),
{

numeroCertificado:

numero,


membroId:

membro.id,


membro:

membro.nome,


eventoId:

evento.id,


evento:

evento.titulo,


cargaHoraria:

carga,


dataEmissao:

new Date()
.toLocaleDateString("pt-BR"),


criadoEm:

Timestamp.now(),


status:

"Disponível"

}

);



contador++;


}



alert(
`${membrosAtivos.length} certificados emitidos!`
);



}
);
// ===============================
// LISTAR CERTIFICADOS
// ===============================


onSnapshot(
collection(db,"certificados"),
(snapshot)=>{


listaCertificados.innerHTML="";


if(snapshot.empty){

listaCertificados.innerHTML=`

<tr>

<td colspan="5">

Nenhum certificado emitido.

</td>

</tr>

`;

return;

}


snapshot.forEach(
(doc)=>{

const c = doc.data();


// ignora certificados antigos sem membro

if(!c.membro){

return;

}


listaCertificados.innerHTML += `

<tr>

<td>
${c.numeroCertificado || "-"}
</td>

<td>
${c.membro || c.nome || "-"}
</td>

<td>
${c.evento || "-"}
</td>

<td>
${c.cargaHoraria || c.horas || "-"}
</td>

<td>
${c.dataEmissao || c.data || "-"}
</td>

<td>

<button
class="excluir"
onclick="excluirCertificado('${doc.id}')">

🗑️ Excluir

</button>

</td>

</tr>

`;

});

}
);


console.log(
"LADRF Certificados carregado com sucesso!"
);


// =====================================
// EXCLUIR CERTIFICADO
// =====================================

window.excluirCertificado = async function(id){


const confirmar = confirm(
"Deseja excluir este certificado?"
);


if(!confirmar){
return;
}


try{


await deleteDoc(
doc(
db,
"certificados",
id
)
);


alert(
"Certificado excluído com sucesso!"
);


}

catch(error){

console.error(error);

alert(
"Erro ao excluir certificado."
);

}


};