import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


window.buscar = async function(){

  const senhaDigitada = 
  document.getElementById("senha").value.trim();


  const resultado =
  document.getElementById("resultado");


  const ref = collection(db,"pacientes");


  const busca = query(
    ref,
    where("senha","==",senhaDigitada)
  );


  const dados = await getDocs(busca);


  if(dados.empty){

    resultado.innerHTML =
    "Senha não encontrada";

    return;

  }


  const pacienteDoc = dados.docs[0];

  const paciente = pacienteDoc.data();



  resultado.innerHTML = `

  <h2>${paciente.senha}</h2>

  <p><b>${paciente.nome}</b></p>

  <p>Status:</p>

  <h3>${paciente.status}</h3>

  `;



  acompanhar(pacienteDoc.id);

};




function acompanhar(id){


const pacienteRef = 
collection(db,"pacientes");



onSnapshot(

query(
pacienteRef,
orderBy("horario")
),

(snapshot)=>{


let posicao = 0;


snapshot.forEach((item)=>{


if(item.id === id){

return;

}


const dados = item.data();


if(dados.status === "Aguardando"){

posicao++;

}


});



document.getElementById("resultado").innerHTML += `

<p>

Posição na fila:

<b>${posicao + 1}º</b>

</p>

`;



}

);


}
