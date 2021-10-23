const express = require("express");
const router_api = express.Router();

const {router_faker} = require("./faker.products.router");
const router_randoms = require("./randoms.router");

router_api.use("/products-test", router_faker);

router_api.use("/randoms", router_randoms);

module.exports = router_api;