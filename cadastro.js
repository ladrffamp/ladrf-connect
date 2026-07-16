import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


window.cadastrar = async function(){

  const pacientes = collection(db,"pacientes");

  const lista = await getDocs(
    query(pacientes, orderBy("horario"))
  );


  const senha = "LADRF-" + 
  String(lista.size + 1).padStart(3,"0");


  const paciente = {

    senha: senha,

    nome: document.getElementById("nome").value,

    whatsapp: document.getElementById("whatsapp").value,

    modalidade: document.getElementById("modalidade").value,

    queixa: document.getElementById("queixa").value,

    status: "Aguardando",

    maca: "",

    horario: new Date()

  };


  try {


    await addDoc(
      pacientes,
      paciente
    );


    alert(
      "Paciente colocado na fila!\nSenha: " + senha
    );


    document.getElementById("nome").value="";
    document.getElementById("whatsapp").value="";
    document.getElementById("queixa").value="";


  } catch(error){

    alert(
      "Erro: " + error.message
    );

    console.log(error);

  }

};
