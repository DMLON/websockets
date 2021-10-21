// ------------- DB Config -------------
const { DBConnector } = require("./connector");
const MariaDBOptions = require("./options/mariaDB");
const SQLite3Options = require("./options/SQLite3");

const db_products = new DBConnector("products", MariaDBOptions.options);
const db_messages = new DBConnector("messages", SQLite3Options.options);
const db_users = new DBConnector("users", SQLite3Options.options);
// ------------- End DB Config -------------

module.exports = {
    db_products,
    db_messages,
    db_users
}