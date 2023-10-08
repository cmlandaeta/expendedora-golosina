const inputGolosina = document.querySelector("#input_codigo");
const inputPass = document.querySelector("#input_pass");
const formCod = document.querySelector("#formId");
const formPass = document.querySelector("#formPass");
const gridGolosina = document.querySelector("#contenedor_golosinas");
const botonMostrar = document.querySelector("#mostrar");
const contenedor = document.querySelector("#contenedor");
const botonApagar = document.querySelector("#apagar");
const botonSolicitar = document.querySelector("#solicitar1");
const botonProvisionar = document.querySelector("#provisionar");
const imgagenOpen = document.querySelector("#open");

const golosinas = "http://localhost:3001/golosinas";
const admin = "http://localhost:3001/usuarios";

let switching = true;
let counter = 0;

//console.log(inputPass.value);
document.addEventListener("DOMContentLoaded", () => {
  obtenerGolosinas();
});

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

evenlister();

function evenlister() {
  inputGolosina.addEventListener("input", datosOrden);
  //inputPass.addEventListener("input", datosOrden);
  formCod.addEventListener("submit", SolicitarGolosina);
  formPass.addEventListener("submit", validarAdmin);
  botonMostrar.addEventListener("click", mostrarGolosinaSeleccionada);
  botonApagar.addEventListener("click", apagarMaquina);
}

const ordenObj = {
  cod_golosina: "",
  pass: "",
};

const goloObj = {
  nombre: "",
  precio: "",
  img: "",
  cantidad: "",
};

const imagensObj = {
  10: "./img/clubsocial.jpg",
  11: "./img/samba.jpg",
  12: "./img/cocossette.wepb",
  13: "./img/M&Ms.webp",
  21: "./img/lays.jpg",
  22: "./img/kitkat.jpeg",
  23: "./img/oreo.png",
  24: "./img/twix.png",
  77: "./img/nodisponible.png",
};

function datosOrden(e) {
  //guardar los valores en el objeto

  ordenObj[e.target.name] = e.target.value;

  console.log(ordenObj);
}

function SolicitarGolosina(e) {
  e.preventDefault();

  counter = counter + 1;

  const { cod_golosina } = ordenObj;

  //console.log(cod_golosina);

  (async () => {
    try {
      const respuesta = await fetch(golosinas, {
        method: "GET",
      });
      const cod = await respuesta.json();
      const codList = cod.some((codgs) => codgs.id === parseInt(cod_golosina));
      //console.log(codList);

      let nodisp = cod.find((dis_id) => dis_id.id === parseInt(cod_golosina));

      //console.log(nodisp);
      if (cod_golosina === "") {
        userUi.mostrarAlerta(
          "Debes Introducir un Codigo",
          "error",
          "#mostrar_alert_seleccion"
        );
      } else if (!codList) {
        userUi.mostrarAlerta(
          "El Codigo que Introduciste No Esta Asignado",
          "error",
          "#mostrar_alert_seleccion"
        );
      } else if (
        nodisp.id === parseInt(cod_golosina) &&
        nodisp.disponibilidad === "Agotada"
      ) {
        userUi.mostrarAlerta(
          "La Golosina Seleccionada Esta Agotada",
          "error",
          "#mostrar_alert_seleccion"
        );
      } else {
        // enviar golosina seleccionada si todo esta OK al objeto que luego se tomo para mostrar
        cod.filter((i) =>
          i.id === parseInt(cod_golosina)
            ? ((goloObj.nombre = i.nombre),
              (goloObj.precio = i.precio),
              (goloObj.img = i.img),
              (goloObj.cantidad = counter))
            : false
        );
        // boton mostrar golosina para a verde cuando fue comprada la golosina
        botonMostrar.classList.add("btn", "btn-success");

        // luego que la golosina esta en el objeto se actualiza la cantidad en el stock
        cod.filter((cd) =>
          cd.id === parseInt(cod_golosina)
            ? validarStockGolosina(cod_golosina, cd)
            : false
        );
      }
    } catch (error) {
      //console.log(error);
    }
  })();
}

function obtenerGolosinas() {
  (async () => {
    try {
      const respuesta = await fetch(golosinas, {
        method: "GET",
      });
      const listaGolosinas = await respuesta.json();

      mostrarGolosinas(listaGolosinas);
    } catch (error) {
      console.log(error);
    }
  })();
}
// mostrar pagina principal
function mostrarGolosinas(golosina) {
  const divGolosinas = document.createElement("div");
  divGolosinas.classList.add("d-flex", "align-items-center");

  let html = "";

  golosina.forEach((element) => {
    const { nombre, precio, img, id } = element;
    html += `    
    <div class="card col-sm-02" style="width: 12rem">
          <img
            src="${img}"
            class="card-img-top"
            alt="${nombre}"
          />
          <div class="card-body">
            <p class="card-text">Posicion: ${id}</p>
            
          </div>
          <button class="btn btn-primary btn2" type="button">${nombre}</button>
            <button class="btn btn-primary btn2" type="button">Precio: ${precio}</button>
        </div>`;
  });

  gridGolosina.innerHTML = html;
}

function mostrarGolosinaSeleccionada(e) {
  e.preventDefault();
  const divGolosinas = document.createElement("div");

  divGolosinas.classList.add("d-flex", "align-items-center");
  // el boton pasa azul una vez se muestre la golosina
  botonMostrar.classList.add("btn", "btn-primary");
  const { nombre, precio, img, cantidad } = goloObj;
  let html = "";

  html += `    
  <div class="card mostrar" style="width: 18rem">
        <img
          src="${img}"
          class="card-img-top"
          alt="${nombre}"
        />
        <div class="card-body">
          <p class="card-text">Seleccionaste:</p>
          
        </div>
        <button class="btn btn-primary btn2" type="button">${cantidad}</button>
          <button class="btn btn-primary btn2" type="button"> ${nombre}</button>
      </div>`;

  gridGolosina.innerHTML = html;
}
//Validad ingreso del ADMIN
function validarAdmin(e) {
  e.preventDefault();
  (async () => {
    try {
      const respuesta = await fetch(admin, {
        method: "GET",
      });
      const users = await respuesta.json();

      const user = users.some((usr) => usr.pass === inputPass.value);

      //console.log(user);

      if (user) {
        // si no existe

        users.forEach((usr) => {
          localStorage.setItem("user", JSON.stringify(usr.user));
          window.location.href = "../admin/";
        });
        const modalPass = document.querySelector("#exampleModal");
        modalPass.remove();
      } else if (inputPass.value === "") {
        userUi.mostrarAlerta(
          "Ingrese una Contrasena",
          "error",
          "#mostrar_pass"
        );
      } else if (!user) {
        userUi.mostrarAlerta("Contrasena Invalida", "error", "#mostrar_pass");
      }
    } catch (error) {
      console.log(error);
    }
  })();
}

// resta cantidad de golosina
async function validarStockGolosina(cod_golosina, goloseleccionada) {
  const cantidad = goloseleccionada.stock - 1;
  const cod = parseInt(cod_golosina);

  cod === goloseleccionada.id
    ? await fetch(`http://localhost:3001/golosinas/${cod_golosina}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          stock: cantidad,
        }),
      })
    : false;

  cantidad === 0
    ? await fetch(`http://localhost:3001/golosinas/${cod_golosina}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          disponibilidad: "Agotada",
          img: (img = imagensObj[77]),
        }),
      })
    : false;

  console.log(cantidad);
}

function apagarMaquina(e) {
  if (switching) {
    botonMostrar.disabled = "true";
    //botonSolicitar.disabled = "true";
    botonProvisionar.disabled = "true";
    botonApagar.textContent = "Encender Maquina";
    botonApagar.style.backgroundColor = "green";
    const divImg = document.createElement("div");
    const close = document.createElement("div");
    close.classList.add("open");
    close.innerHTML = ` 
    <img class="img_open" src="./img/closed.png" />
    `;
    divImg.appendChild(close);
    imgagenOpen.appendChild(divImg);

    setTimeout(() => {
      divImg.remove();
    }, 1000);

    switching = false;
  } else if (!switching) {
    botonMostrar.removeAttribute("disabled");
    //botonSolicitar.removeAttribute("disabled");
    botonProvisionar.removeAttribute("disabled");
    botonApagar.textContent = "Apagar Maquina";
    botonApagar.style.backgroundColor = "red";

    const divImg = document.createElement("div");
    const close = document.createElement("div");
    close.classList.add("open");
    close.innerHTML = ` 
    <img class="img_open" src="./img/open.jpeg" />
    `;
    divImg.appendChild(close);
    imgagenOpen.appendChild(divImg);

    setTimeout(() => {
      divImg.remove();
    }, 1000);

    switching = true;
  }
  //document.getElementById("maquinaria").style.display = "none";
}

function limpiarHTML() {
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
}

function spinner() {
  limpiarHTML();

  const divSpinner = document.createElement("div");
  //divSpinner.classList.add("sk-fading-circle");
  divSpinner.innerHTML = `<div class="spinner-grow" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;

  contenedor.appendChild(divSpinner);
}
