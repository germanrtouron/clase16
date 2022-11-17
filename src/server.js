// imports
const path = require("path");

// server config
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static("src/public"));

// format config
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API router config
const routerProducts = express.Router();
app.use("/api/productos", routerProducts);

// handlebars config
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: "index" }));
const views = path.join(__dirname, "views");
app.set("views", views);
app.set("view engine", "handlebars");

// server listening
const server = app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`); // server listening message.
});
server.on("error", (error) => console.log(`error at server ${PORT}`)); // catch server error.

// products service config
const Container = require("./managers/productsService");
let productsService = new Container("products.txt");

// chat service config
const ChatContainer = require("./managers/chatService");
let chatService = new ChatContainer("chat-history.txt");

// websocket config
const { Server } = require("socket.io");
const io = new Server(server);

// websocket connection
io.on("connection", async (socket) => {
  io.sockets.emit("productList", await productsService.getAll());
  io.sockets.emit("chatContent", await chatService.getAll());
  // receive product from frontend
  socket.on("newProduct", async (data) => {
    await productsService.save(data);
    // send updated product list to frontend
    io.sockets.emit("productList", await productsService.getAll());
  });
  // receive message from frontend
  socket.on("newMessage", async (data) => {
    // send updated chat content to frontend
    await chatService.save(data);
    io.sockets.emit("chatContent", await chatService.getAll());
  });
});

// VIEWS routes
// form view
app.get("/", (req, res) => {
  res.render("formProducts");
});

//products view
app.get("/productos", (req, res) => {
  productsService.getAll().length === 0
    ? res.render("emptyProducts", { message: "Sorry, no products found :(" })
    : res.render("viewProducts", {
        products: productsService.getAll(),
      });
});

//API routes
// show all products.
routerProducts.get("/", (req, res) => {
  productsService.getAll().length === 0
    ? res.json({ message: "empty products array!" })
    : res.send(productsService.getAll());
});

// show a product by id
routerProducts.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productById = productsService.getById(id);
  if (productById.length === 0) {
    res.json({
      message: "error: product not found.",
    });
  } else
    res.json({
      product: productById,
    });
});

// save a product in array of products
routerProducts.post("/", async (req, res) => {
  const productData = req.body;
  if (productData.title && productData.price && productData.thumbnail) {
    await productsService.save(productData);
    res.redirect("/");
  } else {
    res.json({
      message: "error: empty or incorrect entries.",
    });
  }
});

// update a product in array of products by id
routerProducts.put("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let product = req.body;
  if (productsService.getById(id).length === 0) {
    res.json({
      message:
        "error: the product could not be updated because it does not exist.",
    });
  } else {
    if (product.title && product.price && product.thumbnail) {
      productsService.deleteById(id);
      productsService.update(product, id);
      res.json({
        message: "product updated successfully!",
      });
    } else {
      res.json({
        message: "error: empty or incorrect entries.",
      });
    }
  }
});

// delete a product in array of products by id
routerProducts.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = productsService.getById(id);
  if (product.length === 0) {
    res.json({
      message:
        "error: the product could not be removed because it does not exist.",
    });
  } else {
    productsService.deleteById(id);
    res.json({
      message: "product removed successfully!",
    });
  }
});

// invalid paths
app.get("*", (req, res) => res.json({ message: "error: invalid path" }));
