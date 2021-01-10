var indexedDB;
var form;

//guardo la base indexada en la const
function iniciar(){
    indexedDB = window.indexedDB;
    boton=document.getElementById("grabar");
    boton.addEventListener("click", agregarObjeto, false);

}
window.addEventListener("load", iniciar, false);

if(indexedDB){
    //si fue guardada con exito...
    let db;
    const request=indexedDB.open('miBase', 1);
    //abrir la base
    request.onsuccess = () => {
        //si la apertura fue exitosa, guardar la base en nuestra variable db;
        //luego llamar al metodo readData, declarado mas abajo;
        db=request.result;
        //readData();
        console.log('OPEN', db)
    }

    request.onupgradeneeded = () =>{
        db=request.result;
        console.log('Create', db);
        //si la actualizacion debe hacerse 
        //o es la primera vez que se abra la base, se crea el objeto que guardara los elementos;
        const objectStore=db.createObjectStore('productos', {
            keyPath: 'clave'
        })
    }

    request.error = (error) =>{
        console.log('ERROR', error);
    }

    const addData = (data) => {
        const t = db.transaction(['productos'], 'readwrite');
        const objectStore = t.objectStore('productos');
        const request = objectStore.add(data);
        console.log(request);
    }

    const readData = () => {
        const t = db.transaction(['productos'], 'readonly');
        const objectStore = t.objectStore('productos');
        const request = objectStore.openCursor();

        request.onsuccess = (e) =>{
            console.log(e.target)
        }
    }

    function agregarObjeto(){
        var fecha = document.getElementById('fecha').value;
        var titulo = document.getElementById('titulo').value;
        var subtitulo =  document.getElementById('subtitulo').value;
        addData({fecha: fecha, titulo: titulo, sub: subtitulo});
    }

}