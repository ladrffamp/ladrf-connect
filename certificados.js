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



    if (!membroId || !eventoId || !carga) {

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

        membro: membro.nome,

        evento: evento.titulo,

        cargaHoraria: carga,

        dataEmissao: data,

        criadoEm: Timestamp.now()

      }
    );



    // ===============================
    // PDF HORIZONTAL
    // ===============================


    const { jsPDF } =
      window.jspdf;



    const pdf =
      new jsPDF({

        orientation:"landscape",

        unit:"mm",

        format:"a4"

      });



    const largura = 297;

    const altura = 210;



    // BORDA

    pdf.setLineWidth(1);

    pdf.rect(
      10,
      10,
      largura - 20,
      altura - 20
    );



    // TÍTULO

    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(30);


    pdf.text(
      "LADRF",
      largura / 2,
      45,
      {
        align:"center"
      }
    );



    pdf.setFontSize(24);


    pdf.text(
      "CERTIFICADO",
      largura / 2,
      65,
      {
        align:"center"
      }
    );



    pdf.setFont(
      "helvetica",
      "normal"
    );


    pdf.setFontSize(16);


    pdf.text(
      "Certificamos que",
      largura / 2,
      90,
      {
        align:"center"
      }
    );



    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(22);


    pdf.text(
      membro.nome,
      largura / 2,
      110,
      {
        align:"center"
      }
    );



    pdf.setFont(
      "helvetica",
      "normal"
    );


    pdf.setFontSize(16);


    pdf.text(
      "participou da atividade:",
      largura / 2,
      130,
      {
        align:"center"
      }
    );



    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(18);


    pdf.text(
      evento.titulo,
      largura / 2,
      145,
      {
        align:"center"
      }
    );



    pdf.setFont(
      "helvetica",
      "normal"
    );


    pdf.setFontSize(15);


    pdf.text(
      `Carga horária: ${carga}`,
      largura / 2,
      160,
      {
        align:"center"
      }
    );



    pdf.text(
      `Emitido em: ${data}`,
      60,
      185
    );



    pdf.line(
      190,
      180,
      260,
      180
    );



    pdf.text(
      "Coordenação LADRF",
      225,
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
