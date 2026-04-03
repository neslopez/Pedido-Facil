document.getElementById("titulo").innerText = config.negocio;

const contenedor = document.getElementById("productos");

let categorias = {};

productos.forEach(p => {
    if (!categorias[p.categoria]) {
        categorias[p.categoria] = [];
    }
    categorias[p.categoria].push(p);
});

for (let cat in categorias) {
    let titulo = document.createElement("h2");
    titulo.innerText = cat;
    contenedor.appendChild(titulo);

    categorias[cat].forEach(p => {
    let div = document.createElement("div");
    div.className = "producto";

    div.innerHTML = `
        <span>${p.nombre} - $${p.precio.toLocaleString()}</span>
        <div class="contador">
            <button onclick="cambiarCantidad(this, -1)">-</button>
            <span class="cantidad">0</span>
            <button onclick="cambiarCantidad(this, 1)">+</button>
        </div>
    `;

    div.dataset.nombre = p.nombre;
    div.dataset.precio = p.precio;

    contenedor.appendChild(div);
});
}

let checkboxes = document.querySelectorAll("input[type=checkbox]");

checkboxes.forEach(cb => {
    cb.addEventListener("change", calcularTotal);
});

function calcularTotal() {
    let total = 0;

    document.querySelectorAll(".producto").forEach(p => {
        let cantidad = parseInt(p.querySelector(".cantidad").innerText);
        let precio = parseInt(p.dataset.precio);

        total += cantidad * precio;
    });

    document.getElementById("total").innerText = "Total: $" + total.toLocaleString();
}

function enviarPedido() {
    let mensaje = "Hola! Quiero hacer un pedido:%0A";
    let total = 0;

    document.querySelectorAll(".producto").forEach(p => {
        let cantidad = parseInt(p.querySelector(".cantidad").innerText);

        if (cantidad > 0) {
            let nombre = p.dataset.nombre;
            let precio = parseInt(p.dataset.precio);

            mensaje += `- ${cantidad} x ${nombre} ($${precio})%0A`;

            total += cantidad * precio;
        }
    });

    let nombre = document.getElementById("nombre").value;
    let direccion = document.getElementById("direccion").value;
    let pago = document.getElementById("pago").value;

    mensaje += `%0A Total: $${total.toLocaleString()}`;
    mensaje += `%0A Nombre: ${nombre}`;
    mensaje += `%0A Dirección: ${direccion}`;
    mensaje += `%0A Pago: ${pago}`;

    let url = `https://wa.me/${config.telefono}?text=${mensaje}`;

    window.open(url, '_blank');
}

function cambiarCantidad(btn, cambio) {
    let contenedor = btn.parentElement;
    let cantidadSpan = contenedor.querySelector(".cantidad");

    let cantidad = parseInt(cantidadSpan.innerText);
    cantidad += cambio;

    if (cantidad < 0) cantidad = 0;

    cantidadSpan.innerText = cantidad;

    calcularTotal();
}