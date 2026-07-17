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


let pacienteAtual = null;



const nome = document.getElementById("nome");





// =====================================
// CARREGAR PACIENTE EM ATENDIMENTO
// =====================================

async function carregarPaciente(){


const busca = query(

collection(db,"pacientes"),

where("status","==","Em atendimento")

);



const resultado = await getDocs(busca);



if(resultado.empty){


nome.innerHTML =
"Nenhum paciente em atendimento";


return;

}



resultado.forEach((item)=>{


pacienteAtual = {

id:item.id,

...item.data()

};


});



nome.value = pacienteAtual.nome || "";



if(document.getElementById("modalidade")){

document.getElementById("modalidade").value =
pacienteAtual.modalidade || "";

}



if(document.getElementById("maca")){

document.getElementById("maca").value =
pacienteAtual.maca || "";

}



if(document.getElementById("inicio")){

document.getElementById("inicio").value =
new Date().toLocaleTimeString("pt-BR",
{
hour:"2-digit",
minute:"2-digit"
});

}


}



carregarPaciente();








// =====================================
// PEGAR CHECKBOX
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



const macas = await getDocs(

collection(db,"macas")

);



for(const item of macas.docs){


const maca=item.data();



if(Number(maca.numero) === Number(numero)){



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
"Nenhum paciente em atendimento."
);


return;

}






const lado =

document.querySelector(
'input[name="lado"]:checked'
)?.value || "";





const situacao =

document.querySelector(
'input[name="situacao"]:checked'
)?.value || "";






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

document.getElementById("maca")?.value || pacienteAtual.maca || "",



inicio:

document.getElementById("inicio")?.value || "",



termino:

document.getElementById("termino")?.value || "",



queixa:

pegarSelecionados("queixa"),



lado,



lesao:

pegarSelecionados("lesao"),



eva:

Number(
document.getElementById("eva")?.value || 0
),



condutas:

pegarSelecionados("conduta"),



observacoes:

document.getElementById("observacoes")?.value || "",



situacaoFinal:

situacao,



data:

Timestamp.now()


};






try{



const atendimentoCriado = await addDoc(

collection(db,"atendimentos"),

dados

);





await updateDoc(

doc(db,"pacientes",pacienteAtual.id),

{

status:"Finalizado"

}

);






await liberarMaca(

dados.maca

);







const qr =

document.getElementById("qrcode");



if(qr && typeof QRCode !== "undefined"){



const link =

`https://ladrffamp.github.io/ladrf-connect/avaliacao.html?id=${atendimentoCriado.id}`;



qr.innerHTML="";



new QRCode(

qr,

{

text:link,

width:200,

height:200

}

);


}







alert(

"Atendimento finalizado com sucesso!"

);



window.location.href="index.html";





}catch(error){



console.error(error);



alert(

"Erro ao finalizar atendimento: "

+error.message

);



}



};
