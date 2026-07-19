import { db } from "./firebase.js";


import {

collection,

onSnapshot,

addDoc,

Timestamp

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const selectMembro = document.getElementById("membro");

const selectEvento = document.getElementById("evento");

const gerar = document.getElementById("gerarCertificado");

const lista = document.getElementById("listaCertificados");



let membros = [];

let eventos = [];




// ===============================
// CARREGAR MEMBROS
// ===============================


onSnapshot(

collection(db,"membros"),

(snapshot)=>{


membros=[];


selectMembro.innerHTML=

`

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



selectMembro.innerHTML +=

`

<option value="${dados.nome}">

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

collection(db,"eventos"),

(snapshot)=>{


eventos=[];


selectEvento.innerHTML=

`

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



selectEvento.innerHTML +=

`

<option value="${dados.nome}">

${dados.nome}

</option>

`;



});


}

// ===============================
// GERAR CERTIFICADO PDF
// ===============================


gerar.onclick = async()=>{


const nome = selectMembro.value;

const evento = selectEvento.value;

const carga = document.getElementById("cargaHoraria").value;



if(!nome || !evento || !carga){


alert("Preencha todos os campos");

return;


}



const data = new Date().toLocaleDateString();



try{


// SALVAR HISTÓRICO FIREBASE


await addDoc(

collection(db,"certificados"),

{


nome:nome,

evento:evento,

cargaHoraria:carga,

data:data,

criadoEm:Timestamp.now()


}

);




// GERAR PDF


const { jsPDF } = window.jspdf;


const pdf = new jsPDF();




pdf.setFontSize(22);


pdf.text(

"CERTIFICADO",

105,

40,

{

align:"center"

}

);




pdf.setFontSize(14);


pdf.text(

"Certificamos que",

105,

70,

{

align:"center"

}

);




pdf.setFontSize(18);


pdf.text(

nome,

105,

90,

{

align:"center"

}

);




pdf.setFontSize(14);


pdf.text(

"participou da atividade:",

105,

115,

{

align:"center"

}

);




pdf.setFontSize(16);


pdf.text(

evento,

105,

135,

{

align:"center"

}

);




pdf.setFontSize(14);


pdf.text(

`Carga horária: ${carga}`,

105,

160,

{

align:"center"

}

);




pdf.text(

"LADRF - Liga Acadêmica de Desporto e Reabilitação na Fisioterapia",

105,

200,

{

align:"center"

}

);



pdf.text(

"Data: "+data,

105,

220,

{

align:"center"

}

);





pdf.save(

`Certificado_${nome}.pdf`

);




alert(

"Certificado gerado com sucesso!"

);



};



// ===============================
// LISTAR CERTIFICADOS
// ===============================


onSnapshot(

collection(db,"certificados"),

(snapshot)=>{


lista.innerHTML="";



if(snapshot.empty){


lista.innerHTML=`

<tr>

<td colspan="4">

Nenhum certificado emitido

</td>

</tr>

`;

return;


}



snapshot.forEach((doc)=>{


const c = doc.data();



lista.innerHTML += `


<tr>


<td>

${c.nome}

</td>



<td>

${c.evento}

</td>



<td>

${c.data}

</td>



<td>

PDF emitido

</td>


</tr>


`;



});



}

);
);
