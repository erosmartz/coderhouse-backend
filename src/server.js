import express from "express";
import productsRouter from "./routes/products";
import cartsRouter from "./routes/carts";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
