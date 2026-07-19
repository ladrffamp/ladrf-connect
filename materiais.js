async function baixarMaterial(id, quantidade){

const ref = doc(db,"materiais",id);


const material = await getDoc(ref);


let atual =
material.data().quantidade;



await updateDoc(ref,{

quantidade:
atual - quantidade

});


}
