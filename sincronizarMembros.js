import { db } from "./firebase.js";

import {

collection,

getDocs,

doc,

setDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



async function sincronizar(){


const usuarios = await getDocs(

collection(db,"usuarios")

);



for(const documento of usuarios.docs){


const usuario = documento.data();

const uid = documento.id;



await setDoc(

doc(db,"membros",uid),

{

uid: uid,

nomeCompleto: usuario.nome || "",

nome: usuario.nome || "",

email: usuario.email || "",

telefone:"",

curso:"",

periodo:"",

funcao:"Membro",

status:"Ativo"

},

{

merge:true

}

);



console.log(
"Membro sincronizado:",
usuario.nome
);



}



alert(
"Sincronização concluída!"
);


}



sincronizar();
