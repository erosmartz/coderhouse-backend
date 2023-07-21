//import tools
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

//import custom modules
import { __dirname } from "./utils.js";

// import routers
import viewsRouter from "./routes/views.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

//set globals
const app = express();

// Server HTTP
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
//Websocket
const socketServer = new Server(httpServer);

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//tool modules
app.use(express.static(__dirname + "/public"));
app.use(express.json());

//api routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//default routes
app.use("/", viewsRouter);

//Websocket connection
socketServer.on("connection", (socket) => {
  console.log("Server says: Nuevo cliente conectado");
  socket.on("message", (data) => {
    console.log(data);
  });
});
