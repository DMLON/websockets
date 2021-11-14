const express = require("express");
const router = express.Router();
const passportToStandardUser = require("../middlewares/passportToStandard");
const { db_messages } = require("../database/databases");
const {loggerWarnings,loggerErrors ,loggerDefault } = require('../utils/loggers');
function formatDate(date) {
    date_temp = new Date(date);
    hours = date_temp.getHours();
    minutes = date_temp.getMinutes();
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

router.get("/", passportToStandardUser, async (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /chat`);
    const loggedIn = req.session.loggedIn;

    if (!loggedIn) {
        loggerDefault.info("User already logged");
        res.redirect("/");
        return;
    }

    const user = req.session.user;
    //Normalmente renderaria los primeros N mensajes y a medida que se scrolle obteneria más
    const messages = await db_messages.getAll();
    res.render("chat.pug", { loggedIn, user, messages, formatDate });
});

router.post("/", passportToStandardUser, async (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - POST /chat`);
    const loggedIn = req.session.loggedIn;
    const { message, date } = req.body;
    if (!loggedIn) {
        loggerErrors.error("User not logged");
        res.send({ error: true, status: "You are not logged in!", redirectURL: "/products" });
        return;
    }
    try {
        const user = req.session.user;
        const id = await db_messages.save({ message, date: date, name: user.username, profilePhoto: user.profilePhoto, email: user.email }); //     // console.log('POST /products');
    } catch (error) {
        res.send({ error: true, status: "DB error" });
        loggerErrors.error(error);
        return;
    }
    res.send({ error: false, status: "ok", redirectURL: "/chat" });
});

module.exports = {
    router_chat: router,
};
