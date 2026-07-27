import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
limit,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const area = document.getElementById("avisosInicio");


if(area){


const consulta = query(

collection(db,"avisos"),

orderBy("data","desc"),

limit(3)

);



onSnapshot(consulta,(snapshot)=>{


area.innerHTML="";


if(snapshot.empty){


area.innerHTML=`

<p>
Nenhum aviso publicado.
</p>

`;

return;


}



snapshot.forEach((doc)=>{


const aviso = doc.data();


let data="";


if(aviso.data?.seconds){


data = new Date(

aviso.data.seconds * 1000

).toLocaleString("pt-BR");


}



area.innerHTML += `


<div class="aviso-dashboard">


<h3>

${aviso.fixado ? "📌 " : ""}

${aviso.titulo}

</h3>


<p>

<strong>${aviso.categoria}</strong>

-

${aviso.prioridade}

</p>


<p>

${aviso.mensagem.substring(0,120)}

${aviso.mensagem.length > 120 ? "..." : ""}

</p>


<small>

${data}

</small>


</div>


<hr>


`;


});


});


}
