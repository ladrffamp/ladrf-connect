import { db, auth } from "./firebase.js";

import {
collection,
doc,
getDoc,
query,
where,
onSnapshot,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged,
updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// =====================================
// ELEMENTOS
// =====================================

const foto = document.getElementById("fotoPerfil");

const nome = document.getElementById("nomePerfil");

const funcao = document.getElementById("funcaoPerfil");

const status = document.getElementById("statusPerfil");

const email = document.getElementById("emailPerfil");

const telefone = document.getElementById("telefonePerfil");

const curso = document.getElementById("cursoPerfil");

const periodo = document.getElementById("periodoPerfil");

const presencas = document.getElementById("totalPresencas");

const faltas = document.getElementById("totalFaltas");

const participacoes = document.getElementById("totalParticipacoes");

const certificados = document.getElementById("totalCertificados");

const horas = document.getElementById("totalHoras");

const listaEventos =
document.getElementById("listaEventos");

const listaCertificados =
document.getElementById("listaCertificados");

const historico =
document.getElementById("historicoPerfil");

const listaConquistas =
document.getElementById("listaConquistas");

let usuarioAtual = null;

let uid =
new URLSearchParams(window.location.search).get("id");


// =====================================
// LOGIN
// =====================================

onAuthStateChanged(auth, async(usuario)=>{

    if(!usuario){

        window.location.href="login.html";

        return;

    }

    usuarioAtual = usuario;

    if(!uid){

        uid = usuario.uid;

    }

    carregarPerfil(uid);

});


// =====================================
// CARREGAR PERFIL
// =====================================

async function carregarPerfil(id){

    try{

        const membroRef =
        doc(db,"membros",id);

        const membroSnap =
        await getDoc(membroRef);

        if(!membroSnap.exists()){

            nome.innerHTML =
            "Membro não encontrado.";

            return;

        }

        const membro =
        membroSnap.data();

        // FOTO

        if(membro.foto){

            foto.src = membro.foto;

        }else{

            foto.src =
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(
                membro.nomeCompleto ||
                membro.nome ||
                "Membro"
            ) +
            "&background=0B7A3D&color=ffffff&size=300";

        }

        // DADOS

        nome.innerHTML =
        membro.nomeCompleto ||
        membro.nome ||
        "-";

        funcao.innerHTML =
        `<i class="fa-solid fa-user-tie"></i> ${membro.funcao || "Membro"}`;

        status.innerHTML =
        `<i class="fa-solid fa-circle-check"></i> ${membro.status || "Ativo"}`;

        email.innerHTML =
        membro.email || "-";

        telefone.innerHTML =
        membro.telefone || "-";

        curso.innerHTML =
        membro.curso || "-";

        periodo.innerHTML =
        membro.periodo || "-";


carregarFrequencia(id);

carregarEventos();

carregarCertificados(id);

carregarHistorico(id);

carregarConquistas();

observarPerfil(id);
        
    }

    catch(error){

        console.error(error);

        nome.innerHTML =
        "Erro ao carregar perfil.";

    }

}


// =====================================
// EDITAR PERFIL
// =====================================

window.editarPerfil = async()=>{

    const telefoneNovo = prompt(
        "Telefone:",
        telefone.innerText
    );

    if(telefoneNovo===null) return;

    const cursoNovo = prompt(
        "Curso:",
        curso.innerText
    );

    if(cursoNovo===null) return;

    const periodoNovo = prompt(
        "Período:",
        periodo.innerText
    );

    if(periodoNovo===null) return;

    try{

        await updateDoc(

            doc(db,"membros",uid),

            {

                telefone:telefoneNovo,

                curso:cursoNovo,

                periodo:periodoNovo

            }

        );

        telefone.innerHTML = telefoneNovo;

        curso.innerHTML = cursoNovo;

        periodo.innerHTML = periodoNovo;

        alert("Perfil atualizado!");

    }

    catch(error){

        console.error(error);

        alert("Erro ao atualizar perfil.");

    }

};
// =====================================
// CARREGAR FREQUÊNCIA
// =====================================

function carregarFrequencia(id){

    const frequenciaRef =
    collection(db,"frequencia");


    const q =
    query(
        frequenciaRef,
        where("membroId","==",id)
    );


    onSnapshot(q,(snapshot)=>{


        let presentes = 0;

        let ausentes = 0;


        snapshot.forEach(doc=>{


            const dados =
            doc.data();


            if(dados.presente){

                presentes++;

            }else{

                ausentes++;

            }


        });


        presencas.innerHTML =
        presentes;


        faltas.innerHTML =
        ausentes;


        participacoes.innerHTML =
        snapshot.size;


    });


}



// =====================================
// CARREGAR EVENTOS
// =====================================

function carregarEventos(){


    const eventosRef =
    collection(db,"eventos");


    onSnapshot(eventosRef,(snapshot)=>{


        listaEventos.innerHTML="";


        if(snapshot.empty){


            listaEventos.innerHTML =
            "<p>Nenhum evento encontrado.</p>";


            return;

        }



        snapshot.forEach((doc)=>{


            const evento =
            doc.data();



            const div =
            document.createElement("div");


            div.className =
            "itemPerfil";


            div.innerHTML = `


            <h4>
            <i class="fa-solid fa-calendar"></i>
            ${evento.nome || "Evento"}
            </h4>


            <p>
            ${evento.data || ""}
            </p>


            <span>
            ${evento.local || ""}
            </span>


            `;


            listaEventos.appendChild(div);



        });



    });



}



// =====================================
// CARREGAR CERTIFICADOS
// =====================================

function carregarCertificados(id){


    const certificadosRef =
    collection(db,"certificados");


    const q =
    query(
        certificadosRef,
        where("membroId","==",id)
    );



    onSnapshot(q,(snapshot)=>{


        listaCertificados.innerHTML="";


        certificados.innerHTML =
        snapshot.size;



        if(snapshot.empty){


            listaCertificados.innerHTML =
            "<p>Nenhum certificado disponível.</p>";


            return;


        }



        let totalHoras = 0;



        snapshot.forEach((doc)=>{


            const cert =
            doc.data();



            totalHoras +=
            Number(cert.horas || 0);



            const div =
            document.createElement("div");



            div.className =
            "itemPerfil";



            div.innerHTML = `


            <h4>

            <i class="fa-solid fa-certificate"></i>

            ${cert.nome || "Certificado"}

            </h4>


            <p>

            ${cert.horas || 0} horas

            </p>


            `;


            listaCertificados.appendChild(div);



        });



        horas.innerHTML =
        totalHoras;



    });



}



// =====================================
// CARREGAR HISTÓRICO
// =====================================

function carregarHistorico(id){


    const historicoRef =
    collection(db,"historico");


    const q =
    query(
        historicoRef,
        where("membroId","==",id)
    );



    onSnapshot(q,(snapshot)=>{


        historico.innerHTML="";



        if(snapshot.empty){


            historico.innerHTML =
            "<p>Nenhuma atividade registrada.</p>";


            return;


        }



        snapshot.forEach((doc)=>{


            const item =
            doc.data();



            const div =
            document.createElement("div");



            div.className =
            "itemPerfil";



            div.innerHTML = `


            <h4>

            <i class="fa-solid fa-clock-rotate-left"></i>

            ${item.titulo || "Atividade"}

            </h4>


            <p>

            ${item.data || ""}

            </p>


            <small>

            ${item.descricao || ""}

            </small>


            `;


            historico.appendChild(div);



        });



    });



}



// =====================================
// CONQUISTAS
// =====================================

function carregarConquistas(){


    const conquistas = [


        {
            titulo:"Membro ativo",
            icone:"fa-star"
        },


        {
            titulo:"Participou de ações",
            icone:"fa-hand-holding-medical"
        },


        {
            titulo:"Certificado conquistado",
            icone:"fa-certificate"
        }


    ];



    listaConquistas.innerHTML="";



    conquistas.forEach(c=>{


        const div =
        document.createElement("div");



        div.className =
        "conquista";



        div.innerHTML = `


        <i class="fa-solid ${c.icone}"></i>


        <span>

        ${c.titulo}

        </span>


        `;



        listaConquistas.appendChild(div);



    });



}

// =====================================
// ALTERAR SENHA
// =====================================

window.alterarSenha = async()=>{


    const novaSenha =
    prompt("Digite a nova senha:");



    if(!novaSenha){

        return;

    }



    if(novaSenha.length < 6){

        alert(
        "A senha deve ter no mínimo 6 caracteres."
        );

        return;

    }



    try{


        await updatePassword(
            usuarioAtual,
            novaSenha
        );



        alert(
        "Senha alterada com sucesso!"
        );


    }


    catch(error){


        console.error(error);


        alert(
        "Não foi possível alterar a senha. Faça login novamente e tente."
        );


    }



};





// =====================================
// ATUALIZAR FOTO
// =====================================

window.atualizarFoto = async()=>{


    const novaFoto =
    prompt(
    "Cole o link da nova foto:"
    );



    if(!novaFoto){

        return;

    }



    try{


        await updateDoc(

            doc(
                db,
                "membros",
                uid
            ),

            {

                foto:novaFoto

            }

        );



        foto.src =
        novaFoto;



        alert(
        "Foto atualizada!"
        );


    }


    catch(error){


        console.error(error);


        alert(
        "Erro ao atualizar foto."
        );


    }



};






// =====================================
// SAIR DA CONTA
// =====================================

window.sairConta = async()=>{


    try{


        await auth.signOut();


        window.location.href =
        "login.html";


    }


    catch(error){


        console.error(error);


    }



};





// =====================================
// ATUALIZAÇÃO EM TEMPO REAL DO MEMBRO
// =====================================

function observarPerfil(id){


    const membroRef =
    doc(
        db,
        "membros",
        id
    );



    onSnapshot(
        membroRef,
        (snapshot)=>{


            if(!snapshot.exists()){

                return;

            }



            const dados =
            snapshot.data();



            if(dados.foto){

                foto.src =
                dados.foto;

            }



            nome.innerHTML =
            dados.nomeCompleto ||
            dados.nome ||
            "-";



            funcao.innerHTML =
            `<i class="fa-solid fa-user-tie"></i> ${
            dados.funcao || "Membro"
            }`;



            status.innerHTML =
            `<i class="fa-solid fa-circle-check"></i> ${
            dados.status || "Ativo"
            }`;



        }

    );



}
