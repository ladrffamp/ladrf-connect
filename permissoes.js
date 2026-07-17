import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


onAuthStateChanged(auth, async (usuario) => {

  if (!usuario) {

    window.location.href = "login.html";
    return;

  }

  try {

    const usuarioRef = doc(
      db,
      "usuarios",
      usuario.uid
    );

    const usuarioDoc = await getDoc(usuarioRef);

    if (!usuarioDoc.exists()) {

      alert("Usuário sem perfil cadastrado.");

      await signOut(auth);

      window.location.href = "login.html";

      return;

    }

    const perfil = usuarioDoc.data().perfil;

    const paginaAtual = window.location.pathname
      .split("/")
      .pop();

    const pagina = paginaAtual === ""
      ? "index.html"
      : paginaAtual;

    console.log("USUÁRIO:", usuario.email);
    console.log("PERFIL:", perfil);
    console.log("PÁGINA:", pagina);

    const permissoes = {

      admin: [

        "index.html",
        "dashboard.html",
        "cadastro.html",
        "fila.html",
        "recepcao.html",
        "macas.html",
        "atendimento.html",
        "historico.html",
        "usuarios.html",
        "membros.html",
        "relatorios.html",
        "agenda.html",
        "painel.html"

      ],



      recepcao: [

        "index.html",
        "dashboard.html",
        "cadastro.html",
        "fila.html",
        "recepcao.html",
        "painel.html"

      ],



      membro: [

        "index.html",
        "dashboard.html",
        "fila.html",
        "macas.html",
        "atendimento.html",
        "historico.html",
        "agenda.html",
        "painel.html"

      ]

    };



    if (!permissoes[perfil]) {

      alert(
        "Perfil não reconhecido: " + perfil
      );

      window.location.href = "index.html";

      return;

    }



    if (!permissoes[perfil].includes(pagina)) {

      alert(
        "Sem permissão para: " + pagina
      );

      window.location.href = "index.html";

      return;

    }

    console.log("Acesso permitido");

  } catch (erro) {

    console.error(
      "Erro nas permissões:",
      erro
    );

    alert(
      "Erro ao verificar permissões."
    );

  }

});
