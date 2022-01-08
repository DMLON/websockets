const {MessagesDao} = require('./messages.dao.js');

let instance = null;

class MessagesDaoDb extends MessagesDao {

    constructor(database) {
        super();
        this.messages = database.knex();
        this.table = 'messages';
    }

    async save(object){
        try{
            const id = await this.messages
                .from(this.table)
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
            const obj = await this.messages
                .from(this.table)
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
            const objs = await this.messages
                .from(this.table)
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
            const objs = await this.messages
                .from(this.table)
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
            const objs = await this.messages
                .from(this.table)
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
            instance = new MessagesDaoDb(database);
        }
        return instance;
    }
}


module.exports = MessagesDaoDb;