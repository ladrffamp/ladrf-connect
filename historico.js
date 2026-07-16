import { db } from "./firebase.js";


import {

collection,
getDocs,
query,
where

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




const lista =
document.getElementById("lista");





window.buscar = async function(){


const nome =

document.getElementById("busca").value;



if(nome===""){

alert("Digite o nome do paciente");

return;

}



lista.innerHTML="Carregando...";



const consulta = query(

collection(db,"atendimentos"),

where("paciente","==",nome)

);



const resultado = await getDocs(consulta);



lista.innerHTML="";



if(resultado.empty){


lista.innerHTML=

"<p>Nenhum atendimento encontrado.</p>";


return;


}





resultado.forEach((documento)=>{


const atendimento =
documento.data();



lista.innerHTML += `


<div class="card">


<h2>

${atendimento.paciente}

</h2>


<p>

<b>Modalidade:</b>

${atendimento.modalidade || "-"}

</p>


<p>

<b>Queixa:</b>

${atendimento.queixa || "-"}

</p>


<p>

<b>Conduta:</b>

${atendimento.conduta || "-"}

</p>


<p>

<b>Observações:</b>

${atendimento.observacoes || "-"}

</p>


<p>

<b>Membro:</b>

${atendimento.membro || "-"}

</p>


</div>


`;



});


}
