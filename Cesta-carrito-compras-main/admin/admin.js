// Esta función guarda un valor en el almacenamiento local del navegador usando una llave
function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar)) // Convierte el valor a una cadena JSON y lo almacena con la llave
}

// Esta función obtiene un valor del almacenamiento local del navegador usando una llave
function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave)) // Obtiene el valor asociado a la llave y lo convierte a un objeto JavaScript
    return datos // Devuelve el valor obtenido
}

// Esta variable almacena un array de productos que se obtiene del almacenamiento local o un array vacío si no hay nada
let productos = obtenerAlmacenamientoLocal('productos') || [];

// Esta variable almacena el elemento HTML con el id 'mensaje'
let mensaje = document.getElementById('mensaje')

// Estas variables almacenan los elementos HTML con los id correspondientes para añadir un producto
const añadirProducto = document.getElementById('productoAñadir')
const añadirValor = document.getElementById('valorAñadir')
const añadirExistencia = document.getElementById('existenciaAñadir')
const añadirImagen = document.getElementById('ImagenAñadir')

// Esta función se ejecuta cuando se hace clic en el botón con el id 'botonAñadir'
document.getElementById("botonAñadir").addEventListener("click", function (event) {
    event.preventDefault() // Evita que se recargue la página
    let productoAñadir = añadirProducto.value // Obtiene el valor del input del nombre del producto
    let valorAñadir = añadirValor.value // Obtiene el valor del input del valor del producto
    let existenciaAñadir = añadirExistencia.value // Obtiene el valor del input de la existencia del producto
    let imagenAñadir = añadirImagen.value // Obtiene el valor del input de la url de la imagen del producto

    let van = true // Esta variable indica si se puede añadir el producto o no

    // Si alguno de los valores está vacío, se muestra un mensaje de error y se cambia el valor de van a false
    if (productoAñadir == '' || valorAñadir == '' || existenciaAñadir == '' || imagenAñadir == '') {
        mensaje.classList.add('llenarCampos')
        setTimeout(() => { mensaje.classList.remove('llenarCampos') }, 2500)
        van = false
    }
    else {
        // Si el producto ya existe en el array de productos, se muestra un mensaje de error y se cambia el valor de van a false
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre == productoAñadir) {
                mensaje.classList.add('repetidoError')
                setTimeout(() => { mensaje.classList.remove('repetidoError') }, 2500)
                van = false
            }
        }
    }

    // Si el valor de van es true, se añade el producto al array de productos y se muestra un mensaje de éxito
    if (van == true) {
        productos.push({
            nombre: productoAñadir,
            valor: valorAñadir,
            existencia: existenciaAñadir,
            urlImagen: imagenAñadir
        })
        mensaje.classList.add('realizado')
        setTimeout(() => {
            mensaje.classList.remove('repetidoError')
            window.location.reload() // Recarga la página para mostrar los cambios
        }, 1500)
    }
    guardarAlmacenamientoLocal('productos', productos); // Guarda el array de productos en el almacenamiento local
})

// Estas variables almacenan los elementos HTML con los id correspondientes para editar un producto
const productoEd = document.getElementById('productoEditar')
const atributoEd = document.getElementById('atributoEditar')
const nuevoAtributoEd = document.getElementById('nuevoAtributo')

// Esta función se ejecuta cuando se hace clic en el botón con el id 'botonEditar'
document.getElementById("botonEditar").addEventListener("click", function (event) {
    event.preventDefault() // Evita que se recargue la página
    let productoEditar = productoEd.value // Obtiene el valor del select del nombre del producto
    let atributoEditar = atributoEd.value // Obtiene el valor del select del atributo del producto
    let nuevoAtributo = nuevoAtributoEd.value // Obtiene el valor del input del nuevo valor del atributo
    let van = false // Esta variable indica si se puede editar el producto o no
    // Si alguno de los valores está vacío, se muestra un mensaje de error
    if (productoEditar == '' || atributoEditar == '' || nuevoAtributo == '') {
        mensaje.classList.add('llenarCampos')
        setTimeout(() => { mensaje.classList.remove('llenarCampos') }, 2500)
    }
    else {
        // Si el producto existe en el array de productos, se cambia el valor del atributo y se cambia el valor de van a true
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre == productoEditar) {
                productos[i][atributoEditar] = nuevoAtributo
                van = true
            }
        }
        // Si el valor de van es true, se muestra un mensaje de éxito
        if (van == true) {
            mensaje.classList.add('realizado')
            setTimeout(() => {
                mensaje.classList.remove('realizado')
                window.location.reload() // Recarga la página para mostrar los cambios
            }, 1500);
        }
        // Si el valor de van es false, se muestra un mensaje de error
        else {
            mensaje.classList.add('noExisteError')
            setTimeout(() => { mensaje.classList.remove('noExsiteError') }, 2500);
        }
        guardarAlmacenamientoLocal('productos', productos); // Guarda el array de productos en el almacenamiento local
    }
})

// Esta variable almacena el elemento HTML con el id 'productoEliminar'
const productoE = document.getElementById('productoEliminar')

// Esta función se ejecuta cuando se hace clic en el botón con el id 'botonEliminar'
document.getElementById("botonEliminar").addEventListener("click", function (event) {
    event.preventDefault() // Evita que se recargue la página
    let productoEliminar = productoE.value // Obtiene el valor del select del nombre del producto
    let van = false // Esta variable indica si se puede eliminar el producto o no

    // Si el producto existe en el array de productos, se elimina del array y se cambia el valor de van a true
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre == productoEliminar) {
            productos.splice(i, 1) // Elimina el elemento en la posición i del array
            van = true
        }
    }

    // Si el valor de van es false, se muestra un mensaje de error
    if (van == false) {
        mensaje.classList.add('noExsiteError')
        setTimeout(() => { mensaje.classList.remove('noExsiteError') }, 2500);
    }
    // Si el valor de van es true, se muestra un mensaje de éxito
    else {
        mensaje.classList.add('realizado')
        setTimeout(() => {
            mensaje.classList.remove('realizado')
            window.location.reload() // Recarga la página para mostrar los cambios
        }, 1500);
    }
    guardarAlmacenamientoLocal('productos', productos); // Guarda el array de productos en el almacenamiento local
})

// Esta función se ejecuta cuando se carga la página
window.addEventListener("load", () => {
    // Estas variables almacenan los elementos HTML con los id correspondientes para mostrar los productos
    const productoEd = document.getElementById('productoEditar')
    const productoEl = document.getElementById('productoEliminar')
    // Se recorre el array de productos y se añaden las opciones al select de editar y eliminar
    for (let i = 0; i < productos.length; i++) {
        productoEd.innerHTML += `<option>${productos[i].nombre}</option>`
        productoEl.innerHTML += `<option>${productos[i].nombre}</option>`
    }
    // Se obtienen las llaves del primer producto del array y se añaden las opciones al select de atributo
    Object.keys(productos[0]).forEach(element => {
        atributoEd.innerHTML += `<option>${element}</option>`
    });

    // Esta variable almacena el elemento HTML con el id 'mostrarProductos'
    let mostraProductos = document.getElementById('mostrarProductos')
    mostraProductos.innerHTML = '' // Se vacía el contenido del elemento
    // Se recorre el array de productos y se crea un div con la imagen y la información de cada producto
    for (let i = 0; i < productos.length; i++) {
        mostraProductos.innerHTML += `<div class="contenedorProductos"><img src="${productos[i].urlImagen}"><div class="informacion"><p>${productos[i].nombre}</p><p class="precio"><span>Precio: ${productos[i].valor}$</span></p> Existencia: ${productos[i].existencia}<p></p></div></div>`
    }
})
