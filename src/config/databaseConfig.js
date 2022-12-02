const path = require("path");

const options = {
  mariaDB: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "2105",
      database: "coderproject",
    },
  },
  sqliteDB: {
    client: "sqlite",
    connection: {
      filename: path.join(__dirname, "../databases/chatdb.sqlite"),
    },
    useNullAsDefault: true,
  },
};

module.exports = { options };
