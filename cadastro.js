import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.cadastrar = async function () {
  try {
    const pacientesRef = collection(db, "pacientes");
    const snapshot = await getDocs(query(pacientesRef, orderBy("horario")));

    const senha = "LADRF-" + String(snapshot.size + 1).padStart(3, "0");

    const paciente = {
      senha,
      nome: document.getElementById("nome").value,
      whatsapp: document.getElementById("whatsapp").value,
      modalidade: document.getElementById("modalidade").value,
      queixa: document.getElementById("queixa").value,
      status: "Aguardando",
      maca: "",
      horario: new Date()
    };

    await addDoc(pacientesRef, paciente);

    alert(`Paciente cadastrado!\nSenha: ${senha}`);

    document.getElementById("nome").value = "";
    document.getElementById("whatsapp").value = "";
    document.getElementById("queixa").value = "";

  } catch (erro) {
    alert("Erro ao cadastrar: " + erro.message);
    console.error(erro);
  }
};