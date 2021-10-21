


function passportToStandardUser(req,res,next){
    if("passport" in req.session){
        req.session.loggedIn = true;
        req.session.user = req.session.passport.user;
    }
    next();
}

module.exports = passportToStandardUser;