const knex = require("knex");

class Product {
  constructor(data) {
    this.timestamp = Date.now();
    this.name = data.name;
    this.description = data.description;
    this.code = data.code;
    this.thumbnail = data.thumbnail;
    this.price = data.price;
    this.stock = data.stock;
  }
}

class ProductsMySqlService {
  constructor(options, tableName) {
    this.database = knex(options);
    this.table = tableName;
  }

  async save(productData) {
    try {
      const product = new Product(productData);
      const [id] = await this.database.from(this.table).insert(product);
      return `save successfully with id ${id}`;
    } catch (error) {
      return `error: ${error}`;
    }
  }

  async getAll() {
    try {
      const response = await this.database.from(this.table).select("*");
      return response;
    } catch (error) {
      return `error: ${error}`;
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
}

module.exports = { ProductsMySqlService };
