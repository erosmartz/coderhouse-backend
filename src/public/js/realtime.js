// =============== CLIENT SOCKET =============

const socket = io();

socket.on("connect", () => {
  console.log("Cliente: Conectado al servidor.");
});

// ================ OBJETO ======================

// LOGICA PARA EL FORM

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
    console.log("Client websocket: Product added");
  } catch (error) {
    console.error("Error adding product:", error);
  }
});

// EMIT SOCKET CON EL OBJETO

// agregar producto
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
socket.on("productAdded", (data) => {
  const newProduct = data.product;
  displayNewProduct(newProduct);
});

function displayNewProduct(product) {
  const container = document.querySelector(".grid");
  const productCard = createProductCard(product);

  container.appendChild(productCard);
}

function createProductCard(product) {
  const cardTemplate = `
    <div class="item card product">
      <img src="${product.thumbnails[0]}">
      <p class="title">${product.title}</p>
      <p class="price">${product.price}</p>
    </div>
  `;

  const cardElement = document.createElement("div");
  cardElement.innerHTML = cardTemplate;

  return cardElement.firstChild;
}
