import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const nomeUsuario = document.getElementById("nomeUsuario");
const perfilUsuario = document.getElementById("perfilUsuario");

onAuthStateChanged(auth, async (usuario) => {

  // Se a página não possui cabeçalho, não faz nada.
  if (!nomeUsuario && !perfilUsuario) {
    return;
  }

  // Usuário não logado
  if (!usuario) {

    if (nomeUsuario) {
      nomeUsuario.textContent = "Visitante";
    }

    if (perfilUsuario) {
      perfilUsuario.textContent = "";
    }

    return;
  }

  // Exibe o e-mail enquanto busca os dados
  if (nomeUsuario) {
    nomeUsuario.textContent = usuario.email;
  }

  try {

    const q = query(
      collection(db, "usuarios"),
      where("email", "==", usuario.email)
    );

    const resultado = await getDocs(q);

    if (!resultado.empty) {

      const dados = resultado.docs[0].data();

      if (nomeUsuario) {
        nomeUsuario.textContent = dados.nome || usuario.email;
      }

      if (perfilUsuario) {
        perfilUsuario.textContent =
          dados.perfil || dados.funcao || "Membro";
      }

    } else {

      if (perfilUsuario) {
        perfilUsuario.textContent = "Usuário";
      }

    }

  } catch (erro) {

    console.error("Erro ao carregar cabeçalho:", erro);

    if (perfilUsuario) {
      perfilUsuario.textContent = "Usuário";
    }

  }

});