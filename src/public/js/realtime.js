// =============== CLIENT SOCKET =============

const socket = io();

socket.on("connect", () => {
  console.log("Cliente: Conectado al servidor.");
});

// ================ OBJETO ======================

// Convertir el formulario en objeto

const form = document.getElementById("addProductForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const productData = Object.fromEntries(formData.entries());

  const { code } = productData;
  productData.thumbnails = [`/img/movies/${code}.jpg`];
  productData.status = true;

  try {
    // emit el addproduct y esperar respuesta del server
    const newProduct = await addProduct(productData);
  } catch (error) {
    console.error("Error adding product:", error);
  }
});

// EMIT SOCKET CON EL OBJETO

// Agregar producto
async function addProduct(productData) {
  return new Promise((resolve, reject) => {
    socket.emit("addProduct", productData, (response) => {
      if (response && response.success) {
        resolve(response.product);
      } else {
        reject(response.error || "Error adding product");
      }
    });
  });
}

// =============  REFRESCAR UI ======================
// escuchar el evento "productAdded" del servidor
socket.on("productAdded", async (data) => {
  try {
    // Conseguir la data del nuevo objeto directamente desde el socket
    const newProduct = data.product;

    const container = document.querySelector(".grid");
    // Crear el nuevo string
    const productCardHTML = `
      <div class="item card product">
        <img src="${newProduct.thumbnails[0]}">
        <p class="title">${newProduct.title}</p>
        <p class="price">${newProduct.price}</p>
      </div>
    `;

    // Insertar el nuevo producto como first-child de .grid
    container.insertAdjacentHTML("afterbegin", productCardHTML);
  } catch (error) {
    console.error("Client: Error refrescando la lista de productos.", error);
  }
});
