const { options } = require("../../config/databaseConfig");
const knex = require("knex");

const databaseSqlite = knex(options.sqliteDB);

const createTables = async () => {
  try {
    let chatTable = await databaseSqlite.schema.hasTable("chat");
    if (chatTable) {
      await databaseSqlite.schema.dropTable("chat");
    }
    await databaseSqlite.schema.createTable("chat", (table) => {
      table.increments("id");
      table.string("user", 30);
      table.string("date", 30);
      table.string("message", 250);
    });
    console.log("product table created in sqlite");
  } catch (error) {
    console.log(error);
  }
  databaseSqlite.destroy();
};
createTables();
