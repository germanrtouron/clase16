const fs = require("fs");
const path = require("path");
const files = path.join(__dirname, "../files");

class Container {
  static arrayOfProducts = []; // array of products.
  static countId = 0; // id counter for products id's.

  constructor(fileName) {
    this.file = `${files}/${fileName}`;
  }

  async save(product) {
    try {
      if (fs.existsSync(this.file)) {
        const fileContent = await this.getAll();
        if (fileContent.length > 0) {
          Container.countId=fileContent.length+1;
          fileContent.push({ id: Container.countId, ...product });
          await fs.promises.writeFile(
            this.file,
            JSON.stringify(fileContent, null, 2)
          );
        } else {
          Container.countId++;
          Container.arrayOfProducts.push({ id: Container.countId, ...product });
          await fs.promises.writeFile(
            this.file,
            JSON.stringify(Container.arrayOfProducts, null, 2)
          );
        }
      } else {
        Container.countId++;
        Container.arrayOfProducts.push({ id: Container.countId, ...product });
        await fs.promises.writeFile(
          this.file,
          JSON.stringify([{ id: Container.countId, ...product }], null, 2)
        );
      }
    } catch {
      return Error("error in function: save.");
    }
  }

  async getAll() {
    try {
      const fileContent = await fs.promises.readFile(this.file, "utf-8");
      if (fileContent.length > 0) {
        const fileContentJSON = JSON.parse(fileContent);
        return fileContentJSON;
        //return Container.arrayOfProducts;
      } else {
        return [];
      }
    } catch (error) {
      return Error("error in function: get all.");
    }
  }

  getById(id) {
    try {
      const product = Container.arrayOfProducts.filter((x) => x.id === id);
      return product;
    } catch {
      return Error("error in function: get by id.");
    }
  }

  deleteById(id) {
    try {
      const newProducts = Container.arrayOfProducts.filter((x) => x.id != id);
      Container.arrayOfProducts = newProducts;
    } catch {
      return Error("error in function: delete by id.");
    }
  }

  update(product, id) {
    try {
      Container.arrayOfProducts.push({ id: id, ...product });
    } catch {
      return Error("error in function: update.");
    }
  }
}

module.exports = Container;
