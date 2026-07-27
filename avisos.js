import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    onSnapshot,
    Timestamp,
    doc,
    deleteDoc,
    updateDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const avisosRef = collection(db, "avisos");



// ======================================
// PUBLICAR AVISO
// ======================================


window.salvarAviso = async function () {


    const titulo =
    document.getElementById("titulo").value.trim();


    const categoria =
    document.getElementById("categoria").value;


    const prioridade =
    document.getElementById("prioridade").value;


    const dataEvento =
    document.getElementById("dataEvento").value;


    const horaEvento =
    document.getElementById("horaEvento").value;


    const localEvento =
    document.getElementById("localEvento").value.trim();


    const mensagem =
    document.getElementById("mensagem").value.trim();


    const fixado =
    document.getElementById("fixado").checked;



    if(!titulo || !mensagem){


        alert(
            "Preencha o título e a mensagem."
        );


        return;

    }



    try{


        await addDoc(
            avisosRef,
            {


                titulo,

                categoria,

                prioridade,

                dataEvento,

                horaEvento,

                localEvento,

                mensagem,

                fixado,


                dataPublicacao:
                Timestamp.now()


            }
        );



        alert(
            "Aviso publicado com sucesso!"
        );



        limparFormulario();



    }catch(erro){


        console.error(erro);


        alert(
            "Erro ao publicar aviso."
        );


    }


};





// ======================================
// LIMPAR FORMULÁRIO
// ======================================


function limparFormulario(){


document.getElementById("titulo").value="";


document.getElementById("categoria").selectedIndex=0;


document.getElementById("prioridade").selectedIndex=0;


document.getElementById("dataEvento").value="";


document.getElementById("horaEvento").value="";


document.getElementById("localEvento").value="";


document.getElementById("mensagem").value="";


document.getElementById("fixado").checked=false;


}





// ======================================
// LISTAR AVISOS
// ======================================


onSnapshot(
avisosRef,
(snapshot)=>{


const lista =
document.getElementById("listaAvisos");



lista.innerHTML="";



if(snapshot.empty){


lista.innerHTML=`

<p style="text-align:center">

Nenhum aviso publicado.

</p>

`;


return;


}



let avisos=[];



snapshot.forEach((documento)=>{


avisos.push({

id:documento.id,

...documento.data()

});


});




// FIXADOS PRIMEIRO

avisos.sort((a,b)=>{


if(a.fixado && !b.fixado){

return -1;

}


if(!a.fixado && b.fixado){

return 1;

}


return 0;


});





avisos.forEach((aviso)=>{



let dataPublicacao="-";



if(aviso.dataPublicacao?.seconds){


dataPublicacao =

new Date(

aviso.dataPublicacao.seconds * 1000

)

.toLocaleString("pt-BR");


}




lista.innerHTML += `


<div class="card">


<h2>

${aviso.fixado ? "📌 " : ""}

${aviso.titulo}

</h2>



<p>

<strong>Categoria:</strong>

${aviso.categoria}

</p>



<p>

<strong>Prioridade:</strong>

${aviso.prioridade}

</p>



<p>

📅 <strong>Data:</strong>

${aviso.dataEvento || "-"}

</p>



<p>

🕒 <strong>Horário:</strong>

${aviso.horaEvento || "-"}

</p>



<p>

📍 <strong>Local:</strong>

${aviso.localEvento || "-"}

</p>



<hr>



<p>

${aviso.mensagem}

</p>



<small>

Publicado em:

${dataPublicacao}

</small>



<br><br>



<button

class="btn-primary"

onclick="editarAviso('${aviso.id}')">


<i class="fa-solid fa-pen"></i>

Editar


</button>



<button

class="btn-danger"

onclick="excluirAviso('${aviso.id}')">


<i class="fa-solid fa-trash"></i>

Excluir


</button>



</div>


`;



});



});







// ======================================
// EXCLUIR AVISO
// ======================================


window.excluirAviso = async function(id){



const confirmar = confirm(

"Deseja excluir este aviso?"

);



if(!confirmar){

return;

}



try{


await deleteDoc(

doc(
db,
"avisos",
id
)

);



alert(

"Aviso excluído com sucesso!"

);



}catch(erro){


console.error(erro);


alert(

"Erro ao excluir aviso."

);


}



};






// ======================================
// EDITAR AVISO
// ======================================


window.editarAviso = async function(id){


const novoTitulo = prompt(
"Digite o novo título do aviso:"
);



if(!novoTitulo){

return;

}



try{


await updateDoc(

doc(db,"avisos",id),

{

titulo:novoTitulo

}

);



alert(
"Aviso atualizado!"
);



}catch(erro){


console.error(erro);


alert(
"Erro ao editar aviso."
);


}


};
