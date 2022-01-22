const express = require("express");
const router_login = express.Router();

let passport = require("passport");
const { logout } = require("../controllers/login.controller");
const { getDao } = require("../database/daos/users.dao.factory");

const db_users = getDao()
passport = require('../utils/passport.facebook')(passport,db_users)
passport = require('../utils/passport.local')(passport,db_users)

const {loggerWarnings,loggerErrors ,loggerDefault } = require('../utils/loggers');


passport.serializeUser((user, cb) => {
    return cb(null, user.username)
});

passport.deserializeUser((username, cb) => {
    db_users.getUserByUsername(username,'local').then(res=>{
        return cb(null, username)
    })
    
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

router_login.post("/logout", logout);

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
