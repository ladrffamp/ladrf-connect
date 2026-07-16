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

  const documento = await getDoc(doc(db, "usuarios", usuario.uid));

  if (!documento.exists()) {

    alert("Usuário sem perfil cadastrado.");

    await signOut(auth);

    window.location.href = "login.html";

    return;

  }

  const perfil = documento.data().perfil;

  const pagina = window.location.pathname.split("/").pop();

  const regras = {

    admin: [
      "dashboard.html",
      "cadastro.html",
      "fila.html",
      "macas.html",
      "usuarios.html",
      "relatorios.html",
      "recepcao.html",
      "painel.html"
    ],

    recepcao: [
      "dashboard.html",
      "cadastro.html",
      "recepcao.html",
      "painel.html"
    ],

    membro: [
      "dashboard.html",
      "fila.html",
      "macas.html",
      "painel.html"
    ]

  };

  if (!regras[perfil]) {

    alert("Perfil inválido.");

    window.location.href = "login.html";

    return;

  }

  if (!regras[perfil].includes(pagina)) {

    alert("Você não possui permissão para acessar esta página.");

    window.location.href = "dashboard.html";

  }

});
