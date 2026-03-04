import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import { Server } from "socket.io";
import ProductManager from "./managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const productManager = new ProductManager("./src/data/products.json");

//URLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Router de vistas
app.use("/", viewsRouter);

// Servidor HTTP
const httpServer = app.listen(8080, () => {
  console.log("Server escuchando puerto 8080");
});

// Socket.io
export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado", socket.id); //cliente lo llamo socket porque es el objeto que representa la conexión del cliente al servidor a través de Socket.io.

  // Crear producto desde websocket
  socket.on("newProduct", async (product) => {
    try {
      const newProduct = {
        title: product.title,
        description: "Producto agregado desde realtime",
        code: "code-" + Date.now(),
        price: Number(product.price),
        status: true,
        stock: 10,
        category: "general",
        thumbnails: [],
      };

      await productManager.addProduct(newProduct);

      const products = await productManager.getProducts();

      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  // Eliminar producto desde websocket
  socket.on("deleteProduct", async (id) => {
    try {
      await productManager.deleteProduct(Number(id));

      const products = await productManager.getProducts();

      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado", socket.id);
  });
});
