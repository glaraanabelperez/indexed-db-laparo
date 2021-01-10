var bd;
var zonadatos;
var boton;

function iniciar(){
    zonadatos=document.getElementById("zonadatos");
    
    boton=document.getElementById("grabar");

    boton.addEventListener("click", agregarObjeto, false);

    var solicitud=indexedDB.open("miBase");

    solicitud.onsuccess = function(e){
        bd=e.target.result;
    }
    solicitud.onupgradeneeded = function(e){
        bd=e.target.result;
        bd.createObjectStore("productos", { autoIncrement: true});
    }

}

function agregarObjeto(){
    var fecha = document.getElementById("fecha").value;
    var categoria = document.getElementById("categoria").value;
    var titulo = document.getElementById("titulo").value;
    var subtitulo =  document.getElementById("subtitulo").value;

    const t = bd.transaction(["productos"], "readwrite");
    const objectStore = t.objectStore("productos");
    const request = objectStore.add({fecha: fecha, categoria: categoria, titulo: titulo, subtitulo: subtitulo});
    request.addEventListener("success", mostrar, false );
    document.getElementById("fecha").value="";
    document.getElementById("categoria").value="";
    document.getElementById("titulo").value="";
    document.getElementById("subtitulo").value="";

}

function mostrar(){
    zonadatos.innerHTML="";
    const t = bd.transaction(["productos"], "readonly");
    const objectStore = t.objectStore("productos");
    var cursor=objectStore.openCursor();
    cursor.addEventListener("success", mostrarDatos, false);
}

function mostrarDatos(e){
    var cursor=e.target.result;
    if(cursor){
        zonadatos.innerHTML+="<div>"+
       //  cursor.value.keyPath + " - " +
         cursor.value.fecha + " - " +
         cursor.value.categoria + " - " +
         cursor.value.titulo + " - " +
         cursor.value.subtitulo + "</div>"
        cursor.continue();
    }
}

window.addEventListener("load", iniciar, false);
