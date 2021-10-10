module.exports = function (io) {
    const express = require("express");
    const router = express.Router();

    io.on("connection", function(socket) {
        // Accept a login event with user's data
        socket.on("login", function(userdata) {
            socket.request.session.loggedIn = true;
            socket.request.session.username = userdata.username
            socket.request.session.save();
            console.log(socket.request.session);
        });
        socket.on("logout", function(userdata) {
            // Eliminar la sesion tal vez?
            socket.request.session.loggedIn = false;
            socket.request.session.username = null;
            socket.request.session.save();
        });        
    });

    router.get("/login",(req,res)=>{
        console.log("GET /auth/login");
        res.render("login.pug");
    });

    router.get("/logout",(req,res)=>{
        console.log("GET /auth/logout");
        res.render("logout.pug");
    });

    return router;
}

