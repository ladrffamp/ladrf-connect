import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



window.buscar = async function(){


const termo = document
.getElementById("busca")
.value
.toLowerCase();



const lista = document.getElementById("lista");


lista.innerHTML = "Carregando...";



const busca = query(

collection(db,"atendimentos"),

orderBy("data","desc")

);



const resultado = await getDocs(busca);



lista.innerHTML="";



let encontrado=false;



resultado.forEach((item)=>{


const dados=item.data();



if(
dados.paciente
?.toLowerCase()
.includes(termo)
){



encontrado=true;



lista.innerHTML += `


<div class="item">


<div class="titulo">

${dados.paciente || "-"}

</div>



<b>Idade:</b>

${dados.idade || "-"}

<br>



<b>Sexo:</b>

${dados.sexo || "-"}

<br>



<b>Modalidade:</b>

${dados.modalidade || "-"}

<br>



<b>Evento:</b>

${dados.evento || "-"}

<br>



<b>Membro responsável:</b>

${dados.membro || "-"}

<br>



<b>Maca:</b>

${dados.maca || "-"}

<br>



<b>Horário:</b>

${dados.inicio || "-"}
até
${dados.termino || "-"}

<br><br>




<b>Queixa:</b>

${dados.queixa?.join(", ") || "-"}

<br>



<b>Lado:</b>

${dados.lado || "-"}

<br>



<b>Tipo de lesão:</b>

${dados.lesao?.join(", ") || "-"}

<br>



<b>Escala de dor (EVA):</b>

${dados.eva || 0}/10

<br><br>




<b>Condutas:</b>

${dados.condutas?.join(", ") || "-"}

<br><br>




<b>Observações:</b>

${dados.observacoes || "-"}

<br><br>




<b>Situação final:</b>

${dados.situacaoFinal || "-"}



</div>


`;



}



});





if(!encontrado){


lista.innerHTML = `

<div class="item">

Nenhum atendimento encontrado.

</div>

`;

}


}
