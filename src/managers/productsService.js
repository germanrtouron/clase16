const fs = require("fs");
const path = require("path");
const files = path.join(__dirname, "../files");

class Product {
  constructor(data) {
    this.id = this.idGenerator();
    this.timestamp = Date.now();
    this.name = data.name;
    this.description = data.description;
    this.code = data.code;
    this.thumbnail = data.thumbnail;
    this.price = data.price;
    this.stock = data.stock;
  }

  idGenerator() {
    let d = new Date().getTime();
    let idRandom = "xxxxxx4yxxx".replace(/[xy]/g, (c) => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return idRandom;
  }
}

class Container {
  constructor(fileName) {
    this.file = `${files}/${fileName}`;
  }

  async save(productData) {
    try {
      const product = new Product(productData);
      if (!fs.existsSync(this.file)) {
        this.fsWriteFile([product]);
        return;
      }
      const fileContent = await this.getAll();
      if (fileContent.length === 0) {
        this.fsWriteFile([product]);
        return;
      }
      fileContent.push(product);
      this.fsWriteFile(fileContent);
    } catch (error) {
      return Error("error in function: productsService.js: save.");
    }
  }

  async getAll() {
    try {
      if (!fs.existsSync(this.file)) {
        return { message: "no file to read." };
      }
      const fileContent = await fs.promises.readFile(this.file, "utf-8");
      if (fileContent.length === 0) {
        return [];
      }
      const fileContentJSON = JSON.parse(fileContent);
      return fileContentJSON;
    } catch (error) {
      return Error("error in function: productsService.js: getAll.");
    }
  }

  async getById(id) {
    try {
      if (!fs.existsSync(this.file)) {
        return { message: "error: no file to read." };
      }
      const fileContentJSON = await this.getAll();
      if (fileContentJSON.length === 0) {
        return "";
      }
      const productById = fileContentJSON.filter((x) => x.id === id);
      return productById;
    } catch (error) {
      return Error("error in function: productsService.js: getById.");
    }
  }

  async deleteById(id) {
    try {
      if (!fs.existsSync(this.file)) {
        return { message: "no file to read." };
      }
      const fileContentJSON = await this.getAll();
      const newProducts = fileContentJSON.filter((x) => x.id != id);
      this.fsWriteFile(newProducts);
    } catch {
      return Error("error in function: delete by id.");
    }
  }

  async update(product, id) {
    try {
      if (!fs.existsSync(this.file)) {
        return { message: "no file to read." };
      }
      const fileContentJSON = await this.getAll();
      fileContentJSON.push({ id: id, ...product });
      fileContentJSON.sort((a, b) => a.id - b.id);
      this.fsWriteFile(fileContentJSON);
    } catch {
      return Error("error in function: update.");
    }
  }

  validationFields(data) {
    if (
      data.name &&
      data.description &&
      data.code &&
      data.thumbnail &&
      data.price &&
      data.stock &&
      Object.keys(data).length === 6
    ) {
      return true;
    } else {
      return false;
    }
  }

  async fsWriteFile(data) {
    await fs.promises.writeFile(this.file, JSON.stringify(data, null, 2));
  }
}

module.exports = Container;
