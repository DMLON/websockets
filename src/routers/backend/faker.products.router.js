const express = require("express");
const router_faker = express.Router();
const faker = require("faker");

const {loggerWarnings,loggerErrors ,loggerDefault } = require('../../utils/loggers');

const getRandomProducts = (amount=5)=>{
    const products = [];
    for (let i = 0; i < amount; i++) {
        products.push({
            title: faker.commerce.productName(),
            price: Math.round(Math.random() * 1000),
            thumbnail: faker.image.food(50, 50),
        });
    }
    return products;
}

//------------Entrega desafio Faker------------
router_faker.get("/", async (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /api/products-test`);
    res.send(getRandomProducts());
});
//------------Entrega desafio Faker------------


module.exports = {router_faker, getRandomProducts};