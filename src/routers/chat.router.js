module.exports = function (db_messages) {
    const express = require("express");
    const router = express.Router();

    function formatDate(date) {
        date_temp = new Date(date);
        hours = date_temp.getHours();
        minutes = date_temp.getMinutes();
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }

    router.get("/", async (req, res) => {
        const ip = req.clientIp;
        console.log(`[${ip}] - GET /chat`);
        const loggedIn = req.session.loggedIn;

        if(!loggedIn){
            res.redirect("/");
            return;
        }

        const user = req.session.user;
        //Normalmente renderaria los primeros N mensajes y a medida que se scrolle obteneria más
        const messages = await db_messages.getAll();
        res.render("chat.pug",{loggedIn,user,messages,formatDate});
        
    });

    router.post("/", async (req, res) => {
        const ip = req.clientIp;
        console.log(`[${ip}] - POST /chat`);
        const loggedIn = req.session.loggedIn;
        const {message,date} = req.body;
        if(!loggedIn){
            res.send({error:true,status:"You are not logged in!",redirectURL:"/products"});
            return;
        }
        try {
            const user = req.session.user;
            const id = await db_messages.save({ message, date:date ,name: user.username, profilePhoto: user.profilePhoto, email: user.email }); //     // console.log('POST /products');
        } catch (error) {
            res.send({error:true,status:"DB error"});
            console.log(error);
            return;
        }
        res.send({error:false,status:"ok",redirectURL:"/chat"});
    });

    return router;
};
