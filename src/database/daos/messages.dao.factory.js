


// ------------- DB Config -------------
const { KnexDBConnector } = require("../connectors/knex/knex.connector");
const {FileSystemDBConnector} = require("../connectors/knex/filesystem.connector");
const config = require('../../config');
const MessagesDaoMysqlDb = require("./messages.dao.sqldb");
const { MessagesDAOMongoDB } = require("./messages.dao.mongodb");
const { MongoClient } = require("../connectors/knex/mongodb.connector");
const {MessagesDaoFilesystem} = require('./messages.dao.filesystem');
const {MessagesModel} = require('../models/messages.model.mongodb');
const { loggerErrors } = require("../../utils/loggers");
let dao;

switch (config.PERSISTENCE) {
    case 'SQLITE':
        try{
            //Try to get instance of the DB, in case it fails, means it needs a database object
            dao = MessagesDaoMysqlDb.getInstance();
        }
        catch(err){
            const SQLite3Options = require("../options/SQLite3");
            const database = new KnexDBConnector("messages", SQLite3Options.options);
            database.connect();
            dao = MessagesDaoMysqlDb.getInstance(database);
        }       
        break
    case 'MYSQL':
        try{
            //Try to get instance of the DB, in case it fails, means it needs a database object
            dao = MessagesDaoMysqlDb.getInstance();
        }
        catch(err){
            const MariaDBOptions = require("../options/mariaDB");
            const database = new KnexDBConnector("messages", MariaDBOptions.options);
            database.connect();
            dao = MessagesDaoMysqlDb.getInstance(database);
        }       
        break
    case 'MONGODB':
        try{
            //Try to get instance of the DB, in case it fails, means it needs a database object
            dao = MessagesDAOMongoDB.getInstance();
        }
        catch(err){
            const {DB_NAME,DB_CNXSTR,AUTHSOURCE} = config;
            
            const database = new MongoClient(DB_NAME, DB_CNXSTR, AUTHSOURCE);
            try{
                database.connect();

                dao = MessagesDAOMongoDB.getInstance(database,MessagesModel);
            }catch(err){
                loggerErrors.error(err);
            }
        }       
        break
    case 'FILESYSTEM':
        try{
            //Try to get instance of the DB, in case it fails, means it needs a database object
            dao = MessagesDaoFilesystem();
        }
        catch(err){
            const database = new FileSystemDBConnector("messages.json");
            dao = MessagesDaoFilesystem.getInstance(database);
        }       
        break
        
    default:
        try{
            //Try to get instance of the DB, in case it fails, means it needs a database object
            dao = MessagesDaoMysqlDb.getInstance();
        }
        catch(err){
            const SQLite3Options = require("../options/SQLite3");
            const database = new KnexDBConnector("messages", SQLite3Options.options);
            database.connect();
            dao = MessagesDaoMysqlDb.getInstance(database);
        }       
        break
}

function getDao() {
    return dao
}
module.exports ={
    getDao   
}