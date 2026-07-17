import { db, auth } from "./firebase.js";


import {

collection,
query,
where,
onSnapshot,
addDoc,
Timestamp,
doc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let pacienteAtual = null;



const nome =
document.getElementById("nome");


const dados =
document.getElementById("dados");





// Buscar paciente em atendimento

const consulta = query(

collection(db,"pacientes"),

where("status","==","Em atendimento")

);



onSnapshot(consulta,(snapshot)=>{



if(snapshot.empty){

nome.innerHTML="Nenhum paciente em atendimento";

dados.innerHTML="";

pacienteAtual=null;

return;

}



snapshot.forEach((item)=>{


pacienteAtual={

id:item.id,

...item.data()

};



nome.innerHTML =
pacienteAtual.nome;



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



});


});







// Buscar nome do membro

async function buscarMembro(){


const usuario = auth.currentUser;


if(!usuario){

return "Não informado";

}



const referencia = doc(

db,

"usuarios",

usuario.uid

);



const resultado = await getDoc(referencia);



if(resultado.exists()){


return resultado.data().nome || usuario.email;


}



return usuario.email;


}








// Finalizar atendimento


window.salvarAtendimento = async function(){



if(!pacienteAtual){

alert("Nenhum paciente em atendimento");

return;

}



const observacoes =

document.getElementById("observacoes").value;



const conduta =

document.getElementById("conduta").value;



const membro = await buscarMembro();





const dadosAtendimento = {


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


observacoes,


conduta,


membro,


data:

Timestamp.now()


};






// Salvar e pegar ID

const atendimentoCriado = await addDoc(

collection(db,"atendimentos"),

dadosAtendimento

);





const id = atendimentoCriado.id;






// Criar link da avaliação

const link =

`${window.location.origin}/ladrf-connect/avaliacao.html?id=${id}`;







// Gerar QR Code


const areaQR = document.getElementById("qrcode");



if(!areaQR){

alert("Área do QR Code não encontrada no HTML");

return;

}



areaQR.innerHTML="";





if(typeof QRCode === "undefined"){


alert("Biblioteca QR Code não carregou");


return;

}





new QRCode(areaQR,{

text:link,

width:200,

height:200

});







alert(

"Atendimento salvo! QR Code gerado."

);





document.getElementById("observacoes").value="";


document.getElementById("conduta").value="";



};
