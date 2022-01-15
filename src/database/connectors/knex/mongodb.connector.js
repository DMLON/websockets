const {loggerWarnings,loggerErrors ,loggerDefault } = require('../../../utils/loggers');
const {DbClient} = require('../base/DbClient');
const mongoose = require('mongoose');

class MongoClient extends DbClient {
    constructor(db_name,db_cnxStr,db_authSource) {
        super()
        this.connected = false
        this.client = mongoose
        this.db_name = db_name;
        this.db_cnxStr = db_cnxStr;
        this.db_authSource = db_authSource
    }

    async connect() {
        try {
            await this.client.connect(this.db_cnxStr + this.db_name+"?"+this.db_authSource)
            loggerDefault.info('base de datos conectada')
            this.connected = true
        } catch (error) {
            throw new Error({status:500, message:'error al conectarse a mongodb '+error})
        }
    }

    async disconnect() {
        try {
            await this.client.connection.close()
            loggerDefault.info('base de datos desconectada')
            this.connected = false
        } catch (error) {
            throw new Error({status:500, message:'error al desconectarse de mongodb '+error})
        }
    }
}

module.exports = {MongoClient}