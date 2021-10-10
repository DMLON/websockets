const fs = require('fs');

class Container{
    constructor(filename,indentation = 4){
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
}



async function testContenedor(contenedor){
    try{
        let lastId = await contenedorProductos.save({
            "title": "Banana",                                                                                                                              
            "price": 500,
            "thumbnail": "https://imagenes.elpais.com/resizer/ASFQnPIFc0M2AkhF3UDX5jxb-R8=/414x0/cloudfront-eu-central-1.images.arcpublishing.com/prisa/HE3SMC3L7Z7XENXLHLLKE3CDEA.jpg"})
        console.log(lastId)
        
        const element = await contenedorProductos.getById(4);
        console.log(JSON.stringify(element,null,4));

        
        const elementsBeforeDelete = await contenedorProductos.getAll();

        await contenedorProductos.deleteById(5);
        await contenedorProductos.deleteAll();

        const elementsAfterDelete = await contenedorProductos.getAll();
        
        console.log("Before Deletion:");
        console.log(JSON.stringify(elementsBeforeDelete,null,4));
        console.log("After Deletion:");
        console.log(JSON.stringify(elementsAfterDelete,null,4));

        // Agrego 5 elementos más
        for (let index = 0; index < 5; index++) {
            lastId = await contenedorProductos.save({
                "title": "Banana",                                                                                                                              
                "price": 500,
                "thumbnail": "https://imagenes.elpais.com/resizer/ASFQnPIFc0M2AkhF3UDX5jxb-R8=/414x0/cloudfront-eu-central-1.images.arcpublishing.com/prisa/HE3SMC3L7Z7XENXLHLLKE3CDEA.jpg"})
        }
        console.log(lastId)


    }
    catch(error){
        console.error(error);
    }
}

function test_container(){
    const contenedorProductos = new Container('./products.json', 4);
    testContenedor(contenedorProductos);
}

exports.Container = Container;