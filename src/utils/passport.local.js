const bcrypt = require("bcrypt");
const { UserDto } = require("../database/dtos/user.dto");

module.exports = (passport, db_users) => {
    const {loggerWarnings,loggerErrors ,loggerDefault } = require('./loggers');
    const LocalStrategy = require("passport-local").Strategy;
    
    function isValidPassword(user, password) {
        return bcrypt.compareSync(password, user.password);
    }

    function createHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    }

    passport.use(
        "local-login",
        new LocalStrategy(async (username, password, done) => {
            let user = null;
            try {
                // This is used to avoid users being able to login to facebook users with local
                user = await db_users.getUserByUsername(username,"local");
            } catch (err) {
                loggerErrors.error("Error in login: " + err);
                return done(err);
            }
            if (!user) {
                const error = "User not found with username " + username;
                loggerErrors.error(error);
                return done(error, false);
            }

            if (!isValidPassword(user, password)) {
                const error = "Invalid Password";
                loggerErrors.error(error);
                return done(error, false);
            }
            return done(null, user);
        })
    );

    passport.use(
        "local-signup",
        new LocalStrategy(
            {
                passReqToCallback: true,
            },

            async (req, username, password, done) => {
                let user = null;
                const email = req.body.email
                try {
                    user = await db_users.getUserByUsernameOrEmail(username,email);;
                } catch (err) {
                    loggerErrors.error("Error in SignUp: " + err);
                    return done(err);
                }

                if (user) {
                    const error = "User already exists";
                    loggerErrors.error(error);
                    return done(error, false);
                }

                const newUser = new UserDto({
                    username:req.body.username,
                    email:req.body.email,
                    password:createHash(password),
                    profilePhoto:req.body.profilePhoto,
                    authMethod:"local",
                    firstName:req.body.firstName,
                    lastName:req.body.lastName
                });
                
                try {
                    await db_users.save(newUser);
                } catch (err) {
                    loggerErrors.error("Error in Saving user: " + err);
                    return done(err);
                }
                loggerDefault.info(newUser);
                loggerDefault.info("User Registration succesful");
                return done(null, newUser);
            }
        )
    );
    return passport;
};
