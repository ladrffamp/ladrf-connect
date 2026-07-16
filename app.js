import { db } from "./firebase.js";

import {

collection,
addDoc,
getDocs,
query,
orderBy,
onSnapshot,
doc,
updateDoc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function cadastrarPaciente(paciente){

await addDoc(
collection(db,"pacientes"),
paciente
);

}

export function ouvirFila(callback){

const q=query(
collection(db,"pacientes"),
orderBy("horario")
);

onSnapshot(q,(snapshot)=>{

let lista=[];

snapshot.forEach(doc=>{

lista.push({

id:doc.id,

...doc.data()

});

});

callback(lista);

});

}

export async function chamarPaciente(id,maca){

await updateDoc(

doc(db,"pacientes",id),

{

status:"Chamado",

maca:maca

}

);

}