// gerenciar-acao.js


import { db } from "./firebase.js";


import {

doc,
getDoc,
collection,
getDocs,
setDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// =====================================
// PEGAR ID DA AÇÃO
// =====================================

const idAcao =

new URLSearchParams(window.location.search)

.get("id");



console.log(
"ID DA AÇÃO:",
idAcao
);



if(!idAcao){


    alert(
        "Erro: ação não encontrada."
    );


    throw new Error(
        "ID da ação ausente"
    );


}




// =====================================
// ELEMENTOS
// =====================================


const nomeAcao =

document.getElementById(
"nomeAcao"
);



const listaMembros =

document.getElementById(
"listaMembros"
);



const botaoSalvar =

document.getElementById(
"salvar"
);





// =====================================
// CARREGAR NOME DA AÇÃO
// =====================================


async function carregarAcao(){


    try{


        const referencia =

        doc(

            db,

            "acoes",

            idAcao

        );



        const resultado =

        await getDoc(
            referencia
        );



        if(
            resultado.exists()
        ){


            nomeAcao.innerHTML =

            resultado.data().nome;


        }


        else{


            nomeAcao.innerHTML =

            "Ação não encontrada";


        }



    }

    catch(error){


        console.error(

            "Erro ao carregar ação:",

            error

        );


    }


}





// =====================================
// CARREGAR MEMBROS
// =====================================


async function carregarMembros(){


    try{


        const usuarios =

        await getDocs(

            collection(

                db,

                "usuarios"

            )

        );



        listaMembros.innerHTML = "";



        usuarios.forEach(

            (usuario)=>{


                const dados = usuario.data();

if (dados.perfil === "membro") {

    listaMembros.innerHTML += `

    <div style="
        margin:10px;
        padding:10px;
        border:1px solid #ddd;
        border-radius:8px;
    ">

        <input
            type="checkbox"
            class="membro"
            value="${usuario.id}"
            data-nome="${dados.nome}"
            data-email="${dados.email}"
        >

        <strong>${dados.nome}</strong><br>
        <small>${dados.email}</small>

    </div>

    `;

}



            }


        );



        if(
            listaMembros.innerHTML === ""
        ){


            listaMembros.innerHTML =

            "Nenhum membro encontrado.";


        }



    }

    catch(error){


        console.error(

            "Erro ao buscar membros:",

            error

        );


    }



}





// =====================================
// SALVAR ESCALA
// =====================================


botaoSalvar.addEventListener(

"click",

async()=>{


    try{


        const selecionados =

        document.querySelectorAll(

            ".membro:checked"

        );



        if(
            selecionados.length === 0
        ){


            alert(

                "Selecione pelo menos um membro."

            );


            return;


        }




        for(
            const membro of selecionados
        ){



            await setDoc(


                doc(

                    db,

                    "acoes",

                    idAcao,

                    "participantes",

                    membro.value

                ),


                {


                    nome:

                    membro.dataset.nome,


                    presenca:

                    "Pendente",


                    escaladoEm:

                    serverTimestamp()


                }


            );



        }



        alert(

            "Escala salva com sucesso!"

        );



    }


    catch(error){


        console.error(

            "Erro ao salvar escala:",

            error

        );


        alert(

            "Erro ao salvar escala."

        );


    }



}

);






// =====================================
// INICIAR
// =====================================


carregarAcao();

carregarMembros();
