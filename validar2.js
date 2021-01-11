var bd;
var zonadatos;
var boton;
var form;
var fragmento;
    //cursor.addEventListener("success", mostrarDatos, false);

function iniciar(){

    var solicitud=indexedDB.open("miBase");
    
    solicitud.onsuccess = function(e){

        bd=e.target.result;
    }
    solicitud.onupgradeneeded = function(e){

        bd=e.target.result;
        bd.createObjectStore("productos", { keyPath: 'fecha' });
    }
    
    fragmento=document.createElement('div');
    zonadatos=document.getElementById("zonadatos");
    boton=document.getElementById("grabar");

    boton.onclick = () =>{
        const data=recogerDatosForm();
        if(boton.value=="ingresar"){
            agregarObjeto(data);
            zonadatos.innerHTML="";
        }else if (boton.value=="modificar"){
            upDate(data);
            boton.value="ingresar";
            zonadatos.innerHTML="";
        }
    }

    zonadatos.addEventListener('click', (e) => {
        if (e.target.dataset.type == 'update') {
            mostrarDatosKey(e.target.dataset.key);
            boton.value="modificar";    
        } else if (e.target.dataset.type == 'delete') {
            console.log("borrar");
            //deleteData(e.target.dataset.key)
        }
    });

}

function recogerDatosForm(){
    const data={
        fecha : document.getElementById("fecha").value,
        categoria : document.getElementById("categoria").value,
        titulo : document.getElementById("titulo").value,
        subtitulo :  document.getElementById("subtitulo").value
     }
    console.log("funciona");
    return data;
}

function agregarObjeto(data){
    //const data=recogerDatosForm();
    //console.log(data);
    const t = bd.transaction(["productos"], "readwrite");
    const objectStore = t.objectStore("productos");
    const request = objectStore.add(data);
    request.addEventListener("success", mostrar, false );

}

function upDate(data){

    const t = bd.transaction(["productos"], "readwrite");
    const objectStore = t.objectStore("productos");
    const request = objectStore.put(data);
    request.addEventListener("success", mostrar, false );
}

function mostrar(){
    zonadatos.innerHTML="";
    const t = bd.transaction(["productos"], "readonly");
    const objectStore = t.objectStore("productos");
    var cursor=objectStore.openCursor();

    cursor.onsuccess = (e) =>{
        var cursor=e.target.result;

        if(cursor){
    
            fragmento.innerHTML+= "<div>"+
            cursor.key + " - " +
            cursor.value.fecha + " - " +
            cursor.value.categoria + " - " +
            cursor.value.titulo + " - " +
            cursor.value.subtitulo + "</div>" ; 
    
            const update=document.createElement('button');
            update.dataset.type = 'update';
            update.dataset.key = cursor.key;
            update.textContent = 'Actualizar';
            fragmento.appendChild(update);
    
            const eliminar = document.createElement('button');
            eliminar.textContent = 'Delete';
            eliminar.dataset.type = 'delete';
            eliminar.dataset.key = cursor.key;
            fragmento.appendChild(eliminar);
    
            cursor.continue();
    
        }else{
            //zonadatos.textContent = '';
            zonadatos.appendChild(fragmento);
            console.log("aca");   
        }
    }
}

const mostrarDatosKey = (key) =>{
    const t = bd.transaction(["productos"], "readwrite");
    const objectStore = t.objectStore("productos");
    const request = objectStore.get(key);

    request.onsuccess = () =>{

       document.getElementById("fecha").value=request.result.fecha;
       document.getElementById("categoria").value=request.result.categoria;
       document.getElementById("titulo").value=request.result.titulo;
       document.getElementById("subtitulo").value=request.result.subtitulo;
    }
}



window.addEventListener("load", iniciar, false);
