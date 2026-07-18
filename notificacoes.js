// notificacoes.js


import { auth, db } from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

getMessaging,

getToken,

onMessage

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";


import {

doc,

updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// Configurar Firebase Messaging

import {

app

} from "./firebase.js";



const messaging = getMessaging(app);






// =====================================
// ATIVAR NOTIFICAÇÕES
// =====================================


async function ativarNotificacoes(){



try{


const permissao = await Notification.requestPermission();



if(permissao !== "granted"){


console.log(

"Usuário recusou notificações."

);


return;


}





const token = await getToken(

messaging,

{


vapidKey:

"SUA_CHAVE_VAPID"


}

);






if(token){


console.log(

"TOKEN PUSH:",

token

);



salvarToken(token);


}



}catch(error){



console.error(

"Erro ao ativar notificações:",

error

);



}



}








// =====================================
// SALVAR TOKEN NO USUÁRIO
// =====================================


async function salvarToken(token){



onAuthStateChanged(auth,async(usuario)=>{



if(usuario){



await updateDoc(

doc(

db,

"usuarios",

usuario.uid

),


{


tokenPush:token


}


);



console.log(

"Token salvo no usuário."

);



}



});



}








// =====================================
// NOTIFICAÇÃO COM SITE ABERTO
// =====================================


onMessage(

messaging,

(payload)=>{


console.log(

"Mensagem recebida:",

payload

);



alert(

payload.notification.title

);



}

);







// iniciar

ativarNotificacoes();
