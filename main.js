// JS document
// Elements
const tipoContenido = document.getElementById('tipoContenido');
const busqueda = document.getElementById('busqueda');
const btnBuscar = document.getElementById('btnBuscar');
const listaContenido = document.getElementById('listaContenido');

// Customed Event
let eventoPersonalizado = new CustomEvent('mostrarArchivo');
tipoContenido.addEventListener('mostrarArchivo', function(){
    alert(`El archivo base es: ${tipoContenido.value}`);

    if(tipoContenido.value === "Peliculas")
        busqueda.setAttribute('placeholder', 'Escriba el nombre de la Pelicula');
    else
        busqueda.setAttribute('placeholder', 'Escriba el nombre de la Serie');
});

tipoContenido.addEventListener('change', function(){
    tipoContenido.dispatchEvent(eventoPersonalizado);
});

// Searcher input
busqueda.addEventListener('keydown', function(event){
    if((event.keyCode < 65 || event.keyCode > 90) && event.keyCode != 32 && event.keyCode != 8){
        event.preventDefault();
    }
})
// Searcher button
btnBuscar.addEventListener('click', function(){
    let url;
    if(tipoContenido.value == "Peliculas"){
        url = "JSON/peliculas.json"
    }else if(tipoContenido.value == "Series"){
        url = "JSON/series.json"
    }
    fetch(url)
    .then(res => res.json())
    .then(salida => {
        buscarContenido(salida);
    })
    .catch(function(error){
        console.log(error);
    })
})

const buscarContenido = salida=>{
    let valorBusqueda = busqueda.value.toUpperCase();
    let resultadoBusqueda = [];
    listaContenido.innerHTML = "";

    for(let contenido of salida.data){
        if(contenido.nombre.startsWith(valorBusqueda)){
            resultadoBusqueda.push(contenido);
        }
    }
    mostrarContenido(resultadoBusqueda);
}

const mostrarContenido = resultadoBusqueda=>{
    if (resultadoBusqueda.length != 0){
        listaContenido.style.display = 'block';
        let fragment = document.createDocumentFragment();
        for(let contenido of resultadoBusqueda){
            // Information
            const movie = document.createElement('LI');
            movie.setAttribute('class', 'movies__content');
            movie.innerHTML += `<span class="movie__name">Nombre: ${contenido.nombre}</span>`;

            const movieDescripcion = document.createElement('P');
            movieDescripcion.setAttribute('class', 'movie__text');
            movieDescripcion.innerHTML += `<span class="movie__description">Sinopsis:</span> ${contenido.sinopsis}`;

            movie.addEventListener('mouseover', function(){
                    movieDescripcion.style.height = 'max-content';
            });
            movie.addEventListener('mouseout', function(){
                    movieDescripcion.style.height = '0';
            });

            // Adding items to the document
            movie.appendChild(movieDescripcion);
            fragment.appendChild(movie);
        }
        listaContenido.appendChild(fragment);
    }else{
        listaContenido.style.display = 'none';
        window.alert("No hay resultados para la busqueda...")
    }
}