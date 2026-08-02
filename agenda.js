import { db } from "./firebase.js";

import {
collection,
addDoc,
updateDoc,
deleteDoc,
doc,
getDoc,
onSnapshot,
query,
orderBy,
Timestamp,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// REFERÊNCIA FIRESTORE
// =====================================

const eventosRef = collection(db, "agenda");

let editando = null;


// =====================================
// ELEMENTOS
// =====================================

const titulo = document.getElementById("titulo");
const tipo = document.getElementById("tipo");

const categoria = document.getElementById("categoria");
const disciplina = document.getElementById("disciplina");
const professor = document.getElementById("professor");
const cor = document.getElementById("cor");

const data = document.getElementById("data");
const inicio = document.getElementById("inicio");
const fim = document.getElementById("fim");

const local = document.getElementById("local");
const responsavel = document.getElementById("responsavel");
const observacoes = document.getElementById("observacoes");

const listaEventos = document.getElementById("listaEventos");

const filtroCategoria =
document.getElementById("filtroCategoria");

const pesquisaEvento =
document.getElementById("pesquisaEvento");


// =====================================
// SALVAR EVENTO
// =====================================

window.salvarEvento = async function(){

try{

const evento={

titulo:
titulo.value.trim(),

tipo:
tipo.value,

categoria:
categoria ? categoria.value : "LADRF",

disciplina:
disciplina ? disciplina.value.trim() : "",

professor:
professor ? professor.value.trim() : "",

data:
data.value,

inicio:
inicio.value,

fim:
fim.value,

local:
local.value.trim(),

responsavel:
responsavel.value.trim(),

observacoes:
observacoes.value.trim(),

cor:
cor ? cor.value : "#198754",

status:"Programado",

criadoEm:
Timestamp.now()

};

if(
!evento.titulo ||
!evento.data ||
!evento.inicio
){

alert("Preencha título, data e horário.");

return;

}

if(editando){

await updateDoc(

doc(db,"agenda",editando),

evento

);

editando=null;

}else{

await addDoc(eventosRef,evento);

}

limparFormulario();

alert("Evento salvo com sucesso!");

}

catch(error){

console.error(error);

alert("Erro ao salvar evento.");

}

};


// =====================================
// LIMPAR FORMULÁRIO
// =====================================

function limparFormulario(){

titulo.value="";

tipo.selectedIndex=0;

if(categoria)
categoria.selectedIndex=0;

if(disciplina)
disciplina.value="";

if(professor)
professor.value="";

data.value="";

inicio.value="";

fim.value="";

local.value="";

responsavel.value="";

observacoes.value="";

if(cor)
cor.value="#198754";

}
// =====================================
// LISTAR EVENTOS EM TEMPO REAL
// =====================================

const consulta = query(
    eventosRef,
    orderBy("data")
);


onSnapshot(

consulta,

async(snapshot)=>{


listaEventos.innerHTML="";


if(snapshot.empty){


listaEventos.innerHTML=`

<div class="evento">

<h2>

Nenhum evento cadastrado

</h2>

</div>

`;


return;

}




for(const item of snapshot.docs){


listaEventos.innerHTML +=

await renderizarEvento(item);


}



aplicarFiltros();


}

);




// =====================================
// RENDERIZAR EVENTO
// =====================================


async function renderizarEvento(item){


const evento = item.data();




// BUSCAR PARTICIPANTES

const participantesSnapshot = await getDocs(

collection(

db,

"agenda",

item.id,

"participantes"

)

);



let total = 0;

let confirmados = 0;

let pendentes = 0;

let recusados = 0;



participantesSnapshot.forEach((membro)=>{


total++;


const dados = membro.data();



if(

dados.presenca === "Confirmado" ||

dados.presenca === "Confirmada"

){


confirmados++;


}

else if(

dados.presenca === "Recusado"

){


recusados++;


}

else{


pendentes++;


}



});





const corEvento =

evento.cor ||

corCategoria(
evento.categoria
);



const classeStatus =

corStatus(
evento.status
);





return `



<div

class="evento"

data-categoria="${evento.categoria || "LADRF"}"

>



<div style="

border-left:7px solid ${corEvento};

padding-left:15px;

">



<h2>

${escaparTexto(evento.titulo)}

</h2>




<span style="

background:${corEvento};

color:white;

padding:5px 12px;

border-radius:20px;

font-size:12px;

font-weight:bold;

">

${escaparTexto(
evento.categoria || "LADRF"
)}

</span>



</div>






<p>

<b>Tipo:</b>

${escaparTexto(evento.tipo)}

</p>





<p>

<b>Disciplina:</b>

${escaparTexto(
evento.disciplina || "-"
)}

</p>





<p>

<b>Professor:</b>

${escaparTexto(
evento.professor || "-"
)}

</p>





<p>

<b>Data:</b>

${formatarData(evento.data)}

</p>





<p>

<b>Horário:</b>

${evento.inicio || "-"}

às

${evento.fim || "-"}

</p>





<p>

<b>Local:</b>

${escaparTexto(evento.local)}

</p>





<p>

<b>Responsável:</b>

${escaparTexto(evento.responsavel)}

</p>





<p>

<b>Observações:</b>

<br>

${escaparTexto(evento.observacoes)}

</p>






<span class="status ${classeStatus}">

${evento.status}

</span>





<div style="

margin-top:15px;

padding:15px;

border-radius:12px;

background:#f2f2f2;

">



<h3>

👥 Equipe escalada

</h3>




<p>

Total:

<b>${total}</b>

</p>




<p>

🟢 Confirmados:

<b>${confirmados}</b>

</p>




<p>

🟡 Pendentes:

<b>${pendentes}</b>

</p>




<p>

🔴 Recusados:

<b>${recusados}</b>

</p>



</div>





<div class="botoes">



<button

class="salvar"

onclick="abrirEscala('${item.id}')"

>

👥 Escalar equipe

</button>




<button

class="salvar"

onclick="gerarQRCode('${item.id}')"

>

<i class="fa-solid fa-qrcode"></i>

QR Code

</button>





<button

class="editar"

onclick="editarEvento('${item.id}')"

>

✏️ Editar

</button>





<button

class="concluir"

onclick="concluirEvento('${item.id}')"

>

✅ Concluir

</button>





<button

class="excluir"

onclick="excluirEvento('${item.id}')"

>

🗑️ Excluir

</button>



</div>





</div>



`;

}
/* ==========================================================
   FORMULÁRIOS
========================================================== */

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
    margin-bottom: 20px;
}


.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}


label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}


/* INPUTS */

input,
select,
textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #ddd;
    background: #fff;
    font-size: 14px;
    outline: none;
    transition: 0.2s;
    box-sizing: border-box;
}


textarea {
    min-height: 120px;
    resize: vertical;
}


input:focus,
select:focus,
textarea:focus {
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46,125,50,0.15);
}


input::placeholder,
textarea::placeholder {
    color: #999;
}


/* ==========================================================
   BOTÕES
========================================================== */

button {
    border: none;
    padding: 11px 18px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: 0.2s;
}


button:hover {
    transform: translateY(-1px);
    opacity: 0.9;
}


.btn-success,
.btn-verde,
button.verde {
    background: #2e7d32;
    color: white;
}


.btn-primary,
.btn-azul {
    background: #1976d2;
    color: white;
}


.btn-danger,
.btn-vermelho {
    background: #d32f2f;
    color: white;
}


.btn-warning {
    background: #f9a825;
    color: white;
}


.botoes {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 15px;
}


/* ==========================================================
   CHECKBOX E RADIO
========================================================== */

.checkbox-group,
.radio-group {
    display: flex;
    align-items: center;
    gap: 8px;
}


input[type="checkbox"],
input[type="radio"] {
    width: auto;
}


/* ==========================================================
   CAMPO DE PESQUISA
========================================================== */

.busca {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}


.busca input {
    flex: 1;
}


/* ==========================================================
   DIVISORES
========================================================== */

hr {
    border: none;
    height: 1px;
    background: #eee;
    margin: 25px 0;
}
/* ==========================================================
   TABELAS
========================================================== */

.table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


table {
    width: 100%;
    border-collapse: collapse;
    min-width: 700px;
}


thead {
    background: #2e7d32;
    color: white;
}


th {
    padding: 14px;
    text-align: left;
    font-size: 14px;
}


td {
    padding: 13px 14px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    color: #444;
}


tbody tr:hover {
    background: #f7f7f7;
}


/* ==========================================================
   STATUS
========================================================== */

.status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
}


.status.aguardando {
    background: #fff3cd;
    color: #856404;
}


.status.atendimento {
    background: #cfe8ff;
    color: #0d47a1;
}


.status.finalizado {
    background: #d4edda;
    color: #155724;
}


.status.cancelado {
    background: #f8d7da;
    color: #721c24;
}


/* ==========================================================
   CARDS DE INFORMAÇÃO
========================================================== */

.info-card {
    background: white;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.info-card h3 {
    margin-bottom: 8px;
    color: #2e7d32;
}


.info-card p {
    color: #666;
    font-size: 14px;
}


/* ==========================================================
   DASHBOARD
========================================================== */

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
}


.dashboard-card {
    background: white;
    padding: 22px;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    display: flex;
    align-items: center;
    gap: 15px;
}


.dashboard-icon {
    width: 55px;
    height: 55px;
    border-radius: 14px;
    background: #2e7d32;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
}


.dashboard-info h2 {
    margin: 0;
    font-size: 28px;
}


.dashboard-info span {
    color: #777;
    font-size: 14px;
}


/* ==========================================================
   ALERTAS
========================================================== */

.alert {
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 15px;
    font-size: 14px;
}


.alert-success {
    background: #d4edda;
    color: #155724;
}


.alert-error {
    background: #f8d7da;
    color: #721c24;
}


.alert-warning {
    background: #fff3cd;
    color: #856404;
}
/* ==========================================================
   FILA DE ATENDIMENTO
========================================================== */

.fila-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}


.fila-card {
    background: white;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
}


.fila-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
}


.fila-info strong {
    font-size: 16px;
    color: #333;
}


.fila-info span {
    font-size: 13px;
    color: #777;
}


.fila-acoes {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}


/* ==========================================================
   MACAS / ATENDIMENTO
========================================================== */

.macas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
}


.maca-card {
    background: white;
    padding: 20px;
    border-radius: 14px;
    text-align: center;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.maca-card h3 {
    margin-bottom: 10px;
}


.maca-livre {
    border-top: 5px solid #2e7d32;
}


.maca-ocupada {
    border-top: 5px solid #d32f2f;
}


.maca-status {
    font-weight: 700;
    font-size: 14px;
}


/* ==========================================================
   QR CODE
========================================================== */

.qrcode-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}


.qrcode-container img,
.qrcode-container canvas {
    max-width: 220px;
    border-radius: 10px;
}


/* ==========================================================
   MODAIS
========================================================== */

.modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 999;
}


.modal.active {
    display: flex;
}


.modal-content {
    background: white;
    width: 90%;
    max-width: 500px;
    border-radius: 16px;
    padding: 25px;
    animation: aparecer 0.2s ease;
}


.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}


.modal-close {
    cursor: pointer;
    font-size: 22px;
    color: #666;
}


@keyframes aparecer {

    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }

}


/* ==========================================================
   LOADING
========================================================== */

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px;
    color: #777;
}


.spinner {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 4px solid #ddd;
    border-top-color: #2e7d32;
    animation: girar 0.8s linear infinite;
}


@keyframes girar {

    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }

}/* ==========================================================
   PÁGINAS INTERNAS
========================================================== */

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    gap: 15px;
    flex-wrap: wrap;
}


.page-header h1 {
    margin: 0;
    font-size: 26px;
    color: #333;
}


.page-header p {
    margin: 5px 0 0;
    color: #777;
    font-size: 14px;
}


/* ==========================================================
   SEÇÕES
========================================================== */

.section {
    background: white;
    border-radius: 16px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}


.section-title h2 {
    margin: 0;
    color: #333;
    font-size: 20px;
}


/* ==========================================================
   RELATÓRIOS
========================================================== */

.report-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 18px;
}


.report-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.report-card .numero {
    font-size: 32px;
    font-weight: 700;
    color: #2e7d32;
}


.report-card .titulo {
    margin-top: 5px;
    color: #777;
}


/* ==========================================================
   AGENDA
========================================================== */

.agenda-container {
    display: grid;
    gap: 15px;
}


.agenda-item {
    background: white;
    padding: 18px;
    border-radius: 14px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.07);
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.agenda-data {
    display: flex;
    flex-direction: column;
    gap: 5px;
}


.agenda-data strong {
    color: #2e7d32;
}


.agenda-acoes {
    display: flex;
    gap: 8px;
}


/* ==========================================================
   MATERIAIS / ESTOQUE
========================================================== */

.estoque-card {
    background: white;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.estoque-quantidade {
    font-size: 30px;
    font-weight: bold;
}


.estoque-baixo {
    color: #d32f2f;
    font-weight: 700;
}


.estoque-ok {
    color: #2e7d32;
    font-weight: 700;
}


/* ==========================================================
   RESPONSIVIDADE
========================================================== */

@media (max-width: 768px) {

    .main-content {
        padding: 15px;
    }


    .page-header {
        flex-direction: column;
        align-items: flex-start;
    }


    .fila-card,
    .agenda-item {
        flex-direction: column;
        align-items: flex-start;
    }


    .botoes,
    .fila-acoes,
    .agenda-acoes {
        width: 100%;
    }


    button {
        width: 100%;
    }


    .dashboard-grid,
    .report-cards {
        grid-template-columns: 1fr;
    }

}
/* ==========================================================
   FREQUÊNCIA / PRESENÇA
========================================================== */

.presenca-lista {
    display: flex;
    flex-direction: column;
    gap: 12px;
}


.presenca-item {
    background: white;
    padding: 15px 18px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
}


.presenca-membro {
    display: flex;
    align-items: center;
    gap: 12px;
}


.avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #2e7d32;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}


.presenca-check {
    display: flex;
    align-items: center;
    gap: 8px;
}


/* ==========================================================
   MEMBROS
========================================================== */

.membros-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px,1fr));
    gap: 18px;
}


.membro-card {
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.membro-topo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
}


.membro-nome {
    font-weight: 700;
    color: #333;
}


.membro-cargo {
    font-size: 13px;
    color: #777;
}


.membro-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
}


/* ==========================================================
   EVENTOS
========================================================== */

.eventos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
    gap: 20px;
}


.evento-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
}


.evento-header {
    background: #2e7d32;
    color: white;
    padding: 18px;
}


.evento-header h3 {
    margin: 0;
}


.evento-body {
    padding: 18px;
}


.evento-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #666;
    font-size: 14px;
}


/* ==========================================================
   EXPORTAÇÃO
========================================================== */

.export-box {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}


.export-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 18px;
    border-radius: 10px;
    background: #2e7d32;
    color: white;
}


/* ==========================================================
   EMPTY STATE
========================================================== */

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #777;
}


.empty-state .icone {
    font-size: 45px;
    margin-bottom: 15px;
}


.empty-state h3 {
    margin-bottom: 8px;
    color: #555;
}


.empty-state p {
    font-size: 14px;
}


/* ==========================================================
   UTILITÁRIOS
========================================================== */

.text-center {
    text-align: center;
}


.text-right {
    text-align: right;
}


.mt-10 {
    margin-top: 10px;
}


.mt-20 {
    margin-top: 20px;
}


.mb-10 {
    margin-bottom: 10px;
}


.mb-20 {
    margin-bottom: 20px;
}


.hidden {
    display: none !important;
}


.flex {
    display: flex;
}


.align-center {
    align-items: center;
}


.justify-between {
    justify-content: space-between;
}


.gap-10 {
    gap: 10px;
}/* ==========================================================
   LOGIN / AUTENTICAÇÃO
========================================================== */

.login-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f6f4;
    padding: 20px;
}


.login-box {
    width: 100%;
    max-width: 420px;
    background: white;
    padding: 35px;
    border-radius: 18px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}


.login-logo {
    text-align: center;
    margin-bottom: 25px;
}


.login-logo img {
    max-width: 120px;
}


.login-title {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
}


.login-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: #777;
}


/* ==========================================================
   PERFIL DO USUÁRIO
========================================================== */

.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
}


.user-avatar {
    width: 40px;
    height: 40px;
    background: #2e7d32;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
}


.user-data {
    display: flex;
    flex-direction: column;
}


.user-name {
    font-size: 14px;
    font-weight: 700;
}


.user-role {
    font-size: 12px;
    color: #777;
}


/* ==========================================================
   NOTIFICAÇÕES
========================================================== */

.notification {
    position: relative;
}


.notification-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #d32f2f;
    color: white;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
}


.notification-box {
    background: white;
    border-radius: 14px;
    padding: 15px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.notification-item {
    padding: 12px;
    border-bottom: 1px solid #eee;
}


.notification-item:last-child {
    border-bottom: none;
}


/* ==========================================================
   TOASTS
========================================================== */

.toast {
    position: fixed;
    right: 25px;
    bottom: 25px;
    padding: 15px 20px;
    border-radius: 12px;
    background: #333;
    color: white;
    z-index: 2000;
    animation: toastEntrada .3s ease;
}


.toast.success {
    background: #2e7d32;
}


.toast.error {
    background: #d32f2f;
}


.toast.warning {
    background: #f9a825;
}


@keyframes toastEntrada {

    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }

}


/* ==========================================================
   IMPRESSÃO
========================================================== */

@media print {

    .sidebar,
    .topbar,
    button,
    .no-print {
        display: none !important;
    }


    .main-content {
        margin: 0;
        padding: 0;
    }


    .section,
    .info-card,
    .table-container {
        box-shadow: none;
        border: 1px solid #ddd;
    }

}/* ==========================================================
   COMPONENTES GERAIS
========================================================== */

.card {
    background: white;
    border-radius: 16px;
    padding: 22px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
}


.card-header h2,
.card-header h3 {
    margin: 0;
    color: #333;
}


.card-body {
    color: #555;
}


/* ==========================================================
   MENU DE NAVEGAÇÃO
========================================================== */

.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 18px;
}


.menu-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: .2s;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.menu-card:hover {
    transform: translateY(-4px);
}


.menu-icon {
    width: 55px;
    height: 55px;
    margin: 0 auto 12px;
    border-radius: 14px;
    background: #2e7d32;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
}


.menu-card h3 {
    margin: 0;
    font-size: 15px;
    color: #333;
}


.menu-card span {
    display: block;
    margin-top: 5px;
    font-size: 12px;
    color: #777;
}


/* ==========================================================
   PAGINAÇÃO
========================================================== */

.pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 25px;
}


.pagination button {
    width: 38px;
    height: 38px;
    padding: 0;
    background: white;
    color: #333;
    border: 1px solid #ddd;
}


.pagination button.active {
    background: #2e7d32;
    color: white;
    border-color: #2e7d32;
}


/* ==========================================================
   FILTROS
========================================================== */

.filters {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}


.filters .filter-item {
    flex: 1;
    min-width: 180px;
}


/* ==========================================================
   BADGES
========================================================== */

.badge {
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 700;
}


.badge-green {
    background: #d4edda;
    color: #155724;
}


.badge-red {
    background: #f8d7da;
    color: #721c24;
}


.badge-yellow {
    background: #fff3cd;
    color: #856404;
}


.badge-blue {
    background: #cfe8ff;
    color: #0d47a1;
}


/* ==========================================================
   RESPONSIVO EXTRA
========================================================== */

@media(max-width:600px){

    .section {
        padding: 18px;
    }


    .card {
        padding: 18px;
    }


    .menu-grid {
        grid-template-columns: repeat(2,1fr);
        gap: 12px;
    }


    .menu-card {
        padding: 15px;
    }


    .menu-icon {
        width: 45px;
        height: 45px;
        font-size: 20px;
    }


    .filters {
        flex-direction: column;
    }

}
/* ==========================================================
   AJUSTES FINAIS DO SISTEMA LADRF CONNECT
========================================================== */


/* Evita seleção acidental em botões e cards */

button,
.menu-card,
.dashboard-card,
.fila-card {
    user-select: none;
}


/* Links */

a {
    text-decoration: none;
    color: inherit;
}


/* Ícones */

.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}


/* Texto secundário */

.text-muted {
    color: #777;
    font-size: 13px;
}


/* Texto destaque */

.text-primary {
    color: #2e7d32;
    font-weight: 700;
}


/* ==========================================================
   BOTÃO VOLTAR
========================================================== */

.btn-voltar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: white;
    color: #2e7d32;
    border: 1px solid #2e7d32;
}


.btn-voltar:hover {
    background: #2e7d32;
    color: white;
}


/* ==========================================================
   AVISOS DE SISTEMA
========================================================== */

.system-message {
    padding: 20px;
    border-radius: 14px;
    text-align: center;
    background: white;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}


.system-message h3 {
    margin-bottom: 8px;
    color: #333;
}


.system-message p {
    color: #777;
}


/* ==========================================================
   LOADING DE PÁGINA
========================================================== */

.page-loading {
    position: fixed;
    inset: 0;
    background: rgba(255,255,255,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000;
}


.page-loading.hidden {
    display: none;
}


/* ==========================================================
   ACESSIBILIDADE
========================================================== */

:focus-visible {
    outline: 3px solid rgba(46,125,50,0.4);
    outline-offset: 2px;
}


/* ==========================================================
   FINAL
========================================================== */

body {
    overflow-x: hidden;
}


img {
    max-width: 100%;
    height: auto;
}


::selection {
    background: #2e7d32;
    color: white;
}