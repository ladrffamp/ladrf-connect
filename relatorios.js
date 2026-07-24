// relatorios.js


import { db } from "./firebase.js";


import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const totalMembros =
document.getElementById("totalMembros");


const totalAtendimentos =
document.getElementById("totalAtendimentos");


const totalEventos =
document.getElementById("totalEventos");


const totalHoras =
document.getElementById("totalHoras");



const resumoAtendimentos =
document.getElementById("resumoAtendimentos");


const listaEventos =
document.getElementById("listaEventos");









async function carregarRelatorios(){


try{



// =============================
// MEMBROS
// =============================


const usuarios =
await getDocs(

collection(
db,
"usuarios"
)

);



let membros = 0;



usuarios.forEach((usuario)=>{


const dados =
usuario.data();



if(
dados.perfil?.toLowerCase()
===
"membro"
){


membros++;


}


});



totalMembros.innerHTML =
membros;








// =============================
// EVENTOS
// =============================


const eventosSnapshot =
await getDocs(

collection(
db,
"agenda"
)

);



let eventos = 0;

let atendimentos = 0;

let horas = 0;


let categorias = {};



listaEventos.innerHTML = "";







for(const evento of eventosSnapshot.docs){



const dados =
evento.data();



eventos++;





if(
dados.tipo === "Atendimento"
){


atendimentos++;


}






// categorias


const categoria =
dados.tipo || "Outros";



if(!categorias[categoria]){


categorias[categoria]=0;


}


categorias[categoria]++;








// horas


if(
dados.inicio &&
dados.fim
){


horas += calcularHoras(

dados.inicio,

dados.fim

);


}







// participantes


const participantes =
await getDocs(

collection(

db,

"agenda",

evento.id,

"participantes"

)

);






listaEventos.innerHTML += `


<tr>


<td>

${dados.titulo || "-"}

</td>



<td>

${dados.data || "-"}

</td>



<td>

${participantes.size}

</td>



</tr>


`;





}






totalAtendimentos.innerHTML =
atendimentos;



totalEventos.innerHTML =
eventos;



totalHoras.innerHTML =
horas + "h";








// =============================
// RESUMO ATENDIMENTOS
// =============================


resumoAtendimentos.innerHTML = "";



Object.keys(categorias).forEach((categoria)=>{


resumoAtendimentos.innerHTML += `


<tr>


<td>

${categoria}

</td>


<td>

${categorias[categoria]}

</td>


</tr>


`;



});







if(
listaEventos.innerHTML === ""
){


listaEventos.innerHTML = `


<tr>

<td colspan="3">

Nenhum evento encontrado.

</td>


</tr>


`;


}






}catch(error){


console.error(
"Erro ao carregar relatórios:",
error
);



}





}








function calcularHoras(
inicio,
fim
){



const inicioPartes =
inicio.split(":");


const fimPartes =
fim.split(":");



const inicioMinutos =

Number(inicioPartes[0])*60

+

Number(inicioPartes[1]);



const fimMinutos =

Number(fimPartes[0])*60

+

Number(fimPartes[1]);



return (

fimMinutos -
inicioMinutos

)/60;



}







carregarRelatorios();
