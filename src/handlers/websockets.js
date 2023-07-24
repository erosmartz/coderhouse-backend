import axios from "axios";

const handleWebsockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Server: Un nuevo cliente se ha conectado.");

    socket.on("addProduct", async (productData, callback) => {
      try {
        console.log("Server: Recibido un nuevo producto. Enviando a Metodo...");

        // Enviar productData como Body JSON con AXIOS
        const response = await axios.post(
          "http://localhost:8080/api/products",
          productData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newProduct = response.data;
        io.emit("productAdded", { success: true, product: newProduct });
        callback({ success: true, product: newProduct });
      } catch (error) {
        console.error("Error adding product:", error);
        callback({ success: false, error: "Error adding product" });
      }
    });
  });
};

export default handleWebsockets;
