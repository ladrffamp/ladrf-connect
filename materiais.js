import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestampdoc,
    updateDoc
}
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const materiaisRef = collection(db, "materiais");
const movimentacoesRef = collection(db, "movimentacoes");

const listaMateriais = document.getElementById("listaMateriais");

const totalMateriais = document.getElementById("totalMateriais");
const estoqueBaixo = document.getElementById("estoqueBaixo");
const esgotados = document.getElementById("esgotados");
const movimentacoesHoje = document.getElementById("movimentacoesHoje");

const modal = document.getElementById("modalMaterial");

const pesquisa = document.getElementById("pesquisa");

const btnNovo = document.getElementById("novoMaterial");

btnNovo.onclick = function(){

    document.getElementById("modalMaterial").style.display = "flex";

};

const btnSalvar = document.getElementById("salvarMaterial");

const btnCancelar = document.getElementById("cancelarModal");

let materiais = [];



btnNovo.addEventListener("click", () => {

    modal.style.display = "flex";

});



btnCancelar.addEventListener("click", () => {

    fecharModal();

});



function fecharModal() {

    modal.style.display = "none";



    document.getElementById("nome").value = "";

    document.getElementById("categoria").selectedIndex = 0;

    document.getElementById("quantidade").value = "";

    document.getElementById("minimo").value = "";

    document.getElementById("unidade").selectedIndex = 0;

}



window.fecharModal = fecharModal;
// ===============================
// CARREGAR MATERIAIS EM TEMPO REAL
// ===============================

onSnapshot(

    query(materiaisRef, orderBy("nome")),

    (snapshot) => {

        materiais = [];

        snapshot.forEach((docSnap) => {

            materiais.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        atualizarTabela();

    }

);



// ===============================
// ATUALIZAR TABELA
// ===============================

function atualizarTabela() {

    listaMateriais.innerHTML = "";

    let total = 0;
    let baixo = 0;
    let zerado = 0;

    const filtro = pesquisa.value.toLowerCase().trim();

    materiais.forEach((material) => {

        if (
            filtro &&
            !material.nome.toLowerCase().includes(filtro)
        ) return;

        total++;

        let status = "Normal";
        let classe = "normal";

        if (material.quantidade <= 0) {

            status = "Esgotado";
            classe = "esgotado";
            zerado++;

        } else if (material.quantidade <= material.minimo) {

            status = "Baixo";
            classe = "baixo";
            baixo++;

        }

        listaMateriais.innerHTML += `

<tr>

<td>${material.nome}</td>

<td>${material.categoria}</td>

<td>${material.quantidade}</td>

<td>${material.minimo}</td>

<td>${material.unidade}</td>

<td>

<span class="status ${classe}">
${status}
</span>

</td>

<td class="acoes">

<button
class="btn-icon entrada"
onclick="entrada('${material.id}')">

<i class="fa-solid fa-plus"></i>

</button>

<button
class="btn-icon saida"
onclick="saida('${material.id}')">

<i class="fa-solid fa-minus"></i>

</button>

</td>

</tr>

`;

    });

    totalMateriais.textContent = total;
    estoqueBaixo.textContent = baixo;
    esgotados.textContent = zerado;

}



// ===============================
// PESQUISA
// ===============================

pesquisa.addEventListener("input", atualizarTabela);



// ===============================
// MOVIMENTAÇÕES (temporário)
// ===============================

movimentacoesHoje.textContent = "--";
// ===============================
// CADASTRAR MATERIAL
// ===============================

btnSalvar.addEventListener("click", async () => {

    const nome = document.getElementById("nome").value.trim();
    const categoria = document.getElementById("categoria").value;
    const quantidade = Number(document.getElementById("quantidade").value);
    const minimo = Number(document.getElementById("minimo").value);
    const unidade = document.getElementById("unidade").value;

    if (!nome) {
        alert("Informe o nome do material.");
        return;
    }

    if (!categoria) {
        alert("Selecione uma categoria.");
        return;
    }

    if (isNaN(quantidade) || quantidade < 0) {
        alert("Quantidade inválida.");
        return;
    }

    if (isNaN(minimo) || minimo < 0) {
        alert("Estoque mínimo inválido.");
        return;
    }

    try {

        await addDoc(materiaisRef, {
            nome,
            categoria,
            quantidade,
            minimo,
            unidade
        });

        if (quantidade > 0) {

            await addDoc(movimentacoesRef, {

                material: nome,
                tipo: "entrada",
                quantidade: quantidade,
                motivo: "Cadastro inicial",
                data: serverTimestamp()

            });

        }

        fecharModal();

    } catch (erro) {

        console.error(erro);
        alert("Erro ao salvar o material.");

    }

});
// ===============================
// ENTRADA DE ESTOQUE
// ===============================

window.entrada = async function(id){

    const material = materiais.find(
        item => item.id === id
    );


    if(!material){
        return;
    }


    const valor = prompt(
        `Quantidade de entrada para ${material.nome}:`
    );


    const quantidade = Number(valor);


    if(!quantidade || quantidade <= 0){

        alert("Informe uma quantidade válida.");

        return;

    }



    try{


        const referencia = doc(
            db,
            "materiais",
            id
        );


        await updateDoc(
            referencia,
            {

                quantidade:
                Number(material.quantidade) + quantidade

            }
        );



        await addDoc(
            movimentacoesRef,
            {

                material: material.nome,

                tipo:"entrada",

                quantidade: quantidade,

                motivo:"Reposição de estoque",

                data:serverTimestamp()

            }
        );


    }catch(erro){

        console.error(erro);

        alert("Erro ao adicionar estoque.");

    }


};





// ===============================
// SAÍDA DE ESTOQUE
// ===============================

window.saida = async function(id){


    const material = materiais.find(
        item => item.id === id
    );


    if(!material){
        return;
    }



    const valor = prompt(
        `Quantidade de saída para ${material.nome}:`
    );



    const quantidade = Number(valor);



    if(!quantidade || quantidade <= 0){

        alert("Informe uma quantidade válida.");

        return;

    }



    const novoEstoque =
    Number(material.quantidade) - quantidade;



    if(novoEstoque < 0){

        alert(
            "Estoque insuficiente."
        );

        return;

    }



    try{


        const referencia = doc(
            db,
            "materiais",
            id
        );



        await updateDoc(
            referencia,
            {

                quantidade: novoEstoque

            }

        );



        await addDoc(
            movimentacoesRef,
            {

                material: material.nome,

                tipo:"saida",

                quantidade: quantidade,

                motivo:"Uso em atendimento",

                data:serverTimestamp()

            }

        );


    }catch(erro){

        console.error(erro);

        alert("Erro ao retirar estoque.");

    }


};
// ===============================
// CONTADOR DE MOVIMENTAÇÕES DO DIA
// ===============================

const hoje = new Date();

hoje.setHours(0,0,0,0);



onSnapshot(

    movimentacoesRef,

    (snapshot)=>{


        let totalHoje = 0;


        snapshot.forEach((item)=>{


            const dados = item.data();



            if(dados.data){


                const dataMov =
                dados.data.toDate();



                if(dataMov >= hoje){

                    totalHoje++;

                }


            }


        });



        movimentacoesHoje.textContent = totalHoje;



    }

);





// ===============================
// FECHAR MODAL CLICANDO FORA
// ===============================


modal.addEventListener(
"click",
(event)=>{


    if(event.target === modal){

        fecharModal();

    }


});





// ===============================
// EXPORTAÇÃO FUTURA
// ===============================
//
// Este arquivo já está preparado
// para integração com:
//
// atendimento.html
//
// Exemplo futuro:
//
// finalizar atendimento
//       ↓
// baixa automática de:
// - gelo
// - bandagem
// - kinesio tape
// - luvas
//
//       ↓
// registro em movimentacoes
//
// ===============================
