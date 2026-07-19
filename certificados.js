import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ELEMENTOS DA PÁGINA

const selectMembro = document.getElementById("membro");
const selectEvento = document.getElementById("evento");
const gerarCertificado = document.getElementById("gerarCertificado");
const listaCertificados = document.getElementById("listaCertificados");
const cargaHoraria = document.getElementById("cargaHoraria");


// ARRAYS

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
  import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ELEMENTOS DA PÁGINA

const selectMembro = document.getElementById("membro");
const selectEvento = document.getElementById("evento");
const gerarCertificado = document.getElementById("gerarCertificado");
const listaCertificados = document.getElementById("listaCertificados");
const cargaHoraria = document.getElementById("cargaHoraria");


// ARRAYS

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

    pdf.setFont(
      "helvetica",
      "normal"
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


    pdf.setFont(
      "helvetica",
      "bold"
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



    pdf.setFont(
      "helvetica",
      "normal"
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



    pdf.setFont(
      "helvetica",
      "bold"
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



    pdf.setFont(
      "helvetica",
      "normal"
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
      `Data de emissão: ${data}`,
      105,
      190,
      {
        align:"center"
      }
    );



    pdf.line(
      60,
      230,
      150,
      230
    );



    pdf.text(
      "Coordenação LADRF",
      105,
      245,
      {
        align:"center"
      }
    );



    pdf.save(
      `Certificado_${membro.nome}.pdf`
    );



    alert(
      "Certificado gerado com sucesso!"
    );


  }

);

// ===============================
// HISTÓRICO DE CERTIFICADOS
// ===============================

onSnapshot(
  collection(db,"certificados"),
  (snapshot)=>{


    listaCertificados.innerHTML = "";


    if(snapshot.empty){


      listaCertificados.innerHTML = `

        <tr>

          <td colspan="4" style="
            text-align:center;
            padding:20px;
          ">

            Nenhum certificado emitido.

          </td>

        </tr>

      `;


      return;

    }



    snapshot.forEach((doc)=>{


      const certificado =
        doc.data();



      listaCertificados.innerHTML += `

        <tr>

          <td>
            ${certificado.membro || "-"}
          </td>


          <td>
            ${certificado.evento || "-"}
          </td>


          <td>
            ${certificado.dataEmissao || "-"}
          </td>


          <td>

            <span style="
              color:#0B7A3B;
              font-weight:bold;
            ">

              Emitido

            </span>

          </td>


        </tr>

      `;


    });



  }
);
);
