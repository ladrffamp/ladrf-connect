// minhas-escalas.js


import { db, auth } from "./firebase.js";


import {

collection,
query,
where,
getDocs,
doc,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// =====================================
// ELEMENTO
// =====================================

const lista =

document.getElementById(
"listaEscalas"
);





// =====================================
// BUSCAR ESCALAS DO MEMBRO
// =====================================


async function carregarEscalas(uid){


    lista.innerHTML =
    "Buscando escalas...";


    try{


        const acoes =

        await getDocs(

            collection(
                db,
                "acoes"
            )

        );



        lista.innerHTML = "";



        for(
            const acaoDoc of acoes.docs
        ){


            const participantes =

            await getDocs(

                collection(

                    db,

                    "acoes",

                    acaoDoc.id,

                    "participantes"

                )

            );



            participantes.forEach(

                (membro)=>{


                    if(
                        membro.id === uid
                    ){



                        const dados =

                        acaoDoc.data();



                        const participante =

                        membro.data();



                        lista.innerHTML += `


                        <div style="
                        border:1px solid #ccc;
                        padding:15px;
                        margin:10px;
                        border-radius:10px;
                        ">


                        <h2>
                        ${dados.nome}
                        </h2>


                        <p>
                        📅 ${dados.data}
                        </p>


                        <p>
                        📍 ${dados.local}
                        </p>


                        <p>
                        ⏰ ${dados.horaInicio || "-"}
                        até
                        ${dados.horaFim || "-"}
                        </p>


                        <p>

                        Status:

                        <b id="status-${acaoDoc.id}">

                        ${participante.presenca}

                        </b>

                        </p>


                        <button

                        onclick="confirmarPresenca(
                        '${acaoDoc.id}'
                        )"

                        >

                        ✅ Confirmar presença

                        </button>


                        <button

                        onclick="recusarPresenca(
                        '${acaoDoc.id}'
                        )"

                        >

                        ❌ Não poderei comparecer

                        </button>


                        </div>


                        `;


                    }


                }

            );



        }



        if(lista.innerHTML===""){


            lista.innerHTML =

            "Nenhuma escala encontrada.";


        }



    }

    catch(error){


        console.error(

            "Erro ao buscar escalas:",

            error

        );


    }


}




// =====================================
// CONFIRMAR
// =====================================


window.confirmarPresenca =

async function(idAcao){



const uid =

auth.currentUser.uid;



await updateDoc(


doc(

db,

"acoes",

idAcao,

"participantes",

uid

),


{


presenca:

"Confirmado"


}


);



alert(
"Presença confirmada!"
);



carregarEscalas(uid);



};





// =====================================
// RECUSAR
// =====================================


window.recusarPresenca =

async function(idAcao){



const uid =

auth.currentUser.uid;



await updateDoc(


doc(

db,

"acoes",

idAcao,

"participantes",

uid

),


{


presenca:

"Recusado"


}


);



alert(
"Resposta enviada."
);



carregarEscalas(uid);



};





// =====================================
// LOGIN
// =====================================


onAuthStateChanged(

auth,

(usuario)=>{


    if(usuario){


        carregarEscalas(
            usuario.uid
        );


    }

    else{


        lista.innerHTML =

        "Usuário não logado.";


    }


});
