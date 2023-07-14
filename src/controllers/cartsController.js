import fs from "fs";

const cartsController = {
  getCartById: (req, res) => {
    const { cid } = req.params;

    // Leer el contenido de carritos.json
    fs.readFile("carritos.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer carritos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      try {
        // Analizar los datos JSON
        const carts = JSON.parse(data);

        // Encontrar el carrito con el cid especificado
        const cart = carts.find((c) => c.id === cid);

        if (cart) {
          // Enviar el carrito como respuesta
          res.json(cart);
        } else {
          res.status(404).json({ error: "Carrito no encontrado" });
        }
      } catch (err) {
        console.error("Error al analizar carritos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  },
  createCart: (req, res) => {
    const { userId } = req.body;

    // Leer el contenido de carritos.json
    fs.readFile("carritos.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer carritos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      try {
        // Analizar los datos JSON
        const carts = JSON.parse(data);

        // Generar un ID único para el nuevo carrito
        const id = generateUniqueId();

        // Crear el nuevo objeto de carrito
        const newCart = {
          id,
          userId,
          products: [],
        };

        // Agregar el nuevo carrito al array de carritos existente
        carts.push(newCart);

        // Escribir el array de carritos actualizado de nuevo en carritos.json
        fs.writeFile("carritos.json", JSON.stringify(carts), (err) => {
          if (err) {
            console.error("Error al escribir carritos.json:", err);
            res.status(500).json({ error: "Error interno del servidor" });
            return;
          }

          // Enviar el nuevo carrito como respuesta
          res.status(201).json(newCart);
        });
      } catch (err) {
        console.error("Error al analizar carritos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  },
  addToCart: (req, res) => {
    const { cid } = req.params;
    const { productId, quantity } = req.body;

    // Leer el contenido de carritos.json
    fs.readFile("carritos.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer carritos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      try {
        // Analizar los datos JSON
        const carts = JSON.parse(data);

        // Encontrar el carrito con el cid especificado
        const cart = carts.find((c) => c.id === cid);

        if (cart) {
          // Obtener la información del producto a agregar al carrito
          const productInfo = getProductInfo(productId);

          if (productInfo) {
            // Crear el objeto de producto a agregar al carrito

            const productToAdd = {
              productId,
              quantity,
              ...productInfo,
            };

            // Agregar el producto al array de productos del carrito
            cart.products.push(productToAdd);

            // Escribir el array de carritos actualizado de nuevo en carritos.json
            fs.writeFile("carritos.json", JSON.stringify(carts), (err) => {
              if (err) {
                console.error("Error al escribir carritos.json:", err);
                res.status(500).json({ error: "Error interno del servidor" });
                return;
              }

              // Enviar el carrito actualizado como respuesta
              res.json(cart);
            });
          } else {
            res.status(404).json({ error: "Producto no encontrado" });
          }
        } else {
          res.status(404).json({ error: "Carrito no encontrado" });
        }
      } catch (err) {
        console.error("Error al analizar carritos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  },
  removeFromCart: (req, res) => {
    const { cid } = req.params;
    const { productId } = req.body;

    // Leer el contenido de carritos.json
    fs.readFile("carritos.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer carritos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      try {
        // Analizar los datos JSON
        const carts = JSON.parse(data);

        // Encontrar el carrito con el cid especificado
        const cart = carts.find((c) => c.id === cid);

        if (cart) {
          // Encontrar el índice del producto a eliminar del carrito
          const index = cart.products.findIndex(
            (p) => p.productId === productId
          );

          if (index !== -1) {
            // Eliminar el producto del array de productos del carrito
            cart.products.splice(index, 1);

            // Escribir el array de carritos actualizado de nuevo en carritos.json
            fs.writeFile("carritos.json", JSON.stringify(carts), (err) => {
              if (err) {
                console.error("Error al escribir carritos.json:", err);
                res.status(500).json({ error: "Error interno del servidor" });
                return;
              }

              // Enviar el carrito actualizado como respuesta
              res.json(cart);
            });
          } else {
            res
              .status(404)
              .json({ error: "Producto no encontrado en el carrito" });
          }
        } else {
          res.status(404).json({ error: "Carrito no encontrado" });
        }
      } catch (err) {
        console.error("Error al analizar carritos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  },
};

export default cartsController;
