// socket client config
const socketClient = io();

// send product through socket.
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const thumbnail = document.getElementById("thumbnail").value;
  if (name && description && code && price && stock && thumbnail) {
    const product = {
      name: name,
      description: description,
      code: code,
      price: price,
      stock: stock,
      thumbnail: thumbnail,
    };
    socketClient.emit("newProduct", product);
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const codeInput = document.getElementById("code");
    const priceInput = document.getElementById("price");
    const stockInput = document.getElementById("stock");
    const thumbnailInput = document.getElementById("thumbnail");
    nameInput.value = "";
    descriptionInput.value = "";
    codeInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
    thumbnailInput.value = "";
    return Swal.fire({
      icon: "info",
      title: "Great!",
      html: "Product added successfully!",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      html: "The information in some text field is <b>empty or incorrect</b>. Please complete it correctly",
    });
  }
});

// // product list container in DOM
// const productsContainer = document.getElementById("productsContainer");

// // receive product from backend and render it to a table
// socketClient.on("productList", async (data) => {
//   if (data.message == "no file to read.") {
//     return (productsContainer.innerHTML = "");
//   }
//   const templateTable = await fetch("./templates/tableProducts.handlebars");
//   const templateTableText = await templateTable.text();
//   const template = Handlebars.compile(templateTableText);
//   const html = template({ products: data });
//   productsContainer.innerHTML = html;
// });
