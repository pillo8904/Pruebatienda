// Funciones para almacenar y traer los datos que se almacenan
function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar))
}
function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave))
    return datos
}
let productos = obtenerAlmacenamientoLocal('productos') || [];

// Variables que traemos de nuestro html
const informacionCompra = document.getElementById('informacionCompra');
const contenedorCompra = document.getElementById('contenedorCompra');
const productosCompra = document.getElementById('productosCompra');
const contenedor = document.getElementById('contenedor');
const carrito = document.getElementById('carrito');
const numero = document.getElementById("numero");
const header = document.querySelector("#header");
const total = document.getElementById('total');
const body = document.querySelector("body");
const x = document.getElementById('x')

// Crear una variable para guardar los productos agrupados
let productosAgrupados = [];

window.addEventListener("scroll", function () {
    if (contenedor.getBoundingClientRect().top < 10) {
        header.classList.add("scroll")
    }
    else {
        header.classList.remove("scroll")
    }
})
window.addEventListener('load', () => {
    visualizarProductos();
    contenedorCompra.classList.add("none")
})
function visualizarProductos() {
    contenedor.innerHTML = ""
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].existencia > 0) {
            contenedor.innerHTML += `<div><img src="${productos[i].urlImagen}"><div class="informacion"><p>${productos[i].nombre}</p><p class="precio">$${productos[i].valor}</p><button onclick=comprar(${i})>Comprar</button></div></div>`
        }
        else {
            contenedor.innerHTML += `<div><img src="${productos[i].urlImagen}"><div class="informacion"><p>${productos[i].nombre}</p><p class="precio">$${productos[i].valor}</p><p class="soldOut">Sold Out</p></div></div>`
        }
    }
}
function comprar(indice) {
    // Buscar si el producto ya está en el array de productos agrupados
    let posicion = productosAgrupados.findIndex(producto => producto.id == productos[indice].id);
    // Si el producto no está en el array, agregarlo con una cantidad inicial de 1
    if (posicion == -1) {
        productosAgrupados.push({ id: productos[indice].id, nombre: productos[indice].nombre, precio: productos[indice].valor, cantidad: 1 });
    }
    // Si el producto ya está en el array, incrementar su cantidad en 1
    else {
        productosAgrupados[posicion].cantidad++;
    }
    let van = true
    let i = 0
    while (van == true) {
        if (productos[i].id == productos[indice].id) {
            productos[i].existencia -= 1
            if (productos[i].existencia == 0) {
                visualizarProductos()
            }
            van = false
        }
        guardarAlmacenamientoLocal("productos", productos)
        i += 1
    }
    // Actualizar el número de productos en la cesta según la longitud del array de productos agrupados
    numero.innerHTML = productosAgrupados.length
    numero.classList.add("diseñoNumero")
    return productosAgrupados
}

carrito.addEventListener("click", function(){
    body.style.overflow = "hidden"
    contenedorCompra.classList.remove('none')
    contenedorCompra.classList.add('contenedorCompra')
    informacionCompra.classList.add('informacionCompra')
    mostrarElemtrosLista()
})
function mostrarElemtrosLista() {
    productosCompra.innerHTML = ""
    valortotal = 0
    // Mostrar los productos agrupados en la cesta con sus respectivas cantidades
    for (let i = 0; i < productosAgrupados.length; i++){
        productosCompra.innerHTML += `<div><div class="img"><button onclick=eliminar(${i}) class="botonTrash"><img src="/img/trash.png"></button><p>${productosAgrupados[i].nombre}</p></div><p> $${productosAgrupados[i].precio} x ${productosAgrupados[i].cantidad}</p></div>`
        valortotal += parseInt(productosAgrupados[i].precio) * productosAgrupados[i].cantidad;
    }
    total.innerHTML = `<p>Valor Total</p> <p><span>$${valortotal}</span></p>`
}
function eliminar(indice){
    let van = true
    let i = 0
    while (van == true) {
        if (productos[i].id == productosAgrupados[indice].id) {
            productos[i].existencia += productosAgrupados[indice].cantidad
            productosAgrupados.splice(indice, 1)
            van = false
        }
        i += 1
    }
    guardarAlmacenamientoLocal("productos", productos)

    numero.innerHTML = productosAgrupados.length
    if (productosAgrupados.length == 0){
        numero.classList.remove("diseñoNumero")
    }
    visualizarProductos()
    mostrarElemtrosLista()
}

x.addEventListener("click", function(){
    body.style.overflow = "auto"
    contenedorCompra.classList.add('none')
    contenedorCompra.classList.remove('contenedorCompra')
    informacionCompra.classList.remove('informacionCompra')
})

// Crear una función para generar el mensaje con los datos de la cesta y el modal
function generarMensaje() {
    // Obtener los datos del modal
    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var email = document.getElementById("email").value.trim();
    var recipient = document.getElementById("recipient").value.trim();
    var recipientPhone = document.getElementById("recipient-phone").value.trim();
    var street = document.getElementById("street").value.trim();
    var between = document.getElementById("between").value.trim();
    var number = document.getElementById("number").value.trim();
    // Crear el mensaje con los datos de la cesta y el modal
    var message = `Hola desde la Tienda Online Rincón de Cuba,\n`;
    message += `Mi nombre es ${name} y he realizado un pedido de:\n`;
    for (var i = 0; i < productosAgrupados.length; i++) {
        var quantity = productosAgrupados[i].quantity;
        message += `${quantity} ${productosAgrupados[i].nombre}\n`;
    }
    message += `Con un total de: $${valortotal}.\n`;
    message += `Deseo enviarlo a ${recipient}.\n`;
    message += `Su numero de Teléfono es: ${recipientPhone}.\n`;
    message += `Y su dirección es: Calle ${street}, entre ${between}, #${number}.\n`;
    message += `Espero su respuesta... saludos.\n`;
    // Devolver el mensaje
    return message;
}

// Obtener el botón de enviar del modal
var submitButton = document.querySelector(".submit-button");
// Agregar un evento de click al botón de enviar del modal
submitButton.addEventListener("click", function() {
    // Llamar a la función para generar el mensaje
    var message = generarMensaje();
    // Crear el enlace de WhatsApp con el mensaje generado
    var whatsappLink = `https://api.whatsapp.com/send?phone=+5355189657&text=${encodeURIComponent(message)}`;
    // Abrir el enlace de WhatsApp en una nueva pestaña
    window.open(whatsappLink, '_blank');
});
