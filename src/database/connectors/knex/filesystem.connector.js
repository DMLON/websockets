const {loggerWarnings,loggerErrors ,loggerDefault } = require('../../../utils/loggers');
const {DbClient} = require('../base/DbClient');
class FileSystemDBConnector extends DbClient{
    constructor(filepath){
        super();
        this.filepath = filepath
    }

    async connect(){
        
    }

    async disconnect(){
        
    }
}

module.exports = {FileSystemDBConnector}