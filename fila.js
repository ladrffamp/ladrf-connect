import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const lista = document.getElementById("lista");
const contador = document.getElementById("contador");


const fila = query(
  collection(db, "pacientes"),
  orderBy("horario", "asc")
);



onSnapshot(fila, (snapshot) => {

  lista.innerHTML = "";

  let aguardando = 0;


  snapshot.forEach((item) => {

    const paciente = item.data();


    if(paciente.status === "Aguardando"){

      aguardando++;


      lista.innerHTML += `

      <div class="paciente">

        <h2>${paciente.senha}</h2>

        <p><b>${paciente.nome}</b></p>

        <p>${paciente.modalidade}</p>

        <p>Queixa: ${paciente.queixa}</p>

        <p>Status: ${paciente.status}</p>


        <select id="maca-${item.id}">

          <option value="Maca 1">
          Maca 1
          </option>

          <option value="Maca 2">
          Maca 2
          </option>

          <option value="Maca 3">
          Maca 3
          </option>

          <option value="Maca 4">
          Maca 4
          </option>

        </select>


        <button onclick="chamar('${item.id}')">

        CHAMAR

        </button>


      </div>

      `;

    }


  });


  contador.innerHTML =
  `🟡 ${aguardando} paciente(s) aguardando`;


});




window.chamar = async function(id){


const maca = 
document.getElementById(`maca-${id}`).value;



await updateDoc(

doc(db,"pacientes",id),

{

status:"Chamado",

maca:maca

}

);


alert(
"Paciente chamado para " + maca
);


}
