


const generateRandomNumbers = (req, res) => {
    let { cant } = req.query;
    cant = Number(cant);
    // Checking if cant is a number
    if (!Number.isInteger(cant)) {
        cant = 1e8;
    }
    console.log("GET /api/randoms")
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
}

module.exports = {
    generateRandomNumbers
}