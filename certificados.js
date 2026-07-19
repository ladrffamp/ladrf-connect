import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const selectMembro = document.getElementById("membro");
const selectEvento = document.getElementById("evento");
const gerar = document.getElementById("gerarCertificado");
const lista = document.getElementById("listaCertificados");

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
        <option value="${dados.nome}">
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

import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const selectMembro = document.getElementById("membro");
const selectEvento = document.getElementById("evento");
const gerar = document.getElementById("gerarCertificado");
const lista = document.getElementById("listaCertificados");

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
        <option value="${dados.nome}">
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
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.text("participou da atividade:", 105, 100, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(evento, 105, 120, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.text(`Carga horária: ${carga} horas`, 105, 145, { align: "center" });

  pdf.text(
    "Liga Acadêmica de Desporto e Reabilitação na Fisioterapia",
    105,
    175,
    { align: "center" }
  );

  pdf.text(`Data de emissão: ${data}`, 105, 190, {
    align: "center"
  });

  pdf.line(55, 235, 155, 235);

  pdf.text("Coordenação LADRF", 105, 245, {
    align: "center"
  });

  pdf.save(`Certificado_${nome}.pdf`);

  alert("Certificado emitido com sucesso!");

};

// ===============================
// HISTÓRICO DE CERTIFICADOS
// ===============================

onSnapshot(
  collection(db, "certificados"),
  (snapshot) => {

    lista.innerHTML = "";

    if (snapshot.empty) {

      lista.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;padding:20px;">
            Nenhum certificado emitido.
          </td>
        </tr>
      `;

      return;
    }
      snapshot.forEach((doc) => {

      const c = doc.data();

      lista.innerHTML += `
        <tr>
          <td>${c.nome}</td>
          <td>${c.evento}</td>
          <td>${c.data}</td>
          <td>
            <span style="
              color:#0B7A3B;
              font-weight:600;
            ">
              Emitido
            </span>
          </td>
        </tr>
      `;

    });

  }
);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);

  pdf.text("CERTIFICADO", 105, 35, {
    align: "center"
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);

  pdf.text(
    "Certificamos que",
    105,
    60,
    { align: "center" }
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);

  pdf.text(
    membro.nome,
    105,
    80,
    { align: "center" }
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);

  pdf.text(
    "participou do evento",
    105,
    100,
    { align: "center" }
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);

  pdf.text(
    evento.titulo,
    105,
    120,
    { align: "center" }
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);

  pdf.text(
    `Carga horária: ${carga} horas`,
    105,
    145,
    { align: "center" }
  );

  pdf.text(
    "Liga Acadêmica de Desporto e Reabilitação na Fisioterapia",
    105,
    170,
    { align: "center" }
  );

  pdf.text(
    `Emitido em ${data}`,
    105,
    185,
    { align: "center" }
  );

  pdf.line(60, 235, 150, 235);

  pdf.text(
    "Coordenação LADRF",
    105,
    245,
    { align: "center" }
  );

  pdf.save(`Certificado_${membro.nome}.pdf`);

  alert("Certificado gerado com sucesso!");

});
// ======================================
// HISTÓRICO DE CERTIFICADOS
// ======================================

onSnapshot(
  collection(db, "certificados"),
  (snapshot) => {

    lista.innerHTML = "";

    if (snapshot.empty) {

      lista.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;padding:20px;">
            Nenhum certificado emitido.
          </td>
        </tr>
      `;

      return;

    }

    snapshot.forEach((doc) => {

      const cert = doc.data();

      lista.innerHTML += `
        <tr>
          <td>${cert.membro ?? "-"}</td>
          <td>${cert.evento ?? "-"}</td>
          <td>${cert.dataEmissao ?? "-"}</td>
          <td>
            <span style="color:#0B7A3B;font-weight:600;">
              Emitido
            </span>
          </td>
        </tr>
      `;

    });

  }
);
// ======================================
// PREENCHER CARGA HORÁRIA AUTOMATICAMENTE
// ======================================

selectEvento.addEventListener("change", () => {

  const evento = eventos.find(e => e.id === selectEvento.value);

  if (!evento) return;

  // Se existir um campo "cargaHoraria" no documento
  if (evento.cargaHoraria) {
    inputCarga.value = evento.cargaHoraria;
    return;
  }

  // Calcula usando início e fim
  if (evento.inicio && evento.fim) {

    const [hi, mi] = evento.inicio.split(":").map(Number);
    const [hf, mf] = evento.fim.split(":").map(Number);

    const inicio = hi * 60 + mi;
    const fim = hf * 60 + mf;

    if (fim > inicio) {

      const horas = ((fim - inicio) / 60).toFixed(1);

      inputCarga.value = horas.replace(".0", "");

    }

  }

});
    `;
