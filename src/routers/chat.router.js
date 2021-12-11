const express = require("express");
const router = express.Router();
const passportToStandardUser = require("../middlewares/passportToStandard");
const { db_messages } = require("../database/databases");
const {loggerWarnings,loggerErrors ,loggerDefault } = require('../utils/loggers');
const { showChat, newMessage } = require("../controllers/chat.controller");
function formatDate(date) {
    date_temp = new Date(date);
    hours = date_temp.getHours();
    minutes = date_temp.getMinutes();
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

router.get("/", passportToStandardUser,showChat);

router.post("/", passportToStandardUser, newMessage);

module.exports = {
    router_chat: router,
};
