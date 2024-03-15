let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const validarCompra = document.querySelector("#carrito-acciones-validar");


function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoProductos.append(div);
        })
    
    actualizarBotonesEliminar();
    actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

    // Mensaje de compra exitosa con imagen
    Swal.fire({
        icon: 'success',
        title: '¡Compra Exitosa!',
        html: '<p>Gracias por tu compra.</p><br><hr><br><p>Se está procesando tu envio.</p><i class="bi bi-send"></i>'
    });
}




validarCompra.addEventListener("click", validarCarrito);

function validarCarrito() {
    Swal.fire({
        title: 'Ingresa los detalles de tu tarjeta de crédito',
        html:
            `<form id="formularioTarjeta">
                <div class="swal2-input-container">
                    <input type="text" id="numeroTarjeta" class="swal2-input" placeholder="Número de Tarjeta" required>
                </div>
                <div class="swal2-input-container">
                    <input type="text" id="nombreTitular" class="swal2-input" placeholder="Nombre del Titular" required pattern="[a-zA-ZáéíóúÁÉÍÓÚ\s]+" title="Por favor ingresa solo letras">
                </div>
                <div class="swal2-input-container">
                    <label for="fechaExpiracion" class="swal2-label" style="margin-top: 5px;">Fecha de Expiración:</label>
                    <input type="month" id="fechaExpiracion" class="swal2-input" required>
                </div>
                <div class="swal2-input-container">
                    <input type="text" id="cvv" class="swal2-input" placeholder="CVV" required pattern="[0-9]{3}" title="El CVV debe tener 3 dígitos">
                </div>
            </form>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        confirmButtonStyle: 'background-color: #4CAF50; color: white;',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const numeroTarjeta = document.getElementById('numeroTarjeta').value;
            const nombreTitular = document.getElementById('nombreTitular').value;
            const fechaExpiracion = document.getElementById('fechaExpiracion').value;
            const cvv = document.getElementById('cvv').value;

            
            const regexNumeroTarjeta = /^\d{16}$/;

            
            const regexCVV = /^\d{5}$/;

            if (!numeroTarjeta.match(regexNumeroTarjeta)) {
                Swal.showValidationMessage('Por favor ingresa un número de tarjeta válido (16 dígitos numéricos)');
                return;
            }

            if (!nombreTitular) {
                Swal.showValidationMessage('Por favor ingresa el nombre del titular');
                return;
            }

            if (!cvv.match(regexCVV)) {
                Swal.showValidationMessage('Por favor ingresa un CVV válido (5 dígitos numéricos)');
                return;
            }

            return { numeroTarjeta, nombreTitular, fechaExpiracion, cvv };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const detallesTarjeta = result.value;
            Swal.fire({
                title: '¡Ahora puedes realizar la compra!',
                text: `Los detalles de tu tarjeta son: 
                Número de Tarjeta: ${detallesTarjeta.numeroTarjeta}
                Nombre del Titular: ${detallesTarjeta.nombreTitular}
                Fecha de Expiración: ${detallesTarjeta.fechaExpiracion}
                CVV: ${detallesTarjeta.cvv}`,
                icon: 'success'
            });
        }
    });
}

