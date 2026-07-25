import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
addDoc,
Timestamp,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// VARIÁVEIS
// =====================================

let pacienteAtual = null;


const campoNome = document.getElementById("nome");

const resultadoPacientes =
document.getElementById("resultadoPacientes");



// =====================================
// BUSCAR PACIENTE PELO NOME
// =====================================

if(campoNome && resultadoPacientes){


campoNome.addEventListener("input", async()=>{


const texto =
campoNome.value.toLowerCase().trim();



if(texto.length < 3){

resultadoPacientes.innerHTML = "";

return;

}



try{


const lista = await getDocs(
collection(db,"pacientes")
);



resultadoPacientes.innerHTML="";



lista.forEach((item)=>{


const paciente = item.data();



if(
paciente.nome &&
paciente.nome.toLowerCase().includes(texto)
){


const div = document.createElement("div");


div.className="lista-item";


div.textContent =
paciente.nome;



div.onclick = ()=>{


pacienteAtual = {

id:item.id,

...paciente

};



campoNome.value =
paciente.nome;



document.getElementById("idade").value =
paciente.idade || "";



document.getElementById("sexo").value =
paciente.sexo || "";



document.getElementById("modalidade").value =
paciente.modalidade || "";



if(document.getElementById("maca")){

document.getElementById("maca").value =
paciente.maca || "";

}



resultadoPacientes.innerHTML="";


};



resultadoPacientes.appendChild(div);



}


});


}catch(error){


console.error(
"Erro ao buscar pacientes:",
error
);


}



});


}






// =====================================
// CARREGAR PACIENTE EM ATENDIMENTO
// =====================================


async function carregarPaciente(){


try{


const busca = query(

collection(db,"pacientes"),

where(
"status",
"==",
"Em atendimento"
)

);



const resultado = await getDocs(busca);



if(resultado.empty){

return;

}



resultado.forEach((item)=>{


pacienteAtual = {

id:item.id,

...item.data()

};


});



if(!pacienteAtual){

return;

}



campoNome.value =
pacienteAtual.nome || "";



document.getElementById("idade").value =
pacienteAtual.idade || "";



document.getElementById("sexo").value =
pacienteAtual.sexo || "";



document.getElementById("modalidade").value =
pacienteAtual.modalidade || "";



if(document.getElementById("maca")){

document.getElementById("maca").value =
pacienteAtual.maca || "";

}



if(document.getElementById("inicio")){


document.getElementById("inicio").value =

new Date().toLocaleTimeString(
"pt-BR",
{
hour:"2-digit",
minute:"2-digit"
}
);


}



}catch(error){


console.error(
"Erro ao carregar paciente:",
error
);


}


}



carregarPaciente();
// =====================================
// PEGAR CHECKBOXES
// =====================================

function pegarSelecionados(nomeCampo){


const selecionados = [];



document
.querySelectorAll(`input[name="${nomeCampo}"]:checked`)
.forEach((item)=>{


selecionados.push(item.value);


});



return selecionados;


}






// =====================================
// LIBERAR MACA
// =====================================

async function liberarMaca(numero){


if(!numero){

return;

}



try{


const macas = await getDocs(

collection(db,"macas")

);



for(const item of macas.docs){


const maca = item.data();



if(
Number(maca.numero) === Number(numero)
){



await updateDoc(

doc(db,"macas",item.id),

{

status:"Livre",

paciente:""

}

);



}


}



}catch(error){


console.error(
"Erro ao liberar maca:",
error
);


}



}








// =====================================
// FINALIZAR ATENDIMENTO
// =====================================


window.salvarAtendimento = async function(){



if(!pacienteAtual){


alert(
"Selecione um paciente antes de finalizar."
);


return;


}






const dados = {


pacienteId:

pacienteAtual.id,



paciente:

pacienteAtual.nome,



idade:

document.getElementById("idade")?.value || "",



sexo:

document.getElementById("sexo")?.value || "",



modalidade:

document.getElementById("modalidade")?.value || "",



evento:

document.getElementById("evento")?.value || "",



membro:

document.getElementById("membro")?.value || "",



maca:

document.getElementById("maca")?.value || "",



inicio:

document.getElementById("inicio")?.value || "",



termino:

document.getElementById("termino")?.value || "",



queixa:

pegarSelecionados("queixa"),



lado:

document.querySelector(
'input[name="lado"]:checked'
)?.value || "",



lesao:

pegarSelecionados("lesao"),



condutas:

pegarSelecionados("conduta"),



eva:

Number(
document.getElementById("eva")?.value || 0
),



observacoes:

document.getElementById("observacoes")?.value || "",



situacaoFinal:

document.querySelector(
'input[name="situacao"]:checked'
)?.value || "",



data:

Timestamp.now()



};






try{


// SALVAR ATENDIMENTO

const atendimentoCriado = await addDoc(

collection(db,"atendimentos"),

dados

);






// LINK AVALIAÇÃO

const linkAvaliacao =


`https://ladrffamp.github.io/ladrf-connect/avaliacao.html?id=${atendimentoCriado.id}`;






await updateDoc(

doc(
db,
"atendimentos",
atendimentoCriado.id
),

{

linkAvaliacao

}

);






// ATUALIZA PACIENTE


await updateDoc(

doc(
db,
"pacientes",
pacienteAtual.id
),

{

status:"Finalizado"

}

);







// LIBERA MACA


await liberarMaca(
dados.maca
);






// MOSTRAR QR CODE


const area =
document.getElementById("areaAvaliacao");


const qr =
document.getElementById("qrcode");


const link =
document.getElementById("linkAvaliacao");





if(area){

area.style.display="block";

}



if(link){

link.href =
linkAvaliacao;

}





if(qr && typeof QRCode !== "undefined"){


qr.innerHTML="";



new QRCode(qr,{

text:linkAvaliacao,

width:250,

height:250

});


}


  
  // =====================================
// BOTÃO PRÓXIMO ATENDIMENTO
// =====================================

const botaoProximo = document.getElementById("proximoAtendimento");

if (botaoProximo) {

    botaoProximo.style.display = "inline-block";

    botaoProximo.onclick = () => {

        window.location.reload();

    };

}






alert(
"Atendimento finalizado! QR Code gerado."
);




}catch(error){


console.error(error);


alert(

"Erro ao finalizar atendimento: "

+error.message

);


}



};
// =====================================
// VERIFICAÇÃO FINAL DA PÁGINA
// =====================================


// Garante que o botão próximo começa escondido

const botaoProximoInicial =
document.getElementById("proximoAtendimento");


if(botaoProximoInicial){

botaoProximoInicial.style.display="none";

}



// =====================================
// LIMPAR FORMULÁRIO PARA PRÓXIMO PACIENTE
// =====================================

window.proximoAtendimento = function(){


window.location.reload();


};




// =====================================
// ATUALIZAR HORA DO CABEÇALHO
// =====================================

function atualizarHora(){


const hora =
document.getElementById("horaAtual");



if(hora){


hora.innerHTML =

new Date().toLocaleTimeString(
"pt-BR"
);


}


}



setInterval(
atualizarHora,
1000
);


atualizarHora();
