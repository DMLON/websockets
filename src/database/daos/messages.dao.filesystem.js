const fs = require('fs');
const {MessagesDao} = require('./messages.dao.js');


let instance = null;
class MessagesDaoFilesystem extends MessagesDao{
    constructor(filename,indentation = 4){
        super()
        this.filename = filename;
        this.indentation = indentation;
    }

    async _getLastId(content=null){
        if (content == null){
            content = await this.getAll();
        }
        let lastId = 0
        if (content.length > 0){
            const ids = content.map(x=>x.id);
            lastId = Math.max(...ids);
        }
        return lastId;
    }

    async save(object){
        try{
            const content = await this.getAll();
            const lastId = await this._getLastId(content);
            let update = false;
            let idx = lastId;
            // If has id, means it's an update
            if(object.id != undefined){
                //update
                idx = content.findIndex(el=>el.id==object.id);
                content[idx] = object;
                update = true;
            }
            else{
                object.id = lastId + 1;
                content.push(object);
            }
            try{
                await fs.promises.writeFile(this.filename,JSON.stringify(content,null,this.indentation),"utf-8");
            }
            catch(error){
                throw `Error when writing to file: ${error}`;
            }
            
            if(update)
                return idx;
            else
                return lastId + 1;
        }
        catch(error){
            throw `Error while saving elements: ${error}`;
        }
    }

    async getById(id){
        try{
            const content = await this.getAll();
            return content.filter(el => el.id == id);
        }
        catch(error){
            throw `Error while getting all elements: ${error}`;
        }
    }

    async getAll(){
        try{
            const content = await fs.promises.readFile(this.filename,'utf-8');
            try{
                const objets =  JSON.parse(content);
                return objets;
            }
            catch(parseError){
                //En caso de que el archivo esté vacio agarro ese error y retorno simplemente un array vacio
                return [];
            }
        }
        catch(error){
            throw `Error while reading file: ${error}`;
        }
    }

    async deleteById(id){
        try{
            let content = await this.getAll();
            const idx = content.findIndex(el=>el.id==id);

            //En caso que de -1 es que no existe el item
            if (idx < 0){
                throw `Item with id ${id} not found`;
            }
            
            const contentWithoutElement = content.filter(el=>el.id!=id)

            try{
                await fs.promises.writeFile(this.filename,JSON.stringify(contentWithoutElement,null,this.indentation),"utf-8");
            }
            catch(error){
                throw `Error when writing to file: ${error}`;
            }
        }
        catch(error){
            throw `Error while getting all elements: ${error}`;
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(this.filename,"[]","utf-8");
        }
        catch(error){
            throw `Error when writing to file: ${error}`;
        }
    }

    static getInstance(database){
        if(!instance){
            if(!database)
                throw new Error('Database is required');
            instance = new MessagesDaoFilesystem(database);
        }
        return instance;
    }
}


module.exports = {MessagesDaoFilesystem};