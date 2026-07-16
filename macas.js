import { db } from "./firebase.js";


import {

collection,
onSnapshot,
doc,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const area =
document.getElementById("macas");



onSnapshot(

collection(db,"macas"),

(snapshot)=>{


area.innerHTML="";


snapshot.forEach((documento)=>{


const maca =
documento.data();


const id =
documento.id;



area.innerHTML += `


<div class="maca ${maca.status==="Livre" ? "livre":"ocupada"}">


<h2>

Maca ${maca.numero}

</h2>


<h3>

${maca.status}

</h3>


<p>

${maca.paciente || "Disponível"}

</p>


${

maca.status==="Ocupada"

?

`

<br>

<button onclick="liberar('${id}')">

Liberar Maca

</button>

`

:

""

}


</div>


`;



});


});


window.liberar = async function(id){


await updateDoc(

doc(db,"macas",id),

{

status:"Livre",

paciente:""

}

);


}
