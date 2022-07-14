const ropaDB = [
    {
        precio: 20.00,
        id: 0,
        type: "hoodies",
        stock: 6,
        imagen: "./img/featured1.png",
        filter: "hoodies"
    },

    {
        precio: 30.00,
        id: 1,
        type: "shirts",
        stock: 7,
        imagen: "./img/featured2.png",
        filter: "shirts"
    },

    {
        precio: 40.00,
        id: 2,
        type: "sweatshirts",
        stock: 10,
        imagen: "./img/featured3.png",
        filter: "sweatshirts"
    }
]



const totalNav = document.querySelector(".total_nav");

const compras = document.querySelector(".compras");

const bolso = document.querySelector(".bolso");

const cerrar = document.querySelector(".cerrar");

const filtrosContenidos = document.querySelector("#cards");

let nPrecio
let nCantidad
let multiplicacion

bolso.addEventListener("click", function () {
    compras.classList.remove("side_carro") // pondra "show_nav" al lado de "nav"
})

cerrar.addEventListener("click", function () {
    compras.classList.add("side_carro")
})

let order = {}

let aumento = document.querySelector("#aumento")
window.onscroll = function () {
    console.log(window.scrollY);
}

function conClassBlanco() {
    let y = window.scrollY;
    if (y > 150) {
        totalNav.classList.add("total_nav_blanco")
    } else {
        totalNav.classList.remove("total_nav_blanco")
    }
}
window.onscroll = () => conClassBlanco();


/*************Pintar cartas ************************/

document.addEventListener("DOMContentLoaded", function () {
    pintarRopa()
    printCompras()
    agregarAlBolso()
    mixitup(".filtros__contenido", {
        selectors: {
            target: ".filtros__contenido__elemento"
        },
        animation: {
            duration: 400
        }
    }).filter("all")
})




/******Funcion para pintar las cartas ****************/

function pintarRopa() {
    const ropa = document.querySelector(".filtros__contenido")
    let html = ""
    for (let i = 0; i < ropaDB.length; i++) {
        html += `<div class="filtros__contenido__elemento ${ropaDB[i].filter}">
                        <div class="filtros__contenido__elemento__img">
                            <img src="${ropaDB[i].imagen}" alt="${ropaDB[i].type}">
                        </div>
                        <button class="agregar" data-idUser="${ropaDB[i].id}">+</button>
                        <div class="filtros__contenido__elemento__precio ">
                            <p class="precio">$${ropaDB[i].precio}<p>
                            <p class="stock">| Stock:${ropaDB[i].stock}</p>
                            <p class="categoria">${ropaDB[i].type}</p>
                        </div> 
                </div>`;

    }

    ropa.innerHTML = html
}


/********Añadir al bolso***********/

function agregarAlBolso() {
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("agregar")) {
            const idRopa = event.target.dataset.iduser;
            let ropaActual = null
            for (let i = 0; i < ropaDB.length; i++) {
                if (ropaDB[i].id === parseInt(idRopa)) {
                    ropaActual = ropaDB[i]
                }
            }

            if (order[ropaActual.id]) {
                if (order[ropaActual.id].stock > order[ropaActual.id].amount) {
                    order[ropaActual.id].amount++
                }
                else {
                    alert("No tenemos más")
                }

            } else {
                order[ropaActual.id] = ropaActual;
                order[ropaActual.id].amount = 1
            }

            aumento.textContent = Object.entries(order).length;
        };
    })
}


/*****Print cosas compradas */

function printCompras() {
    window.addEventListener("click", function () {
        const carrito_contenido = document.querySelector(".carrito_contenido");
        if (Object.entries(order).length === 0) {
            carrito_contenido.innerHTML = `
            <div class="imagenVacia" ><img src="/img/empty-cart.png" alt=""></div><h2> No hay nada</h2>`
        } else {

            let cosasCompradas = ""
            Object.values(order).forEach(({ id, precio, amount, type, stock, imagen }) => {

                multiplicacion = precio * amount

                cosasCompradas += `<div class="comproEsto">
                <div class="imagenCompra"><img src=${imagen} alt=""></div>
                <div class="contenedor_cosas">
                    <p class="compra">${type}</p>
                    <div class="cosas">
                        <p class="stock">Stock:${stock}</p>
                        <p class="precio">Precio:${precio}</p>
                        <p class="subtotal">Subtotal: ${multiplicacion}</p>
                    </div>
                    <div class="sumarYrestar" id="${id}">
                        <button class="menos">-</button>
                        <div class="unidades">${amount}</div>
                        <button class="mas">+</button>
                        <img class ="basura"src="/img/eliminar.png" alt="">
                    </div>
                </div>
            </div>`
            })
            carrito_contenido.innerHTML = cosasCompradas

        }

        nCantidad = Object.values(order).reduce((acumulador, { amount }) => acumulador + amount, 0)

        nPrecio = Object.values(order).reduce((acumulador, { amount, precio }) => acumulador + amount * precio, 0)




        const total = document.querySelector(".cantidadTotal")

        const items = document.querySelector(".cantidadItems")




        total.textContent = "Precio total:" + nPrecio;
        items.textContent = "Items " + nCantidad;

    })

    sumaYrestaBotones()
    eliminarProducto()
    pagar()
}



function sumaYrestaBotones() {
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("mas")) {
            const id = event.target.parentElement.id;
            if (order[id].stock > order[id].amount) {
                order[id].amount++;
            }
            else {
                alert("No tenemos mas")
            }
        }
    })

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("menos")) {
            const id = event.target.parentElement.id;
            if (order[id].amount > 1) {
                order[id].amount--;
            }
            else {
                delete order[id]
                aumento.textContent = Object.entries(order).length;
            }
        }
    })
}

function eliminarProducto() {
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("basura")) {
            const id = event.target.parentElement.id;
            delete order[id]
        }
    })

}

function pagar() {
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("pagar")) {
            order = {}
            aumento.textContent = Object.entries(order).length;
        }
    })
}

