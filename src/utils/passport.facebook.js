const { UserDto } = require("../database/dtos/user.dto");


module.exports = (passport, db_users) => {
    const FacebookStrategy = require("@passport-next/passport-facebook").Strategy;
    const {loggerWarnings,loggerErrors ,loggerDefault } = require('./loggers');
    const config = require("../config");

    const { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID } = config;

    passport.use(
        new FacebookStrategy(
            {
                clientID: FACEBOOK_APP_ID,
                clientSecret: FACEBOOK_APP_SECRET,
                callbackURL: "/auth/facebook/callback",
                profileFields: ["id", "displayName", "photos", "emails"],
                scope: ["email"],
                graphApiVersion: "v2.5",
                passReqToCallback: true,
            },
            async function (req, accessToken, refreshToken, profile, done) {
                // No need to check password due to beign a facebook user
                let user = null;
                const email = profile.emails[0]?.value;
                try {
                    user = await db_users.getUserByEmail(email);
                } catch (err) {
                    loggerErrors.error("Error in SignUp: " + err);
                    return done(err);
                }

                if (user) {
                    loggerErrors.error("User already exists");
                    // here it's good that the user exists
                    return done(null, user);
                }
                const splittedName = profile.displayName.split(" ");

                const newUser = new UserDto({
                    username: profile.displayName,
                    email: email,
                    password: "",
                    profilePhoto: profile.photos[0]?.value,
                    authMethod: "facebook",
                    firstName: splittedName[0],
                    lastName: profile.displayName.split(" ").splice(1, splittedName.length),
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
