///////////////////////////////////////
// CLASE ProductManager
///////////////////////////////////////


class ProductManager {
  constructor() {
    this.products = [];
    this.productId = 1;
  }

  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("Todos los campos son obligatorios.");
      return;
    }

    // Validar que no se repita el campo "code"
    const existingProduct = this.products.find(p => p.code === product.code);
    if (existingProduct) {
      console.log(`Ya existe un producto con el código ${product.code}.`);
      return;
    }

    // Agregar el producto al arreglo con un id autoincrementable
    product.id = this.productId++;
    this.products.push(product);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      console.log("Not found.");
    }
    return product;
  }
}











///////////////////////////////////////
// PROCESO DE TESTING
///////////////////////////////////////


// Paso 1: Crear una instancia de la clase "ProductManager"
const manager = new ProductManager();

// Paso 2: Llamar a "getProducts" recién creada la instancia, debe devolver un arreglo vacío []
const productsEmpty = manager.getProducts();
console.log(productsEmpty); // []

// Paso 3: Llamar al método "addProduct" con los campos proporcionados
manager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
});

// Paso 4: Verificar que el objeto se haya agregado correctamente con un id generado automáticamente SIN REPETIRSE
const productsAdded = manager.getProducts();
console.log(productsAdded);

// Paso 5: Llamar al método "addProduct" con los mismos campos de arriba, debe arrojar un error porque el código estará repetido
manager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
});

// Paso 6: Evaluar que "getProductById" devuelva error si no encuentra el producto o el producto en caso de encontrarlo
const productNotFound = manager.getProductById(100); // Producto no encontrado, se mostrará un mensaje de error en la consola
const productFound = manager.getProductById(1); // Producto encontrado, se mostrará el producto en la consola
