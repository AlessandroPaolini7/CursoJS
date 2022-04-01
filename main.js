let carrito = [];
let aPagar = 0;
let arrayProductos = [];
let compraFinalizada = false;


//Traigo los datos de la api, para mostrar los productos, luego comienza el programa. 
const traerDatosApi = async() =>{
    const resultado = await fetch('bdd.json');
    const respuesta = await resultado.json();
    arrayProductos = respuesta;
    mostrarProductos(arrayProductos);
}

//Programa principal
traerDatosApi();


//Definimos el botón del carrito en el nav
let barraNav = document.getElementById("nav");
barraNav.classList.add("nav", "justify-content-center", "flex-row", "flex-md-row");
barraNav.innerHTML = `<button class="btn btn-primary product-details" id="quitar-producto" onClick="actualizarCarrito()">🛒</button> `


//Función que scrollea automáticamente hacia el carrito para mostrarlo
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}

//Renderización de productos , traidos de la api.
const contenedor = document.getElementById("container");
function mostrarProductos(arrayProductos){
    contenedor.innerHTML = "";
    arrayProductos.forEach((producto,indice) => {
        let card = document.createElement("div");
        card.classList.add("card", "col-12", "col-md-4");
        card.innerHTML  = `
                            <img src ="${producto.imagen}" style="width:200px; height:200px; class ="card-img-top" alt=".">
                            <div class="card-body">
                            <h5 class="card-title ">${producto.nombre}</h5>
                            <p class="card-text ">${producto.precio} USD</p>
                            <button href="#" class="btn btn-primary " onClick="abrirCarrito(${indice});muestraSa()">Comprar</button>
                            </div>`;
        contenedor.appendChild(card);
    }
    );    
    localStorage.length>0 ? carrito = JSON.parse(localStorage.getItem('carrito')) : console.log('');
}


//Función que agrega al carrito el producto si no está, y si está le suma la cantidad a comprar.
const abrirCarrito = (indiceProducto) => {
        const indiceEncontradoCarrito = carrito.findIndex((elemento) => {
            return elemento.id === arrayProductos[indiceProducto].id;
        });
        if (indiceEncontradoCarrito===-1){
            const productoAgregar = arrayProductos[indiceProducto];
            productoAgregar.cantidad = 1;
            carrito.push(productoAgregar);
            actualizarCarrito();
        }else{
            carrito[indiceEncontradoCarrito].cantidad += 1;
            actualizarCarrito();
        }
    }


//Función que muestra un modal cuando se agrega un item al carrito, y valida que no se puedan agregar elementos al carrito si la compra fue finalizada
function muestraSa(){
    if(compraFinalizada == false){
        swal.fire({
            title:'Confirmado!',
            text:'El item se ha agregado correctamente al carrito',
            icon:'success',
            confirmButtonText:'Continuar comprando'
        });
    }else{
        swal.fire({
            title:'Error',
            text:'La compra ya fue finalizada',
            icon:'warning',
        });
    }
}


let modalCarro = document.getElementById("carro");
//Función que actualiza el carrito, mostrando sus productos, y muestra también el total y el subtotal de la compra.
const actualizarCarrito = () => {
    if(compraFinalizada == false){
            let total = 0;
            modalCarro.className = "carro";
            modalCarro.innerHTML = "";
            if (carrito.length > 0){
                carrito.forEach((producto,indice) => {
                    total = total + producto.precio * producto.cantidad;
                    const carritoContainer = document.createElement("div");
                    carritoContainer.classList.add("modal");
                    carritoContainer.className = "producto-carrito";
                    carritoContainer.innerHTML = `
                        <div class = "product-details">
                            ${producto.nombre}
                        </div>
                        <div class = "product-details">Cantidad: ${producto.cantidad}</div>
                        <div class = "product-details">Precio: ${producto.precio}</div>
                        <div class = "product-details">Subtotal: ${producto.cantidad * producto.precio}</div>
                        <button class="btn btn-danger product-details" id="quitar-producto" onClick="quitarProducto(${indice});">Borrar</button>
                        `;
                    modalCarro.appendChild(carritoContainer);
                });
                const totalContainer = document.createElement("div");
                totalContainer.className = "total-carrito";
                totalContainer.innerHTML = `<div class="total">Total $ ${total}</div>
                <button class = "btn btn-danger" onClick="finalizarCompra()">Finalizar compra</button>`;
                modalCarro.appendChild(totalContainer);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                window.scroll(0,findPos(document.getElementById("carro")));
            }else{
                modalCarro.innerHTML="";
                const carroVacio = `<div class = "product-details">No hay ítems en su carrito.</div>
                                    `;
            modalCarro.innerHTML = carroVacio;
            window.scroll(0,findPos(document.getElementById("carro")));
            }
    }else{
        Swal.fire({
            title: 'Compra finalizada',
            text: "Los items ya estan cargados en el carrito",
            icon: 'warning',
        })
    }
};


//Función que recibe el indice del producto a eliminar, consulta por la eliminación del mismo, y finalmente elimina (o no).
const quitarProducto = (indice) => {
    Swal.fire({
        title: 'Estás seguro?',
        text: "Tu item se eliminaría del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, estoy seguro'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.splice(indice, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                actualizarCarrito();
            Swal.fire(
                'Eliminado!',
                'El item seleccionado ha sido correctamente eliminado del carrito.',
                'success'
            )
        }
    })
    
};


//Función que muestra un modal de finalización de compra.
const finalizarCompra = () => {
    compraFinalizada = true;
    modalCarro.innerHTML="";
    const compraFin = `<div class= "compra-finalizada"><p class="compra-parrafo">Felicitaciones! Compra finalizada</p></div>
                        <div class = "datos-cliente">
                            <p class= "datos-parrafo">Le pedimos que complete el formulario para coordinar la entrega</p>
                            <button class ="btn btn-danger formulario" id="formulario" onClick="displayForm()">FORMULARIO</button>
                        </div>
                            `;
    modalCarro.innerHTML = compraFin;
    
};


//Función que muestra el formulario para el envío de los productos.
const displayForm = () => {
    modalCarro.innerHTML = "";
    const formulario = ` <h2>Datos para el envío</h2>
                        <div class="contact_section-container">
                            <div class="row">
                                <div class="contact_section-item">
                                    <label>Nombre</label>
                                    <input type="text" id = "nombre" placeholder="Nombre" />
                                </div>
                            <div class="contact_section-item">
                                <label>Email</label>
                                <input type="text" id="mail" placeholder ="Email"/>
                            </div>
                            <div class="contact_section-item">
                                <label>Telefono</label>
                                <input type="text" id="telefono" placeholder ="Telefono"/>
                            </div>
                            <div class="contact_section-item">
                                <label>Direccion</label>
                                <input type="text" id="direccion" placeholder ="Direccion"/>
                            </div>
                            <div class="contact-button">
                                <button type="button" class="btn btn-danger envio" onClick="mostrarMensaje()">Confirmar</button>
                            </div>
                            </div>
                        </div>
                            `;
modalCarro.innerHTML = formulario;
}


//Función que muestra el mensaje final, validando que se hayan ingresado todos los datos del formulario.
const mostrarMensaje = () =>{
    const nomCliente = document.getElementById("nombre").value;
    const domCliente = document.getElementById("direccion").value;
    const mailCliente = document.getElementById("mail").value;
    const telCliente = document.getElementById("telefono").value;
    if(nomCliente=="" || domCliente == "" || domCliente == "" || mailCliente == "" || telCliente == ""){
        swal.fire({
            title:'Error',
            text:'Faltan completar campos',
            icon:'warning',
            confirmButtonText:'Volver'
        });
    }else{
        modalCarro.innerHTML="";
        let msj = `<div class="msj-final">Gracias ${nomCliente} por su compra! en el plazo máximo de 48 horas andaremos por ${domCliente}</div>`
        modalCarro.innerHTML = msj;
        localStorage.clear();
        carrito = [];
        compraFinalizada = false;
    }
}
