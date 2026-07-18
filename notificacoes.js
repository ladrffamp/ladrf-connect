// notificacoes.js


import { auth, db, app } from "./firebase.js";


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



const messaging = getMessaging(app);



// =====================================
// REGISTRAR SERVICE WORKER
// =====================================

async function registrarServiceWorker(){

    if("serviceWorker" in navigator){

        try{

            const registration =
            await navigator.serviceWorker.register(
                "/ladrf-connect/firebase-messaging-sw.js"
            );


            console.log(
                "Service Worker registrado:",
                registration
            );


        }catch(error){

            console.error(
                "Erro Service Worker:",
                error
            );

        }

    }

}





// =====================================
// ATIVAR NOTIFICAÇÕES
// =====================================


async function ativarNotificacoes(){


try{


await registrarServiceWorker();



const permissao =
await Notification.requestPermission();



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

"BLd1c09XUUZnB4WjZY0XvdCJs_wdLvxxUw_ey-sNTC8f7hUreUwY5x5rOsnWkrRwrj-G4KH1cj8LHtv-oR6jZe0"


}

);





if(token){


console.log(
"TOKEN FCM:",
token
);



salvarTokenUsuario(token);


}


}catch(error){


console.error(
"Erro FCM:",
error
);


}


}







// =====================================
// SALVAR TOKEN DO MEMBRO
// =====================================


async function salvarTokenUsuario(token){


onAuthStateChanged(

auth,

async(usuario)=>{


if(usuario){


try{


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
"Token salvo."
);



}catch(error){


console.error(
"Erro ao salvar token:",
error
);


}


}



}


);


}







// =====================================
// MENSAGEM COM SITE ABERTO
// =====================================


onMessage(

messaging,

(payload)=>{


console.log(
"Mensagem recebida:",
payload
);



new Notification(

payload.notification.title,

{


body:
payload.notification.body


}

);


}

);





ativarNotificacoes();
