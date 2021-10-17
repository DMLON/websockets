const express = require("express");
const router_login = express.Router();

const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;


const dotenv = require("dotenv");
dotenv.config();

const { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID } = process.env;

passport.use(new FacebookStrategy({
    clientID:FACEBOOK_APP_ID,
    clientSecret:FACEBOOK_APP_SECRET,
    callbackURL:"/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'emails'],
    scope: ['email']
    },
    function(accessToken,refreshToken,profile,done){
        done(null,profile);
        //Asignar profile a variable
    }));

passport.serializeUser( (user, cb) => cb( null, user ) );

passport.deserializeUser( (id, cb) => cb( null, id ) );

router_login.get("/login", (req, res) => {
    const ip = req.clientIp;
    console.log(`[${ip}] - GET /auth/login`);
    res.render("login.pug");
});

router_login.post("/login", (req, res) => {
    const ip = req.clientIp;
    console.log(`[${ip}] - POST /auth/login`);
    const {username,email,profilePhoto} = req.body;
    req.session.loggedIn = true;
    const user = {
        username,
        email,
        profilePhoto
    }
    req.session.user = user;
    res.send({error:false,status: "ok"});
});

router_login.post("/logout", (req, res) => {
    const ip = req.clientIp;
    console.log(`[${ip}] - POST /auth/logout`);
    req.session.loggedIn = false;
    req.session.user = null;
    req.session.destroy(err=>{
        let result = null;
        if(!err) result = {error:false,status:"ok",redirectURL:"/products"}
        else result = {error:true,status:err}
        res.send(result);
    })
});

router_login.get("/facebook",passport.authenticate("facebook"));

router_login.get("/facebook/callback",passport.authenticate("facebook",{successRedirect:"/",failureRedirect:"/auth/login"}));

module.exports = {router_login,passport};
