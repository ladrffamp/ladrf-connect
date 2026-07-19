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
  collection(db,"membros"),
  (snapshot)=>{

    membros = [];


    selectMembro.innerHTML = `
      <option value="">
        Selecione o membro
      </option>
    `;


    snapshot.forEach((doc)=>{

      const dados = doc.data();


      membros.push({
        id:doc.id,
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
  collection(db,"agenda"),
  (snapshot)=>{


    eventos = [];


    selectEvento.innerHTML = `
      <option value="">
        Selecione o evento
      </option>
    `;


    snapshot.forEach((doc)=>{


      const dados = doc.data();


      eventos.push({
        id:doc.id,
        ...dados
      });


      selectEvento.innerHTML += `
        <option value="${doc.id}">
          ${dados.titulo}
        </option>
      `;


    });


  }
  
// ===============================
// PREENCHER CARGA HORÁRIA
// AUTOMATICAMENTE PELO EVENTO
// ===============================

selectEvento.addEventListener(
  "change",
  ()=>{


    const eventoSelecionado =
      eventos.find(
        e => e.id === selectEvento.value
      );


    if(!eventoSelecionado){

      cargaHoraria.value = "";

      return;

    }



    if(
      eventoSelecionado.inicio &&
      eventoSelecionado.fim
    ){


      const inicio =
        eventoSelecionado.inicio.split(":");


      const fim =
        eventoSelecionado.fim.split(":");



      const minutosInicio =
        Number(inicio[0]) * 60 +
        Number(inicio[1]);


      const minutosFim =
        Number(fim[0]) * 60 +
        Number(fim[1]);



      const totalMinutos =
        minutosFim - minutosInicio;



      if(totalMinutos > 0){


        const horas =
          totalMinutos / 60;


        cargaHoraria.value =
          horas + " horas";


      }


    }



  }
);



// ===============================
// GERAR CERTIFICADO
// ===============================

gerarCertificado.addEventListener(
  "click",
  async()=>{


    const membroId =
      selectMembro.value;


    const eventoId =
      selectEvento.value;


    const carga =
      cargaHoraria.value;



    if(
      !membroId ||
      !eventoId ||
      !carga
    ){

      alert(
        "Preencha todos os campos."
      );

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



    if(
      !membro ||
      !evento
    ){

      alert(
        "Erro ao encontrar dados."
      );

      return;

    }



    const data =
      new Date()
      .toLocaleDateString("pt-BR");



    await addDoc(
      collection(db,"certificados"),
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

    
// ===============================
// PREENCHER CARGA HORÁRIA
// AUTOMATICAMENTE PELO EVENTO
// ===============================

selectEvento.addEventListener(
  "change",
  ()=>{


    const eventoSelecionado =
      eventos.find(
        e => e.id === selectEvento.value
      );


    if(!eventoSelecionado){

      cargaHoraria.value = "";

      return;

    }



    if(
      eventoSelecionado.inicio &&
      eventoSelecionado.fim
    ){


      const inicio =
        eventoSelecionado.inicio.split(":");


      const fim =
        eventoSelecionado.fim.split(":");



      const minutosInicio =
        Number(inicio[0]) * 60 +
        Number(inicio[1]);


      const minutosFim =
        Number(fim[0]) * 60 +
        Number(fim[1]);



      const totalMinutos =
        minutosFim - minutosInicio;



      if(totalMinutos > 0){


        const horas =
          totalMinutos / 60;


        cargaHoraria.value =
          horas + " horas";


      }


    }



  }
);



// ===============================
// GERAR CERTIFICADO
// ===============================

gerarCertificado.addEventListener(
  "click",
  async()=>{


    const membroId =
      selectMembro.value;


    const eventoId =
      selectEvento.value;


    const carga =
      cargaHoraria.value;



    if(
      !membroId ||
      !eventoId ||
      !carga
    ){

      alert(
        "Preencha todos os campos."
      );

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



    if(
      !membro ||
      !evento
    ){

      alert(
        "Erro ao encontrar dados."
      );

      return;

    }



    const data =
      new Date()
      .toLocaleDateString("pt-BR");



    await addDoc(
      collection(db,"certificados"),
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
