const express = require("express");
const router_login = express.Router();

let passport = require("passport");

const { db_users } = require("../database/databases");
passport = require('../utils/passport.facebook')(passport,db_users)
passport = require('../utils/passport.local')(passport,db_users)

const {loggerWarnings,loggerErrors ,loggerDefault } = require('../utils/loggers');


passport.serializeUser((user, cb) => {
    return cb(null, user)
});

passport.deserializeUser((id, cb) => {
    return cb(null, id)
});

router_login.get("/login", (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /auth/login`);
    res.render("login.pug");
});

router_login.get("/signup", (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /auth/signup`);
    res.render("signup.pug");
});

router_login.post('/login',passport.authenticate('local-login',{successRedirect:"/",failureRedirect:"/auth/failLogin", failureFlash:true}));


router_login.post('/signup',passport.authenticate('local-signup',{successRedirect:"/",failureRedirect:"/auth/failLogin",failureFlash:true}));

router_login.post("/logout", (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - POST /auth/logout`);
    req.session.destroy((err) => {
        let result = null;
        if (!err) result = { error: false, status: "ok", redirectURL: "/products" };
        else result = { error: true, status: err };
        res.send(result);
    });
});

router_login.get("/failLogin", (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /auth/failLogin`);
    res.render("failLogin.pug", { errorMessage: req.flash("error") });
});

router_login.get("/facebook", passport.authenticate("facebook"));

// No logro hacer funcionar el failure redirect, busqué por todos lados pero nada
// Probé mil anternativas pero nada, sigue sin funcionar. 
// La única opción que encontré es hacer una strategy custom
router_login.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect:"/",
        failureRedirect: "/auth/failLogin",
        failureFlash: true
    })
);

module.exports = { router_login, passport };
