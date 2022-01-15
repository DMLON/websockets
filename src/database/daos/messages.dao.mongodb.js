const { loggerErrors } = require('../../utils/loggers.js');
const {MessagesDao} = require('./messages.dao.js');

let instance = null;
class MessagesDAOMongoDB extends MessagesDao {
    constructor(db,model) {
        super();
        this.db = db;
        this.model = model;
    }

    async getAll() {
        try {
        return await this.model.find({});
        } catch (err) { loggerErrors.error(err) }
    }


    async deleteAll() {
        try {
            await this.model.deleteMany()
        } catch (error) {
            throw new Error({status:500, messages:`error al borrar a todos los productos`, error})
        }
    }

    async getById(idBuscado) {
        let buscado;
        try {
            buscado = await this.model.findOne({ _id: idBuscado })
        } catch (err) {
            throw new Error({status:500, message:'error al buscar producto por dni ' + err})
        }

        if (!buscado) {
            throw new Error({status:404, message:`producto no encontrado con ese ID: ${idBuscado}` })
        }

        return buscado
    }

    async save(message) {
        try {
            return await this.model.create(message)
        } catch (error) {
            throw new Error({status:500, message:'error al crear un nuevo producto' + error})
        }
    }

    async deleteById(idParaBorrar) {
        let result
        try {
            result = await productos.deleteOne({ _id: idParaBorrar })
        } catch (error) {
            throw new Error({status:500, message:`error al borrar producto ` + error})
        }

        if (result.deletedCount == 0) {
            throw new Error({status:404, message:`no existe un producto para borrar con id: ${idParaBorrar}`})
        }
    }

    static getInstance(database,model){
        if(!instance){
            if(!database)
                throw new Error('Database and model is required');
            instance = new MessagesDAOMongoDB(database,model);
        }
        return instance;
    }

}

module.exports = { MessagesDAOMongoDB }
