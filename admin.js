import { auth, db } from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





onAuthStateChanged(auth, async (usuario)=>{



if(!usuario){


window.location.href="login.html";


return;


}





const referencia = doc(

db,

"usuarios",

usuario.uid

);





const dados = await getDoc(referencia);






if(!dados.exists()){


window.location.href="index.html";


return;


}







if(dados.data().perfil !== "admin"){



alert(
"Acesso permitido apenas para administradores"
);



window.location.href="index.html";



return;


}





});
