const productsDao = require("../../database/daos/products.dao.factory");
const messagesDao = require("../../database/daos/messages.dao.factory");



class GraphQLResolvers{

    constructor(){
        this.db_products = productsDao.getDao();
        this.db_messages = messagesDao.getDao();
    }
    // Products
    getProducts = async () => {
        try {
            return await this.db_products.getAll()
        } catch (err) { console.log (err) }
    }
    createProduct =  async (data)=>{
        try {
            return {id:await this.db_products.save(data)}
        } catch (err) { console.log (err) }
        
    }
    editProduct= async (data)=>{
        try {
            return await this.db_products.update(data.id,data)
        } catch (err) { console.log (err) }
        
    }
    deleteProduct = async (data)=>{
        try {
            return await this.db_products.deleteById(data.id)
        } catch (err) { console.log (err) }
    }

    // Chat
    getMessages = async () => {
        try {
            return await this.db_messages.getAll()
        } catch (err) { console.log (err) }
    }
    createMessage =  async (data)=>{
        try {
            return {id:await this.db_messages.save(data)}
        } catch (err) { console.log (err) }
        
    }

}
module.exports = GraphQLResolvers