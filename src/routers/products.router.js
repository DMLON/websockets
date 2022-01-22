const express = require("express");
const router = express.Router();
const passportToStandardUser = require("../middlewares/passportToStandard");
const { getproducts,newProduct,deleteProduct,editProduct } = require("../controllers/products.controller");

router.get("/", passportToStandardUser, getproducts);

router.post("/", passportToStandardUser, newProduct);

router.delete("/:id", passportToStandardUser, deleteProduct);

router.put("/:id", passportToStandardUser, editProduct);
module.exports = {
    router_products: router,
};
