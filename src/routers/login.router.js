const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
    const ip = req.clientIp;
    console.log(`[${ip}] - GET /auth/login`);
    res.render("login.pug");
});

router.post("/login", (req, res) => {
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

router.post("/logout", (req, res) => {
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

module.exports = router;
