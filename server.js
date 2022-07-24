const express = require("express");
require("dotenv").config({ path: "./DBconfig/.env" });
const rutasProducto = require("./routes/productosRutas");
const rutasTest = require("./routes/productosTestRutas");
const loginRutas = require("./routes/loginRutas");
const infoRutas = require("./routes/infoRutas");
const randomsRutas = require("./routes/randomsRutas");
const { engine } = require("express-handlebars");
const { Server: ioServer } = require("socket.io");
const http = require("http");
const ContenedorMensajes = require("./mensajesContainer");
const { knex } = require("./DBconfig/DBconfigMensajes");
const ContenedorProductos = require("./productosContainer");
const { knexProducts } = require("./DBconfig/DBconfigProductos");
const mensajeSchema = require("./schemas/mensajeSchema");
const { normalize, schema } = require("normalizr");
const { inspect } = require("util");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const pass = require("./passport/local");
const parseArgs = require("minimist");
const app = express();

//SERVIDOR HTTP CON FUNCIONALIDADES DE APP (EXPRESS)
const httpServer = http.createServer(app);
//SERVIDOR WEBSOCKET CON FUNCIONALIDADES DE HTTP
const socketServer = new ioServer(httpServer);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.7ddl8ks.mongodb.net/session-user?retryWrites=true&w=majority`,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    cookie: { maxAge: 10000 * 60 },
    secret: "pass",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//middleware para cargar archivos
app.use(express.static(__dirname + "/public"));

//MOTOR DE PLANTILLAS
app.set("view engine", "hbs");
///CONFIGURACION HANDLEBARS
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

//DONDE ESTAN LOS ARCHIVOS DE PLANTILLA
app.set("views", "/views");

const mensajesDB = new ContenedorMensajes("mensajes", mensajeSchema);
const productosDB = new ContenedorProductos(knexProducts, "productos");
const normalizar = (data) => {
  //console.log('SOY LA DATAAA',data);

  const schemaAuthor = new schema.Entity(
    "author",
    {},
    { idAttribute: "email" }
  );
  const schemaMensaje = new schema.Entity(
    "mensaje",
    {
      author: schemaAuthor,
    },
    { idAttribute: "_id" }
  );
  const mensajesSchema = new schema.Entity("mensajes", {
    mensajes: [schemaMensaje],
  });
  const dataSinNormalizar = { id: "mensajes", mensajes: data };
  return normalize(dataSinNormalizar, mensajesSchema);
};

socketServer.on("connection", (socket) => {
  productosDB.getAll().then((productos) => {
    socket.emit("datosTabla", productos);
  });
  socket.on("nuevo-producto", async (producto) => {
    await productosDB.save(producto);
    productosDB.getAll().then((productos) => {
      socketServer.sockets.emit("datosTabla", productos);
    });
  });

  mensajesDB.getAllMessages().then((res) => {
    //console.log(JSON.stringify(res));
    const data = normalizar(JSON.parse(JSON.stringify(res)));
    console.log("DATA NORMALIZADA", inspect(data, false, 12, true));
    socket.emit("datosMensajes", data);
  });

  socket.on("nuevo-mensaje", async (mensaje) => {
    console.log(mensaje);
    await mensajesDB.save(mensaje);
    await mensajesDB.getAllMessages().then((res) => {
      const data = normalizar(JSON.parse(JSON.stringify(res)));
      socketServer.sockets.emit("datosMensajes", data);
    });
  });
});

//RUTAS
app.use("/productos", rutasProducto);
app.use("/api/productos-test", rutasTest);
app.use("/info", infoRutas);
app.use("/api/randoms", randomsRutas);
app.use("/", loginRutas);
//PUERTO

const arg = parseArgs(process.argv.slice(2));

const PORT = arg._[0] || 8080;
const server = httpServer.listen(PORT, () => {
  console.log(`servidor en puerto ${server.address().port}`);
});
//por si hay errores en el servidor
server.on("error", (error) => console.log(`error en el servidor ${error}`));
