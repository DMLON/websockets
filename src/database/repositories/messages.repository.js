const { loggerErrors } = require("../../utils/loggers");

const {MessageDto} = require("../dtos/messages.dto");
const {MessageModel} = require("../models/messages.model");
const { getDao } = require('../daos/messages.dao.factory')

class MessagesRepository {

    constructor() {
        this.dao = getDao()
    }

    async getAll() {
        try{
            const dtos = await this.dao.getAll({});
            return dtos.map(dto => new MessageDto(dto));
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async getById(id) {
        
        try{
            const dto = await this.dao.getById(id);
            if(dto == null)
                return null;
            return new MessageDto(dto)
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
        
    }

    async save(prod) {
        const dto = new MessageDto(prod)
        try{
            return await this.dao.save(dto)
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async removeById(idProd) {
        try{
            const dto = await this.dao.deleteById(idProd)
            return new MessageDto(dto)
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }
}

module.exports = {MessagesRepository}