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

// cart router config
const routerCart = express.Router();
app.use("/api/carrito", routerCart);

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

// cart service config
const CartService = require("./managers/cartService");
let cartService = new CartService("cart.txt");

// chat service config
const ChatContainer = require("./managers/chatService");
let chatService = new ChatContainer("chat-history.txt");

// websocket config
const { Server } = require("socket.io");
const io = new Server(server);

// websocket connection
io.on("connection", async (socket) => {
  // send products from backend to frontend
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

// admin permission
let admin = true;

// middleware permissions
const permissions = (req, res, next) => {
  if (admin === false) {
    res.send({
      error: "unauthorized",
      message: "unauthorized permissions for your account",
    });
    throw new Error("unauthorized permissions for your account");
  } else {
    next();
  }
};

// VIEWS routes
// form view
app.get("/", (req, res) => {
  res.render("formProducts");
});

//products view
app.get("/productos", async (req, res) => {
  const products = await productsService.getAll();
  products.length === 0 || products.message == "no file to read."
    ? res.render("emptyProducts", { message: "Sorry, no products found :(" })
    : res.render("viewProducts", {
        products: products,
      });
});

//API routes
// show all products
routerProducts.get("/", async (req, res) => {
  const items = await productsService.getAll();
  items.length === 0
    ? res.json({ message: "empty products array!" })
    : res.json(items);
});

// show a product by id
routerProducts.get("/:id", async (req, res) => {
  const id = req.params.id;
  const productById = await productsService.getById(id);
  productById.message === "error: no file to read." || productById.length === 0
    ? res.json({
        message: "error: product not found.",
      })
    : res.json({
        productById,
      });
});

// save a product in array of products
routerProducts.post("/", permissions, async (req, res) => {
  const productData = req.body;
  if (productsService.validationFields(productData) === true) {
    await productsService.save(productData);
    res.redirect("/");
  } else {
    res.json({
      message: "error: empty or incorrect entries.",
    });
  }
});

// update a product in array of products by id
routerProducts.put("/:id", permissions, async (req, res) => {
  let id = req.params.id;
  let product = req.body;
  const productById = await productsService.getById(id);
  if (productById.length == 0 || productById.message == "no file to read.") {
    res.json({
      message:
        "error: the product could not be updated because it does not exist.",
    });
  } else {
    if (productsService.validationFields(product) === true) {
      await productsService.deleteById(id);
      await productsService.update(product, id);
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
routerProducts.delete("/:id", permissions, async (req, res) => {
  const id = req.params.id;
  const productById = await productsService.getById(id);
  if (productById.length === 0 || productById.message === "no file to read.") {
    res.json({
      message:
        "error: the product could not be removed because it does not exist.",
    });
  } else {
    await productsService.deleteById(id);
    res.json({
      message: "product removed successfully!",
    });
  }
});

// cart routes
// create a cart and return its id
routerCart.post("/", async (req, res) => {
  const cart = await cartService.createCart();
  res.json({
    message: `add cart id: ${cart.id}`,
    content: cart,
  });
});

// delete cart
routerCart.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const cartById = await cartService.getById(id);
  if (cartById.length === 0 || cartById.message == "no file to read.") {
    res.json({
      message: "error: this cart not exist.",
    });
  } else {
    await cartService.deleteById(id);
    res.json({
      message: "cart removed successfully!",
    });
  }
});

// show all cart products
routerCart.get("/:id/productos", async (req, res) => {
  const id = parseInt(req.params.id);
  const cartById = await cartService.getById(id);
  if (cartById.length === 0 || cartById.message === "no file to read.") {
    res.json({
      message: "error: this cart not exist.",
    });
  } else {
    res.json({
      products: cartById[0].products,
    });
  }
});

// add product to cart according to its id
routerCart.post("/:id/productos", async (req, res) => {
  const cartId = parseInt(req.params.id);
  const cartById = await cartService.getById(cartId);
  // cart not exist case
  if (cartById.length === 0 || cartById.message == "no file to read.") {
    res.json({
      message: "error: this cart not exist.",
    });
  } else {
    // cart exist case
    const productId = req.body.id;
    const productById = await productsService.getById(productId);
    // product to add not exist case
    if (productById.length === 0) {
      res.json({
        message: "error: product not found.",
      });
    } else {
      // product exist case
      await cartService.deleteById(cartId);
      await cartService.addProduct(cartById, productById[0].id);
      res.json({
        message: "product added successfully!",
        product: productById[0].id,
      });
    }
  }
});

// remove a product from the cart according to its id
routerCart.delete("/:id/productos/:id_prod", async (req, res) => {
  const cartId = parseInt(req.params.id);
  const cartById = await cartService.getById(cartId);
  // cart not exist case
  if (cartById.length === 0 || cartById.message == "no file to read.") {
    res.json({
      message: "error: this cart not exist.",
    });
  } else {
    // cart exist case
    const productId = req.params.id_prod;
    const checkProduct = cartById[0].products.includes(productId);
    // product in cart not exist case
    if (checkProduct == false) {
      res.json({
        message: "error: the cart does not have that product.",
      });
    } else {
      // product in cart exist case
      await cartService.deleteById(cartId);
      await cartService.deleteProduct(cartById, productId);
      res.json({
        message: "product successfully removed!",
      });
    }
  }
});

// invalid paths
app.get("*", (req, res) => res.json({ message: "error: invalid path" }));
