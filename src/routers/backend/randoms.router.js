const express = require("express");
const router_randoms = express.Router();
const {fork} = require("child_process");
const { generateRandomNumbers } = require("../../controllers/backend/random.controller");

router_randoms.get("/", generateRandomNumbers);

// export the router
module.exports = router_randoms;
