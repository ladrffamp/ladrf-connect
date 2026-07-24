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


const tabelaCategorias =
document.getElementById("tabelaCategorias");


const tabelaEventos =
document.getElementById("tabelaEventos");





async function carregarRelatorios(){


try{



// ===============================
// MEMBROS
// ===============================


const usuariosSnapshot = await getDocs(

collection(
db,
"usuarios"
)

);



let membros = 0;



usuariosSnapshot.forEach((doc)=>{


const dados = doc.data();



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









// ===============================
// EVENTOS
// ===============================


const agendaSnapshot = await getDocs(

collection(
db,
"agenda"
)

);



let eventos = 0;

let atendimentos = 0;

let horas = 0;



let linhasEventos = "";



let categorias = {};





for(const evento of agendaSnapshot.docs){



const dados =
evento.data();



eventos++;





if(
dados.tipo === "Atendimento"
){

atendimentos++;


}






if(
dados.tipo
){

if(!categorias[dados.tipo]){

categorias[dados.tipo]=0;

}


categorias[dados.tipo]++;


}







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


const participantes = await getDocs(

collection(

db,

"agenda",

evento.id,

"participantes"

)

);



linhasEventos += `


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





totalEventos.innerHTML =
eventos;


totalAtendimentos.innerHTML =
atendimentos;


totalHoras.innerHTML =
horas + "h";





// ===============================
// CATEGORIAS
// ===============================


tabelaCategorias.innerHTML = "";



Object.keys(categorias)
.forEach((categoria)=>{


tabelaCategorias.innerHTML += `


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







// ===============================
// EVENTOS
// ===============================


tabelaEventos.innerHTML =
linhasEventos;






}catch(error){


console.error(
"Erro relatórios:",
error
);


}



}







function calcularHoras(
inicio,
fim
){


const ini =
inicio.split(":");


const fimP =
fim.split(":");



const minutosIni =

Number(ini[0])*60
+
Number(ini[1]);



const minutosFim =

Number(fimP[0])*60
+
Number(fimP[1]);



return (

minutosFim -
minutosIni

)/60;


}






carregarRelatorios();
