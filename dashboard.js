import { db, auth } from "./firebase.js";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const pacientes=document.getElementById("pacientes");
const espera=document.getElementById("espera");
const atendimento=document.getElementById("atendimento");
const finalizados=document.getElementById("finalizados");

onSnapshot(collection(db,"pacientes"),(snapshot)=>{

let total=0;
let aguardando=0;
let atendendo=0;
let finalizado=0;

snapshot.forEach((doc)=>{

total++;

const status=doc.data().status;

if(status==="Aguardando") aguardando++;

if(status==="Em atendimento") atendendo++;

if(status==="Finalizado") finalizado++;

});

pacientes.innerHTML=total;
espera.innerHTML=aguardando;
atendimento.innerHTML=atendendo;
finalizados.innerHTML=finalizado;

});

document.getElementById("logout").addEventListener("click",async()=>{

await signOut(auth);

window.location.href="login.html";

});
