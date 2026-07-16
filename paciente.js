import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


window.buscar = async function () {

  const senha = document.getElementById("senha").value.trim().toUpperCase();
  const resultado = document.getElementById("resultado");

  const consulta = query(
    collection(db, "pacientes"),
    where("senha", "==", senha)
  );

  const dados = await getDocs(consulta);

  if (dados.empty) {
    resultado.innerHTML = "<h3>Senha não encontrada.</h3>";
    return;
  }

  const documento = dados.docs[0];

  acompanhar(documento.id);

};


function acompanhar(id){

  onSnapshot(doc(db,"pacientes",id), (docSnap)=>{

    if(!docSnap.exists()) return;

    const paciente = docSnap.data();

    let cor = "#f4b400";
    let mensagem = "Aguardando atendimento";

    if(paciente.status === "Chamado"){
      cor = "#0f9d58";
      mensagem = `DIRIJA-SE À ${paciente.maca}`;
    }

    if(paciente.status === "Finalizado"){
      cor = "#4285F4";
      mensagem = "Atendimento finalizado";
    }

    document.getElementById("resultado").innerHTML = `

      <div style="
      border:3px solid ${cor};
      border-radius:15px;
      padding:20px;
      margin-top:20px;
      text-align:center;
      ">

      <h2>${paciente.senha}</h2>

      <h3>${paciente.nome}</h3>

      <p><b>Modalidade:</b> ${paciente.modalidade}</p>

      <p><b>Queixa:</b> ${paciente.queixa}</p>

      <h2 style="color:${cor};">
      ${paciente.status}
      </h2>

      <h3>${mensagem}</h3>

      </div>

    `;

  });

}
