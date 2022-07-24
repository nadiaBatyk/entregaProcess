
const socket = io();

socket.on("datosTabla", (data) => {
  console.log(data);
  if (data?.length) {
    return renderTabla(data);
  }
});
function renderTabla(data) {
  const html = data
    .map((item) => {
      return ` <tr >
      <td class="table-text">${item.nombre}</td>
      <td class="table-text">${item.precio}</td>
      <td>
        <img
          src="${item.link} "
          class="table-img"
          alt="${item.nombre}"
        /></td></tr>
    `;
    })
    .join(" ");
  document.getElementById("bodyTabla").innerHTML = html;
}
const button = document.getElementById("botonAgregar");
button.addEventListener("click", (event) => {
  addProduct();
});
//esta funcion se ejecuta en el evento click del boton
//toma los valores del form y los envia al servidor
function addProduct() {
  const producto = {
    nombre: document.getElementById("nombre").value,
    precio: document.getElementById("precio").value,
    link: document.getElementById("link").value,
  };

  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("link").value = "";
  socket.emit("nuevo-producto", producto);
}
//MENSAJES
const schemaAuthor = new normalizr.schema.Entity("author", {}, { idAttribute: "email" });
const schemaMensaje = new normalizr.schema.Entity(
  "mensaje",
  {
    author: schemaAuthor,
  },
  { idAttribute: "_id" }
);
const mensajesSchema = new normalizr.schema.Entity("mensajes", {
  mensajes: [schemaMensaje],
});
socket.on("datosMensajes", (mensaje) => {
  console.log(mensaje);
  
    const data = normalizr.denormalize(mensaje.result,mensajesSchema,mensaje.entities);
    console.log(data);
    return renderMensajes(data);
 
});
function renderMensajes(mensaje) {
  const html = mensaje.mensajes
    .map((item) => {
      return `<div class="flex">
      <p class="mail mr-1">${item.author.email} </p>
      <p class="fecha mr-1">[${item.timestamp}] :</p>
      <i class="mensaje">${item.text}</i>
      <img class="table-img" src="${item.author.avatar}" alt="avatar usuario">
      
  </div>`;
    })
    .join("<br> ");
  document.getElementById("mensajes").innerHTML = html;
}
const botonMensaje = document.getElementById("botonMensaje");
botonMensaje.addEventListener("click", (event) => {
  addMessage();
});
//esta funcion se ejecuta en el evento click del boton
//toma los valores del form y los envia al servidor
function addMessage() {
  const mensaje = {
    author: {
      email: document.getElementById("email").value,
      name: document.getElementById("name").value,
      apellido: document.getElementById("apellido").value,
      edad: document.getElementById("edad").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value,
    },

    text: document.getElementById("text").value,
  };

  (document.getElementById("email").value = ""),
    (document.getElementById("name").value = ""),
    (document.getElementById("apellido").value = ""),
    (document.getElementById("edad").value = ""),
    (document.getElementById("alias").value = ""),
    (document.getElementById("avatar").value = ""),
    (document.getElementById("text").value = "");
  socket.emit("nuevo-mensaje", mensaje);
}
