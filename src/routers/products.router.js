const express = require("express");
const router = express.Router();
const passportToStandardUser = require("../middlewares/passportToStandard");
const { getproducts,newProduct } = require("../controllers/products.controller");

router.get("/", passportToStandardUser, getproducts);

router.post("/", passportToStandardUser, newProduct);

module.exports = {
    router_products: router,
};
