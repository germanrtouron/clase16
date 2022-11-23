const fs = require("fs");
const path = require("path");
const files = path.join(__dirname, "../files");

// cart constructor
class Cart {
  constructor() {
    this.id = this.idGenerator();
    this.timestamp = Date.now();
    this.products = [];
  }

  idGenerator(uniqueId) {
    let id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    id = parseInt(id);
    return uniqueId ? uniqueId + id : id;
  }
}

class CartService {
  constructor(fileName) {
    this.file = `${files}/${fileName}`;
  }

  async getAll() {
    try {
      if (!fs.existsSync(this.file)) {
        return "";
      }
      const fileContent = await fs.promises.readFile(this.file, "utf-8");
      if (fileContent.length > 0) {
        const fileContentJSON = JSON.parse(fileContent);
        return fileContentJSON;
      } else {
        return [];
      }
    } catch (error) {
      return Error("error in function: cartservice.js: getAll.");
    }
  }

  async getById(id) {
    try {
      if (!fs.existsSync(this.file)) {
        return { message: "no file to read." };
      }
      const fileContentJSON = await this.getAll();
      if (fileContentJSON.length > 0) {
        const cartById = fileContentJSON.filter((x) => x.id === id);
        return cartById;
      }
      return { message: "no file to read." };
    } catch (error) {
      return Error("error in function: cartservice.js: getById");
    }
  }

  async createCart() {
    try {
      const cart = new Cart();
      if (!fs.existsSync(this.file)) {
        this.fsWriteFile([cart]);
        return cart;
      }
      const carts = await this.getAll();
      if (carts.length === 0) {
        this.fsWriteFile([cart]);
        return cart;
      }
      carts.push(cart);
      this.fsWriteFile(carts);
      return cart;
    } catch (error) {
      return Error("error in function: cartservice.js: createCart.");
    }
  }

  async deleteById(id) {
    try {
      if (!fs.existsSync(this.file)) {
        return { message: "no file to read." };
      }
      const fileContentJSON = await this.getAll();
      const newCarts = fileContentJSON.filter((x) => x.id != id);
      this.fsWriteFile(newCarts);
    } catch (error) {
      return Error("error in function: cartservice.js: delete by id.");
    }
  }

  async addProduct(cart, productId) {
    try {
      if (!fs.existsSync(this.file)) {
        return { message: "no file to read." };
      }
      const carts = await this.getAll();
      const newCart = cart[0];
      newCart.products.push(productId);
      carts.push(newCart);
      this.fsWriteFile(carts);
    } catch (error) {
      return Error("error in function: cartservice: add product.");
    }
  }

  async deleteProduct(cart, productId) {
    try {
      if (!fs.existsSync(this.file)) {
        return { message: "no file to read." };
      }
      const carts = await this.getAll();
      const newCartProducts = cart[0].products.filter((x) => x != productId);
      const newCart = cart[0];
      newCart.products = newCartProducts;
      carts.push(newCart);
      this.fsWriteFile(carts);
    } catch (error) {
      return Error("error in function: cartservice: delete product.");
    }
  }

  async fsWriteFile(data) {
    await fs.promises.writeFile(this.file, JSON.stringify(data, null, 2));
  }

  idGenerator(uniqueId) {
    let id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    id = parseInt(id);
    return uniqueId ? uniqueId + id : id;
  }
}

module.exports = CartService;
