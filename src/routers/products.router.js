module.exports = function (io, db_products) {
    const express = require("express");
    const router = express.Router();
    const axios = require('axios');
    io.on("connection", async (socket) => {
        console.log("Client connected - Products");

        //------------Entrega desafio Faker------------
        let products = [];
        try {
            const res = await axios.get("http://localhost:8080/api/products-test");
            products = res.data;
        } catch (err) {
            console.log("Unable to get product list", err);
        }
        //------------Entrega desafio Faker------------

        // socket.emit envia unicamente al usuario que hace connection
        socket.emit("products", products);

        // Agrego un event listener para cuando haya un nuevo producto
        // Esto se emite desde el cliente
        socket.on("newProduct", async (product) => {
            try {
                const id = await db_products.save(product); //     // console.log('POST /products');
            } catch (error) {
                console.log(error);
            }
            // io.emit envia broadcast a todos los usuarios
            const products = await db_products.getAll();
            io.emit("products", products);
        });
    });

    router.get("/", async (req, res) => {
        console.log("GET /products");
        res.render("productsShow.pug");
    });

    return router;
};
