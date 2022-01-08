const express = require("express");
const router = express.Router();
const passportToStandardUser = require("../middlewares/passportToStandard");
const { showChat, newMessage } = require("../controllers/chat.controller");

router.get("/", passportToStandardUser,showChat);

router.post("/", passportToStandardUser, newMessage);

module.exports = {
    router_chat: router,
};
