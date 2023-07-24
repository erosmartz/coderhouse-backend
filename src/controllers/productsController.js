import fs from "fs/promises";
import path from "path";
import { __dirname, generateUniqueId } from "../utils.js";

const filePath = path.join(__dirname, "./data/productos.json");

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const readProductsFile = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    throw new Error("Error reading products file");
  }
};

const productsController = {
  getAllProducts: async (req, res) => {
    const { limit } = req.query;
    const genericThumbnail = "/img/movies/unknown.jpg";

    try {
      const products = await readProductsFile();

      const limitedProducts =
        limit && Number.isInteger(Number(limit)) && Number(limit) > 0
          ? products.slice(0, Number(limit))
          : products;

      const productsWithThumbnails = await Promise.all(
        limitedProducts.map(async (product) => {
          const thumbnails = product.thumbnails || [];
          if (!thumbnails.length || !(await fileExists(thumbnails[0]))) {
            return { ...product, thumbnails: [genericThumbnail] };
          }
          return product;
        })
      );

      res.json(productsWithThumbnails);
    } catch {
      res.status(500).json({ error: "Error en la funcion getAllProducts" });
    }
  },
  getProductById: async (req, res) => {
    const { pid } = req.params;
    const genericThumbnail = "/img/movies/unknown.jpg";

    try {
      const products = await readProductsFile();
      const product = products.find((p) => p.id === pid);

      if (product) {
        const thumbnails = product.thumbnails || [];
        if (!thumbnails.length || !(await fileExists(thumbnails[0]))) {
          product.thumbnails = [genericThumbnail];
        }
        res.json(product);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch {
      res.status(500).json({ error: "Error en la funcion getProductById" });
    }
  },
  addProduct: async (req, res) => {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = req.body;

    console.log(
      "Server(Controller): Se ha recibido el producto desde websocket. Agregando..",
      req.body
    );

    try {
      const products = await readProductsFile();
      const id = generateUniqueId();

      const newProduct = {
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      };

      products.push(newProduct);
      await fs.writeFile(filePath, JSON.stringify(products));

      console.log(
        "Server(Controller): Producto agregado satisfactoriamente.",
        newProduct
      );

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Server(Method): Error agregando producto.", error.message);

      res.status(500).json({ error: "Error en la funcion addProduct" });
    }
  },
  updateProduct: async (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    try {
      const products = await readProductsFile();
      const product = products.find((p) => p.id === pid);

      if (product) {
        Object.assign(product, updatedFields);
        await fs.writeFile(filePath, JSON.stringify(products));
        res.json(product);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch {
      res.status(500).json({ error: "Error en la funcion updateProduct" });
    }
  },
  deleteProduct: async (req, res) => {
    const { pid } = req.params;
    try {
      const products = await readProductsFile();
      const productIndex = products.findIndex((p) => p.id === pid);

      if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1);
        await fs.writeFile(filePath, JSON.stringify(products));
        res.json(deletedProduct);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch {
      res.status(500).json({ error: "Error en la funcion deleteProduct" });
    }
  },
};

export default productsController;
