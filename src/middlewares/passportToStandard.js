


function passportToStandardUser(req,res,next){
    if("passport" in req.session){
        const user = req.session.passport.user
        req.session.loggedIn = true;
        req.session.user = {
            username:user.displayName,
            email:user.emails[0]?.value,
            profilePhoto:user.photos[0]?.value
        }
    }
    next();
}

module.exports = passportToStandardUser;