import { auth } from "./firebase.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const sair = document.getElementById("sair");

sair.addEventListener("click", async ()=>{

await signOut(auth);

window.location.href="login.html";

});
