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

const eventosRef = collection(
    db,
    "agenda"
);


let editando = null;

const eventosPorDia = {};



// =====================================
// ELEMENTOS
// =====================================

const titulo =
document.getElementById("titulo");

const tipo =
document.getElementById("tipo");

const data =
document.getElementById("data");

const inicio =
document.getElementById("inicio");

const fim =
document.getElementById("fim");

const local =
document.getElementById("local");


const observacoes =
document.getElementById("observacoes");

const listaEventos =
document.getElementById("listaEventos");




// =====================================
// SALVAR EVENTO
// =====================================


window.salvarEvento = async function(){


try{


const evento = {


titulo:
titulo.value.trim(),


tipo:
tipo.value,


data:
data.value,


inicio:
inicio.value,


fim:
fim.value,


local:
local.value.trim(),



observacoes:
observacoes.value.trim(),


status:
"Programado",


criadoEm:
Timestamp.now()


};





if(
!evento.titulo ||
!evento.data ||
!evento.inicio
){


alert(
"Preencha título, data e horário."
);


return;


}



if(editando){


await updateDoc(

doc(
db,
"agenda",
editando
),

evento

);



editando=null;



}else{


await addDoc(

eventosRef,

evento

);



}



limparFormulario();



alert(
"Evento salvo com sucesso!"
);



}

catch(error){


console.error(
"Erro ao salvar:",
error
);


alert(
"Erro ao salvar evento."
);


}


};





// =====================================
// LIMPAR FORMULÁRIO
// =====================================


function limparFormulario(){


titulo.value="";

tipo.selectedIndex=0;

data.value="";

inicio.value="";

fim.value="";

local.value="";


observacoes.value="";


}
// =====================================
// LISTAR EVENTOS TEMPO REAL
// =====================================


const consulta = query(

    eventosRef,

    orderBy(
        "data"
    )

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


await atualizarIndicadoresAgenda();


carregarProximosEventos();


}

);

// =====================================
// INDICADORES DA AGENDA
// =====================================

async function atualizarIndicadoresAgenda(){

    try{

        const totalEventosMes =
        document.getElementById("totalEventosMes");

        const eventosHoje =
        document.getElementById("eventosHoje");

        const proximosSeteDias =
        document.getElementById("proximosSeteDias");

        const totalParticipantesAgenda =
        document.getElementById("totalParticipantesAgenda");


        const snapshot = await getDocs(
            collection(db,"agenda")
        );


        const hoje = new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );


        const mesAtual =
        hoje.getMonth();


        const anoAtual =
        hoje.getFullYear();


        let eventosMes = 0;

        let hojeTotal = 0;

        let seteDias = 0;

        let participantes = 0;



        for(const documento of snapshot.docs){


            const evento =
            documento.data();


            if(!evento.data){

                continue;

            }


            const dataEvento =
            new Date(
                evento.data + "T00:00:00"
            );



            // EVENTOS DO MÊS ATUAL

            if(
                dataEvento.getMonth() === mesAtual &&
                dataEvento.getFullYear() === anoAtual
            ){

                eventosMes++;

            }



            // EVENTOS DE HOJE

            if(
                dataEvento.getTime() === hoje.getTime()
            ){

                hojeTotal++;

            }



            // PRÓXIMOS 7 DIAS

            const diferenca = Math.ceil(
                (
                    dataEvento - hoje
                )
                /
                (1000 * 60 * 60 * 24)
            );


            if(
                diferenca >= 0 &&
                diferenca <= 7
            ){

                seteDias++;

            }



            // PARTICIPANTES ESCALADOS

            const participantesSnapshot =
            await getDocs(
                collection(
                    db,
                    "agenda",
                    documento.id,
                    "participantes"
                )
            );


            participantes +=
            participantesSnapshot.size;


        }



        if(totalEventosMes){

            totalEventosMes.textContent =
            eventosMes;

        }


        if(eventosHoje){

            eventosHoje.textContent =
            hojeTotal;

        }


        if(proximosSeteDias){

            proximosSeteDias.textContent =
            seteDias;

        }


        if(totalParticipantesAgenda){

            totalParticipantesAgenda.textContent =
            participantes;

        }


    }
    catch(error){

        console.error(
            "Erro ao atualizar indicadores da agenda:",
            error
        );

    }

}


// =====================================
// RENDERIZAÇÃO DOS EVENTOS
// =====================================


async function renderizarEvento(item){


const evento =
item.data();



// =====================================
// BUSCAR PARTICIPANTES
// =====================================


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


const dados =
membro.data();



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






const classe =
corStatus(evento.status);




return `


<div class="evento">


<h2>

${escaparTexto(evento.titulo)}

</h2>





<p>

<b>Tipo:</b>

${escaparTexto(evento.tipo)}

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

<b>Observações:</b>

<br>

${escaparTexto(evento.observacoes)}

</p>






<span class="status ${classe}">

${evento.status}

</span>






<div style="

margin-top:15px;

padding:15px;

border-radius:12px;

background:#f2f2f2;

color:#222;

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

Gerar QR Code

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
// =====================================
// FORMATAR DATA
// =====================================


function formatarData(dataTexto){


if(!dataTexto){

return "-";

}



const partes =

dataTexto.split("-");



if(partes.length !== 3){

return dataTexto;

}



return `${partes[2]}/${partes[1]}/${partes[0]}`;


}






// =====================================
// PROTEGER TEXTO
// =====================================


function escaparTexto(texto){


if(!texto){

return "";

}



return texto

.replaceAll("&","&amp;")

.replaceAll("<","&lt;")

.replaceAll(">","&gt;")

.replaceAll('"',"&quot;")

.replaceAll("'","&#039;");


}






// =====================================
// STATUS
// =====================================


function corStatus(status){


switch(status){


case "Em andamento":

return "andamento";


case "Concluído":

return "concluido";


case "Cancelado":

return "cancelado";


default:

return "programado";


}



}






// =====================================
// ABRIR ESCALA
// =====================================


window.abrirEscala = function(id){


console.log(

"Abrindo escala:",

id

);



window.location.href =

"gerenciar-acao.html?id="+id;



};







// =====================================
// EDITAR EVENTO
// =====================================


window.editarEvento = async function(id){



try{



const referencia = doc(

db,

"agenda",

id

);



const resultado = await getDoc(

referencia

);



if(!resultado.exists()){


alert(

"Evento não encontrado."

);


return;


}



const evento = resultado.data();



editando=id;



titulo.value =
evento.titulo || "";



tipo.value =
evento.tipo || "";



data.value =
evento.data || "";



inicio.value =
evento.inicio || "";



fim.value =
evento.fim || "";



local.value =
evento.local || "";



observacoes.value =
evento.observacoes || "";




window.scrollTo({

top:0,

behavior:"smooth"

});




alert(

"Evento carregado para edição."

);



}

catch(error){


console.error(

"Erro editar:",

error

);



alert(

"Erro ao carregar evento."

);



}



};








// =====================================
// CONCLUIR EVENTO
// =====================================


window.concluirEvento = async function(id){


const confirmar = confirm(
"Marcar este evento como concluído e liberar certificados?"
);


if(!confirmar){
return;
}


try{


const eventoRef = doc(
db,
"agenda",
id
);



const eventoSnap = await getDoc(
eventoRef
);



if(!eventoSnap.exists()){

alert("Evento não encontrado.");

return;

}



const evento = eventoSnap.data();



// muda status do evento

await updateDoc(

eventoRef,

{

status:"Concluído"

}

);



// busca participantes do evento

const participantes = await getDocs(

collection(

db,

"agenda",

id,

"participantes"

)

);




// cria certificados

for(const participante of participantes.docs){


const dados = participante.data();



if(

dados.presenca === "Confirmado" ||

dados.presenca === "Confirmada"

){



await addDoc(

collection(db,"certificados"),

{


membroId:

participante.id,


nome:

evento.titulo,


eventoId:

id,


evento:

evento.titulo,


horas:

calcularHoras(evento),


data:

evento.data,


criadoEm:

Timestamp.now(),


status:

"Disponível"


}

);


}


}



alert(
"Evento concluído e certificados liberados!"
);



}

catch(error){


console.error(error);


alert(
"Erro ao concluir evento."
);


}


};








// =====================================
// EXCLUIR EVENTO
// =====================================


window.excluirEvento = async function(id){



const confirmar = confirm(

"Deseja excluir este evento?"

);



if(!confirmar){

return;

}



try{



await deleteDoc(

doc(

db,

"agenda",

id

)

);



alert(

"Evento excluído."

);



}

catch(error){


console.error(error);



alert(

"Erro ao excluir evento."

);



}



};
// =====================================
// CANCELAR EDIÇÃO
// =====================================


window.cancelarEdicao = function(){


editando = null;


limparFormulario();


};








// =====================================
// ALTERAR STATUS MANUALMENTE
// =====================================


window.alterarStatus = async function(id,status){


try{


await updateDoc(

doc(

db,

"agenda",

id

),

{

status:status

}

);



}

catch(error){


console.error(

"Erro ao alterar status:",

error

);



}



};








// =====================================
// FILTRAR EVENTOS
// =====================================


window.filtrarEventos = function(tipoSelecionado){

    const eventos =
    document.querySelectorAll(".evento");

    eventos.forEach((evento)=>{

        const tipoTexto =
        evento.querySelector("p")?.innerText
        .replace("Tipo:","")
        .trim();

        if(
            tipoSelecionado === "Todos" ||
            tipoTexto === tipoSelecionado
        ){

            evento.style.display = "block";

        }else{

            evento.style.display = "none";

        }

    });

};


// =====================================
// BUSCAR EVENTO
// =====================================


window.buscarEvento = function(texto){



const eventos = document.querySelectorAll(

".evento"

);




eventos.forEach((evento)=>{



const conteudo =

evento.innerText.toLowerCase();





if(

conteudo.includes(

texto.toLowerCase()

)

){


evento.style.display="block";


}

else{


evento.style.display="none";


}



});



};








// =====================================
// VERIFICAR EVENTOS DE HOJE
// =====================================


function verificarEventosHoje(){



const hoje = new Date();



const ano = hoje.getFullYear();



const mes = String(

hoje.getMonth()+1

).padStart(2,"0");



const dia = String(

hoje.getDate()

).padStart(2,"0");



const dataAtual =

`${ano}-${mes}-${dia}`;






document

.querySelectorAll(".evento")

.forEach((evento)=>{



if(

evento.innerText.includes(

dataAtual

)

){



evento.classList.add(

"evento-hoje"

);



}



});



}









// =====================================
// ESC PARA CANCELAR EDIÇÃO
// =====================================


document.addEventListener(

"keydown",

(event)=>{


if(event.key === "Escape"){



editando=null;



limparFormulario();



}



}

);








// =====================================
// INICIALIZAÇÃO
// =====================================


setTimeout(()=>{


verificarEventosHoje();


},1000);



function calcularHoras(evento){


if(!evento.inicio || !evento.fim){

return 0;

}



const inicio = evento.inicio.split(":");

const fim = evento.fim.split(":");



const minutosInicio =
Number(inicio[0]) * 60 +
Number(inicio[1]);



const minutosFim =
Number(fim[0]) * 60 +
Number(fim[1]);



return Number(
(
(minutosFim - minutosInicio) / 60
).toFixed(1)
);


}


// =====================================
// EVENTOS DOS FILTROS
// =====================================


const filtroTipo =
document.getElementById("filtroTipo");

if (filtroTipo) {

    filtroTipo.addEventListener("change", () => {

        filtrarEventos(filtroTipo.value);

    });

}



const pesquisaEvento =
document.getElementById("pesquisaEvento");

if (pesquisaEvento) {

    pesquisaEvento.addEventListener("input", () => {

        buscarEvento(
            pesquisaEvento.value
        );

    });

}


console.log(

"LADRF Connect Agenda carregada com sucesso."

);


// =====================================
// GERAR QR CODE DO EVENTO
// =====================================

window.gerarQRCode = function(id){


const link =

window.location.origin +

"/ladrf-connect/login.html?redirect=checkin&evento=" +

id;



const janela = window.open(
"",
"_blank"
);



janela.document.write(`

<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Check-in LADRF Connect</title>


<link rel="preconnect" href="https://fonts.googleapis.com">

<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">


<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>


<style>


*{

box-sizing:border-box;

font-family:'Poppins',sans-serif;

}



body{

margin:0;

min-height:100vh;

display:flex;

justify-content:center;

align-items:center;

background:#f4f7f5;

}



.container{

background:white;

width:90%;

max-width:450px;

padding:35px;

border-radius:20px;

box-shadow:0 10px 30px rgba(0,0,0,.12);

text-align:center;

}



.logo{

font-size:45px;

color:#0B7A3D;

margin-bottom:10px;

}



h1{

color:#0B7A3D;

font-size:28px;

margin:10px 0;

}



.subtitulo{

color:#666;

margin-bottom:25px;

}



.qrcode{

display:flex;

justify-content:center;

padding:20px;

background:#fafafa;

border-radius:15px;

}



.info{

margin-top:25px;

background:#E8F5EC;

padding:15px;

border-radius:12px;

color:#0B7A3D;

font-weight:500;

}



.footer{

margin-top:25px;

font-size:13px;

color:#888;

}



</style>


</head>


<body>


<div class="container">


<div class="logo">

<i>🩺</i>

</div>


<h1>

LADRF Connect

</h1>


<p class="subtitulo">

Check-in de participação em evento

</p>



<div class="qrcode">

<div id="qrcode"></div>

</div>



<div class="info">

📱 Aponte a câmera para confirmar sua presença

</div>



<div class="footer">

Liga Acadêmica de Desporto e Reabilitação na Fisioterapia

<br>

LADRF • 2026

</div>


</div>



<script>


new QRCode(

document.getElementById("qrcode"),

"${link}"

);


</script>



</body>


</html>

`);

// =====================================
// CALENDÁRIO ACADÊMICO
// GERAÇÃO DO CALENDÁRIO MENSAL
// =====================================


const tituloCalendario =
document.getElementById("tituloCalendario");


const diasCalendario =
document.getElementById("diasCalendario");



let dataCalendario = new Date();

dataCalendario.setDate(1);



const nomesMeses = [

"Janeiro",
"Fevereiro",
"Março",
"Abril",
"Maio",
"Junho",
"Julho",
"Agosto",
"Setembro",
"Outubro",
"Novembro",
"Dezembro"

];



// =====================================
// GERAR CALENDÁRIO
// =====================================


function gerarCalendario(){


if(
!diasCalendario ||
!tituloCalendario
){

return;

}



diasCalendario.innerHTML="";



const ano =
dataCalendario.getFullYear();



const mes =
dataCalendario.getMonth();



tituloCalendario.textContent =

`${nomesMeses[mes]} de ${ano}`;



const primeiroDia =

new Date(

ano,

mes,

1

).getDay();




const quantidadeDias =

new Date(

ano,

mes + 1,

0

).getDate();




let linha =

document.createElement("tr");





// espaços antes do primeiro dia

for(
let i = 0;
i < primeiroDia;
i++
){


const vazio =

document.createElement("td");


linha.appendChild(vazio);


}






// criar dias

for(
let dia = 1;
dia <= quantidadeDias;
dia++
){



const celula =

document.createElement("td");



celula.classList.add(
"dia-calendario"
);



celula.innerHTML = `

<div class="numero-dia">

${dia}

</div>

<div
class="eventos-dia"
id="dia-${dia}">

</div>

<div
class="contador-eventos"
id="contador-${dia}">

</div>

`;

// =====================================
// CLICAR NO DIA PARA CADASTRAR EVENTO
// =====================================

celula.onclick = function(){


const mesSelecionado =

String(
dataCalendario.getMonth() + 1
).padStart(2,"0");



const diaSelecionado =

String(dia)
.padStart(2,"0");



const dataSelecionada =

`${dataCalendario.getFullYear()}-${mesSelecionado}-${diaSelecionado}`;



data.value = dataSelecionada;



window.scrollTo({

top:0,

behavior:"smooth"

});



titulo.focus();



};

linha.appendChild(celula);





if(

(primeiroDia + dia) % 7 === 0

||

dia === quantidadeDias

){



diasCalendario.appendChild(linha);



linha =

document.createElement("tr");


}



}



}




gerarCalendario();

// =====================================
// CALENDÁRIO ACADÊMICO
// CARREGAR EVENTOS DO FIRESTORE
// =====================================


async function carregarEventosCalendario(){


try{


document
.querySelectorAll(".eventos-dia")
.forEach((campo)=>{

campo.innerHTML="";

});


const snapshot = await getDocs(

collection(
db,
"agenda"
)

);





snapshot.forEach((documento)=>{


const evento =
documento.data();


if(!eventosPorDia[evento.data]){

    eventosPorDia[evento.data] = [];

}

eventosPorDia[evento.data].push({

    id: documento.id,

    ...evento

});


// data do evento

if(!evento.data){

return;

}




const partes =

evento.data.split("-");



if(partes.length !== 3){

return;

}



const anoEvento =
Number(partes[0]);


const mesEvento =
Number(partes[1]) - 1;


const diaEvento =
Number(partes[2]);





const anoAtual =
dataCalendario.getFullYear();


const mesAtual =
dataCalendario.getMonth();





// mostrar somente eventos do mês aberto

if(

anoEvento !== anoAtual ||

mesEvento !== mesAtual

){

return;

}





const campoDia =

document.getElementById(

`dia-${diaEvento}`

);




if(!campoDia){

return;

}





const contador = document.getElementById(`contador-${diaEvento}`);

if(contador){

    const quantidade = contador.dataset.total
        ? Number(contador.dataset.total)
        : 0;

    contador.dataset.total = quantidade + 1;

    contador.textContent =
        `${quantidade + 1} evento${quantidade ? "s" : ""}`;

}

let cor = "#2E7D32";

switch(evento.tipo){

    case "Curso":
        cor = "#1565C0";
        break;

    case "Congresso":
        cor = "#6A1B9A";
        break;

    case "Reunião":
        cor = "#EF6C00";
        break;

    case "Prova":
        cor = "#C62828";
        break;

}


const totalEventos = campoDia.children.length;

if(totalEventos >= 3){

    const contador = document.getElementById(`contador-${diaEvento}`);

    if(contador){

       contador.innerHTML = `
<span
style="cursor:pointer;color:#1565C0;font-weight:bold"
onclick="verEventosDia('${evento.data}')">

+${totalEventos - 2} eventos

</span>
`;

    }

    return;

}


campoDia.innerHTML += `

<div
class="evento-calendario"
style="background:${cor}"
onclick="event.stopPropagation();abrirEventoCalendario('${documento.id}')"
>

${escaparTexto(evento.titulo)}

</div>

`;




});



}

catch(error){


console.error(

"Erro ao carregar eventos no calendário:",

error

);


}


}




// carregar junto com o calendário

carregarEventosCalendario();

// =====================================
// CALENDÁRIO ACADÊMICO
// NAVEGAÇÃO ENTRE MESES
// =====================================



const botaoAnterior =

document.getElementById(
"mesAnterior"
);



const botaoProximo =

document.getElementById(
"proximoMes"
);





// =====================================
// MÊS ANTERIOR
// =====================================


if(botaoAnterior){


botaoAnterior.addEventListener(

"click",

()=>{


dataCalendario.setMonth(

dataCalendario.getMonth() - 1

);



gerarCalendario();



carregarEventosCalendario();



}


);


}





// =====================================
// PRÓXIMO MÊS
// =====================================


if(botaoProximo){


botaoProximo.addEventListener(

"click",

()=>{


dataCalendario.setMonth(

dataCalendario.getMonth() + 1

);



gerarCalendario();



carregarEventosCalendario();



}


);


}

// =====================================
// ABRIR EVENTO PELO CALENDÁRIO
// =====================================

window.abrirEventoCalendario = async function(id){

    try{

        const referencia = doc(
            db,
            "agenda",
            id
        );

        const resultado = await getDoc(referencia);

        if(!resultado.exists()){

            alert("Evento não encontrado.");
            return;

        }

        const evento = resultado.data();

        const detalhes = document.createElement("div");

        detalhes.className = "modal-overlay";

        detalhes.innerHTML = `

        <div class="modal-evento">

            <h2>📅 ${escaparTexto(evento.titulo)}</h2>

            <p><strong>Tipo:</strong> ${escaparTexto(evento.tipo)}</p>

            <p><strong>Data:</strong> ${formatarData(evento.data)}</p>

            <p><strong>Horário:</strong> ${evento.inicio || "-"} às ${evento.fim || "-"}</p>

            <p><strong>Local:</strong> ${escaparTexto(evento.local)}</p>

            <p><strong>Status:</strong> ${escaparTexto(evento.status)}</p>

            <p><strong>Observações:</strong><br>${escaparTexto(evento.observacoes)}</p>

            <div class="botoes">

                <button class="editar" onclick="editarEvento('${id}'); fecharModalEvento();">
                    ✏️ Editar
                </button>

                <button class="salvar" onclick="abrirEscala('${id}'); fecharModalEvento();">
                    👥 Equipe
                </button>

                <button class="salvar" onclick="gerarQRCode('${id}'); fecharModalEvento();">
                    <i class="fa-solid fa-qrcode"></i> QR Code
                </button>

                <button class="excluir" onclick="excluirEvento('${id}'); fecharModalEvento();">
                    🗑️ Excluir
                </button>

                <button class="btn-secundario" onclick="fecharModalEvento()">
                    Fechar
                </button>

            </div>

        </div>

        `;

        document.body.appendChild(detalhes);

    }

    catch(error){

        console.error("Erro ao abrir evento:", error);

        alert("Erro ao carregar evento.");

    }

};


// =====================================
// FECHAR MODAL
// =====================================

window.fecharModalEvento = function(){

    const modal = document.querySelector(".modal-overlay");

    if(modal){

        modal.remove();

    }

};

// =====================================
// PRÓXIMOS EVENTOS
// =====================================

async function carregarProximosEventos() {

    const area = document.getElementById("proximosEventos");

    if (!area) return;

    try {

        const snapshot = await getDocs(
            query(
                collection(db, "agenda"),
                orderBy("data")
            )
        );

        area.innerHTML = "";

        const hoje = new Date();
        hoje.setHours(0,0,0,0);

        let total = 0;

        snapshot.forEach((docItem) => {

            const evento = docItem.data();

            if (!evento.data) return;

            const dataEvento = new Date(evento.data + "T00:00:00");

            if (dataEvento >= hoje && total < 5) {

                area.innerHTML += `
                    <div class="evento">
                        <h3>${escaparTexto(evento.titulo)}</h3>
                        <p>📅 ${formatarData(evento.data)}</p>
                        <p>⏰ ${evento.inicio || "-"} ${evento.fim ? "às " + evento.fim : ""}</p>
                        <p>📍 ${escaparTexto(evento.local || "-")}</p>
                    </div>
                `;

                total++;

            }

        });

        if (total === 0) {
            area.innerHTML = "<p>Nenhum próximo evento encontrado.</p>";
        }

    } catch (erro) {

        console.error(erro);

        area.innerHTML = "<p>Erro ao carregar próximos eventos.</p>";

    }

}

window.verEventosDia = function(data){

    const lista = eventosPorDia[data] || [];

    if(lista.length === 0){
        return;
    }

    const modal = document.createElement("div");

    modal.className = "modal-overlay";

    let html = `
        <div class="modal-evento">
            <h2>📅 Eventos de ${formatarData(data)}</h2>
    `;

    lista.sort((a,b)=>(a.inicio || "").localeCompare(b.inicio || ""));

    lista.forEach(evento=>{

        html += `

        <div class="evento-dia-card">

            <strong>${escaparTexto(evento.titulo)}</strong>

            <p>🕒 ${evento.inicio || "--:--"} ${evento.fim ? "às " + evento.fim : ""}</p>

            <p>📍 ${escaparTexto(evento.local || "-")}</p>

            <button
                class="editar"
                onclick="abrirEventoCalendario('${evento.id}');fecharModalEvento();">

                Abrir

            </button>

        </div>

        `;

    });

    html += `

        <div class="botoes">

            <button
                class="btn-secundario"
                onclick="fecharModalEvento()">

                Fechar

            </button>

        </div>

        </div>

    `;

    modal.innerHTML = html;

    document.body.appendChild(modal);

}