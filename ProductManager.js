///////////////////////////////////////
// CLASE ProductManager - Desafio 2
///////////////////////////////////////


const fs = require('fs');




class ProductManager {
  constructor(path) {

    this.path = path;
    this.products = [];
    this.productId = 1;

  }

  addProduct(product) {


    // Validar campos obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("Todos los campos son obligatorios.");
      return;
      
    }

    // Leer archivo para recibir los productos existentes
    this.readProductsFromFile();



    // Validar campo "code", que no se repita
    const existingProduct = this.products.find(p => p.code === product.code);
    if (existingProduct) {
      console.log(`Ya existe un producto con el código de ID ${product.code}.`);
      return;
    }

    // Asignar un id autoincrementable y agregar el producto al arreglo
    product.id = this.productId++;
    this.products.push(product);

    // Guardar los productos en el file
    this.saveProductsToFile();
  }



  getProducts() {
    // Leer archivo y obtener todos los productos
    this.readProductsFromFile();
    return this.products;
  }




  getProductById(id) {
    // Leer archivo y obtener productos en id
    this.readProductsFromFile();

    const product = this.products.find(p => p.id === id);
    if (!product) {
      console.log("Producto no encontrado.");
    }
    return product;
  }




  updateProduct(id, updatedProduct) {


    // Leer el archivo y obtener los productos existentes
    this.readProductsFromFile();


    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.log("Producto no encontrado.");
      return;
    }


    // Actualizar el producto en el arreglo
    this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };


    // Guardar los productos actualizados en el archivo
    this.saveProductsToFile();
  }





  deleteProduct(id) {
    // Leer el archivo y obtener los productos existentes
    this.readProductsFromFile();

    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.log("Producto no encontrado.");
      return;
    }

    // Eliminar el producto del arreglo
    this.products.splice(productIndex, 1);


    // Guardar los productos actualizados en el archivo
    this.saveProductsToFile();

  }




  readProductsFromFile() {

    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      // Si ocurre un error al leer archivo, quiere decir que no hay productos todavia
      this.products = [];
    }
  }

  saveProductsToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }
}











///////////////////////////////////////
// PROCESO DE TESTING
///////////////////////////////////////


const path = 'src/db/productos.json'; // ruta de archivos

// Paso 1: Crear una instancia para el path
const productManager = new ProductManager(path);



// Paso 2: Llamar a "getProducts"
const products = productManager.getProducts();
console.log(products); // debe devolver un array vacío []



// Paso 3: Llamar "addProduct" con "producto prueba"
const newProduct = {
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25
};

productManager.addProduct(newProduct);



// Paso 4
const updatedProducts = productManager.getProducts();
console.log(updatedProducts); // [ { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 } ]



// Paso 5
const productId = 1;
const productById = productManager.getProductById(productId);
console.log(productById); // { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }



// Paso 6
const updatedFields = { title: 'producto actualizado', price: 250 };
productManager.updateProduct(productId, updatedFields);



// Verificar que se haya actualizado correctamente
const updatedProduct = productManager.getProductById(productId);
console.log(updatedProduct); // { id: 1, title: 'producto actualizado', description: 'Este es un producto prueba', price: 250, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }



// Paso 7
productManager.deleteProduct(productId);



// Verificar que se haya eliminado correctamente
const deletedProduct = productManager.getProductById(productId);


// Verificar que printee el error "producto no encontrado" correctamente
console.log(deletedProduct);


