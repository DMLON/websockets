
const {loggerWarnings,loggerErrors ,loggerDefault } = require('../../../utils/loggers');
const {DbClient} = require('../base/DbClient');
class KnexDBConnector extends DbClient{
    constructor(table,config){
        super();
        this.config = config
        this.table = table;
        this.knex=null;
    }

    async connect(){
        this.knex = require('knex')(this.config);
        try{
            const res = await this.knex.raw("SELECT 1")
            loggerDefault.info("Knex DB connected");
        }
        catch(err){
            loggerErrors.error("Knex DB not connected");
            throw err;
        }
    }

    async disconnect(){
        this.knex.destroy();
    }
}



exports.KnexDBConnector = KnexDBConnector;