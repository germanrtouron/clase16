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
      if (response.length === 0) {
        return [];
      }
      return response;
    } catch (error) {
      return Error(error);
    }
  }

  async getById(id) {
    try {
      id = parseInt(id);
      const products = await this.getAll();
      if (products.length === 0) {
        return "";
      }
      const productById = products.filter((x) => x.id === id);
      return productById;
    } catch (error) {
      return Error(error);
    }
  }

  async deleteById(id) {
    try {
      id = parseInt(id);
      const response = await this.database
        .from(this.table)
        .delete()
        .where({ id: id });
      return response;
    } catch (error) {
      return Error(error);
    }
  }

  async update(product, id) {
    try {
      id = parseInt(id);
      const response = await this.database
        .from(this.table)
        .where({ id: id })
        .update({
          name: product.name,
          description: product.description,
          code: product.code,
          thumbnail: product.thumbnail,
          price: product.price,
          stock: product.stock,
        });
      return response;
    } catch (error) {
      return Error(error);
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
