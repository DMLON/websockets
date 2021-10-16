module.exports = function ( db_products) {
    const express = require("express");
    const router = express.Router();
    const {getRandomProducts} = require("./faker.products.router")
    
    let products = getRandomProducts();

    router.get("/", async (req, res) => {
        const ip = req.clientIp;
        console.log(`[${ip}] - GET /products`);
        const {loggedIn,user} = req.session
        if(!loggedIn) {
            res.render("productsShow.pug",{loggedIn,products:[]});
            return;
        }
        
        res.render("productsShow.pug",{loggedIn,username:user?.username,products});
    });

    router.post("/", async (req, res) => {
        const ip = req.clientIp;
        console.log(`[${ip}] - POST /products`);

        const {loggedIn} = req.session
        if(!loggedIn) {
            res.send({error:true,status:"You are not logged in!"});
            return;
        }

        // If user is logged in, get product from body and add it
        const product = req.body;
        products.push(product);
        
        res.send({error:false,status:"ok"});
    });

    return router;
};
