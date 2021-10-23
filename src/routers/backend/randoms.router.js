const express = require("express");
const router_randoms = express.Router();
const {fork} = require("child_process");

router_randoms.get("/", (req, res) => {
    let { cant } = req.query;
    cant = Number(cant);
    // Checking if cant is a number
    if (!Number.isInteger(cant)) {
        cant = 1e8;
    }

    //generate a fork that calls the random function
    const randomFork = fork("./src/utils/random.generator.js");
    randomFork.on("message", (respuestaChild) => {
        if (respuestaChild == "ready") {
            randomFork.send(cant);
        } else {
            const resultadoJson = JSON.stringify(respuestaChild);
            res.status(200).end(resultadoJson);
        }
    });
});

// export the router
module.exports = router_randoms;
