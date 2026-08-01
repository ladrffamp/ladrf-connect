// ==========================================================
// AGENDA LADRF
// ==========================================================


import { db } from "./firebase.js";


import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    orderBy,
    query,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ==========================================================
// ELEMENTOS
// ==========================================================


const calendario =
document.getElementById("calendario");


const mesAno =
document.getElementById("mesAno");


const listaProximosEventos =
document.getElementById("listaProximosEventos");



const modal =
document.getElementById("modalEvento");


const btnNovoEvento =
document.getElementById("btnNovoEvento");


const fecharModal =
document.getElementById("fecharModal");


const cancelarEvento =
document.getElementById("cancelarEvento");


const formEvento =
document.getElementById("formEvento");





// filtros

const filtroCategoria =
document.getElementById("filtroCategoria");


const filtroTipo =
document.getElementById("filtroTipo");


const buscarEvento =
document.getElementById("buscarEvento");





// calendário

const mesAnterior =
document.getElementById("mesAnterior");


const proximoMes =
document.getElementById("proximoMes");






// ==========================================================
// VARIÁVEIS
// ==========================================================


let eventos = [];


let dataAtual = new Date();


let eventoEditando = null;

// ==========================================================
// CARREGAR EVENTOS DO FIRESTORE
// ==========================================================


async function carregarEventos(){


    try {


        const ref =
        collection(db, "agenda");


        const consulta =
        query(
            ref,
            orderBy("data", "asc")
        );



        const snapshot =
        await getDocs(consulta);



        eventos = [];



        snapshot.forEach((item)=>{


            eventos.push({

                id:item.id,

                ...item.data()

            });


        });



        renderizarCalendario();


        renderizarProximosEventos();



    } catch(error){


        console.error(
            "Erro ao carregar agenda:",
            error
        );


    }


}






// ==========================================================
// RENDERIZAR CALENDÁRIO
// ==========================================================


function renderizarCalendario(){


    calendario.innerHTML = "";



    const ano =
    dataAtual.getFullYear();



    const mes =
    dataAtual.getMonth();



    const primeiroDia =
    new Date(
        ano,
        mes,
        1
    ).getDay();



    const ultimoDia =
    new Date(
        ano,
        mes + 1,
        0
    ).getDate();



    const nomeMes =
    dataAtual.toLocaleDateString(
        "pt-BR",
        {
            month:"long",
            year:"numeric"
        }
    );



    mesAno.textContent =
    nomeMes.charAt(0).toUpperCase()
    +
    nomeMes.slice(1);





    // espaços antes do primeiro dia


    for(
        let i = 0;
        i < primeiroDia;
        i++
    ){


        const vazio =
        document.createElement("div");


        vazio.className =
        "calendar-day vazio";


        calendario.appendChild(vazio);


    }





    // dias do mês


    for(
        let dia = 1;
        dia <= ultimoDia;
        dia++
    ){


        const div =
        document.createElement("div");



        div.className =
        "calendar-day";



        div.innerHTML = `

            <strong>
                ${dia}
            </strong>

            <div class="eventos-dia">
            </div>

        `;



        const eventosDia =
        eventos.filter((evento)=>{


            if(!evento.data)
                return false;



            const dataEvento =
            evento.data.toDate
            ?
            evento.data.toDate()
            :
            new Date(evento.data);



            return (

                dataEvento.getDate()
                ===
                dia

                &&

                dataEvento.getMonth()
                ===
                mes

                &&

                dataEvento.getFullYear()
                ===
                ano

            );


        });




        const areaEventos =
        div.querySelector(
            ".eventos-dia"
        );



        eventosDia.forEach((evento)=>{


            const item =
            document.createElement("span");



            item.className =
            "evento-mini";



            item.style.background =
            evento.cor || "#2e7d32";



            item.textContent =
            evento.titulo;



            areaEventos.appendChild(item);



        });




        calendario.appendChild(div);


    }


}
// ==========================================================
// MODAL
// ==========================================================


btnNovoEvento.addEventListener(
    "click",
    ()=>{


        eventoEditando = null;


        formEvento.reset();


        modal.classList.add(
            "active"
        );


    }
);





fecharModal.addEventListener(
    "click",
    fecharFormulario
);



cancelarEvento.addEventListener(
    "click",
    fecharFormulario
);





function fecharFormulario(){


    modal.classList.remove(
        "active"
    );


    eventoEditando = null;


    formEvento.reset();


}







// ==========================================================
// SALVAR EVENTO
// ==========================================================


formEvento.addEventListener(
    "submit",
    async(e)=>{


        e.preventDefault();




        const dados = {


            titulo:
            document.getElementById(
                "titulo"
            ).value,



            categoria:
            document.getElementById(
                "categoria"
            ).value,



            tipo:
            document.getElementById(
                "tipo"
            ).value,



            data:
            Timestamp.fromDate(
                new Date(
                    document.getElementById(
                        "data"
                    ).value
                )
            ),



            inicio:
            document.getElementById(
                "inicio"
            ).value,



            fim:
            document.getElementById(
                "fim"
            ).value,



            local:
            document.getElementById(
                "local"
            ).value,



            responsavel:
            document.getElementById(
                "responsavel"
            ).value,



            disciplina:
            document.getElementById(
                "disciplina"
            ).value,



            professor:
            document.getElementById(
                "professor"
            ).value,



            cor:
            document.getElementById(
                "cor"
            ).value,



            observacoes:
            document.getElementById(
                "observacoes"
            ).value,



            criadoEm:
            Timestamp.now()


        };







        try {



            if(eventoEditando){



                await updateDoc(

                    doc(
                        db,
                        "agenda",
                        eventoEditando
                    ),

                    dados

                );



            } else {



                await addDoc(

                    collection(
                        db,
                        "agenda"
                    ),

                    dados

                );


            }




            fecharFormulario();


            carregarEventos();





        } catch(error){


            console.error(
                "Erro ao salvar evento:",
                error
            );


        }



    }

);// ==========================================================
// PRÓXIMOS EVENTOS
// ==========================================================


function renderizarProximosEventos(){


    listaProximosEventos.innerHTML = "";



    const hoje =
    new Date();



    const proximos =
    eventos
    .filter((evento)=>{


        const data =
        evento.data.toDate
        ?
        evento.data.toDate()
        :
        new Date(evento.data);



        return data >= hoje;


    })

    .slice(0,5);





    if(proximos.length === 0){


        listaProximosEventos.innerHTML = `


        <div class="empty-state">


            <div class="icone">
            📅
            </div>


            <h3>
            Nenhum evento próximo
            </h3>


            <p>
            Cadastre novos eventos na agenda.
            </p>


        </div>


        `;


        return;


    }







    proximos.forEach((evento)=>{


        const data =
        evento.data.toDate
        ?
        evento.data.toDate()
        :
        new Date(evento.data);




        const card =
        document.createElement("div");



        card.className =
        "agenda-item";



        card.innerHTML = `


            <div class="agenda-data">


                <strong>
                ${evento.titulo}
                </strong>


                <span>
                ${data.toLocaleDateString("pt-BR")}
                </span>


                <span>
                ${evento.local || ""}
                </span>


            </div>



            <div class="agenda-acoes">


                <button 
                class="btn-danger excluir"
                data-id="${evento.id}">

                🗑

                </button>


            </div>


        `;



        listaProximosEventos.appendChild(card);



    });




    document
    .querySelectorAll(".excluir")
    .forEach((botao)=>{


        botao.addEventListener(
            "click",
            async()=>{


                const id =
                botao.dataset.id;



                await deleteDoc(

                    doc(
                        db,
                        "agenda",
                        id
                    )

                );



                carregarEventos();



            }
        );


    });


}








// ==========================================================
// FILTROS
// ==========================================================


function aplicarFiltros(){


    const categoria =
    filtroCategoria.value;



    const tipo =
    filtroTipo.value;



    const busca =
    buscarEvento.value
    .toLowerCase();




    eventos =
    eventos.filter((evento)=>{


        const correspondeCategoria =

        categoria === "todos"
        ||
        evento.categoria === categoria;



        const correspondeTipo =

        tipo === "todos"
        ||
        evento.tipo === tipo;



        const correspondeBusca =

        evento.titulo
        .toLowerCase()
        .includes(busca);




        return (

            correspondeCategoria
            &&
            correspondeTipo
            &&
            correspondeBusca

        );


    });



    renderizarCalendario();

    renderizarProximosEventos();


    carregarEventos();


}
// ==========================================================
// NAVEGAÇÃO DO CALENDÁRIO
// ==========================================================


mesAnterior.addEventListener(
    "click",
    ()=>{


        dataAtual.setMonth(
            dataAtual.getMonth() - 1
        );


        renderizarCalendario();


    }
);





proximoMes.addEventListener(
    "click",
    ()=>{


        dataAtual.setMonth(
            dataAtual.getMonth() + 1
        );


        renderizarCalendario();


    }
);








// ==========================================================
// EVENTOS DOS FILTROS
// ==========================================================


filtroCategoria.addEventListener(
    "change",
    aplicarFiltros
);



filtroTipo.addEventListener(
    "change",
    aplicarFiltros
);



buscarEvento.addEventListener(
    "input",
    aplicarFiltros
);








// ==========================================================
// INICIAR SISTEMA
// ==========================================================


carregarEventos();