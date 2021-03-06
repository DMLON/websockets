const {MessagesDao} = require('./messages.dao.js');

let instance = null;

// No instancia DTO ni Model ya que se encarga el repository
class MessagesDaoMysqlDb extends MessagesDao {

    constructor(database) {
        super();
        this.messages = database.knex;
        this.table = 'messages';
    }

    async save({object}){
        try{
            const id = await this.messages(this.table)
                .insert(object)
            return id[0];
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async getById(id){
        try{
            const obj = await this.messages(this.table)
                .select('*')
                .where({id:id})
            if(obj.length == 0)
                return null;
            return obj[0];
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async getAll(){
        try{
            const objs = await this.messages(this.table)
                .select('*');
            if(objs.length == 0)
                return [];
            return objs;

        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async deleteById(id){
        try{
            const objs = await this.messages(this.table)
                .where({ id: id })
                .del()
            return objs;
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async deleteAll(){
        try{
            const objs = await this.messages(this.table)
                .del()
            return objs;
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    static getInstance(database){
        if(!instance){
            if(!database)
                throw new Error('Database is required');
            instance = new MessagesDaoMysqlDb(database);
        }
        return instance;
    }
}


module.exports = MessagesDaoMysqlDb;