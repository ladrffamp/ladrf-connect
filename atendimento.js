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

resultadoPacientes.innerHTML="";

return;

}



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


div.innerHTML =
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



resultadoPacientes.innerHTML="";


};



resultadoPacientes.appendChild(div);



}



});


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





if(pacienteAtual){


campoNome.value =
pacienteAtual.nome || "";



document.getElementById("idade").value =
pacienteAtual.idade || "";



document.getElementById("sexo").value =
pacienteAtual.sexo || "";



document.getElementById("modalidade").value =
pacienteAtual.modalidade || "";



document.getElementById("maca").value =
pacienteAtual.maca || "";



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
// PEGAR CHECKBOX
// =====================================

function pegarSelecionados(nomeCampo){


const lista = [];



document
.querySelectorAll(
`input[name="${nomeCampo}"]:checked`
)
.forEach((item)=>{


lista.push(item.value);


});



return lista;

}








// =====================================
// LIBERAR MACA
// =====================================

async function liberarMaca(numero){


if(!numero) return;



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
document.getElementById("idade").value,


sexo:
document.getElementById("sexo").value,


modalidade:
document.getElementById("modalidade").value,


evento:
document.getElementById("evento").value,


membro:
document.getElementById("membro").value,


maca:
document.getElementById("maca").value,


inicio:
document.getElementById("inicio").value,


termino:
document.getElementById("termino").value,


queixa:
pegarSelecionados("queixa"),


lesao:
pegarSelecionados("lesao"),


condutas:
pegarSelecionados("conduta"),


eva:
Number(
document.getElementById("eva").value
),


observacoes:
document.getElementById("observacoes").value,


data:
Timestamp.now()


};





try{



// SALVAR ATENDIMENTO

const atendimento = await addDoc(

collection(db,"atendimentos"),

dados

);







// LINK DA AVALIAÇÃO

const linkAvaliacao =

`https://ladrffamp.github.io/ladrf-connect/avaliacao.html?id=${atendimento.id}`;







await updateDoc(

doc(
db,
"atendimentos",
atendimento.id
),

{

linkAvaliacao

}

);







// FINALIZAR PACIENTE


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







// LIBERAR MACA

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








// BOTÃO PRÓXIMO ATENDIMENTO


let botao =
document.getElementById(
"proximoAtendimento"
);



if(!botao){


botao =
document.createElement("button");


botao.id =
"proximoAtendimento";


botao.className =
"btn-success";


botao.innerHTML =
"➡️ Próximo Atendimento";



botao.style.marginTop =
"20px";



area.appendChild(botao);



}



botao.onclick = ()=>{


window.location.reload();


};







alert(
"Atendimento finalizado! QR Code gerado."
);





}catch(error){



console.error(error);



alert(
"Erro ao finalizar atendimento: "
+
error.message
);



}



};
