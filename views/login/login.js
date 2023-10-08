const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  //caso de que el usuario no este en LS
  window.location.href = "../inicio/";
}
const gridGolosina = document.querySelector("#grid_chucheria");
const formulario = document.querySelector("#formAdmin");
const nombreInput = document.querySelector("#nombre");
const cantidadInput = document.querySelector("#cantidad");
const posicionInput = document.querySelector("#posicion");
const precioInput = document.querySelector("#precio");
const refrescar = document.querySelector("#refrescar");
const golosinas = "http://localhost:3001/golosinas";

document.addEventListener("DOMContentLoaded", (e) => {
  obtenerGolosinas(e);
});

evenlister();
function evenlister() {
  formulario.addEventListener("submit", obtenerGolosinas);
  nombreInput.addEventListener("input", datos);
  cantidadInput.addEventListener("input", datos);
  posicionInput.addEventListener("input", datos);
  precioInput.addEventListener("input", datos);
  refrescar.addEventListener("click", (e) => {
    e.preventDefault();
    location.reload();
  }); // prendiente
}

const goloObj = {
  nombre: "",
  cantidad: "",
  posicion: "",
  precio: "",
};

const imagensObj = {
  10: "./img/clubsocial.jpg",
  11: "./img/samba.jpg",
  12: "./img/cocossette.webp",
  13: "./img/M&Ms.webp",
  21: "./img/lays.jpg",
  22: "./img/kitkat.jpeg",
  23: "./img/oreo.png",
  24: "./img/twix.png",
  77: "./img/nodisponible.png",
};
class mensajes {
  mostrarAlerta(mensaje, tipo, id) {
    const alerta = document.createElement("div");
    alerta.classList.add("text-center", "text-danger");
    if (tipo === "error") {
      alerta.textContent = mensaje;
      const alertaPass = document.querySelector(id);
      alertaPass.appendChild(alerta);

      setTimeout(() => {
        alerta.remove();
      }, 3000);
    }
  }
}

// crear instancia

const userUi = new mensajes();
function datos(e) {
  //guardar los valores en el objeto

  goloObj[e.target.name] = e.target.value;
  // ordenObj[e.target.name] = e.target.value;

  console.log(goloObj);
}
function obtenerGolosinas(e) {
  e.preventDefault();
  (async () => {
    try {
      const respuesta = await fetch(golosinas, {
        method: "GET",
      });
      const listaGolosinas = await respuesta.json();
      //console.log(listaGolosinas);
      validarIngresoGolosina(listaGolosinas);
      mostrarGolosinas(listaGolosinas);
    } catch (error) {
      console.log(error);
    }
  })();
}
function validarIngresoGolosina(golosinas) {
  const { nombre, cantidad, posicion, precio } = goloObj;

  let posc = parseInt(posicion);
  let cant = parseInt(cantidad);

  const disponible = golosinas.find((golo) => golo.id === posc);

  let dispon = "";
  let imagen = "";

  //console.log(disponible.id);

  if ([nombre, cantidad, posicion, precio].some((campo) => campo === "")) {
    userUi.mostrarAlerta("No debe haber campos vacios", "error", "#alerta");
  } else if (cant > 10) {
    userUi.mostrarAlerta(
      "No debe ingresar mas de 10 Golosinas",
      "error",
      "#alerta"
    );
  } else if (disponible) {
    // cant === 0 ? (imagen = imagensObj[77]) : false;
    cant > 1
      ? ((dispon = "Disponible"), (imagen = imagensObj[disponible.id]))
      : ((dispon = "Agotada"), (imagen = imagensObj[77]));
    insertarGolosina(nombre, cant, posicion, precio, dispon, imagen);
  }
}
function insertarGolosina(nombre, cantidad, id, precio, dispon, img) {
  //console.log("entras");
  (async () => {
    try {
      await fetch(`${golosinas}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          nombre: nombre,
          stock: cantidad,
          precio: precio,
          disponibilidad: dispon,
          img: img,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  })();

  limpiarHTML();
}

function mostrarGolosinas(golosina) {
  const divGolosinas = document.createElement("div");
  divGolosinas.classList.add("d-flex", "align-items-center");

  let html = "";

  golosina.forEach((element) => {
    const { nombre, stock, img, id, precio } = element;
    html += `    
    <div class="card" style="width:8rem">
          <img
            src="${img}"
            class="card-img-top"
            alt="${nombre}"
          />
          <div class="card-body">
            <p class="card-text">Posicion: ${id}</p>
            
          </div>
          <button class=" btn-primary btn2" type="button">${nombre}</button>
            <button class=" btn-primary btn2" type="button">Disponibles: ${stock}</button>
            <button class=" btn-primary btn2" type="button">Precio: ${precio}</button>
        </div>`;
  });

  gridGolosina.innerHTML = html;
}

function limpiarHTML() {
  const inputs = formulario.name;
  // while (inputs.firstChild) {
  //inputs.removeChild(inputs.firstChild);
  // }
  console.log(inputs);
}
