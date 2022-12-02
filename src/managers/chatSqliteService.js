const knex = require("knex");

class ChatSqliteService {
  constructor(options, tableName) {
    this.database = knex(options);
    this.table = tableName;
  }

  async save(data) {
    try {
      const [id] = await this.database.from(this.table).insert(data);
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
}

module.exports = { ChatSqliteService };
