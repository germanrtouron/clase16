// socket client config
const socketClient = io();

// send product through socket.
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  if (title && price && thumbnail) {
    const product = {
      title: title,
      price: price,
      thumbnail: thumbnail,
    };
    socketClient.emit("newProduct", product);
    const titleInput = document.getElementById("title");
    const priceInput = document.getElementById("price");
    const thumbnailInput = document.getElementById("thumbnail");
    titleInput.value = "";
    priceInput.value = "";
    thumbnailInput.value = "";
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      html: "The information in some text field is <b>empty or incorrect</b>. Please complete it correctly",
    });
  }
});

// product list container in DOM
const productsContainer = document.getElementById("productsContainer");

// receive product from backend and render it to a table
socketClient.on("productList", async (data) => {
  const templateTable = await fetch("./templates/tableProducts.handlebars");
  const templateTableText = await templateTable.text();
  const template = Handlebars.compile(templateTableText);
  const html = template({ products: data });
  productsContainer.innerHTML = html;
});
