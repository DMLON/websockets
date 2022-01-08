


// ------------- DB Config -------------
const { KnexDBConnector } = require("../connectors/knex/knex.connector");
const config = require('../../config');
const MessagesDaoDb = require("./messages.dao.db");

let dao;

switch (config.PERSISTENCE) {
    case 'SQLITE':
        try{
            //Try to get instance of the DB, in case it fails, means it needs a database object
            dao = MessagesDaoDb.getInstance();
        }
        catch(err){
            const SQLite3Options = require("../options/SQLite3");
            const database = new KnexDBConnector("messages", SQLite3Options.options);
            database.connect();
            dao = MessagesDaoDb.getInstance(database);
        }       
        break
    case 'MYSQL':
        try{
            //Try to get instance of the DB, in case it fails, means it needs a database object
            dao = MessagesDaoDb.getInstance();
        }
        catch(err){
            const MariaDBOptions = require("../options/mariaDB");
            const database = new KnexDBConnector("messages", MariaDBOptions.options);
            database.connect();
            dao = MessagesDaoDb.getInstance(database);
        }       
        break
    default:
        try{
            //Try to get instance of the DB, in case it fails, means it needs a database object
            dao = MessagesDaoDb.getInstance();
        }
        catch(err){
            const SQLite3Options = require("../options/SQLite3");
            const database = new KnexDBConnector("messages", SQLite3Options.options);
            database.connect();
            dao = MessagesDaoDb.getInstance(database);
        }       
        break
}

function getDao() {
    return dao
}
module.exports ={
    getDao   
}