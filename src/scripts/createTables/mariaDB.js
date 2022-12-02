const { options } = require("../../config/databaseConfig");
const knex = require("knex");

const databaseMariadb = knex(options.mariaDB);

const createTables = async () => {
  try {
    let productsTable = await databaseMariadb.schema.hasTable("products");
    if (productsTable) {
      await databaseMariadb.schema.dropTable("products");
    }
    await databaseMariadb.schema.createTable("products", (table) => {
      table.increments("id");
      table.string("timestamp", 25).nullable(false);
      table.string("name", 40).nullable(false);
      table.string("description", 300).nullable(false);
      table.integer("code").nullable(false);
      table.string("thumbnail", 200).nullable(false);
      table.integer("price").nullable(false);
      table.integer("stock").nullable(false);
    });
    console.log("product table created in mariadb");
  } catch (error) {
    console.log(error);
  }
  databaseMariadb.destroy();
};
createTables();
