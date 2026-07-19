import { db } from "./firebase.js";

import {

collection,

onSnapshot,

query,

orderBy

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const lista = document.getElementById("listaMovimentacoes");

const movimentacoesRef = collection(
    db,
    "movimentacoes"
);



// Carregar movimentações em tempo real

onSnapshot(

    query(
        movimentacoesRef,
        orderBy("data","desc")
    ),

    (snapshot)=>{


        lista.innerHTML="";


        if(snapshot.empty){

            lista.innerHTML=`

            <tr>

            <td colspan="5" style="text-align:center">

            Nenhuma movimentação encontrada

            </td>

            </tr>

            `;

            return;

        }



        snapshot.forEach((doc)=>{


            const item = doc.data();



            let data="";



            if(item.data){

                data = item.data
                .toDate()
                .toLocaleString("pt-BR");

            }
            else{

                data="-";

            }



            let tipo = item.tipo || "";

            let classe = "";



            if(tipo==="entrada"){

                classe="entrada";

                tipo="Entrada";

            }


            if(tipo==="saida"){

                classe="saida";

                tipo="Saída";

            }



            lista.innerHTML += `

            <tr>

            <td>

            ${data}

            </td>


            <td>

            ${item.material || "-"}

            </td>


            <td class="${classe}">

            ${tipo}

            </td>


            <td>

            ${item.quantidade || 0}

            </td>


            <td>

            ${item.motivo || "-"}

            </td>


            </tr>

            `;


        });


    }

);
