import { db } from "./firebase.js";

import {
    collection,
    query,
    orderBy,
    limit,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Área dos avisos no Dashboard

const areaAvisos = document.getElementById("avisosInicio");


// Só executa se existir o espaço no index.html

if (areaAvisos) {


    const consulta = query(

        collection(db, "avisos"),

        orderBy(
            "data",
            "desc"
        ),

        limit(3)

    );



    onSnapshot(
        consulta,

        (snapshot) => {


            areaAvisos.innerHTML = "";



            if (snapshot.empty) {


                areaAvisos.innerHTML = `

                <p style="text-align:center;">

                Nenhum aviso publicado.

                </p>

                `;


                return;

            }





            snapshot.forEach((documento)=>{


                const aviso = documento.data();



                let data = "";



                if(
                    aviso.data &&
                    aviso.data.seconds
                ){


                    data = new Date(

                        aviso.data.seconds * 1000

                    ).toLocaleString("pt-BR");


                }





                areaAvisos.innerHTML += `


                <div class="aviso-item">


                    <h3>

                    ${aviso.fixado ? "📌 " : ""}

                    ${aviso.titulo}

                    </h3>



                    <p>

                    <strong>

                    Categoria:

                    </strong>

                    ${aviso.categoria}

                    </p>



                    <p>

                    <strong>

                    Prioridade:

                    </strong>

                    ${aviso.prioridade}

                    </p>




                    <p>

                    ${aviso.mensagem}

                    </p>




                    <small>

                    <i class="fa-solid fa-clock"></i>

                    Publicado em:

                    ${data}

                    </small>


                </div>


                <hr>


                `;



            });



        }


    );


}
