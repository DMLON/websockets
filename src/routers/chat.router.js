module.exports = function (io,db_messages) {
    const express = require("express");
    const router = express.Router();

    router.get("/", async (req, res) => {
        const ip = req.clientIp;
        console.log(`[${ip}] - GET /chat`);
        const loggedIn = req.session.loggedIn;

        if(!loggedIn){
            res.render("chat.pug",{loggedIn});
            return;
        }
        const user = req.session.user;
        //Normalmente renderaria los primeros N mensajes y a medida que se scrolle obteneria más
        const messages = await db_messages.getAll();
        res.render("chat.pug",{loggedIn,user,messages});
        
    });

    router.post("/", async (req, res) => {
        const ip = req.clientIp;
        console.log(`[${ip}] - POST /chat`);
        if(!loggedIn){
            res.send({error:true,status:"You are not logged in!"});
            return;
        }
        try {
            const user = req.session.user;
            const id = await db_messages.save({ ...message, name: user.name, profilePhoto: user.profilePhoto, email: user.email }); //     // console.log('POST /products');
        } catch (error) {
            console.log(error);
        }
        //Normalmente renderaria los primeros N mensajes y a medida que se scrolle obteneria más
        const messages = await db_messages.getAll();
        res.render("chat.pug",{loggedIn,user,messages});
    });

    return router;
};
