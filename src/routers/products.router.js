const express = require("express");
const router = express.Router();
const { getRandomProducts } = require("./backend/faker.products.router");
const passportToStandardUser = require("../middlewares/passportToStandard");
const { db_products } = require("../database/databases");
const {loggerWarnings,loggerErrors ,loggerDefault } = require('../utils/loggers');
const { getproducts,newProduct } = require("../controllers/products.controller");

let products = getRandomProducts();

router.get("/", passportToStandardUser, getproducts);

router.post("/", passportToStandardUser, newProduct);

module.exports = {
    router_products: router,
};
