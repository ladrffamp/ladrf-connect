import { db } from "./firebase.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lista = document.getElementById("lista");

const fila = query(
  collection(db, "pacientes"),
  orderBy("horario")
);

onSnapshot(fila, (snapshot) => {

  lista.innerHTML = "";

  let posicao = 1;

  snapshot.forEach((item) => {

    const paciente = item.data();

    const card = document.createElement("div");

    card.className = "paciente";

    card.innerHTML = `
      <div>
        <h3>${paciente.senha}</h3>
        <p><b>${paciente.nome}</b></p>
        <p>${paciente.modalidade}</p>
        <p>Status: ${paciente.status}</p>
        <p>Posição: ${posicao}º</p>
      </div>

      <div>

        <select id="maca-${item.id}">
          <option value="1">Maca 1</option>
          <option value="2">Maca 2</option>
          <option value="3">Maca 3</option>
          <option value="4">Maca 4</option>
        </select>

        <br><br>

        <button onclick="chamar('${item.id}')">
          Chamar
        </button>

      </div>
    `;

    lista.appendChild(card);

    posicao++;

  });

});

window.chamar = async function(id){

  const maca = document.getElementById(`maca-${id}`).value;

  await updateDoc(
    doc(db,"pacientes",id),
    {
      status:"Chamado",
      maca:maca
    }
  );

  alert("Paciente chamado para a Maca " + maca);

}
