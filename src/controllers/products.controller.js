const {getDao} = require("../database/daos/products.dao.factory")
const db_products = getDao();

const {loggerWarnings,loggerErrors ,loggerDefault } = require('../utils/loggers');
// const { getRandomProducts } = require("./backend/faker.products.router");

// let products = getRandomProducts();

const getproducts =async (req,res)=>{
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /products`);
    const { loggedIn, user } = req.session;
    console.log(loggedIn)

    if (!loggedIn) {
        loggerErrors.error(`[${ip}] - GET /products - User not logged in`);
        res.render("productsShow.pug", { loggedIn, products: [] });
        return;
    }
    let products = [];
    try{
        products = await db_products.getAll();
    }
    catch(error){
        loggerErrors.error(`[${ip}] - GET /products - DB error`);
    }
    // products = await getproductsApi(req,res);
    res.render("productsShow.pug", { loggedIn, username: user?.username, products });

}

const getproductsApi = async (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /products`);
    
    const { loggedIn, user } = req.session;
    loggerDefault.info(user)
    if (!loggedIn) {
        loggerErrors.error(`[${ip}] - GET /api/products - User not logged in`);
        res.send({ error: true, status: "You are not logged in!" });
        return;
    }
    let products = [];
    try{
        products = await db_products.getAll();
        res.send({ error: false, status: "ok", products });
    }
    catch(error){
        loggerErrors.error(`[${ip}] - GET /api/products - DB error`);
        res.send({ error: true, status: "DB error" });
    }
    
}


const newProduct = async (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - POST /products`);

    const { loggedIn } = req.session;
    if (!loggedIn) {
        loggerErrors.error(`[${ip}] - POST /products - Not logged in`);
        res.send({ error: true, status: "You are not logged in!" });
        return;
    }

    // If user is logged in, get product from body and add it
    const product = req.body;
    try{
        await db_products.save(product);
    }
    catch(error){
        loggerErrors.error(`[${ip}] - POST /products - DB error`);
        res.send({ error: true, status: "DB error" });
        return;
    }
    res.send({ error: false, status: "ok" });
}

module.exports = {
    getproducts,newProduct,getproductsApi
}