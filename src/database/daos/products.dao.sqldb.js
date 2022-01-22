const {ProductsDao} = require('./products.dao.js');
const {ProductModel}= require('../models/product.model');
const { ProductDto } = require('../dtos/products.dto.js');
const { loggerErrors } = require('../../utils/loggers');

let instance = null;

class ProductsDaoDb extends ProductsDao {

    constructor(database) {
        super()
        this.products = database.knex;
        this.table = 'products';
    }

    async save(object){
        try{
            const product = new ProductModel(object);
            const id = await this.products(this.table)
                .insert(object)
            return id[0];
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async update(id,object){
        try{
            const product = new ProductModel(object);
            const rows = await this.products(this.table)
                .where({id:id})
                .update(object)
            const prod = await this.getById(id)
            return prod;
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async getById(id){
        try{
            const obj = await this.products(this.table)
                .select('*')
                .where({id:id})
            if(obj.length == 0)
                return null;
            const product = new ProductDto(obj[0]);
            return product;
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async getAll(){
        try{
            const objs = await this.products(this.table)
                .select('*');
            if(objs.length == 0)
                return [];
            const products = objs.map(obj => new ProductDto(obj));
            return products;
            }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async deleteById(id){
        try{
            const objs = await this.products(this.table)
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
            const objs = await this.products(this.table)
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
            instance = new ProductsDaoDb(database);
        }
        return instance;
    }

}


module.exports = ProductsDaoDb;
