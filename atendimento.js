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
const dados = document.getElementById("dados");



// =================================
// CARREGAR PACIENTE EM ATENDIMENTO
// =================================

async function carregarPaciente(){


const busca = query(

collection(db,"pacientes"),

where("status","==","Em atendimento")

);



const resultado = await getDocs(busca);



if(resultado.empty){


nome.innerHTML="Nenhum paciente em atendimento";

dados.innerHTML="";

return;

}



resultado.forEach((item)=>{


pacienteAtual={

id:item.id,

...item.data()

};


});




nome.innerHTML = pacienteAtual.nome;



dados.innerHTML = `

Modalidade:
<b>${pacienteAtual.modalidade || "-"}</b>

<br><br>

Queixa:
<b>${pacienteAtual.queixa || "-"}</b>

<br><br>

Maca:
<b>${pacienteAtual.maca || "-"}</b>

`;



}



carregarPaciente();







// =================================
// LIBERAR MACA
// =================================

async function liberarMaca(numero){


console.log(
"Tentando liberar maca:",
numero
);



const macas = await getDocs(

collection(db,"macas")

);



for(const item of macas.docs){



const maca = item.data();



console.log(
"Maca encontrada:",
maca
);





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



console.log(

"Maca liberada:",

maca.numero

);



}



}



}









// =================================
// FINALIZAR ATENDIMENTO
// =================================

window.salvarAtendimento = async function(){



if(!pacienteAtual){


alert(
"Nenhum paciente em atendimento."
);


return;

}





const conduta =

document.getElementById("conduta").value;




const observacoes =

document.getElementById("observacoes").value;






try{





// Criar atendimento

const atendimentoCriado = await addDoc(

collection(db,"atendimentos"),

{


pacienteId:

pacienteAtual.id,


paciente:

pacienteAtual.nome,


modalidade:

pacienteAtual.modalidade || "",


queixa:

pacienteAtual.queixa || "",


maca:

pacienteAtual.maca || "",


conduta,


observacoes,


membro:

"Administrador LADRF",


data:

Timestamp.now()


}

);






// Finalizar paciente

await updateDoc(

doc(db,"pacientes",pacienteAtual.id),

{


status:"Finalizado"


}

);






// Liberar maca

await liberarMaca(

pacienteAtual.maca

);







// GERAR QR CODE

const qr = document.getElementById("qrcode");



const link =

"https://ladrffamp.github.io/ladrf-connect/avaliacao.html?id="

+

atendimentoCriado.id;





if(qr && typeof QRCode !== "undefined"){


qr.innerHTML="";



new QRCode(qr,{


text:link,


width:200,


height:200


});


}






alert(

"Atendimento finalizado, maca liberada e QR Code criado."

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
