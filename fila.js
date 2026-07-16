import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const lista = document.getElementById("lista");
const contador = document.getElementById("contador");


const fila = query(
  collection(db, "pacientes"),
  orderBy("horario", "asc")
);


onSnapshot(
  fila,
  (snapshot) => {

    lista.innerHTML = "";

    let total = 0;


    snapshot.forEach((doc) => {

      const paciente = doc.data();

      total++;


      lista.innerHTML += `

      <div class="paciente">

        <h2>${paciente.senha || "Sem senha"}</h2>

        <p><b>${paciente.nome}</b></p>

        <p>${paciente.modalidade}</p>

        <p>Status: ${paciente.status}</p>

      </div>

      `;

    });


    contador.innerHTML =
    `🟡 ${total} paciente(s) na fila`;


  },

  (erro) => {

    lista.innerHTML =
    "Erro ao carregar fila: " + erro.message;

    console.log(erro);

  }

);
