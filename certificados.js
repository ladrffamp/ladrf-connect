import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ELEMENTOS

const selectMembro = document.getElementById("membro");
const selectEvento = document.getElementById("evento");
const cargaHoraria = document.getElementById("cargaHoraria");
const gerarCertificado = document.getElementById("gerarCertificado");
const listaCertificados = document.getElementById("listaCertificados");


// DADOS

let membros = [];
let eventos = [];


// ===============================
// CARREGAR MEMBROS
// ===============================

onSnapshot(
  collection(db, "membros"),
  (snapshot) => {

    membros = [];

    selectMembro.innerHTML = `
      <option value="">
        Selecione o membro
      </option>
    `;


    snapshot.forEach((doc) => {

      const dados = doc.data();

      membros.push({
        id: doc.id,
        ...dados
      });


      selectMembro.innerHTML += `
        <option value="${doc.id}">
          ${dados.nome}
        </option>
      `;

    });

  }
);


// ===============================
// CARREGAR EVENTOS
// ===============================

onSnapshot(
  collection(db, "agenda"),
  (snapshot) => {

    eventos = [];

    selectEvento.innerHTML = `
      <option value="">
        Selecione o evento
      </option>
    `;


    snapshot.forEach((doc) => {

      const dados = doc.data();

      eventos.push({
        id: doc.id,
        ...dados
      });


      selectEvento.innerHTML += `
        <option value="${doc.id}">
          ${dados.titulo}
        </option>
      `;

    });

  }
);


// ===============================
// CARGA HORÁRIA AUTOMÁTICA
// ===============================

selectEvento.addEventListener(
  "change",
  () => {

    const evento = eventos.find(
      e => e.id === selectEvento.value
    );


    if (!evento) {

      cargaHoraria.value = "";

      return;

    }


    if (evento.inicio && evento.fim) {


      const inicio = evento.inicio.split(":");
      const fim = evento.fim.split(":");


      const minutosInicio =
        Number(inicio[0]) * 60 +
        Number(inicio[1]);


      const minutosFim =
        Number(fim[0]) * 60 +
        Number(fim[1]);


      const total =
        minutosFim - minutosInicio;


      if (total > 0) {

        cargaHoraria.value =
          (total / 60) + " horas";

      }

    }

  }
);



// ===============================
// GERAR CERTIFICADO
// ===============================

gerarCertificado.addEventListener(
  "click",
  async () => {


    const membroId =
      selectMembro.value;


    const eventoId =
      selectEvento.value;


    const carga =
      cargaHoraria.value;



    if (
      !membroId ||
      !eventoId ||
      !carga
    ) {

      alert("Preencha todos os campos.");

      return;

    }



    const membro =
      membros.find(
        m => m.id === membroId
      );



    const evento =
      eventos.find(
        e => e.id === eventoId
      );



    const data =
      new Date()
      .toLocaleDateString("pt-BR");



    await addDoc(
      collection(db, "certificados"),
      {

        membro:
          membro.nome,

        evento:
          evento.titulo,

        cargaHoraria:
          carga,

        dataEmissao:
          data,

        criadoEm:
          Timestamp.now()

      }
    );



    const { jsPDF } =
      window.jspdf;



    const pdf =
      new jsPDF();



    pdf.setFontSize(24);

    pdf.text(
      "CERTIFICADO",
      105,
      35,
      {
        align:"center"
      }
    );


    pdf.setFontSize(14);


    pdf.text(
      "Certificamos que",
      105,
      60,
      {
        align:"center"
      }
    );


    pdf.setFontSize(18);


    pdf.text(
      membro.nome,
      105,
      80,
      {
        align:"center"
      }
    );


    pdf.setFontSize(14);


    pdf.text(
      "participou da atividade:",
      105,
      100,
      {
        align:"center"
      }
    );


    pdf.setFontSize(16);


    pdf.text(
      evento.titulo,
      105,
      120,
      {
        align:"center"
      }
    );


    pdf.setFontSize(14);


    pdf.text(
      `Carga horária: ${carga}`,
      105,
      145,
      {
        align:"center"
      }
    );


    pdf.text(
      "Liga Acadêmica de Desporto e Reabilitação na Fisioterapia",
      105,
      175,
      {
        align:"center"
      }
    );


    pdf.text(
      `Emitido em: ${data}`,
      105,
      190,
      {
        align:"center"
      }
    );


    pdf.save(
      `Certificado_${membro.nome}.pdf`
    );


    alert(
      "Certificado gerado!"
    );


  }
);



// ===============================
// LISTAR CERTIFICADOS
// ===============================

onSnapshot(
  collection(db, "certificados"),
  (snapshot) => {


    listaCertificados.innerHTML = "";


    if(snapshot.empty){

      listaCertificados.innerHTML = `
        <tr>
          <td colspan="4">
            Nenhum certificado emitido.
          </td>
        </tr>
      `;

      return;

    }



    snapshot.forEach((doc)=>{

      const c = doc.data();


      listaCertificados.innerHTML += `

        <tr>

          <td>${c.membro || "-"}</td>

          <td>${c.evento || "-"}</td>

          <td>${c.dataEmissao || "-"}</td>

          <td>Emitido</td>

        </tr>

      `;


    });


  }
);
