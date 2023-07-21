import fs from "fs";
import path from "path";
import { __dirname } from "../utils.js";
import { generateUniqueId } from "../utils.js";

// Obtener la ruta absoluta al archivo productos.json
const filePath = path.join(__dirname, "./data/productos.json");

/* file checker */
const fileExists = (filePath) => {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

const productsController = {
  getAllProducts: (req, res) => {
    const { limit } = req.query;
    const genericThumbnail = "/img/movies/unknown.jpg";

    // Leer el contenido de productos.json
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      try {
        // Analizar los datos JSON
        const products = JSON.parse(data);

        // Aplicar límite si se proporciona
        const limitedProducts =
          limit && Number.isInteger(Number(limit)) && Number(limit) > 0
            ? products.slice(0, Number(limit))
            : products;

        // Chequear si "thumbnails" existe en cada producto
        const productsWithThumbnails = limitedProducts.map((product) => {
          if (!product.thumbnails || !fileExists(product.thumbnails[0])) {
            return {
              ...product,
              thumbnails: [genericThumbnail],
            };
          }
          return product;
        });

        // Devolver los productos con sus thumbnails
        res.json(productsWithThumbnails);
      } catch (err) {
        console.error("Error al analizar productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  },
  getProductById: (req, res) => {
    const { pid } = req.params;

    // Leer el contenido de productos.json
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      try {
        // Analizar los datos JSON
        const products = JSON.parse(data);

        // Encontrar el producto con el pid especificado
        const product = products.find((p) => p.id === pid);

        if (product) {
          // Chequear si "thumbnails" existe en el producto
          if (!product.thumbnails || !fileExists(product.thumbnails[0])) {
            product.thumbnails = [genericThumbnail];
          }
          // Enviar el producto como respuesta
          res.json(product);
        } else {
          res.status(404).json({ error: "Producto no encontrado" });
        }
      } catch (err) {
        console.error("Error al analizar productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  },
  addProduct: (req, res) => {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails,
    } = req.body;

    // Leer el contenido de productos.json
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      try {
        // Analizar los datos JSON
        const products = JSON.parse(data);

        // Generar un ID único para el nuevo producto
        const id = generateUniqueId();

        // Crear el nuevo objeto de producto
        const newProduct = {
          id,
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnails: thumbnails || [],
        };

        // Agregar el nuevo producto al array de productos existente
        products.push(newProduct);

        // Escribir el array de productos actualizado de nuevo en productos.json
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          if (err) {
            console.error("Error al escribir productos.json:", err);
            res.status(500).json({ error: "Error interno del servidor" });
            return;
          }

          // Enviar el nuevo producto como respuesta
          res.status(201).json(newProduct);
        });
      } catch (err) {
        console.error("Error al analizar productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  },
  updateProduct: (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    // Leer el contenido de productos.json
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      try {
        // Analizar los datos JSON
        const products = JSON.parse(data);

        // Encontrar el producto con el pid especificado
        const product = products.find((p) => p.id === pid);

        if (product) {
          // Actualizar los campos del producto con los valores enviados desde body
          Object.assign(product, updatedFields);

          // Escribir el array de productos actualizado de nuevo en productos.json
          fs.writeFile(filePath, JSON.stringify(products), (err) => {
            if (err) {
              console.error("Error al escribir productos.json:", err);
              res.status(500).json({ error: "Error interno del servidor" });
              return;
            }

            // Enviar el producto actualizado como respuesta
            res.json(product);
          });
        } else {
          res.status(404).json({ error: "Producto no encontrado" });
        }
      } catch (err) {
        console.error("Error al analizar productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  },
  deleteProduct: (req, res) => {
    const { pid } = req.params;

    // Leer el contenido de productos.json
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      try {
        // Analizar los datos JSON
        const products = JSON.parse(data);

        // Encontrar el índice del producto con el pid especificado
        const index = products.findIndex((p) => p.id === pid);

        if (index !== -1) {
          // Eliminar el producto del array de productos
          products.splice(index, 1);

          // Escribir el array de productos actualizado de nuevo en productos.json
          fs.writeFile(filePath, JSON.stringify(products), (err) => {
            if (err) {
              console.error("Error al escribir productos.json:", err);
              res.status(500).json({ error: "Error interno del servidor" });
              return;
            }

            res.sendStatus(204);
          });
        } else {
          res.status(404).json({ error: "Producto no encontrado" });
        }
      } catch (err) {
        console.error("Error al analizar productos.json:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  },
};

export default productsController;
